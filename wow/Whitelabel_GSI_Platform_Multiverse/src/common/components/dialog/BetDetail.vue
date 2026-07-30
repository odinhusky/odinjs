<template>
  <q-dialog v-model="dialog" persistent>
    <q-card class="bet-detail-container overflow-hidden" :class="{ h5: isMobile }">
      <q-card-section class="flex items-center q-mb-none bet-detail-header">
        <img :src="betDetailIcon()" alt="bet-detail" class="icon" />
        <span class="title"> {{ $t("modal.betsDetails") }} </span>
        <q-space />
        <q-btn class="text-lg hide-hover btn-close" icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section v-if="betDetail" class="bet-detail-body">
        <div class="flex items-center flex-nowrap">
          <div class="w-20 h-20">
            <img :src="gameImage(betDetail)" :alt="betDetail.game_code" class="game-img" @error="setDefaultGameImg" />
          </div>
          <div class="ml-3 detail">
            <p>{{ betDetail.game_info[currentLanguage].game_name }}</p>
            <p class="player-info-row">
              <!-- <span class="label">{{ $t("common.player") }} :</span> -->
              <span class="player-account-wrapper">
                <span class="player-avatar">
                  <img
                    v-if="shouldShowUserAvatar(betDetail)"
                    :src="getUserAvatarUrl(betDetail)"
                    :alt="betDetail.member_account"
                    class="user-avatar-img"
                    @error="handleAvatarError"
                  />
                  <span v-else class="default-avatar">
                    <q-icon name="person" size="14px" color="grey-6" />
                  </span>
                </span>
                <span class="player-name">{{ betDetail.member_account }}</span>
              </span>
            </p>
            <p>
              {{ $t("modal.time") }} : {{ $t(monthI18n) }}
              {{ dateformat(formatTimestamp(betDetail.settled_at), "DD,YYYY HH:mm:ss") }}
            </p>
          </div>
        </div>
        <div class="mt-3 flex justify-between items-center">
          <div class="bet-box">
            <span>{{ $t("common.odds") }}</span>
            <span class="betAmount">
              <!-- {{ activeWalletLabel }} -->
              <div class="odds-box">{{ calculateOdds(betDetail.prize_amount, betDetail.bet_amount) }}</div>
            </span>
          </div>
          <div class="bet-box">
            <span>{{ $t("common.payout") }}</span>

            <span class="payoutAmount">
              <!-- <span class="icon"></span> -->
              {{ activeWalletLabel }}
              <!-- {{ $t("common.currency") }} -->
              {{ moneyFormat(betDetail.prize_amount, 2) }}
            </span>
          </div>
        </div>
        <q-btn
          :label="$t('game.play_now')"
          class="btn-action hide-hover"
          block
          rounded
          unelevated
          @click="handlePlayGame"
        ></q-btn>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, toRef, nextTick } from "vue"
import { useCommon } from "src/common/hooks/useCommon"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { useSiteImg } from "app/template/set_amuse/hooks/useSiteImg"
import { useGame, IGetGameImage } from "src/common/composables/useGame"
import { useGameTypeStore } from "src/stores/gameTypeStore"
import { useLanguage } from "src/common/composables/useLanguage"
import { dateformat, monthMap } from "src/common/utils/dayjsUtils"
import { useUserInfo } from "src/common/composables/useUserInfo"
import * as Response from "src/api/response.type"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { useEnv } from "src/common/hooks/useEnv"
import dayjs from "dayjs"

const { isDown } = useMediaQuery()
const isMobile = toRef(isDown, "padXl")

const { setDefaultGameImg } = useCommonImg()
const { betDetailIcon } = useSiteImg()
const { getGameImage, openGame } = useGame()
const { setGameTypeUsing } = useGameTypeStore()
const { moneyFormat } = useCommon()
const { activeWalletLabel } = useUserInfo()
const { envData } = useEnv()
const { VITE_APP_DYNAMIC_RESOURCE_URL } = envData()
const { getLanguage } = useLanguage()
const currentLanguage = computed(() => getLanguage())

interface Props {
  modelValue?: boolean
  data?: Response.LeaderboardWager | null
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  data: null
})

const emit = defineEmits<{
  "update:modelValue": [value: boolean]
}>()

const dialog = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit("update:modelValue", value)
})

const betDetail = computed(() => props.data)

const monthI18n = computed(() => {
  if (!betDetail.value) return ""

  const monthStr = monthMap[dateformat(formatTimestamp(betDetail.value.settled_at) ?? "", "MM")]
  if (!monthStr) return ""

  return `month.${monthStr}`
})

// 賠率計算函數
const calculateOdds = (prizeAmount: number, betAmount: number) => {
  const odds = prizeAmount / betAmount
  return odds.toFixed(2) + "x"
}
// 判斷是否顯示頭像
const shouldShowUserAvatar = (item: Response.LeaderboardWager): boolean => {
  return !!item.member_avatar_path === true
}

//獲取用戶頭像 URL
const getUserAvatarUrl = (item: Response.LeaderboardWager): string => {
  if (item.member_avatar_path) {
    return `${VITE_APP_DYNAMIC_RESOURCE_URL}/${item.member_avatar_path}`
  }
  return ""
}

// 圖片加載失敗處理
const handleAvatarError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.style.display = "none"
}

