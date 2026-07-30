<template>
  <q-form @submit.prevent="memberManagementStore.handlerSearchSubordinateMember" class="search-form">
    <div class="search-form-row manage-search-row">
      <template v-if="!memberManagementStore.showSubordinateMemberAccount?.account">
        <div class="search-item manage">
          <div class="search-item-label manage">{{ $t("menu.userAccount") }}</div>
          <q-input
            v-model="memberManagementStore.memberAccount"
            :placeholder="$t('placeholder.pleaseEnterUserAccount')"
            dense
            standout="text-black"
            class="search-item-input account manage"
          />
        </div>

        <div class="search-item manage">
          <div class="search-item-label manage">{{ $t("member.profile.affiliate") }}</div>
          <q-input
            v-model="memberManagementStore.recommenderAccount"
            :placeholder="$t('placeholder.pleaseEnterReferral')"
            dense
            standout="text-black"
            class="search-item-input account manage"
          />
        </div>
      </template>

      <div v-else class="search-item manage">
        <div class="search-item-label manage">
          {{ $t("member.membershipManagement.subordinateMemberAccount") }}
        </div>
        <q-input
          v-model="memberManagementStore.searchSubordinateMemberAccount"
          :placeholder="$t('placeholder.pleaseEnterSubordinateMemberAccount')"
          dense
          standout="text-black"
          class="search-item-input account manage"
        />
      </div>

      <div class="agent-center-search-actions">
        <q-btn
          :label="$t('common.btn.reset')"
          type="button"
          unelevated
          no-caps
          class="agent-center-reset-btn"
          @click="memberManagementStore.resetManageSearch"
        />
        <SearchButton :action="memberManagementStore.handlerSearchSubordinateMember" />
      </div>
    </div>
  </q-form>
</template>

<script lang="ts" setup>
import { useMemberManagement } from "src/stores/useMemberManagement"

import SearchButton from "./SearchButton.vue"

const memberManagementStore = useMemberManagement()
</script>

<style lang="scss" scoped>
@import "app/template/set_r022/assets/css/membershipManagement.scss";
</style>
