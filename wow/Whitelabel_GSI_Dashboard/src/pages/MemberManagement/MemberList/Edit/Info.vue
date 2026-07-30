<template>
  <q-card ref="observedElement" class="q-pt-sm no-shadow editWrapper_v2">
    <q-form @submit="onSubmit" @reset="onCancel">
      <q-card-section class="q-pb-xs">
        <div class="edit_title">{{ t("common.account_info") }}</div>
      </q-card-section>
      <div class="row q-mb-sm q-col-gutter-md member_edit">
        <!-- 出款密碼 -->
        <q-card class="col-4 bg-transparent">
          <div class="h7-bold q-pt-md">{{ t("website_settings.withdrawal_password") }}</div>

          <q-card-actions class="q-px-none" align="left">
            <q-btn color="grey-7" class="btns q-mr-sm" v-if="!formData.has_withdrawal_pass">
              {{ t("website_settings.not_set") }}
            </q-btn>
            <q-btn v-else class="btns btn-pink q-mr-md" @click="removeWithdrawalPw">
              {{ t("website_settings.remove") }}
            </q-btn>
          </q-card-actions>
        </q-card>

        <!-- 可否投注 -->
        <q-card class="col-4 bg-transparent">
          <div class="h7-bold q-pt-md">{{ t("query_params.is_betting") }}</div>
          <q-card-actions class="q-px-none" align="left">
            <q-btn-toggle
              class="btn_toggle_style"
              v-model="formData.enabled"
              :options="[
                { label: t('common.enable'), value: true },
                { label: t('common.disable'), value: false }
              ]"
              toggle-color="primary"
              unelevated
              rounded
            />
          </q-card-actions>
        </q-card>

        <!-- 可否存款 -->
        <q-card class="col-4 bg-transparent">
          <div class="h7-bold q-pt-md">{{ t("edit_form.deposit_allowed") }}</div>
          <q-card-actions class="q-px-none" align="left">
            <q-btn-toggle
              class="btn_toggle_style"
              v-model="formData.deposit_enabled"
              :options="[
                { label: t('common.enable'), value: true },
                { label: t('common.disable'), value: false }
              ]"
              toggle-color="primary"
              unelevated
              rounded
            />
          </q-card-actions>
        </q-card>

        <!-- 可否出款 -->
        <q-card class="col-4 bg-transparent">
          <div class="h7-bold q-pt-md">{{ t("edit_form.withdraw_enabled") }}</div>
          <q-card-actions class="q-px-none" align="left">
            <q-btn-toggle
              class="btn_toggle_style"
              v-model="formData.withdraw_enabled"
              :options="[
                { label: t('common.enable'), value: true },
                { label: t('common.disable'), value: false }
              ]"
              toggle-color="primary"
              unelevated
              rounded
            />
          </q-card-actions>
        </q-card>

        <!-- 凍結 -->
        <q-card class="col-4 bg-transparent">
          <div class="h7-bold q-pt-md">{{ t("query_params.member_frozen_status") }}</div>

          <q-card-actions class="q-px-none" align="left">
            <q-btn-toggle
              v-model="formData.is_ban"
              class="btn_toggle_style"
              toggle-color="primary"
              unelevated
              rounded
              map-options
              :options="[
                { label: t('common.un_frozen'), value: false },
                { label: t('common.frozen'), value: true }
              ]"
              @update:model-value="onBanToggle"
            />
          </q-card-actions>
        </q-card>

        <q-card class="col-4 bg-transparent q-pt-md">
          <div class="h7-bold q-pt-md">{{ t("table_header.active_status") }} ：</div>

          <q-card-actions class="q-px-none" align="left" style="width: 60%">
            <q-input
              outlined
              class="q-mr-sm default-input disable_bg"
              :disable="true"
              :model-value="t(ACTIVE_STATUS_TYPE.I18nKeys[activeStatus])"
            />
          </q-card-actions>
        </q-card>

        <!-- 自我排除 -->
        <q-card class="col-4 bg-transparent q-pt-md">
          <div class="h7-bold q-pt-md">{{ t("query_params.self_exclusion_status") }}</div>

          <q-card-actions class="q-px-none" align="left">
            <div class="flex items-center no-wrap date-input">
              <exclusionDateTimePicker
                :exclusion_at="formData.self_exclusion_at"
                :return-ms="false"
                @update:parentValue="formData.self_exclusion_at = $event"
              />
            </div>
          </q-card-actions>
        </q-card>
        <!-- 代理身分 -->
        <q-card class="col-4 bg-transparent q-pt-md">
          <div class="h7-bold q-pt-md">{{ t("edit_form.agent_identity") }}</div>

          <q-card-actions class="q-px-none" align="left">
            <q-btn-toggle
              v-model="formData.is_member_agent"
              class="btn_toggle_style"
              toggle-color="primary"
              unelevated
              rounded
              map-options
              :options="[
                { label: t('common.disable'), value: false },
                { label: t('common.enable'), value: true }
              ]"
            />
          </q-card-actions>
        </q-card>
        <q-card class="col-4 bg-transparent q-pt-md">
          <div class="h7-bold q-pt-md">{{ t("edit_form.ad_options") }} ：</div>
          <q-card-actions class="q-px-none" align="left" style="width: 60%">
            <template v-if="formData.is_sub_ad">
              <q-input
                outlined
                class="q-mr-sm default-input disable_bg"
                :disable="true"
                :model-value="t('edit_form.accept')"
              />
            </template>
            <template v-else>
              <q-input
                outlined
                class="q-mr-sm default-input disable_bg"
                :disable="true"
                :model-value="t('edit_form.do_not_accept')"
              />
            </template>
          </q-card-actions>
        </q-card>
        <!-- 玩家自我排除 -->
        <q-card class="col-4 bg-transparent q-pt-md">
          <div class="h7-bold q-pt-md">{{ t("query_params.player_betting_status") }}</div>

          <q-card-actions class="q-px-none" align="left">
            <div class="flex items-center no-wrap date-input">
              <MemberExclusionDateTimePicker
                :exclusion_at="formData.member_exclusion_at"
                @update:parentValue="formData.member_exclusion_at = $event"
              />
            </div>
          </q-card-actions>
        </q-card>
      </div>
      <q-card-section class="q-pt-xs">
        <div class="row q-col-gutter-md">
          <template v-for="item in memberColumnList" :key="item.column_name">
            <template
              v-if="
                needCountryCodePhone &&
                (item.column_name === MEMBER_COLUMN_NAME.Enums.COUNTRY ||
                  item.column_name === MEMBER_COLUMN_NAME.Enums.PHONE)
              "
            >
              <template v-if="item.column_name === MEMBER_COLUMN_NAME.Enums.PHONE">
                <div class="col-3 row justify-between no-wrap">
                  <SelectColumn
                    v-if="columnCountryCode"
                    :hide-bottom-space="true"
                    v-model="accountInfoForm[columnCountryCode.column_name]"
                    :item="columnCountryCode"
                    class="col-4"
                  />
                  <InputColumn
                    v-model="accountInfoForm[item.column_name]"
                    :hide-bottom-space="true"
                    :item="item"
                    class="col-7"
                  />
                </div>
              </template>
            </template>

            <div v-else-if="item.column_name === MEMBER_COLUMN_NAME.Enums.REF_ACCOUNT" class="col-3">
              <RefAccountColumn v-model="accountInfoForm[item.column_name]" :hide-bottom-space="true" :item="item" />
            </div>
            <div v-else-if="item.type === INPUT_TYPE.Enums.INPUT" class="col-3">
              <InputColumn v-model="accountInfoForm[item.column_name]" :hide-bottom-space="true" :item="item" />
            </div>
            <div v-else-if="item.type === INPUT_TYPE.Enums.SELECT" class="col-3">
              <SelectColumn v-model="accountInfoForm[item.column_name]" :hide-bottom-space="true" :item="item" />
            </div>
            <div v-else-if="item.type === INPUT_TYPE.Enums.DATE" class="col-3">
              <DateColumn v-model="accountInfoForm[item.column_name]" :hide-bottom-space="true" :item="item" />
            </div>
          </template>

          <!-- 三方登入欄位為前端自行顯示，不透過 memberColumnList -->
          <div class="col-3">
            <p>{{ t("query_params.register_method") }}</p>
            <q-input
              outlined
              dense
              disable
              :hide-bottom-space="true"
              :model-value="getRegisterMethodDisplay()"
              class="default-input disable_bg"
            />
          </div>

          <div class="col-12"></div>
        </div>
      </q-card-section>

      <div class="member_edit" style="padding-left: 20px">
        <!-- 會員標籤 -->
        <div class="q-pt-lg">
          <div class="edit_title">{{ t("table_header.member_tag") }}</div>
        </div>
        <div class="q-pt-xs">
          <div class="col-12" v-if="!spinShow">
            <memberTagOption :parent-value="formData.label" @update:labelValue="handelBlockTags" />
          </div>
        </div>

        <div class="q-pb-xs q-mt-xl q-mb-lg">
          <div class="row q-mb-lg">
            <div class="edit_title">{{ t("kyc_common.member_kyc_review") }}</div>
          </div>
          <div class="items-center q-mt-md">
            <div class="h7-bold q-mb-md">{{ t("kyc_common.approve_status") }}</div>
            <div class="col-grow">
              <q-btn-toggle
                v-model="formData.approval_status"
                class="btn_toggle_style"
                style="width: 50%"
                toggle-color="primary"
                unelevated
                rounded
                map-options
                :options="[
                  { label: `${t('kyc_common.unverified')}`, value: 0 },
                  { label: `${t('kyc_common.pending_review')}`, value: 4 },
                  { label: `${t('kyc_common.under_review')}`, value: 5 },
                  { label: `${t('kyc_common.approved')}`, value: 1 },
                  { label: `${t('kyc_common.rejected')}`, value: 2 }
                ]"
              />
            </div>
          </div>
        </div>

        <div>
          <div class="row q-col-gutter-md q-mb-lg">
            <KycCard
              v-for="kycSetting in kycSettings"
              :key="kycSetting.id ?? kycSetting.type"
              :kyc-setting="kycSetting"
              :kyc-items="formData.kycs"
            />
          </div>
        </div>
        <div class="q-mb-sm q-mt-xl">
          <div class="edit_title">{{ t("kyc_common.backend_kyc_upload") }}</div>
        </div>
        <div class="q-pt-md">
          <div class="row">
            <div class="col-3 kyc-edit" v-for="(imgitem, index) in formData.img" :key="index">
              <div class="">
                <PreviewImage
                  :parent-image="formData.img[index].img"
                  :default-image="addKycDefault()"
                  :aspect-ratio="'320/100'"
                  :max-file-size="2097152"
                  @update:modelValue="updateListImgUrl($event, index)"
                  image-to-base64
                  style="width: 340px"
                />
              </div>
              <span v-if="formData.img[index].img === ''">*{{ t("common.Image2mb") }}</span>

              <div class="col q-mr-md q-pt-sm text-left">
                <div class="img_tool">
                  <div class="left-btn">
                    <q-btn v-if="formData.img[index].img !== ''" class="q-mr-md btns btn-green" @click="onShow(index)">
                      {{ t("common.check") }}
                    </q-btn>
                    <q-btn class="btns btn-pink" @click="removePic(index)">
                      {{ t("btn.remove") }}
                    </q-btn>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 帳戶狀態表單 -->
      <div class="member_table">
        <q-table
          square
          hide-pagination
          :rows-per-page-options="[0]"
          :rows="form"
          :columns="tableColumn"
          row-key="id"
          class="table_v2"
        >
          <template #header="props">
            <q-tr>
              <q-th>{{ props.cols[0].label }}</q-th>

              <q-th>{{ props.cols[1].label }}</q-th>

              <q-th>{{ props.cols[2].label }}</q-th>

              <q-th>{{ props.cols[3].label }}</q-th>

              <q-th>{{ props.cols[4].label }}</q-th>

              <q-th>{{ props.cols[5].label }}</q-th>

              <q-th
                >{{ props.cols[6].label
                }}<q-btn icon="content_copy" size="sm" flat dense @click="onCopy(props.cols[6])"
              /></q-th>
            </q-tr>
          </template>
          <template #body="props">
            <q-tr>
              <q-td key="registration_time" :props="props">
                {{ props.row.registration_time }}
              </q-td>
              <q-td key="register_method" :props="props">
                {{ props.row.register_method }}
              </q-td>
              <q-td key="last_login_time" :props="props">
                {{ props.row.last_login_time }}
              </q-td>
              <q-td key="last_ip" :props="props">
                {{ props.row.last_ip }}
              </q-td>
              <q-td key="last_deposit_time" :props="props">
                {{ props.row.last_deposit_time }}
              </q-td>
              <q-td key="last_withdrawal_time" :props="props">
                {{ props.row.last_withdrawal_time }}
              </q-td>
              <q-td key="referral_code" :props="props">
                <span id="referral_code">{{ props.row.referral_code }}</span>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
      <!-- 首存表單 -->
      <div class="member_table">
        <q-table
          class="q-mt-md table_v2"
          square
          hide-pagination
          :rows-per-page-options="[0]"
          :rows="firstDeposit"
          :columns="firstDepositTableColumn"
          :no-data-label="t('common.validate.noDataAvailable')"
          row-key="id"
        >
          <template #body="props">
            <q-tr>
              <q-td key="currency_id" :props="props">
                {{ CURRENCY_TYPE.Enums[props.row.currency_id as CURRENCY_TYPE.Enums] }}
              </q-td>
              <q-td key="first_deposit_at" :props="props">
                {{ genTimeFormat(props.row.first_deposit_at, "yyyy-MM-dd HH:mm:ss") }}
              </q-td>
              <q-td key="actual_amount" :props="props">
                {{ props.row.actual_amount }}
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
      <!-- 當前餘額 -->
      <div class="member_table">
        <q-card-section class="q-pb-xs">
          <div class="edit_title q-mb-md">{{ t("common.current_balance") }}</div>
        </q-card-section>
        <q-table
          square
          hide-pagination
          :rows-per-page-options="[0]"
          :rows="currency"
          :columns="balanceTableColumn"
          row-key="currency"
          class="table_v2"
        >
          <template #body="props">
            <q-tr :props="props">
              <q-td v-for="col in props.cols" :key="col.name" style="text-align: center">
                {{ col.name !== "wallet_type" ? moneyFormat(props.row[col.name]) : props.row[col.name] }}
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
      <!-- 當前稽核 -->
      <div class="member_table">
        <q-card-section class="q-pb-xs" v-if="!siteStore.isCredit">
          <div class="row items-center q-gutter-sm q-mb-md">
            <div class="edit_title">{{ t("common.current_audit") }}</div>
            <q-btn
              v-if="isAuditAdjustmentEditable"
              :disable="!memberAccount"
              class="btns btn-blue"
              @click="openMemberAuditAdjustment"
            >
              <q-icon class="q-mr-xs" size="xs" name="edit" />
              {{ t("member_audit_adjustment") }}
            </q-btn>
          </div>
        </q-card-section>
        <q-table
          square
          hide-pagination
          :rows-per-page-options="[0]"
          :rows="currentAuditcurrency"
          :columns="balanceTableColumn"
          row-key="currency"
          v-if="!siteStore.isCredit"
          class="table_v2"
        >
          <template #body="props">
            <q-tr :props="props">
              <q-td v-for="col in props.cols" :key="col.name" style="text-align: center">
                {{ col.name !== "wallet_type" ? moneyFormat(props.row[col.name]) : props.row[col.name] }}
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
      <!-- 代理額度 -->
      <div class="member_table">
        <q-card-section class="q-pb-xs">
          <div class="edit_title q-mb-md">{{ t("common.agent_quota") }}</div>
        </q-card-section>
        <q-table
          square
          hide-pagination
          :rows-per-page-options="[0]"
          :rows="agentQuota"
          :columns="balanceTableColumn"
          row-key="currency"
          class="table_v2"
        >
          <template #body="props">
            <q-tr :props="props">
              <q-td v-for="col in props.cols" :key="col.name" style="text-align: center">
                {{ col.name !== "wallet_type" ? moneyFormat(props.row[col.name]) : props.row[col.name] }}
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>

      <q-card-actions class="action-btns" :style="{ width: elementWidth + 'px' }" align="center">
        <q-btn outline color="main-color" class="btnCancel q-mr-md" type="reset">
          {{ t("btn.cancel") }}
        </q-btn>
        <q-btn color="main-color" class="btnSubmit" :loading="isLoading" type="submit">{{ t("btn.check") }}</q-btn>
      </q-card-actions>
    </q-form>
  </q-card>

  <SingleAuditAdjustmentDialog ref="singleAuditAdjustmentDialog" @submitted="handleSingleAuditAdjustmentSubmitted" />

  <Teleport to="body">
    <vue-easy-lightbox
      :visible="showFullscreenImage"
      :imgs="showPic"
      @hide="onHide"
      :rotate-disabled="true"
    ></vue-easy-lightbox>
  </Teleport>
  <!--opt-->
  <dialog-comp v-model="viewDialog" :configs="dialogConfigs.view" :loading="viewLoading">
    <template #label>
      <div>{{ t("btn.opt") }}</div>
    </template>
    <template #mainContent>
      <q-card class="custom-modal">
        <div class="q-px-sm">
          <q-scroll-area style="height: 300px">
            <q-table
              square
              hide-pagination
              :rows-per-page-options="[0]"
              :rows="currency"
              :columns="optColumn"
              row-key="id"
              class="table_v2"
            >
              <template #body="props">
                <q-tr :props="props">
                  <q-td v-for="col in props.cols" :key="col.name" style="text-align: center">
                    {{ props.row[col.name] }}
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </q-scroll-area>
        </div>
      </q-card>
    </template>
  </dialog-comp>
