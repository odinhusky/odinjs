<template>
  <div v-if="!isMobile" class="rank-board-wrapper pc">
    <div class="rank-wrapper">
      <div class="title-wrapper">
        <h5 class="title">{{ $t("common.latestBigWinsTitle") }}</h5>
        <!-- <q-tabs
          v-model="tab"
          class="text-teal tabs-wrapper"
          indicator-color="transparent"
          content-class="tab-item"
          active-class="bg-active-tab"
          dense
        >
          <q-tab
            v-for="(type, key) in rankTypes.types"
            :key="key"
            :name="type.value"
            :label="$t(type.i18nLabel)"
          ></q-tab>
        </q-tabs> -->
      </div>
      <div class="rank-board">
        <q-tab-panels v-model="tab" animated transition-prev="fade" transition-next="fade" :swipeable="false">
          <q-tab-panel v-for="(type, typeKey) in rankTypes.types" :key="typeKey" :name="type.value">
            <div class="rank-table">
              <div class="rank-thead">
                <div class="rank-tr">
                  <div v-for="(item, key) in headers" :key="key" class="rank-th">{{ $t(item.i18nLabel) }}</div>
                </div>
              </div>
              <div v-if="visibleItems.length" class="overflow-hidden rank-tbody">
                <transition-group appear enter-active-class="animated slideInDown" :key="currentIndex">
                  <div
                    v-for="(item, key) in visibleItems.slice().reverse()"
                    :key="visibleItems.length - 1 - key"
                    class="cursor-pointer rank-tr"
                    :class="{ 'odd-row': (visibleItems.length - 1 - key) % 2 === 0 }"
                    @click="eventbus.emit('openBetDetail', true, item)"
                  >
                    <div class="rank-td account">
                      <div class="account-wrapper">
                        <div class="rank-avatar">
                          <!-- 顯示用戶頭像 -->
                          <img
                            v-if="shouldShowUserAvatar(item)"
                            :src="getUserAvatarUrl(item)"
                            :alt="item.member_account"
                            class="user-avatar-img"
                            @error="handleAvatarError"
                          />
                          <!-- 顯示默認頭像 -->
                          <div v-else class="default-avatar">
                            <q-icon name="person" size="20px" color="grey-6" />
                          </div>
                        </div>
                        <span class="account-name">{{ item.member_account }}</span>
                      </div>
                    </div>
                    <div class="rank-td games">{{ item.game_name }}</div>
                    <div class="rank-td stake">{{ moneyFormat(item.bet_amount) }}</div>
                    <div class="rank-td odds">
                      <span>{{ calculateOdds(item.prize_amount, item.bet_amount) }}</span>
                    </div>
                    <div class="rank-td payout" :class="parseInt(item.prize_amount) >= 0 ? 'green' : ''">
                      {{
                        parseInt(item.prize_amount) >= 0
                          ? `+${moneyFormat(item.prize_amount)}`
                          : `${moneyFormat(item.bet_amount)}`
                      }}
                    </div>
                  </div>
                </transition-group>
              </div>
              <div v-else class="cursor-default rank-tbody no-data">
                <img v-if="getWideLogo" :src="getWideLogo()" alt="" />
                <span>{{ $t("tableHeader.no_data") }}</span>
              </div>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </div>

  <div v-else class="rank-board-wrapper h5">
    <div class="rank-wrapper">
      <div class="relative title-wrapper">
        <h5 class="title">{{ $t("common.latestBigWinsTitle") }}</h5>
        <!-- <q-tabs
          v-model="tab"
          class="tabs-wrapper"
          indicator-color="primary"
          narrow-indicator
          content-class="tab-item"
          active-class="active"
          dense
        >
          <q-tab
            v-for="(type, key) in rankTypes.types"
            :key="key"
            :name="type.value"
            :label="$t(type.i18nLabel)"
          ></q-tab>
        </q-tabs> -->
        <!-- <q-img class="absolute rank-icon" :src="rankIcon()" alt="rank_board_icon"></q-img> -->
      </div>
      <div class="rank-board">
        <q-tab-panels v-model="tab" animated transition-prev="fade" transition-next="fade" :swipeable="false">
          <q-tab-panel v-for="(type, typeKey) in rankTypes.types" :key="typeKey" :name="type.value">
            <div class="rank-table-mobile">
              <div class="rank-thead-mobile">
                <div class="rank-tr-mobile">
                  <div v-for="(item, key) in headers" :key="key" class="rank-th-mobile">{{ $t(item.i18nLabel) }}</div>
                </div>
              </div>
              <div v-if="visibleItems.length" class="overflow-hidden rank-tbody-mobile">
                <transition-group appear enter-active-class="animated slideInDown" :key="currentIndex">
                  <div
                    v-for="(item, key) in visibleItems.slice().reverse()"
                    :key="visibleItems.length - 1 - key"
                    class="cursor-pointer rank-tr-mobile"
                    :class="{ 'odd-row': (visibleItems.length - 1 - key) % 2 === 0 }"
                    @click="eventbus.emit('openBetDetail', true, item)"
                  >
                    <div class="rank-td-mobile account">
                      <div class="account-wrapper">
                        <div class="rank-avatar">
                          <!-- 顯示用戶頭像 -->
                          <img
                            v-if="shouldShowUserAvatar(item)"
                            :src="getUserAvatarUrl(item)"
                            :alt="item.member_account"
                            class="user-avatar-img"
                            @error="handleAvatarError"
                          />
                          <!-- 顯示默認頭像 -->
                          <div v-else class="default-avatar">
                            <q-icon name="person" size="18px" color="grey-6" />
                          </div>
                        </div>
                        <span class="account-name">{{ item.member_account }}</span>
                      </div>
                    </div>
                    <div class="rank-td-mobile games">{{ item.game_name }}</div>
                    <div class="rank-td-mobile stake">{{ moneyFormat(item.bet_amount) }}</div>
                    <div class="rank-td-mobile odds">
                      <span>{{ calculateOdds(item.prize_amount, item.bet_amount) }}</span>
                    </div>
                    <div class="rank-td-mobile payout" :class="parseInt(item.prize_amount) >= 0 ? 'green' : ''">
                      {{
                        parseInt(item.prize_amount) >= 0
                          ? `+${moneyFormat(item.prize_amount)}`
                          : `${moneyFormat(item.bet_amount)}`
                      }}
                    </div>
                  </div>
                </transition-group>
              </div>
              <div v-else class="cursor-default rank-tbody-mobile no-data">
                <img v-if="getWideLogo" :src="getWideLogo()" alt="" />
                <span>{{ $t("tableHeader.no_data") }}</span>
              </div>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount, computed, watch } from "vue"
