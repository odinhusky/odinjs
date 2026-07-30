<template>
  <div class="p-4">
    <q-card ref="cardRef" class="mx-auto px-6 py-4 pb-[72px]">
      <q-form>
        <q-card-section class="space-y-4">
          <!-- 幣別選擇 -->
          <div class="mb-4 flex flex-wrap gap-3">
            <q-chip
              v-for="item in currencies"
              :key="item.value"
              clickable
              color="main-color"
              :outline="Number(item.value) !== Number(selectedCurrency)"
              :text-color="Number(item.value) === Number(selectedCurrency) ? 'white' : 'main-color'"
              class="max-w-full"
              :disable="isRiskLoading"
              @click="selectCurrency(Number(item.value))"
            >
              <span class="truncate">{{ t(item.label) }}</span>
            </q-chip>
          </div>

          <template v-if="riskForm && !isRiskLoading">
            <section class="space-y-4">
              <div class="flex items-center gap-3">
                <div class="shrink-0">{{ t("risk_control_settings.withdrawal_risk_control_toggle") }} :</div>
                <q-toggle
                  v-model="riskForm.is_enabled"
                  color="green"
                  :false-value="false"
                  :true-value="true"
                  keep-color
                />
              </div>

              <div class="flex flex-col gap-3">
                <div>{{ t("risk_control_settings.withdrawal_risk_control_conditions") }} :</div>
                <RiskConditionFields
                  :rules="riskForm.global_rules"
                  :options="riskConditionOptions"
                  @update:rules="onGlobalRulesUpdate"
                />
              </div>
            </section>

            <section class="mt-6 flex flex-col gap-3">
              <div>{{ t("risk_control_settings.additional.configuration.condition") }} :</div>
              <div class="text-sm text-red-500">※ {{ t("risk_control_settings.priority_note") }}</div>
              <q-option-group
                v-model="additionalConfigEnabled"
                :options="additionalConfigStatusOptions"
                color="main-color"
                inline
                dense
              />

              <div v-if="additionalConfigEnabled" class="flex flex-col gap-3">
                <div>{{ t("risk_control_settings.withdrawal.risk.control.member.type") }}</div>
                <q-table
                  :rows="riskForm.groups"
                  :columns="groupTableColumns"
                  :row-key="groupRowKey"
                  flat
                  bordered
                  hide-pagination
                  hide-no-data
                  :rows-per-page-options="[0]"
                  class="risk-control-group-table"
                >
                  <template #body-cell-levelAndTag="props">
                    <q-td :props="props" class="align-top">
                      <div :class="{ 'group-field-error': isGroupFieldInvalidForRow(props.row, 'levelAndTag') }">
                        <MemberLevelTagSelect
                          v-model:level-ids="props.row.level_ids"
                          v-model:label-ids="props.row.label_ids"
                          :excluded-level-ids="excludedByGroupId.get(props.row.id)?.levelIds ?? []"
                          :excluded-label-ids="excludedByGroupId.get(props.row.id)?.labelIds ?? []"
                        />
                        <div
                          v-if="isGroupFieldInvalidForRow(props.row, 'levelAndTag')"
                          class="mt-1 text-sm text-red-500"
                        >
                          {{ t("common.validate.mustNotBeEmpty") }}
                        </div>
                      </div>
                    </q-td>
                  </template>
                  <template #body-cell-conditions="props">
                    <q-td :props="props" class="align-top">
                      <div :class="{ 'group-field-error': isGroupFieldInvalidForRow(props.row, 'conditions') }">
                        <RiskConditionFields
                          :rules="props.row.rules"
                          :options="riskConditionOptions"
                          :show-conditions-error="isGroupFieldInvalidForRow(props.row, 'conditions')"
                          @update:rules="(rules) => updateGroupRules(props.row, rules)"
                        />
                      </div>
                    </q-td>
                  </template>
                </q-table>
                <div class="flex justify-center gap-3">
                  <q-btn outline color="main-color" icon="add" class="h-10 w-10 min-w-10 p-0" @click="addGroupRow" />
                  <q-btn
                    outline
                    color="negative"
                    icon="remove"
                    class="h-10 w-10 min-w-10 p-0"
                    :disable="!riskForm.groups.length"
                    @click="removeGroupRow"
                  />
                </div>
              </div>
            </section>
          </template>

          <div v-else-if="isRiskLoading" class="py-8 flex justify-center">
            <q-spinner color="main-color" size="2rem" />
          </div>
        </q-card-section>

        <q-card-actions
          class="fixed bottom-0 z-[2] flex justify-center gap-3 bg-white py-4 shadow-[0_-2px_8px_rgba(0,0,0,0.08)]"
          :style="controlBarStyle"
        >
          <q-btn
            outline
            color="main-color"
            class="h-11 w-48 text-base"
            :disable="!hasChanges || isRiskLoading"
            @click="onReset"
          >
            {{ t("btn.reset") }}
          </q-btn>
          <q-btn
            color="main-color"
            class="h-11 w-48 text-base"
            :disable="!canSave"
            :loading="isSetRiskPending"
            @click="onSave"
          >
            {{ t("btn.save") }}
          </q-btn>
        </q-card-actions>
      </q-form>
    </q-card>
  </div>
