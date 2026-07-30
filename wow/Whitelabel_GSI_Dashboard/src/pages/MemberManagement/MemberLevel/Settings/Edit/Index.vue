<template>
  <div class="">
    <SubPage action-label-i18n-key="btn.edit" />
  </div>

  <div class="q-pa-md" style="padding-top: 0">
    <q-card class="editWrapper_v2 bg-white">
      <q-card-section class="q-pt-lg">
        <div class="bold h1-bold text-center grey">{{ $t("common.edit_member_level") }}</div>
      </q-card-section>

      <q-card-section>
        <div class="row q-col-gutter-md">
          <AiLanguage class="mb-4 w-full justify-end" @applyLanguage="applyLanguage" />
          <div class="col-12 languageTabsWrapper">
            <q-tabs
              v-model="language.current"
              dense
              class="bg-transparent text-grey-8"
              active-color="main-color"
              content-class="languageTab"
              outside-arrows
            >
              <q-tab
                v-for="(lang, key) in language.list"
                :key="key"
                :name="lang.value"
                :label="lang.label"
                class="q-px-none"
                content-class="languageTabItem"
              />
            </q-tabs>

            <q-tab-panels v-model="language.current" animated swipeable>
              <q-tab-panel
                v-for="(lang, key) in language.list"
                :name="lang.value"
                :label="lang.label"
                class="q-px-none"
              >
                <div class="text-h6">
                  <q-input
                    v-model.trim="form.titles[lang.label]"
                    outlined
                    dense
                    hide-bottom-space
                    outline
                    borderless
                    :placeholder="$t('common.please_enter_content')"
                  />
                </div>
              </q-tab-panel>
            </q-tab-panels>
          </div>
          <div class="col-12 col-sm-4 q-col-gutter-md avatarWrapper">
            <div class="h7-bold">{{ $t("common.vip_avatar") }}</div>
            <div class="row q-pt-none" style="padding-top: 0.3125rem; align-items: center; display: flex">
              <div class="q-mr-md avatarImg">
                <PreviewImage
                  :parentImage="form.img"
                  :defaultImage="addAvatarDefault()"
                  :aspectRatio="'52/52'"
                  @update:modelValue="updateImgUrl"
                  @img-uploaded="onImgUploaded"
                  imageToBase64
                />
              </div>
              <!-- TODO: 是否需要拿掉 -->
              <div class="col q-mr-md text-left avatarTips">
                *{{ $t("common.vip_avatar_tip_1") }}
                <br />
                {{ $t("common.vip_avatar_tip_2") }}
              </div>
              <div class="">
                <q-btn outline color="pink-7" @click="onDeleteAvatar">
                  {{ $t("btn.remove") }}
                  <q-icon class="q-ml-xs" size="xs" name="delete" />
                </q-btn>
              </div>
            </div>
          </div>
          <div class="col-6 col-sm-6" v-if="!siteStore.isCredit">
            <div class="h7-bold">{{ $t("table_header.number_of_withdrawals") }}</div>
            <div class="col">
              <div class="row items-center no-wrap audit-multiple-container">
                <q-btn size="md" square flat @click="addRatio(-1)" class="q-left">-</q-btn>
                <q-input v-model.number="form.withdraw_count" borderless class="default-input audit-multiple" />
                <q-btn size="md" square flat @click="addRatio(1)" class="q-right">+</q-btn>
              </div>
            </div>
          </div>
          <div class="col-12 col-sm-12">
            <div class="h7-bold">{{ $t("table_header.remark") }}</div>
            <q-input
              v-model="form.remark"
              outlined
              dense
              hide-bottom-space
              outline
              borderless
              :placeholder="$t('common.please_enter_content')"
              class="q-pt-none"
              style="max-width: 31.25rem; padding-top: 0.625rem"
            />
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <q-separator />
      </q-card-section>
      <q-card-section>
        <div class="row q-col-gutter-md" style="max-width: 63.75rem">
          <!-- 晉級設置 -->
          <div class="col-12 q-mb-md">
            <div class="h4-bold bold grey q-mb-sm">{{ $t("common.promotion_settings") }}</div>
            <div class="h7-bold" v-if="!siteStore.isCredit">
              {{ $t("table_header.promotion_calculation_method") }}
            </div>
            <div class="row items-center q-mb-sm" v-if="!siteStore.isCredit">
              <q-option-group
                v-model="form.promotion_type"
                :options="levelUpTags"
                color="primary"
                :disable="isDefault"
                class="q-radio-style"
              />
            </div>
            <div style="display: flex; justify-content: space-between">
              <q-markup-table square separator="none" v-if="!siteStore.isCredit" class="q-mr-md">
                <thead thead class="bg-success">
                  <tr>
                    <th rowspan="2">{{ $t("table_header.currency") }}</th>
                    <th colspan="2">{{ $t("table_header.level_up_condition") }}</th>
                  </tr>
                  <tr>
                    <th>{{ $t("table_header.validate_bet") }}</th>
                    <th>{{ $t("table_header.deposit_amount") }}</th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="item in queryStore.currencyList" :key="item.value">
                    <!-- 幣別 -->
                    <td key="currency">
                      {{ $t(item.label) }}
                    </td>

                    <!-- 有效投注 -->
                    <q-td key="valid_betting">
                      <q-number
                        v-model="form.valid_bet_amount[item.value]"
                        :options="generalOptions"
                        outlined
                        dense
                        hide-bottom-space
                        outline
                        borderless
                        :placeholder="$t('common.please_enter_content')"
                        :disable="isDefault"
                        class="default-input"
                      />
                    </q-td>

                    <!-- 存款金額 -->
                    <q-td key="deposit_amount">
                      <q-number
                        v-model="form.deposit_amount[item.value]"
                        :options="generalOptions"
                        outlined
                        dense
                        hide-bottom-space
                        outline
                        borderless
                        :placeholder="$t('common.please_enter_content')"
                        :disable="isDefault"
                        class="default-input"
                      />
                    </q-td>
                  </tr>
                </tbody>
              </q-markup-table>
              <q-markup-table square separator="none" v-if="!siteStore.isCredit">
                <thead thead class="bg-success">
                  <tr>
                    <th rowspan="2">{{ $t("table_header.currency") }}</th>
                    <th colspan="2">{{ $t("table_header.level_up_offer") }}</th>
                  </tr>
                  <tr>
                    <th>{{ $t("table_header.level_up_reward") }}</th>
                    <th>{{ $t("table_header.birthday_reward") }}</th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="item in queryStore.currencyList" :key="item.value">
                    <!-- 幣別 -->
                    <td key="currency">
                      {{ $t(item.label) }}
                    </td>

                    <!-- 晉級禮金 -->
                    <q-td key="valid_betting">
                      <q-number
                        v-model="form.promotion_bonus[item.value]"
                        :options="optionsLimit"
                        outlined
                        dense
                        hide-bottom-space
                        outline
                        borderless
                        :placeholder="$t('common.no_statistics')"
                        class="default-input"
                      />
                    </q-td>

                    <!-- 生日禮金 -->
                    <q-td key="deposit_amount">
                      <q-number
                        v-model="form.birthday_bonus[item.value]"
                        :options="optionsLimit"
                        outlined
                        dense
                        hide-bottom-space
                        outline
                        borderless
                        :placeholder="$t('common.no_statistics')"
                        class="default-input"
                      />
                    </q-td>
                  </tr>
                </tbody>
              </q-markup-table>
            </div>
            <!--信用版-->
            <q-markup-table square separator="none" v-if="siteStore.isCredit" style="width: 50%">
              <thead thead class="bg-success">
                <tr>
                  <th rowspan="2">{{ $t("table_header.currency") }}</th>
                  <th colspan="1">{{ $t("table_header.level_up_condition") }}</th>
                </tr>
                <tr>
                  <th>{{ $t("table_header.validate_bet") }}</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="item in queryStore.currencyList" :key="item.value">
                  <!-- 幣別 -->
                  <td key="currency">
                    {{ $t(item.label) }}
                  </td>

                  <!-- 有效投注 -->
                  <q-td key="valid_betting">
                    <q-number
                      v-model="form.valid_bet_amount[item.value]"
                      :options="generalOptions"
                      outlined
                      dense
                      hide-bottom-space
                      outline
                      borderless
                      :placeholder="$t('common.please_enter_content')"
                      class="default-input"
                    />
                  </q-td>
                </tr>
              </tbody>
            </q-markup-table>
          </div>
          <div class="col-6 col-md-6 q-mb-md"></div>
        </div>
      </q-card-section>

      <q-card-actions class="row q-gutter-md item-center justify-center">
        <q-btn outline color="main-color" class="btnCancel q-mr-md" @click="onCancel">
          {{ $t("btn.cancel") }}
        </q-btn>
        <q-btn color="main-color" class="btnSubmit" :loading="loading" @click="onSubmit">{{ $t("btn.check") }}</q-btn>
      </q-card-actions>
    </q-card>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, onMounted, computed, watch } from "vue"
  import { useQuasar } from "quasar"
  import { useRouter, useRoute } from "vue-router"
  import { useI18n } from "vue-i18n"
  import { useSearch } from "@/hook/useSearch"
  import { useCommon } from "@/hook/useCommon"
  import { useImage } from "@/hook/useImage"
  import { useForm } from "@/hook/useForm"
  import PreviewImage from "@/components/forms/PreviewImage.vue"
  import SubPage from "layouts/SubPage/Index.vue"
  import { CURRENCY_TYPE, LANGUAGE_TYPE, LEVEL_UP_TYPE, MEMBER_LEVEL } from "@/utils/constants"
  import { getMemberLevelSingleDetail, updateMemberLevelSettings } from "@/api/memberLevel"
  import type * as Request from "@/api/request.type"
  import { useSiteStore } from "@/stores/siteStore"
  import { useQueryStore } from "@/stores/queryStore"
  import { useEnv } from "src/hook/useEnv"
  import AiLanguage from "@/components/ai/aiLanguage.vue"
  import { translateAiText } from "@/api/ai"

  interface newItemType {
    label?: string
    value?: number
  }
  const $q = useQuasar()
  const router = useRouter()
  const route = useRoute()
  const { t } = useI18n()
  const { envData } = useEnv()
  const { VITE_APP_BASE_API } = envData()

  const siteStore = useSiteStore()
  const queryStore = useQueryStore()
  const { moneyFormat } = useCommon()
  const { search, tableData } = useSearch(getMemberLevelSingleDetail)
  const { addAvatarDefault } = useImage()
  const { convertValuesToNumber } = useForm()
  const isDefault = ref(false)

  const generalOptions = {
    min: 0,
    precision: "0",
    nullValue: "0"
  }
  const optionsLimit = {
    nullValue: ""
  }

  // 多語系（套用）
  const languageList = computed(() => {
    const languageList = siteStore.langList
    return languageList.map((e) => {
      const label = e.label
      const value = e.value
      return {
        label,
        value
      }
    })
  })

  const language = reactive({
    list: languageList,
    current: languageList?.value[0] ? languageList?.value[0].value : 0
  })

  const { enumToArray } = useCommon()
  const currencyList = reactive<newItemType[]>([])

  const memberLevelId = ref(0)
  const loading = ref(false)
  interface FormType {
    remark: string
    img: string
    titles: Record<string, string>
    withdraw_count: number
    promotion_type: number
    valid_bet_amount: Record<string, number>
    deposit_amount: Record<string, number>
    promotion_bonus: Record<string, number>
    birthday_bonus: Record<string, number>
  }

  const form = ref<FormType>({
    remark: "",
    img: "",
    titles: {},
    withdraw_count: 0,
    promotion_type: 0,
    valid_bet_amount: {},
    deposit_amount: {},
    promotion_bonus: {},
    birthday_bonus: {}
  })

  function addRatio(num: number) {
    form.value.withdraw_count += num
  }

  function onDeleteAvatar() {
    form.value.img = ""
  }

  function updateImgUrl(value: string) {
    form.value.img = value
  }
  const levelUpTags = computed(() =>
    Object.values(LEVEL_UP_TYPE.Enums)
      .filter((v) => !isNaN(Number(v)))
      .map((item) => ({
        label: t(LEVEL_UP_TYPE.I18nKeys[item as keyof typeof LEVEL_UP_TYPE.I18nKeys]),
        value: item
      }))
  )

  const canSendApi = (): boolean => {
    if (!form.value.img) {
      $q.notify({
        type: "negative",
        message: `${t("table_header.please_select")}${t("common.vip_avatar")}`,
        position: "top",
        timeout: 1000
      })
      return false
    }
    return true
  }

  const isImgUploaded = ref(false)

  const onImgUploaded = () => {
    isImgUploaded.value = true
  }

  const validateAmounts = (payload: {
    [key: string]: {
      deposit_amount?: string | number
      valid_bet_amount?: string | number
    }
  }): boolean => {
    for (const [currency, values] of Object.entries(payload)) {
      for (const [key, value] of Object.entries(values)) {
        if (Number(value) === 0) {
          $q.notify({
            type: "negative",
            message: `${t("error_msg.the_amount_greater_than_0")} (${currency})`,
            position: "top",
            timeout: 1000
          })
          return false
        }
      }
    }
    return true
  }

  const validateRewardAmount = (payload: {
    [key: string]: {
      promotion_bonus?: string | number
      birthday_bonus?: string | number
    }
  }): boolean => {
    for (const [currency, values] of Object.entries(payload)) {
      for (const [key, value] of Object.entries(values)) {
        if (Number(value) === 0) {
          $q.notify({
            type: "negative",
            message: `${t("error_msg.the_amount_greater_than_0")} (${currency})`,
            position: "top",
            timeout: 1000
          })
          return false
        }
      }
    }
    return true
  }

  async function onSubmit() {
    if (!canSendApi()) {
      return
    }
    const filterelan = {}

    for (let key in form.value.titles) {
      if (language.list.some((item) => item.label === key)) {
        filterelan[key] = form.value.titles[key]
      }
    }
    const payload: Request.updateMemberLevel = {
      id: Number(route.params.id as string),
      img: form.value.img,
      titles: filterelan,
      remark: form.value.remark,
      // 晉級計算方式
      promotion_type: form.value.promotion_type,
      // 每日取款次數
      withdraw_count: form.value.withdraw_count,
      condition: {},
      reward: {}
    }

    if (isImgUploaded.value) {
      payload.img = form.value.img
    }

    // 晉級設置
    //現金版
    if (!siteStore.isCredit) {
      Object.keys(form.value.valid_bet_amount).forEach((currency) => {
        let val = queryStore.currencyList.find((c) => c.value?.toString() == currency)?.value

        if (val) {
          payload.condition[CURRENCY_TYPE.Enums[val as CURRENCY_TYPE.Enums]] = {
            deposit_amount: form.value.deposit_amount[val] || 0,
            valid_bet_amount: form.value.valid_bet_amount[val] || 0
          }
        } else {
          console.warn(`No label found for currency: ${CURRENCY_TYPE.Enums[val as CURRENCY_TYPE.Enums]}`)
        }
      })
      Object.keys(form.value.promotion_bonus).forEach((currency) => {
        let val = queryStore.currencyList.find((c) => c.value?.toString() == currency)?.value
        if (val) {
          payload.reward[CURRENCY_TYPE.Enums[val as CURRENCY_TYPE.Enums]] = {
            promotion_bonus: form.value.promotion_bonus[val] === "" ? -1 : form.value.promotion_bonus[val],
            birthday_bonus: form.value.birthday_bonus[val] === "" ? -1 : form.value.birthday_bonus[val]
          }
        } else {
          console.warn(`No label found for currency: ${CURRENCY_TYPE.Enums[val as CURRENCY_TYPE.Enums]}`)
        }
      })
      //判斷輸入金額
      if (!isDefault.value) {
        const isValid = validateAmounts(payload.condition)
        //const isValid2 = validateRewardAmount(payload.reward)

        if (!isValid) {
          return
        }
      }
    } else {
      //信用版
      Object.keys(form.value.valid_bet_amount).forEach((currency) => {
        let val = queryStore.currencyList.find((c) => c.value?.toString() == currency)?.value
        if (val) {
          payload.condition[CURRENCY_TYPE.Enums[val as CURRENCY_TYPE.Enums]] = {
            deposit_amount: form.value.valid_bet_amount[val] || 0,
            valid_bet_amount: form.value.valid_bet_amount[val] || 0
          }
        }
      })
      //判斷輸入金額
      const isValid = validateAmounts(payload.condition)
      if (!isValid) {
        return
      }
    }

    loading.value = true

    const { search, status } = useSearch(updateMemberLevelSettings)
    await search(payload)
    if (status.value) {
      $q.notify({
        type: "positive",
        message: t("message.edit_success"),
        position: "top",
        timeout: 300
      })

      setTimeout(() => {
        router.push({ name: "MemberLevelSetting" })
      }, 500)
    } else {
      loading.value = false
    }
  }

  function onCancel() {
    router.push({ name: "MemberLevelSetting" })
  }

  const applyLanguage = async () => {
    try {
      const languageName = language.list?.[language.current]?.label
      const firstItemData = form.value.titles[languageName]
      if (!firstItemData) {
        $q.notify({
          type: "negative",
          message: t("message.please_fill_the_first_language_content_before_using_ai_translation"),
          position: "top",
          timeout: 300
        })
        return
      }

      $q.loading.show()
      const languages = language.list.map((item) => item.label)
      const { status, data } = await translateAiText([{ input_text: firstItemData, languages }])
      if (status && Array.isArray(data) && data.length) {
        Object.keys(data[0].translations).forEach((key) => {
          form.value.titles[key as keyof typeof form.value.titles] = data[0].translations[key]
        })
        $q.notify({
          type: "positive",
          message: t("message.ai_translation_completed"),
          position: "top",
          timeout: 300
        })
      }
    } catch (error) {
      console.error("applyLanguage error", error)
    } finally {
      $q.loading.hide()
    }
  }

  onMounted(async () => {
    await queryStore.getCurrencyList()

    memberLevelId.value = parseInt(route.params.id as string)
    await search(memberLevelId.value)

    const data = tableData.value

    form.value.remark = data.remark
    form.value.img = data.img_base64
    form.value.titles = data.titles ? data.titles : []

    form.value.valid_bet_amount = {}
    form.value.deposit_amount = {}
    form.value.promotion_bonus = {}
    form.value.birthday_bonus = {}

    data.condition.forEach((item: any) => {
      form.value.valid_bet_amount[item.currency_id] = item.valid_bet_amount
      form.value.deposit_amount[item.currency_id] = item.deposit_amount
    })

    data.reward.forEach((item: any) => {
      form.value.promotion_bonus[item.currency_id] = item.promotion_bonus === "-1" ? "" : item.promotion_bonus
      form.value.birthday_bonus[item.currency_id] = item.birthday_bonus === "-1" ? "" : item.birthday_bonus
    })

    form.value.withdraw_count = data.withdraw_count
    form.value.promotion_type = data.promotion_type
    isDefault.value = data.is_default
  })
</script>

<style lang="scss" scoped>
  @import "@/css/memberLevelSettings.scss";
  .tip {
    margin: 0.4rem 0 1.7rem 0;
  }

  .avatarImg {
    background: #fff !important;
    max-width: 50px;
  }
  .audit-multiple {
    ::v-deep(.q-field__native) {
      text-align: center !important;
    }
  }
</style>
