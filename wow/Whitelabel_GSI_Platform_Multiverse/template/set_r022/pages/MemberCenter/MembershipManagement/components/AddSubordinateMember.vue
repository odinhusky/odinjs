<template>
  <div class="add-subordinate-member-area">
    <div class="add-subordinate-member-header">
      <button
        type="button"
        class="back-btn"
        :data-back-icon="backBtnImg"
        @click="memberManagementStore.handlerBackAddSubordinateMember()"
      >
        <q-icon name="chevron_left" class="back-btn-icon" />
        <span class="back-btn-text">{{ $t("common.btn.back") }}</span>
      </button>
      <div class="add-subordinate-member-header__title">
        <span class="add-subordinate-member-header__bar" />
        <span>{{ $t("member.basicInfo.settings") }}</span>
      </div>
    </div>

    <div class="data-area">
      <!-- 步驟指示器 -->
      <div class="step-indicator">
        <template v-for="i in 3" :key="i">
          <div class="step-circle" :class="{ active: step === i, finish: step > i }">
            <q-icon v-if="step > i" name="check" class="step-circle-icon" />
            <q-icon v-else-if="step === i" name="edit" class="step-circle-icon" />
            <span v-else>{{ i }}</span>
          </div>

          <div v-if="i < 3" class="step-line" :class="{ active: step > i }" />
        </template>
      </div>

      <!-- 步驟內容區域 -->
      <div class="step-content">
        <div v-if="step === 1" class="step-1">
          <!-- 標題 -->
          <div class="setting-section-area">
            <div class="setting-section">
              <div class="setting-label required">
                {{ $t("member.membershipManagement.enable") }}/{{ $t("member.membershipManagement.disable") }}
              </div>
              <q-toggle
                v-model="memberManagementStore.memberAgentCustomizeColumnData.is_enabled"
                dense
                keep-color
                color="primary"
                class="account-toggle"
                :label="
                  memberManagementStore.memberAgentCustomizeColumnData.is_enabled
                    ? $t('common.enable')
                    : $t('common.disable')
                "
              />
            </div>

            <div class="setting-section">
              <div class="setting-label required">{{ $t("member.membershipManagement.agentIdentity") }}</div>
              <q-toggle
                v-model="memberManagementStore.memberAgentCustomizeColumnData.is_member_agent"
                dense
                keep-color
                color="primary"
                class="account-toggle"
                :label="
                  memberManagementStore.memberAgentCustomizeColumnData.is_member_agent
                    ? $t('common.enable')
                    : $t('common.disable')
                "
              />
            </div>

            <div class="setting-section">
              <div class="setting-label required">{{ $t("tableHeader.status") }}</div>
              <q-toggle
                v-model="memberManagementStore.memberAgentCustomizeColumnData.is_blocked"
                dense
                keep-color
                color="primary"
                class="account-toggle"
                :label="
                  memberManagementStore.memberAgentCustomizeColumnData.is_blocked
                    ? $t('member.membershipManagement.frozen')
                    : $t('member.membershipManagement.unfrozen')
                "
              />
            </div>
          </div>

          <div class="input-section">
            <template v-for="(item, index) in memberManagementStore.memberAgentCustomizeColumn" :key="index">
              <div v-if="item.column_name !== 'country'" class="input-group">
                <div class="input-label" :class="{ required: isColumnRequired(item) }">
                  {{ $t(memberColumnPlaceholderI18n?.[item.column_name] ?? item.column_name) }}
                </div>

                <div v-if="item.type === INPUT_TYPE.Enums.INPUT" class="w-full flex flex-nowrap gap-2">
                  <q-select
                    v-if="memberManagementStore.hasCountry && item.column_name === 'phone'"
                    v-model="memberManagementStore.memberAgentCustomizeColumnData['country']"
                    :options="memberManagementStore.hasCountry.values"
                    emit-value
                    map-options
                    dense
                    borderless
                    :disable="!item.edit"
                    :rules="item.required ? [Rules.required()] : []"
                    class="input-style !w-20 shrink-0"
                  />

                  <q-input
                    v-model="memberManagementStore.memberAgentCustomizeColumnData[item.column_name]"
                    dense
                    borderless
                    :disable="!item.edit"
                    :rules="getInputRules(item)"
                    class="input-style"
                  >
                  </q-input>
                </div>

                <template v-else-if="item.type === INPUT_TYPE.Enums.SELECT && item.column_name !== 'country'">
                  <q-select
                    v-if="item.column_name === 'ref_account'"
                    v-model="memberManagementStore.memberAgentCustomizeColumnData[item.column_name]"
                    :options="memberManagementStore.memberAgentReferralList"
                    :option-value="(option) => option.label"
                    emit-value
                    map-options
                    dense
                    borderless
                    :disable="!item.edit"
                    :rules="item.required ? [Rules.required()] : []"
                    class="input-style"
                  />

                  <q-select
                    v-else
                    v-model="memberManagementStore.memberAgentCustomizeColumnData[item.column_name]"
                    :options="item.values"
                    emit-value
                    map-options
                    dense
                    borderless
                    :disable="!item.edit"
                    :rules="item.required ? [Rules.required()] : []"
                    class="input-style"
                  />
                </template>

                <q-input
                  v-else-if="item.type === INPUT_TYPE.Enums.DATE"
                  v-model="memberManagementStore.memberAgentCustomizeColumnData[item.column_name]"
                  dense
                  borderless
                  readonly
                  :rules="item.required ? [Rules.required()] : []"
                  :disable="!item.edit"
                  class="input-style"
                >
                  <q-menu>
                    <q-date
                      v-model="memberManagementStore.memberAgentCustomizeColumnData[item.column_name]"
                      mask="YYYY-MM-DD"
                      minimal
                      color="primary"
                    />
                  </q-menu>
                </q-input>
              </div>
            </template>
          </div>
        </div>

        <div v-else-if="step === 2" class="step-2">
          <!-- 標題 -->
          <div class="step-title">{{ $t("member.membershipManagement.selectMemberTag") }}</div>

          <div class="tag-selection-title">
            {{ $t("member.membershipManagement.tagSelection") }}
          </div>

          <div class="tag-selection-area">
            <div
              class="tag-selection-item"
              :class="{ 'tag-selection-item--wide': isWideTagOption(item.name) }"
              v-for="item in memberManagementStore.memberAgentTagList"
              :key="item.id"
            >
              <button
                type="button"
                class="tag-selection-button"
                :class="{ 'tag-selection-button--checked': item.checked }"
                :aria-pressed="item.checked"
                @click="toggleTagOption(item)"
              >
                {{ item.name }}
              </button>
            </div>
          </div>
        </div>

        <div v-else-if="step === 3" class="step-3">
          <!-- 標題 -->
          <div class="step-title">{{ $t("member.membershipManagement.done") }}</div>

          <div class="success-mark">
            <q-icon name="check" />
          </div>
        </div>
      </div>

      <!-- 上下部按鈕 -->
      <div class="step-navigation">
        <q-btn v-if="step > 1 && step < 3" @click="step--" outline class="nav-btn previous">
          {{ $t("member.membershipManagement.previousStep") }}
        </q-btn>
        <q-btn v-if="step < 3" @click="handleNextStep" class="nav-btn">
          {{ $t("member.membershipManagement.nextStep") }}
        </q-btn>
        <q-btn v-if="step === 3" @click="memberManagementStore.handlerBackAddSubordinateMember()" class="nav-btn">
          {{ $t("member.membershipManagement.complete") }}
        </q-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useSiteImg } from "app/template/set_r022/hooks/useSiteImg"
