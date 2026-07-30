<template>
  <div class="q-mt-md">
    <div class="text-[18px] font-bold q-mb-sm">{{ $t("dns_settings.config_settings_info") }}</div>
    <div class="bg-[#FCF8FF] p-5 flex flex-col gap-5">
      <div v-if="showApplicationNotSubmitted" class="text-center text-gray-500">
        {{ $t("dns_settings.applicationNotSubmitted") }}
      </div>
      <div v-for="(item, index) in configList" :key="index" class="flex flex-col gap-2.5">
        <template v-for="column in columns" :key="column.field">
          <div v-if="column.display" class="flex items-center">
            <span class="text-sm w-32">{{ column.label }}</span>
            <CopyableTextCell
              :value="item[column.field as keyof typeof item]"
              :show-copy="true"
              :show-tooltip="column.showTooltip"
              :width="column.width"
            />
          </div>
        </template>
        <q-separator v-if="index < configList.length - 1" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { inject, computed, ref, type Ref } from "vue"
  import { useI18n } from "vue-i18n"
  import type * as Response from "@/api/response.type"
  import CopyableTextCell from "./CopyableTextCell.vue"

  const props = defineProps<{
    configList: Response.DnsDomainItem[]
    hasContentChanged?: boolean
    isApplying?: boolean
  }>()

  const externalCdnRef = inject<Ref<boolean>>("externalCdn", ref(false))
  const externalCdn = computed(() => externalCdnRef.value)

  const { t } = useI18n()

  // 顯示「尚未發送域名申請」的條件:內容有變動(與已申請結果不一致) 且 不在申請中
  const showApplicationNotSubmitted = computed(() => props.hasContentChanged === true && !props.isApplying)

  interface Column {
    label: string
    field: keyof Response.DnsDomainItem
    showCopy: boolean
    showTooltip: boolean
    display: boolean
    width?: number
  }

  const columns = computed<Column[]>(() => [
    {
      label: t("dns_settings.domain_name"),
      field: "domain_name",
      showCopy: true,
      showTooltip: false,
      display: true
    },
    {
      label: t("dns_settings.cdn_point"),
      field: "cdn_point",
      showCopy: true,
      showTooltip: false,
      display: !externalCdn.value
    },
    {
      label: t("dns_settings.cname_name"),
      field: "cname_name",
      showCopy: true,
      showTooltip: true,
      width: 200,
      display: true
    },
    {
      label: t("dns_settings.cname_value"),
      field: "cname_value",
      showCopy: true,
      showTooltip: true,
      width: 200,
      display: true
    }
  ])
</script>
