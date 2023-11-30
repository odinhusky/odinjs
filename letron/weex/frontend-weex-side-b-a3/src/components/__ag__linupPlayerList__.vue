<template>
  <div class="__ag__linupplayerlist__" v-if="list && list.length > 0">
    <!-- 主队 -->
    <div
      class="__ag__linupplayer__"
      v-for="(item, index) in list"
      :key="'pl' + index"
    >
      <div
        class="__ag__linupplayeritem__"
        v-for="(it, key) in item.list"
        :key="'it' + key"
      >
        <image
          v-if="it.lineupType == '0' || it.lineupType == '2'"
          :src="__ag__url__(incomeLive.teamFlaga)"
          class="__ag__linupplayerimg__"
        ></image>
        <div class="__ag__playeritemname__">
          <text class="__ag__playeritemnametext__">{{ it.name }}</text>
          <text class="__ag__playeritemnamewz__">{{ it.position }}</text>
        </div>
        <div
          class="__ag__playeritemstatus__"
          v-if="
            incomeLive &&
            incomeLive.status == 2 &&
            scheduleClass == 5 &&
            isStarting &&
            it.playerMap
          "
        >
          <div
            class="__ag__playeritemp__ __ag__huan__"
            v-if="it.playerMap && it.playerMap.yellow > 0"
          ></div>
        </div>
        <div
          class="__ag__playeritemstatus__"
          v-if="incomeLive && incomeLive.status == 2 && isStarting"
        >
          <text
            class="agiconfont __ag__jia__"
            v-if="item.playerPosition == '受伤'"
            >&#xe6d7;</text
          >
          <text
            class="agiconfont __ag__yao__"
            v-if="item.playerPosition == '生病'"
            >&#xe6d9;</text
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import agMinUrl from "./__ag__minurl__.js"
export default {
  mixins: [agMinUrl],
  props: {
    incomeLive: {
      type: Object,
      default: function () {
        return {}
      },
    },
    list: {
      type: Array,
      default: function () {
        return []
      },
    },
    scheduleClass: {
      type: Number,
      default: undefined,
    },
    isStarting: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {}
  },
}
</script>

<style scoped lang="less">
@import "../style/theme.less";
.__ag__linupplayerlist__ {
  width: 686px;
  margin-left: 32px;
  margin-right: 32px;
  padding-top: 20px;
  padding-bottom: 20px;
  flex-direction: row;
  justify-content: space-between;
}
.__ag__linupplayer__ {
  flex: 0.4;
  flex-direction: column;
}
.__ag__linupplayeritem__ {
  flex: 1;
  height: 116px;
  padding-top: 16px;
  padding-bottom: 16px;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
}
.__ag__linupplayerimg__ {
  width: 56px;
  height: 56px;
  border-radius: 28px;
  margin-right: 20px;
}
.__ag__playeritemname__ {
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
}
.__ag__playeritemnametext__ {
  lines: 1;
  text-overflow: ellipsis;
  flex: 1;
  font-style: normal;
  font-weight: 500;
  font-size: 14wx;
  color: @black;
}
.__ag__playeritemnamewz__ {
  font-style: normal;
  font-weight: 400;
  font-size: 12wx;
  color: @blue4;
}
.__ag__playeritemstatus__ {
  width: 30px;
  height: 56px;
  align-items: center;
  justify-content: center;
}
.__ag__jia__ {
  font-size: 15wx;
  color: @red5;
}
.__ag__yao__ {
  font-size: 15wx;
  color: @yellow4;
}
.__ag__playeritemp__ {
  width: 16px;
  height: 20px;
  border-radius: 4px;
}
.__ag__huan__ {
  background-color: @yellow1;
}
.__ag__hong__ {
  background-color: @red5;
}
</style>