import { useQuasar } from "quasar"
import { useRoute } from "vue-router"
import { useCommon } from "src/common/hooks/useCommon"
import { useSiteImg } from "app/template/set_amuse/hooks/useSiteImg"
import { useApi } from "src/common/hooks/useApi"
import { getLatestWinList, getLatestBetList } from "src/api/rank"
import * as Request from "src/api/request.type"
import * as Response from "src/api/response.type"
import { GAME_TYPE } from "src/common/utils/constants"
import { useLogo } from "src/common/composables/useLogo"
import { EventBusKey } from "src/symbols"
import { injectStrict } from "src/common/utils/injectTyped"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useDynamicImage, DYNAMIC_IMAGE_DISPLAY_SIZE, squareCoverTransform } from "src/common/composables/useDynamicImage"

enum RANK_TYPE {
  latestBet = "latestBet",
  latestWin = "latestWin"
}

const $q = useQuasar()
const isMobile = computed(() => $q.screen.width < 768)
const { moneyFormat, genEnumToArray } = useCommon()

// 賠率計算函數
const calculateOdds = (prizeAmount: string, betAmount: string) => {
  const prize = parseFloat(prizeAmount)
  const bet = parseFloat(betAmount)

  if (bet === 0 || isNaN(prize) || isNaN(bet)) {
    return "-"
  }

  const odds = prize / bet

  // 格式化賠率，保留2位小數
  return odds.toFixed(2) + "x"
}

const { userWalletList } = useUserInfo()
const { rankIcon } = useSiteImg()
const route = useRoute()
const eventbus = injectStrict(EventBusKey)

const gameType = computed(() => {
  let gameType
  try {
    const allGameTypes = genEnumToArray(GAME_TYPE.Enums)
    const currentGameType = Number(route.params.gameType)
    if (allGameTypes.includes(currentGameType)) {
      gameType = currentGameType
    }
  } catch (e: any) {
    console.warn(`rank board is not supported the game type: ${route.params.gameType}`)
  } finally {
    return gameType
  }
})

const { getWideLogo } = useLogo()
const { buildImageUrl } = useDynamicImage()

