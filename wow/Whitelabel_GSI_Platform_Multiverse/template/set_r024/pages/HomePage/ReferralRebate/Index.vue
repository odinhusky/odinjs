<template>
  <div class="referral-rebate">
    <div class="referral-rebate-content">
      <div class="title text-nowrap">
        <span>{{ $t("member.referralRebate.title1") }}</span>
        <span :class="{ 'ml-2': !['zh-tw', 'zh-cn'].includes(locale) }">{{ $t("member.referralRebate.title2") }}</span>
      </div>

      <!-- Currency -->
      <div>
        <div class="currency-select">
          <span class="currency-select-title">{{ $t("common.btn.currency") }}</span>
          <q-btn-dropdown
            rounded
            :label="referralRebateCurrencyCode"
            menu-anchor="bottom middle"
            menu-self="bottom middle"
            :loading="isLoading"
          >
            <q-list>
              <q-item
                v-for="item in currencyDropdown"
                :key="item.value"
                clickable
                v-close-popup
                @click="changeCurrency(item)"
              >
                <q-item-section>
                  <q-item-label>{{ item.label }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
      </div>

      <!-- Summary / referral code -->
      <div class="summary-wrapper">
        <Summary :data="referralRebateSummary" />
        <div class="referral-code">
          <div class="referral-code-title">{{ $t("collaboration.exclusive_referral_code") }}</div>
          <q-input class="referral-code-value" v-model="referralCode" dense :borderless="true" readonly>
            <template v-slot:append>
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
            </template>
          </q-input>
        </div>
      </div>

      <template v-if="selectedEventId === null || selectedEventId === undefined">
        <div>
          <!--  Tabs -->
          <div class="proxy-tabs">
            <q-tabs v-model="activeTab" align="left">
              <q-tab name="eventStatement" :label="$t('member.referralRebate.eventStatement')" />
              <q-tab name="revenueDetail" :label="$t('member.referralRebate.revenueDetail')" />
            </q-tabs>
          </div>
          <!-- Search content -->
          <q-tab-panels v-model="activeTab" class="proxy-tab-panels">
            <q-tab-panel name="eventStatement">
              <div class="table-content">
                <div class="search-content-title">{{ $t("member.referralRebate.searchContent") }}</div>
                <div class="member-number">
                  <div class="label">{{ $t("member.referralRebate.account") }}</div>
                  <q-input
                    :placeholder="$t('member.referralRebate.account')"
                    borderless
                    dense
                    v-model="accountNumber"
                    autocomplete="off"
                    class="w-full md:w-auto"
                  ></q-input>
                </div>
                <div class="actions">
                  <div class="currency-action">
                    <div class="currency-select">
                      <span class="currency-select-title">{{ $t("common.btn.currency") }}</span>
                      <q-btn-dropdown
                        rounded
                        :label="referralRebateCurrencyCode"
                        menu-anchor="bottom middle"
                        menu-self="bottom middle"
                        :loading="isLoading"
                        class="w-full md:w-auto"
                      >
                        <q-list>
                          <q-item
                            v-for="item in currencyDropdown"
                            :key="item.value"
                            clickable
                            v-close-popup
                            @click="changeCurrency(item)"
                          >
                            <q-item-section>
                              <q-item-label>{{ item.label }}</q-item-label>
                            </q-item-section>
                          </q-item>
                        </q-list>
                      </q-btn-dropdown>
                    </div>
                  </div>
                  <div class="gametype-action">
                    <div class="gametype-select">
                      <span class="gametype-select-title">{{ $t("member.referralRebate.gametype") }}</span>
                      <q-btn-dropdown
                        rounded
                        borderless
                        :label="$t(gameTypeCode)"
                        menu-anchor="bottom middle"
                        menu-self="bottom middle"
                        :loading="isLoading"
                        class="w-full md:w-auto"
                      >
                        <q-list>
                          <q-item
                            v-for="item in gameTypeDropdownWithAll"
                            :key="item.value"
                            clickable
                            v-close-popup
                            @click="changeGameType(item)"
                          >
                            <q-item-section>
                              <q-item-label>{{ item.label }}</q-item-label>
                            </q-item-section>
                          </q-item>
                        </q-list>
                      </q-btn-dropdown>
                    </div>
                  </div>
                  <div class="date-action">
                    <div class="date-select">
                      <span class="date-select-title">{{ $t("member.referralRebate.searchTime") }}</span>
                      <DateRangePicker
                        v-model="selectedDate"
                        placeholder=""
                        outlined
                        dense
                        input-class="w-full md:w-auto md:min-w-[160px]"
                        :disable-future-dates="true"
                        :max-days="31"
                        date-color="#e38901"
                      />
                    </div>
                  </div>
                  <q-btn class="search-btn" @click="() => getStatement(false)">{{ $t("common.btn.search") }}</q-btn>
                </div>
                <div class="tables">
                  <q-table
                    :rows="referralRebateStatementsList"
                    :columns="referralRebateEventsStatementsTableColumns"
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
                  <q-pagination
                    v-model="referralRebateStatements.pagination.page"
                    :max="referralRebateStatements.pagination.total"
                    :max-pages="5"
                    class="r-pagination"
                    color="deep-grey"
                    active-color="blue-8"
                    active-design="flat"
                    direction-links
                    @update:model-value="handleReferralRebateStatementsPagination"
                  />
                </div>
              </div>
            </q-tab-panel>
            <q-tab-panel name="revenueDetail">
              <div class="table-content">
                <div class="search-content-title">{{ $t("member.referralRebate.searchContent") }}</div>
                <div class="actions">
                  <div class="currency-action">
                    <div class="currency-select">
                      <span class="currency-select-title">{{ $t("common.btn.currency") }}</span>
                      <q-btn-dropdown
                        rounded
                        :label="referralRebateCurrencyCode"
                        menu-anchor="bottom middle"
                        menu-self="bottom middle"
                        :loading="isLoading"
                        class="w-full md:w-auto"
                      >
                        <q-list>
                          <q-item
                            v-for="item in currencyDropdown"
                            :key="item.value"
                            clickable
                            v-close-popup
                            @click="changeCurrency(item)"
                          >
                            <q-item-section>
                              <q-item-label>{{ item.label }}</q-item-label>
                            </q-item-section>
                          </q-item>
                        </q-list>
                      </q-btn-dropdown>
                    </div>
                  </div>
                  <div class="date-action">
                    <div class="date-select">
                      <span class="date-select-title">{{ $t("member.referralRebate.settlementTime") }}</span>

                      <DateRangePicker
                        v-model="selectedDate"
                        placeholder=""
                        outlined
                        dense
                        input-class="w-full md:w-auto md:min-w-[160px]"
                        :disable-future-dates="true"
                        :max-days="31"
                        date-color="#e38901"
                      />
                    </div>
                  </div>
                  <q-btn class="search-btn" @click="getEvents">{{ $t("common.btn.search") }}</q-btn>
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

                  <q-pagination
                    v-model="referralRebateEvents.pagination.page"
                    :max="referralRebateEvents.pagination.total"
                    :max-pages="5"
                    class="r-pagination"
                    flat
                    active-design="flat"
                    color="deep-grey"
                    active-color="blue-8"
                    direction-links
                    @update:model-value="handleReferralRebateEventsPagination"
                  />
                </div>
              </div>
            </q-tab-panel>
          </q-tab-panels></div
      ></template>

      <template v-else>
        <div class="mt-[4rem] events-detail-header">
          <q-btn
            class="back-btn"
            :to="{ name: 'ReferralRebate' }"
            :label="$t('common.btn.back')"
            icon="reply"
            @click="changeGameType(gameTypeDropdownWithAll[0])"
          >
          </q-btn>
        </div>
        <div class="table-content events-detail">
          <div class="search-content-title">{{ $t("member.referralRebate.searchContent") }}</div>
          <div class="member-number">
            <div class="label">{{ $t("member.referralRebate.account") }}</div>
            <q-input
              :placeholder="$t('member.referralRebate.account')"
              borderless
              dense
              v-model="accountNumber"
              autocomplete="off"
              class="w-full md:w-auto"
            ></q-input>
          </div>
          <div class="actions">
            <div class="currency-action">
              <div class="currency-select">
                <span class="currency-select-title">{{ $t("common.btn.currency") }}</span>
                <q-btn-dropdown
                  rounded
                  :label="referralRebateCurrencyCode"
                  menu-anchor="bottom middle"
                  menu-self="bottom middle"
                  :loading="isLoading"
                  class="w-full md:w-auto"
                >
                  <q-list>
                    <q-item
                      v-for="item in currencyDropdown"
                      :key="item.value"
                      clickable
                      v-close-popup
                      @click="changeCurrency(item)"
                    >
                      <q-item-section>
                        <q-item-label>{{ item.label }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-btn-dropdown>
              </div>
            </div>
            <div class="gametype-action">
              <div class="gametype-select">
                <span class="gametype-select-title">{{ $t("member.referralRebate.gametype") }}</span>
                <q-btn-dropdown
                  rounded
                  borderless
                  :label="$t(gameTypeCode)"
                  menu-anchor="bottom middle"
                  menu-self="bottom middle"
                  :loading="isLoading"
                  class="w-full md:w-auto"
                >
                  <q-list>
                    <q-item
                      v-for="item in gameTypeDropdownWithAll"
                      :key="item.value"
                      clickable
                      v-close-popup
                      @click="changeGameType(item)"
                    >
                      <q-item-section>
                        <q-item-label>{{ item.label }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-btn-dropdown>
              </div>
            </div>
            <q-btn class="search-btn" @click="getEventsStatements(selectedEventId, false)">{{
              $t("common.btn.search")
            }}</q-btn>
          </div>
          <div class="tables">
            <q-table
              :rows="referralRebateEventsStatements.list"
              :columns="referralRebateEventsStatementsTableColumns"
              hide-bottom
              :pagination="{ rowsPerPage: 0 }"
              v-if="referralRebateEventsStatements.list.length > 0"
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
            <q-pagination
              v-model="referralRebateEventsStatements.pagination.page"
              :max="referralRebateEventsStatements.pagination.total"
              :max-pages="5"
              class="r-pagination"
              flat
              active-design="flat"
              color="deep-grey"
              active-color="blue-8"
              direction-links
              @update:model-value="handlereferralRebateEventsStatementsPagination"
            />
          </div></div
      ></template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useReferralRebate } from "src/common/composables/useReferralRebate"
import { onMounted } from "vue"
import { useCommon } from "src/common/hooks/useCommon"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useAuth } from "src/common/hooks/useAuth"
import { useRouter } from "vue-router"
import { useI18n } from "vue-i18n"
import DateRangePicker from "src/common/components/DateRangePicker.vue"
import Summary from "src/common/components/ReferralRebate/Summary.vue"

const { locale } = useI18n()

const router = useRouter()
const { isLogin } = useAuth()
const { copyMessage } = useCommon()
const { inviteCodeUrl } = useUserInfo()
const {
  activeTab,
  isLoading,
  selectedEventId,
  accountNumber,
  selectedDate,
  currencyDropdown,
  gameTypeDropdownWithAll,
  initDetail,
  initReferralRebateDate,
  initReferralRebateCurrency,
  referralCode,
  gameTypeCode,
  referralRebateCurrencyCode,
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

<!--
  q-date popup 是 teleport 到 body 的，直接用全局 .q-date 覆蓋。
  header / picker 背景：$secondary-card（#04275F）
  日曆主體背景：#000000
-->
<style lang="scss">
@import "app/template/set_r024/assets/css/_variable.sass";

// ── q-date popup 全局覆蓋（teleport 後 scoped 無效，必須用全局）────────────
.q-date {
  // 覆蓋 Quasar CSS 變數，讓 header 背景和選取色使用 $secondary-card
  --q-primary: #{$secondary-card};

  // 主背景
  background: #000000 !important;
  color: $neutral-01;

  // header 區背景
  .q-date__header {
    background: $secondary-card !important;
    color: $neutral-01 !important;
  }

  // 日曆格子背景
  .q-date__content {
    background: #000000 !important;
  }

  // 日期文字
  .q-date__calendar-item .q-btn {
    color: $neutral-01;
  }

  // 今日外框
  .q-date__today {
    box-shadow: 0 0 1px 0 currentColor !important;
    .q-btn {
      border-color: $secondary-card;
    }
  }

  // 前後月箭頭
  .q-date__arrow {
    color: $neutral-01;
  }

  .q-date__view {
    color: $neutral-01;
  }

  // 所有 btn 文字強制白色（涵蓋導航、年月切換、Close 等）
  .q-btn {
    color: $neutral-01 !important;
  }
}
</style>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set_r024/assets/css/_variable.sass";
@import "app/template/set_r024/assets/css/referral-rebate.scss";
@import "app/template/set_r024/assets/css/common.scss";

.date-select {
  :deep(.q-field__control) {
    border: 1px solid $functional-line;
    background: $functional-input;
  }
  :deep(.q-field__native) {
    color: $neutral-01;
  }
  :deep(.q-field__append) {
    color: $neutral-01;
  }
}
</style>
