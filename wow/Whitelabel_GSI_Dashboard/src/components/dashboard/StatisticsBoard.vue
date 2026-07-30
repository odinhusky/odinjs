<template>
  <!-- 統計板 -->
  <div class="statisticsWrapper" v-bind="attrs">
    <q-card round class="no-shadow main-radius" :class="`bd-${datas.bgColor}`">
      <q-card-section class="statisticsCard">
        <div class="q-mb-xs row items-center" style="justify-content: space-between">
          <div>
            <q-img :src="statisticsImg(datas.icon)" ratio="1" />
          </div>
          <div v-if="percentageMask !== undefined" class="q-px-xs percentageWrapper" :class="`text-${datas.color}`">
            {{ percentageMask >= 0 ? "+" : "" }}
            <span>{{ moneyFormat(percentageMask, 2) }}</span>
            %
          </div>
        </div>
        <div class="text-subtitles">{{ $t(datas.label || "common.unknow") }}</div>
        <div class="text-subtitles2 row">
          {{ quotaMask > 0 ? "+" : quotaMask < 0 ? "-" : "" }}{{ datas.prependString }}
          <span>
            {{ moneyFormat(Math.abs(quotaMask)) }}
          </span>
          <q-space style="min-width: 1.25rem" />
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script lang="ts" setup>
  import { PropType, defineProps, useAttrs, reactive, computed, onMounted } from "vue"
  import { CustomQTableProps, CustomColumn } from "quasar"
  import { useI18n } from "vue-i18n"
  import { useCommon } from "@/hook/useCommon"
  import { useImage } from "@/hook/useImage"
  import { STATISTICS } from "@/utils/constants"

  interface IDatas {
    label: string
    icon: STATISTICS.Enums
    color: string
    bgColor: string
    quota: string | number
    percentage?: string | number
    prependString?: string
  }

  const { statisticsImg } = useImage()
  const { moneyFormat, roundDown } = useCommon()
  const { t } = useI18n()

  const props = defineProps({
    datas: {
      type: Object as PropType<IDatas>,
      required: false,
      default: () => {
        return {
          label: "common.unknow",
          icon: STATISTICS.Enums.TodayBetting,
          bgColor: "grey",
          color: "grey",
          quota: "0",
          percentage: undefined,
          prependString: undefined
        }
      }
    }
  })

  const attrs = useAttrs()

  const quotaMask = computed(() => {
    let returnValue = 0
    try {
      if (typeof props.datas.quota === "number") {
        returnValue = props.datas.quota
      } else {
        returnValue = parseInt(props.datas.quota)
      }
    } catch (e: any) {
      console.error(`${props.datas.label} quota parsing failed：${e.message}`)
    }
    return returnValue
  })

  const percentageMask = computed(() => {
    let returnValue = undefined
    try {
      if (typeof props.datas.percentage === "number") {
        returnValue = props.datas.percentage
      } else if (typeof props.datas.percentage === "string") {
        returnValue = roundDown(Number(props.datas.percentage), 2)
      }
    } catch (e: any) {
      console.error(`${props.datas.label} percentage parsing failed：${e.message}`)
    }
    return returnValue
  })

  onMounted(() => {})

  function onDetails() {
    console.log("on details")
  }
</script>

<style lang="scss" scoped>
  .statisticsWrapper {
    min-width: auto;
    width: 100%;

    .percentageWrapper {
      font-size: 0.875rem;
      font-weight: bold;
    }
  }

  @media screen and (min-width: 1024px) {
    .statisticsWrapper {
    }
  }

  .statisticsCard {
    padding: 12px;
  }

  ::v-deep(.q-img) {
    width: 1.25rem !important;
  }
  .text-subtitles {
    font-size: 0.875rem;
    font-weight: 500;
    color: #9e9e9e;
  }
  .text-subtitles2 {
    font-size: 1.25rem;
    font-weight: bold;
  }
  .bd-purple {
    border: 2px solid rgba(228, 213, 255, 1);
  }
  .bd-green {
    border: 2px solid rgba(208, 236, 229, 1);
  }
  .bd-orange {
    border: 2px solid rgba(255, 223, 212, 1);
  }
  .bd-pink {
    border: 2px solid rgba(250, 222, 228, 1);
  }
</style>
