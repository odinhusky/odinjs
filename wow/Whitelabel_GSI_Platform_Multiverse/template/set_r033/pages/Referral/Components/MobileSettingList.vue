<template>
  <section class="mobile-setting-list">
    <div class="list-wrapper" v-if="referralSettingData?.list?.length">
      <q-card class="list-item" v-for="(item, index) in referralSettingData.list" :key="index">
        <q-card-section class="list-item-section">
          <div class="account-info">
            <span>{{ $t("menu.userAccount") }}</span>
            <span class="info-text">{{ item.account }}</span>
          </div>
          <div class="down-line-info">
            <span>{{ $t("menu.directMemberCount") }}</span>
            <span class="info-text">{{ item.direct_member_count }}</span>
          </div>
          <div
            v-if="referralConfigData?.reward_mode !== 'cpa'"
            class="setting-icon"
            @click="handleSettingClick(item.account, item.member_id)"
          >
            <q-img :src="referralEditIcon" lazy-load />
          </div>
        </q-card-section>
      </q-card>
      <div class="referral-pagination-wrapper">
        <Pagination
          v-model="currentPage"
          :total-pages="totalPages"
          :max-pages="3"
          @update:model-value="(page: number) => handlePagination(page, 'setting', undefined, 20)"
        />
      </div>
    </div>
    <div v-else class="referral-no-data-container">
      <q-img v-if="getWideLogo" :src="getWideLogo()" lazy-load />
      <span>{{ $t("tableHeader.no_data") }}</span>
    </div>
    <q-dialog persistent v-model="openSettingDialog" class="table-setting-dialog">
      <q-card class="dialog-card">
        <q-card-section>
          <div class="dialog-title-wrapper">
            <div class="title-text">{{ dialogAccount }}</div>
            <div class="title-icon cursor-pointer" @click="handleClose">
              <q-icon name="close" />
            </div>
          </div>
        </q-card-section>
        <q-card-section v-if="combinedCurrencyData.length" class="rate-input-section">
          <div v-for="item in combinedCurrencyData" :key="item.id" class="rate-input-item">
            <div class="rate-info">
              <p class="rate-input-label stacked-label">
                <span class="threshold-name">{{ item.code }}</span>
                <span class="threshold-limit"
                  >{{ t("menu.upperLimit") }}:<span class="threshold-value">{{ item.upperLimit }}%</span></span
                >
              </p>
            </div>
            <q-input
              standout
              class="rate-input"
              v-model="editingRateData.currency_limit[item.id]"
              :rules="[(val) => !item.upperLimit || Number(val) <= item.upperLimit || t('menu.cannotExceedUpperLimit')]"
              :disable="originRateData.currency_limit[item.id] > 0"
            >
              <template v-slot:append>
                <span>%</span>
              </template>
            </q-input>
          </div>
        </q-card-section>
        <q-card-section v-else class="rate-input-section"> {{ $t("menu.pleaseContactYourSuperior") }}</q-card-section>

        <!-- 活躍人數門檻（CPA） -->
        <q-card-section class="rate-input-section">
          <div class="rate-input-item">
            <div class="rate-info">
              <p class="rate-input-label stacked-label">
                <span class="threshold-name">{{ t("menu.activeMemberThreshold") }}</span>
                <span class="threshold-limit"
                  >{{ t("menu.upperLimit") }}:<span class="threshold-value"
                    >{{ upperQualifiedMemberCount }}{{ t("menu.peopleUnit") }}</span
                  ></span
                >
              </p>
            </div>
            <q-input
              standout
              class="rate-input"
              v-model="editingRateData.qualified_member_count"
              :rules="[
                (val) =>
                  !upperQualifiedMemberCount ||
                  Number(val) >= upperQualifiedMemberCount ||
                  t('menu.cannotBeLowerThanUpperLimit')
              ]"
            >
              <template v-slot:append>
                <span>{{ t("menu.peopleUnit") }}</span>
              </template>
            </q-input>
          </div>
        </q-card-section>
        <q-card-actions align="center">
          <div class="btn-wrapper">
            <q-btn class="cancel-btn" :label="$t('common.btn.cancel')" v-close-popup />
            <q-btn class="confirm-btn" @click="handleConfirm" :label="$t('common.btn.confirm')" />
          </div>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue"
import { useQuasar } from "quasar"
import { useReferral } from "src/common/composables/useReferral"
import { useBank } from "src/common/composables/useBank"
import { useLogo } from "src/common/composables/useLogo"
import { useI18n } from "vue-i18n"
import { useAuth } from "src/common/hooks/useAuth"
import Pagination from "app/template/set_r033/components/Pagination/Index.vue"
import { useSiteImg } from "app/template/set_r033/hooks/useSiteImg"
import * as Response from "src/api/response.type"

const $q = useQuasar()
const { t } = useI18n()
const {
  fetchReferralSetting,
  referralSettingData,
  fetchReferralSettingDetail,
  upperReferralSettingDetailData,
  referralSettingDetailData,
  updateReferralSetting,
  referralPagination,
  handlePagination,
  referralConfigData,
  fetchReferralConfig,
} = useReferral()
const { currencyIdMap, getAvailCurrencyList } = useBank()
const { getWideLogo } = useLogo()
const currentPage = ref(1)
const { auth } = useAuth()
const { referralEditIcon } = useSiteImg()