// 判斷是否顯示頭像
const shouldShowUserAvatar = (item: Response.RankItem): boolean => {
  // 規則1: 有頭像且 show_avatar 為 true，顯示用戶頭像
  // 規則2: 有頭像但 show_avatar 為 false，顯示默認頭像
  // 規則3: 没有頭像，無論 show_avatar 如何，都顯示默認頭像
  return !!item.avatar_path && item.show_avatar === true
}

// 獲取用戶頭像 URL
const getUserAvatarUrl = (item: Response.RankItem): string => {
  if (item.avatar_path) {
    return buildImageUrl(item.avatar_path, undefined, squareCoverTransform(DYNAMIC_IMAGE_DISPLAY_SIZE.AVATAR_SM))
  }
  return ""
}
// 圖片加載失敗處理
const handleAvatarError = (event: Event) => {
  // 圖片加載失敗時，隱藏 img 元素，顯示默認頭像
  const img = event.target as HTMLImageElement
  img.style.display = "none"
}

//#region 設定值
/** 動畫是否播放 */
const run = ref(true)

/** 動畫的間隔秒數 */
const durationSeconds = ref(1)

/** 是否重播 */
const infinite = ref(true)

/** 欲顯示的筆數 */
const visibleCount = ref(isMobile.value ? 5 : 10)
//#endregion

const rankTypes = reactive({
  types: [
    {
      i18nLabel: "common.btn.latestWin",
      value: RANK_TYPE.latestWin
    },
    {
      i18nLabel: "common.btn.latestBet",
      value: RANK_TYPE.latestBet
    }
  ]
})
const tab = ref(rankTypes.types[0].value)

const headers = [
  { i18nLabel: "common.player" },
  { i18nLabel: "common.games" },
  { i18nLabel: "common.stake" },
  { i18nLabel: "common.odds" },
  { i18nLabel: "common.payout" }
]

const visibleItems = ref<Response.RankItem[]>([])
async function getRankList() {
  let func: (params: Request.GetRankList) => Promise<Response.RankItem[]>
  switch (tab.value) {
    case RANK_TYPE.latestBet:
      func = getLatestBetList
      break
    case RANK_TYPE.latestWin:
      func = getLatestWinList
      break
    default:
      console.warn(`getRankList: ${tab.value} types is not allows.`)
      return
  }

  const { status, data } = await useApi(func, {
    currency_id: undefined,
    game_type: gameType.value ? gameType.value : undefined
  })

  startAnimation(status && data && data.length ? data : [])
}

/** 指針 */
const currentIndex = ref(0)

/** 動畫的Timer */
let intervalTimer: NodeJS.Timeout

/** 重置 */
function resetVisibleItems() {
  if (intervalTimer) clearInterval(intervalTimer)
  currentIndex.value = 0
  visibleItems.value = []
}

function startAnimation(list: Response.RankItem[] = []) {
  resetVisibleItems()

  if (!run.value || !list.length || list.length <= visibleCount.value) {
    visibleItems.value = list
    list.forEach((item) => {
      itemDisplayIndex.value.set(item.id, displayCounter++)
    })

    return
  }

  const updateVisibleItems = () => {
    const newItem = list[currentIndex.value]

    // 从后面插入新数据
    visibleItems.value.push(newItem)

    // 超过显示数量时，从前面删除旧数据
    // if (visibleItems.value.length > visibleCount.value + 1) {
    //   visibleItems.value.shift()
    // }
  }

  intervalTimer = setInterval(() => {
    updateVisibleItems()

    currentIndex.value++
    if (currentIndex.value >= list.length) {
      if (infinite.value) {
        currentIndex.value = 0
      } else {
        clearInterval(intervalTimer)
      }
    }
  }, durationSeconds.value * 1000)
}

onMounted(async () => {
  await getRankList()
})

onBeforeUnmount(() => {
  resetVisibleItems()
})

watch(
  () => tab.value,
  () => {
    resetVisibleItems()
    getRankList()
  }
)
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_amuse/assets/css/_variable.sass";

// .bg-active-tab {
//   color: $text-dark-color !important;
// }

// .white-style .bg-active-tab {
//   background: $primary-color !important;
//   color: $text-light-color !important;
// }

