<template>
  <q-splitter v-model="splitterModel" horizontal separator-class="hidden">
    <template #after>
      <div class="msk" v-if="!permission.edit"></div>
      <q-form class="form-container" @submit="setSettings">
        <q-card class="q-pa-md bg-transparent" flat>
          <q-card-section class="row q-col-gutter-lg q-mb-md">
            <div class="col-12 col-md-4">
              <div class="filter-label">{{ $t("website_settings_reg.account_registration_login") }}</div>
              <q-select
                v-model="settingForm.register_method"
                :options="regTypeList"
                class="filter-select"
                dense
                options-dense
                outlined
                emit-value
                map-options
                @update:modelValue="updateRegisterMethod"
              />
            </div>
            <div class="col-12 col-md-4">
              <div class="filter-label">{{ $t("website_settings_reg.third_party_login") }}</div>
              <q-select
                v-model="thirdPartyLoginSelected"
                :options="thirdPartyLoginOptions"
                class="filter-select"
                dense
                options-dense
                outlined
                multiple
                emit-value
                map-options
                use-chips
              />
            </div>
            <div class="col-12 col-md-4">
              <div class="filter-label">
                <span class="inline-flex items-center gap-1">
                  <span class="leading-4 relative top-[2px]">{{
                    $t("website_settings_reg.slide_captcha_enabled")
                  }}</span>
                  <q-icon name="info" size="16px" class="text-grey-6 cursor-pointer">
                    <q-tooltip anchor="top middle" self="bottom middle" style="font-size: 14px">
                      {{ $t("website_settings_reg.slide_captcha_enabled_hint") }}
                    </q-tooltip>
                  </q-icon>
                </span>
              </div>
              <q-toggle
                v-model="settingForm.slide_captcha_enabled"
                color="green"
                :false-value="0"
                :true-value="1"
                keep-color
              />
            </div>
          </q-card-section>

          <q-card-section class="row q-col-gutter-lg q-mb-md gap-6">
            <div>
              <div class="filter-label">{{ $t("cms_register_otp") }}</div>
              <q-toggle v-model="settingForm.register_otp" color="green" :false-value="0" :true-value="1" keep-color />
            </div>
            <div>
              <div class="filter-label">{{ $t("cms_login_otp") }}</div>
              <q-toggle v-model="settingForm.login_otp" color="green" :false-value="0" :true-value="1" keep-color />
            </div>
          </q-card-section>
          <q-card-section class="row q-col-gutter-lg q-mb-md">
            <div class="col-12 col-md-4">
              <div class="filter-label">{{ $t("website_settings_reg.register_card") }}</div>
              <q-toggle
                v-model="settingForm.member_bank_register"
                color="green"
                :false-value="0"
                :true-value="1"
                keep-color
              />
            </div>
            <div class="col-12 col-md-4">
              <div class="filter-label">{{ $t("website_settings_reg.bank_card_cannot_edited") }}</div>
              <q-toggle
                v-model="settingForm.member_bank_edit"
                color="green"
                :false-value="1"
                :true-value="0"
                keep-color
              />
            </div>
            <div class="col-12 col-md-4">
              <div class="filter-label">{{ $t("website_settings_reg.member_as_agents") }}</div>
              <q-toggle
                v-model="settingForm.auto_be_member_agent"
                color="green"
                :false-value="0"
                :true-value="1"
                keep-color
              />
            </div>
          </q-card-section>

          <q-card-section class="row q-col-gutter-lg q-mb-lg">
            <div class="col-12 col-md-4">
              <div class="filter-label">{{ $t("website_settings_reg.password_error_count") }}</div>
              <q-input
                v-model.number="settingForm.password_error_count"
                outlined
                type="number"
                dense
                min="0"
                step="1"
                @keypress="onlyAllowPositiveIntegers"
                :rules="[
                  (val) =>
                    val === '' ||
                    val == null ||
                    (val >= 0 && Number.isInteger(Number(val))) ||
                    $t('error_msg.must_be_positive_integer')
                ]"
              />
            </div>
            <div class="col-12 col-md-4">
              <div class="filter-label">{{ $t("website_settings_reg.password_error_count_reset_minutes") }}</div>
              <q-input
                v-model.number="passwordResetHours"
                outlined
                type="number"
                dense
                min="0.1"
                step="0.1"
                @keypress="onlyAllowPositiveNumbers"
                @blur="formatPasswordResetHours"
                :rules="[(val) => val > 0 || $t('error_msg.must_be_positive_number')]"
              />
            </div>
          </q-card-section>

          <q-card-section class="row q-gutter-xl q-pa-none" style="overflow-x: auto; width: 100%">
            <div class="col-12 row q-col-gutter-md">
              <div class="col-12 col-sm q-mt-md">
                <q-card-section class="q-pt-xs" style="width: 150rem">
                  <div class="row q-col-gutter-md" style="flex-wrap: nowrap">
                    <div class="custom-box q-mr-md">
                      <div class="custom-top c-flex">
                        <div class="lines title" style="width: 55px">
                          <span>{{ $t("website_settings_reg.order") }}</span>
                        </div>
                        <div class="lines title" style="width: 150px">
                          <span>{{ $t("website_settings_reg.field_name") }}</span>
                        </div>
                        <div
                          class="lines title"
                          v-for="lang in langListSort"
                          :key="String(lang.label)"
                          style="width: 120px"
                        >
                          <span>{{ lang.label }}</span>
                        </div>
                      </div>
                      <VueDraggableNext :list="form" class="drag-container" @end="onDragEnd">
                        <div v-for="(item, index) in form" :key="index" class="custom-top c-flex">
                          <div class="lines title sort">
                            <q-icon
                              name="menu"
                              class="drag-icon"
                              @mouseenter="disabledDrag = false"
                              @mouseleave="disabledDrag = true"
                              @touchstart="disabledDrag = false"
                              @touchend="disabledDrag = true"
                            />
                            {{ item.sort }}
                          </div>
                          <div class="lines title" style="width: 150px">
                            {{ $t(`website_settings_reg.${item.column_name}`) }}
                            <q-btn
                              v-if="item.column_name === 'account' || item.column_name === 'password'"
                              flat
                              fab-mini
                              icon="settings"
                              color="secondary"
                              @click="onSetetingRule(item.column_name, item.id)"
                            >
                              <q-tooltip anchor="top middle" self="bottom middle">{{ $t("btn.edit") }}</q-tooltip>
                            </q-btn>
                          </div>
                          <div class="lines title" v-for="(value, key) in item.lang" :key="key" style="width: 120px">
                            <span>
                              <q-input v-model="item.lang[key]" outlined />
                            </span>
                          </div>
                        </div>
                      </VueDraggableNext>
                    </div>

                    <div class="custom-box custom-box-2 q-mr-md q-mb-xl">
                      <div class="custom-title">{{ $t("website_settings_reg.member_registration") }}</div>
                      <div class="custom-top c-flex">
                        <div class="lines center-title">
                          <span>{{ $t("common.required") }}</span>
                        </div>
                        <div class="center-title">
                          <span>{{ $t("website_settings_reg.view") }}</span>
                        </div>
                      </div>
                      <!-- 會員註冊頁  -->
                      <div class="custom-center c-center-flex" v-for="(item, index) in form" :key="index">
                        <!-- 會員註冊頁 - 必填 -->
                        <div class="radios lines">
                          <q-toggle
                            v-model="item.player_register_required"
                            color="green"
                            :false-value="false"
                            :true-value="true"
                            keep-color
                            :disable="item.disable"
                            v-if="
                              item.column_name !== MEMBER_COLUMN_NAME.Enums.MEMBER_LEVEL &&
                              item.column_name !== MEMBER_COLUMN_NAME.Enums.UID &&
                              item.column_name !== MEMBER_COLUMN_NAME.Enums.REGISTERED_IP
                            "
                            @update:model-value="
                              (value) => updateRequireStatus(item.id, 'player_register_display', value)
                            "
                          />
                          <span v-else>-</span>
                        </div>
                        <!-- 會員註冊頁 - 顯示 -->
                        <div class="radios">
                          <q-toggle
                            v-model="item.player_register_display"
                            color="green"
                            :false-value="false"
                            :true-value="true"
                            keep-color
                            :disable="item.disable"
                            v-if="
                              item.column_name !== MEMBER_COLUMN_NAME.Enums.MEMBER_LEVEL &&
                              item.column_name !== MEMBER_COLUMN_NAME.Enums.UID &&
                              item.column_name !== MEMBER_COLUMN_NAME.Enums.REGISTERED_IP
                            "
                            @update:model-value="
                              (value) =>
                                updateDisplayStatus(item.id, 'player_register_required', value, item.column_name)
                            "
                          />
                          <span v-else>-</span>
                        </div>
                      </div>
                    </div>
                    <div class="custom-box custom-box-3 q-mr-md">
                      <div class="custom-title">{{ $t("website_settings_reg.member_center") }}</div>
                      <div class="custom-top c-flex">
                        <div class="lines center-title">
                          <span>{{ $t("common.required") }}</span>
                        </div>
                        <div class="lines center-title">
                          <span>{{ $t("website_settings_reg.view") }}</span>
                        </div>
                        <div class="center-title">
                          <span>{{ $t("website_settings_reg.editable") }}</span>
                        </div>
                      </div>
                      <!-- 會員中心 -->
                      <div class="custom-center c-center-flex" v-for="(item, index) in form" :key="index">
                        <!-- 會員中心 - 必填 -->
                        <div class="radios lines">
                          <q-toggle
                            v-model="item.player_center_required"
                            color="green"
                            :false-value="false"
                            :true-value="true"
                            keep-color
                            :disable="item.disable"
                            v-if="
                              item.column_name !== MEMBER_COLUMN_NAME.Enums.ACCOUNT &&
                              item.column_name !== MEMBER_COLUMN_NAME.Enums.PASSWORD &&
                              item.column_name !== MEMBER_COLUMN_NAME.Enums.REF_ACCOUNT &&
                              item.column_name !== MEMBER_COLUMN_NAME.Enums.INVITE_CODE &&
                              item.column_name !== MEMBER_COLUMN_NAME.Enums.CONFIRM_PASSWORD &&
                              item.column_name !== MEMBER_COLUMN_NAME.Enums.MEMBER_LEVEL &&
                              item.column_name !== MEMBER_COLUMN_NAME.Enums.SMS_OTP &&
                              item.column_name !== 'cpf' &&
                              item.column_name !== MEMBER_COLUMN_NAME.Enums.UID &&
                              item.column_name !== MEMBER_COLUMN_NAME.Enums.REGISTERED_IP
                            "
                            @update:model-value="
                              (value) => updateRequireStatus(item.id, 'player_center_display', value)
                            "
                          />
                          <span v-else>-</span>
                        </div>
                        <!-- 會員中心 - 顯示 -->
                        <div class="radios lines">
                          <q-toggle
                            v-model="item.player_center_display"
                            color="green"
                            :false-value="false"
                            :true-value="true"
                            keep-color
                            :disable="item.disable"
                            v-if="
                              item.column_name !== MEMBER_COLUMN_NAME.Enums.ACCOUNT &&
                              item.column_name !== MEMBER_COLUMN_NAME.Enums.PASSWORD &&
                              item.column_name !== MEMBER_COLUMN_NAME.Enums.CONFIRM_PASSWORD &&
                              item.column_name !== MEMBER_COLUMN_NAME.Enums.MEMBER_LEVEL &&
                              item.column_name !== MEMBER_COLUMN_NAME.Enums.SMS_OTP &&
                              item.column_name !== 'cpf'
                            "
                            @update:model-value="
                              (value) => updateDisplayStatus(item.id, 'player_center_required', value, item.column_name)
                            "
                          />
                          <span v-else>-</span>
                        </div>
                        <!-- 會員中心 - 可編輯 -->
                        <div class="radios">
                          <q-toggle
                            v-model="item.player_center_edit"
                            color="green"
                            :false-value="false"
                            :true-value="true"
                            keep-color
                            :disable="item.disable"
                            v-if="
                              item.column_name !== MEMBER_COLUMN_NAME.Enums.ACCOUNT &&
                              item.column_name !== MEMBER_COLUMN_NAME.Enums.PASSWORD &&
                              item.column_name !== MEMBER_COLUMN_NAME.Enums.REF_ACCOUNT &&
                              item.column_name !== MEMBER_COLUMN_NAME.Enums.INVITE_CODE &&
                              item.column_name !== MEMBER_COLUMN_NAME.Enums.CONFIRM_PASSWORD &&
                              item.column_name !== MEMBER_COLUMN_NAME.Enums.MEMBER_LEVEL &&
                              item.column_name !== MEMBER_COLUMN_NAME.Enums.SMS_OTP &&
                              item.column_name !== 'cpf' &&
                              item.column_name !== MEMBER_COLUMN_NAME.Enums.UID &&
                              item.column_name !== MEMBER_COLUMN_NAME.Enums.REGISTERED_IP
                            "
                          />
                          <span v-else>-</span>
                        </div>
                      </div>
                    </div>
                    <!--end-->
                    <div class="custom-box custom-box-2 q-mr-md">
                      <div class="custom-title">{{ $t("website_settings_reg.add_new_members") }}</div>
                      <div class="custom-top c-flex">
                        <div class="lines center-title">
                          <span>{{ $t("common.required") }}</span>
                        </div>
                        <div class="center-title">
                          <span>{{ $t("website_settings_reg.view") }}</span>
                        </div>
                      </div>
                      <!-- 後台新增會員 -->
                      <div class="custom-center c-center-flex" v-for="(item, index) in form" :key="index">
                        <!-- 後台新增會員 - 必填 -->
                        <div class="radios lines">
                          <q-toggle
                            v-model="item.agent_create_required"
                            color="green"
                            :false-value="false"
                            :true-value="true"
                            keep-color
                            :disable="item.disable"
                            v-if="
                              item.column_name !== MEMBER_COLUMN_NAME.Enums.CONFIRM_PASSWORD &&
                              item.column_name !== MEMBER_COLUMN_NAME.Enums.SMS_OTP &&
                              item.column_name !== MEMBER_COLUMN_NAME.Enums.UID &&
                              item.column_name !== MEMBER_COLUMN_NAME.Enums.REGISTERED_IP
                            "
                            @update:model-value="(value) => updateRequireStatus(item.id, 'agent_create_display', value)"
                          />
                          <span v-else>-</span>
                        </div>
                        <!-- 後台新增會員 - 顯示 -->
                        <div class="radios">
                          <q-toggle
                            v-model="item.agent_create_display"
                            color="green"
                            :false-value="false"
                            :true-value="true"
                            keep-color
                            :disable="item.disable"
                            v-if="
                              item.column_name !== MEMBER_COLUMN_NAME.Enums.CONFIRM_PASSWORD &&
                              item.column_name !== MEMBER_COLUMN_NAME.Enums.SMS_OTP &&
                              item.column_name !== MEMBER_COLUMN_NAME.Enums.UID &&
                              item.column_name !== MEMBER_COLUMN_NAME.Enums.REGISTERED_IP
                            "
                            @update:model-value="
                              (value) => updateDisplayStatus(item.id, 'agent_create_required', value, item.column_name)
                            "
                          />
                          <span v-else>-</span>
                        </div>
                      </div>
                    </div>
                    <!--end-->
                    <div class="custom-box custom-box-3 q-mr-md">
                      <div class="custom-title">{{ $t("website_settings_reg.backstage_member") }}</div>
                      <div class="custom-top c-flex">
                        <div class="lines center-title">
                          <span>{{ $t("common.required") }}</span>
                        </div>
                        <div class="lines center-title">
                          <span>{{ $t("website_settings_reg.view") }}</span>
                        </div>
                        <div class="center-title">
                          <span>{{ $t("website_settings_reg.editable") }}</span>
                        </div>
                      </div>
                      <!-- 後台編輯會員 -->
                      <div class="custom-center c-center-flex" v-for="(item, index) in form" :key="index">
                        <!-- 後台編輯會員 - 必填 -->
                        <div class="radios lines">
                          <q-toggle
                            v-model="item.agent_edit_required"
                            color="green"
                            :false-value="false"
                            :true-value="true"
                            keep-color
                            :disable="item.disable && item.column_name !== MEMBER_COLUMN_NAME.Enums.PASSWORD"
                            v-if="
                              item.column_name !== MEMBER_COLUMN_NAME.Enums.ACCOUNT &&
                              item.column_name !== MEMBER_COLUMN_NAME.Enums.CONFIRM_PASSWORD &&
                              item.column_name !== MEMBER_COLUMN_NAME.Enums.REF_ACCOUNT &&
                              item.column_name !== MEMBER_COLUMN_NAME.Enums.INVITE_CODE &&
                              item.column_name !== MEMBER_COLUMN_NAME.Enums.MEMBER_LEVEL &&
                              item.column_name !== MEMBER_COLUMN_NAME.Enums.SMS_OTP &&
                              item.column_name !== MEMBER_COLUMN_NAME.Enums.UID &&
                              item.column_name !== MEMBER_COLUMN_NAME.Enums.REGISTERED_IP
                            "
                            @update:model-value="(value) => updateRequireStatus(item.id, 'agent_edit_display', value)"
                          />
                          <span v-else>-</span>
                        </div>
                        <!-- 後台編輯會員 - 顯示 -->
                        <div class="radios lines">
                          <q-toggle
                            v-model="item.agent_edit_display"
                            color="green"
                            :false-value="false"
                            :true-value="true"
                            keep-color
                            :disable="item.disable && item.column_name !== MEMBER_COLUMN_NAME.Enums.PASSWORD"
                            v-if="
                              item.column_name !== MEMBER_COLUMN_NAME.Enums.ACCOUNT &&
                              item.column_name !== MEMBER_COLUMN_NAME.Enums.CONFIRM_PASSWORD &&
                              item.column_name !== MEMBER_COLUMN_NAME.Enums.SMS_OTP
                            "
                            @update:model-value="
                              (value) => updateDisplayStatus(item.id, 'agent_edit_required', value, item.column_name)
                            "
                          />
                          <span v-else>-</span>
                        </div>
                        <!-- 後台編輯會員 - 可編輯 -->
                        <div class="radios">
                          <q-toggle
                            v-model="item.agent_edit_edit"
                            color="green"
                            :false-value="false"
                            :true-value="true"
                            keep-color
                            :disable="item.disable && item.column_name !== MEMBER_COLUMN_NAME.Enums.PASSWORD"
                            v-if="
                              item.column_name !== MEMBER_COLUMN_NAME.Enums.ACCOUNT &&
                              item.column_name !== MEMBER_COLUMN_NAME.Enums.CONFIRM_PASSWORD &&
                              item.column_name !== MEMBER_COLUMN_NAME.Enums.REF_ACCOUNT &&
                              item.column_name !== MEMBER_COLUMN_NAME.Enums.INVITE_CODE &&
                              item.column_name !== MEMBER_COLUMN_NAME.Enums.MEMBER_LEVEL &&
                              item.column_name !== MEMBER_COLUMN_NAME.Enums.SMS_OTP &&
                              item.column_name !== 'cpf' &&
                              item.column_name !== MEMBER_COLUMN_NAME.Enums.UID &&
                              item.column_name !== MEMBER_COLUMN_NAME.Enums.REGISTERED_IP
                            "
                          />
                          <span v-else>-</span>
                        </div>
                      </div>
                    </div>
                    <!--end-->
                  </div>
                </q-card-section>
              </div>
            </div>
          </q-card-section>

          <q-card-section class="q-pa-none q-mt-xl row justify-center">
            <q-btn color="primary" class="submit-btn" type="submit" :loading="isLoading">{{ $t("btn.save") }}</q-btn>
          </q-card-section>
        </q-card>
      </q-form>
    </template>
  </q-splitter>
  <!-- 設定彈窗 -->
  <dialog-comp v-model="editDialog" :configs="dialogConfigs.edit" :loading="editLoading" max-width="24.5rem">
    <template #label>
      <div v-if="dialogData.edit.colum === 'account'">{{ $t("website_settings.account_composition_settings") }}</div>
      <div v-else>{{ $t("website_settings.password_composition_settings") }}</div>
    </template>
    <template #mainContent>
      <div class="row q-col-gutter-md items-baseline q-mb-md">
        <div class="col-12 col-sm-2">{{ $t("btn.settings") }}</div>
        <div class="col-12 col-sm-9">
          <q-toggle
            v-model="dialogData.edit.column_rule.enabled"
            :color="dialogData.edit.column_rule.enabled ? 'positive' : 'negative'"
            :false-value="false"
            :true-value="true"
            stack-label
            size="lg"
          />
        </div>
      </div>
      <div class="row q-mb-md q-ml-sm q-item-center">
        <div class="col-12 col-sm-4">{{ $t("website_settings.character_length") }}</div>
        <div class="col-12 col-sm-6 rate">
          <q-input
            v-model="dialogData.edit.column_rule.minLength"
            outlined
            type="text"
            @keypress="onlyAllowNumbers"
            class="custom-rate-input"
          />
          <span class="q-mr-md q-ml-md">~</span>
          <q-input
            v-model="dialogData.edit.column_rule.maxLength"
            outlined
            type="text"
            @keypress="onlyAllowNumbers"
            class="custom-rate-input"
          />
        </div>
      </div>
      <div class="row q-mb-md q-ml-sm q-flex q-item-center">
        <div class="col-12 col-sm-4">{{ $t("website_settings.include_upper_letters") }}</div>
        <div class="col-12 col-sm-6 rate">
          <q-toggle
            v-model="dialogData.edit.column_rule.requireUpperLowerCase"
            :color="dialogData.edit.column_rule.requireUpperLowerCase ? 'positive' : 'negative'"
            :false-value="false"
            :true-value="true"
            stack-label
            size="lg"
          />
        </div>
      </div>
      <div class="row q-mb-md q-ml-sm q-flex q-item-center">
        <div class="col-12 col-sm-4">{{ $t("website_settings.include_numbers") }}</div>
        <div class="col-12 col-sm-6 rate">
          <q-toggle
            v-model="dialogData.edit.column_rule.requireNumber"
            :color="dialogData.edit.column_rule.requireNumber ? 'positive' : 'negative'"
            :false-value="false"
            :true-value="true"
            stack-label
            size="lg"
          />
        </div>
      </div>
      <div class="row q-mb-md q-ml-sm q-flex q-item-center" v-if="dialogData.edit.colum === 'password'">
        <div class="col-12 col-sm-4">{{ $t("website_settings.include_special_characters") }}</div>
        <div class="col-12 col-sm-6 rate">
          <q-toggle
            v-model="dialogData.edit.column_rule.requireSpecialChar"
            :color="dialogData.edit.column_rule.requireSpecialChar ? 'positive' : 'negative'"
            :false-value="false"
            :true-value="true"
            stack-label
            size="lg"
          />
        </div>
      </div>
    </template>
  </dialog-comp>
