<template>
  <div
    id="member-interest"
    class="w-full h-full rounded-lg p-5 phone:p-0 phone:!w-full phone:!max-w-full flex flex-col gap-[.625rem] bg-[var(--bg-11)] phone:bg-transparent"
  >
    <div class="interest-area">
      <!-- 標題區域 -->
      <div class="interest-header">
        <div class="interest-title">
          {{ $t("menu.interest") }}
          <q-btn
            round
            icon="priority_high"
            size="xs"
            class="ml-1 bg-[#FFFFFF73] text-[#1D125D]"
            @click="showDescriptionDialog = true"
          />
        </div>
      </div>

      <!-- 標籤頁切換 -->
      <q-tabs
        v-model="activeTab"
        :outside-arrows="false"
        :mobile-arrows="false"
        indicator-color="transparent"
        class="type-tabs"
      >
        <q-tab name="activity" dense :label="$t('interest.current_activity')" />
        <q-tab name="records" dense :label="$t('interest.details')" />
      </q-tabs>

      <div class="interest-content">
        <!-- 活動頁面 -->
        <template v-if="activeTab === 'activity'">
          <div v-if="isLoading" class="loading-container">
            <q-spinner color="primary" size="3rem" />
          </div>

          <template v-else-if="activityList.length">
            <!-- 活動輪播 (多活動時顯示) -->
            <div class="activity-swiper-container">
              <swiper
                class="activity-swiper"
                :key="isDown.phone ? 'h5' : 'pc'"
                :modules="[SwiperNavigation]"
                slides-per-view="auto"
                :space-between="20"
                :navigation="{
                  nextEl: '.swiper-next',
                  prevEl: '.swiper-prev'
                }"
                :watch-slides-progress="true"
                :centered-slides="activityList.length === 1"
                :loop="activityList.length > 1"
                :loop-additional-slides="2"
                :breakpoints="{
                  0: { autoHeight: true },
                  768: { autoHeight: false }
                }"
                @swiper="onSwiperInit"
                @slideChange="onSlideChange"
              >
                <swiper-slide v-for="(activity, index) in activityList" :key="activity.id">
                  <div
                    class="activity-slide-card"
                    :class="{ 'is-active': currentActivityIndex === index }"
                    @click="selectActivity(index)"
                  >
                    <img
                      :src="getActivityImageUrl(activity)"
                      :alt="getActivityContent(activity)?.title"
                      class="activity-slide-image"
                    />
                    <div class="activity-slide-time">
                      {{ dateformat(activity.start_time, "YYYY-MM-DD HH:mm:ss") }} ~
                      {{ dateformat(activity.end_time, "YYYY-MM-DD HH:mm:ss") }}
                    </div>
                    <div class="activity-slide-title">{{ getActivityContent(activity)?.title }}</div>
                  </div>
                </swiper-slide>
              </swiper>
              <button class="swiper-btn swiper-prev">
                <svg width="10" height="14" viewBox="0 0 10 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M7.66971 0.310741C7.23481 -0.10358 6.52973 -0.10358 6.09472 0.310741L0.651613 5.501C-0.217505 6.32979 -0.21716 7.6727 0.652381 8.50096L6.09873 13.6893C6.53374 14.1036 7.23882 14.1036 7.67383 13.6893C8.10872 13.275 8.10872 12.6032 7.67383 12.1889L3.01223 7.74824C2.57731 7.33395 2.57731 6.66228 3.01223 6.24788L7.66971 1.81111C8.10472 1.39679 8.10472 0.725051 7.66971 0.310741Z"
                    class="fill-[var(--icon-01)]"
                  />
                </svg>
              </button>
              <button class="swiper-btn swiper-next">
                <svg width="10" height="14" viewBox="0 0 10 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M2.33029 0.310741C2.76519 -0.10358 3.47027 -0.10358 3.90528 0.310741L9.34839 5.501C10.2175 6.32979 10.2172 7.6727 9.34762 8.50096L3.90127 13.6893C3.46626 14.1036 2.76118 14.1036 2.32617 13.6893C1.89128 13.275 1.89128 12.6032 2.32617 12.1889L6.98777 7.74824C7.42269 7.33395 7.42269 6.66228 6.98777 6.24788L2.33029 1.81111C1.89528 1.39679 1.89528 0.725051 2.33029 0.310741Z"
                    class="fill-[var(--icon-01)]"
                  />
                </svg>
              </button>
            </div>

            <!-- 單一活動圖片 -->
            <!-- <div v-else class="activity-image-card">
              <img :src="currentActivityImageUrl" :alt="activityContent?.title" />
              <div class="activity-slide-time">
                {{ dateformat(currentActivity?.start_time ?? "", "YYYY-MM-DD HH:mm:ss") }} ~
                {{ dateformat(currentActivity?.end_time ?? "", "YYYY-MM-DD HH:mm:ss") }}
              </div>
              <div class="activity-slide-title">{{ activityContent?.title }}</div>
            </div> -->

            <!-- 當前活動資訊卡片 -->
            <div v-if="currentActivity" class="activity-card">
              <!-- 方案列表 -->
              <div class="plans-section">
                <table class="plans-table">
                  <thead>
                    <!-- 第一層 Header -->
                    <tr class="header-row-1">
                      <th rowspan="2">{{ $t("interest.depositAmount") }}</th>
                      <th :colspan="uniqueDays.length">{{ $t("interest.depositDuration") }}</th>
                    </tr>
                    <!-- 第二層 Header - 天數選項 -->
                    <tr class="header-row-2">
                      <th v-for="day in uniqueDays" :key="day">{{ day }}{{ $t("interest.day") }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="principal in uniquePrincipals"
                      :key="principal"
                      class="data-row"
                      :class="{ 'row-selected': isRowSelected(principal) }"
                    >
                      <td class="principal-cell">{{ principal }}+</td>
                      <td v-for="day in uniqueDays" :key="day" class="rate-cell">
                        {{ getRateByMatrix(principal, day) }}
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td :colspan="uniqueDays.length + 1" class="footer-cell">
                        {{ $t("interest.interestLimit") }} {{ Number(currentActivity.maximum_interest_limit) === 0 ? '--' : currentActivity.maximum_interest_limit }} /
                        {{ $t("interest.withdrawalMultiplier") }} {{ currentActivity.audit_rate }} /
                        {{ $t("interest.supportedCurrency") }}
                        {{ currentActivity.currency_code }}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <!-- 申請區塊 - 雙欄布局 -->
              <div class="apply-section">
                <!-- 左側 - 存放試算 -->
                <div class="calc-card">
                  <div class="card-title">{{ $t("interest.calcTitle") }}</div>
                  <div class="calc-content">
                    <div class="calc-form">
                      <div class="form-group">
                        <label>{{ $t("interest.depositDays") }}</label>
                        <div class="input-with-suffix">
                          <q-input
                            v-model="calcDays"
                            type="number"
                            min="0"
                            step="1"
                            :placeholder="$t('interest.placeholder')"
                            outlined
                            dense
                            class="calc-input"
                            @keydown="(e: KeyboardEvent) => ['-', 'e', 'E', '.'].includes(e.key) && e.preventDefault()"
                            @update:model-value="
                              (val) => {
                                if (val != null && val !== '') {
                                  const n = Math.max(0, Math.floor(Number(val)))
                                  if (Number(val) !== n) calcDays = String(n)
                                }
                              }
                            "
                          />
                          <span class="input-suffix">{{ $t("interest.day") }}</span>
                        </div>
                      </div>
                      <div class="form-group">
                        <label>{{ $t("interest.depositAmount") }}</label>
                        <q-input
                          v-model="calcAmount"
                          type="number"
                          min="0"
                          :placeholder="$t('interest.placeholder')"
                          outlined
                          dense
                          class="calc-input"
                          @keydown="(e: KeyboardEvent) => ['-', 'e', 'E'].includes(e.key) && e.preventDefault()"
                          @update:model-value="
                            (val) => {
                              if (val != null && val !== '' && Number(val) < 0) calcAmount = '0'
                            }
                          "
                        />
                      </div>
                      <q-btn class="calc-btn" @click="handleCalc">
                        {{ $t("interest.calculate") }}
                      </q-btn>
                    </div>
                    <div class="calc-result">
                      <div class="result-item">
                        <div class="result-label">{{ $t("interest.annualRate") }}</div>
                        <div class="result-value">{{ calcResult.rate }}</div>
                      </div>
                      <div class="result-item">
                        <div class="result-label">{{ $t("interest.interestAmount") }}</div>
                        <div class="result-value">{{ calcResult.interest }}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 右側 - 存放本金 -->
                <div class="deposit-card">
                  <div class="card-title">{{ $t("interest.depositTitle") }}</div>
                  <div class="deposit-content">
                    <div class="form-group">
                      <label>{{ $t("interest.depositPrincipal") }}</label>
                      <q-input
                        v-model="applyAmount"
                        type="number"
                        min="0"
                        :placeholder="$t('interest.placeholder')"
                        outlined
                        dense
                        class="deposit-input"
                        @keydown="(e: KeyboardEvent) => ['-', 'e', 'E'].includes(e.key) && e.preventDefault()"
                        @update:model-value="
                          (val) => {
                            if (val != null && val !== '' && Number(val) < 0) applyAmount = '0'
                          }
                        "
                      />
                    </div>
                    <q-btn :loading="isApplying" :disabled="!canApply" class="deposit-btn" @click="handleApply">
                      {{ $t("interest.deposit") }}
                    </q-btn>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <div v-else class="no-data-container">
            <span>{{ $t("interest.noActivity") }}</span>
          </div>
        </template>

        <!-- 記錄頁面 -->
        <template v-else-if="activeTab === 'records'">
          <div class="records-section">
            <div v-if="isRecordsLoading" class="loading-container">
              <q-spinner color="primary" size="3rem" />
            </div>

            <template v-else-if="recordList.length">
              <!-- 記錄卡片列表 -->
              <div class="record-cards">
                <div v-for="record in recordList" :key="record.id" class="record-card">
                  <!-- 卡片頭部 -->
                  <div
                    class="card-header"
                    :class="{ 'is-clickable': isDown.phone }"
                    @click="isDown.phone && toggleCard(record.id)"
                  >
                    <div class="header-left">
                      <div class="activity-name">{{ getRecordTitle(record) }}</div>
                      <div class="apply-time">{{ dateformat(record.apply_time, "YYYY-MM-DD HH:mm:ss") }}</div>
                    </div>
                    <div class="header-right">
                      <div class="principal-amount-row">
                        <div class="principal-amount">{{ record.principal }}</div>
                        <q-icon
                          v-if="isDown.phone"
                          :name="expandedCards.has(record.id) ? 'expand_less' : 'expand_more'"
                          class="expand-icon"
                        />
                      </div>
                      <div class="principal-label">{{ $t("interest.depositAmountLabel") }}</div>
                    </div>
                    <!-- 狀態標籤 -->
                    <div class="status-row">
                      <span class="status-label">{{ $t("interest.status") }}</span>
                      <span class="status-badge" :class="getStatusClass(record.status)">
                        {{ getStatusText(record.status) }}
                      </span>
                    </div>
                  </div>

                  <!-- 卡片內容 -->
                  <div v-show="!isDown.phone || expandedCards.has(record.id)" class="card-body">
                    <div class="detail-row">
                      <span class="detail-label">{{ $t("interest.currencyType") }}</span>
                      <span class="detail-value">{{ record.currency_code }}</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">{{ $t("interest.interestRate") }}</span>
                      <span class="detail-value">{{ record.interest_rate }}%</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">{{ $t("interest.depositDaysLabel") }}</span>
                      <span class="detail-value">{{ record.days }}</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">{{ $t("interest.claimableInterest") }}</span>
                      <span class="detail-value highlight">{{ record.expected_interest }}</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">{{ $t("interest.action") }}</span>
                      <span class="detail-value">
                        <q-btn
                          :disable="record.status !== 1"
                          size="sm"
                          class="redeem-btn"
                          :loading="isRedeeming === record.id"
                          @click="onRedeemClick(record)"
                        >
                          {{ $t("interest.redeem") }}
                        </q-btn>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </template>

            <div v-else class="no-data-container">
              <span>{{ $t("tableHeader.noData") }}</span>
            </div>

            <!-- 分頁 -->
            <q-pagination
              v-if="recordsPagination.totalPage > 1"
              v-model="recordsPagination.page"
              :max="recordsPagination.totalPage"
              :max-pages="5"
              class="custom-pagination"
              color="grey-7"
              direction-links
              @update:model-value="handlePagination"
            />
          </div>
        </template>
      </div>
    </div>
  </div>

  <!-- 領回提示彈窗 -->
  <q-dialog v-model="showRedeemDialog" persistent>
    <q-card class="interest-description-dialog">
      <q-card-section class="dialog-header">
        <span class="w-[33.6px]"></span>
        <span class="dialog-title">{{ $t("interest.return_title") }}</span>
        <q-btn icon="close" flat round dense v-close-popup class="close-btn" />
      </q-card-section>
      <q-card-section class="dialog-content min-principal-content">
        <div class="min-principal-message">
          {{
            pendingRedeemRecord && pendingRedeemRecord.days >= 1
              ? $t("interest.return_rule_2")
              : $t("interest.return_rule_1")
          }}
        </div>
      </q-card-section>
      <q-card-actions class="flex justify-between redemptions-dialog-actions">
        <q-btn class="cancel-btn w-[48%]" outline :label="$t('common.btn.cancel')" v-close-popup />
        <q-btn class="confirm-btn w-[48%]" :label="$t('common.btn.confirm')" @click="confirmRedeem" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!-- 最小存放額度提示彈窗 -->
  <q-dialog v-model="showMinPrincipalDialog" persistent>
    <q-card class="interest-description-dialog">
      <q-card-section class="dialog-header">
        <span class="w-[33.6px]"></span>
        <span class="dialog-title">{{ $t("interest.tip") }}</span>
        <q-btn icon="close" flat round dense v-close-popup class="close-btn" />
      </q-card-section>
      <q-card-section class="dialog-content min-principal-content">
        <div class="min-principal-message">
          {{ $t("interest.minPrincipalError", { principal: minPrincipalValue }) }}
        </div>
      </q-card-section>
      <q-card-actions class="dialog-actions">
        <q-btn class="confirm-btn" :label="$t('common.btn.confirm')" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!-- 利息寶說明彈窗 -->
  <q-dialog v-model="showDescriptionDialog" persistent>
    <q-card class="interest-description-dialog">
      <q-card-section class="dialog-header">
        <span class="w-[33.6px]"></span>
        <span class="dialog-title">{{ activityDescriptionContent?.title || $t("interest.descriptionTitle") }}</span>
        <q-btn icon="close" flat round dense v-close-popup class="close-btn" />
      </q-card-section>
      <q-card-section class="dialog-content">
        <div v-if="activityDescriptionContent?.image_path">
          <img
            :src="buildImageUrl(activityDescriptionContent.image_path)"
            alt="Activity Image"
            class="description-image w-[50%]"
          />
        </div>
        <div
          v-if="activityDescriptionContent?.description"
          v-html="activityDescriptionContent.description"
          class="description-detail"
        />
        <div v-else class="rules-content">
          <p class="rules-title">{{ $t("interest.rule_title") }}</p>
          <p>{{ $t("interest.rule_1") }}</p>
          <p>{{ $t("interest.rule_2") }}</p>
          <p>{{ $t("interest.rule_3") }}</p>
          <p>{{ $t("interest.rule_4") }}</p>
        </div>
      </q-card-section>
      <q-card-actions class="dialog-actions">
        <q-btn class="confirm-btn" :label="$t('common.btn.confirm')" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from "vue"
import { useI18n } from "vue-i18n"
import { Swiper, SwiperSlide } from "swiper/vue"
import { Navigation as SwiperNavigation } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { useInterest } from "src/common/composables/useInterest"
import { useDynamicImage } from "src/common/composables/useDynamicImage"
import dayjs from "dayjs"
import { useEnvInfoStore } from "src/stores/envStore"
import type * as Response from "src/api/response.type"

const { envInfo } = useEnvInfoStore()

const dateformat = (date: string, format = "YYYY-MM-DD HH:mm:ss") => {
  return dayjs(date).utcOffset(envInfo.utc_offset).format(format)
}

const { locale } = useI18n()
const { buildImageUrl } = useDynamicImage()
const { isDown } = useMediaQuery()
const {
  activeTab,
  isLoading,
  isApplying,
  isRecordsLoading,
  isRedeeming,
  activityList,
  currentActivityIndex,
  currentActivity,
  selectedPlan,
  applyAmount,
  activityContent,
  hasMultipleActivities,
  canApply,
  calcDays,
  calcAmount,
  calcResult,
  handleCalc,
  uniqueDays,
  uniquePrincipals,
  getRateByMatrix,
  selectPlanByMatrix,
  selectByPrincipal,
  isRowSelected,
  isPlanSelected,
  recordList,
  recordsPagination,
  tableColumns,
  planColumns,
  showDescriptionDialog,
  activityDescriptionContent,
  showMinPrincipalDialog,
  minPrincipalValue,
  selectPlan,
  getStatusClass,
  getStatusText,
  onSwiperInit,
  onSlideChange,
  selectActivity,
  handleApply,
  handleRedeem,
  handlePagination,
  initInterest
} = useInterest()

// 根據語系取得活動內容
const getActivityContent = (activity: Response.GetInterestActivityList[number]) => {
  const lang = locale.value.toLowerCase()
  return (
    activity.contents.find((c) => c.lang.toLowerCase() === lang) ??
    activity.contents.find((c) => c.lang === "en") ??
    activity.contents[0]
  )
}

// 根據語系取得記錄的活動標題
const getRecordTitle = (record: Response.GetInterestActivityDetailListItem) => {
  const lang = locale.value.toLowerCase()
  return (
    record.contents?.find((c) => c.lang.toLowerCase() === lang)?.title ??
    record.contents?.find((c) => c.lang === "en")?.title ??
    record.activity_name
  )
}

// 手機版收合記錄卡片
const expandedCards = ref(new Set<number>())
const toggleCard = (id: number) => {
  if (expandedCards.value.has(id)) {
    expandedCards.value.delete(id)
  } else {
    expandedCards.value.add(id)
  }
  expandedCards.value = new Set(expandedCards.value)
}

// 取得活動圖片完整 URL
const getActivityImageUrl = (activity: Response.GetInterestActivityList[number]) => {
  const content = getActivityContent(activity)
  return content?.image_path ? buildImageUrl(content.image_path) : ""
}

// 領回確認彈窗
const showRedeemDialog = ref(false)
const pendingRedeemRecord = ref<Response.GetInterestActivityDetailListItem | null>(null)

const onRedeemClick = (record: Response.GetInterestActivityDetailListItem) => {
  pendingRedeemRecord.value = record
  showRedeemDialog.value = true
}

const confirmRedeem = () => {
  showRedeemDialog.value = false
  if (pendingRedeemRecord.value) {
    handleRedeem(pendingRedeemRecord.value.id)
  }
}

// 當前活動的圖片 URL
const currentActivityImageUrl = computed(() => {
  return activityContent.value?.image_path ? buildImageUrl(activityContent.value.image_path) : ""
})

onMounted(() => {
  initInterest()
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";

#member-interest {
  max-width: calc(100% - 12.625rem);
}

.interest-area {
  width: 100%;
  position: relative;

  .interest-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;

    @include phone-width {
      margin-bottom: 0.5rem;
    }

    .interest-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-01);

      @include phone-width {
        font-size: 1rem;
      }
    }
  }

  .type-tabs {
    :deep(.q-tabs__content) {
      justify-content: left;
    }
    :deep(.q-tab) {
      min-width: 6.25rem;
      min-height: auto;
      background: var(--btn-bg-07);
      color: var(--tab-text-01);
      font-size: 0.875rem;
      font-weight: 700;
      border-top-right-radius: 0.5rem;
      border-top-left-radius: 0.5rem;
      padding: 0.5rem 1.25rem;

      @include phone-width {
        min-width: auto;
        flex: 1;
        font-size: 0.75rem;
        padding: 0.5rem 0.75rem;
      }

      &.q-tab--active {
        background: linear-gradient(90deg, var(--btn-bg-01) 0%, var(--btn-bg-02) 100%) !important;
      }
    }
  }

  .interest-content {
    background-color: var(--bg-11);
    color: var(--text-01);
    border-radius: 0.5rem;
    padding: 1.25rem;
    box-shadow: 0px -2px 8px 0px #0000004d;

    @include phone-width {
      padding: 0.625rem;
    }
  }

  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
  }

  // 活動輪播區域
  .activity-swiper-container {
    position: relative;
    margin-bottom: 1.5rem;
    padding: 0 2.5rem;

    @include phone-width {
      padding: 0 1.5rem;
    }

    .activity-swiper {
      :deep(.swiper-slide) {
        width: 280px;
        transition: transform 0.3s ease, opacity 0.3s ease;

        @include phone-width {
          width: 100%;
        }

        &:not(.swiper-slide-active) {
          opacity: 0.5;
          transform: scale(0.9);

          @include phone-width {
            opacity: 1;
            transform: none;
          }
        }
      }
    }

    .activity-slide-card {
      background: #000;
      padding: 0.25rem;
      border-radius: 0.75rem;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s ease;
      border: 2px solid transparent;

      &.is-active {
        border-color: var(--primany-01);
      }

      .activity-slide-image {
        width: 100%;
        height: 160px;
        object-fit: cover;

        @include phone-width {
          height: 120px;
        }
      }

      .activity-slide-time {
        font-size: 0.75rem;
        color: var(--text-03);
        margin-bottom: 0.25rem;
      }

      .activity-slide-title {
        font-size: 1rem;
        font-weight: 600;
        color: var(--text-01);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .swiper-btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 2rem;
      height: 2rem;
      background: var(--bg-08);
      border: none;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 10;
      transition: background 0.2s ease;

      &:hover {
        background: var(--bg-13);
      }

      &.swiper-prev {
        left: 0;
      }

      &.swiper-next {
        right: 0;
      }
    }
  }

  // 單一活動圖片
  .activity-image-card {
    margin-bottom: 1rem;
    border-radius: 0.75rem;
    overflow: hidden;

    img {
      width: 100%;
      height: auto;
      display: block;
    }
  }

  .activity-card {
    background: #25167f;
    border-radius: 0.5rem;
    padding: 1.25rem;
    margin-bottom: 1rem;

    @include phone-width {
      padding: 0.75rem;
      margin-bottom: 0.75rem;
    }

    .activity-info {
      margin-bottom: 1.5rem;

      .activity-name {
        font-size: 1.125rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
      }

      .activity-time,
      .activity-currency {
        font-size: 0.875rem;
        color: var(--text-03);
        margin-bottom: 0.25rem;
      }
    }

    .plans-section {
      margin-bottom: 1.5rem;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;

      @include phone-width {
        margin: 0 -0.625rem 1rem;
        padding: 0 0.625rem;
      }

      .plans-table {
        width: 100%;
        border-collapse: collapse;
        border-radius: 0.75rem;
        overflow: hidden;
        background-color: var(--bg-11);

        @include phone-width {
          width: 100%;
        }

        thead {
          .header-row-1 {
            background: var(--bg-13);

            th {
              color: var(--text-03);
              font-size: 0.875rem;
              font-weight: 700;
              padding: 0.75rem 1rem;
              text-align: center;
              white-space: nowrap;

              @include phone-width {
                font-size: 0.75rem;
                padding: 0.5rem 0.75rem;
              }

              &:first-child {
                border-right: 1px solid var(--bg-line-02);
              }
            }
          }

          .header-row-2 {
            background: var(--bg-13);

            th {
              color: var(--text-03);
              font-size: 0.875rem;
              font-weight: 700;
              padding: 0.75rem 1rem;
              text-align: center;
              white-space: nowrap;

              @include phone-width {
                font-size: 0.75rem;
                padding: 0.5rem 0.75rem;
              }
            }
          }
        }

        tbody {
          background: var(--bg-14);

          .data-row {
            cursor: pointer;
            transition: all 0.2s ease;

            &:hover {
              background: var(--bg-13);
            }

            &.row-selected {
              background: var(--bg-13);
            }

            td {
              color: var(--text-03);
              font-size: 0.875rem;
              font-weight: 400;
              padding: 0.75rem 1rem;
              text-align: center;
              white-space: nowrap;

              @include phone-width {
                font-size: 0.75rem;
                padding: 0.5rem 0.75rem;
              }

              &.principal-cell {
                font-weight: 600;
                color: var(--text-01);
                border-right: 1px solid var(--bg-line-02);
              }

              &.rate-cell {
                transition: all 0.2s ease;

                &:hover {
                  background: var(--bg-13);
                }

                &.cell-selected {
                  background: linear-gradient(90deg, var(--primany-01) 0%, var(--primany-02) 100%);
                  color: var(--btn-text-01);
                  font-weight: 600;
                }
              }
            }
          }
        }

        tfoot {
          .footer-cell {
            background: var(--bg-13);
            color: var(--text-03);
            font-size: 0.75rem;
            padding: 0.75rem 1rem;
            text-align: center;
            border-top: 1px solid var(--bg-line-02);
            white-space: nowrap;

            @include phone-width {
              font-size: 0.625rem;
              padding: 0.5rem 0.75rem;
            }
          }
        }
      }
    }

    .apply-section {
      display: flex;
      gap: 1rem;
      margin-top: 1.5rem;

      @include phone-width {
        flex-direction: column;
        gap: 0.75rem;
        margin-top: 1rem;
      }

      .calc-card,
      .deposit-card {
        flex: 1;
        background: var(--bg-14);
        border-radius: 0.5rem;
        padding: 1rem;

        @include phone-width {
          padding: 0.75rem;
        }

        .card-title {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-01);
          margin-bottom: 1rem;

          @include phone-width {
            font-size: 0.875rem;
            margin-bottom: 0.75rem;
          }
        }

        .form-group {
          margin-bottom: 0.75rem;

          @include phone-width {
            margin-bottom: 0.5rem;
          }

          label {
            display: block;
            font-size: 0.75rem;
            color: var(--text-03);
            margin-bottom: 0.25rem;
          }
        }
      }

      .calc-card {
        .calc-content {
          display: flex;
          gap: 1rem;

          @include phone-width {
            flex-direction: column;
            gap: 0.75rem;
          }
        }

        .calc-form {
          flex: 1;

          .input-with-suffix {
            display: flex;
            align-items: center;
            gap: 0.5rem;

            .calc-input {
              flex: 1;
            }

            .input-suffix {
              color: var(--text-03);
              font-size: 0.875rem;

              @include phone-width {
                font-size: 0.75rem;
              }
            }
          }

          .calc-input {
            :deep(.q-field__control) {
              background: #1a1a2e;
              color: var(--text-01);
              border-radius: 0.25rem;

              @include phone-width {
                min-height: 36px;
              }
            }

            :deep(.q-field__native) {
              color: var(--text-01);

              @include phone-width {
                font-size: 0.875rem;
              }

              &::placeholder {
                color: var(--text-03);
              }
            }
          }

          .calc-btn {
            width: 100%;
            margin-top: 0.5rem;
            background: linear-gradient(90deg, var(--primany-01) 0%, var(--primany-02) 100%) !important;
            color: var(--btn-text-01) !important;
            font-weight: 600;
            padding: 0.625rem;

            @include phone-width {
              padding: 0.5rem;
              font-size: 0.875rem;
            }
          }
        }

        .calc-result {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          min-width: 80px;
          padding: 0.5rem;
          background: #1d125d;
          border-radius: 0.25rem;

          @include phone-width {
            flex-direction: row;
            min-width: auto;
          }

          .result-item {
            flex: 1;
            display: flex;
            flex-direction: column;
            text-align: center;
            border: 1px solid #ff6b35;
            border-radius: 0.25rem;

            .result-label {
              background: #ff6b35;
              color: #fff;
              font-size: 0.75rem;
              font-weight: 600;
              padding: 0.25rem 0.5rem;
              border-radius: 0.25rem 0.25rem 0 0;

              @include phone-width {
                font-size: 0.625rem;
                padding: 0.25rem 0.375rem;
              }
            }

            .result-value {
              flex: 1;
              display: flex;
              align-items: center;
              justify-content: center;
              background: #000;
              color: #ff6b35;
              font-size: 1.25rem;
              font-weight: 700;
              padding: 0.5rem;
              border-radius: 0 0 0.25rem 0.25rem;

              @include phone-width {
                font-size: 1rem;
                padding: 0.375rem;
              }
            }
          }
        }
      }

      .deposit-card {
        .deposit-content {
          height: calc(100% - 2rem);
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          @include phone-width {
            height: auto;
            gap: 0.75rem;
          }
        }

        .deposit-input {
          :deep(.q-field__control) {
            background: #1a1a2e;
            color: var(--text-01);
            border-radius: 0.25rem;

            @include phone-width {
              min-height: 36px;
            }
          }

          :deep(.q-field__native) {
            color: var(--text-01);

            @include phone-width {
              font-size: 0.875rem;
            }

            &::placeholder {
              color: var(--text-03);
            }
          }
        }

        .deposit-btn {
          width: 100%;
          margin-top: auto;
          background: #ff6b35 !important;
          color: #fff !important;
          font-weight: 600;
          padding: 0.75rem;

          @include phone-width {
            margin-top: 0;
            padding: 0.625rem;
            font-size: 0.875rem;
          }
        }
      }
    }
  }

  .activity-description {
    background: var(--bg-14);
    border-radius: 0.5rem;
    padding: 1.25rem;

    .description-title {
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: 1rem;
    }

    .description-content {
      font-size: 0.875rem;
      color: var(--text-03);
      line-height: 1.6;
    }
  }

  .records-section {
    .record-cards {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1rem;

      @include phone-width {
        grid-template-columns: 1fr;
        gap: 0.75rem;
      }
    }

    .record-card {
      background: var(--bg-14);
      border-radius: 0.5rem;
      overflow: hidden;

      .card-header {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: flex-start;
        padding: 0.75rem 1rem;
        background: #ffffff1a;
        gap: 0.5rem;

        @include phone-width {
          padding: 0.625rem 0.75rem;
        }

        .header-left {
          flex: 1;
          min-width: 0;
          overflow: hidden;

          .activity-name {
            color: var(--text-01);
            font-size: 0.875rem;
            font-weight: 600;
            margin-bottom: 0.25rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;

            @include phone-width {
              font-size: 0.8125rem;
            }
          }

          .apply-time {
            color: var(--text-03);
            font-size: 0.625rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }

        &.is-clickable {
          cursor: pointer;
        }

        .header-right {
          text-align: right;
          flex-shrink: 0;

          .principal-amount-row {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            gap: 0.25rem;

            .expand-icon {
              color: var(--text-03);
              font-size: 1.25rem;
            }
          }

          .principal-amount {
            color: var(--text-01);
            font-size: 1rem;
            font-weight: 700;
            white-space: nowrap;

            @include phone-width {
              font-size: 0.9375rem;
            }
          }

          .principal-label {
            color: var(--text-03);
            font-size: 0.625rem;
            white-space: nowrap;
          }
        }

        .status-row {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 0.5rem;
          margin-top: 0.25rem;
          border-top: 1px solid var(--bg-line-02);

          @include phone-width {
            padding-top: 0.375rem;
          }

          .status-label {
            color: var(--text-03);
            font-size: 0.75rem;
            white-space: nowrap;

            @include phone-width {
              font-size: 0.6875rem;
            }
          }

          .status-badge {
            padding: 0.25rem 0.75rem;
            border-radius: 0.25rem;
            font-size: 0.75rem;
            font-weight: 600;
            white-space: nowrap;
            flex-shrink: 0;

            @include phone-width {
              padding: 0.1875rem 0.5rem;
              font-size: 0.6875rem;
            }

            &.text-success {
              background: #ddf6e8;
              color: #009d46;
            }

            &.text-info {
              background: #d2edff;
              color: #008ae6;
            }

            &.text-grey {
              background: #d2edff;
            }
          }
        }
      }

      .card-body {
        padding: 0.5rem 1rem;
        background: #000;

        @include phone-width {
          padding: 0.375rem 0.75rem;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0;
          border-bottom: 1px solid var(--bg-line-02);

          @include phone-width {
            padding: 0.375rem 0;
          }

          &:last-child {
            border-bottom: none;
          }

          .detail-label {
            color: var(--text-03);
            font-size: 0.75rem;

            @include phone-width {
              font-size: 0.6875rem;
            }
          }

          .detail-value {
            color: var(--text-01);
            font-size: 0.875rem;
            font-weight: 600;

            @include phone-width {
              font-size: 0.8125rem;
            }

            &.highlight {
              color: #ff6b35;
            }
          }

          .redeem-btn {
            background: linear-gradient(90deg, var(--primany-01) 0%, var(--primany-02) 100%) !important;
            color: var(--btn-text-01) !important;
            font-size: 0.75rem;
            padding: 0.25rem 0.75rem;
            min-height: 1.5rem;

            @include phone-width {
              font-size: 0.6875rem;
              padding: 0.1875rem 0.5rem;
              min-height: 1.25rem;
            }
          }

          .no-action {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-height: 1.5rem;
            min-width: 2rem;

            @include phone-width {
              min-height: 1.25rem;
            }
          }

          // 確保 detail-value 高度一致
          .detail-value:has(.redeem-btn),
          .detail-value:has(.no-action) {
            min-height: 1.5rem;
            display: flex;
            align-items: center;
            justify-content: flex-end;

            @include phone-width {
              min-height: 1.25rem;
            }
          }

          .action-placeholder {
            color: var(--text-03);
          }
        }
      }
    }

    .custom-pagination {
      margin-top: 1rem;
      justify-content: flex-end;

      @include phone-width {
        justify-content: center;
      }

      :deep(.q-pagination__middle) {
        gap: 2px;

        .q-btn {
          background-color: var(--secondary-08);
          color: var(--text-01);
        }
      }

      :deep(.q-btn) {
        border-radius: 0.35rem;
      }

      :deep(.q-btn--standard) {
        background: linear-gradient(90deg, var(--primany-01) 0%, var(--primany-02) 100%) !important;
        color: var(--text-01) !important;
      }
    }
  }

  .no-data-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 5rem 0;

    @include phone-width {
      padding: 3rem 0;
    }

    span {
      color: var(--text-03);
      font-size: 0.875rem;
      font-weight: 700;

      @include phone-width {
        font-size: 0.75rem;
      }
    }
  }
}

