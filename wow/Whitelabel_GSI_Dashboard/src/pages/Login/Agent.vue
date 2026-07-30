<template>
  <!-- 一般登入 -->
  <q-page class="flex flex-center q-pa-lg loginWrapper" :class="className">
    <q-card class="formWrapper">
      <q-form class="items-center justify-center">
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <div class="row items-center justify-center q-mx-auto" style="width: 17.375rem">
              <div class="q-mx-auto text-center q-pa-lg logoWrapper" v-if="!siteLoading">
                <q-img class="logo" :src="loginLogoImgBlack(envData().VITE_APP_MODE)" v-if="webSiteLogo === ''" />
                <q-img class="logo" :src="webSiteLogo" v-else />
              </div>

              <h5 class="col-12 text-center text-bold q-mt-none q-mb-md">{{ $t("btn.login") }}</h5>

              <!-- 帳號 -->
              <q-input
                ref="accountRef"
                v-model.trim="formData.account"
                type="text"
                autocomplete="username"
                outlined
                dense
                :placeholder="$t('common.please_enter_account')"
                lazy-rules
                color="primary"
                class="col-12 q-mb-xs input-control"
                :rules="[rules.required()]"
              >
                <template #prepend>
                  <q-icon name="account_circle" color="primary" />
                </template>
              </q-input>

              <!-- 密碼 -->
              <q-input
                ref="passwordRef"
                v-model.trim="formData.password"
                type="password"
                autocomplete="current-password"
                outlined
                dense
                :placeholder="$t('common.please_enter_password')"
                lazy-rules
                color="primary"
                class="col-12 q-mb-xs input-control"
                :rules="[rules.required()]"
              >
                <template #prepend>
                  <q-icon name="lock" color="primary" />
                </template>
              </q-input>

              <!-- 動態驗證碼 -->
              <q-input
                ref="recaptchaRef"
                v-model.trim="formData.recaptcha"
                type="text"
                autocomplete="one-time-code"
                maxlength="4"
                outlined
                dense
                :placeholder="$t('common.please_enter_recaptcha')"
                color="primary"
                class="col-12 q-mb-lg input-control"
              >
                <template #prepend>
                  <q-icon name="verified_user" color="primary" />
                </template>
              </q-input>

              <div class="col-12 q-mb-md">
                <q-btn color="primary" :label="$t('btn.login')" class="btnSubmit" @click="onSubmit" />
              </div>

              <p class="text-center q-mb-none text-grey-6 copyright">
                Copyright &copy;{{ nowYear }} {{ webSiteTitle }}. All rights reserved.
              </p>
              <p class="text-center q-mb-xl text-grey-6 copyright">
                {{ $t("common.copy_right") }} &copy;{{ nowYear }} {{ webSiteTitle }}.
              </p>
            </div>
          </div>
          <div class="col-12 col-md-6">
            <div class="flex items-center justify-center q-pa-xl formImg"></div>
          </div>
        </div>
      </q-form>
    </q-card>
  </q-page>
</template>

<script lang="ts" setup>
  import { ref, reactive, onMounted, computed } from "vue"
  import { useCommon } from "@/hook/useCommon"
  import { useQuasar } from "quasar"
  import { useRouter } from "vue-router"
  import { useEnv, ENV_MODE_ENUM } from "src/hook/useEnv"
  import { useEnvInfoStore } from "src/stores/envStore"
  import { useUserInfo } from "src/hook/useUserInfo"
  import { useImage } from "@/hook/useImage"
  import { login, LoginData } from "@/api/login"
  import { getSiteLogo } from "@/api/common"
  import { useI18n } from "vue-i18n"
  import { useRule } from "src/hook/useRule"
  import { useSiteStore } from "src/stores/siteStore"
  import { useFavicon } from "@vueuse/core"
  import { useSearch } from "@/hook/useSearch"

  const { t } = useI18n()

  const { genTimeFormat } = useCommon()
  const { userInfo } = useUserInfo()
  const rules = useRule()
  const $q = useQuasar()
  const router = useRouter()
  const siteStore = useSiteStore()
  const nowYear = computed(() => genTimeFormat(new Date(), "yyyy"))

  const className = computed(() => {
    switch (envData().VITE_APP_MODE) {
      case ENV_MODE_ENUM.ADMIN:
        return "adminWrapper"
      case ENV_MODE_ENUM.GENERAL_AGENT:
        return "generalAgentWrapper"
      case ENV_MODE_ENUM.AGENT:
      case ENV_MODE_ENUM.ANIBET_AGENT:
      case ENV_MODE_ENUM.AMUSEVIP:
        return "agentWrapper"
      default:
        return "unknownWrapper"
    }
  })
  const accountRef = ref()
  const passwordRef = ref()
  const recaptchaRef = ref()

  const webSiteTitle = ref("")
  const webSiteLogo = ref("")
  const { envData } = useEnv()
  const { envInfo } = useEnvInfoStore()
  const localAgentCode = computed(() => (process.env.NODE_ENV === "development" ? envInfo.agentCode : undefined))

  const formData = reactive({
    account: "",
    password: "",
    recaptcha: ""
  })

  const { loginLogoImgBlack } = useImage()

  const loading = ref(false)
  const siteLoading = ref(true)

  const onSubmit = async () => {
    // const userInfoStore = useUserInfoStore()
    // let { userInfo } = storeToRefs(store)
    accountRef.value.validate()
    passwordRef.value.validate()
    recaptchaRef.value.validate()

    if (accountRef.value.hasError || passwordRef.value.hasError || recaptchaRef.value.hasError) {
      return $q.notify({
        color: "red-5",
        textColor: "white",
        icon: "warning",
        message: t("common.validate.verificationError"),
        position: "top"
      })
    }

    const sendData: LoginData = {
      username: formData.account,
      password: formData.password,
      otp_code: formData.recaptcha
    }

    loading.value = true
    const { search, status, tableData } = useSearch(login({ agentCode: localAgentCode.value || undefined }))
    await search(sendData)
    loading.value = false

    if (status.value) {
      sessionStorage.setItem("publicToken", tableData.value.accessToken)
      sessionStorage.setItem("account", formData.account)
      sessionStorage.setItem("userID", tableData.value.userID)
      userInfo.setAgentId(tableData.value.agentCode)
      router.push({ name: "Dashboard" })
    }

    // router.push({ name: "Home" })
    // 登入後帶入的使用者基本資料, 先塞假資料
    // updatedUserInfo({
    //   username: '代理帳號',
    //   account: 'Blues',
    //   token: '',
    //   userId: 12,
    //   menuList: []
    // })
  }

  const onReset = () => {
    formData.account = ""
    formData.password = ""
    formData.recaptcha = ""

    accountRef.value.resetValidation()
    passwordRef.value.resetValidation()
    recaptchaRef.value.resetValidation()
  }

  onMounted(async () => {
    const res = await getSiteLogo()
    if (res.code === 0) {
      const { bo_logo, bo_ico, title, updated_time } = res.data
      if (bo_logo !== "") {
        webSiteLogo.value = `${envData().VITE_APP_BASE_API}/${bo_logo}?updateTime=${updated_time}`
      }
      if (bo_ico !== "") {
        useFavicon(`/${bo_ico}?updateTime=${updated_time}`, {
          baseUrl: envData().VITE_APP_BASE_API,
          rel: "icon"
        })
      }
      webSiteTitle.value = title
      siteLoading.value = false
    }
  })
</script>

<style lang="scss" scoped>
  @import "@/css/login.scss";
</style>
