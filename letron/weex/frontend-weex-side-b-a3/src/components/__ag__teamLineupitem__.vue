<template>
  <div class="__ag__teamlineup__" :class="[isbottom ? '__ag__bottom__' : '']">
    <div class="__ag__footballtitlecontent__" v-if="!isbottom">
      <div
        class="football-position"
        v-for="(l, index) in list1"
        :key="'home' + index"
      >
        <ag-player
          v-for="(item, index) in l"
          :key="item.name + index"
          :scheduleClass="scheduleClass"
          :item="item"
        ></ag-player>
      </div>
    </div>
    <div v-else class="__ag__footballtitlecontent__">
      <div
        class="football-position"
        v-for="(l, index) in list2"
        :key="'away' + index"
      >
        <ag-player
          v-for="(item, index) in l"
          :key="item.name + index"
          :scheduleClass="scheduleClass"
          :item="item"
        ></ag-player>
      </div>
    </div>
  </div>
</template>

<script>
import player from "./__ag__player__.vue"
export default {
  props: {
    isbottom: {
      type: Boolean,
      default: false,
    },
    scheduleClass: {
      type: Number,
      default: undefined,
    },
    lineupList: {
      type: Array,
      default: function () {
        return []
      },
    },
  },
  components: {
    "ag-player": player,
  },
  computed: {
    list1() {
      if (this.scheduleClass == 4) {
        return this.homeList
      }
      if (this.scheduleClass == 5) {
        return this.awayList
      }
    },
    list2() {
      if (this.scheduleClass == 4) {
        return this.footballHomeList
      }
      if (this.scheduleClass == 5) {
        return this.footballAwayList
      }
    },
    footballHomeList() {
      let l = []

      for (let i = 1; i <= 5; i++) {
        let ln = this.f(0, i)
        l.push(ln)
      }

      return l
    },
    footballAwayList() {
      let l = []

      for (let i = 1; i <= 5; i++) {
        let ln = this.f(1, i)
        l.push(ln)
      }

      return l
    },
    homeList() {
      return this.lineupList.filter((r) => {
        return r.lineupType == 0 || r.lineupType == "home"
      })
    },
    awayList() {
      return this.lineupList.filter((r) => {
        return r.lineupType == 1 || r.lineupType == "away"
      })
    },
  },
  data() {
    return {
      avatar: "2022/0316/17d16af0891b41fea50c91cec95313fc.png",
    }
  },
  methods: {
    f(lineupType, positionId) {
      // console.log(this.lineupList)
      return this.lineupList.filter((r) => {
        return r.lineupType == lineupType && r.positionId == positionId
      })
    },
  },
}
</script>

<style lang="less" scoped>
.__ag__teamlineup__ {
  width: 690px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.__ag__footballtitlecontent__ {
  margin-top: 50px;
  height: 385px;
  width: 690px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.__ag__bottom__ {
  position: absolute;
  bottom: 120px;
}
.football-position {
  width: 690px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-content: center;
}
</style>
