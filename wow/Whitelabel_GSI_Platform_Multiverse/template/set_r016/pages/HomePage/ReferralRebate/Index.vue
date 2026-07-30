<template>
  <div class="referral-rebate">
    <BackBtn />
    <div class="referral-rebate-content">
      <div class="title">{{ $t("member.referralRebate.title") }}</div>

      <!-- Currency -->
      <div>
        <div class="currency-item">
          <div class="form-title required">{{ $t("common.btn.currency") }}</div>
          <q-select
            standout
            v-model="referralRebateCurrencyId"
            :options="currencyDropdown"
            map-options
            emit-value
            class="form-input"
            rounded
            outlined
            dense
            borderless
            no-error-icon
            hide-bottom-space
            @update:model-value="changeCurrency"
          />
        </div>
      </div>

      <!-- Summary / referral code -->
      <div class="summary-wrapper">
        <Summary :data="referralRebateSummary" />
        <div class="referral-code-wrapper">
          <div class="referral-code-title">{{ $t("collaboration.exclusive_referral_code") }}</div>
          <div class="referral-code-row">
            <div class="referral-code">{{ referralCode }}</div>
            <div class="referral-code-btn">
              <q-icon
                name="share"
                @click="copyMessage(inviteCodeUrl({ inviteCode: referralCode, routerName: 'HomePage' }))"
                class="cursor-pointer mr-1 hover:opacity-50"
                size="xs"
              ></q-icon>
              <q-icon
                name="content_copy"
                class="cursor-pointer hover:opacity-50"
                size="xs"
                @click="copyMessage(referralCode)"
              ></q-icon>
            </div>
          </div>
        </div>
      </div>

      <template v-if="selectedEventId === null || selectedEventId === undefined">
        <div>
          <!--  Tabs -->
          <div class="proxy-tabs">
            <q-btn
              class="hide-hover"
              :class="{ active: activeTab === 'eventStatement' }"
              @click="activeTab = 'eventStatement'"
            >
              {{ $t("member.referralRebate.eventStatement") }}
            </q-btn>
            <q-btn
              class="hide-hover"
              :class="{ active: activeTab === 'revenueDetail' }"
              @click="activeTab = 'revenueDetail'"
            >
              {{ $t("member.referralRebate.revenueDetail") }}
            </q-btn>
          </div>
          <!-- Search content -->
          <q-tab-panels v-model="activeTab" class="proxy-tab-panels">
            <q-tab-panel name="eventStatement">
              <div class="table-content">
                <div class="search-content">
                  <p class="search-content-title">{{ $t("member.referralRebate.searchContent") }}</p>
                  <div class="search-row">
                    <div class="form-item">
                      <div class="form-title">{{ $t("member.referralRebate.account") }}</div>
                      <q-input
                        standout
                        v-model="accountNumber"
                        :placeholder="$t('member.referralRebate.account')"
                        rounded
                        outlined
                        dense
                        borderless
                        class="form-input"
                        no-error-icon
                        hide-bottom-space
                      >
                      </q-input>
                    </div>
                    <div class="form-item">
                      <div class="form-title required">{{ $t("common.btn.currency") }}</div>
                      <q-select
                        standout
                        v-model="referralRebateCurrencyId"
                        :options="currencyDropdown"
                        map-options
                        emit-value
                        class="form-select"
                        rounded
                        outlined
                        dense
                        borderless
                        no-error-icon
                        hide-bottom-space
                        @update:model-value="changeCurrency"
                      />
                    </div>
                    <div class="form-item">
                      <div class="form-title required">{{ $t("member.referralRebate.gametype") }}</div>
                      <q-select
                        standout
                        v-model="gameTypeId"
                        :options="gameTypeDropdownWithAll"
                        map-options
                        emit-value
                        class="form-select"
                        rounded
                        outlined
                        dense
                        borderless
                        no-error-icon
                        hide-bottom-space
                      />
                    </div>
                    <div class="form-item">
                      <div class="form-title required">{{ $t("member.referralRebate.searchTime") }}</div>
                      <DateRangePicker
                        v-model="selectedDate"
                        placeholder=""
                        standout
                        rounded
                        outlined
                        dense
                        borderless
                        input-class="w-full md:w-auto md:min-w-[160px] form-input"
                        :disable-future-dates="true"
                        :max-days="31"
                      />
                    </div>

                    <q-btn class="hide-hover btn-search" @click="() => getStatement(false)">{{
                      $t("common.btn.search")
                    }}</q-btn>
                  </div>
                </div>
                <div class="tables">
                  <q-table
                    :rows="referralRebateStatementsList"
                    :columns="referralRebateStatementsTableColumns"
                    hide-bottom
                    :pagination="{ rowsPerPage: 0 }"
                    v-if="referralRebateStatementsList.length > 0"
                    :grid="$q.platform.is.mobile ? true : false"
                  >
                    <template v-slot:item="props">
                      <q-card class="w-full">
                        <template v-for="col in props.cols" :key="col.name">
                          <div v-if="col.name !== 'action'" class="row-item">
                            <div class="label">
                              {{ col.label }}
                            </div>
                            <div class="value">
                              {{ col.value }}
                            </div>
                          </div>

                          <div v-else>
                            <q-btn
                              class="detail-btn"
                              denst
                              flat
                              @click="handleDetailClick(props.row.id)"
                              :label="$t('member.referralRebate.detail')"
                            />
                          </div>
                        </template>
                      </q-card>
                    </template>
                  </q-table>
                  <div v-else class="no-data">{{ $t("tableHeader.no_data") }}</div>
                  <div v-if="referralRebateStatements.pagination.total > 1" class="custom-pagination">
                    <q-pagination
                      v-model="referralRebateStatements.pagination.page"
                      :max="referralRebateStatements.pagination.total"
                      direction-links
                      icon-prev="fa-solid fa-caret-left"
                      icon-next="fa-solid fa-caret-right"
                      active-color="pagination-active"
                      @update:model-value="handleReferralRebateStatementsPagination"
                    />
                  </div>
                </div>
              </div>
            </q-tab-panel>
            <q-tab-panel name="revenueDetail">
              <div class="table-content">
                <div class="search-content">
                  <p class="search-content-title">{{ $t("member.referralRebate.searchContent") }}</p>
                  <div class="search-row">
                    <div class="form-item">
                      <div class="form-title required">{{ $t("common.btn.currency") }}</div>
                      <q-select
                        standout
                        v-model="referralRebateCurrencyId"
                        :options="currencyDropdown"
                        map-options
                        emit-value
                        class="form-select"
                        rounded
                        outlined
                        dense
                        borderless
                        no-error-icon
                        hide-bottom-space
                        @update:model-value="changeCurrency"
                      />
                    </div>
                    <div class="form-item">
                      <div class="form-title required">{{ $t("member.referralRebate.settlementTime") }}</div>
                      <DateRangePicker
                        v-model="selectedDate"
                        placeholder=""
                        standout
                        rounded
                        outlined
                        dense
                        borderless
                        input-class="w-full md:w-auto md:min-w-[160px] form-input"
                        :disable-future-dates="true"
                        :max-days="31"
                      />
                    </div>

                    <q-btn class="hide-hover btn-search" @click="getEvents">{{ $t("common.btn.search") }}</q-btn>
                  </div>
                </div>
                <div class="tables">
                  <q-table
                    v-if="referralRebateEvents.list.length > 0"
                    :rows="referralRebateEvents.list"
                    :columns="referralRebateEventsTableColumns"
                    hide-bottom
                    :pagination="{ rowsPerPage: 0 }"
                    @row-click="handleEventsRowClick"
                    :table-row-class-fn="tableRowClass"
                    :grid="$q.platform.is.mobile ? true : false"
                  >
                    <template v-slot:item="props">
                      <q-card class="w-full">
                        <template v-for="col in props.cols" :key="col.name">
                          <div v-if="col.name !== 'action'" class="row-item">
                            <div class="label">
                              {{ col.label }}
                            </div>
                            <div v-if="col.field === 'game_type'" class="value">
                              {{ $t(col.value) }}
                            </div>
                            <div v-else class="value">
                              {{ col.value }}
                            </div>
                          </div>

                          <div v-else>
                            <q-btn
                              class="detail-btn"
                              denst
                              flat
                              @click="handleDetailClick(props.row.id)"
                              :label="$t('member.referralRebate.detail')"
                            />
                          </div>
                        </template>
                      </q-card>
                    </template>
                  </q-table>
                  <div v-else class="no-data">{{ $t("tableHeader.no_data") }}</div>
                  <div v-if="referralRebateEvents.pagination.total > 1" class="custom-pagination">
                    <q-pagination
                      v-model="referralRebateEvents.pagination.page"
                      :max="referralRebateEvents.pagination.total"
                      direction-links
                      icon-prev="fa-solid fa-caret-left"
                      icon-next="fa-solid fa-caret-right"
                      active-color="pagination-active"
                      @update:model-value="handleReferralRebateEventsPagination"
                    />
                  </div>
                </div>
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </template>

      <template v-else>
        <div class="mt-[4rem] events-detail-header">
          <q-btn
            class="btn-back"
            :to="{ name: 'ReferralRebate' }"
            :label="$t('common.btn.back')"
            icon="reply"
            @click="changeGameType(gameTypeDropdownWithAll[0])"
          >
          </q-btn>
        </div>
        <div class="table-content events-detail">
          <div class="search-content">
            <p class="search-content-title">{{ $t("member.referralRebate.searchContent") }}</p>
            <div class="search-row">
              <div class="form-item">
                <div class="form-title">{{ $t("member.referralRebate.account") }}</div>
                <q-input
                  standout
                  v-model="accountNumber"
                  :placeholder="$t('member.referralRebate.account')"
                  rounded
                  outlined
                  dense
                  borderless
                  class="form-input"
                  no-error-icon
                  hide-bottom-space
                >
                </q-input>
              </div>
              <div class="form-item">
                <div class="form-title required">{{ $t("common.btn.currency") }}</div>
                <q-select
                  standout
                  v-model="referralRebateCurrencyId"
                  :options="currencyDropdown"
                  map-options
                  emit-value
                  class="form-select"
                  rounded
                  outlined
                  dense
                  borderless
                  no-error-icon
                  hide-bottom-space
                  @update:model-value="changeCurrency"
                />
              </div>

              <q-btn class="hide-hover btn-search" @click="getEventsStatements(selectedEventId, false)">{{
                $t("common.btn.search")
              }}</q-btn>
            </div>
          </div>
          <div class="tables">
            <q-table
              :rows="referralRebateEventsStatements.list"
              :columns="referralRebateEventsStatementsTableColumns"
              hide-bottom
              :pagination="{ rowsPerPage: 0 }"
              v-if="referralRebateEventsStatements.list.length > 0"
              :grid="$q.platform.is.mobile ? true : false"
            >
              <template v-slot:item="props">
                <q-card class="w-full">
                  <template v-for="col in props.cols" :key="col.name">
                    <div v-if="col.name !== 'action'" class="row-item">
                      <div class="label">
                        {{ col.label }}
                      </div>
                      <div v-if="col.field === 'game_type'" class="value">
                        {{ $t(col.value) }}
                      </div>
                      <div v-else class="value">
                        {{ col.value }}
                      </div>
                    </div>

                    <div v-else>
                      <q-btn
                        class="detail-btn"
                        denst
                        flat
                        @click="handleDetailClick(props.row.id)"
                        :label="$t('member.referralRebate.detail')"
                      />
                    </div>
                  </template>
                </q-card>
              </template>
            </q-table>
            <div v-else class="no-data">{{ $t("tableHeader.no_data") }}</div>
            <div v-if="referralRebateEventsStatements.pagination.total > 1" class="custom-pagination">
              <q-pagination
                v-model="referralRebateEventsStatements.pagination.page"
                :max="referralRebateEventsStatements.pagination.total"
                direction-links
                icon-prev="fa-solid fa-caret-left"
                icon-next="fa-solid fa-caret-right"
                active-color="pagination-active"
                @update:model-value="handlereferralRebateEventsStatementsPagination"
              />
            </div>
          </div></div
      ></template>
    </div>
  </div>
