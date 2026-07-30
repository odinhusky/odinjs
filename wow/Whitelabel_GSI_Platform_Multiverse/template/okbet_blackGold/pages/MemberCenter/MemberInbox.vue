<template>
  <HeaderTitleBack
    v-if="isMobile"
    title-i18n="member.mail.myMessages"
    variant="blackGold"
    q-card-class="member-inbox-mobile-dialog"
  >
    <MemberMessenger />
  </HeaderTitleBack>
  <div v-else class="inbox-container pc">
    <div class="header">
      <q-btn class="inbox-title hide-hover" flat :to="{ name: 'memberProfile' }">
        <q-icon name="arrow_back" class=""></q-icon>
        {{ $t("member.mail.myMessages") }}
      </q-btn>
      <div>
        <q-btn rounded flat icon="mail" class="top-btn btn-mail inbox-btn" color="white">
          <q-badge
            v-if="inboxUnreadTotal > 0"
            class="inbox-unread-badge"
            color="negative"
            rounded
            :label="inboxUnreadTotal > 99 ? '99+' : inboxUnreadTotal"
          />
        </q-btn>
        <q-btn v-if="isKycEnabled" rounded flat class="top-btn btn-kyc custom-btn" :to="{ name: 'MemberKyc' }">
          <template v-if="userInfo2.approval_status">
            <img :src="commonResult('kyc/v2_approved.png')" />
            KYC {{ $t("member.kyc.status_success") }}
          </template>
          <template v-else>
            <img :src="commonResult('kyc/v2_rejected.png')" />
            KYC {{ $t("member.kyc.status_unverified") }}
          </template>
        </q-btn>
      </div>
    </div>
    <MemberMessenger />
  </div>
</template>

<script lang="ts" setup>
import MemberMessenger from "src/common/components/MemberMessenger/index.vue"
import HeaderTitleBack from "src/common/components/modal/HeaderTitleBack.vue"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { useWebSocketNotificationStore } from "src/stores/webSocketNotificationStore"
import { MemberMessengerRouteNamesKey } from "src/symbols"
import { computed, provide, toRef } from "vue"

const messengerRouteNames = { inbox: "memberInbox", outbox: "memberOutbox" } as const
provide(MemberMessengerRouteNamesKey, messengerRouteNames)

const { isDown } = useMediaQuery()
const isMobile = toRef(isDown, "pc")

const { userInfo2, isKycEnabled } = useUserInfo()
const { commonResult } = useCommonImg()
const webSocketNotificationStore = useWebSocketNotificationStore()
const inboxUnreadTotal = computed(() => webSocketNotificationStore.webSocketNotificationState.unreadCount.total)
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/okbet_blackGold/assets/css/_variable.sass";
@import "app/template/okbet_blackGold/assets/css/button.scss";

.inbox-btn {
  position: relative;
}
.inbox-unread-badge {
  position: absolute;
  top: -6px;
  right: -8px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
}

.inbox-container.pc {
  display: flex;
  flex-direction: column;
  padding: 70px 50px 30px;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    width: 100%;
    max-height: 54px;
    .inbox-title {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      font-size: 40px;
      color: $primary-white-color;
      font-weight: 600;
      cursor: pointer;
      padding: 0;
      text-transform: none;
      font-weight: 800;
      .q-icon {
        font-size: 36px;
        margin-right: 12px;
      }
    }
    .btn-mail {
      @include btn-common;
    }
    .btn-kyc {
      margin-left: 10px;
      background: none !important;
      border: 0.125rem solid $gray-border-color;
      line-height: 0;
      color: $primary-white-color !important;
      img {
        width: 20px;
        height: 20px;
        margin-right: 5px;
      }
    }
  }
}

.custom-btn {
  text-transform: none;
}
</style>

<style lang="scss">
@import "app/template/okbet_blackGold/assets/css/memberMessenger";
</style>