const openSettingDialog = ref(false)
const dialogAccount = ref("")
const dialogMemberId = ref(0)
const originRateData = ref<Response.ReferralSettingDetail>({
  currency_limit: {},
  is_limit_configured: false,
})
const editingRateData = ref<Response.ReferralSettingDetail>({
  currency_limit: {},
  is_limit_configured: false,
})
const totalPages = computed(() => {
  const total = referralSettingData.value?.total ?? 0
  return Math.max(1, Math.ceil(total / referralPagination.size))
})

const handleSettingClick = async (account: string, memberId: number) => {
  $q.loading.show()
  await fetchReferralSettingDetail(auth.value.user_id as number, true)
  await fetchReferralSettingDetail(memberId)
  openSettingDialog.value = true
  dialogAccount.value = account
  dialogMemberId.value = memberId
  editingRateData.value = JSON.parse(JSON.stringify(referralSettingDetailData.value))
  originRateData.value = JSON.parse(JSON.stringify(referralSettingDetailData.value))
  $q.loading.hide()
}

const combinedCurrencyData = computed(() => {
  const allCurrencyIds = new Set([
    ...Object.keys(upperReferralSettingDetailData.value?.currency_limit || {}),
    ...Object.keys(editingRateData.value.currency_limit || {}),
  ])

  const sortedCurrencyIds = Array.from(allCurrencyIds).sort((a, b) => Number(a) - Number(b))

  return sortedCurrencyIds.map((currencyId) => ({
    id: currencyId,
    code: currencyIdMap.value?.[Number(currencyId)]?.code,
    upperLimit: upperReferralSettingDetailData.value?.currency_limit[currencyId],
    currentLimit: editingRateData.value.currency_limit[currencyId] || 0,
  }))
})

// 上級的活躍人數限制
const upperQualifiedMemberCount = computed(() => upperReferralSettingDetailData.value?.qualified_member_count ?? 0)

const handleClose = () => {
  openSettingDialog.value = false
}

const handleConfirm = async () => {
  if (!combinedCurrencyData.value.length) {
    openSettingDialog.value = false
    return
  }

  const parsedData = Object.fromEntries(
    Object.entries(editingRateData.value.currency_limit).map(([key, value]) => [key, Number(value)])
  )

  const result = await updateReferralSetting({
    member_id: dialogMemberId.value,
    currency_limit: parsedData,
    qualified_member_count: Number(editingRateData.value.qualified_member_count) || 0,
  })
  if (result) {
    openSettingDialog.value = false
    await fetchReferralSetting()
    $q.notify({
      message: t("common.alarm.editSuccess"),
      color: "green",
      position: "top",
    })
  }
}

onMounted(async () => {
  await fetchReferralConfig()
  await handlePagination(currentPage.value, "setting", undefined, 20)
  await getAvailCurrencyList()
})
</script>

<style scoped lang="scss">
@import "app/template/set_r033/assets/css/_variable.scss";
@import "app/template/set_r033/assets/css/referral.scss";

.mobile-setting-list {
  @apply my-4 pb-14;

  .list-item {
    @apply mb-4;
    background: var(--neutral-100);
    border: 1px solid var(--neutral-05);
    color: var(--neutral-04);
  }

  .list-item-section {
    @apply flex items-center;

    .account-info,
    .down-line-info {
      @apply flex flex-col w-5/12;
      font-size: 0.75rem;
    }

    .info-text {
      color: var(--neutral-01);
    }

    .setting-icon {
      @apply w-2/12;

      :deep(.q-img__container) {
        @apply flex justify-center items-center;
      }

      :deep(img) {
        @apply w-[1.5rem] h-[1.5rem];
      }
    }
  }
}

.dialog-card {
  @apply p-3;
  background: var(--primany-03);
  color: var(--neutral-01);

  .dialog-title-wrapper {
    @apply flex justify-between items-center text-[24px];
    @apply font-bold;
  }

  .btn-wrapper {
    @apply flex justify-center items-center gap-[43px];

    .cancel-btn,
    .confirm-btn {
      @apply text-[1rem] px-6 capitalize rounded-[0.25rem];
      background: $gradient01;
      color: var(--neutral-01);
    }

    .cancel-btn {
      background: transparent;
    }
  }

  .rate-input-item {
    @apply flex justify-between items-center mb-[2rem];

    .rate-input-label {
      @apply flex justify-end pr-1;
      @apply text-base font-bold;

      .rate-input-label-text {
        @apply ml-1;
        color: $text-danger-color;
      }
    }

    .rate-input-label.stacked-label {
      @apply flex-col items-start;

      .threshold-limit {
        @apply text-sm;
        color: #9ca3af;
      }

      .threshold-value {
        color: $text-danger-color;
      }
    }

    .rate-input {
      @apply w-[7.5rem];

      :deep(.q-field__control) {
        background: var(--neutral-100) !important;
        border: 2px solid var(--input-dropdown-border-01);
      }

      :deep(.q-field__native),
      :deep(.q-field__append) {
        color: var(--neutral-03) !important;
      }
    }

    :deep(.q-field--with-bottom) {
      padding-bottom: 0;
    }
  }
}
</style>
