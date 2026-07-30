<template>
  <div class="globalSubPageWrapper">
    <div class="row q-col-gutter-md">
      <div class="col">
        <q-btn flat color="grey-8" size="lg" @click="onBack" class="sub-btns">
          <q-icon name="arrow_left" size="md" class="q-mr-sm" />
          <div class="bold h3-bold">{{ $t((breadcrumbList[0] && breadcrumbList[0].name) || "btn.back_page") }}</div>
        </q-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { defineProps, computed } from "vue"
  import { useRoute, useRouter } from "vue-router"

  import { RouteMeta } from "src/interface/common"
  import { useI18n } from "vue-i18n"

  const props = defineProps({
    customBackFunc: {
      type: [Function],
      required: false,
      default: () => undefined
    },
    backLabelI18nKey: {
      type: [String],
      required: false,
      default: () => ""
    }
  })

  const route = useRoute()
  const router = useRouter()
  const { t } = useI18n()

  const breadcrumbList = computed(() => {
    const meta = route.meta as RouteMeta

    if (props.backLabelI18nKey === "") {
      return meta.breadcrumb
        ? meta.breadcrumb.map((item) => ({
            name: item.i18nKey ? item.i18nKey : item.name
          }))
        : []
    } else {
      return [{ name: t(props.backLabelI18nKey) }]
    }
  })

  const backRoute = computed(() =>
    route.matched.length && route.matched.length > 1 ? route.matched[route.matched.length - 2] : route.matched[0]
  )

  function onBack() {
    if (!!props.customBackFunc) {
      props.customBackFunc()
      return
    }

    // 若有指定的回退 route，則直接回退到指定 route
    if (route.meta.backRouteName && typeof route.meta.backRouteName === "string") {
      router.push({
        name: route.meta.backRouteName
      })
      return
    }
    router.push(backRoute.value.name ? { name: backRoute.value.name } : { path: backRoute.value.path })
  }
</script>

<style lang="scss" scoped>
  @import "@/css/subPage.scss";
</style>
