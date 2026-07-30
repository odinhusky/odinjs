<template>
  <HeaderTitleBack v-if="isLargeTablet" variant="setR022" :title-i18n="'menu.freeSpin'">
    <div class="freespin-page h5">
      <div class="freespin-container">
        <!-- 篩選器 -->
        <!-- <div class="filter-section">
          <div class="filter-row">
            <div class="filter-item">
              <label class="filter-label">{{ $t("member.account") }}</label>
              <q-input
                v-model="filterAccount"
                outlined
                dense
                :placeholder="$t('common.placeholder.input')"
                class="filter-input"
              />
            </div>
            <div class="filter-item">
              <label class="filter-label">{{ $t("tableHeader.currency") }}</label>
              <q-select
                v-model="filterCurrency"
                :options="currencyOptions"
                outlined
                dense
                emit-value
                map-options
                :placeholder="$t('common.placeholder.input')"
                class="filter-input"
              />
            </div>
          </div>
          <div class="filter-row">
            <div class="filter-item full-width">
              <label class="filter-label">{{ $t("tableHeader.status") }}</label>
              <q-select
                v-model="filterStatus"
                :options="statusOptions"
                outlined
                dense
                emit-value
                map-options
                :placeholder="$t('common.placeholder.input')"
                class="filter-input"
              />
            </div>
          </div>
          <q-btn class="search-btn" :label="$t('common.btn.search')" @click="handleSearch" />
        </div> -->

        <div v-if="filteredList.length > 0" class="card-list">
          <q-expansion-item
            v-for="(item, index) in paginatedList"
            :key="index"
            class="freespin-card"
            expand-icon-class="expand-icon"
          >
            <template v-slot:header>
              <div class="card-header">
                <div class="card-header-left">
                  <div class="product-name">{{ item.product_name }}</div>
                  <div class="product-label">{{ $t("tableHeader.product") }}</div>
                </div>
                <div class="card-header-right">
                  <div class="game-name">{{ item.game_name }}</div>
                  <div class="game-label">{{ $t("home.game") }}</div>
                </div>
              </div>
            </template>
            <div class="card-content">
              <div class="content-row">
                <span class="content-label">{{ $t("member.free_spin_rounds") }}</span>
                <span class="content-value">{{ item.rounds }}</span>
              </div>
              <div class="content-row">
                <span class="content-label">{{ $t("tableHeader.operating") }}</span>
                <q-btn class="go-btn" dense :label="$t('common.btn.go')" @click="handleFreeSpinLaunchClick(item)" />
              </div>
            </div>
          </q-expansion-item>
          <div class="pagination-wrapper">
            <q-pagination v-model="currentPage" :max="totalPages" :max-pages="5" direction-links boundary-numbers />
          </div>
        </div>
        <div v-else class="no-data">{{ $t("tableHeader.no_data") }}</div>
      </div>
    </div>
  </HeaderTitleBack>

  <div v-else class="freespin-page pc">
    <div class="freespin-header">
      <h1 class="page-title">{{ $t("menu.freeSpin") }}</h1>
    </div>
    <div class="freespin-body">
      <div v-if="freeSpinList.list.length > 0" class="tables">
        <q-table
          :rows="paginatedList"
          :columns="tableColumns"
          hide-bottom
          :pagination="{ rowsPerPage: 0 }"
          flat
          bordered
        >
          <template v-slot:header="props">
            <q-tr :props="props" class="table-header">
              <q-th v-for="col in props.cols" :key="col.name" :props="props">
                {{ col.label }}
              </q-th>
            </q-tr>
          </template>
          <template v-slot:body-cell-action="props">
            <q-td :props="props" class="text-center">
              <q-btn class="go-btn" dense :label="$t('common.btn.go')" @click="handleFreeSpinLaunchClick(props.row)" />
            </q-td>
          </template>
        </q-table>
        <div class="pagination-wrapper">
          <q-pagination v-model="currentPage" :max="totalPages" :max-pages="7" direction-links boundary-numbers />
        </div>
      </div>
      <div v-else class="no-data">{{ $t("tableHeader.no_data") }}</div>
    </div>
  </div>

  <LaunchGameDialog />
</template>