</template>

<script lang="ts" setup>
  import { ref, reactive, computed, onMounted, watch, watchEffect, nextTick } from "vue"
  import { useI18n } from "vue-i18n"
  import { useQuasar } from "quasar"
  import { useCommon } from "src/hook/useCommon"
  import { useSearch } from "@/hook/useSearch"
  import { useSiteStore } from "src/stores/siteStore"
  import { getSettings, putSettings } from "src/api/common"
  import {
    getWebSiteRegSetting,
    updateWebSiteRegSetting,
    getWebSiteRegSettingRule,
    updateWebSiteRegSettingRule
  } from "src/api/webSiteSetting"
  import type * as Request from "src/api/request.type"
  import type * as Response from "src/api/response.type"
  import type { LANGUAGE_TYPE } from "src/utils/constants"
  import { REGMETHOD, MEMBER_COLUMN_NAME, REGISTER_METHOD } from "src/utils/constants"
  import { usePermission } from "@/hook/usePermission"
  import { storeToRefs } from "pinia"
  import { VueDraggableNext } from "vue-draggable-next"
  import { useDialog } from "@/hook/useDialog"
  import type { IDialogConfig } from "@/components/dialogs/types"
  import { DialogType } from "@/components/dialogs/types"
  import DialogComp from "@/components/dialogs/index.vue"

  type ServiceKey = keyof Request.PutSettings["customer_services"]
  const $q = useQuasar()
  const { t } = useI18n()

  const siteStore = useSiteStore()
  const { langList, sso_google_oauth_enabled, sso_telegram_oauth_enabled } = storeToRefs(siteStore)
  const langListSort = ref<{ label: LANGUAGE_TYPE.Enums; value: number }[]>([])
  const { permission } = usePermission()
  const isLoading = ref(false)
  const splitterModel = ref(100)
  const disabledDrag = ref(false)

  // 三方登入選項（固定顯示 google 和 telegram）
  const thirdPartyLoginOptions = [
    { label: "google", value: "google" },
    { label: "telegram", value: "telegram" }
  ]

  // 三方登入已選擇的項目（可編輯）
  const thirdPartyLoginSelected = ref<string[]>([])

  const dialogData = reactive({
    edit: {
      colum: "",
      id: 0,
      column_rule: {
        enabled: false,
        maxLength: 10,
        minLength: 8,
        requireNumber: false,
        requireUpperLowerCase: false,
        requireSpecialChar: false
      }
    }
  })
  function onlyAllowNumbers(e: KeyboardEvent) {
    const char = String.fromCharCode(e.keyCode)
    if (!/[0-9]/.test(char)) {
      e.preventDefault()
    }
  }

  function onlyAllowPositiveIntegers(e: KeyboardEvent) {
    const char = String.fromCharCode(e.keyCode)
    // 只允许数字，不允许负号、小数点等
    if (!/[0-9]/.test(char)) {
      e.preventDefault()
    }
  }

  function onlyAllowPositiveNumbers(e: KeyboardEvent) {
    const char = String.fromCharCode(e.keyCode)
    const input = e.target as HTMLInputElement
    const currentValue = input.value || ""

    // 允许数字和小数点，但不允许负号
    if (!/[0-9.]/.test(char)) {
      e.preventDefault()
      return
    }

    // 如果已经有小数点，不允许再输入小数点
    if (char === "." && currentValue.includes(".")) {
      e.preventDefault()
    }
  }

  const dialogConfigs = reactive<{
    [key: string]: IDialogConfig
  }>({
    edit: {
      dialogLabelI18nKey: "btn.tag_settings",
      type: DialogType.EDIT,
      useActions: true,
      submitFunction: handleEdit
    }
  })
  const {
    dialog: editDialog,
    openDialog: openEditDialog,
    loading: editLoading,
    openLoading: openEditLoading,
    closeLoading: closeEditLoading,
    closeDialog: closeEditDialog
  } = useDialog()

  async function handleEdit() {
    openEditLoading()
    if (dialogData.edit.colum === "account") {
      if (dialogData.edit.column_rule.minLength < 4 || dialogData.edit.column_rule.maxLength > 25) {
        $q.notify({
          type: "negative",
          message: t("website_settings.account_rule"),
          position: "top",
          timeout: 300
        })

        closeEditLoading()
        return
      }
    } else if (dialogData.edit.colum === "password") {
      if (dialogData.edit.column_rule.minLength < 8 || dialogData.edit.column_rule.maxLength > 20) {
        $q.notify({
          type: "negative",
          message: t("website_settings.password_rule"),
          position: "top",
          timeout: 300
        })

        closeEditLoading()
        return
      }
    }
    const res = await updateWebSiteRegSettingRule(dialogData.edit)
    if (res.code === 0) {
      $q.notify({
        type: "positive",
        message: t("message.edit_success"),
        position: "top",
        timeout: 300
      })
      closeEditDialog()
    } else {
      $q.notify({
        type: "negative",
        message: res.msg,
        position: "top",
        timeout: 300
      })
    }

    closeEditLoading()
  }
  async function onSetetingRule(colum: string, id: number) {
    dialogData.edit.colum = colum
    dialogData.edit.id = id
    openEditDialog()
    const res = await getWebSiteRegSettingRule(id)

    if (res.code === 0) {
      dialogData.edit.column_rule.enabled = res.data.column_rule.enabled ? res.data.column_rule.enabled : false
      dialogData.edit.column_rule.maxLength = res.data.column_rule.maxLength ? res.data.column_rule.maxLength : 10
      dialogData.edit.column_rule.minLength = res.data.column_rule.minLength ? res.data.column_rule.minLength : 8
      dialogData.edit.column_rule.requireNumber = res.data.column_rule.requireNumber
        ? res.data.column_rule.requireNumber
        : false
      dialogData.edit.column_rule.requireUpperLowerCase = res.data.column_rule.requireUpperLowerCase
        ? res.data.column_rule.requireUpperLowerCase
        : false
      dialogData.edit.column_rule.requireSpecialChar = res.data.column_rule.requireSpecialChar
        ? res.data.column_rule.requireSpecialChar
        : false

      openEditDialog()
    } else {
      $q.notify({
        type: "negative",
        message: res.msg,
        position: "top",
        timeout: 300
      })
    }
  }

  // 註冊類型
  const { numberEnumToArray } = useCommon()

  const regTypeList = computed(() =>
    numberEnumToArray(REGMETHOD.Enums).map((e) => {
      return {
        label: t(REGMETHOD.I18nKeys[e as REGMETHOD.Enums]),
        value: e
      }
    })
  )
  const form = ref<Response.GetRegSettings[]>([])

  const settingForm = ref<{
    register_method: number
    slide_captcha_enabled: number
    register_otp: number
    login_otp: number
    member_bank_register: number
    member_bank_edit: number
    auto_be_member_agent: number
    password_error_count: number
    password_error_count_reset_minutes: number
  }>({
    register_method: 0,
    slide_captcha_enabled: 0,
    register_otp: 0,
    login_otp: 0,
    member_bank_register: 0,
    member_bank_edit: 0,
    auto_be_member_agent: 0,
    password_error_count: 0,
    password_error_count_reset_minutes: 0
  })

  const registerOtpServerSnapshot = ref<{
    register_otp: 0 | 1
    player_register_required: boolean
    player_register_display: boolean
  } | null>(null)

  const lastRegisterMethod = ref<number | null>(null)

  const isOtpSyncing = ref(false)

  function getSmsOtpRow() {
    return form.value.find((e) => e.column_name === MEMBER_COLUMN_NAME.Enums.SMS_OTP)
  }

  function captureRegisterOtpServerSnapshot() {
    const row = getSmsOtpRow()
    registerOtpServerSnapshot.value = {
      register_otp: settingForm.value.register_otp === 1 ? 1 : 0,
      player_register_required: row?.player_register_required ?? false,
      player_register_display: row?.player_register_display ?? false
    }
  }

  function applyRegisterOtpServerSnapshot() {
    const s = registerOtpServerSnapshot.value
    if (!s) return
    isOtpSyncing.value = true
    settingForm.value.register_otp = s.register_otp
    const row = getSmsOtpRow()
    if (row) {
      row.player_register_required = s.player_register_required
      row.player_register_display = s.player_register_display
    }
    nextTick(() => {
      isOtpSyncing.value = false
    })
  }

  /** 註冊 OTP 與 SMS_OTP 會員註冊欄位互相對齊（帳號 / 手機註冊相同邏輯） */
  function reconcileRegisterOtpWithForm() {
    const row = getSmsOtpRow()
    if (!row) return
    isOtpSyncing.value = true
    const open = settingForm.value.register_otp === 1 || row.player_register_required || row.player_register_display
    if (open) {
      settingForm.value.register_otp = 1
    } else {
      settingForm.value.register_otp = 0
      row.player_register_required = false
      row.player_register_display = false
    }
    nextTick(() => {
      isOtpSyncing.value = false
    })
  }

  watch(
    () => settingForm.value.register_otp,
    (val) => {
      if (isOtpSyncing.value) return
      const row = getSmsOtpRow()
      if (!row) return
      isOtpSyncing.value = true
      if (val === 1) {
        row.player_register_required = true
        row.player_register_display = true
      } else {
        row.player_register_required = false
        row.player_register_display = false
      }
      nextTick(() => {
        isOtpSyncing.value = false
      })
    }
  )

  watch(
    [() => getSmsOtpRow()?.player_register_required ?? false, () => getSmsOtpRow()?.player_register_display ?? false],
    ([req, disp]) => {
      if (isOtpSyncing.value) return
      const next = req || disp ? 1 : 0
      if (settingForm.value.register_otp === next) return
      settingForm.value.register_otp = next
    }
  )

  // 用于显示的小时值（从分钟转换而来）
  const passwordResetHours = ref<number>(0)

  // 格式化小时值，四舍五入到小数点后第一位
  function formatPasswordResetHours() {
    if (passwordResetHours.value > 0) {
      passwordResetHours.value = Math.round(passwordResetHours.value * 10) / 10
    }
  }

  async function setSettings() {
    // 验证 password_error_count 必须为正整数
    if (
      settingForm.value.password_error_count < 0 ||
      !Number.isInteger(Number(settingForm.value.password_error_count))
    ) {
      $q.notify({
        type: "negative",
        message: t("website_settings_reg.must_be_positive_integer"),
        position: "top",
        timeout: 300
      })
      return
    }

    // 验证重置时间（小时）必须为正数（允许小数）
    if (passwordResetHours.value <= 0 || isNaN(Number(passwordResetHours.value))) {
      $q.notify({
        type: "negative",
        message: t("website_settings_reg.must_be_positive_number"),
        position: "top",
        timeout: 300
      })
      return
    }

    // 将小时转换为分钟，无条件进位到整数
    const minutesValue = passwordResetHours.value * 60
    settingForm.value.password_error_count_reset_minutes = Math.ceil(minutesValue)

    // 會員註冊頁推薦人、推薦碼只能打開一個
    const tempForm = form.value.filter(
      (e) =>
        e.column_name === MEMBER_COLUMN_NAME.Enums.REF_ACCOUNT || e.column_name === MEMBER_COLUMN_NAME.Enums.INVITE_CODE
    )
    if (tempForm.length === 2) {
      /*const hasTrueInFirst = Object.values(tempForm[0]).some((value) => typeof value === "boolean" && value === true)

        if (hasTrueInFirst) {
          const secondObj = tempForm[1]
          for (const key in secondObj) {
            const k = key as keyof Response.GetRegSettings
            console.log(k)

            if (typeof secondObj[k] === "boolean") {
              ;(secondObj[k] as boolean) = false
            }
          }
        }*/
      const refAccount = tempForm.find((e) => e.column_name === MEMBER_COLUMN_NAME.Enums.REF_ACCOUNT)
      const inviteCode = tempForm.find((e) => e.column_name === MEMBER_COLUMN_NAME.Enums.INVITE_CODE)
      if (refAccount && inviteCode) {
        const isRefActive = refAccount.player_register_required === true || refAccount.player_register_display === true

        if (isRefActive) {
          inviteCode.player_register_required = false
          inviteCode.player_register_display = false
        }
      }
    }

    // 确保数字类型字段为数字
    const settingsPayload = {
      ...settingForm.value,
      password_error_count: Number(settingForm.value.password_error_count),
      password_error_count_reset_minutes: Number(settingForm.value.password_error_count_reset_minutes),
      sso_google_oauth_enabled: thirdPartyLoginSelected.value.includes("google") ? 1 : 0,
      sso_telegram_oauth_enabled: thirdPartyLoginSelected.value.includes("telegram") ? 1 : 0
    }

    Promise.all([
      putSettings(settingsPayload as any),
      updateWebSiteRegSetting(form.value as Request.webSiteRegSetting[])
    ])
      .then(([settingData, regData]) => {
        if (settingData.code === 0 && regData.code === 0) {
          captureRegisterOtpServerSnapshot()
          $q.notify({
            type: "positive",
            message: t("message.edit_success"),
            position: "top",
            timeout: 300
          })
        } else {
          let msg
          if (settingData.code !== 0) {
            msg = settingData.msg
          } else if (regData.code !== 0) {
            msg = regData.msg
          }

          $q.notify({
            type: "negative",
            message: msg,
            position: "top",
            timeout: 300
          })
        }

        isLoading.value = false
      })
      .catch((e: any) => {})
  }

  onMounted(async () => {
    isLoading.value = true
    Promise.all([getWebSiteRegSetting(), getSettings()])
      .then(([regData, settingData]) => {
        console.log(regData.data)
        form.value = Array.isArray(regData.data) ? regData.data : []

        // 過濾掉 column_name 為 "registered_ip" 的項目
        // form.value = form.value.filter((item) => item.column_name !== "registered_ip")

        const validLanguagesSet = new Set(langList.value.map((item) => item.label))

        form.value = form.value.map((item) => {
          item.lang = item.lang || {}

          const orderedLang: { [key in LANGUAGE_TYPE.Enums]: string } = {} as { [key in LANGUAGE_TYPE.Enums]: string }

          // 先處理語言標籤，若 lang 中沒有該語言標籤，則補上空字串
          langList.value.forEach((lang: { label: LANGUAGE_TYPE.Enums }) => {
            // 如果原始 lang 中有這個語言，則保留其值，否則設為空字串
            orderedLang[lang.label] = item.lang[lang.label] || ""
          })

          // 更新 item 的 lang 屬性為新的排序後的 lang 物件
          item.lang = orderedLang

          // 過濾掉無效語言標籤
          Object.keys(item.lang).forEach((langKey) => {
            if (!validLanguagesSet.has(langKey as LANGUAGE_TYPE.Enums)) {
              delete item.lang[langKey as LANGUAGE_TYPE.Enums]
            }
          })

          return item
        })
        form.value = form.value.sort((a, b) => a.sort - b.sort)

        const langOrder = Object.keys(form.value[0].lang)
        langListSort.value = langOrder
          .map((key) => langList.value.find((item) => item.label === key))
          .filter((item) => item !== undefined)

        settingForm.value.register_method = settingData.data.register_method
        settingForm.value.slide_captcha_enabled = settingData.data.slide_captcha_enabled
        settingForm.value.register_otp = Number(settingData.data.register_otp ?? 0) ? 1 : 0
        settingForm.value.login_otp = Number(settingData.data.login_otp ?? 0) ? 1 : 0
        settingForm.value.member_bank_register = settingData.data.member_bank_register
        settingForm.value.member_bank_edit = settingData.data.member_bank_edit

        settingForm.value.auto_be_member_agent = settingData.data.auto_be_member_agent
          ? settingData.data.auto_be_member_agent
          : 0

        settingForm.value.password_error_count = settingData.data.password_error_count
          ? Number(settingData.data.password_error_count)
          : 0

        settingForm.value.password_error_count_reset_minutes = settingData.data.password_error_count_reset_minutes
          ? Number(settingData.data.password_error_count_reset_minutes)
          : 0

        // 将分钟转换为小时用于显示，四舍五入到小数点后第一位
        passwordResetHours.value = settingForm.value.password_error_count_reset_minutes
          ? Math.round((settingForm.value.password_error_count_reset_minutes / 60) * 10) / 10
          : 0

        // 初始化三方登入選擇值
        thirdPartyLoginSelected.value = []
        if (settingData.data.sso_google_oauth_enabled === 1) {
          thirdPartyLoginSelected.value.push("google")
        }
        if (settingData.data.sso_telegram_oauth_enabled === 1) {
          thirdPartyLoginSelected.value.push("telegram")
        }

        captureRegisterOtpServerSnapshot()
        updateRegisterMethod()
        reconcileRegisterOtpWithForm()

        isLoading.value = false
      })
      .catch((e: any) => {})
  })
  async function onDragEnd() {
    form.value.forEach((item, index) => {
      item.sort = index + 1
    })
  }

  interface webSiteRegSetting {
    player_register_required: boolean
    player_register_display: boolean
    player_center_required: boolean
    player_center_display: boolean
    player_center_edit: boolean
    agent_create_required: boolean
    agent_create_display: boolean
    agent_edit_required: boolean
    agent_edit_display: boolean
    agent_edit_edit: boolean
  }
  function updateRequireStatus(id: number, field: keyof webSiteRegSetting, value: boolean) {
    form.value.forEach((item, index) => {
      if (item.id === id) {
        if (value) {
          item[field] = true
        }
      }
    })
  }
  function updateDisplayStatus(id: number, field: keyof webSiteRegSetting, value: boolean, column_name: string) {
    if (
      (column_name === MEMBER_COLUMN_NAME.Enums.REF_ACCOUNT && field === "player_center_required") ||
      (column_name === MEMBER_COLUMN_NAME.Enums.REF_ACCOUNT && field === "agent_edit_required") ||
      (column_name === MEMBER_COLUMN_NAME.Enums.MEMBER_LEVEL && field === "agent_edit_required")
    ) {
      return
    }
    form.value.forEach((item, index) => {
      if (item.id === id) {
        if (!value) {
          item[field] = false
        }
      }
    })
  }

  //帳號/手機註冊
  function updateRegisterMethod() {
    const curr = settingForm.value.register_method
    const prev = lastRegisterMethod.value
    if (curr === 0 && prev !== null && prev !== 0) {
      applyRegisterOtpServerSnapshot()
    }

    const fieldsToUpdate: (keyof webSiteRegSetting)[] = [
      "player_register_required",
      "player_register_display",
      "player_center_required",
      "player_center_display",
      "player_center_edit",
      "agent_create_required",
      "agent_create_display",
      "agent_edit_required",
      "agent_edit_display",
      "agent_edit_edit"
    ]

    const updateFields = (item: any, value: boolean, disable?: boolean) => {
      const { register_method } = settingForm.value
      fieldsToUpdate.forEach((field) => {
        if (field in item) {
          const isPlayerCenterField =
            field === "player_center_required" || field === "player_center_display" || field === "player_center_edit"
          const isAgentCenterField =
            field === "agent_create_required" ||
            field === "agent_create_display" ||
            field === "agent_edit_required" ||
            field === "agent_edit_display" ||
            field === "agent_edit_edit"

          const isAgentPasswordCenter =
            field === "agent_edit_required" || field === "agent_edit_display" || field === "agent_edit_edit"

          if (register_method === 0) {
            //後臺編輯-密碼不要強制
            if (isAgentPasswordCenter && item["column_name"] === MEMBER_COLUMN_NAME.Enums.PASSWORD) {
              //....預留
            } else if (isAgentCenterField && item["column_name"] === MEMBER_COLUMN_NAME.Enums.CONFIRM_PASSWORD) {
              //確認密碼預設false
              item[field] = isAgentCenterField ? false : value
            } else {
              // 帳號註冊：會員中心相關欄位強制為 false
              item[field] = isPlayerCenterField ? false : value
            }
          } else {
            // 非帳號註冊；SMS_OTP 列時會員/代理中心欄位強制 false，其餘依 value
            const isSmsOtpField = item.column_name === MEMBER_COLUMN_NAME.Enums.SMS_OTP
            //密碼後台不可強制flase
            const isPwField = item.column_name === MEMBER_COLUMN_NAME.Enums.PASSWORD
            if (isPwField && isAgentPasswordCenter) {
              //....預留
            } else {
              item[field] = isSmsOtpField && (isPlayerCenterField || isAgentCenterField) ? false : value
            }
          }
        }
      })
      if (disable !== undefined) {
        item["disable"] = disable
      }
    }

    form.value.forEach((item) => {
      const { column_name } = item
      const { register_method } = settingForm.value
      // 僅帳號欄位固定不可調整；密碼與確認密碼需可獨立設定
      item["disable"] = column_name === MEMBER_COLUMN_NAME.Enums.ACCOUNT

      if (register_method === 0) {
        // 帳號登入模式
        if (item["disable"]) {
          updateFields(item, true)
        }
      } else {
        // 號碼註冊模式
        if (item["disable"]) {
          updateFields(item, false)
        } else if (column_name === MEMBER_COLUMN_NAME.Enums.PHONE) {
          updateFields(item, true, true)
        }
      }
    })

    if (settingForm.value.register_method === REGISTER_METHOD.Enums.Sms) {
      const phoneColmn = form.value.find((e) => e.column_name === MEMBER_COLUMN_NAME.Enums.PHONE)
      if (phoneColmn) {
        phoneColmn.player_center_edit = false
        phoneColmn.player_center_required = false
        phoneColmn.agent_edit_edit = false
        phoneColmn.agent_edit_required = false
      }
    }

    reconcileRegisterOtpWithForm()
    lastRegisterMethod.value = curr
  }