</template>

<script lang="ts" setup>
  import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue"
  import { useI18n } from "vue-i18n"
  import { useQuasar } from "quasar"
  import type { QTableProps } from "quasar"
  import { useQueryStore } from "@/stores/queryStore"
  import MemberLevelTagSelect from "./components/MemberLevelTagSelect.vue"
  import RiskConditionFields from "./components/RiskConditionFields.vue"
  import {
    areGroupsValid,
    buildExcludedByGroupId,
    defaultGlobalRules,
    defaultRiskForm,
    groupsFromPayload,
    isAmountThresholdInvalid,
    isGroupFieldInvalid,
    normalizeGlobalRules,
    normalizeRiskForm,
    RISK_CONDITION_I18N,
    RISK_CONDITION_KEYS,
    toGroupPayload,
    type RiskFormState
  } from "./riskControlForm"
  import {
    useSetWithdrawRiskMutation,
    useWithdrawRiskQuery,
    type SetWithdrawRiskRequest,
    type WithdrawRiskGlobalRules,
    type WithdrawRiskGroup,
    type WithdrawRiskGroupPayload
  } from "@/api/withdrawRisk"

  const $q = useQuasar()
  const { t } = useI18n()
  const queryStore = useQueryStore()
  const currencies = computed(() => queryStore.currencyList)
  const selectedCurrency = ref<number>(0)
  const riskForm = ref<RiskFormState | null>(null)
  const additionalConfigEnabled = ref(false)
  const savedSnapshot = ref("")

  const additionalConfigStatusOptions = computed(() => [
    { label: t("common.disabled"), value: false },
    { label: t("common.enabled"), value: true }
  ])

  const groupTableColumns = computed<QTableProps["columns"]>(() => [
    {
      name: "levelAndTag",
      label: t("risk_control_settings.column.level.and.tag"),
      field: "levelAndTag",
      align: "left",
      style: "width: calc(100% * 4 / 12)",
      headerStyle: "width: calc(100% * 4 / 12)"
    },
    {
      name: "conditions",
      label: t("risk_control_settings.column.risk.control.condition"),
      field: "conditions",
      align: "left",
      style: "width: calc(100% * 8 / 12)",
      headerStyle: "width: calc(100% * 8 / 12)"
    }
  ])

  const nextTempGroupId = ref(-1)
  const cardRef = ref<{ $el: HTMLElement } | null>(null)
  const controlBarWidth = ref(0)
  const controlBarLeft = ref(0)
  let resizeObserver: ResizeObserver | null = null

  const controlBarStyle = computed(() => ({
    width: `${controlBarWidth.value}px`,
    left: `${controlBarLeft.value}px`
  }))

  function updateControlBarPosition() {
    const element = cardRef.value?.$el
    if (!element) return
    const rect = element.getBoundingClientRect()
    controlBarWidth.value = rect.width
    controlBarLeft.value = rect.left
  }

  function setupControlBarObserver() {
    const element = cardRef.value?.$el
    if (!element) return

    updateControlBarPosition()
    resizeObserver?.disconnect()
    resizeObserver = new ResizeObserver(() => updateControlBarPosition())
    resizeObserver.observe(element)
  }

  function teardownControlBarObserver() {
    resizeObserver?.disconnect()
    resizeObserver = null
  }

  const excludedByGroupId = computed(() => buildExcludedByGroupId(riskForm.value?.groups ?? []))

  const riskConditionOptions = computed(() =>
    RISK_CONDITION_KEYS.map((value) => ({
      label: t(RISK_CONDITION_I18N[value]),
      value
    }))
  )

  function buildSetRiskPayload(form: RiskFormState): SetWithdrawRiskRequest {
    return {
      currency_id: form.currency_id,
      is_enabled: form.is_enabled,
      global_rules: normalizeGlobalRules(form.global_rules),
      groups: additionalConfigEnabled.value ? form.groups.map(toGroupPayload) : []
    }
  }

  function snapshotForm(form: RiskFormState): string {
    return JSON.stringify(buildSetRiskPayload(form))
  }

  function createDefaultGroup(): WithdrawRiskGroup {
    nextTempGroupId.value -= 1
    return {
      id: nextTempGroupId.value,
      level_ids: [],
      label_ids: [],
      rules: defaultGlobalRules()
    }
  }

  function groupRowKey(row: WithdrawRiskGroup) {
    return row.id
  }

  function isGroupFieldInvalidForRow(group: WithdrawRiskGroup, field: "levelAndTag" | "conditions") {
    return isGroupFieldInvalid(group, field, additionalConfigEnabled.value)
  }

  function onGlobalRulesUpdate(rules: WithdrawRiskGlobalRules) {
    if (!riskForm.value) return
    riskForm.value.global_rules = rules
  }

  function updateGroupRules(group: WithdrawRiskGroup, rules: WithdrawRiskGlobalRules) {
    group.rules = rules
  }

  function addGroupRow() {
    if (!riskForm.value) return
    riskForm.value.groups.push(createDefaultGroup())
  }

  function removeGroupRow() {
    if (!riskForm.value?.groups.length) return
    riskForm.value.groups.pop()
  }

  const riskQuery = useWithdrawRiskQuery(selectedCurrency)
  const { data: riskQueryData, isLoading: isRiskLoading, isError: isRiskError, error: riskQueryError } = riskQuery
  const setRiskMutation = useSetWithdrawRiskMutation()
  const { isPending: isSetRiskPending } = setRiskMutation

  function notify(type: "positive" | "negative", message: string) {
    $q.notify({ type, message, position: "top", timeout: 300 })
  }

  function applyRiskForm(form: RiskFormState) {
    riskForm.value = form
    additionalConfigEnabled.value = form.groups.length > 0
    savedSnapshot.value = snapshotForm(form)
  }

  const hasChanges = computed(() => {
    if (!riskForm.value || !savedSnapshot.value) return false
    return snapshotForm(riskForm.value) !== savedSnapshot.value
  })

  const canSave = computed(() => {
    if (!hasChanges.value || isRiskLoading.value || !riskForm.value) return false
    if (isAmountThresholdInvalid(riskForm.value.global_rules)) return false
    if (additionalConfigEnabled.value && !areGroupsValid(riskForm.value.groups)) return false
    return true
  })

  watch(additionalConfigEnabled, (enabled) => {
    if (enabled || !riskForm.value) return
    riskForm.value.groups = []
  })

  onBeforeUnmount(() => {
    window.removeEventListener("resize", updateControlBarPosition)
    teardownControlBarObserver()
  })

  watch(
    () => [riskQueryData.value, isRiskError.value, riskQueryError.value, selectedCurrency.value] as const,
    ([data, isError, error, currencyId]) => {
      if (!currencyId || isRiskLoading.value) return

      if (isError) {
        const message = error instanceof Error ? error.message : t("message.request_failed")
        notify("negative", message)
        applyRiskForm(defaultRiskForm(currencyId))
        return
      }

      if (data) {
        applyRiskForm(normalizeRiskForm(data))
      }
    }
  )

  const selectCurrency = (value: number) => {
    if (Number(value) === Number(selectedCurrency.value)) return
    selectedCurrency.value = value
  }

  onMounted(async () => {
    window.addEventListener("resize", updateControlBarPosition)

    try {
      await Promise.all([queryStore.getCurrencyList(), queryStore.getMemberLevel(), queryStore.getMemberTag()])
      if (!currencies.value.length) return

      selectedCurrency.value = Number(currencies.value[0].value)
    } catch (error) {
      notify("negative", t("message.request_failed"))
      console.log("Error Response:", error)
    }

    nextTick(() => setupControlBarObserver())
  })

  function onReset() {
    if (!hasChanges.value || !savedSnapshot.value) return

    const payload = JSON.parse(savedSnapshot.value) as SetWithdrawRiskRequest
    nextTempGroupId.value = payload.groups.length > 0 ? -payload.groups.length : -1
    applyRiskForm({
      currency_id: payload.currency_id,
      is_enabled: payload.is_enabled,
      global_rules: normalizeGlobalRules(payload.global_rules),
      groups: groupsFromPayload(payload.groups)
    })
  }

  function onSave() {
    if (!riskForm.value || !hasChanges.value) return

    if (isAmountThresholdInvalid(riskForm.value.global_rules)) {
      notify("negative", t("common.validate.mustNotBeEmpty"))
      return
    }

    if (additionalConfigEnabled.value && !areGroupsValid(riskForm.value.groups)) {
      notify("negative", t("common.validate.mustNotBeEmpty"))
      return
    }

    setRiskMutation.mutate(buildSetRiskPayload(riskForm.value), {
      onSuccess: () => {
        savedSnapshot.value = snapshotForm(riskForm.value!)
        notify("positive", t("message.edit_success"))
      },
      onError: (error) => {
        const message = error instanceof Error ? error.message : t("message.request_failed")
        notify("negative", message)
        console.log("Error Response:", error)
      }
    })
  }
</script>

<style scoped lang="scss">
  .risk-control-group-table {
    :deep(table) {
      table-layout: fixed;
      width: 100%;
    }
  }

  .group-field-error {
    :deep(.el-select__wrapper),
    :deep(.q-field__control) {
      border-color: #c10015;
    }
  }
</style>