<script lang="ts" setup>
import { useQuasar } from "quasar"
import { computed, ref, onMounted } from "vue"
import { useI18n } from "vue-i18n"
import HeaderTitleBack from "src/common/components/modal/HeaderTitleBack.vue"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { useFreeSpin } from "src/common/composables/useFreeSpin"
import LaunchGameDialog from "src/common/components/dialog/LaunchGame.vue"

const $q = useQuasar()
const { t } = useI18n()
const { isLargeTablet } = useMediaQuery()

const { freeSpinList, handleFreeSpinLaunchClick } = useFreeSpin()

// 篩選器
const filterAccount = ref("")
const filterCurrency = ref(null)
const filterStatus = ref(null)
const isFiltering = ref(false)

// 幣別選項（從資料中動態生成）
const currencyOptions = computed(() => {
  const currencies = [...new Set(freeSpinList.list.map((item) => item.currency_code))]
  return currencies.map((code) => ({ label: code, value: code }))
})

// 狀態選項
const statusOptions = computed(() => [
  { label: t("common.all"), value: null },
  { label: t("common.status.active"), value: "active" },
  { label: t("common.status.inactive"), value: "inactive" }
])

// 篩選後的列表
const filteredList = computed(() => {
  if (!isFiltering.value) return freeSpinList.list

  return freeSpinList.list.filter((item) => {
    if (filterAccount.value && !item.game_name?.toLowerCase().includes(filterAccount.value.toLowerCase())) {
      return false
    }
    if (filterCurrency.value && item.currency_code !== filterCurrency.value) {
      return false
    }
    return true
  })
})

// 搜尋按鈕點擊
const handleSearch = () => {
  isFiltering.value = true
  currentPage.value = 1
}

// 分頁設定
const currentPage = ref(1)
const itemsPerPage = 8

const totalPages = computed(() => {
  return Math.ceil(filteredList.value.length / itemsPerPage) || 1
})

const paginatedList = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredList.value.slice(start, end)
})

// PC 表格欄位
const tableColumns = computed(() => [
  { name: "product_name", label: t("tableHeader.product"), field: "product_name", align: "center" as const },
  { name: "game_name", label: t("home.game"), field: "game_name", align: "center" as const },
  { name: "rounds", label: t("member.free_spin_rounds"), field: "rounds", align: "center" as const },
  { name: "action", label: t("tableHeader.operating"), field: "action", align: "center" as const }
])

// Mobile 表格欄位
const mobileColumns = computed(() => [
  { name: "product_name", label: t("tableHeader.product"), field: "product_name", align: "center" as const },
  { name: "game_name", label: t("home.game"), field: "game_name", align: "center" as const },
  { name: "rounds", label: t("member.free_spin_rounds"), field: "rounds", align: "center" as const },
  { name: "action", label: t("tableHeader.operating"), field: "action", align: "center" as const }
])