</template>

<style lang="scss">
@import "app/template/set_r016/assets/css/_variable.scss";

// ── q-date popup 覆蓋（set_r016：無亮暗模式）────────────────
// 在 .q-date 層級覆蓋 --q-primary，讓 Quasar 的 .bg-primary 自動用金色主題
.q-date {
  // 定義主題變數
  --primary-gradient-red: radial-gradient(60% 120% at 50% 0%, #ff0000 0%, #dc0000 40%, #bd0000 100%);
  --date-bg-dark: #290000;

  background: var(--date-bg-dark) !important;
  color: white;

  --q-primary: var(--primary-gradient-red) !important;

  .q-date__header {
    background: var(--primary-gradient-red) !important;
    color: white !important;
  }

  .q-date__content {
    background: var(--date-bg-dark) !important;

    // 處理內容區域的範圍選取背景，僅針對「連接偽元素」上灰色
    .q-date__range,
    .q-date__range-from,
    .q-date__range-to {
      background: transparent !important;

      &:before {
        background: #d2d2d240 !important;
        display: block !important;
        opacity: 1 !important;
      }
    }
  }

  // 選中日期的圓圈樣式 —— 確定端點圓球使用漸層紅
  .q-date__calendar-item--selected .q-btn,
  .q-date__range-from .q-btn,
  .q-date__range-to .q-btn,
  .bg-primary.q-btn {
    // 特別指定如果是按鈕上的 primary 就用漸層紅
    background: var(--primary-gradient-red) !important;
    color: white !important;
    box-shadow: none !important;
    opacity: 1 !important;
    z-index: 1;
  }

  .q-date__today .q-btn {
    border-color: var(--primary-gradient-red);
  }

  .q-date__arrow,
  .q-date__view {
    color: white;
  }

  .q-date__calendar-item--out {
    opacity: 0.3;
  }
}
</style>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set_r016/assets/css/_variable.scss";
@import "app/template/set_r016/assets/css/table.scss";
@import "app/template/set_r016/assets/css/form.scss";
@import "app/template/set_r016/assets/css/button.scss";
@import "app/template/set_r016/assets/css/referral-rebate.scss";
</style>

<script setup lang="ts">
import BackBtn from "app/template/set_r016/components/Button/Back.vue"
import DateRangePicker from "src/common/components/DateRangePicker.vue"
import Summary from "src/common/components/ReferralRebate/Summary.vue"
import { useReferralRebate } from "src/common/composables/useReferralRebate"
import { onMounted } from "vue"
import { useCommon } from "src/common/hooks/useCommon"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useAuth } from "src/common/hooks/useAuth"
import { useRouter } from "vue-router"

