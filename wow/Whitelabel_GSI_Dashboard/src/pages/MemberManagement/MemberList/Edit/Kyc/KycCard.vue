<template>
  <div class="col-2" style="min-width: 23.8rem">
    <q-card bordered flat class="q-pa-md">
      <div class="row">
        <div class="col-grow">
          <q-btn
            disable
            :icon="kycSetting.display ? 'visibility' : 'visibility_off'"
            :color="kycSetting.display ? 'primary' : 'grey'"
            flat
            dense
          >
            <q-tooltip class="text-caption" :class="{ 'bg-success2': kycSetting.display }">
              {{ kycSetting.display ? $t("kyc_common.frontend_display") : $t("kyc_common.frontend_hidden") }}
            </q-tooltip>
          </q-btn>
        </div>
        <div class="col-auto" v-if="isSubmitted">
          <q-btn icon="zoom_in" color="positive" flat dense @click="zoomingImage = true" />
          <q-btn icon="delete" color="negative" flat dense @click="onDelete" />
        </div>
      </div>
      <q-img
        class="q-my-sm"
        :ratio="16 / 9"
        :src="isSubmitted ? `${VITE_APP_DYNAMIC_RESOURCE_URL}/${kycItem.img}` : ''"
        :placeholder-src="imgPlaceholder"
        style="border: 1px solid #eee; border-radius: 0.5rem"
      />
      <div class="text-right text-caption" style="min-height: 2.25rem">
        <q-list>
          <!-- 標題 -->
          <q-item :clickable="false" dense :style="{ backgroundColor: '#fff' }">
            <q-item-section>
              <q-item-label></q-item-label>
            </q-item-section>
            <q-item-section side>
              <template v-if="isSubmitted">
                <p class="q-mb-none">{{ filename(kycItem.img) }}</p>
                <p class="q-mb-none text-weight-bold">{{ kycItem.created_at.split("T")[0] }}</p></template
              >
            </q-item-section>
          </q-item>
        </q-list>
      </div>
      <div class="q-mt-sm">
        <q-list>
          <!-- 類型 -->
          <q-item :clickable="false" dense :style="{ backgroundColor: '#fff' }">
            <q-item-section>
              <q-item-label>{{ $t("kyc_common.status") }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-select
                v-model="kycItem.status"
                @update:model-value="(val) => (kycItem.status = val.value)"
                :readonly="isSubmitted ? false : true"
                :options="kycStatusDropdownList"
                :option-disable="
                  (opt) =>
                    kycItem.status != KYC_STATUS_CODE.Enums.UNSUBMITTED &&
                    opt.value == KYC_STATUS_CODE.Enums.UNSUBMITTED
                "
                dense
                outlined
                map-options
                stack-label
                standout
              />
            </q-item-section>
          </q-item>

          <!-- 類型 -->
          <q-item :clickable="false" dense :style="{ backgroundColor: '#fff' }">
            <q-item-section>
              <q-item-label>{{ $t("kyc_common.type") }}</q-item-label>
            </q-item-section>
            <q-item-section side>{{ $t(KYC_TYPE.I18nKeys[kycSetting.type]) }}</q-item-section>
          </q-item>

          <!-- 標題 -->
          <q-item :clickable="false" dense :style="{ backgroundColor: '#fff' }">
            <q-item-section>
              <q-item-label>{{ $t("kyc_common.title") }}</q-item-label>
            </q-item-section>
            <q-item-section side>{{ kycSettingTitle }}</q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-card>
  </div>
  <!-- Image viewer -->
  <q-dialog v-model="zoomingImage" square>
    <q-img :src="`${VITE_APP_DYNAMIC_RESOURCE_URL}/${kycItem.img}`" />
  </q-dialog>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from "vue"
  import { useI18n } from "vue-i18n"
  import { useEnv } from "src/hook/useEnv"
  import { KYC_TYPE, KYC_STATUS_CODE } from "@/utils/constants"
  import type { KycSetting } from "@/api/request.type"
  import type { KycItem } from "@/api/response.type"
  import { genEnumToDropdown, type DropdownType } from "@/stores/queryStore"
  import { useLanguageStore } from "@/stores/languageStore"

  const { t } = useI18n()
  const { envData } = useEnv()
  const { VITE_APP_DYNAMIC_RESOURCE_URL } = envData()
  const languageStore = useLanguageStore()

  const props = defineProps({
    kycSetting: {
      type: Object as () => KycSetting,
      required: true
    },
    kycItems: {
      type: Array as () => KycItem[],
      required: true
    }
  })

  const kycItem = ref<KycItem>({
    id: 0,
    member_id: 0,
    img: "",
    type: KYC_TYPE.Enums.ID,
    status: KYC_STATUS_CODE.Enums.UNSUBMITTED,
    correspondence: 0,
    created_at: "",
    created_by: 0
  })

  const zoomingImage = ref<boolean>(false)

  const currentLang = computed(() => languageStore.currentLanguage)
  const isSubmitted = computed(() => kycItem.value.status != KYC_STATUS_CODE.Enums.UNSUBMITTED)
  const kycStatusDropdownList = computed(() => {
    return genEnumToDropdown(KYC_STATUS_CODE.Enums, KYC_STATUS_CODE.I18nKeys).map((e) => {
      const option: DropdownType & { disabled?: boolean } = { ...e, label: t(e.label) }

      if (kycItem.value.status != KYC_STATUS_CODE.Enums.UNSUBMITTED && e.value != KYC_STATUS_CODE.Enums.UNSUBMITTED) {
        option.disabled = true
      }
      return option
    })
  })
  const kycSettingTitle = computed(() => {
    const langItem = props.kycSetting.lang.find((l) => l.code === currentLang.value)

    if (langItem) {
      return langItem.title
    } else {
      return props.kycSetting.lang[0].title
    }
  })

  const filename = (url: string) => {
    try {
      let filename = url.split(".")
      const ext = filename[1]
      filename = filename[0].split("/")

      return `${filename[3]}.${ext}`
    } catch (error) {
      return ""
    }
  }

  const onDelete = () => {
    props.kycItems.splice(props.kycItems.indexOf(kycItem.value), 1)
  }

  watch(
    () => props.kycItems,
    (items) => {
      const _kycItem = items.find((kyc) => Number(kyc.correspondence) === Number(props.kycSetting.id))

      if (_kycItem) {
        kycItem.value = _kycItem
      }
    },
    { immediate: true, deep: true }
  )

  const imgPlaceholder =
    "data:image/png;base64,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"
</script>
