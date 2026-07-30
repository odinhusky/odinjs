<template>
  <AgeWarningDialog id="age-warning-dialog" />
</template>

<script lang="ts" setup>
import AgeWarningDialog from "src/common/components/AgeWarningDialog/Index.vue"
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r033/assets/css/_variable.scss";

// 確保 AgeWarningDialog 使用正確的 template CSS 變數
// 在 scoped 樣式中定義 :root 變數仍然是全局的，會覆蓋全局的 set_r022 變數定義
// 這樣可以確保子組件 module1.vue 使用正確的變數值
</style>