</template>

<script lang="ts" setup>
  import type { Ref } from "vue"
  import { ref, reactive, onMounted, onBeforeUnmount, computed, nextTick } from "vue"
  import { useRoute, useRouter } from "vue-router"
  import { useQuasar } from "quasar"
  import { useI18n } from "vue-i18n"

  import { useSearch } from "@/hook/useSearch"
  import { BONUS_WALLET_TYPE, ACTIVE_STATUS_TYPE, ERROR_CODE, PERMISSION } from "@/utils/constants"
  import { getMemberDetail, updateMemberBlock, updateMemberInfo, updateMemberRestWithdrawalPw } from "@/api/member"
  import type { QTableProps } from "quasar"
  import { useCommon } from "@/hook/useCommon"
  import { usePermissionStore } from "@/stores/permissionStore"

  import type { KycSetting } from "@/api/request.type"
  import type { GetMemberInformation, GetSettings } from "@/api/response.type"

  import memberTagOption from "@/components/forms/memberTagOption.vue"

  import { useImage } from "@/hook/useImage"
  import PreviewImage from "@/components/forms/PreviewImage.vue"

  import VueEasyLightbox from "vue-easy-lightbox"
  import { ENV_MODE_ENUM, useEnv } from "src/hook/useEnv"
  import { useSiteStore } from "@/stores/siteStore"
  import { useWalletBouns } from "@/hook/useWalletBouns"
  import { useDialog } from "src/hook/useDialog"
  import DialogComp from "@/components/dialogs/index.vue"
  import type { IDialogConfig } from "@/components/dialogs/types"
  import { DialogType } from "@/components/dialogs/types"

  import { getSettings } from "src/api/common"
  import KycCard from "./Kyc/KycCard.vue"

  import { useMember } from "src/composables/useMember"
  import {
    MEMBER_COLUMN_TYPE,
    MEMBER_COLUMN_NAME,
    INPUT_TYPE,
    REGISTER_METHOD,
    REGISTER_TYPE
  } from "src/utils/constants"
  import InputColumn from "src/pages/MemberManagement/MemberList/components/InputColumn.vue"
  import SelectColumn from "src/pages/MemberManagement/MemberList/components/SelectColumn.vue"
  import DateColumn from "src/pages/MemberManagement/MemberList/components/DateColumn.vue"
  import RefAccountColumn from "src/pages/MemberManagement/MemberList/components/RefAccountColumn.vue"

  import { CURRENCY_TYPE } from "@/utils/constants"
  import exclusionDateTimePicker from "./component/exclusionDateTimePicker.vue"
  import MemberExclusionDateTimePicker from "./component/MemberExclusionDateTimePicker.vue"
  import SingleAuditAdjustmentDialog from "./component/SingleAuditAdjustmentDialog.vue"

  type CurrencyBalances = {
    [key: string]: number | string
  }

  type MemberWalletBalance = {
    balance: string
    currency: string
    remaining_agent_quota: string
    remaining_turnover: string
    wallet_type: BONUS_WALLET_TYPE.Enums
  }

  type WalletAmountGetter = (wallet: MemberWalletBalance) => string

  type PermissionAction = {
    edit?: boolean
    id: number
  }

  type SingleAuditAdjustmentDialogInstance = {
    openPrefilledAuditAdjustmentDialog: (memberAccount: string) => Promise<void>
  }

  const { envData } = useEnv()
  const { VITE_APP_DYNAMIC_RESOURCE_URL, VITE_APP_MODE } = envData()
  const { memberColumnList, needCountryCodePhone, columnCountryCode, handleGetMemberColumn } = useMember()
  const { addKycDefault } = useImage()
  const route = useRoute()
  const router = useRouter()
  const { t } = useI18n()
  const { genTimeFormat, moneyFormat, isValidDateFormat } = useCommon()

  const siteStore = useSiteStore()
  const permissionStore = usePermissionStore()
  const { walletSwitch } = useWalletBouns()

  export type ImageItem = {
    id: number
    member_id: number
    img: string
    created_at: string
    created_by: number
  }

  const elementWidth = ref<number>(0)
  const observedElement = ref<any>(null)
  let resizeObserver: ResizeObserver | null = null
  const activeStatus = ref<ACTIVE_STATUS_TYPE.Enums>(ACTIVE_STATUS_TYPE.Enums.Active)

  const form = reactive<GetMemberInformation>([
    {
      id: 0,
      enabled: false,
      is_ban: false,
      last_login_time: "",
      registration_time: "",
      register_method: "",
      last_ip: "",
      last_deposit_time: "",
      last_withdrawal_time: "",
      referral_code: "",
      label: [],
      blockDepositTags: [],
      blockWithdrawalTags: [],
      blockPromotionTags: [],
      agent_id: 0,
      img: [],
      self_exclusion_at: 0,
      has_withdrawal_pass: false,
      kycs: [],
      approval_status: 0,
      is_member_agent: 0,
      deposit_enabled: false,
      withdraw_enabled: false,
      is_sub_ad: false,
      member_exclusion_at: 0
    }
  ])

  const accountInfoForm = reactive<{ [key: string]: any }>({})
  //刪除跟更換圖片都要寫入delImgId 給後端
  const delImgId: number[] = []
  const updateListImgUrl = (value: string, index: number) => {
    const imgData = formData.img[index]
    imgData.img = value
    //只要是更換圖
    if (value.includes("base64,")) {
      if (imgData.id !== -1) {
        delImgId.push(imgData.id)
      } /*else {
          imgData.id = 0
        }*/
    }
    //如果是最後一張圖上傳再開啟下一個
    if (formData.img.length < 5 && imgData.id == -1 && value.includes("base64,")) {
      imgData.id = 0
      formData.img.push({
        id: -1,
        member_id: 0,
        img: "",
        created_at: "",
        created_by: 0
      })
    }
  }

  const removePic = (index: number) => {
    if (index >= 0 && index < formData.img.length && formData.img[index].img !== "" && formData.img[index].id !== -1) {
      //formData.img[index].img = ""
      delImgId.push(formData.img[index].id)
      formData.img.splice(index, 1)
    }
  }
  const showFullscreenImage = ref(false)
  let showPic = ""

  const onShow = (index: number) => {
    showPic = formData.img[index].img
    showFullscreenImage.value = true
  }
  const onHide = () => (showFullscreenImage.value = false)
  const currency: Ref<CurrencyBalances[]> = ref([])
  const firstDeposit = ref([])
  const currentAuditcurrency: Ref<CurrencyBalances[]> = ref([])
  const agentQuota: Ref<CurrencyBalances[]> = ref([])
  const memberAccount = ref<string>("")
  const singleAuditAdjustmentDialog = ref<SingleAuditAdjustmentDialogInstance | null>(null)

  const isAuditAdjustmentEditable = computed<boolean>(
    () => VITE_APP_MODE === ENV_MODE_ENUM.ADMIN || hasAuditAdjustmentEditPermission()
  )

  function goBack() {
    router.back()
  }

  function openMemberAuditAdjustment(): void {
    if (!memberAccount.value) {
      return
    }

    void singleAuditAdjustmentDialog.value?.openPrefilledAuditAdjustmentDialog(memberAccount.value)
  }

  function hasAuditAdjustmentEditPermission(): boolean {
    const permissionGroups = Object.values(permissionStore.permission) as PermissionAction[][]
    return permissionGroups.some((permissions) =>
      permissions.some(({ edit, id }) => id === PERMISSION.Enums.A_F_MEMBER_AUDIT_ADJUSTMENT && edit === true)
    )
  }

  function handleSingleAuditAdjustmentSubmitted(): void {
    void refreshCurrentAuditRows()
  }

  async function refreshCurrentAuditRows(): Promise<void> {
    const memberId = Number(route.params.id)
    if (!Number.isFinite(memberId)) {
      return
    }

    await search({ id: memberId })

    if (!isSuccess.value || !Array.isArray(tableData.value.wallets)) {
      return
    }

    applyWalletBalances(tableData.value.wallets)
  }

  function applyWalletBalances(wallets: MemberWalletBalance[]): void {
    wallets.forEach((wallet) => {
      ensureBalanceCurrencyColumn(wallet.currency)
    })

    const visibleWallets = wallets.filter(shouldShowWalletBalance)

    currency.value = buildWalletBalanceRows(visibleWallets, getWalletBalance)
    currentAuditcurrency.value = buildWalletBalanceRows(visibleWallets, getWalletRemainingTurnover)
    agentQuota.value = buildWalletBalanceRows(visibleWallets, getWalletRemainingAgentQuota)
  }

  function buildWalletBalanceRows(wallets: MemberWalletBalance[], getAmount: WalletAmountGetter): CurrencyBalances[] {
    const balanceMap: Record<number, CurrencyBalances> = {}
    wallets.forEach((wallet) => {
      const walletRow = getWalletBalanceRow(balanceMap, wallet.wallet_type)
      walletRow[wallet.currency] = parseFloat(getAmount(wallet))
    })

    return Object.values(balanceMap)
  }

  function shouldShowWalletBalance(wallet: MemberWalletBalance): boolean {
    return walletSwitch.value || wallet.wallet_type === BONUS_WALLET_TYPE.Enums.GENERALLY
  }

  function getWalletBalance(wallet: MemberWalletBalance): string {
    return wallet.balance
  }

  function getWalletRemainingTurnover(wallet: MemberWalletBalance): string {
    return wallet.remaining_turnover
  }

  function getWalletRemainingAgentQuota(wallet: MemberWalletBalance): string {
    return wallet.remaining_agent_quota
  }

  function getWalletBalanceRow(
    balanceMap: Record<number, CurrencyBalances>,
    walletType: BONUS_WALLET_TYPE.Enums
  ): CurrencyBalances {
    const existingRow = balanceMap[walletType]
    if (existingRow) {
      return existingRow
    }

    const i18nKey = BONUS_WALLET_TYPE.I18nKeys[walletType as keyof typeof BONUS_WALLET_TYPE.I18nKeys]
    const walletRow: CurrencyBalances = {
      wallet_type: i18nKey ? t(i18nKey) : "common.unknow"
    }
    balanceMap[walletType] = walletRow
    return walletRow
  }

  function ensureBalanceCurrencyColumn(currencyName: string): void {
    const hasColumn = balanceTableColumn.value?.some((column) => column.name === currencyName)
    if (hasColumn) {
      return
    }

    balanceTableColumn.value?.push({
      name: currencyName,
      label: currencyName,
      field: currencyName,
      sortable: false,
      align: "center"
    })
  }

  const { search, spinShow, isSuccess, tableData } = useSearch(getMemberDetail)
  const [formData] = form

  onMounted(async () => {
    await handleGetMemberColumn(MEMBER_COLUMN_TYPE.Enums.MANAGE)
    const registerIp = memberColumnList.value.find((e) => e.column_name === MEMBER_COLUMN_NAME.Enums.REGISTERED_IP)
    if (registerIp) {
      registerIp.edit = false
    }
    // await store.getMemberLevel()
    // store.memberLevel.forEach((level) => {
    //   dropdownData.memberLevelList.push({
    //     label: level.label,
    //     value: level.value
    //   })
    // })

    await parseKycSetting()

    const id = route.params.id as string

    Promise.all([search({ id: parseInt(id) })])
      .then(() => {
        // 查無資料則踢回上一頁
        if (!isSuccess.value) {
          goBack()
        }
        let data = tableData.value
        memberAccount.value = typeof data.account === "string" ? data.account : ""
        activeStatus.value = data.active_status
        firstDeposit.value = data.first_deposit
        memberColumnList.value.forEach((e) => {
          accountInfoForm[e.column_name] = data[e.column_name]
        })

        formData.last_login_time = data.last_login
          ? genTimeFormat(new Date(data.last_login), "yyyy-MM-dd HH:mm:ss", false) || ""
          : ""
        formData.registration_time = data.created_at
          ? genTimeFormat(new Date(data.created_at), "yyyy-MM-dd HH:mm:ss", false) || ""
          : ""

        formData.enabled = data.enabled
        formData.is_ban = data.block

        const registerTypeKey = REGISTER_TYPE.I18nKeys[data.register_type as keyof typeof REGISTER_TYPE.I18nKeys]
        const registerMethodKey =
          REGISTER_METHOD.I18nKeys[data.register_method as keyof typeof REGISTER_METHOD.I18nKeys]

        formData.register_method =
          data.register_method === REGISTER_METHOD.Enums.Operator
            ? registerTypeKey
              ? t(registerTypeKey)
              : ""
            : registerMethodKey
              ? t(registerMethodKey)
              : ""
        formData.last_ip = data.last_ip.String

        formData.has_withdrawal_pass = data.has_withdrawal_pass

        formData.last_deposit_time = data.last_deposit_at
          ? genTimeFormat(new Date(data.last_deposit_at), "yyyy-MM-dd HH:mm:ss", false) || ""
          : ""
        formData.last_withdrawal_time = data.last_withdrawal_at
          ? genTimeFormat(new Date(data.last_withdrawal_at), "yyyy-MM-dd HH:mm:ss", false) || ""
          : ""

        formData.self_exclusion_at = data.self_exclusion_at

        formData.member_exclusion_at = data.member_exclusion_at
        //formData.member_exclusion_at = 1753070400000
        //formData.referral_code = window.location.hostname + "#/Register?Referral=" + data.account

        formData.referral_code = data?.referral_code ?? ""
        formData.label = data.labels ? data.labels : []
        formData.is_member_agent = data.is_member_agent ? data.is_member_agent : false

        applyWalletBalances(data.wallets)

        // kyc 相關
        formData.kycs = data.kycs
        formData.approval_status = data.approval_status
        formData.deposit_enabled = data.deposit_enabled
        formData.withdraw_enabled = data.withdraw_enabled

        //圖片相關
        formData.img =
          data.imgs && data.imgs.length
            ? data.imgs.map((item: ImageItem) => ({
                ...item,
                img: `${VITE_APP_DYNAMIC_RESOURCE_URL}/${item.img}`
              }))
            : []

        if (formData.img.length < 5) {
          formData.img.push({
            id: -1,
            member_id: 0,
            img: "",
            created_at: "",
            created_by: 0
          })
        }

        formData.is_sub_ad = data.is_sub_ad ? data.is_sub_ad : ""
      })
      .catch((e: any) => {
        // 取得資料失敗則踢回上一頁
        goBack()
      })
  })

  onMounted(() => {
    nextTick(() => {
      if (observedElement.value?.$el) {
        const element = observedElement.value.$el as HTMLElement

        resizeObserver = new ResizeObserver((entries) => {
          for (let entry of entries) {
            elementWidth.value = entry.contentRect.width
          }
        })

        resizeObserver.observe(element)
      } else {
        console.error("observedElement or $el is null")
      }
    })
  })

  onBeforeUnmount(() => {
    if (resizeObserver && observedElement.value?.$el) {
      const element = observedElement.value.$el as HTMLElement
      resizeObserver.unobserve(element)
      resizeObserver.disconnect()
    }
  })

  const handelBlockTags = (value: []) => {
    formData.label = value
  }

  const balanceTableColumn = ref<QTableProps["columns"]>([
    {
      name: "wallet_type",
      label: t("table_header.wallet_type"),
      field: "wallet_type",
      sortable: false,
      align: "center"
    }
  ])

  const tableColumn = computed<QTableProps["columns"]>(() => [
    {
      name: "registration_time",
      label: t("table_header.created_on"),
      field: "registration_time",
      sortable: false,
      align: "center"
    },
    {
      name: "register_method",
      label: t("table_header.way_to_register"),
      field: "register_method",
      sortable: false,
      align: "center"
    },
    {
      name: "last_login_time",
      label: t("table_header.last_login_time"),
      field: "last_login_time",
      sortable: false,
      align: "center"
    },
    {
      name: "last_ip",
      label: t("table_header.last_login_ip"),
      field: "last_ip",
      sortable: false,
      align: "center"
    },
    {
      name: "last_deposit_time",
      label: t("table_header.last_deposit_time"),
      field: "last_deposit_time",
      sortable: false,
      align: "center"
    },
    {
      name: "last_withdrawal_time",
      label: t("table_header.last_withdrawal_time"),
      field: "last_withdrawal_time",
      sortable: false,
      align: "center"
    },
    {
      name: "referral_code",
      label: t("table_header.referral_code"),
      field: "referral_code",
      sortable: false,
      align: "center"
    }
  ])

  const firstDepositTableColumn = computed<QTableProps["columns"]>(() => [
    {
      name: "currency_id",
      label: t("table_header.currency"),
      field: "currency_id",
      sortable: false,
      align: "center"
    },
    {
      name: "first_deposit_at",
      label: t("table_header.first_deposit_at"),
      field: "first_deposit_at",
      sortable: false,
      align: "center"
    },
    {
      name: "actual_amount",
      label: t("table_header.first_deposit_amount"),
      field: "actual_amount",
      sortable: false,
      align: "center"
    }
  ])

  const optColumn = computed<QTableProps["columns"]>(() => [
    {
      name: "send_time",
      label: t("table_header.send_time"),
      field: "send_time",
      sortable: false,
      align: "center"
    },
    {
      name: "expiration_time",
      label: t("table_header.expiration_time"),
      field: "expiration_time",
      sortable: false,
      align: "center"
    },
    {
      name: "opt",
      label: "OPT",
      field: "opt",
      sortable: false,
      align: "center"
    }
  ])
  function onCancel() {
    router.push({ name: "MemberList" })
  }

  const $q = useQuasar()
  const isLoading = ref(false)

  const onBanToggle = async (val: boolean) => {
    const id = route.params.id as string
    const previousValue = !val
    const res = await updateMemberBlock({ ids: [parseInt(id)], block: val })

    if (res.code === 0) {
      $q.notify({
        type: "positive",
        message: t("message.edit_success"),
        position: "top",
        timeout: 300
      })
    } else {
      formData.is_ban = previousValue
      $q.notify({
        type: "negative",
        message: res.msg,
        position: "top",
        timeout: 1000
      })
    }
  }

  const onSubmit = async () => {
    isLoading.value = true

    const id = route.params.id as string
    //只傳base64給後端
    const base64Imgs = formData.img.filter((entry) => entry.img.startsWith("data:image")).map((entry) => entry.img)
    //只刪除或更新的id
    const filteredDelArr = delImgId.filter((num) => num !== 0 && num !== -1)

    if (accountInfoForm.dob && !isValidDateFormat(accountInfoForm.dob)) {
      accountInfoForm.dob = ""
    }

    const sendData = {
      id: parseInt(id),
      ...accountInfoForm,
      enabled: formData.enabled,
      //待後端修復
      label: formData.label,
      imgs: base64Imgs,
      del_img_ids: filteredDelArr,
      kycs: formData.kycs,
      approval_status: formData.approval_status,
      self_exclusion_at: formData.self_exclusion_at,
      is_member_agent: formData.is_member_agent,
      deposit_enabled: formData.deposit_enabled,
      withdraw_enabled: formData.withdraw_enabled,
      member_exclusion_at: formData.member_exclusion_at
    }
    //如果生日是空的就不要傳給後端
    /* if (sendData.dob === "") {
        delete sendData.dob
      }*/

    const { search, status, resCode } = useSearch(updateMemberInfo)
    await search(sendData, {
      skipNotifyCodes: [ERROR_CODE.Enums.P_PHONE_EXIST, ERROR_CODE.Enums.P_EMAIL_EXIST]
    })

    if (status.value) {
      $q.notify({
        type: "positive",
        message: t("message.edit_success"),
        position: "top",
        timeout: 300
      })
      router.push({ name: "MemberList" })
      isLoading.value = false
    } else {
      if (resCode.value === ERROR_CODE.Enums.P_PHONE_EXIST) {
        $q.notify({
          type: "negative",
          message: t("error_message.P_PHONE_EXIST"),
          position: "top",
          timeout: 3000
        })
      } else if (resCode.value === ERROR_CODE.Enums.P_EMAIL_EXIST) {
        $q.notify({
          type: "negative",
          message: t("error_message.P_EMAIL_EXIST"),
          position: "top",
          timeout: 3000
        })
      }
      isLoading.value = false
    }
  }
  function onCopy(row: string) {
    var range = document.createRange()
    var selection = window.getSelection()
    var textToCopy = document.getElementById("referral_code")
    if (textToCopy) {
      range.selectNodeContents(textToCopy)
      selection?.removeAllRanges()
      selection?.addRange(range)
      try {
        var successful = document.execCommand("copy")
        $q.notify({
          type: "positive",
          message: t("message.copy_completed"),
          position: "top",
          timeout: 300
        })
      } catch (err) {
        console.error(err)
      }
    }
  }

  //移除取款密碼
  const removeWithdrawalPw = async () => {
    const { search, status } = useSearch(updateMemberRestWithdrawalPw)
    await search(parseInt(route.params.id as string))

    if (status.value) {
      formData.has_withdrawal_pass = false
      $q.notify({
        type: "positive",
        message: t("message.edit_success"),
        position: "top",
        timeout: 300
      })
    }
  }

  const dialogConfigs = reactive<{
    [key: string]: IDialogConfig
  }>({
    view: {
      type: DialogType.VIEW,
      useActions: false
    }
  })

  const dialogData = reactive<{
    view: {
      permissionList: any[]
    }
  }>({
    view: { permissionList: [] }
  })

  const { dialog: viewDialog, openDialog: openViewDialog, loading: viewLoading } = useDialog()

  const openOptDialog = async () => {
    openViewDialog()
    /* const sendData = {
        id: id
      }
     const res = await getAdminAccountPermissionDetail(sendData)
      if (res.code === 0) {
        dialogData.view.permissionList = res.data.parent_permission
        openViewDialog()
      }*/
  }

  // KYC相關
  const kycSettings = ref<KycSetting[]>([])

  const parseKycSetting = async () => {
    const { search, tableData, status } = useSearch(getSettings)
    isLoading.value = true
    await search()
    isLoading.value = false

    if (status.value) {
      const result = tableData.value as GetSettings

      if ("kyc_setting" in result && result.kyc_setting) {
        try {
          kycSettings.value = JSON.parse(result.kyc_setting)
        } catch (e) {
          console.error("Failed to parse kyc_setting", e)
          kycSettings.value = []
        }
      }
    }
  }

  // 根據 register_method 顯示對應的三方登入 ID
  const getRegisterMethodDisplay = () => {
    const registerMethod = tableData.value?.register_method
    if (registerMethod === REGISTER_METHOD.Enums.Telegram) {
      return tableData.value?.telegram_id || ""
    } else if (registerMethod === REGISTER_METHOD.Enums.Google) {
      return tableData.value?.google_id || ""
    }
    return ""
  }
