<template>
  <div class="web-information-content">
    <div v-if="route.params?.id || route.params?.id2" class="type-content">
      <div
        v-for="menu in webInformationMenuList"
        :key="menu.id2"
        class="menu-item"
        :class="{ active: menu.id === currentTab || menu.id2 === currentTab }"
        @click="changeTab(menu.id2)"
      >
        {{ menu.title }}
      </div>
    </div>

    <div class="info-box">
      <div class="info-title">{{ webInformationTitle }}</div>
      <div class="info-detail" v-html="webInformationContent"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, Ref, watch } from "vue"
import { useRouter, useRoute } from "vue-router"
import { useCms } from "src/common/composables/useCms"

const currentTab = ref(1)
const router = useRouter()
const route = useRoute()
const { webInformationData, webInformationMenuList, webInformationTitle, webInformationContent } = useCms()

const changeTab = (id: number) => {
  currentTab.value = id
  router.push({ name: "webInformation", params: { id: id.toString() } })
}

const handleRouterChange = () => {
  if (!webInformationData.value && webInformationMenuList.value.length > 0) {
    changeTab(webInformationMenuList.value[0].id)
    return
  }

  const routeId = Number(route.params?.id)
  if (routeId) {
    currentTab.value = routeId
  }
}

watch(() => route.params?.id, handleRouterChange)

onMounted(async () => {
  handleRouterChange()
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";

.web-information-content {
  display: flex;
  flex-direction: column;
  margin-top: 27px;

  @include phone-width {
    align-items: flex-end;
  }

  .type-content {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 0.625rem;
    width: fit-content;
    height: fit-content;
    padding: 0.375rem;
    margin-bottom: 1.6875rem;
    border-radius: 3.125rem;
    background: var(--secondary-10);
    color: var(--neutral-01);
    overflow-x: scroll;
    scrollbar-width: none;
    -ms-overflow-style: none;

    @include phone-width {
      width: calc(100vw - 0.875rem);
      border-radius: 3.125rem 0 0 3.125rem;
      margin-bottom: 1.5rem;
    }

    .menu-item {
      padding: 0.55rem 1rem;
      cursor: pointer;
      color: var(--neutral-01);
      border-radius: 3.125rem;
      white-space: nowrap;

      @include phone-width {
        padding: 0.9375rem 1.25rem;
      }

      &.active {
        background: linear-gradient(90deg, var(--primary-01) 0%, var(--primary-02) 100%);
      }
    }
  }

  .info-box {
    width: 100%;
    min-height: 25rem;
    padding: 1.275rem;
    border-radius: 0.625rem;
    background-color: var(--secondary-08);

    @include phone-width {
      width: calc(100% - 1.75rem);
      padding: 1.25rem;
      margin: 0 auto;
    }

    .info-title {
      font-size: 0.875rem;
      font-weight: 700;
      color: var(--neutral-01);
      padding-bottom: 1.25rem;
      border-bottom: 1px solid var(--neutral-05);
      display: flex;
      align-items: center;
      justify-content: flex-start;

      &::before {
        content: "";
        display: inline-block;
        width: 0.25rem;
        height: 1.375rem;
        background-color: var(--primary-01);
        margin-right: 0.75rem;
      }
    }

    .info-detail {
      margin-top: 1.25rem;
      color: var(--neutral-01);
    }
  }
}
</style>
