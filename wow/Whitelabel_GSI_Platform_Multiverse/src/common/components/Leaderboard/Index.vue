<template>
  <BetDetail v-model="showBetDetail" :data="selectedBetData" />
  <div v-if="!isMobile" class="rank-board-wrapper" :class="envInfo.siteKey">
    <div class="rank-wrapper">
      <div class="title-wrapper">
        <h5 class="title">{{ getLeaderboardTitle() }}</h5>
        <q-tabs
          v-model="tab"
          class="text-teal tabs-wrapper"
          indicator-color="transparent"
          content-class="tab-item"
          active-class="bg-active-tab"
          dense
        >
          <q-tab
            v-for="(leaderboard, key) in leaderboardList"
            :key="key"
            :name="key"
            :label="leaderboard.leaderboard.titles[currentLanguage]"
          ></q-tab>
        </q-tabs>
      </div>
      <div class="rank-board">
        <q-tab-panels v-model="tab" animated transition-prev="fade" transition-next="fade" :swipeable="false">
          <q-tab-panel v-for="(leaderboard, typeKey) in leaderboardList" :key="typeKey" :name="typeKey">
            <div class="rank-table">
              <div class="rank-thead">
                <div class="rank-tr">
                  <template v-for="(item, key) in headerKey" :key="key">
                    <div v-if="showLeaderboardHeader(leaderboard, item)" class="rank-th">
                      {{ leaderboard.leaderboard.display_settings[item]?.titles[currentLanguage] || "" }}
                    </div>
                  </template>
                </div>
              </div>
              <div v-if="visibleItems.length" class="overflow-hidden rank-tbody">
                <transition-group appear enter-active-class="animated slideInDown" :key="currentIndex">
                  <div
                    v-for="(item, key) in visibleItems"
                    :key="key"
                    @click="handleOpenBetDetail(item)"
                    class="cursor-pointer rank-tr"
                  >
                    <div v-if="showLeaderboardHeader(leaderboard, 'player_account')" class="rank-td account">
                      <template v-if="leaderboardList[tab].leaderboard.display_settings['avatar']?.desktop || false">
                        <img
                          v-if="shouldShowUserAvatar(item)"
                          :src="getUserAvatarUrl(item)"
                          :alt="item.member_account"
                          class="user-avatar-img mr-2"
                          @error="handleAvatarError"
                        />
                        <div v-else class="default-avatar mr-2">
                          <q-icon name="person" size="1.5rem" color="grey-6" />
                        </div>
                      </template>
                      <div v-if="leaderboardList[tab].leaderboard.display_settings['player_account']?.desktop || false">
                        {{ item.member_account }}
                      </div>
                    </div>
                    <div v-if="showLeaderboardHeader(leaderboard, 'game_name')" class="rank-td thumbnail">
                      <img
                        v-if="leaderboardList[tab].leaderboard.display_settings['thumbnail']?.desktop || false"
                        :src="gameImage(item)"
                        :alt="item.game_code"
                        @error="setDefaultGameImg"
                        class="game-img mr-2"
                      />
                      <span v-if="leaderboardList[tab].leaderboard.display_settings['game_name']?.desktop || false">
                        {{ item.game_info[currentLanguage]?.game_name || "" }}
                      </span>
                    </div>
                    <div
                      v-if="leaderboardList[tab].leaderboard.display_settings['bet_amount'].desktop"
                      class="rank-td stake"
                      :class="
                        item.bet_amount >
                        leaderboardList[tab].leaderboard.conditions[item.currency_id].highlight_bet_amount
                          ? 'highlight'
                          : ''
                      "
                    >
                      <span>{{ moneyFormat(item.bet_amount) }}</span>
                    </div>
                    <div
                      v-if="leaderboardList[tab].leaderboard.display_settings['payout_multiplier'].desktop"
                      class="rank-td payout-multiplier"
                      :class="
                        item.payout_multiplier >
                        leaderboardList[tab].leaderboard.conditions[item.currency_id].highlight_payout_multiplier
                          ? 'highlight'
                          : ''
                      "
                    >
                      <span>{{ item.payout_multiplier }}x</span>
                    </div>
                    <div
                      v-if="leaderboardList[tab].leaderboard.display_settings['prize_amount'].desktop"
                      class="rank-td payout"
                      :class="item.prize_amount >= 0 ? 'green' : ''"
                    >
                      {{
                        item.prize_amount >= 0
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

  <div v-else class="rank-board-wrapper h5" :class="envInfo.siteKey">
    <div class="rank-wrapper">
      <div class="relative title-wrapper">
        <div class="title">{{ getLeaderboardTitle() }}</div>
        <q-img class="absolute rank-icon" :src="rankIcon()" alt="rank_board_icon"></q-img>
      </div>
      <div class="tabs-wrapper">
        <q-tabs
          v-model="tab"
          class="text-teal"
          indicator-color="transparent"
          content-class="tab-item"
          active-class="bg-active-tab"
          dense
        >
          <q-tab
            v-for="(leaderboard, key) in leaderboardList"
            :key="key"
            :name="key"
            :label="leaderboard.leaderboard.titles[currentLanguage]"
          ></q-tab>
        </q-tabs>
      </div>
      <div class="rank-board">
        <q-tab-panels v-model="tab" animated transition-prev="fade" transition-next="fade" :swipeable="false">
          <q-tab-panel v-for="(leaderboard, typeKey) in leaderboardList" :key="typeKey" :name="typeKey">
            <div class="rank-table">
              <div class="rank-thead">
                <div class="rank-tr">
                  <template v-for="(item, key) in headerKey" :key="key">
                    <div v-if="showLeaderboardHeader(leaderboard, item)" class="rank-th">
                      {{ leaderboard.leaderboard.display_settings[item]?.titles[currentLanguage] || "" }}
                    </div>
                  </template>
                </div>
              </div>
              <div v-if="visibleItems.length" class="overflow-hidden rank-tbody">
                <transition-group appear enter-active-class="animated slideInDown" :key="currentIndex">
                  <div
                    v-for="(item, key) in visibleItems"
                    :key="key"
                    @click="handleOpenBetDetail(item)"
                    class="cursor-pointer rank-tr"
                  >
                    <div v-if="showLeaderboardHeader(leaderboard, 'player_account')" class="rank-td account">
                      <template v-if="leaderboardList[tab].leaderboard.display_settings['avatar']?.mobile || false">
                        <img
                          v-if="shouldShowUserAvatar(item)"
                          :src="getUserAvatarUrl(item)"
                          :alt="item.member_account"
                          class="user-avatar-img mr-1"
                          @error="handleAvatarError"
                        />
                        <div v-else class="default-avatar mr-1">
                          <q-icon name="person" size="1.25rem" color="grey-6" />
                        </div>
                      </template>
                      <span
                        v-if="leaderboardList[tab].leaderboard.display_settings['player_account']?.mobile || false"
                        >{{ item.member_account }}</span
                      >
                    </div>
                    <div v-if="showLeaderboardHeader(leaderboard, 'game_name')" class="rank-td thumbnail">
                      <img
                        v-if="leaderboardList[tab].leaderboard.display_settings['thumbnail']?.mobile || false"
                        :src="gameImage(item)"
                        :alt="item.game_code"
                        @error="setDefaultGameImg"
                        class="game-img mr-1"
                      />
                      <span v-if="leaderboardList[tab].leaderboard.display_settings['game_name']?.mobile || false">{{
                        item.game_info[currentLanguage].game_name
                      }}</span>
                    </div>
                    <div
                      v-if="leaderboardList[tab].leaderboard.display_settings['bet_amount'].mobile"
                      class="rank-td stake"
                      :class="
                        item.bet_amount >
                        leaderboardList[tab].leaderboard.conditions[item.currency_id].highlight_bet_amount
                          ? 'highlight'
                          : ''
                      "
                    >
                      <span>{{ moneyFormat(item.bet_amount) }}</span>
                    </div>
                    <div
                      v-if="leaderboardList[tab].leaderboard.display_settings['payout_multiplier'].mobile"
                      class="rank-td payout-multiplier"
                      :class="
                        item.payout_multiplier >
                        leaderboardList[tab].leaderboard.conditions[item.currency_id].highlight_payout_multiplier
                          ? 'highlight'
                          : ''
                      "
                    >
                      <span>{{ item.payout_multiplier }}x</span>
                    </div>
                    <div
                      v-if="leaderboardList[tab].leaderboard.display_settings['prize_amount'].mobile"
                      class="rank-td payout"
                      :class="item.prize_amount >= 0 ? 'green' : ''"
                    >
                      {{
                        item.prize_amount >= 0
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
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed, watch } from "vue"
import { useQuasar } from "quasar"
import { useCommon } from "src/common/hooks/useCommon"
import { useSiteImg } from "app/template/okbet/hooks/useSiteImg"
import { useApi } from "src/common/hooks/useApi"
import { useLanguage } from "src/common/composables/useLanguage"
import { useEnvInfoStore } from "src/stores/envStore"
import { useEnv } from "src/common/hooks/useEnv"
import { useGame, IGetGameImage } from "src/common/composables/useGame"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { getLeaderboardList } from "src/api/leaderboard"
import * as Response from "src/api/response.type"
import { useLogo } from "src/common/composables/useLogo"
import { useUserInfo } from "src/common/composables/useUserInfo"
import BetDetail from "src/common/components/dialog/BetDetail.vue"
import { show } from "@telegram-apps/sdk/dist/dts/scopes/components/back-button/back-button"

const $q = useQuasar()
const isMobile = computed(() => $q.screen.width < 768)
const { moneyFormat } = useCommon()
const { getGameImage } = useGame()
const { userWalletList } = useUserInfo()
const { setDefaultGameImg } = useCommonImg()

const inUseCurrencyCode = computed(() => userWalletList.value?.find((w) => w.in_use)?.currency_code ?? null)
const { rankIcon } = useSiteImg()
const { getLanguage } = useLanguage()
const currentLanguage = computed(() => getLanguage())
const { getWideLogo } = useLogo()
const { envData } = useEnv()
const { envInfo } = useEnvInfoStore()

const { VITE_APP_DYNAMIC_RESOURCE_URL } = envData()

// BetDetail 控制變數
const showBetDetail = ref(false)
const selectedBetData = ref<Response.LeaderboardWager | null>(null)

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

const tab = ref<number>(-1)

const headerKey = ["player_account", "game_name", "bet_amount", "payout_multiplier", "prize_amount"]

const leaderboardList = ref<Response.LeaderboardResponse[]>([])
const visibleItems = ref<Response.LeaderboardWager[]>([])
async function getRankList() {
  const { data } = await useApi(getLeaderboardList, undefined)

  leaderboardList.value = data || []

  tab.value = 0
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

function startAnimation() {
  resetVisibleItems()
  const list = leaderboardList.value[tab.value]?.wagers || []

  if (!run.value || !list.length || list.length <= visibleCount.value) {
    visibleItems.value = list
    return
  }

  const updateVisibleItems = () => {
    visibleItems.value.unshift(list[currentIndex.value])
    if (visibleItems.value.length > visibleCount.value + 1) {
      visibleItems.value.pop()
    }
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

const getLeaderboardTitle = (): string => {
  const titles = JSON.parse(envInfo.leaderboard_language)
  return titles[currentLanguage.value] || ""
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

const showLeaderboardHeader = (item: Response.LeaderboardResponse, column: string): boolean => {
  const device = isMobile.value ? "mobile" : "desktop"
  if (column === "player_account") {
    return (
      !!item.leaderboard.display_settings["avatar"]?.[device] ||
      !!item.leaderboard.display_settings["player_account"]?.[device]
    )
  }
  if (column === "game_name") {
    return (
      !!item.leaderboard.display_settings["thumbnail"]?.[device] ||
      !!item.leaderboard.display_settings["game_name"]?.[device]
    )
  }

  return !!item.leaderboard.display_settings[column]?.[device]
}

// 判斷是否顯示頭像
const shouldShowUserAvatar = (item: Response.LeaderboardWager): boolean => {
  return !!item.member_avatar_path === true
}

// 獲取用戶頭像 URL
const getUserAvatarUrl = (item: Response.LeaderboardWager): string => {
  if (item.member_avatar_path) {
    return `${VITE_APP_DYNAMIC_RESOURCE_URL}/${item.member_avatar_path}`
  }
  return ""
}

// 圖片加載失敗處理
const handleAvatarError = (event: Event) => {
  // 圖片加載失敗時，隱藏 img 元素，顯示默認頭像
  const img = event.target as HTMLImageElement
  img.style.display = "none"
}

// 處理開啟投注詳情
const handleOpenBetDetail = (item: Response.LeaderboardWager) => {
  selectedBetData.value = item
  showBetDetail.value = true
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
    startAnimation()
  }
)
</script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"
@import "app/template/okbet/assets/css/_variable.sass"
@import "app/template/okbet/assets/css/data.scss"

.account,
.games
  font-weight: 400
  font-size: 0.875rem
  line-height: 1.0625rem
  .user-avatar-img
    width: 2rem
    height: 2rem
    object-fit: cover
    border-radius: 50%
    position: relative
    z-index: 1
    border: 1px solid #727272
  .default-avatar
    width: 2rem
    height: 2rem
    border-radius: 50%
    border: 1px solid #727272
    text-align: center
    align-content: center
.game-img
  height: 2.5rem
  object-fit: cover
  border-radius: 50%
  border: 1px solid #727272
.stake
  font-weight: 700
  line-height: 1.3125rem
.payout
  font-weight: 700
  line-height: 1.3125rem
.payout-multiplier
  font-weight: 700
  line-height: 1.3125rem
  &.highlight span
    background: var(--table-tbody-content-badge)
    border-radius: 1rem
    padding: 0.25rem 0.5rem

.rank-board-wrapper
  color: var(--text-color)
  background: var(--section-bg)
  font-family: OpenSans
  width: 100%
  margin: 24px auto 24px
  padding-left: 0
  padding-right: 0
  box-sizing: border-box
  border-radius: 1.5rem

  .rank-wrapper
    width: 100%
    padding: var(--section-padding)
    border-radius: 1.5rem

    :deep(.q-tab-panels)
      background: transparent
      border-radius: 1rem
      .q-tab-panel
        padding: 0

    .title-wrapper
      padding: 2.1875rem 0rem 1.25rem
      display: flex
      -webkit-box-align: center
      align-items: center
      -webkit-box-pack: start
      justify-content: flex-start
      flex-flow: row

    .title
      font-weight: 700
      font-size: 1.75rem
      line-height: 2.0625rem
      margin-right: 1.5625rem

    .tabs-wrapper
      .tab-item > .q-tab
        background: var(--tab-disabled-bg)
        color: var(--tab-disabled-text-color)
        border: var(--tab-border)
        border-radius: 50em
        margin: 0 0.625rem
        text-transform: initial
        &.bg-active-tab
          background: var(--tab-activity-bg)
          color: var(--tab-activity-text-color)
    .rank-board
      .rank-table
        background: var(--table-bg)
        width: 100%
        color: var(--table-tbody-text-color)
        border: var(--table-border)
        border-radius: 1rem

        .rank-tr
          width: 100%
          height: 3.125rem
          display: flex
          flex-direction: row
          flex-wrap: nowrap

        .rank-th,
        .rank-td
          height: 100%
          display: flex
          align-items: center
          justify-content: center
          flex: 1

        .rank-thead
          background: var(--table-thead-bg)
          color: var(--table-thead-text-color)
          width: 100%
          height: 3.125rem
          border-bottom: var(--table-thead-border)
          border-top-right-radius: 1rem
          border-top-left-radius: 1rem

          .rank-th
            font-weight: 510
            font-size: 1.125rem
            line-height: 1.3125rem

        .rank-tbody
          width: 100%
          height: calc(3.125rem * v-bind(visibleCount))

          .rank-tr
            border-bottom: var(--table-tbody-border)
            &:nth-child(even)
              background: var(--table-tbody-bg-even)

  &.h5
    background: var(--section-bg-h5)
    .rank-wrapper
      background: none
      padding: var(--section-padding-h5)
      .title-wrapper
        display: flex
        flex-direction: column
        padding: 1rem 0rem 0rem

        .rank-icon
          position: absolute
          width: 6.25rem
          height: 3.125rem
          top: 0
          right: 0

        .title
          width: 100%
          font-size: 4vw
          margin: 0px
          font-weight: 860
          font-family: 'OpenSans'
          vertical-align: top
          color: var(--text-color)
      .tabs-wrapper
        width: 100%
        .tab-item > .q-tab
          background: var(--tab-disabled-bg-h5)
          border: 0px
          border-radius: 0rem
          margin: 0
          color: var(--tab-disabled-text-color-h5)
          padding-right: 1rem
          padding-left: 1rem
          &:first-child
            border-top-left-radius: 1rem
          &:last-child
            border-top-right-radius: 1rem
          &.bg-active-tab
            color: var(--tab-activity-text-color-h5)
            background: var(--tab-activity-bg-h5)
            :deep(.column)
              padding: 0.5rem 0.5rem
              border-bottom: var(--tab-activity-underline)
      .q-tab-panels
        border-top-right-radius: 0rem
        border-top-left-radius: 0rem
        border-bottom-right-radius: 0.5rem
        border-bottom-left-radius: 0.5rem
        .rank-table
          font-size: 0.875rem
          border-top: 0px
          border-top-right-radius: 0rem
          border-top-left-radius: 0rem
          .rank-thead
            display: none
          .account,
          .games
            font-size: 0.75rem
            .user-avatar-img
              width: 1.5rem
              height: 1.5rem
            .default-avatar
              width: 1.5rem
              height: 1.5rem
</style>

<style lang="sass" scoped>
.rank-board-wrapper.okbet:not(.h5)
  .rank-wrapper
    width: 100%
    background: url("app/template/okbet/assets/images/rankBoard/bg_ranking.png") 0% 0% / cover no-repeat
    padding: 0rem 1.5rem 2.5rem
    border-radius: 1.5rem
    .title-wrapper
      padding: 2.1875rem 0rem 3.75rem
      display: flex
      -webkit-box-align: center
      align-items: center
      -webkit-box-pack: start
      justify-content: flex-start
      flex-flow: row
</style>

<style lang="sass" scoped>
.rank-board-wrapper.set_amuse
  padding: 0
  .rank-wrapper
    background: none
    .title-wrapper
      padding: 0.5rem 0
      .title
        color: var(--text-color)
        margin-bottom: 0px
      .q-img
        display: none
      .q-tabs
        display: none
    .tabs-wrapper
      .q-tabs
        display: none
    .rank-board .rank-table
      background: var(--table-bg)
      .rank-thead
        background: var(--table-thead-bg)
      .rank-tbody
        width: 100%
        height: calc(3.125rem * v-bind(visibleCount))
        .rank-tr
          border-bottom: 0px
          &:nth-child(even)
            background: var(--table-tbody-bg-even)
          .default-avatar
            display: flex
            align-items: center
            justify-content: center
            background: #2a2a2a
            position: relative
            z-index: 1
            border-radius: 50%
          .payout-multiplier:not(.highlight) span
            display: inline-block
            padding: 0.125rem 0.5rem
            background: rgba(102, 102, 102, 0.3)
            border-radius: 0.25rem
            color: #ffffff
            font-weight: 700
            font-size: 0.875rem
            line-height: 1.0625rem
  &.h5
    .rank-wrapper .rank-board .rank-table
      border-top-right-radius: 0.75rem
      border-top-left-radius: 0.75rem
      .rank-thead
        background: var(--table-thead-bg)
        border-top-right-radius: 0.75rem
        border-top-left-radius: 0.75rem
        height: 2.5rem
        display: block
        .rank-tr
          height: 2.5rem
          .rank-th
            font-size: 0.75rem
            line-height: 2.5rem
      .rank-tbody
        .rank-tr
          height: 2.75rem
</style>