</script>

<style lang="scss" scoped>
  @import "@/css/subPage.scss";
  .bg-transparent {
    box-shadow: none;
    background-color: transparent;
  }
  .enable {
    border: 1px solid #c2c2ca;
    border-radius: 6px;
    padding-right: 20px;
  }

  .verified {
    font-size: 12px;
    color: #26bf94;
  }
  .img_tool {
    display: flex;
    justify-content: space-between;
    align-items: center;
    span {
      font-size: 12px;
    }
  }
  .left-btn,
  .right-btn {
    flex: 1;
    display: flex;
    justify-content: center;
  }
  .opt {
    position: absolute;
    top: 92%;
    left: 3%;
    font-size: 12px;
  }
  // fullscreen
  .vel-modal {
    ::v-deep(.vel-img-wrapper) {
      cursor: grab !important;
      &:active {
        cursor: grabbing !important;
      }
    }
    ::v-deep(.vel-toolbar) {
      background-color: transparent;
      .toolbar-btn {
        background-color: transparent;
        .vel-icon {
          width: 40px;
          height: 40px;
        }
      }
      .toolbar-btn__resize {
        display: none;
      }
    }
    ::v-deep(.btn__close) {
      width: 33px;
      height: 33px;
      background-color: rgba($color: #fff, $alpha: 0.2);
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      opacity: 1;
      .vel-icon {
        width: 18px;
        height: 18px;
      }
    }
  }
  .action-btns {
    background: #eff7ff;
    position: fixed;
    bottom: 0;
    z-index: 1;
  }
  .editWrapper_v2 {
    padding-bottom: 72px;
  }

  .member_edit {
    background: #fcf8ff;
    border-radius: 10px;
    width: 98%;
    margin-left: 1%;
    margin-top: 1%;
    padding-bottom: 1%;
    .q-card {
      padding-top: 0px !important;
    }
    .kyc-edit {
      width: 360px;
      height: 190px;
      padding: 10px;
      gap: 10px;
      border-radius: 4px;
      border-width: 1px;
      margin-right: 2%;
      margin-bottom: 1%;
    }
  }
  .member_table {
    width: 98%;
    margin-left: 1%;
    margin-top: 1%;
  }
  .p-none {
    padding: 0;
  }
</style>
