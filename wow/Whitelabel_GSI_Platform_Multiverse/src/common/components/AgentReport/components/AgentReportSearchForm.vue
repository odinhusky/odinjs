<template>
  <q-form :class="formClass" @submit.prevent="report.handlerSearchAgentReport">
    <div v-if="report.agentReportCurrencyList?.length > 1" :class="currencySectionClass">
      <AgentReportCurrencyField :variant="variant" />
    </div>

    <template v-if="variant === 'desktop'">
      <div class="search-form-row">
        <div class="search-item">
          <div class="search-item-label">{{ $t("member.profile.date") }}</div>
          <q-input
            :model-value="report.formattedDateRange"
            :placeholder="$t('placeholder.pleaseSelectDate')"
            readonly
            dense
            outlined
            hide-bottom-space
            class="agent-report__date-input agent-report__date-input--outlined agent-report__date-input--desktop-range"
          >
            <template v-slot:append>
              <q-icon name="calendar_month" />
            </template>
            <q-menu ref="desktopMenuRef" @show="datePickerShow = true" @hide="datePickerShow = false">
              <q-date
                :model-value="report.dateRange"
                mask="YYYY-MM-DD"
                range
                color="primary"
                minimal
                @range-end="hideDesktopMenu"
                @update:model-value="report.updateDateRange"
              />
            </q-menu>
          </q-input>
        </div>

        <div class="search-item">
          <q-btn-toggle
            v-model="report.dateType"
            no-caps
            unelevated
            toggle-color="primary"
            class="toggle-date-picker font agent-report__date-toggle"
            :options="report.dayTypeTabs"
          />
        </div>

        <q-btn
          :label="$t('common.btn.search')"
          text-color="white"
          unelevated
          class="agent-report__search-btn search-btn"
          type="submit"
          :loading="report.isSearching"
        />
      </div>
    </template>

    <template v-else>
      <div class="flex flex-col items-center w-full">
        <div class="flex flex-col items-stretch w-full mb-5 text-sm">
          <div class="agent-report__field-label mb-1.5 w-full">
            {{ $t("tableHeader.startDate") }}
          </div>
          <q-input
            :model-value="report.formattedStartDate"
            :placeholder="$t('placeholder.pleaseSelectDate')"
            readonly
            dense
            outlined
            hide-bottom-space
            class="agent-report__date-input agent-report__date-input--outlined w-full"
          >
            <template v-slot:append>
              <q-icon name="calendar_month" />
            </template>
            <q-menu>
              <q-date
                v-model="report.dateRange.from"
                mask="YYYY-MM-DD"
                color="primary"
                minimal
                @update:model-value="report.clearDateTypePreset()"
              />
            </q-menu>
          </q-input>
        </div>

        <div class="flex flex-col items-stretch w-full mb-5 text-sm">
          <div class="agent-report__field-label mb-1.5 w-full">
            {{ $t("tableHeader.endDate") }}
          </div>
          <q-input
            :model-value="report.formattedEndDate"
            :placeholder="$t('placeholder.pleaseSelectDate')"
            readonly
            dense
            outlined
            hide-bottom-space
            class="agent-report__date-input agent-report__date-input--outlined w-full"
          >
            <template v-slot:append>
              <q-icon name="calendar_month" />
            </template>
            <q-menu>
              <q-date
                v-model="report.dateRange.to"
                mask="YYYY-MM-DD"
                color="primary"
                minimal
                @update:model-value="report.clearDateTypePreset()"
              />
            </q-menu>
          </q-input>
        </div>

        <div class="flex flex-col items-stretch w-full mb-5 text-sm">
          <q-btn-toggle
            v-model="report.dateType"
            no-caps
            unelevated
            toggle-color="primary"
            class="agent-report__date-toggle w-full my-2"
            :options="report.dayTypeTabs"
          />
        </div>

        <q-btn
          :label="$t('common.btn.search')"
          text-color="white"
          unelevated
          class="agent-report__search-btn w-full"
          type="submit"
          :loading="report.isSearching"
        />
      </div>
    </template>
  </q-form>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue"
import { useAgentReportContext } from "../useAgentReportContext"
import AgentReportCurrencyField from "./AgentReportCurrencyField.vue"

const props = defineProps<{
  variant: "desktop" | "mobile"
}>()

const report = useAgentReportContext()
const datePickerShow = ref(false)
const desktopMenuRef = ref<{ hide: () => void } | null>(null)

const formClass = computed(() => (props.variant === "desktop" ? "search-form w-full" : "w-full mb-5"))

const currencySectionClass = computed(() =>
  props.variant === "desktop"
    ? "flex items-center justify-start mb-5 max-md:flex-col max-md:items-center max-md:mb-0"
    : "flex flex-col items-stretch w-full mb-5"
)

const hideDesktopMenu = () => {
  desktopMenuRef.value?.hide()
}
</script>
