<template>
  <div class="__ag__incomelive__">
    <ag-uptime
      v-if="info.status < 2"
      :info="info"
      :user="user"
      :list="sortedListMatchUser"
    ></ag-uptime>
    <ag-enddatalive
      v-else
      :info="info"
      :list="sortedListMatchUser"
    ></ag-enddatalive>
  </div>
</template>

<script>
import minix from "./__ag__minix__.js"
import uptime from "./__ag__upTime__.vue"
import enddatalive from "./__ag__enddatalive__.vue"

export default {
  mixins: [minix],
  components: {
    "ag-uptime": uptime,
    "ag-enddatalive": enddatalive,
  },
  props: {
    info: {
      type: Object,
      default: function () {
        return {}
      },
    },
    user: {
      type: Object,
      default: function () {
        return {}
      },
    },
  },
  data() {
    return {
      pageUpList: [],
      listMatchUser: [],
    }
  },
  computed: {
    sortedListMatchUser() {
      if (!Object.keys(this.pageUpListMap).length) return []
      return this.listMatchUser.sort((a, b) => {
        const isFollowingA = this.pageUpListMap[a.uid].follow
        const isFollowingB = this.pageUpListMap[b.uid].follow

        // if both following thn sort by viewer amount
        if (isFollowingA && isFollowingB) {
          const viewerA = a.joinMap.room.amount
          const viewerB = b.joinMap.room.amount

          // if same viewer thn sort by match id
          if (viewerA === viewerB) {
            return a.matchId - b.matchId
          }

          return viewerB - viewerA
        }

        return isFollowingA ? -1 : 1
      })
    },
    pageUpListMap() {
      return this.pageUpList.reduce((obj, user) => {
        obj[user.id] = user
        return obj
      }, {})
    },
  },
  async mounted() {
    await this.__ag__getData__()
  },
  methods: {
    async __ag__getData__() {
      let respUp = await this.__ag__pageUp__()
      if (respUp && respUp.data && respUp.data.list) {
        this.pageUpList = respUp.data.list
      }

      let resp = await this.__ag__getlistUsersLive__()
      if (resp && resp.data && resp.data.length) {
        const map = {}
        const uniqData = resp.data.reduce((arr, item) => {
          if (!map[item.scheduleId]) {
            map[item.scheduleId] = true
            arr.push(item)
          }
          return arr
        }, [])
        this.listMatchUser = uniqData.slice(0, 16)
      }
    },
  },
}
</script>

<style>
.__ag__incomelive__ {
  width: 750px;
  /* height: 421.875px; */
  /* background-color: #000; */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}
</style>