.interest-description-dialog {
  background: var(--bg-11);
  color: var(--text-01);
  min-width: 400px;
  max-width: 600px;
  border-radius: 0.5rem;

  @include phone-width {
    min-width: 90vw;
    max-width: 95vw;
  }

  .dialog-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;

    .dialog-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-01);
    }

    .close-btn {
      color: var(--text-03);
    }
  }

  .dialog-content {
    padding: 1.5rem;
    max-height: 400px;
    overflow-y: auto;
    font-size: 0.875rem;
    line-height: 1.8;
    color: var(--text-03);

    @include phone-width {
      padding: 1rem;
      max-height: 300px;
    }

    .rules-content {
      .rules-title {
        font-weight: 700;
        color: var(--text-01);
        margin-bottom: 0.75rem;
      }

      p {
        margin-bottom: 0.5rem;

        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }

  .dialog-actions {
    padding: 1rem 1.5rem;
    justify-content: center;

    .confirm-btn {
      width: 100%;
      background: #ff6b35 !important;
      color: #fff !important;
      font-weight: 600;
      padding: 0.75rem;
    }
  }
}

.redemptions-dialog-actions {
  .cancel-btn {
    border-color: #f26319;
    color: #f26319 !important;
    font-weight: 600;
  }

  .confirm-btn {
    background: linear-gradient(90deg, #f26319 0%, #d12d00 100%);
    color: #fff !important;
    font-weight: 600;
  }
}
</style>
