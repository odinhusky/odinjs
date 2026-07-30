<script setup lang="ts">
const { handleStaticPageAction } = useStaticPageDirection()

const textClass = cx("text-sm leading-5 text-[var(--dialog-dialog-title-content)]")

const handleOpenPrivacy = () => {
  handleGlobalClick({
    target: "handleTermsAndConditionsOpenPrivacyClick",
    debounceTimer: 200,
    callback: () => {
      handleStaticPageAction("privacy")
    }
  })
}

const handleOpenTerms = () => {
  handleGlobalClick({
    target: "handleTermsAndConditionsOpenTermsClick",
    debounceTimer: 200,
    callback: () => {
      handleStaticPageAction("terms")
    }
  })
}
</script>

<template>
  <div :class="cx('w-full px-3 py-4 border-[1px] border-[var(--border-border-primary)] rounded-2xl')">
    <ol class="list-decimal list-outside pl-4 text-xs leading-5 text-white/60 space-y-1">
      <li :class="textClass">
        Send me updates and promotions in accordance with the
        <BaseBtn
          category="text"
          size="sm"
          :class-obj="{ button: cx('!font-normal !p-0') }"
          @click.prevent="handleOpenPrivacy"
        >
          Privacy Policy </BaseBtn
        >.
      </li>

      <li :class="textClass">
        I am over 21 years of age and have read and agree to the ANIBET
        <BaseBtn
          category="text"
          size="sm"
          :class-obj="{ button: cx('!font-normal !p-0') }"
          @click.prevent="handleOpenTerms"
        >
          Terms & Conditions </BaseBtn
        >.
      </li>

      <li :class="textClass">
        I am not a government official and/or employee directly connected with the operation of the Philippine
        government or any of its agencies
      </li>
    </ol>
  </div>
</template>
