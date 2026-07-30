<template>
  <q-card flat bordered class="instructions-card">
    <q-card-section>
      <div class="instructions-header q-mb-lg">
        <div class="text-h6 text-weight-bold q-mb-xs">{{ $t("dns_settings.instructions") }}</div>
        <div class="text-body2 text-grey-7">
          {{ $t("dns_settings.instructions_description") }}
        </div>
      </div>

      <!-- 步驟說明 -->
      <div class="instructions-stepper">
        <!-- 步驟 1 -->
        <div class="step-item-wrapper">
          <div class="step-header-content">
            <div class="step-number">1</div>
            <div class="step-title text-weight-bold">{{ $t("dns_settings.step_1_title") }}</div>
          </div>
          <div class="step-content">
            <ul class="step-list">
              <li>{{ $t("dns_settings.step_1_item_1") }}</li>
              <li>{{ $t("dns_settings.step_1_item_2") }}</li>
            </ul>
          </div>
        </div>

        <!-- 步驟 2 -->
        <div class="step-item-wrapper">
          <div class="step-header-content">
            <div class="step-number">2</div>
            <div class="step-title text-weight-bold">{{ $t("dns_settings.step_2_title") }}</div>
          </div>
          <div class="step-content">
            <div class="step-item">{{ $t("dns_settings.step_2_item_1") }}</div>
            <div class="step-item step-note">
              {{ $t("dns_settings.note_label") }}{{ $t("dns_settings.step_2_note") }}
            </div>
          </div>
        </div>

        <!-- 步驟 3 -->
        <div class="step-item-wrapper">
          <div class="step-header-content">
            <div class="step-number">3</div>
            <div class="step-title text-weight-bold">{{ $t("dns_settings.step_3_title") }}</div>
          </div>
          <div class="step-content">
            <div class="step-item">{{ $t("dns_settings.step_3_label") }}：{{ $t("dns_settings.step_3_value") }}</div>
          </div>
        </div>

        <!-- 步驟 4 -->
        <div class="step-item-wrapper">
          <div class="step-header-content">
            <div class="step-number">4</div>
            <div class="step-title text-weight-bold">{{ $t("dns_settings.step_4_title") }}</div>
          </div>
          <div class="step-content">
            <ul class="step-list">
              <li>
                {{ $t("dns_settings.step_4_item_1") }}
                <ul class="step-list-nested">
                  <li>{{ $t("dns_settings.step_4_field_label") }}：{{ $t("dns_settings.step_4_field_value") }}</li>
                  <li>
                    {{ $t("dns_settings.step_4_input_label") }}：{{ $t("dns_settings.step_4_input_value") }}
                    <ul class="step-list-nested">
                      <li>
                        {{ $t("dns_settings.step_4_example_1_label") }}：{{ $t("dns_settings.step_4_example_1_value") }}
                      </li>
                      <li>
                        {{ $t("dns_settings.step_4_example_2_label") }}：{{ $t("dns_settings.step_4_example_2_value") }}
                      </li>
                      <li class="step-note">{{ $t("dns_settings.note_label") }}{{ $t("dns_settings.step_4_note") }}</li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>

        <!-- 步驟 5 -->
        <div class="step-item-wrapper">
          <div class="step-header-content">
            <div class="step-number">5</div>
            <div class="step-title text-weight-bold">{{ $t("dns_settings.step_5_title") }}</div>
          </div>
          <div class="step-content">
            <ul class="step-list">
              <li>
                {{ $t("dns_settings.step_5_item_1") }}
                <ol class="step-list-ordered">
                  <li>{{ $t("dns_settings.step_5_field_label") }}：{{ $t("dns_settings.step_5_field_value") }}</li>
                  <li>{{ $t("dns_settings.step_5_input_label") }}：{{ $t("dns_settings.step_5_input_value") }}</li>
                  <li>{{ $t("dns_settings.step_5_example_label") }}：{{ $t("dns_settings.step_5_example_value") }}</li>
                </ol>
              </li>
            </ul>
          </div>
        </div>

        <!-- 步驟 6 -->
        <div class="step-item-wrapper">
          <div class="step-header-content">
            <div class="step-number">6</div>
            <div class="step-title text-weight-bold">{{ $t("dns_settings.step_6_title") }}</div>
          </div>
          <div class="step-content">
            <div class="step-item">
              {{ $t("dns_settings.step_6_ttl_label") }}：{{ $t("dns_settings.step_6_ttl_value") }}
            </div>
            <div class="step-item">
              {{ $t("dns_settings.step_6_save_label") }}：{{ $t("dns_settings.step_6_save_value") }}
            </div>
          </div>
        </div>

        <!-- 步驟 7 -->
        <div class="step-item-wrapper">
          <div class="step-header-content">
            <div class="step-number">7</div>
            <div class="step-title text-weight-bold">{{ $t("dns_settings.step_7_title") }}</div>
          </div>
          <div class="step-content">
            <div class="step-item">{{ $t("dns_settings.step_7_item_1") }}</div>
            <div class="step-item">{{ $t("dns_settings.verify_note") }}</div>

            <!-- Verify 按鈕 -->
            <div class="q-mt-md row items-center" style="gap: 4px">
              <q-btn color="primary" @click="handleVerify" :loading="isVerifying" :disable="isVerifyDisabled">
                {{ $t("dns_settings.verify") }}
                <template v-if="(verifyCooldownSeconds ?? 0) > 0">({{ verifyCooldownSeconds }})</template>
                <q-tooltip v-if="showVerifyTooltip">
                  {{ $t("dns_settings.submit_apply_first") }}
                </q-tooltip>
              </q-btn>
              <!-- Status Icon -->
              <q-icon v-if="certStatus" :name="statusIcon" :color="statusColor" size="24px" />
            </div>
          </div>
        </div>

        <!-- 步驟 8 -->
        <div class="step-item-wrapper">
          <div class="step-header-content">
            <div class="step-number">8</div>
            <div class="step-title text-weight-bold">{{ $t("dns_settings.step_8_title") }}</div>
          </div>
          <div class="step-content">
            <div class="step-item">{{ $t("dns_settings.step_8_label") }}：{{ $t("dns_settings.step_8_value") }}</div>
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
  import { computed } from "vue"
  import type * as Response from "@/api/response.type"

  const props = defineProps<{
    certStatus: Response.GetCertStatusResponse | null
    isVerifying: boolean
    isApplying: boolean
    verifyCooldownSeconds?: number
    hasContentChanged?: boolean
  }>()

  const emit = defineEmits<{
    verify: []
  }>()

  const handleVerify = () => {
    emit("verify")
  }

  // 計算狀態圖標
  const statusIcon = computed(() => {
    if (!props.certStatus) return ""
    if (props.certStatus.status === "ISSUED") {
      return "check_circle"
    } else {
      return "error"
    }
  })

  // 計算狀態顏色
  const statusColor = computed(() => {
    if (!props.certStatus) return ""
    if (props.certStatus.status === "ISSUED") {
      return "positive"
    } else {
      return "warning"
    }
  })

  // 顯示 Verify 按鈕 tooltip 的條件:內容有變動(尚未送出申請)
  const showVerifyTooltip = computed(() => props.hasContentChanged === true)

  // Verify 按鈕的 disable 條件:正在申請中 或 驗證冷卻中 或 尚未送出申請
  const isVerifyDisabled = computed(
    () => props.isApplying || (props.verifyCooldownSeconds ?? 0) > 0 || props.hasContentChanged === true
  )
