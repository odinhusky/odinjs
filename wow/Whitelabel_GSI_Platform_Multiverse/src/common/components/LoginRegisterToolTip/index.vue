<template>
  <q-icon
    v-if="shouldShowTooltip"
    :name="props.iconName"
    :class="cx('cursor-pointer', props.iconClass)"
    size="1rem"
    @click.stop="toggleTooltip"
    tabindex="0"
    @blur="hideTooltip"
  >
    <q-tooltip
      :offset="[10, 0]"
      anchor="center right"
      self="center left"
      :class="cx('custom-tooltip', props.tooltipClass)"
      v-model="showTooltip"
      :delay="0"
      no-parent-event
      max-width="240px"
    >
      <span :class="props.tooltipTextClass">
        {{ tooltipContent }}
      </span>
    </q-tooltip>
  </q-icon>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from "vue"
import { useI18n } from "vue-i18n"
import { cx } from "src/common/utils/cx"
import type { LoginRegisterTooltipProps } from "../LoginRegisterOuterInputLabel/types"

const { t } = useI18n()

const props = withDefaults(defineProps<LoginRegisterTooltipProps>(), {
  iconName: "info",
  iconClass: "text-black",
  tooltipClass: "",
  tooltipTextClass: "text-white"
})

const showTooltip = ref(false)

const toggleTooltip = () => {
  showTooltip.value = !showTooltip.value
}

const hideTooltip = () => {
  showTooltip.value = false
}

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest(".custom-tooltip") && !target.closest("i.q-icon")) {
    hideTooltip()
  }
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside)
})

// 根據 column_name 和 column_rule 判斷是否顯示 tooltip(暫時一直都會打開)
const shouldShowTooltip = computed(() => {
  // 後台要開啟且是帳號或是密碼的欄位
  if (props.columnRule?.enabled && (props.columnName === "password" || props.columnName === "account")) {
    return true
  }

  return false
})

// 根據規則生成 tooltip 內容
const tooltipContent = computed(() => {
  // 如果沒有 enabled 且有 tooltipText，則直接使用 tooltipText
  if (!props.columnRule?.enabled && props.tooltipText) {
    return props.tooltipText
  }

  const target =
    props.columnName === "password"
      ? t("member.register.hint_password")
      : props.columnName === "account"
      ? t("member.register.hint_account")
      : ""
  const maxLength = props.columnRule?.maxLength || 0
  const minLength = props.columnRule?.minLength || 0
  const isLength = maxLength > 0 || minLength > 0
  const isRequireNumber = props.columnRule?.requireNumber || false
  const isrequireSpecialChar = props.columnRule?.requireSpecialChar || false
  const isRequireUpperLowerCase = props.columnRule?.requireUpperLowerCase || false

  // 根據規則生成 tooltip 內容
  if (props.columnRule?.enabled) {
    if (isLength && !isRequireUpperLowerCase && !isRequireNumber && !isrequireSpecialChar) {
      return t("member.register.hint_with_length", { hint_targe: target, min: minLength, max: maxLength })
    }

    if (isLength && isRequireUpperLowerCase && !isRequireNumber && !isrequireSpecialChar) {
      return t("member.register.hint_with_length_letterCase", { hint_targe: target, min: minLength, max: maxLength })
    }

    if (isLength && isRequireNumber && !isRequireUpperLowerCase && !isrequireSpecialChar) {
      return t("member.register.hint_with_length_number", { hint_targe: target, min: minLength, max: maxLength })
    }

    if (isLength && isrequireSpecialChar && !isRequireUpperLowerCase && !isRequireNumber) {
      return t("member.register.hint_with_length_punctuationMark", {
        hint_targe: target,
        min: minLength,
        max: maxLength
      })
    }

    if (isLength && isRequireUpperLowerCase && isrequireSpecialChar && !isRequireNumber) {
      return t("member.register.hint_with_length_letterCase_punctuationMark", {
        hint_targe: target,
        min: minLength,
        max: maxLength
      })
    }

    if (isLength && isRequireNumber && isrequireSpecialChar && !isRequireUpperLowerCase) {
      return t("member.register.hint_with_length_number_punctuationMark", {
        hint_targe: target,
        min: minLength,
        max: maxLength
      })
    }

    if (isLength && isRequireUpperLowerCase && isRequireNumber && !isrequireSpecialChar) {
      return t("member.register.hint_with_length_letterCase_number", {
        hint_targe: target,
        min: minLength,
        max: maxLength
      })
    }

    if (isLength && isRequireUpperLowerCase && isRequireNumber && isrequireSpecialChar) {
      return t("member.register.hint_with_length_letterCase_number_punctuationMark", {
        hint_targe: target,
        min: minLength,
        max: maxLength
      })
    }
  }

  return ""
})
</script>

<style lang="scss" scoped></style>
