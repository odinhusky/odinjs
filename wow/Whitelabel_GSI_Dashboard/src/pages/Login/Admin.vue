<template>
  <q-page class="flex flex-center q-pa-lg loginWrapper" :class="className">
    <q-card class="formWrapper">
      <q-form class="items-center justify-center">
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <div class="row items-center justify-center q-mx-auto" style="width: 17.375rem">
              <h4 class="col-12 text-center">{{ $t("btn.login") }}</h4>

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
                Copyright &copy;{{ nowYear }} Aurora. All rights reserved.
              </p>
              <p class="text-center q-mb-xl text-grey-6 copyright">
                {{ $t("common.copy_right") }} &copy;{{ nowYear }} Aurora.
              </p>
            </div>
          </div>
          <div class="col-12 col-md-6">
            <div class="flex items-center justify-center q-pa-xl logoWrapper">
              <q-img class="logo" :src="adminLogo()" />
            </div>
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
  import { useImage } from "@/hook/useImage"
  import { login, LoginData } from "@/api/login"
  import { useI18n } from "vue-i18n"
  import { useRule } from "src/hook/useRule"
  import { useFavicon } from "@vueuse/core"
  import { useSearch } from "@/hook/useSearch"

  const { t } = useI18n()

  const { genTimeFormat } = useCommon()
  const rules = useRule()
  const $q = useQuasar()
  const router = useRouter()

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

  const { envData } = useEnv()

  const formData = reactive({
    account: "",
    password: "",
    recaptcha: ""
    // account: "superadmin",
    // password: "654321",
    // recaptcha: "a"
  })

  const { adminLogo, adminFav } = useImage()

  const loading = ref(false)

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
    const { search, status, tableData } = useSearch(login())
    await search(sendData)
    loading.value = false

    if (status.value) {
      sessionStorage.setItem("publicToken", tableData.value.accessToken)
      sessionStorage.setItem("account", formData.account)
      sessionStorage.setItem("userID", tableData.value.userID)
      router.push({ name: "Dashboard" })
    }

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

  onMounted(() => {
    useFavicon(adminFav, {
      rel: "icon"
    })
  })
</script>

<style lang="scss" scoped>
  @import "@/css/login.scss";
</style>
