<template>
  <div class="q-pa-md" v-if="permission.view">
    <div v-if="!showPanel">
      <div>
        <div class="text-h6 q-mb-md">{{ $t("menu.dns_settings") }}</div>
        <div class="row items-center q-mb-md q-gutter-sm">
          <q-btn color="primary" icon="add" @click="handleAdd" :disable="!permission.edit || isLoading || spinShow">
            {{ $t("btn.add") }}
          </q-btn>
          <q-btn
            color="negative"
            icon="delete"
            @click="handleDelete"
            :disable="!permission.edit || selected.length === 0 || isLoading || spinShow"
          >
            {{ $t("common.delete") }}
            <template v-if="selected.length > 0">({{ selected.length }})</template>
          </q-btn>
        </div>
        <q-table
          square
          hide-pagination
          hide-selected-banner
          :rows-per-page-options="[0]"
          :rows="dataSource"
          :columns="columns"
          :visible-columns="visibleColumns"
          :loading="isLoading || spinShow"
          row-key="domain_name"
          table-header-class="bg-success"
          v-model:selected="selected"
          selection="multiple"
        >
          <template #loading>
            <q-inner-loading showing color="primary" />
          </template>
          <template #body-cell-cname_name="props">
            <q-td :props="props" class="text-center">
              <CopyableTextCell :value="props.row.cname_name" :showTooltip="true" :showCopy="true" :width="200" />
            </q-td>
          </template>
          <template #body-cell-cname_value="props">
            <q-td :props="props" class="text-center">
              <CopyableTextCell :value="props.row.cname_value" :showTooltip="true" :showCopy="true" :width="250" />
            </q-td>
          </template>
          <template #no-data>
            <div class="full-width row flex-center q-gutter-sm">
              {{ $t("common.no_data") }}
            </div>
          </template>
        </q-table>
      </div>
    </div>
    <DNSSettingsPanel v-if="showPanel" :initial-values="initialValues" @saved="handleSaved" @cancel="handleCancel" />
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed, onMounted, provide } from "vue"
  import { useI18n } from "vue-i18n"
  import { QTableProps } from "quasar"
  import { useSearch } from "@/hook/useSearch"
  import { usePermission } from "@/hook/usePermission"
  import { getDnsDomainList, getCdnStatus } from "@/api/dns"
  import type * as Response from "@/api/response.type"
  import DNSSettingsPanel from "./Panel.vue"
  import CopyableTextCell from "./components/CopyableTextCell.vue"

  const { t } = useI18n()
  const { permission } = usePermission()
  const isLoading = ref(false)
  const showPanel = ref(false)
  const selected = ref<Response.DnsDomainItem[]>([])
  const initialValues = ref<Response.DnsDomainItem[]>([])
  const externalCdn = ref<boolean>(false)

  provide("externalCdn", externalCdn)

  const columns = computed<QTableProps["columns"]>(() => [
    {
      name: "domain_name",
      label: t("dns_settings.domain_name"),
      field: "domain_name",
      align: "center" as const
    },
    {
      name: "primary_domain",
      label: t("dns_settings.primary_domain"),
      field: "primary_domain",
      align: "center" as const
    },
    {
      name: "cdn_point",
      label: t("dns_settings.cdn_point"),
      field: "cdn_point",
      align: "center" as const
    },
    {
      name: "cname_name",
      label: t("dns_settings.cname_name"),
      field: "cname_name",
      align: "center" as const
    },
    {
      name: "cname_value",
      label: t("dns_settings.cname_value"),
      field: "cname_value",
      align: "center" as const
    }
  ])

  // 根據 external_cdn 決定是否顯示 cdn_point 欄位
  // externalCdn 為 true：顯示 primary_domain，不顯示 cdn_point
  // externalCdn 為 false：顯示 cdn_point，不顯示 primary_domain
  const visibleColumns = computed<string[]>(() => {
    const baseColumns = ["domain_name", "cname_name", "cname_value"]
    if (externalCdn.value) {
      return [...baseColumns, "primary_domain"]
    } else {
      return [...baseColumns, "cdn_point"]
    }
  })

  const { search, tableData, spinShow } = useSearch(getDnsDomainList)

  const dataSource = computed(() => {
    if (Array.isArray(tableData.value)) {
      return tableData.value
    }
    return []
  })

  const handleAdd = () => {
    initialValues.value = [...dataSource.value]
    showPanel.value = true
  }

  const handleSaved = () => {
    showPanel.value = false
    selected.value = []
    initialValues.value = []
    search()
  }

  const handleCancel = () => {
    showPanel.value = false
    selected.value = []
    initialValues.value = []
    search()
  }

  const handleDelete = () => {
    const selectedDomains = selected.value.map((row) => row.domain_name)
    const remainingItems = dataSource.value.filter(
      (item: Response.DnsDomainItem) => !selectedDomains.includes(item.domain_name)
    )
    initialValues.value = [...remainingItems]
    showPanel.value = true
    selected.value = []
  }

  onMounted(async () => {
    isLoading.value = true
    try {
      await Promise.all([
        search(),
        getCdnStatus().then((response) => {
          if (response?.data) {
            externalCdn.value = response.data.external_cdn ?? false
          }
        })
      ])
    } catch (error) {
      console.error("Failed to load DNS settings:", error)
    } finally {
      isLoading.value = false
    }
  })
</script>
