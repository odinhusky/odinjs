<template>
  <q-card class="no-shadow bg-transparent add_card">
    <q-card-section>
      <div class="row q-col-gutter-lg">
        <div class="row col-12 languageTabsWrapper">
          <AiLanguage class="mb-4 w-full justify-end" @applyLanguage="applyLanguage" />

          <div class="col-12">
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
                :name="lang.label"
                :label="lang.label"
                class="q-px-none q-mr-md"
                content-class="languageTabItem"
              />
            </q-tabs>

            <q-tab-panels v-model="language.current" animated swipeable>
              <q-tab-panel
                v-for="(lang, key) in language.list"
                :key="key"
                :name="lang.label"
                :label="lang.label"
                class="q-px-none"
              >
                <div class="text-h6">
                  <q-input
                    v-model.trim="form.titles[language.current]"
                    outlined
                    dense
                    hide-bottom-space
                    outline
                    borderless
                    class="bg-transparent"
                    :placeholder="$t('common.please_enter_content')"
                  />
                </div>
              </q-tab-panel>
            </q-tab-panels>
          </div>
        </div>
        <div class="col-12 col-sm-5 q-col-gutter-md avatarWrapper">
          <div class="label text-left">{{ $t("common.vip_avatar") }}</div>
          <div class="row q-pt-none" style="padding-top: 0.3125rem; align-items: center; display: flex">
            <div class="q-mr-md avatarImg">
              <PreviewImage
                :parentImage="form.img"
                :defaultImage="addAvatarDefault()"
                :aspectRatio="'52/52'"
                @update:modelValue="updateImgUrl"
                imageToBase64
              />
            </div>
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
        <!-- 取款設置 -->
        <div class="col-6 col-sm-6" v-if="!siteStore.isCredit">
          <div class="q-mb-sm text-left">{{ $t("table_header.number_of_withdrawals") }}</div>
          <div class="text-center">
            <div class="row items-center no-wrap audit-multiple-container">
              <q-btn size="md" square flat @click="addRatio(-1)" class="q-left">-</q-btn>
              <q-input v-model.number="form.withdraw_count" borderless class="default-input audit-multiple" />
              <q-btn size="md" square flat @click="addRatio(1)" class="q-right">+</q-btn>
            </div>
          </div>
        </div>
        <div class="col-12 col-sm-12">
          <div class="col-12 col-sm">
            <div class="label text-left">{{ $t("table_header.remark") }}</div>
            <q-input
              v-model="form.remark"
              borderless
              dense
              hide-bottom-space
              outlined
              :placeholder="$t('common.please_enter_content')"
              class="q-pt-none"
              type="textarea"
              style="padding-top: 0.625rem"
            />
          </div>
        </div>
      </div>
    </q-card-section>
    <q-card-section align="center">
      <q-btn color="main-color" @click="onSubmit" class="edit_btns">{{ $t("btn.next_step") }}</q-btn>
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
  import { reactive, computed, onMounted } from "vue"
  import { useQuasar } from "quasar"
  import { useI18n } from "vue-i18n"
  import { storeToRefs } from "pinia"
  import { useMemberLevelStore } from "@/stores/memberLevel"
  import { useStepper } from "@/hook/useStepper"
  import { useCommon } from "@/hook/useCommon"
  import { LANGUAGE_TYPE, MEMBER_LEVEL } from "@/utils/constants"
  import { useImage } from "@/hook/useImage"
  import type * as Request from "@/api/request.type"
  import PreviewImage from "@/components/forms/PreviewImage.vue"
  import { useSiteStore } from "@/stores/siteStore"
  import AiLanguage from "@/components/ai/aiLanguage.vue"
  import { translateAiText } from "@/api/ai"

  const $q = useQuasar()
  const { t } = useI18n()
  const { enumToArray } = useCommon()
  const memberLevelStore = useMemberLevelStore()
  const { addAvatarDefault } = useImage()
  const { nextPrevStep } = useStepper()
  const { memberLevelItem: form } = storeToRefs(memberLevelStore)
  const siteStore = useSiteStore()
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
    current: languageList.value[0].label
  })

  function onDeleteAvatar() {
    form.value.img = ""
  }

  function updateImgUrl(value: string) {
    form.value.img = value
  }

  function addRatio(num: number) {
    form.value.withdraw_count += num
  }
  const levelList = computed(() =>
    enumToArray(MEMBER_LEVEL.Enums).map((item) => ({
      label: MEMBER_LEVEL.I18nKeys[MEMBER_LEVEL.Enums[item as keyof typeof MEMBER_LEVEL.Enums]]
        ? t(MEMBER_LEVEL.I18nKeys[MEMBER_LEVEL.Enums[item as keyof typeof MEMBER_LEVEL.Enums]])
        : t("common.unknow"),
      value: MEMBER_LEVEL.Enums[item as keyof typeof MEMBER_LEVEL.Enums]
    }))
  )
  function checkLangValidity(lang: { [key: string]: string }): boolean {
    for (let key in lang) {
      const langKey = siteStore.langList.map((lang) => lang.label)
      if (langKey.includes(key) && lang[key] === "") {
        $q.notify({
          type: "negative",
          message: `${t("error_msg.form_validate_error_tip")} (${key})`,
          position: "top",
          timeout: 1000
        })
        return false
      }
    }
    return true
  }
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
    if (!checkLangValidity(form.value.titles)) {
      return false
    }
    return true
  }

  async function onSubmit() {
    if (!canSendApi()) {
      return
    }
    await memberLevelStore.initCurrencyValue()
    nextPrevStep(true)
  }

  const applyLanguage = async () => {
    try {
      const firstItemData = form.value.titles[language.current]
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

  onMounted(() => {
    form.value.promotion_type = 1
  })
</script>

<style lang="scss" scoped>
  @import "@/css/memberLevelSettings.scss";

  .avatarImg {
    background: transparent !important;
    max-width: 50px;
  }
  .audit-multiple {
    ::v-deep(.q-field__native) {
      text-align: center !important;
    }
  }
</style>
