<template>
  <HeaderTitleBack v-if="$q.platform.is.mobile" titleI18n="menu.freeSpin">
    <div class="freespin-page h5" :class="{ '!pb-[24rem]': isTelegramMiniApp }">
      <div class="freespin-container">
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
                <q-btn
                  class="go-btn"
                  color="primary"
                  dense
                  :label="$t('common.btn.go')"
                  @click="handleFreeSpinLaunchClick(item)"
                />
              </div>
            </div>
          </q-expansion-item>
          <div class="pagination-wrapper">
            <q-pagination
              v-model="currentPage"
              :max="totalPages"
              :max-pages="5"
              direction-links
              boundary-numbers
              color="primary"
            />
          </div>
        </div>
        <div v-else class="no-data">{{ $t("tableHeader.no_data") }}</div>
      </div>
    </div>
    <FooterNav />
  </HeaderTitleBack>

  <div v-else class="freespin-page pc">
    <div class="freespin-header">
      <img :src="memberImg('free_spin.png')" alt="Free Spin" class="title-img" />
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
              <q-btn
                class="go-btn"
                color="primary"
                dense
                :label="$t('common.btn.go')"
                @click="handleFreeSpinLaunchClick(props.row)"
              />
            </q-td>
          </template>
        </q-table>
        <div class="pagination-wrapper">
          <q-pagination
            v-model="currentPage"
            :max="totalPages"
            :max-pages="7"
            direction-links
            boundary-numbers
            color="primary"
          />
        </div>
      </div>
      <div v-else class="no-data">{{ $t("tableHeader.no_data") }}</div>
    </div>
  </div>

  <LaunchGameDialog />
  <CryptoWalletDialog />
</template>

<script lang="ts" setup>
import { useSiteImg } from "app/template/okbet/hooks/useSiteImg"
import { useQuasar } from "quasar"
import { computed, ref, onMounted } from "vue"
import { useI18n } from "vue-i18n"
import HeaderTitleBack from "src/common/components/modal/HeaderTitleBack.vue"
import { useTelegram } from "src/common/composables/useTelegramMiniApp"
import FooterNav from "../../components/Footer/FooterNav.vue"
import { useFreeSpin } from "src/common/composables/useFreeSpin"
import LaunchGameDialog from "src/common/components/dialog/LaunchGame.vue"
import CryptoWalletDialog from "src/common/components/dialog/CryptoWalletDialog.vue"

const { isTelegramMiniApp } = useTelegram()
const { memberImg } = useSiteImg()
const $q = useQuasar()
const { t } = useI18n()

const { freeSpinList, handleFreeSpinLaunchClick } = useFreeSpin()

// Filtered list (can add filtering logic later)
const filteredList = computed(() => {
  return freeSpinList.list
})

// Pagination settings
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

// PC table columns
const tableColumns = computed(() => [
  { name: "product_name", label: t("tableHeader.product"), field: "product_name", align: "center" as const },
  { name: "game_name", label: t("home.game"), field: "game_name", align: "center" as const },
  { name: "rounds", label: t("member.free_spin_rounds"), field: "rounds", align: "center" as const },
  { name: "action", label: t("tableHeader.operating"), field: "action", align: "center" as const }
])

onMounted(async () => {
  $q.loading.show()
  try {
    // Free spin list will be auto-loaded in useFreeSpin onMounted
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
@import "app/template/okbet/assets/css/_variable.sass";
@import "app/template/okbet/assets/css/button.scss";

.freespin-page {
  &.h5 {
    width: 100%;
    min-height: 100vh;
    background-color: $background-pale-silver-color;
    padding: 1rem;
    padding-bottom: 6rem;

    .freespin-container {
      width: 100%;
      background: $white-color;
      border-radius: 0.75rem;
      padding: 1rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }
  }

  &.pc {
    height: 100%;
    padding: 4.375rem 3.125rem 1.875rem;

    .freespin-header {
      display: flex;
      width: 100%;
      justify-content: flex-start;
      align-items: center;
      margin-bottom: 1.5rem;

      .title-img {
        width: 10.5625rem;
        height: auto;
      }
    }

    .freespin-body {
      background: $white-color;
      border-radius: 0.875rem;
      padding: 1.875rem;
      border: 2px solid $border-pale-gray-color;
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
            background-color: #f0f4f8;
            color: $primary-color;
            font-weight: 600;
            font-size: 0.875rem;
            padding: 0.75rem 1rem;
            border-bottom: 1px solid #e0e0e0;
          }
        }
      }

      tbody {
        tr {
          &:nth-child(odd) {
            background-color: $white-color;
          }

          &:nth-child(even) {
            background-color: #fafafa;
          }

          &:hover {
            background-color: #f5f5f5;
          }

          td {
            padding: 0.75rem 1rem;
            font-size: 0.875rem;
            color: $text-charcoal-gray-color;
            border-bottom: 1px solid #f0f0f0;
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
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #f0f0f0;

  :deep(.q-pagination) {
    .q-btn {
      min-width: 32px;
      min-height: 32px;
      font-size: 0.875rem;
    }
  }
}

.no-data {
  text-align: center;
  padding: 3rem 1rem;
  color: $text-smoke-gray-color;
  font-size: 1rem;
}

// Mobile card styles
.card-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  .freespin-card {
    background: $white-color;
    border: 1px solid #e0e0e0;
    border-radius: 0.75rem;
    overflow: hidden;

    :deep(.q-expansion-item__container) {
      .q-item {
        padding: 0.75rem 1rem;
        min-height: auto;
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
        color: $text-charcoal-gray-color;
      }

      .product-label,
      .game-label {
        font-size: 0.75rem;
        color: $text-smoke-gray-color;
      }
    }

    .card-content {
      padding: 0.75rem 1rem;
      border-top: 1px solid #f0f0f0;
      background: #fafafa;

      .content-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem 0;
        border-bottom: 1px solid #f0f0f0;

        &:last-child {
          border-bottom: none;
        }

        .content-label {
          font-size: 0.875rem;
          color: $text-smoke-gray-color;
        }

        .content-value {
          font-size: 0.875rem;
          font-weight: 600;
          color: $text-charcoal-gray-color;
        }
      }
    }

    :deep(.expand-icon) {
      color: $text-smoke-gray-color;
    }
  }
}
</style>
