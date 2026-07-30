<template>
  <q-card class="add-bank-card">{{ $t("member.bank.addAccount") }} +</q-card>
</template>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r029/assets/css/_variable.scss";

.add-bank-card {
  @apply flex justify-center items-center font-bold cursor-pointer;
  border: 0.3125rem dashed $r029-text-secondary;
  font-size: 1.25rem;
  padding: 0.625rem;
  border-radius: 0.625rem;
  animation: fadeIn 0.5s;
  transition: transform 0.3s ease-out;
  background: $r029-bg-section;
  color: $r029-text-secondary;
}
</style>