onMounted(async () => {
  $q.loading.show()
  try {
    await new Promise((resolve) => setTimeout(resolve, 500))
  } catch (error) {
    console.error("Error in FreeSpin onMounted:", error)
  } finally {
    $q.loading.hide()
  }
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r032/assets/css/_variable.scss";

.freespin-page {
  &.h5 {
    width: 100%;
    min-height: 100vh;
    background-color: var(--bg-main-bg);
    padding: 1rem;
    padding-bottom: 6rem;

    .freespin-container {
      width: 100%;
      background: var(--neutral-01);
      border-radius: 0.75rem;
      padding: 1rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }
  }

  &.pc {
    width: 100%;
    max-width: 87.5rem;
    margin: 0 auto;
    padding: 1.525rem 0 10%;

    .freespin-header {
      border-radius: 0.5rem;
      padding: 1.25rem 1.5rem;
      margin-bottom: 1.5rem;

      .page-title {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--secondary-01);
        margin: 0;
      }
    }

    .freespin-body {
      background: var(--neutral-01);
      border-radius: 0.75rem;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }
  }
}

.tables {
  :deep(.q-table__container) {
    background-color: transparent;
    box-shadow: none;

    .q-table {
      border-collapse: separate;
      border-spacing: 0;

      thead {
        tr {
          background-image: linear-gradient(to right, transparent 0%, #ffffff 50%, transparent 100%);
          background-size: 100% 1px;
          background-position: bottom left;
          background-repeat: no-repeat;

          .body--light & {
            background-image: none;
          }

          th {
            background-color: var(--primary-07);
            color: var(--secondary-01);
            font-weight: 600;
            font-size: 0.875rem;
            padding: 0.75rem 1rem;
            border-bottom: none !important;

            .body--light & {
              @apply border-b;
              border-color: var(--border-soft);
            }
          }
        }
      }

      tbody {
        tr {
          background-color: var(--neutral-01);
          background-image: linear-gradient(to right, transparent 0%, #ffffff 50%, transparent 100%);
          background-size: 100% 1px;
          background-position: bottom left;
          background-repeat: no-repeat;

          .body--light & {
            background-image: none;
          }

          &:hover {
            background-color: var(--primary-04);
          }

          td {
            padding: 0.75rem 1rem;
            font-size: 0.875rem;
            color: var(--secondary-01);

            .body--light & {
              @apply border-b;
              border-color: var(--border-soft);
            }
          }

          &:hover {
            background: var(--neutral-01);
            color: var(--secondary-01);
          }
        }
      }
    }
  }
}

.go-btn {
  border-radius: 6px;
  padding: 0.25rem 1rem;
  min-width: 60px;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: none;
  background: var(--linear-gradient-primary-01);
  color: var(--text-01);

  &:hover {
    background: var(--primary-03);
  }
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-soft);

  :deep(.q-pagination) {
    .q-btn {
      min-width: 32px;
      min-height: 32px;
      font-size: 0.875rem;
      color: var(--secondary-01);

      &.q-btn--flat {
        background: var(--neutral-01);
        border: 1px solid var(--border-soft);
      }

      &.q-btn--standard {
        background: var(--linear-gradient-primary-01);
        color: var(--text-01);
      }
    }
  }
}

.no-data {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--primary-02);
  font-size: 1rem;
}

.filter-section {
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-soft);

  .filter-row {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 0.75rem;

    .filter-item {
      flex: 1;

      &.full-width {
        flex: 1;
      }

      .filter-label {
        display: block;
        font-size: 0.875rem;
        color: var(--secondary-01);
        margin-bottom: 0.25rem;
      }

      .filter-input {
        width: 100%;

        :deep(.q-field__control) {
          height: 2.5rem;
          min-height: 2.5rem;
          background: var(--neutral-01);
        }

        :deep(.q-field__native) {
          padding: 0 0.75rem;
          color: var(--secondary-01);
        }
      }
    }
  }

  .search-btn {
    width: 100%;
    height: 2.5rem;
    font-size: 0.9375rem;
    font-weight: 600;
    border-radius: 0.5rem;
    background: var(--linear-gradient-primary-01);
    color: var(--text-01);
  }
}

.card-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  .freespin-card {
    background: var(--neutral-01);
    border: 1px solid var(--border-soft);
    border-radius: 0.75rem;
    overflow: hidden;

    :deep(.q-expansion-item__container) {
      .q-item {
        padding: 0.75rem 1rem;
        min-height: auto;
        background: var(--neutral-01);
      }

      .q-item__section--side {
        padding-left: 0.5rem;
      }
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      width: 100%;
      gap: 1rem;

      .card-header-left,
      .card-header-right {
        display: flex;
        flex-direction: column;
        gap: 0.125rem;
      }

      .card-header-right {
        text-align: right;
      }

      .product-name,
      .game-name {
        font-size: 0.9375rem;
        font-weight: 600;
        color: var(--secondary-01);
      }

      .product-label,
      .game-label {
        font-size: 0.75rem;
        color: var(--primary-02);
      }
    }

    .card-content {
      padding: 0.75rem 1rem;
      border-top: 1px solid var(--border-soft);
      background: var(--neutral-04);

      .content-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem 0;
        border-bottom: 1px solid var(--border-soft);

        &:last-child {
          border-bottom: none;
        }

        .content-label {
          font-size: 0.875rem;
          color: var(--primary-02);
        }

        .content-value {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--secondary-01);
        }
      }
    }

    :deep(.expand-icon) {
      color: var(--primary-02);
    }
  }
}
</style>
