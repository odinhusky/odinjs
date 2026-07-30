<template>
  <div class="q-pa-md">
    <SubPage :action-label-i18n-key="'btn.add'" :custom-back-func="onBackTo">
      <template #title-suffix>
        <q-btn
          round
          color="primary"
          icon="priority_high"
          size="xs"
          class="ml-1 hide-hover"
          @click="showRulesDialog = true"
        />
      </template>
    </SubPage>

    <!-- 利息寶規則彈窗 -->
    <q-dialog v-model="showRulesDialog">
      <q-card style="min-width: 600px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ $t("menu.rule_title").replace("：", "") }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <div class="text-bold q-mb-sm">{{ $t("menu.rule_title") }}</div>
          <div class="rule-list">
            <p v-for="n in 7" :key="n">{{ n }}.{{ $t(`menu.rule_${n}`) }}</p>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn color="primary" :label="$t('btn.check')" v-close-popup class="action-btn" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-card class="bg-white py-6">
      <q-card-section>
        <div class="text-h6 stepperLabelWrapper">{{ $t("menu.interest_treasure") }}</div>
      </q-card-section>

      <q-form @submit="handleSubmit">
        <!-- 基本信息 -->
        <q-card-section>
          <div class="text-subtitle1">{{ $t("query_params.event_name") }}</div>
          <div class="row q-col-gutter-md">
            <div class="col-6">
              <q-input v-model="form.name" outlined dense />
            </div>
          </div>
        </q-card-section>

        <!-- 多语言信息 -->
        <q-card-section class="q-pb-xs">
          <div class="row tab-container">
            <div class="col-6">
              <q-tabs
                v-model="language.current"
                class="justify-start lang-tabs q-ml-md text-grey bg-transparent"
                indicator-color="light-blue-1"
                active-color="black"
                dense
              >
                <q-tab v-for="(lang, key) in language.list" :key="key" :name="lang.label" :label="lang.label" />
              </q-tabs>
            </div>

            <div class="q-pl-lg col-6 row items-center q-col-gutter-md justify-end">
              <AiLanguage class="mb-2" @applyLanguage="applyLanguage" />
            </div>
          </div>
          <q-tab-panels v-model="language.current" animated class="bg-edit-color q-pa-sm rounded-borders">
            <q-tab-panel v-for="item in form.info" :key="item.lang" :name="item.lang" class="q-px-none">
              <div class="row q-col-gutter-xl">
                <div class="col-6">
                  <div>{{ $t("edit_form.member_display_name") }}</div>
                  <q-input v-model="item.title" square borderless dense class="edit-input" />
                  <div class="q-mt-lg">{{ $t("interest_treasure.banner") }}</div>
                  <div class="q-mb-xs">{{ $t("interest_treasure.limit") }}</div>
                  <div class="row no-wrap">
                    <div class="col-9 q-pt-xs">
                      <PreviewImage
                        :parentImage="item.lang ? previewImages[item.lang] || item.image : item.image"
                        :defaultImage="interestTreasureBanner()"
                        :aspectRatio="'236/132'"
                        @update:modelValue="updateInterestTreasureBanner($event, item)"
                        imageToBase64
                        :maxFileSize="204800"
                      />
                    </div>
                    <div class="col-3">
                      <div class="column justify-end q-pl-md fit">
                        <q-btn class="q-mt-xs" color="red-5" @click="deleteImage(item)">{{
                          $t("common.delete")
                        }}</q-btn>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </q-card-section>

        <!-- 活动设置 -->
        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-6">
              <div class="text-subtitle1">{{ $t("query_params.event_time") }}</div>
              <DateTimePicker
                class="edit-input"
                label=""
                :date-time-model="dateTimeSelector"
                :on-update-date-time="onUpdateDateTime"
                :with-outlined="false"
                :with-borderless="true"
                :use-time-picker="true"
                :date-option="minDateOption"
              />
            </div>

            <div class="col-6">
              <div class="text-subtitle1">{{ $t("common.currency") }}</div>
              <q-select v-model="form.currency_id" :options="currencyList" outlined dense emit-value map-options />
            </div>
          </div>
        </q-card-section>

        <!-- 利息方案 -->
        <q-card-section>
          <div class="row items-center justify-between q-mb-md">
            <div class="text-subtitle1">{{ $t("query_params.event_plan") }}</div>
            <q-btn color="primary" size="sm" @click="addPlan">{{ $t("btn.add") }}</q-btn>
          </div>
          <div class="row q-col-gutter-md">
            <div v-for="(plan, index) in form.plans" :key="index" class="">
              <div class="col col-3 q-pa-md" style="background: #fcf8ff; border-radius: 10px">
                <div class="q-mb-sm">
                  <span>{{ $t("interest_treasure.principal") }}<span class="text-red text-bold text-h6">‧</span></span>
                  <q-input v-model="plan.principal" type="number" outlined dense />
                </div>
                <div class="q-mb-sm">
                  <span
                    >{{ $t("interest_treasure.lock_period_days")
                    }}<span class="text-red text-bold text-h6">‧</span></span
                  >
                  <q-input v-model.number="plan.days" type="number" outlined dense />
                </div>
                <div class="q-mb-sm">
                  <span
                    >{{ $t("interest_treasure.interest_rate") }}<span class="text-red text-bold text-h6">‧</span></span
                  >
                  <q-input v-model="plan.interest_rate" type="number" outlined dense suffix="%" />
                </div>
                <div class="flex justify-end items-center">
                  <q-btn v-if="form.plans.length > 1" color="red-5" @click="removePlan(index)">
                    {{ $t("common.delete") }}
                  </q-btn>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-section>
          <div class="row q-pa-md" style="background: #fcf8ff; border-radius: 10px">
            <div class="col-6">
              <div class="text-subtitle1">{{ $t("interest_treasure.maximum_interest_limit") }}</div>
              <q-input class="w-60" v-model.number="form.maximum_interest_limit" type="number" outlined dense />
              <span class="text-red text-xs ml-1">{{ $t("interest_treasure.max_rule") }}</span>
            </div>
          </div>
        </q-card-section>

        <q-card-section>
          <div class="row q-pa-md" style="background: #fcf8ff; border-radius: 10px">
            <div class="col-6">
              <div class="text-subtitle1">{{ $t("edit_form.audit_multiple") }}</div>
              <div class="q-mt-xs row items-center no-wrap audit-multiple-container border-radius-10">
                <q-btn size="md" square flat @click="decreaseAuditRate">-</q-btn>
                <q-number v-model.number="auditRateNumber" dense borderless square class="audit-multiple"> </q-number>
                <q-btn size="md" square flat @click="increaseAuditRate">+</q-btn>
              </div>
            </div>

            <div class="col-6">
              <div class="text-subtitle1">{{ $t("query_params.distribution_type") }}</div>
              <q-option-group v-model="form.is_auto_dispatch" :options="autoDispatchOptions" color="primary" inline />
            </div>
          </div>
        </q-card-section>

        <!-- 操作按钮 -->
        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat :label="$t('btn.cancel')" @click="handleCancel" />
          <q-btn type="submit" color="primary" :label="$t('btn.save')" :loading="submitting" />
        </q-card-actions>
      </q-form>
    </q-card>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, computed, onMounted } from "vue"
  import { useRouter } from "vue-router"
  import { useI18n } from "vue-i18n"
  import { useQuasar } from "quasar"
  import SubPage from "layouts/SubPage/Index.vue"
  import Editor from "@/components/editor/Editor.vue"
  import PreviewImage from "@/components/forms/PreviewImage.vue"
  import DateTimePicker from "@/components/query/dateTimePicker.vue"
  import { useImage } from "@/hook/useImage"
  import { useCommon } from "@/hook/useCommon"
  import { useS3Upload } from "@/composables/useS3Upload"
  import { useSiteStore } from "@/stores/siteStore"
  import { addInterestActivity } from "@/api/interest"
  import { getCurrencyList } from "@/api/common"
  import { CURRENCY_TYPE, S3_STORAGE_CATEGORY, LANGUAGE_TYPE } from "@/utils/constants"
  import AiLanguage from "@/components/ai/aiLanguage.vue"
  import { translateAiText } from "@/api/ai"
  import type * as Request from "@/api/request.type"

  const router = useRouter()
  const { t } = useI18n()
  const $q = useQuasar()
  const siteStore = useSiteStore()
  const { promotionEventBanner: interestTreasureBanner } = useImage()
  const { genTimeFormat } = useCommon()
  const { uploadSingleFile } = useS3Upload()

  const submitting = ref(false)
  const showRulesDialog = ref(false)
  const currencyList = ref<{ label: string; value: number }[]>([])
  // 用于存储预览图片的映射（key: lang, value: base64 or URL）
  const previewImages = ref<Record<string, string>>({})

  // 语言配置
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
    current: languageList?.value[0] ? languageList?.value[0].label : "zh-CN"
  })

  // 表单数据
  const form = reactive<{
    name: string
    info: Request.AddInterestActivityInfo[]
    currency_id: number | null
    start_time: string
    end_time: string
    is_auto_dispatch: number
    audit_rate: string
    maximum_interest_limit: number
    plans: Request.AddInterestActivityPlan[]
  }>({
    name: "",
    info: [],
    currency_id: null,
    start_time: "",
    end_time: "",
    is_auto_dispatch: 1,
    audit_rate: "0",
    maximum_interest_limit: 0,
    plans: [
      {
        days: 0,
        interest_rate: "0",
        principal: "0"
      }
    ]
  })

  const auditRateNumber = computed<number>({
    get() {
      return Number(form.audit_rate || 0)
    },
    set(value: number) {
      if (Number.isNaN(value) || value < 0) {
        form.audit_rate = "0"
        return
      }
      form.audit_rate = String(parseFloat(value.toFixed(10)))
    }
  })

  const changeAuditRate = (delta: number) => {
    let next = auditRateNumber.value + delta
    if (next < 0) {
      next = 0
    }
    auditRateNumber.value = next
  }

  const increaseAuditRate = () => {
    changeAuditRate(1)
  }

  const decreaseAuditRate = () => {
    changeAuditRate(-1)
  }

  // 初始化多语言信息
  const initLanguageInfo = () => {
    form.info = siteStore.langList.map((lang) => ({
      lang: lang.label,
      title: "",
      image: ""
    }))
    // 初始化预览图片对象
    siteStore.langList.forEach((lang) => {
      previewImages.value[lang.label] = ""
    })
  }

  const autoDispatchOptions = computed(() => [
    {
      label: t("reward_type.auto"),
      value: 2
    },
    {
      label: t("reward_type.manual"),
      value: 1
    }
  ])

  // 不可早於今天的日期選項（Quasar options 函式傳入 YYYY/MM/DD 格式）
  const minDateOption = (date: string) => {
    const [year, month, day] = date.split("/").map(Number)
    const picked = new Date(year, month - 1, day)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const result = picked >= today
    return result
  }

  // 活动日期
  const dateTimeSelector = reactive<{ from?: string; to?: string; fromHms?: string; toHms?: string }>({
    from: undefined,
    to: undefined,
    fromHms: "00:00:00",
    toHms: "23:59:59"
  })

  // 格式化日期时间为 yyyy-MM-dd HH:mm:ss
  const formatDateTime = (dateStr: string): string => {
    if (!dateStr) return ""

    try {
      // 尝试解析日期字符串
      let date: Date

      // 如果已经是标准格式 yyyy-MM-dd HH:mm:ss，直接返回
      if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(dateStr)) {
        return dateStr
      }

      // 如果只有日期部分 yyyy-MM-dd
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        date = new Date(`${dateStr} 00:00:00`)
      }
      // 如果是 yyyy-MM-dd HH:mm 格式，补充秒数
      else if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(dateStr)) {
        date = new Date(`${dateStr}:00`)
      }
      // 其他格式尝试直接解析
      else {
        date = new Date(dateStr)
      }

      // 检查日期是否有效
      if (isNaN(date.getTime())) {
        console.warn("无效的日期格式:", dateStr)
        return dateStr
      }

      // 使用 genTimeFormat 格式化为 yyyy-MM-dd HH:mm:ss
      const formatted = genTimeFormat(date, "yyyy-MM-dd HH:mm:ss", false)
      return formatted || dateStr
    } catch (error) {
      console.error("日期格式化错误:", error)
      return dateStr
    }
  }

  const onUpdateDateTime = (newValue: { from: string; to: string; fromHms: string; toHms: string }) => {
    if (!newValue) {
      dateTimeSelector.from = undefined
      dateTimeSelector.to = undefined
      form.start_time = ""
      form.end_time = ""
      return
    }
    dateTimeSelector.from = newValue.from
    dateTimeSelector.to = newValue.to
    dateTimeSelector.fromHms = newValue.fromHms || "00:00:00"
    dateTimeSelector.toHms = newValue.toHms || "23:59:59"
    form.start_time = formatDateTime(`${newValue.from} ${dateTimeSelector.fromHms}`)
    form.end_time = formatDateTime(`${newValue.to} ${dateTimeSelector.toHms}`)
  }

  // AI 翻譯套用至其他語系
  const applyLanguage = async () => {
    const fromItem = form.info?.find((e) => e.lang === language.current)
    if (!fromItem) return

    const payload = []

    if (fromItem.title) {
      payload.push({
        input_text: fromItem.title
      })
    }

    if (!payload.length) {
      $q.notify({
        type: "negative",
        message: t("message.please_fill_the_first_language_content_before_using_ai_translation"),
        position: "top",
        timeout: 300
      })
      return
    }

    try {
      $q.loading.show()
      const languages = language.list.map((item) => item.label)
      const payloadWithLanguages = payload.map((item) => ({ ...item, languages }))
      const { status, data } = await translateAiText(payloadWithLanguages)
      if (status && Array.isArray(data) && data.length) {
        const titleTranslations = data?.[0]?.translations

        form.info?.forEach((item) => {
          if (titleTranslations) {
            item.title = titleTranslations?.[item.lang as string] ?? item.title
          }
          // 將當前語系的圖片套用到所有語系
          item.image = fromItem.image
          if (item.lang && fromItem.lang) {
            previewImages.value[item.lang] = previewImages.value[fromItem.lang] || ""
          }
        })
      }
      $q.notify({
        type: "positive",
        message: t("message.ai_translation_completed"),
        position: "top",
        timeout: 300
      })
    } catch (error) {
      console.error("applyLanguage error", error)
    } finally {
      $q.loading.hide()
    }
  }

  // 将 base64 转换为 File 对象
  const base64ToFile = (base64String: string, filename = "image.png"): File => {
    const arr = base64String.split(",")
    const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png"
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], filename, { type: mime })
  }

  // 图片上传处理
  const updateInterestTreasureBanner = async (value: string, item: Request.AddInterestActivityInfo) => {
    if (!value) {
      item.image = ""
      if (item.lang) previewImages.value[item.lang] = ""
      return
    }

    if (!item.lang) {
      console.error("item.lang is undefined")
      return
    }

    try {
      // 如果是 base64 字符串，需要上传到 S3
      if (value.startsWith("data:image")) {
        // 先保存 base64 用于预览
        previewImages.value[item.lang] = value

        // 将 base64 转换为 File 对象
        const timestamp = Date.now()
        const file = base64ToFile(value, `interest_banner_${timestamp}.png`)

        // 上传到 S3
        const result = await uploadSingleFile({
          file: file,
          storage_category: S3_STORAGE_CATEGORY.Enums.interest,
          expiration: 600
        })

        $q.loading.hide()

        if (result.status && result.data?.objectKey) {
          // 保存 object_key 到 image（用于提交）
          item.image = result.data.objectKey
          // 保留 base64 用于预览
          previewImages.value[item.lang] = value
        } else {
          // 上传失败，清除预览
          previewImages.value[item.lang] = ""
          item.image = ""
          $q.notify({
            type: "negative",
            message: result.msg || t("error_msg.image_upload_failed"),
            position: "top"
          })
        }
      } else {
        // 如果已经是 URL 或 object_key，直接保存
        item.image = value
        previewImages.value[item.lang] = value
      }
    } catch (error) {
      $q.loading.hide()
      if (item.lang) {
        previewImages.value[item.lang] = ""
      }
      item.image = ""
      console.error("图片上传失败:", error)
      $q.notify({
        type: "negative",
        message: t("error_msg.image_upload_failed"),
        position: "top"
      })
    }
  }

  const deleteImage = (item: Request.AddInterestActivityInfo) => {
    item.image = ""
    if (item.lang) previewImages.value[item.lang] = ""
  }

  // 编辑器处理
  const handelEditor = (value: string, item: any) => {
    item.content = value
  }

  // 添加计划
  const addPlan = () => {
    form.plans.push({
      days: 0,
      interest_rate: "0",
      principal: "0"
    })
  }

  // 删除计划
  const removePlan = (index: number) => {
    if (form.plans.length > 1) {
      form.plans.splice(index, 1)
    }
  }

  // 返回处理
  const onBackTo = () => {
    router.push({ name: "InterestTreasureList" })
  }

  // 驗證多語系資料
  const validateLanguageInfo = (): boolean => {
    for (const item of form.info) {
      if (!item.title?.trim()) {
        const langKey = LANGUAGE_TYPE.I18nKeys[item.lang as LANGUAGE_TYPE.Enums]
        const langName = langKey ? t(langKey) : item.lang
        $q.notify({
          type: "negative",
          message: `${t("error_msg.please_enter_event_name")} (${langName})`,
          position: "top",
          timeout: 1000
        })
        // 自動跳轉到缺漏的語系 tab
        if (item.lang) language.current = item.lang
        return false
      }
    }
    return true
  }

  // 驗證利息方案
  const validatePlans = (): boolean => {
    // const seenDays = new Set<number>()

    for (let i = 0; i < form.plans.length; i++) {
      const plan = form.plans[i]
      if (!plan.principal || Number(plan.principal) <= 0) {
        $q.notify({
          type: "negative",
          message: `${t("query_params.event_plan")} ${i + 1}: ${t("interest_treasure.principal")} - ${t(
            "error_msg.amount_cannot_be_0"
          )}`,
          position: "top",
          timeout: 1000
        })
        return false
      }
      if (!plan.days || Number(plan.days) <= 0) {
        $q.notify({
          type: "negative",
          message: `${t("query_params.event_plan")} ${i + 1}: ${t("interest_treasure.lock_period_days")} - ${t(
            "error_msg.amount_cannot_be_0"
          )}`,
          position: "top",
          timeout: 1000
        })
        return false
      }
      if (!plan.interest_rate || Number(plan.interest_rate) <= 0) {
        $q.notify({
          type: "negative",
          message: `${t("query_params.event_plan")} ${i + 1}: ${t("interest_treasure.interest_rate")} - ${t(
            "error_msg.amount_cannot_be_0"
          )}`,
          position: "top",
          timeout: 1000
        })
        return false
      }

      // 檢查重複 days
      // const days = Number(plan.days)
      // if (seenDays.has(days)) {
      //   $q.notify({
      //     type: "negative",
      //     message: `${t("query_params.event_plan")} ${i + 1}: ${t("error_msg.plan_days_duplicate")}`,
      //     position: "top",
      //     timeout: 1500
      //   })
      //   return false
      // }
      // seenDays.add(days)
    }

    // 檢查 days 超過活動總天數
    if (form.start_time && form.end_time) {
      const start = new Date(form.start_time)
      const end = new Date(form.end_time)
      const totalDays = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

      for (let i = 0; i < form.plans.length; i++) {
        const days = Number(form.plans[i].days)
        if (days > totalDays) {
          $q.notify({
            type: "negative",
            message: `${t("query_params.event_plan")} ${i + 1}: ${t("error_msg.plan_days_exceed_activity", {
              days,
              total: totalDays
            })}`,
            position: "top",
            timeout: 1500
          })
          return false
        }
      }
    }

    return true
  }

  // 提交表单
  const handleSubmit = async () => {
    // 驗證活動名稱
    if (!form.name?.trim()) {
      $q.notify({
        type: "negative",
        message: t("error_msg.please_enter_event_name"),
        position: "top",
        timeout: 1000
      })
      return
    }

    // 驗證多語系資料（所有語系的活動名稱必填）
    if (!validateLanguageInfo()) return

    // 驗證活動日期
    if (!form.start_time || !form.end_time) {
      $q.notify({
        type: "negative",
        message: t("error_msg.please_enter_date"),
        position: "top",
        timeout: 1000
      })
      return
    }

    // 驗證幣別
    if (form.currency_id == null) {
      $q.notify({
        type: "negative",
        message: t("error_msg.please_select_currency"),
        position: "top",
        timeout: 1000
      })
      return
    }

    // 驗證稽核倍數
    if (!form.audit_rate || Number(form.audit_rate) <= 0) {
      $q.notify({
        type: "negative",
        message: t("error_msg.please_enter_audit_multiplier"),
        position: "top",
        timeout: 1000
      })
      return
    }

    // 驗證利息方案
    if (!validatePlans()) return

    submitting.value = true

    try {
      // 确保时间格式为 Y-m-d H:i:s
      const startTime = formatDateTime(form.start_time)
      const endTime = formatDateTime(form.end_time)

      const payload: Request.AddInterestActivity = {
        name: form.name,
        info: form.info,
        currency_id: form.currency_id,
        start_time: startTime,
        end_time: endTime,
        is_auto_dispatch: form.is_auto_dispatch,
        audit_rate: form.audit_rate,
        maximum_interest_limit: form.maximum_interest_limit,
        plans: form.plans
      }

      const { code, msg } = await addInterestActivity(payload)

      if (code === 0) {
        $q.notify({
          type: "positive",
          message: t("message.add_success"),
          position: "top"
        })

        setTimeout(() => {
          router.push({ name: "InterestTreasureList" })
        }, 500)
      } else {
        $q.notify({
          type: "negative",
          message: msg || t("message.add_failed"),
          position: "top"
        })
      }
    } catch (error) {
      console.error("Submit error:", error)
      $q.notify({
        type: "negative",
        message: t("message.add_failed"),
        position: "top"
      })
    } finally {
      submitting.value = false
    }
  }

  // 取消
  const handleCancel = () => {
    router.push({ name: "InterestTreasureList" })
  }

  // 获取币别列表
  const getCurrencyDropdown = async () => {
    try {
      const { data: currencyData } = await getCurrencyList()
      currencyList.value = Object.keys(currencyData).map((key) => ({
        value: currencyData[key] as number,
        label: t((CURRENCY_TYPE.I18nKeys as any)[currencyData[key] as keyof typeof CURRENCY_TYPE.I18nKeys] ?? key)
      }))
    } catch (error) {
      console.error("获取币别列表失败:", error)
    }
  }

  onMounted(async () => {
    initLanguageInfo()
    await getCurrencyDropdown()
  })