const router = useRouter()
const { isLogin } = useAuth()
const { copyMessage } = useCommon()
const { inviteCodeUrl } = useUserInfo()
const {
  activeTab,
  selectedEventId,
  accountNumber,
  selectedDate,
  currencyDropdown,
  gameTypeDropdownWithAll,
  gameTypeId,
  initDetail,
  initReferralRebateDate,
  initReferralRebateCurrency,
  referralCode,
  referralRebateCurrencyId,
  referralRebateSummary,
  changeCurrency,
  changeGameType,
  getSummary,
  getStatement,
  getEventsStatements,
  getEvents,
  getReferralCode,
  referralRebateStatements,
  referralRebateStatementsList,
  referralRebateStatementsTableColumns,
  referralRebateEventsStatementsTableColumns,
  referralRebateEvents,
  referralRebateEventsStatements,
  referralRebateEventsTableColumns,
  handleReferralRebateEventsPagination,
  handleReferralRebateStatementsPagination,
  handlereferralRebateEventsStatementsPagination,
  handleEventsRowClick,
  handleDetailClick,
  tableRowClass
} = useReferralRebate()

onMounted(async () => {
  if (isLogin.value) {
    initDetail()
    initReferralRebateDate()
    await initReferralRebateCurrency()
    await getReferralCode()
    await getSummary()
    await getStatement(false)
    await getEvents()
  } else {
    router.push({ path: "/" })
  }
})
</script>