.account,
.games {
  font-weight: 400;
  font-size: 0.875rem;
  line-height: 1.0625rem;
  color: rgba($text-light-color, 0.7);
  .account-wrapper {
    display: flex;
    align-items: center;
    .rank-avatar {
      width: 32px;
      height: 32px;
      margin-right: 0.5rem;
      flex-shrink: 0;
      border-radius: 50%;
      border: 1px solid rgba(#727272, 0.6);
    }
    .user-avatar-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
      position: relative;
      z-index: 1;
    }
    .default-avatar {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #2a2a2a;
      position: relative;
      z-index: 1;
      border-radius: 50%;
    }
  }
}

.stake {
  font-weight: 700;
  font-size: 1rem;
  line-height: 1.3125rem;
  color: $text-light-color;
}
.odds {
  span {
    display: inline-block;
    padding: 0.125rem 0.5rem;
    background: rgba($background-light-gray, 0.3);
    border-radius: 0.25rem;
    color: $text-light-color;
    font-weight: 700;
    font-size: 0.875rem;
    line-height: 1.0625rem;
  }
}
.payout {
  font-weight: 700;
  font-size: 1rem;
  line-height: 1.3125rem;
  color: $text-danger-color;

  &.green {
    color: $text-success-color;
  }
}

.rank-board-wrapper {
  font-family: OpenSans;
  width: 100%;
  max-width: 87.5rem;
  margin-bottom: 3.125rem;

  @include pc-width {
    width: 100%;
    padding: 0 0.5rem;
  }

  &.pc .rank-wrapper {
    width: 100%;
    padding: 0rem 0rem 2.5rem;
    border-radius: 1.5rem;

    :deep(.q-tab-panels) {
      background: transparent;
      border-radius: 1rem;

      .q-tab-panel {
        padding: 0;
      }
    }

    .title-wrapper {
      padding: 0rem 0rem 0.75rem;
      display: flex;
      -webkit-box-align: center;
      align-items: center;
      -webkit-box-pack: start;
      justify-content: flex-start;
      flex-flow: row;
    }

    .title {
      font-weight: 590;
      font-size: 1.75rem;
      line-height: 2.0625rem;
      color: $text-light-color;
      margin-right: 1.5625rem;
    }

    // .tabs-wrapper {
    //   .tab-item > .q-tab {
    //     background: rgba($background-light-color, 0.2);
    //     border-radius: 50em;
    //     margin: 0 0.625rem;
    //     text-transform: initial;
    //     color: $text-light-color;
    //   }
    // }

    .rank-board {
      .rank-table {
        background: $background-dark-gray;
        width: 100%;

        .rank-tr {
          width: 100%;
          height: 3.125rem;
          display: flex;
          flex-direction: row;
          flex-wrap: nowrap;
        }

        .rank-th,
        .rank-td {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 1;
        }

        .rank-thead {
          background: linear-gradient(360deg, $table-background-black -23%, $table-background-gray 164%);
          color: $text-light-color;
          width: 100%;
          height: 3.125rem;

          .rank-th {
            font-weight: 510;
            font-size: 1.125rem;
            line-height: 1.3125rem;
          }
        }

        .rank-tbody {
          width: 100%;
          height: calc(3.125rem * v-bind(visibleCount));

          .rank-tr {
            border-bottom: 0.0625rem solid rgba($border-bottom-bolor, 0.1);
            &.odd-row {
              background-color: rgba($background-light-color, 0.1) !important;
            }
            &:hover {
              background-color: rgba($background-light-color, 0.3) !important;
            }
          }

          &.no-data {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-size: 1.125rem;
            color: rgba(255, 255, 255, 0.5);
            gap: 1rem;

            img {
              max-width: 12rem;
              opacity: 0.3;
            }

            span {
              font-size: 1rem;
              color: rgba(255, 255, 255, 0.6);
            }
          }
        }
      }
    }
  }

  &.h5 .rank-wrapper {
    background: transparent;
    width: 100%;
    padding: 0.625rem 0 0;

    :deep(.q-tab-panels) {
      border-radius: 0rem 0rem 0.5rem 0.5rem;
      background: transparent;

      .q-tab-panel {
        padding: 0;
      }
    }

    :deep(.q-tab) {
      &.active .q-tab__label {
        color: $text-dark-color;
        font-weight: bold;
      }
    }

    .account,
    .games,
    .stake {
      font-size: 0.75rem;
    }

    .account {
      font-weight: bold;
      .account-wrapper {
        display: flex;
        align-items: center;
        .rank-avatar {
          width: 20px;
          height: 20px;
          margin-right: 0.2rem;
          flex-shrink: 0;
          border-radius: 50%;
          border: 1px solid rgba(#727272, 0.6);
        }
        .user-avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
          position: absolute;
          top: 0;
          left: 0;
          z-index: 1;
        }

        .default-avatar {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #2a2a2a;
          position: relative;
          z-index: 1;
          border-radius: 50%;
        }
      }
    }

    .payout {
      font-size: 0.875rem;
    }

    .title-wrapper {
      display: flex;
      flex-direction: column;

      .rank-icon {
        position: absolute;
        width: 6.25rem;
        height: 3.125rem;
        top: 0;
        right: 0;
      }

      .title {
        color: $white-coloe;
        font-size: 4vw;
        margin: 0 0.5vw;
        margin-bottom: 1rem;
        font-weight: 860;
        font-family: "OpenSans";
      }

      //   :deep(.tabs-wrapper) {
      //     .tab-item {
      //       border-radius: 0.5rem 0.5rem 0 0;
      //       display: flex;
      //       align-items: center;
      //       justify-content: center;
      //       height: 3.125rem;
      //       font-size: 0.875rem;
      //       color: $text-steel-blue-color;

      //       > * {
      //         flex: 1;
      //         text-transform: none;
      //       }

      //       > :first-child {
      //         background: linear-gradient($background-pale-pink-color 0%, $background-light-color 100%);
      //       }

      //       > :last-child {
      //         background: linear-gradient($background-pale-blue-color 0%, $background-light-color 100%);
      //       }
      //     }
      //   }
    }

    // 手機版表格樣式
    .rank-table-mobile {
      background: $background-dark-gray;
      width: 100%;
      border-radius: 0.5rem;
      overflow: hidden;
    }

    .rank-thead-mobile {
      background: linear-gradient(360deg, $table-background-black -23%, $table-background-gray 164%);
      width: 100%;
      height: 2.5rem;

      .rank-tr-mobile {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 0 0.5rem;
      }

      .rank-th-mobile {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 500;
        font-size: 0.75rem;
        color: rgba(255, 255, 255, 0.7);

        &:nth-child(1) {
          flex: 0 0 18%;
        } // 玩家
        &:nth-child(2) {
          flex: 0 0 22%;
        } // 遊戲
        &:nth-child(3) {
          flex: 0 0 20%;
        } // 投注額
        &:nth-child(4) {
          flex: 0 0 18%;
        } // 倍率
        &:nth-child(5) {
          flex: 0 0 22%;
        } // 派彩
      }
    }

    .rank-tbody-mobile {
      width: 100%;
      height: calc(3rem * v-bind(visibleCount));
      background: $background-dark-gray;

      .rank-tr-mobile {
        width: 100%;
        height: 3rem;
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 0 0.5rem;
        border-bottom: 1px solid rgba($border-bottom-bolor, 0.1);
        transition: background-color 0.2s ease;
        &.odd-row {
          background-color: rgba($background-light-color, 0.1) !important;
        }

        &:hover {
          background-color: rgba($background-light-color, 0.3) !important;
        }

        &:last-child {
          border-bottom: none;
        }
      }

      .rank-td-mobile {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.75rem;
        color: rgba(255, 255, 255, 0.9);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        &:nth-child(1) {
          flex: 0 0 20%;
        } // 玩家
        &:nth-child(2) {
          flex: 0 0 20%;
        } // 遊戲
        &:nth-child(3) {
          flex: 0 0 20%;
        } // 投注額
        &:nth-child(4) {
          flex: 0 0 18%;
        } // 倍率
        &:nth-child(5) {
          flex: 0 0 22%;
        } // 派彩

        &.account {
          font-weight: 400;
          color: rgba(255, 255, 255, 0.8);
        }

        &.games {
          font-weight: 400;
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.7);
        }

        &.stake {
          font-weight: 600;
          color: $text-light-color;
        }

        &.odds {
          font-weight: 700;
          color: $text-light-color;
          font-size: 0.8rem;
        }

        &.payout {
          font-weight: 700;
          font-size: 0.8rem;
          color: $text-danger-color;

          &.green {
            color: $text-success-color;
          }
        }
      }

      &.no-data {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 1rem;
        color: rgba(255, 255, 255, 0.5);
        padding: 2rem;

        img {
          max-width: 8rem;
          margin-bottom: 1rem;
          opacity: 0.3;
        }
      }
    }
  }
}
</style>
