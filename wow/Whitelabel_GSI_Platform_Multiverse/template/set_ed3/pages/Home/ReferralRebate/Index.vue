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
            class="currency-dropdown"
            rounded
            :label="referralRebateCurrencyCode"
            menu-anchor="bottom middle"
            menu-self="bottom middle"
            :loading="isLoading"
          >
            <q-list class="currency-dropdown-list bg-white">
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
                @click="copyMessage(inviteCodeUrl({ inviteCode: referralCode, routerName: 'Home' }))"
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
                            class="bg-white"
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
                            class="bg-white"
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
                        bg-color="white"
                        dense
                        input-class="w-full md:w-auto md:min-w-[160px] date-select-input"
                        :disable-future-dates="true"
                        :max-days="31"
                        date-color="#086a51"
                      />
                    </div>
                  </div>
                  <q-btn class="search-btn" @click="getStatement(false)">{{ $t("common.btn.search") }}</q-btn>
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
                  <div v-else class="no-data">{{ $t("tableHeader.no_data") }}</div>
                  <q-pagination
                    v-model="referralRebateStatements.pagination.page"
                    :max="referralRebateStatements.pagination.total"
                    :max-pages="5"
                    class="r-pagination"
                    color="deep-grey"
                    active-color="amber-5"
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
                  <div class="date-action">
                    <div class="date-select">
                      <span class="date-select-title">{{ $t("member.referralRebate.settlementTime") }}</span>

                      <q-input
                        v-model="displayDate"
                        placeholder=""
                        bg-color="white"
                        outlined
                        readonly
                        dense
                        class="w-full md:w-auto"
                        @click="showDatePicker"
                      >
                        <template v-slot:append>
                          <q-icon name="event" class="cursor-pointer" @click="showDatePicker" />
                        </template>
                      </q-input>
                      <q-dialog v-model="isShowDatePicker" position="standard">
                        <!-- 用 style 注入 --q-primary，讓 tab2 q-date 選取色與 DateRangePicker 一致 -->
                        <q-card class="q-pa-none" style="--q-primary: #086a51">
                          <q-date range v-model="selectedDate" class="calendar-content" mask="YYYY-MM-DD">
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="Close" color="primary" flat />
                            </div>
                          </q-date>
                        </q-card>
                      </q-dialog>
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
                            class="bg-white"
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
                    active-color="amber-5"
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
                      class="bg-white"
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
            <q-btn class="search-btn" @click="getEventsStatements(selectedEventId!, false)">{{
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
              active-color="amber-5"
              direction-links
              @update:model-value="handlereferralRebateEventsStatementsPagination"
            />
          </div></div
      ></template>
    </div>
  </div>
</template>

<!--
  set_ed3 無亮暗模式。q-date popup 是 teleport 到 body 的，直接用全局 .q-date 覆蓋。
  顏色對應 _variable.scss：
    header：$gradient03（#f4ee70 黃 → #1fc88f 綠，對應畫面按鈕漸層）
    日曆主體背景：$primary-color（#1a1a1a）
    文字：$white-color（#fff）
    --q-primary：$text01（#ffe001 黃色，選中日期 + today 外框）
-->
<style lang="scss">
@import "app/template/set_ed3/assets/css/_variable.scss";

// ── q-date popup 覆蓋（set_ed3：無亮暗模式）────────────────────────
// 各自的 --q-primary 由 wrapper 層控制（DateRangePicker 透過 date-color prop，
// tab2 standalone q-date 透過 q-card 上的 inline style）
// 這裡只處理背景色、文字色、header 漸層。
.q-date {
  // 整體背景：白色
  background: $white01 !important;
  color: $black-color;

  // header 區 —— 黃綠漸層（$gradient03: #f4ee70 → #1fc88f）
  .q-date__header {
    background: $gradient03 !important;
    color: $white-color !important;
  }

  // 日曆格子背景：白色
  .q-date__content {
    background: $white01 !important;
  }

  // 日曆文字：深色
  .q-date__calendar-item .q-btn {
    color: $black-color;
  }

  // today 外框：黃色（直接硬寫，不靠 --q-primary）
  .q-date__today .q-btn {
    border-color: $text01;
  }

  .q-date__arrow {
    color: $black-color;
  }

  .q-date__view {
    color: $black-color;
  }
}
</style>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set_ed3/assets/css/_variable.scss";
@import "app/template/set_ed3/assets/css/referral-rebate.scss";
</style>

<script setup lang="ts">
import { useReferralRebate } from "src/common/composables/useReferralRebate"
import { onMounted, ref } from "vue"
import { useCommon } from "src/common/hooks/useCommon"
import { useAuth } from "src/common/hooks/useAuth"
import { useRouter } from "vue-router"
import { useI18n } from "vue-i18n"
import { useUserInfo } from "src/common/composables/useUserInfo"
import Summary from "src/common/components/ReferralRebate/Summary.vue"
import DateRangePicker from "src/common/components/DateRangePicker.vue"
const { inviteCodeUrl } = useUserInfo()
const { locale } = useI18n()

const router = useRouter()
const { isLogin } = useAuth()
const { copyMessage } = useCommon()
const {
  activeTab,
  isLoading,
  selectedEventId,
  accountNumber,
  selectedDate,
  displayDate,
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

// 日期選擇器控制
const isShowDatePicker = ref(false)

const showDatePicker = () => {
  isShowDatePicker.value = true
}

onMounted(async () => {
  if (isLogin.value) {
    initDetail()
    initReferralRebateDate()
    await initReferralRebateCurrency()
    await getReferralCode()

    await getSummary()
    await getStatement(false)
    await getEvents()

    console.log("test updated")
  } else {
    router.push({ path: "/" })
  }
})
</script>