</script>

<style lang="scss" scoped>
  @import "../../../css/_variable.sass";

  .form-container {
    .custom-select-box {
      display: flex;
      align-items: center;
    }

    .custom-input-box {
      display: flex;
      align-items: center;
      :deep(.q-input) {
        padding-bottom: 0;
      }
    }

    .flex-column-top {
      display: flex;
      flex-direction: column;
    }

    ::v-deep(.q-tabs__content) {
      justify-content: flex-start;
    }
    ::v-deep(.q-panel-parent) {
      overflow: unset;
    }

    .custom-box-2 {
      width: 300px;
      flex: 0 0 200px;
    }
    .custom-box-3 {
      width: 300px;
      flex: 0 0 300px;
    }
    .custom-box {
      font-family: Noto Sans TC;
      font-size: 14px;
      font-weight: 500;
      padding: 0;
      text-align: left;
      position: relative;
      cursor: pointer;
      ::v-deep(.q-field__control) {
        min-height: 20px;
        height: 25px;
      }
      ::v-deep(.q-field__control) {
        height: 35px;
      }
      align-items: center;
      .custom-title {
        position: absolute;
        top: -40px;
        left: 8px;
      }
      .custom-top {
        padding-top: 10px;
        padding-bottom: 10px;
        text-align: center;
        width: 100%;
        border: 1px solid #c2c2ca;
        height: 45px;
      }
      .custom-center {
        padding-top: 5px;
        padding-bottom: 5px;
        padding-left: 10px;
        border: 1px solid #c2c2ca;
        .title {
          display: flex;
          justify-content: center;
          line-height: 41px;
          span {
            margin-left: 8px;
            margin-right: 8px;
          }
        }
      }
      .lines {
        border-right: 1px solid #c2c2ca;
      }
      .space {
        justify-content: space-around;
      }
      .c-flex {
        display: flex;

        padding-top: 0px;
        padding-bottom: 0px;
        .title {
          display: flex;
          justify-content: center;

          align-items: center;
          span {
            margin-left: 8px;
            margin-right: 8px;
          }
        }
        .sort {
          width: 55px;
          align-items: center;
        }
        .center-title {
          display: flex;
          justify-content: center;
          line-height: 41px;
          width: 50%;
          span {
            margin-left: 8px;
            margin-right: 8px;
          }
        }
      }
      .c-center-flex {
        display: flex;
        justify-content: space-around;
        padding: 0;
        height: 45px;
        ::v-deep(.q-radio) {
          margin-left: 6px;
          margin-right: 6px;
        }
        .lines {
          border-right: 1px solid #c2c2ca;
        }
        .radios {
          display: flex;
          width: 50%;
          justify-content: center;
          line-height: 41px;
        }
      }
    }
    /*.custom-box:last-child {
      border-bottom: none;
    }*/
    .submit-btn {
      width: 12rem;
      height: 2.875rem;
      font-size: 1rem;
      border-radius: 6px;
    }

    .filter-label {
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 8px;
    }
    .filter-select {
      min-width: 200px;
      ::v-deep(.q-field__control) {
        height: 40px;
      }
    }
  }
  .msk {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 99;
    cursor: not-allowed;
  }
  .drag-container {
    // display: flex;
    flex-wrap: wrap;
  }

  .rate {
    display: flex;
    align-items: center;
    span {
      font-size: 18px;
    }
  }
  .custom-rate-input {
    width: 30%;
    ::v-deep(.q-field__control) {
      height: 2.5rem;
    }
  }
  .q-item-center {
    align-items: center;
  }
</style>
