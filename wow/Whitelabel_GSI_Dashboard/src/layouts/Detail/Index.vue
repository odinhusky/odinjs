<template>
  <div class="globalSubPageWrapper">
    <div class="row q-col-gutter-md">
      <div class="col">
        <q-btn flat color="grey-8" size="lg" @click="onBack">
          <q-icon name="arrow_back" size="sm" class="q-mr-sm" />
          <div>{{ $t((breadcrumbList[0] && breadcrumbList[0].name) || "btn.back_page") }}</div>
        </q-btn>
      </div>
      <div class="col self-center q-px-md">
        <q-breadcrumbs gutter="sm" class="text-grey-8 breadcrumbWrapper" active-color="blue-7" align="right">
          <q-breadcrumbs-el :label="$t((breadcrumbList[0] && breadcrumbList[0].name) || 'common.unknow')" />
          <q-breadcrumbs-el :label="$t('btn.edit')" />
        </q-breadcrumbs>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed } from "vue"
  import { useRoute, useRouter } from "vue-router"

  import { RouteMeta } from "src/interface/common"

  const route = useRoute()
  const router = useRouter()

  const breadcrumbList = computed(() => {
    const meta = route.meta as RouteMeta

    return meta.breadcrumb
      ? meta.breadcrumb.map((item) => ({
          name: item.i18nKey ? item.i18nKey : item.name
        }))
      : []
  })

  const backRoute = computed(() =>
    route.matched.length && route.matched.length > 1 ? route.matched[route.matched.length - 2] : route.matched[0]
  )

  function onBack() {
    router.push(backRoute.value.name ? { name: backRoute.value.name } : { path: backRoute.value.path })
  }
</script>

<style lang="scss" scoped>
  @import "@/css/subPage.scss";
</style>