import { useQuasar } from "quasar"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useRule } from "src/common/hooks/useRule"
import { INPUT_TYPE } from "src/common/utils/constants"
import { useMemberManagement } from "src/stores/useMemberManagement"
import { onMounted, ref } from "vue"
import { useI18n } from "vue-i18n"

type CustomizeColumn = {
  column_name: string
  required?: boolean
}

type TagOption = {
  checked?: boolean
  name?: string
}

const { backBtnImg } = useSiteImg()
const memberManagementStore = useMemberManagement()
const { memberColumnPlaceholderI18n } = useUserInfo()
const Rules = useRule()
const $q = useQuasar()
const { t } = useI18n()

const step = ref(1)
const forceRequiredColumns = ["account", "password"]

const isColumnRequired = (item: CustomizeColumn) =>
  Boolean(item.required || forceRequiredColumns.includes(item.column_name))

const getInputRules = (item: CustomizeColumn) => {
  if (item.column_name === "account") {
    return [Rules.required(), Rules.noWhitespace()]
  }

  if (item.column_name === "password") {
    return [Rules.required()]
  }

  return item.required ? [Rules.required()] : []
}

const getDisplayLength = (value?: string) =>
  Array.from(value ?? "").reduce((total, char) => total + (/[\u4e00-\u9fff]/.test(char) ? 2 : 1), 0)

const isWideTagOption = (name?: string) => getDisplayLength(name) > 18

const toggleTagOption = (item: TagOption) => {
  item.checked = !item.checked
}

const checkForceRequiredFields = () => {
  const hasEmptyForceRequiredField = forceRequiredColumns.some((columnName) => {
    const targetColumn = memberManagementStore.memberAgentCustomizeColumn.find(
      (item) => item.column_name === columnName
    )

    if (!targetColumn) return false

    return !memberManagementStore.memberAgentCustomizeColumnData[columnName]
  })

  if (!hasEmptyForceRequiredField) return true

  $q.notify({
    type: "negative",
    position: "top",
    message: t("common.validate.mustNotBeEmpty"),
    icon: "warning",
    timeout: 1000,
  })

  return false
}

const handleNextStep = async () => {
  if (step.value === 1) {
    // 確認required欄位是否填寫
    if (!checkForceRequiredFields()) return
    if (!memberManagementStore.checkRequiredFields()) return
    step.value++
  } else if (step.value === 2) {
    let status

    if (memberManagementStore.memberAgentCustomizeColumnId) {
      status = await memberManagementStore.handlerUpdateMemberAgent()
    } else {
      status = await memberManagementStore.handlerCreateMemberAgent()
    }

    if (status) {
      step.value++
    }
  }
}

onMounted(async () => {
  await memberManagementStore.handlerOnMountedAddSubordinateMember()
})
</script>

<style lang="scss" scoped>
@import "app/template/set_r022/assets/css/membershipManagement.scss";
</style>