// 處理開啟遊戲
const handlePlayGame = async () => {
  if (!betDetail.value) return
  // 設置遊戲類型
  setGameTypeUsing(betDetail.value.game_type)
  await nextTick()

  openGame(
    betDetail.value.integration_id, // integration_id
    betDetail.value.product_code,
    betDetail.value.game_code,
    betDetail.value.game_type,
    true,
    null
  )
}

const gameImage = (item: Response.LeaderboardWager): string => {
  const gameImg: IGetGameImage = {
    custom_image: "",
    game_type_id: item.game_type,
    integration_id: item.integration_id,
    product_code: item.product_code,
    game_code: item.game_code
  }
  return getGameImage(gameImg)
}

// Timestamp 轉日期格式
const formatTimestamp = (timestamp: string | number | undefined): string => {
  if (!timestamp) return ""

  // 如果是秒級 timestamp（10位數以下），轉換為毫秒級
  const num = typeof timestamp === "string" ? parseInt(timestamp) : timestamp
  const adjustedTimestamp = num < 10000000000 ? num * 1000 : num

  return dayjs(adjustedTimestamp).format("YYYY-MM-DD HH:mm:ss")
}
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_amuse/assets/css/button.sass";
@import "app/template/set_amuse/assets/css/_variable.sass";

.bet-detail-container {
  width: 100%;
  max-width: 26.75rem;
  border-radius: 1.5rem;
  height: 21.5625rem;
  background-color: var(--dialog-bg);

  .bet-detail-header {
    background: var(--dialog-header-bg);
    padding: 0.5rem 1.25rem;
    .icon {
      width: 1.875rem;
      height: 1.875rem;
    }

    .title {
      color: var(--dialog-header-text-color);
      font-size: 1.125rem;
      font-weight: 700;
      text-transform: capitalize;
      overflow-wrap: break-word;
      margin-left: 0.75rem;
    }
    .btn-close {
      color: var(--dialog-header-text-color);
    }
  }

  .bet-detail-body {
    @apply p-5 rounded-2xl flex flex-col relative;
    .game-img {
      @apply w-full h-full rounded-2xl;
    }
    .detail {
      p:nth-of-type(1) {
        font-size: 1.125rem;
        color: var(--dialog-text-color);
        font-weight: 700;
        text-transform: capitalize;
        overflow-wrap: break-word;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        max-width: 18.5rem;
        margin: 4px 0;
      }
      p {
        font-size: 12px;
        font-weight: 400;
        overflow-wrap: break-word;
        margin: 4px 0px;
        color: var(--dialog-text-color);
      }
    }
    .bet-box {
      width: 11.75rem;
      height: 4.25rem;
      border-radius: 0.5rem;
      border: 1px solid #727272;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      span {
        color: var(--dialog-text-color);
        font-size: 14px;
        line-height: 20px;
        height: 22px;
        padding-bottom: 4px;
        text-transform: capitalize;
        overflow-wrap: break-word;
        display: flex;
        align-items: center;
        &.betAmount {
          font-weight: 700;
          color: $text-deep-ocean-color;
          .odds-box {
            padding: 0.15rem 0.5rem;
            border-radius: 0.25rem;
            background: rgba($background-light-gray, 0.3);
            color: var(--dialog-text-color);
          }
        }
        &.payoutAmount {
          font-weight: 700;
          color: $text-success-color-secondary;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .icon {
          width: 12px;
          height: 12px;
          margin-bottom: 0 !important;
          margin-right: 0.25rem;
          background: url("app/template/set_amuse/assets/images/rankBoard/Group.png") no-repeat center center;
        }
      }
    }
    .player-info-row {
      display: flex;
      align-items: center;
      .label {
        flex-shrink: 0;
      }
      .player-account-wrapper {
        display: flex;
        align-items: center;
      }
      .player-avatar {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        overflow: hidden;
        flex-shrink: 0;
        background: #2a2a2a;
        border: 1px solid rgba(#727272, 0.6);
        margin-right: 0.5rem;
      }
    }
    .btn-action {
      width: 388px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--dialog-btn-text-color);
      font-size: 16px;
      text-transform: capitalize;
      overflow-wrap: break-word;
      font-weight: 700;
      background: var(--dialog-btn-bg);
      border: var(--dialog-btn-border);
      border-radius: 8px;
      margin-top: 1rem;
    }
  }

  &.h5 {
    max-width: 20.375rem;
    height: 20rem;
    border-radius: 1.5rem;
    .bet-detail-header {
      @apply pl-5 pr-3 py-1;
      .btn-close {
        color: var(--dialog-text-color);
      }
    }
    .bet-detail-body {
      .game-img {
        border-radius: 1.25rem;
      }
      .detail {
        p:nth-of-type(1) {
          max-width: 12.125rem;
          margin: 4px 0;
        }
      }
      .bet-box {
        width: calc(50% - 0.375rem);
        height: 4.25rem;
        border-radius: 0.5rem;
        border: 0.5px solid#727272;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        span {
          color: var(--dialog-text-color);
          font-size: 0.875rem;
          line-height: 1.125rem;
          height: 1.125rem;
          margin-bottom: 0.5rem;
          text-transform: capitalize;
          overflow-wrap: break-word;
          &.betAmount {
            font-weight: 700;
            color: $text-deep-ocean-color;
            margin-bottom: 0;
          }
          &.payoutAmount {
            font-weight: 700;
            color: $text-success-color-secondary;
            margin-bottom: 0;
          }
        }
      }
    }
    .btn-action {
      width: 100%;
      margin-top: 20px;
    }
  }
}
</style>
