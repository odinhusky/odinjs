<template>
  <div class="freespin-layout">
    <div class="freespin-container">
      <div class="freespin-header">
        <img :src="svgIcon('free-spin')" :alt="$t('menu.freeSpin')" class="title-img" />
      </div>

      <div class="freespin-body">
        <!-- Mobile: 卡片列表 -->
        <template v-if="isMobile">
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
        </template>

        <!-- Desktop: 表格 -->
        <template v-else>
          <div v-if="filteredList.length > 0" class="tables">
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
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useQuasar } from "quasar"
import { computed, ref, onMounted } from "vue"
import { useI18n } from "vue-i18n"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { useFreeSpin } from "src/common/composables/useFreeSpin"
import { useSiteImg } from "app/template/set_r031/hooks/useSiteImg"

const $q = useQuasar()
const { t } = useI18n()
const { isMobile } = useMediaQuery()
const { svgIcon } = useSiteImg()

const { freeSpinList, handleFreeSpinLaunchClick } = useFreeSpin()

// 篩選後的列表（之後可擴充篩選邏輯）
const filteredList = computed(() => {
  return freeSpinList.list
})

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

onMounted(async () => {
  $q.loading.show()
  try {
    // 免費旋轉列表會在 useFreeSpin onMounted 自動載入
    await new Promise((resolve) => setTimeout(resolve, 500))
  } catch (error) {
    console.error("Error in MemberFreeSpin onMounted:", error)
  } finally {
    $q.loading.hide()
  }
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r031/assets/css/_variable.scss";

.freespin-layout {
  width: 100%;
  height: 100%;
  min-height: 600px;
  border-radius: 12px;
  background: var(--bg-11);
  padding: 20px;
  flex: 1 0 0;

  @include phone-width {
    background: transparent;
    padding: 0;
  }

  .freespin-container {
    display: flex;
    flex-direction: column;
    width: 100%;

    .freespin-header {
      display: flex;
      align-items: center;
      width: 100%;
      margin-bottom: 1.25rem;

      .title-img {
        width: auto;
        height: 2.5rem;

        @include phone-width {
          height: 2rem;
        }
      }
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
          th {
            background-color: var(--bg-04);
            color: var(--text-01);
            font-weight: 600;
            font-size: 0.875rem;
            padding: 0.75rem 1rem;
            border-bottom: 1px solid var(--bg-line-01);
          }
        }
      }

      tbody {
        tr {
          background-color: transparent;

          &:hover {
            background-color: var(--bg-06);
          }

          td {
            padding: 0.75rem 1rem;
            font-size: 0.875rem;
            color: var(--text-01);
            border-bottom: 1px solid var(--bg-line-01);
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
  background: linear-gradient(90deg, var(--btn-bg-01) 0%, var(--btn-bg-02) 100%);
  color: var(--btn-text-01, #fff);
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--bg-line-01);

  :deep(.q-pagination) {
    .q-btn {
      min-width: 32px;
      min-height: 32px;
      font-size: 0.875rem;
      font-weight: 600;
      margin: 0;
      border-radius: 6px;
      background: transparent;
      border: none;
      color: var(--text-01);

      &::before {
        box-shadow: none !important;
      }

      // 上一頁 / 下一頁箭頭 icon 顏色（避免被 Quasar text-primary 蓋掉）
      .q-icon {
        color: var(--text-01) !important;
      }

      // 選中頁：符合版型主題色（粉色漸層）
      &[aria-current="true"] {
        background: linear-gradient(90deg, var(--btn-bg-01) 0%, var(--btn-bg-02) 100%) !important;
        border-color: transparent;
        color: var(--btn-text-01, #fff) !important;
      }

      &.disabled {
        opacity: 0.5;
      }
    }
  }
}

.no-data {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--text-03);
  font-size: 1rem;
}

// Mobile 卡片樣式
.card-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  .freespin-card {
    background: var(--card-bg-02);
    border: 1px solid var(--bg-line-01);
    border-radius: 0.75rem;
    overflow: hidden;

    :deep(.q-expansion-item__container) {
      .q-item {
        padding: 0.75rem 1rem;
        min-height: auto;
        background: var(--card-bg-02);
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
        color: var(--text-01);
      }

      .product-label,
      .game-label {
        font-size: 0.75rem;
        color: var(--text-03);
      }
    }

    .card-content {
      padding: 0.75rem 1rem;
      border-top: 1px solid var(--bg-line-01);
      background: var(--bg-05);

      .content-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem 0;
        border-bottom: 1px solid var(--bg-line-01);

        &:last-child {
          border-bottom: none;
        }

        .content-label {
          font-size: 0.875rem;
          color: var(--text-03);
        }

        .content-value {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-01);
        }
      }
    }

    :deep(.expand-icon) {
      color: var(--text-03);
    }
  }
}
</style>
