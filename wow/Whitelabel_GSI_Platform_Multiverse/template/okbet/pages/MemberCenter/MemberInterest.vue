<template>
  <HeaderTitleBack v-if="isDown.phone" titleI18n="menu.interest">
  <div id="member-interest" class="member-interest-page">
    <div class="interest-area">
      <!-- 標題區域 -->
      <div class="interest-header">
        <div class="interest-title">
          {{ $t("menu.interest") }}
          <q-btn round color="primary" icon="priority_high" size="xs" class="ml-1 hide-hover" @click="showDescriptionDialog = true" />
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
                  <div class="activity-slide-card" :class="{ 'is-active': currentActivityIndex === index }" @click="selectActivity(index)">
                    <img
                      :src="getActivityImageUrl(activity)"
                      :alt="getActivityContent(activity)?.title"
                      class="activity-slide-image"
                    />
                    <div class="activity-slide-time">{{ dateformat(activity.start_time, 'YYYY-MM-DD HH:mm:ss') }} ~ {{ dateformat(activity.end_time, 'YYYY-MM-DD HH:mm:ss') }}</div>
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
                    <tr
                      v-for="principal in uniquePrincipals"
                      :key="principal"
                      class="data-row"
                    >
                      <td class="principal-cell">{{ principal }}+</td>
                      <td
                        v-for="day in uniqueDays"
                        :key="day"
                        class="rate-cell"
                      >
                        {{ getRateByMatrix(principal, day) }}
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td :colspan="uniqueDays.length + 1" class="footer-cell">
                        {{ $t("interest.interestLimit") }} {{ Number(currentActivity.maximum_interest_limit) === 0 ? '--' : currentActivity.maximum_interest_limit }} /
                        {{ $t("interest.withdrawalMultiplier") }} {{ currentActivity.audit_rate }} / {{ $t("interest.supportedCurrency") }}
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
                            @update:model-value="(val) => { if (val != null && val !== '') { const n = Math.max(0, Math.floor(Number(val))); if (Number(val) !== n) calcDays = String(n) } }"
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
                          @update:model-value="(val) => { if (val != null && val !== '' && Number(val) < 0) calcAmount = '0' }"
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
                        @update:model-value="(val) => { if (val != null && val !== '' && Number(val) < 0) applyAmount = '0' }"
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
                      <div class="apply-time">{{ dateformat(record.apply_time, 'YYYY-MM-DD HH:mm:ss') }}</div>
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
  </HeaderTitleBack>

  <div v-else id="member-interest" class="member-interest-page">
    <div class="interest-area">
      <!-- 標題區域 -->
      <div class="interest-header">
        <div class="interest-title">
          {{ $t("menu.interest") }}
          <q-btn round color="primary" icon="priority_high" size="xs" class="ml-1 hide-hover" @click="showDescriptionDialog = true" />
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
                  <div class="activity-slide-card" :class="{ 'is-active': currentActivityIndex === index }" @click="selectActivity(index)">
                    <img
                      :src="getActivityImageUrl(activity)"
                      :alt="getActivityContent(activity)?.title"
                      class="activity-slide-image"
                    />
                    <div class="activity-slide-time">{{ dateformat(activity.start_time, 'YYYY-MM-DD HH:mm:ss') }} ~ {{ dateformat(activity.end_time, 'YYYY-MM-DD HH:mm:ss') }}</div>
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
                    <tr
                      v-for="principal in uniquePrincipals"
                      :key="principal"
                      class="data-row"
                    >
                      <td class="principal-cell">{{ principal }}+</td>
                      <td
                        v-for="day in uniqueDays"
                        :key="day"
                        class="rate-cell"
                      >
                        {{ getRateByMatrix(principal, day) }}
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td :colspan="uniqueDays.length + 1" class="footer-cell">
                        {{ $t("interest.interestLimit") }} {{ Number(currentActivity.maximum_interest_limit) === 0 ? '--' : currentActivity.maximum_interest_limit }} /
                        {{ $t("interest.withdrawalMultiplier") }} {{ currentActivity.audit_rate }} / {{ $t("interest.supportedCurrency") }}
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
                            @update:model-value="(val) => { if (val != null && val !== '') { const n = Math.max(0, Math.floor(Number(val))); if (Number(val) !== n) calcDays = String(n) } }"
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
                          @update:model-value="(val) => { if (val != null && val !== '' && Number(val) < 0) calcAmount = '0' }"
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
                        @update:model-value="(val) => { if (val != null && val !== '' && Number(val) < 0) applyAmount = '0' }"
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
                      <div class="apply-time">{{ dateformat(record.apply_time, 'YYYY-MM-DD HH:mm:ss') }}</div>
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
          {{ pendingRedeemRecord && pendingRedeemRecord.days >= 1 ? $t("interest.return_rule_2") : $t("interest.return_rule_1") }}
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
import { onMounted, ref } from "vue"
import { useI18n } from "vue-i18n"
import { Swiper, SwiperSlide } from "swiper/vue"
import { Navigation as SwiperNavigation } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import HeaderTitleBack from "src/common/components/modal/HeaderTitleBack.vue"
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
  recordsPagination,
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
  handlePagination,
  initInterest
} = useInterest()

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
@import "app/template/okbet/assets/css/_variable.sass";

