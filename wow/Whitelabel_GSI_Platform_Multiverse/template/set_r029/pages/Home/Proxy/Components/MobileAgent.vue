<template>
  <div class="proxy-content">
    <template v-for="item in proxyList" :key="item.titleI18n">
      <div v-if="item.show" class="proxy-card">
        <div class="proxy-img-wrapper">
          <q-img :src="proxyImg(item.imgName)" />
        </div>
        <div class="proxy-row">
          <h2>{{ $t(item.titleI18n) }}</h2>
          <q-btn flat :to="{ name: item.routerName }" class="details-btn">
            {{ $t("common.btn.view") }}
          </q-btn>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from "vue"
import { useSiteImg } from "app/template/set_r029/hooks/useSiteImg"
import { useCollaboration } from "src/common/composables/useCollaboration"

const { proxyImg } = useSiteImg()
const { showCollaboration, handleGetCollaborationVisibility } = useCollaboration()

const proxyList = computed(() => [
  {
    imgName: "member-proxy.png",
    titleI18n: "menu.memberAgent",
    routerName: "Referral",
    show: false
  },
  {
    imgName: "collaboration-proxy.png",
    titleI18n: "menu.jointVentureAgent",
    routerName: "Collaboration",
    show: showCollaboration.value
  },
  {
    imgName: "commission-dividends.png.png",
    titleI18n: "menu.revenueSharing",
    routerName: "",
    show: false
  },
  {
    imgName: "shareholder-dividends.png",
    titleI18n: "menu.shareholderDividend",
    routerName: "",
    show: false
  }
])

onMounted(async () => {
  await handleGetCollaborationVisibility()
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set_r029/assets/css/_variable.scss";
@import "app/template/set_r029/assets/css/button.scss";

.proxy-content {
  @apply flex flex-col items-center gap-4;

  .proxy-card {
    @apply w-full rounded-[0.75rem] p-3;
    background: $r029-bg-card;
    border: 1px solid rgba($r029-text-secondary, 0.15);
    color: $r029-text-primary;

    .proxy-img-wrapper {
      @apply w-full rounded-[0.5rem] overflow-hidden;
      background: $r029-text-primary;

      .q-img {
        @apply w-full h-auto;
      }
    }

    .proxy-row {
      @apply flex justify-between items-center pt-3 px-1;

      h2 {
        @apply text-sm font-semibold m-0;
        color: $r029-text-primary;
      }

      .details-btn {
        @apply min-h-0 p-0 capitalize text-sm font-normal;
        background: transparent;
        color: $r029-text-secondary;

        &:before {
          box-shadow: none;
        }
      }
    }
  }
}
</style>