</script>

<style scoped lang="scss">
  @import "../../css/_variable.sass";

  .lang-tabs {
    ::v-deep(.q-tabs__content) {
      justify-content: flex-start;
      padding-left: 0.5rem;
      .q-tab {
        padding-top: 0;
        padding-bottom: 0;
        border-radius: 10px 10px 0 0;
        border-top: 1px solid #f0f2f5;
        border-left: 1px solid #f0f2f5;
        border-right: 1px solid #f0f2f5;
        &--active {
          border: none;
        }
      }
    }
  }

  .tab-container {
    ::v-deep(.q-tabs__content) {
      justify-content: flex-start;
    }
    .q-tab--active {
      color: $mainColor;
    }
  }

  .edit-input {
    border: 0.0625rem solid #c2c2ca;
    border-radius: 0.25rem;
    padding: 0.0313rem 0.625rem;
    background-color: #fff;
    ::v-deep(.q-field__control) {
      box-shadow: none;
      min-height: 32px;
    }
    ::v-deep(.q-field__native) {
      min-height: 32px;
    }

    ::v-deep(.q-field__append) {
      min-height: 32px;
    }
  }

  :deep(.q-tab--active) {
    background-color: #eff7ff;
  }

  :deep(.q-tab__indicator) {
    display: none;
  }

  .apply-btn {
    min-height: 32px;
    height: 32px;
    font-size: 12px !important;
  }

  .q-tab-panels {
    border-radius: 4px;
  }

  ::v-deep(.uploader-language-code) {
    margin: auto 10px;
    font-size: 12px;
  }

  ::v-deep(.image-preview_expanded_row > :not(:first-child)) {
    margin-top: 10px;
  }

  .date-time-picker {
    :deep(.q-field__native) {
      padding-top: 0.125rem;
    }
  }

  .audit-multiple-container {
    background-color: #fcf8ff;
    .q-btn {
      height: 1.25rem;
      background-color: #fff;
      font-size: 0.625rem;
    }
    .audit-multiple {
      min-height: 36px;
      height: 36px;
      background-color: #fff;
      border-top: 0.0625rem solid #999;
      border-bottom: 0.0625rem solid #999;
    }
  }

  .audit-multiple {
    ::v-deep(.q-field__control) {
      height: 34px;
      min-height: 34px;
    }
    :deep(.q-field__native) {
      height: 34px;
      min-height: 34px;
    }
  }

  .stepperLabelWrapper {
    font-weight: 700;
    font-size: 1.5rem;
    text-align: center;
    color: rgba(83, 82, 82, 1);
  }
</style>