.member-interest-page {
  width: 100%;
  min-height: 100%;
  padding: 1.5rem;

  @include phone-width {
    padding: 1rem;
  }
}

.interest-area {
  width: 100%;

  .interest-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;

    @include phone-width {
      margin-bottom: 0.75rem;
    }

    .interest-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: $text-charcoal-gray-color;

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
      background: $background-pale-silver-color;
      color: $text-charcoal-gray-color;
      font-size: 0.875rem;
      font-weight: 600;
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
        background: $primary-color !important;
        color: #fff !important;
      }
    }
  }

  .interest-content {
    background-color: #fff;
    color: $text-charcoal-gray-color;
    border-radius: 0 0.5rem 0.5rem 0.5rem;
    padding: 1.25rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    @include phone-width {
      padding: 0.75rem;
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

        @include phone-width {
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
      background: $primary-color;
      border: none;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 10;
      color: #fff;
      transition: background 0.2s ease;

      &:hover {
        background: color.adjust($primary-color, $lightness: -10%);
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

    @include phone-width {
      padding: 0.75rem;
      margin-bottom: 0.75rem;
    }

    .plans-section {
      margin-bottom: 1.5rem;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;

      @include phone-width {
        margin: 0 -0.5rem 1rem;
        padding: 0 0.5rem;
      }

      .plans-table {
        width: 100%;
        border-collapse: collapse;
        border-radius: 0.5rem;
        overflow: hidden;
        background-color: #fff;

        @include phone-width {
          width: 100%;
        }

        thead {
          .header-row-1,
          .header-row-2 {
            background: $primary-color;

            th {
              color: #fff;
              font-size: 0.875rem;
              font-weight: 600;
              padding: 0.75rem 1rem;
              text-align: center;
              white-space: nowrap;

              @include phone-width {
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

              @include phone-width {
                font-size: 0.75rem;
                padding: 0.5rem 0.75rem;
              }

              &.principal-cell {
                font-weight: 600;
                color: $text-charcoal-gray-color;
                border-right: 1px solid $border-pale-gray-color;
              }

              &.rate-cell {
                color: $primary-color;
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
        background: #fff;
        border-radius: 0.5rem;
        padding: 1rem;
        border: 1px solid $border-pale-gray-color;

        @include phone-width {
          padding: 0.75rem;
        }

        .card-title {
          font-size: 1rem;
          font-weight: 600;
          color: $text-charcoal-gray-color;
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
            color: $text-smoke-gray-color;
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
              color: $text-smoke-gray-color;
              font-size: 0.875rem;

              @include phone-width {
                font-size: 0.75rem;
              }
            }
          }

          .calc-input {
            :deep(.q-field__control) {
              background: $background-pale-silver-color;
              color: $text-charcoal-gray-color;
              border-radius: 0.25rem;

              @include phone-width {
                min-height: 36px;
              }
            }

            :deep(.q-field__native) {
              color: $text-charcoal-gray-color;

              @include phone-width {
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
          min-width: 100px;

          @include phone-width {
            flex-direction: row;
            min-width: auto;
          }

          .result-item {
            flex: 1;
            display: flex;
            flex-direction: column;
            text-align: center;
            border: 1px solid $primary-color;
            border-radius: 0.25rem;
            overflow: hidden;

            .result-label {
              background: $primary-color;
              color: #fff;
              font-size: 0.75rem;
              font-weight: 600;
              padding: 0.25rem 0.5rem;

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
              background: #fff;
              color: $primary-color;
              font-size: 1.25rem;
              font-weight: 700;
              padding: 0.5rem;

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
            background: $background-pale-silver-color;
            color: $text-charcoal-gray-color;
            border-radius: 0.25rem;

            @include phone-width {
              min-height: 36px;
            }
          }

          :deep(.q-field__native) {
            color: $text-charcoal-gray-color;

            @include phone-width {
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
          background: $text-mint-green-color !important;
          color: #fff !important;
          font-weight: 600;
          padding: 0.75rem;

          @include phone-width {
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
      background: #fff;
      border-radius: 0.5rem;
      overflow: hidden;
      border: 1px solid $border-pale-gray-color;

      .card-header {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: flex-start;
        padding: 0.75rem 1rem;
        background: $background-pale-silver-color;
        gap: 0.5rem;

        @include phone-width {
          padding: 0.625rem 0.75rem;
        }

        .header-left {
          flex: 1;
          min-width: 0;
          overflow: hidden;

          .activity-name {
            color: $text-charcoal-gray-color;
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
          text-align: right;
          flex-shrink: 0;

          .principal-amount-row {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            gap: 0.25rem;

            .expand-icon {
              font-size: 1.25rem;
              color: $primary-color;
            }
          }

          .principal-amount {
            color: $primary-color;
            font-size: 1rem;
            font-weight: 700;
            white-space: nowrap;

            @include phone-width {
              font-size: 0.9375rem;
            }
          }

          .principal-label {
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

          @include phone-width {
            padding-top: 0.375rem;
          }

          .status-label {
            color: $text-smoke-gray-color;
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
              background: #DDF6E8;
              color: #009D46;
            }

            &.text-info {
              background: #d2edff;
              color: #008AE6;
            }
            &.text-grey {
              background: #d2edff;
            }
          }
        }
      }

      .card-body {
        padding: 0.5rem 1rem;

        @include phone-width {
          padding: 0.375rem 0.75rem;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0;
          border-bottom: 1px solid $border-pale-gray-color;

          @include phone-width {
            padding: 0.375rem 0;
          }

          &:last-child {
            border-bottom: none;
          }

          .detail-label {
            color: $text-smoke-gray-color;
            font-size: 0.75rem;

            @include phone-width {
              font-size: 0.6875rem;
            }
          }

          .detail-value {
            color: $text-charcoal-gray-color;
            font-size: 0.875rem;
            font-weight: 600;

            @include phone-width {
              font-size: 0.8125rem;
            }

            &.highlight {
              color: $text-mint-green-color;
            }
          }

          .redeem-btn {
            background: $primary-color !important;
            color: #fff !important;
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
        }
      }
    }

    .custom-pagination {
      margin-top: 1rem;
      justify-content: flex-end;

      @include phone-width {
        justify-content: center;
      }

      :deep(.q-btn--standard) {
        background: $primary-color !important;
        color: #fff !important;
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
      color: $text-smoke-gray-color;
      font-size: 0.875rem;
      font-weight: 600;

      @include phone-width {
        font-size: 0.75rem;
      }
    }
  }
}

.interest-description-dialog {
  background: #fff;
  color: $text-charcoal-gray-color;
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
    border-bottom: 1px solid $border-pale-gray-color;

    .dialog-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: $text-charcoal-gray-color;
    }

    .close-btn {
      color: $text-smoke-gray-color;
    }
  }

  .dialog-content {
    padding: 1.5rem;
    max-height: 400px;
    overflow-y: auto;
    font-size: 0.875rem;
    line-height: 1.8;
    color: $text-smoke-gray-color;

    @include phone-width {
      padding: 1rem;
      max-height: 300px;
    }

    .rules-content {
      .rules-title {
        font-weight: 700;
        color: $text-charcoal-gray-color;
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
      background: $primary-color !important;
      color: #fff !important;
      font-weight: 600;
      padding: 0.75rem;
    }
  }

  // 領回提示 / 最小存放額度提示彈窗內文
  .min-principal-content {
    .min-principal-message {
      text-align: center;
      font-size: 0.9375rem;
      line-height: 1.8;
      color: $text-charcoal-gray-color;
    }
  }

  // 領回提示彈窗：取消 / 確認 雙按鈕
  .redemptions-dialog-actions {
    padding: 1rem 1.5rem;

    // 次按鈕：白底藍框藍字（outline）
    .cancel-btn {
      background: #fff !important;
      color: $primary-color !important;
      font-weight: 600;
      padding: 0.75rem;
    }

    // 主按鈕：實心藍底白字
    .confirm-btn {
      background: $primary-color !important;
      color: #fff !important;
      font-weight: 600;
      padding: 0.75rem;
    }
  }
}
</style>
