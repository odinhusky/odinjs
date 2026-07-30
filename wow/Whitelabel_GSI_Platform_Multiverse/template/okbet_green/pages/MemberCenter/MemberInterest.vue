<template>
  <HeaderTitleBack v-if="isDown.tablet" titleI18n="menu.interest" variant="green-member">
    <div id="member-interest" class="member-interest-page">
      <div class="interest-area">
        <!-- 標題區域 -->
        <div class="interest-header">
          <div class="interest-title">
            {{ $t("menu.interest") }}
          </div>
          <q-btn
            round
            color="primary"
            icon="priority_high"
            size="sm"
            class="hide-hover interest-help-btn"
            @click="showDescriptionDialog = true"
          />
        </div>

        <!-- 標籤頁切換 -->
        <q-tabs
          v-model="activeTab"
          :outside-arrows="false"
          :mobile-arrows="false"
          indicator-color="transparent"
          class="type-tabs mb-4"
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
                  :key="isDown.tablet ? 'h5' : 'pc'"
                  :modules="[SwiperNavigation]"
                  slides-per-view="auto"
                  :space-between="20"
                  :navigation="{
                    nextEl: '.swiper-next',
                    prevEl: '.swiper-prev',
                  }"
                  :watch-slides-progress="true"
                  :centered-slides="activityList.length === 1"
                  :loop="activityList.length > 1"
                  :loop-additional-slides="2"
                  :breakpoints="{
                    0: { autoHeight: true },
                    1024: { autoHeight: false },
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
                  <q-icon name="chevron_left" />
                </button>
                <button class="swiper-btn swiper-next">
                  <q-icon name="chevron_right" />
                </button>
              </div>

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
                      <tr v-for="principal in uniquePrincipals" :key="principal" class="data-row">
                        <td class="principal-cell">{{ principal }}+</td>
                        <td v-for="day in uniqueDays" :key="day" class="rate-cell">
                          {{ getRateByMatrix(principal, day) }}
                        </td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr>
                        <td :colspan="uniqueDays.length + 1" class="footer-cell">
                          {{ $t("interest.interestLimit") }}
                          {{
                            Number(currentActivity.maximum_interest_limit) === 0
                              ? "--"
                              : currentActivity.maximum_interest_limit
                          }}
                          / {{ $t("interest.withdrawalMultiplier") }} {{ currentActivity.audit_rate }} /
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
              <MemberInterestNoData :text="$t('interest.noActivity')" />
            </div>
          </template>

          <!-- 記錄頁面 -->
          <template v-else-if="activeTab === 'records'">
            <div class="records-section">
              <div v-if="isRecordsLoading" class="loading-container">
                <q-spinner color="primary" size="3rem" />
              </div>

              <template v-else-if="displayRecordList.length">
                <!-- 記錄卡片列表 -->
                <div class="record-cards">
                  <div v-for="record in desktopRecordList" :key="record.id" class="record-card">
                    <!-- 卡片頭部 -->
                    <div
                      class="card-header"
                      :class="{ 'is-clickable': isDown.tablet }"
                      @click="isDown.tablet && toggleCard(record.id)"
                    >
                      <div class="header-left">
                        <div class="activity-name">{{ getRecordTitle(record) }}</div>
                        <div class="apply-time">{{ dateformat(record.apply_time, "YYYY-MM-DD HH:mm:ss") }}</div>
                      </div>
                      <div class="header-right">
                        <div class="principal-amount-row">
                          <div class="principal-amount">{{ record.principal }}</div>
                          <q-icon
                            v-if="isDown.tablet"
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
                    <div v-show="!isDown.tablet || expandedCards.has(record.id)" class="card-body">
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

                <q-pagination
                  v-if="desktopRecordTotalPages > 1"
                  v-model="desktopRecordPage"
                  :max="desktopRecordTotalPages"
                  :max-pages="5"
                  class="custom-pagination"
                  color="grey-7"
                  direction-links
                />
              </template>

              <div v-else class="no-data-container">
                <MemberInterestNoData :text="$t('tableHeader.noData')" />
              </div>

              <!-- 分頁 -->
            </div>
          </template>
        </div>
      </div>
    </div>
  </HeaderTitleBack>

  <div v-else id="member-interest" class="member-interest-page">
    <div class="interest-area">
      <!-- 標題區域 -->
      <div class="interest-header">
        <div class="interest-title">
          {{ $t("menu.interest") }}
        </div>
        <q-btn
          round
          color="primary"
          icon="priority_high"
          size="sm"
          class="hide-hover interest-help-btn"
          @click="showDescriptionDialog = true"
        />
      </div>

      <!-- 標籤頁切換 -->
      <q-tabs
        v-model="activeTab"
        :outside-arrows="false"
        :mobile-arrows="false"
        indicator-color="transparent"
        class="type-tabs mb-3"
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
                :key="isDown.tablet ? 'h5' : 'pc'"
                :modules="[SwiperNavigation]"
                slides-per-view="auto"
                :space-between="20"
                :navigation="{
                  nextEl: '.swiper-next',
                  prevEl: '.swiper-prev',
                }"
                :watch-slides-progress="true"
                :centered-slides="activityList.length === 1"
                :loop="activityList.length > 1"
                :loop-additional-slides="2"
                :breakpoints="{
                  0: { autoHeight: true },
                  1024: { autoHeight: false },
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
                <q-icon name="chevron_left" />
              </button>
              <button class="swiper-btn swiper-next">
                <q-icon name="chevron_right" />
              </button>
            </div>

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
                    <tr v-for="principal in uniquePrincipals" :key="principal" class="data-row">
                      <td class="principal-cell">{{ principal }}+</td>
                      <td v-for="day in uniqueDays" :key="day" class="rate-cell">
                        {{ getRateByMatrix(principal, day) }}
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td :colspan="uniqueDays.length + 1" class="footer-cell">
                        {{ $t("interest.interestLimit") }}
                        {{
                          Number(currentActivity.maximum_interest_limit) === 0
                            ? "--"
                            : currentActivity.maximum_interest_limit
                        }}
                        / {{ $t("interest.withdrawalMultiplier") }} {{ currentActivity.audit_rate }} /
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
            <MemberInterestNoData :text="$t('interest.noActivity')" />
          </div>
        </template>

        <!-- 記錄頁面 -->
        <template v-else-if="activeTab === 'records'">
          <div class="records-section">
            <div v-if="isRecordsLoading" class="loading-container">
              <q-spinner color="primary" size="3rem" />
            </div>

            <template v-else-if="displayRecordList.length">
              <div class="records-table-wrapper">
                <table class="records-table">
                  <thead>
                    <tr>
                      <th>{{ $t("interest.activityName") }}</th>
                      <th>{{ $t("interest.depositDays") }}</th>
                      <th>{{ $t("interest.depositAmountLabel") }}</th>
                      <th>{{ $t("interest.currencyType") }}</th>
                      <th>{{ $t("interest.interestRate") }}</th>
                      <th>{{ $t("interest.depositDaysLabel") }}</th>
                      <th>{{ $t("interest.claimableInterest") }}</th>
                      <th>{{ $t("interest.status") }}</th>
                      <th>{{ $t("interest.action") }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="record in desktopRecordList" :key="record.id">
                      <td>{{ getRecordTitle(record) }}</td>
                      <td>{{ dateformat(record.apply_time, "YYYY-MM-DD HH:mm:ss") }}</td>
                      <td>{{ record.principal }}</td>
                      <td>{{ record.currency_code }}</td>
                      <td>{{ record.interest_rate }}%</td>
                      <td>{{ record.days }}</td>
                      <td>{{ record.expected_interest }}</td>
                      <td>
                        <span class="status-badge" :class="getStatusClass(record.status)">
                          {{ getStatusText(record.status) }}
                        </span>
                      </td>
                      <td>
                        <q-btn
                          :disable="record.status !== 1"
                          size="sm"
                          class="redeem-btn"
                          :loading="isRedeeming === record.id"
                          @click="onRedeemClick(record)"
                        >
                          {{ $t("interest.redeem") }}
                        </q-btn>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </template>

            <div v-else class="no-data-container">
              <MemberInterestNoData :text="$t('tableHeader.noData')" />
            </div>

            <!-- 分頁 -->
            <q-pagination
              v-if="desktopRecordTotalPages > 1"
              v-model="desktopRecordPage"
              :max="desktopRecordTotalPages"
              :max-pages="5"
              class="custom-pagination"
              color="grey-7"
              direction-links
            />
          </div>
        </template>
      </div>
    </div>
  </div>

  <MemberInterestRedeemDialog
    v-model="showRedeemDialog"
    :is-under-one-day="isPendingRedeemUnderOneDay"
    @confirm="confirmRedeem"
  />
  <MemberInterestMinPrincipalDialog v-model="showMinPrincipalDialog" :principal="minPrincipalValue" />
  <MemberInterestDescriptionDialog v-model="showDescriptionDialog" :content="activityDescriptionContent" />
</template>

<script lang="ts" setup>
import "swiper/css"
import "swiper/css/navigation"

import dayjs from "dayjs"
import type * as Response from "src/api/response.type"
import HeaderTitleBack from "src/common/components/modal/HeaderTitleBack.vue"
import { useDynamicImage } from "src/common/composables/useDynamicImage"
import { useInterest } from "src/common/composables/useInterest"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { useEnvInfoStore } from "src/stores/envStore"
import { Navigation as SwiperNavigation } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/vue"
import { computed, onMounted, ref, watch } from "vue"
import { useI18n } from "vue-i18n"

import MemberInterestDescriptionDialog from "./components/MemberInterestDescriptionDialog.vue"
import MemberInterestMinPrincipalDialog from "./components/MemberInterestMinPrincipalDialog.vue"
import MemberInterestNoData from "./components/MemberInterestNoData.vue"
import MemberInterestRedeemDialog from "./components/MemberInterestRedeemDialog.vue"

const { envInfo } = useEnvInfoStore()

const dateformat = (date: string, format = "YYYY-MM-DD HH:mm:ss") => {
  return dayjs(date).utcOffset(envInfo.utc_offset).format(format)
}

const { locale } = useI18n()
const { buildImageUrl } = useDynamicImage()
const { isDown } = useMediaQuery()

/*
const mockRecordList: Response.GetInterestActivityDetailListItem[] = [
  {
    id: 9001,
    activity_name: "August Interest Campaign",
    principal: "500",
    days: 1,
    interest_rate: "5",
    expected_interest: "0.05",
    apply_time: dayjs().subtract(12, "hour").format("YYYY-MM-DD HH:mm:ss"),
    currency_code: "USD",
    status: 1,
    contents: [
      {
        lang: "en",
        title: "August Interest Campaign",
        detail: "",
        image_path: "",
      },
      {
        lang: "zh-tw",
        title: "August Interest Campaign",
        detail: "",
        image_path: "",
      },
    ],
  },
  {
    id: 9002,
    activity_name: "August Interest Campaign",
    principal: "1000",
    days: 1,
    interest_rate: "5",
    expected_interest: "0.14",
    apply_time: dayjs().subtract(30, "hour").format("YYYY-MM-DD HH:mm:ss"),
    currency_code: "USD",
    status: 1,
    contents: [
      {
        lang: "en",
        title: "August Interest Campaign",
        detail: "",
        image_path: "",
      },
      {
        lang: "zh-tw",
        title: "August Interest Campaign",
        detail: "",
        image_path: "",
      },
    ],
  },
  {
    id: 9003,
    activity_name: "August Interest Campaign",
    principal: "1000",
    days: 7,
    interest_rate: "5",
    expected_interest: "0.96",
    apply_time: "2025-08-12 17:20:22",
    currency_code: "USD",
    status: 2,
    contents: [
      {
        lang: "en",
        title: "August Interest Campaign",
        detail: "",
        image_path: "",
      },
      {
        lang: "zh-tw",
        title: "August Interest Campaign",
        detail: "",
        image_path: "",
      },
    ],
  },
  {
    id: 9004,
    activity_name: "VIP Interest Trial",
    principal: "2500",
    days: 30,
    interest_rate: "6",
    expected_interest: "12.32",
    apply_time: "2025-08-02 17:00:20",
    currency_code: "USD",
    status: 5,
    contents: [
      {
        lang: "en",
        title: "VIP Interest Trial",
        detail: "",
        image_path: "",
      },
      {
        lang: "zh-tw",
        title: "VIP Interest Trial",
        detail: "",
        image_path: "",
      },
    ],
  },
  {
    id: 9005,
    activity_name: "September Interest Campaign",
    principal: "800",
    days: 3,
    interest_rate: "5",
    expected_interest: "0.33",
    apply_time: "2025-09-03 11:18:06",
    currency_code: "USD",
    status: 2,
    contents: [
      {
        lang: "en",
        title: "September Interest Campaign",
        detail: "",
        image_path: "",
      },
      {
        lang: "zh-tw",
        title: "September Interest Campaign",
        detail: "",
        image_path: "",
      },
    ],
  },
  {
    id: 9006,
    activity_name: "September Interest Campaign",
    principal: "1200",
    days: 7,
    interest_rate: "5",
    expected_interest: "1.15",
    apply_time: "2025-09-04 09:12:30",
    currency_code: "USD",
    status: 1,
    contents: [
      {
        lang: "en",
        title: "September Interest Campaign",
        detail: "",
        image_path: "",
      },
      {
        lang: "zh-tw",
        title: "September Interest Campaign",
        detail: "",
        image_path: "",
      },
    ],
  },
  {
    id: 9007,
    activity_name: "Holiday Interest Bonus",
    principal: "3000",
    days: 14,
    interest_rate: "6",
    expected_interest: "6.9",
    apply_time: "2025-09-08 15:45:12",
    currency_code: "USD",
    status: 2,
    contents: [
      {
        lang: "en",
        title: "Holiday Interest Bonus",
        detail: "",
        image_path: "",
      },
      {
        lang: "zh-tw",
        title: "Holiday Interest Bonus",
        detail: "",
        image_path: "",
      },
    ],
  },
  {
    id: 9008,
    activity_name: "Holiday Interest Bonus",
    principal: "5000",
    days: 30,
    interest_rate: "7",
    expected_interest: "28.77",
    apply_time: "2025-09-12 20:05:44",
    currency_code: "USD",
    status: 5,
    contents: [
      {
        lang: "en",
        title: "Holiday Interest Bonus",
        detail: "",
        image_path: "",
      },
      {
        lang: "zh-tw",
        title: "Holiday Interest Bonus",
        detail: "",
        image_path: "",
      },
    ],
  },
]
*/

const {
  activeTab,
  isLoading,
  isApplying,
  isRecordsLoading,
  isRedeeming,
  activityList,
  currentActivityIndex,
  currentActivity,
  applyAmount,
  canApply,
  calcDays,
  calcAmount,
  calcResult,
  handleCalc,
  uniqueDays,
  uniquePrincipals,
  getRateByMatrix,
  recordList,
  showDescriptionDialog,
  activityDescriptionContent,
  showMinPrincipalDialog,
  minPrincipalValue,
  getStatusClass,
  getStatusText,
  onSwiperInit,
  onSlideChange,
  selectActivity,
  handleApply,
  handleRedeem,
  initInterest,
} = useInterest()

const ACTIVE_TAB_STORAGE_KEY = "okbet_green_member_interest_active_tab"
const isInterestTab = (tab: string): tab is "activity" | "records" => ["activity", "records"].includes(tab)

if (typeof window !== "undefined") {
  const storedTab = window.sessionStorage.getItem(ACTIVE_TAB_STORAGE_KEY)
  if (storedTab && isInterestTab(storedTab)) {
    activeTab.value = storedTab
  }
}

watch(activeTab, (tab) => {
  if (typeof window !== "undefined" && isInterestTab(tab)) {
    window.sessionStorage.setItem(ACTIVE_TAB_STORAGE_KEY, tab)
  }
})

const getActivityContent = (activity: Response.GetInterestActivityList[number]) => {
  const lang = locale.value.toLowerCase()
  return (
    activity.contents.find((c) => c.lang.toLowerCase() === lang) ??
    activity.contents.find((c) => c.lang === "en") ??
    activity.contents[0]
  )
}

const getRecordTitle = (record: Response.GetInterestActivityDetailListItem) => {
  const lang = locale.value.toLowerCase()
  return (
    record.contents?.find((c) => c.lang.toLowerCase() === lang)?.title ??
    record.contents?.find((c) => c.lang === "en")?.title ??
    record.activity_name
  )
}

const displayRecordList = computed(() => {
  return recordList.value
})

const desktopRecordPageSize = 7
const desktopRecordPage = ref(1)
const desktopRecordTotalPages = computed(() => Math.ceil(displayRecordList.value.length / desktopRecordPageSize))
const desktopRecordList = computed(() => {
  const start = (desktopRecordPage.value - 1) * desktopRecordPageSize
  return displayRecordList.value.slice(start, start + desktopRecordPageSize)
})

watch(
  () => displayRecordList.value.length,
  () => {
    desktopRecordPage.value = 1
  }
)

const expandedCards = ref(new Set<number>())
const toggleCard = (id: number) => {
  if (expandedCards.value.has(id)) {
    expandedCards.value.delete(id)
  } else {
    expandedCards.value.add(id)
  }
  expandedCards.value = new Set(expandedCards.value)
}

const getActivityImageUrl = (activity: Response.GetInterestActivityList[number]) => {
  const content = getActivityContent(activity)
  return content?.image_path ? buildImageUrl(content.image_path) : ""
}

const showRedeemDialog = ref(false)
const pendingRedeemRecord = ref<Response.GetInterestActivityDetailListItem | null>(null)

const isPendingRedeemUnderOneDay = computed(() => {
  if (!pendingRedeemRecord.value?.apply_time) return false

  return dayjs().diff(dayjs(pendingRedeemRecord.value.apply_time), "hour", true) < 24
})

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

onMounted(() => {
  initInterest()
})
</script>

<style scoped lang="scss">
@use "sass:color";
@import "src/common/css/_variable.sass";
@import "app/template/okbet_green/assets/css/_variable.sass";

.member-interest-page {
  width: 100%;
  min-height: 100%;
  padding: 4.375rem 3.125rem 1.875rem;
  background: $background-light-color;

  @include tablet-width {
    @apply px-3 py-2.5;
  }
}

.interest-area {
  width: 100%;
  max-width: 61.25rem;
  background: $background-light-color;
  border-radius: 0;
  padding: 0;

  .interest-header {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1.5rem;

    @include tablet-width {
      gap: 0.875rem;
    }

    .interest-title {
      font-family: OpenSans;
      font-size: 3.125rem;
      line-height: 1;
      font-weight: 700;
      color: rgba(0, 0, 0, 0.8);

      @include tablet-width {
        font-size: 1rem;
      }
    }

    .interest-help-btn {
      flex: 0 0 auto;
      width: 1.5rem;
      height: 1.5rem;
      min-width: 1.5rem;
      min-height: 1.5rem;
      padding: 0;
      background: $primary-color !important;
      color: #fff !important;

      @include tablet-width {
        width: 1.25rem;
        height: 1.25rem;
        min-width: 1.25rem;
        min-height: 1.25rem;
      }

      :deep(.q-icon) {
        font-size: 1rem;

        @include tablet-width {
          font-size: 0.875rem;
        }
      }
    }
  }

  .type-tabs {
    border-bottom: 1px solid $border-pale-gray-color;

    :deep(.q-tabs__content) {
      justify-content: flex-start;
    }

    :deep(.q-tabs__content--align-justify .q-tab) {
      flex: 1 1 0;
    }

    :deep(.q-tab) {
      flex: 1 1 0;
      min-width: 0;
      min-height: 3rem;
      background: transparent;
      color: $text-gray;

      border-radius: 0;
      border-bottom: 2px solid transparent;
      padding: 0;

      & .q-tab__label {
        font-size: 1.25rem;
        font-weight: 400;
        line-height: 1;
      }

      @include pad-width {
        min-height: 3rem;
      }

      &.q-tab--active {
        background: transparent !important;
        color: $primary-color !important;
        border-bottom-color: $primary-color;

        & .q-tab__label {
          font-weight: 700;
        }
      }
    }
  }

  .interest-content {
    background-color: #fff;
    color: $text-charcoal-gray-color;
    border: 2px solid $border-kyc-color;
    border-radius: 0.875rem;
    min-height: 31rem;
    padding: 1.25rem;
    box-shadow: none;

    @include tablet-width {
      @apply p-3;
      border-width: 1px;
      border-radius: 0.5rem;
      min-height: 21rem;
    }
  }

  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
  }

  .activity-swiper-container {
    position: relative;
    margin-bottom: 1.5rem;
    padding: 0 2.5rem;

    @include tablet-width {
      padding: 0 1.5rem;
    }

    .activity-swiper {
      :deep(.swiper-slide) {
        width: 280px;
        transition: transform 0.3s ease, opacity 0.3s ease;

        @include tablet-width {
          width: 100%;
        }

        &:not(.swiper-slide-active) {
          opacity: 0.5;
          transform: scale(0.9);

          @include tablet-width {
            opacity: 1;
            transform: none;
          }
        }
      }
    }

    .activity-slide-card {
      background: $background-pale-silver-color;
      padding: 0.5rem;
      border-radius: 0.75rem;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s ease;
      border: 2px solid transparent;

      &.is-active {
        border-color: $primary-color;
      }

      .activity-slide-image {
        width: 100%;
        height: 160px;
        object-fit: cover;
        border-radius: 0.5rem;

        @include tablet-width {
          height: 120px;
        }
      }

      .activity-slide-time {
        font-size: 0.75rem;
        color: $text-smoke-gray-color;
        margin: 0.5rem 0 0.25rem;
      }

      .activity-slide-title {
        font-size: 1rem;
        font-weight: 600;
        color: $text-charcoal-gray-color;
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
      background: #31725b;
      border: none;
      // border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 10;
      color: #fff;
      transition: background 0.2s ease;

      &:hover {
        background: color.adjust(#31725b, $lightness: -10%);
      }

      &.swiper-prev {
        left: 0;
      }

      &.swiper-next {
        right: 0;
      }
    }
  }

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
    background: $background-pale-silver-color;
    border-radius: 0.5rem;
    padding: 1.25rem;
    margin-bottom: 1rem;

    @include tablet-width {
      padding: 0.75rem;
      margin-bottom: 0.75rem;
    }

    .plans-section {
      margin-bottom: 1.5rem;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;

      @include tablet-width {
        margin: 0 -0.5rem 1rem;
        padding: 0 0.5rem;
      }

      .plans-table {
        width: 100%;
        border-collapse: collapse;
        border-radius: 0.5rem;
        overflow: hidden;
        background-color: #fff;

        @include tablet-width {
          width: 100%;
        }

        thead {
          .header-row-1,
          .header-row-2 {
            background: $bg-primary;

            th {
              color: #fff;
              font-size: 0.875rem;
              font-weight: 600;
              padding: 0.75rem 1rem;
              text-align: center;
              white-space: nowrap;

              @include tablet-width {
                font-size: 0.75rem;
                padding: 0.5rem 0.75rem;
              }

              &:first-child {
                border-right: 1px solid rgba(255, 255, 255, 0.2);
              }
            }
          }
        }

        tbody {
          .data-row {
            transition: all 0.2s ease;

            &:hover {
              background: $background-pale-silver-color;
            }

            &:nth-child(even) {
              background: #f9fafb;
            }

            td {
              color: $text-charcoal-gray-color;
              font-size: 0.875rem;
              font-weight: 400;
              padding: 0.75rem 1rem;
              text-align: center;
              white-space: nowrap;
              border-bottom: 1px solid $border-pale-gray-color;

              @include tablet-width {
                font-size: 0.75rem;
                padding: 0.5rem 0.75rem;
              }

              &.principal-cell {
                font-weight: 600;
                // color: $text-charcoal-gray-color;
                color: $text-gray-fourth;
                border-right: 1px solid $border-pale-gray-color;
              }

              &.rate-cell {
                // color: $primary-color;
                color: $text-gray-fourth;
                font-weight: 600;
              }
            }
          }
        }

        tfoot {
          .footer-cell {
            background: $background-pale-silver-color;
            color: $text-smoke-gray-color;
            font-size: 0.75rem;
            padding: 0.75rem 1rem;
            text-align: center;
            border-top: 1px solid $border-pale-gray-color;
            white-space: nowrap;

            @include tablet-width {
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

      @include tablet-width {
        flex-direction: column;
        gap: 0.75rem;
        margin-top: 1rem;
      }

      .calc-card,
      .deposit-card {
        flex: 1;
        background: #fff;
        border-radius: 0.5rem;
        padding: 1rem;
        border: 1px solid $border-pale-gray-color;

        @include tablet-width {
          padding: 0.75rem;
        }

        .card-title {
          font-size: 1rem;
          font-weight: 600;
          color: $text-charcoal-gray-color;
          margin-bottom: 1rem;

          @include tablet-width {
            font-size: 0.875rem;
            margin-bottom: 0.75rem;
          }
        }

        .form-group {
          margin-bottom: 0.75rem;

          @include tablet-width {
            margin-bottom: 0.5rem;
          }

          label {
            display: block;
            font-size: 0.75rem;
            color: $text-smoke-gray-color;
            margin-bottom: 0.25rem;
          }
        }
      }

      .calc-card {
        .calc-content {
          display: flex;
          gap: 1rem;

          @include tablet-width {
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
              color: $text-smoke-gray-color;
              font-size: 0.875rem;

              @include tablet-width {
                font-size: 0.75rem;
              }
            }
          }

          .calc-input {
            :deep(.q-field__control) {
              min-height: 2.4375rem;
              background: rgba(118, 118, 128, 0.12);
              color: $text-charcoal-gray-color;
              border: 1px solid #cadd9c;
              border-radius: 0.625rem;
              box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);
              padding: 0 0.875rem;

              @include tablet-width {
                min-height: 36px;
              }
            }

            :deep(.q-field__control::before),
            :deep(.q-field__control::after) {
              display: none;
            }

            :deep(.q-field__native) {
              color: $text-charcoal-gray-color;

              @include tablet-width {
                font-size: 0.875rem;
              }

              &::placeholder {
                color: $text-smoke-gray-color;
              }
            }
          }

          .calc-btn {
            width: 100%;
            margin-top: 0.5rem;
            background: $primary-color !important;
            color: #fff !important;
            font-weight: 600;
            padding: 0.625rem;

            @include tablet-width {
              padding: 0.5rem;
              font-size: 0.875rem;
            }
          }
        }

        .calc-result {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          min-width: 100px;

          @include tablet-width {
            flex-direction: row;
            min-width: auto;
          }

          .result-item {
            flex: 1;
            display: flex;
            flex-direction: column;
            text-align: center;
            border-radius: 0.25rem;
            overflow: hidden;

            .result-label {
              background: $bg-primary;
              color: #fff;
              font-size: 0.75rem;
              font-weight: 600;
              padding: 0.25rem 0.5rem;

              @include tablet-width {
                font-size: 0.625rem;
                padding: 0.25rem 0.375rem;
              }
            }

            .result-value {
              flex: 1;
              display: flex;
              align-items: center;
              justify-content: center;
              border: 1px solid $bg-dark-tertiary;
              border-top: none;
              border-radius: 0 0 0.25rem 0.25rem;
              background: #fff;
              color: $bg-primary;
              font-size: 1.25rem;
              font-weight: 700;
              padding: 0.5rem;

              @include tablet-width {
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

          @include tablet-width {
            height: auto;
            gap: 0.75rem;
          }
        }

        .deposit-input {
          :deep(.q-field__control) {
            min-height: 2.4375rem;
            background: rgba(118, 118, 128, 0.12);
            color: $text-charcoal-gray-color;
            border: 1px solid #cadd9c;
            border-radius: 0.625rem;
            box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);
            padding: 0 0.875rem;

            @include tablet-width {
              min-height: 36px;
            }
          }

          :deep(.q-field__control::before),
          :deep(.q-field__control::after) {
            display: none;
          }

          :deep(.q-field__native) {
            color: $text-charcoal-gray-color;

            @include tablet-width {
              font-size: 0.875rem;
            }

            &::placeholder {
              color: $text-smoke-gray-color;
            }
          }
        }

        .deposit-btn {
          width: 100%;
          margin-top: auto;
          // background: $text-mint-green-color !important;
          background: $bg-light !important;

          color: #fff !important;
          font-weight: 600;
          padding: 0.75rem;

          @include tablet-width {
            margin-top: 0;
            padding: 0.625rem;
            font-size: 0.875rem;
          }

          &:disabled {
            opacity: 0.5;
          }
        }
      }
    }
  }

  .records-section {
    .records-table-wrapper {
      width: 100%;
      overflow-x: auto;
    }

    .records-table {
      width: 100%;
      min-width: 760px;
      border-collapse: collapse;
      color: $text-charcoal-gray-color;
      font-size: 0.875rem;

      th {
        padding: 0.875rem 0.5rem;
        background: $bg-primary;
        color: #fff;
        font-weight: 600;
        text-align: center;
        white-space: nowrap;
      }

      td {
        padding: 0.875rem 0.5rem;
        border-bottom: 1px solid $border-pale-gray-color;
        text-align: center;
        vertical-align: middle;
      }

      th:nth-last-child(-n + 2),
      td:nth-last-child(-n + 2) {
        min-width: 5.25rem;
      }

      tbody tr:last-child td {
        border-bottom: none;
      }

      .highlight {
        color: $text-mint-green-color;
        font-weight: 600;
      }
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: auto;
      min-height: 1.5rem;
      padding: 0.1875rem 0.625rem;
      border-radius: 0.375rem;
      font-size: 0.75rem;
      font-weight: 400;
      white-space: nowrap;

      &.text-success {
        background: #ddf6e8d9;
        color: $text-green;
      }

      &.text-info {
        background: #ffe4d2d9;
        color: $text-orange !important;
      }

      &.text-grey {
        background: #d2edff;
      }
    }

    .desktop-record-cards-hidden {
      display: none;
    }

    .record-cards {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1rem;

      @include tablet-width {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }
    }

    .record-card {
      background: #fff;
      border-radius: 0.5rem;
      overflow: hidden;
      border: 1px solid $border-pale-gray-color;

      @include tablet-width {
        // background: $table-content-color;
        border-radius: 0.75rem;
      }

      .card-header {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: flex-start;
        padding: 0.75rem 1rem;
        background: #f3f8f4;
        gap: 0.5rem;

        @include tablet-width {
          padding: 0.625rem 0.75rem;
        }

        .header-left {
          flex: 1;
          min-width: 0;
          overflow: hidden;

          .activity-name {
            color: $text-charcoal-gray-color;
            font-size: 0.875rem;
            font-weight: 700;
            margin-bottom: 0.25rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;

            @include tablet-width {
              font-size: 0.8125rem;
            }
          }

          .apply-time {
            color: $text-smoke-gray-color;
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
          display: grid;
          grid-template-columns: minmax(0, auto) auto;
          column-gap: 0.5rem;
          text-align: right;
          flex-shrink: 0;

          .principal-amount-row {
            display: contents;

            .expand-icon {
              grid-column: 2;
              grid-row: 1 / span 2;
              align-self: center;
              font-size: 1.25rem;
              color: $primary-color;
            }
          }

          .principal-amount {
            grid-column: 1;
            color: $text-gray-fourth;
            font-size: 0.875rem;
            font-weight: 700;
            white-space: nowrap;
          }

          .principal-label {
            grid-column: 1;
            color: $text-smoke-gray-color;
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
          border-top: 1px solid $border-pale-gray-color;

          @include tablet-width {
            padding-top: 0.375rem;
          }

          .status-label {
            color: $text-smoke-gray-color;
            font-size: 0.75rem;
            white-space: nowrap;

            @include tablet-width {
              font-size: 0.6875rem;
            }
          }

          .status-badge {
            padding: 0.25rem 0.75rem;
            border-radius: 0.25rem;
            font-size: 0.75rem;
            font-weight: 400;
            white-space: nowrap;
            flex-shrink: 0;

            @include tablet-width {
              padding: 0.1875rem 0.5rem;
              font-size: 0.6875rem;
            }

            &.text-success {
              background: #ddf6e8d9;
              color: $text-green;
            }

            &.text-info {
              background: #ffe4d2d9;
              color: $text-orange !important;
            }
            &.text-grey {
              background: #d2edff;
            }
          }
        }
      }

      .card-body {
        padding: 0.5rem 1rem;

        @include tablet-width {
          background: $table-content-color;
          padding: 0.375rem 0.75rem;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0;
          border-bottom: 1px solid $border-pale-gray-color;

          @include tablet-width {
            padding: 0.375rem 0;
          }

          &:last-child {
            border-bottom: none;
          }

          .detail-label {
            color: $text-smoke-gray-color;
            font-size: 0.75rem;

            @include tablet-width {
              font-size: 0.6875rem;
            }
          }

          .detail-value {
            color: $text-charcoal-gray-color;
            font-size: 0.875rem;
            font-weight: 600;

            @include tablet-width {
              font-size: 0.8125rem;
            }

            &.highlight {
              color: $text-charcoal-gray-color;
            }
          }

          .no-action {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-height: 1.5rem;
            min-width: 2rem;

            @include tablet-width {
              min-height: 1.25rem;
            }
          }
        }
      }
    }

    .custom-pagination {
      margin-top: 1rem;
      justify-content: flex-end;

      @include tablet-width {
        justify-content: center;
      }

      :deep(.q-pagination__content) {
        gap: 0.5rem;
      }

      :deep(.q-btn) {
        width: 1.5rem;
        height: 1.5rem;
        min-width: 1.5rem;
        min-height: 1.5rem;
        padding: 0;
        border-radius: 0;
        background: transparent !important;
        color: rgba(0, 0, 0, 0.8) !important;
        font-family: OpenSans;
        font-size: 0.875rem;
        font-weight: 700;
        line-height: 1;
        box-shadow: none !important;
      }

      :deep(.q-btn::before),
      :deep(.q-focus-helper) {
        display: none;
      }

      :deep(.q-btn .q-icon) {
        color: #7a7f85;
        font-size: 1.5rem;
      }

      :deep(.q-btn.bg-grey-7),
      :deep(.q-btn.bg-primary),
      :deep(.q-btn.text-white),
      :deep(.q-btn[aria-current="true"]) {
        background: transparent !important;
        color: $primary-color !important;
      }
    }
  }

  .no-data-container {
    width: 100%;
    min-height: 28rem;

    @include tablet-width {
      min-height: 20rem;
    }
  }
}

.redeem-btn {
  min-width: auto;
  min-height: 1.5rem;
  padding: 0;
  border: 0 !important;
  background: transparent !important;
  color: $primary-color !important;
  font-size: 1rem !important;
  font-weight: 400;
  box-shadow: none !important;
  text-decoration: none;

  @include tablet-width {
    font-size: 0.875rem !important;
  }

  &::before {
    display: none;
  }

  :deep(.q-focus-helper) {
    display: none;
  }

  :deep(.q-btn__content) {
    color: inherit;
  }
}
</style>