</script>

<style scoped lang="scss">
  .instructions-card {
    background: #ffffff;
  }

  .instructions-header {
    border-bottom: 1px solid #e0e0e0;
    padding-bottom: 16px;
  }

  .instructions-stepper {
    padding-right: 8px;
  }

  .step-item-wrapper {
    margin-bottom: 20px;
    position: relative;
  }

  .step-item-wrapper::after {
    content: "";
    position: absolute;
    left: 15px;
    top: 34px;
    bottom: 0;
    width: 2px;
    background-color: #535252;
    margin-left: 1px;
  }

  .step-content {
    padding: 20px;
    margin-top: 12px;
    margin-left: 28px;
  }

  .step-header-content {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    position: relative;
  }

  .step-number {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 2px solid #535252;
    background: transparent;
    color: #535252;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 14px;
    flex-shrink: 0;
    position: relative;
    z-index: 1;
  }

  .step-title {
    flex: 1;
    font-size: 15px;
    line-height: 1.5;
    color: #212121;
  }

  .step-item {
    margin-bottom: 10px;
    padding-left: 20px;
    position: relative;
    line-height: 1.8;
    color: #424242;
  }

  .step-item::before {
    content: "•";
    position: absolute;
    left: 4px;
    color: #757575;
    font-weight: bold;
    font-size: 16px;
  }

  .step-item:last-child {
    margin-bottom: 0;
  }

  .step-item strong {
    color: #212121;
    font-weight: 600;
  }

  .step-note {
    color: #d32f2f;
  }

  .step-note strong {
    color: #d32f2f;
  }

  .step-list {
    margin: 8px 0;
    padding-left: 20px;
    list-style-type: disc;
  }

  .step-list li {
    margin-bottom: 8px;
    line-height: 1.8;
    color: #424242;
  }

  .step-list li:last-child {
    margin-bottom: 0;
  }

  .step-list-nested {
    margin: 8px 0;
    padding-left: 20px;
    list-style-type: circle;
  }

  .step-list-nested li {
    margin-bottom: 8px;
    line-height: 1.8;
    color: #424242;
  }

  .step-list-nested li:last-child {
    margin-bottom: 0;
  }

  .step-list-nested li.step-note {
    color: #d32f2f;
  }

  .step-list-ordered {
    margin: 8px 0;
    padding-left: 20px;
    list-style-type: decimal;
  }

  .step-list-ordered li {
    margin-bottom: 8px;
    line-height: 1.8;
    color: #424242;
  }

  .step-list-ordered li:last-child {
    margin-bottom: 0;
  }
</style>
