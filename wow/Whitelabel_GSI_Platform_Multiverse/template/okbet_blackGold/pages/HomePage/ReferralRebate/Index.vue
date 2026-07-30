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
        <ReferralRebateSummary :data="referralRebateSummary" />
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
                    class="w-full md:w-auto border rounded-md border-[#8A8A8A]"
                    color="white"
                    input-class="text-white"
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
                        bg-color="black"
                        color="white"
                        rounded
                        outlined
                        dense
                        input-class="w-full md:w-auto md:min-w-[160px] border rounded-3xl text-white"
                        icon-class="cursor-pointer text-white mr-2 self-center"
                        date-color="primary"
                        :disable-future-dates="true"
                        :max-days="31"
                      />
                    </div>
                  </div>
                  <q-btn class="search-btn" @click="() => getStatement(false)">{{ $t("common.btn.search") }}</q-btn>
                </div>
                <div class="tables">
                  <q-table
                    v-if="referralRebateStatementsList.length > 0"
                    :rows="referralRebateStatementsList"
                    :columns="referralRebateStatementsTableColumns"
                    hide-bottom
                    :pagination="{ rowsPerPage: 0 }"
                    :grid="$q.platform.is.mobile ? true : false"
                  >
                    <template v-slot:body="props">
                      <tr>
                        <td v-for="col in referralRebateStatementsTableColumns" :key="col.name">
                          <span>{{ props.row[col.field] }}</span>
                        </td>
                      </tr>
                    </template>
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
                  <div v-else class="no-data">
                    {{ $t("tableHeader.no_data") }}
                  </div>
                  <q-pagination
                    v-model="referralRebateStatements.pagination.page"
                    :max="referralRebateStatements.pagination.total"
                    class="r-pagination"
                    active-text-color="amber-14"
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
                  <div class="date-action">
                    <div class="date-select">
                      <span class="date-select-title">{{ $t("member.referralRebate.settlementTime") }}</span>

                      <DateRangePicker
                        v-model="selectedDate"
                        placeholder=""
                        bg-color="black"
                        color="white"
                        rounded
                        outlined
                        dense
                        input-class="w-full md:w-auto md:min-w-[160px] border rounded-3xl text-white"
                        icon-class="cursor-pointer text-white mr-2 self-center"
                        date-color="primary"
                        :disable-future-dates="true"
                        :max-days="31"
                      />
                    </div>
                  </div>
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
                    v-model="referralRebateEvents.pagination.page"
                    :max="referralRebateEvents.pagination.total"
                    class="r-pagination"
                    active-text-color="amber-14"
                    direction-links
                    @update:model-value="handleReferralRebateEventsPagination"
                  />
                </div>
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </template>

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
              color="white"
              input-class="text-white"
              v-model="accountNumber"
              class="w-full md:w-auto border rounded-md border-[#8A8A8A]"
            ></q-input>
          </div>
          <div class="actions">
            <!-- <div class="currency-action">
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
            </div> -->
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
              v-if="referralRebateEventsStatements.list.length > 0"
              :rows="referralRebateEventsStatements.list"
              :columns="referralRebateEventsStatementsTableColumns"
              hide-bottom
              :pagination="{ rowsPerPage: 0 }"
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
              class="r-pagination"
              direction-links
              @update:model-value="handlereferralRebateEventsStatementsPagination"
            />
          </div>
        </div>
      </template>
    </div>
  </div>
  <FooterArea />
</template>

<!--
  okbet_blackGold 無亮暗模式。q-date popup 是 teleport 到 body 的，直接用全局 .q-date 覆蓋。
  顏色對應 _variable.sass：
    header / picker 背景：$primary-gradient-color（#F7D99D → #A48155）
    日曆主體背景：$primary-black-color（#1E1E1E）
    文字：--neutral-01（#ffffff）
-->
<style lang="scss">
@import "app/template/okbet_blackGold/assets/css/_variable.sass";

// ── q-date popup 覆蓋（okbet_blackGold：無亮暗模式）────────────────
// 在 .q-date 層級覆蓋 --q-primary，讓 Quasar 的 .bg-primary 自動用金色主題
.q-date {
  // 覆蓋 --q-primary 為主題金（--primary-01: #d2b27e），用於選中日期、today 外框
  --q-primary: var(--primary-01);

  // 整體背景（$primary-black-color: #1E1E1E）
  background: $primary-black-color !important;
  color: var(--neutral-01);

  // header 區 —— 金色漸層（$primary-gradient-color: linear-gradient(180deg, #F7D99D, #A48155)）
  .q-date__header {
    background: $primary-gradient-color !important;
    color: var(--neutral-01) !important; // 白色文字
  }

  // 日曆格子背景
  .q-date__content {
    background: $primary-black-color !important;
  }

  .q-date__calendar-item .q-btn {
    color: var(--neutral-01);
  }

  // 今日外框顏色
  .q-date__today .q-btn {
    border-color: var(--primary-02); // #F7D99D 淺金
  }

  .q-date__arrow {
    color: var(--neutral-01);
  }

  .q-date__view {
    color: var(--neutral-01);
  }
}
</style>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/okbet_blackGold/assets/css/_variable.sass";
@import "app/template/okbet_blackGold/assets/css/referral-rebate.scss";
</style>

<script setup lang="ts">
import { useReferralRebate } from "src/common/composables/useReferralRebate"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { onMounted } from "vue"
import { useCommon } from "src/common/hooks/useCommon"
import { useAuth } from "src/common/hooks/useAuth"
import { useRouter } from "vue-router"
import { useI18n } from "vue-i18n"
import FooterArea from "app/template/okbet_blackGold/components/Footer/Index.vue"
import DateRangePicker from "src/common/components/DateRangePicker.vue"
import ReferralRebateSummary from "src/common/components/ReferralRebate/Summary.vue"
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
