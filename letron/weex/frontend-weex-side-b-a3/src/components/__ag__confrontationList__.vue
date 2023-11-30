<template>
  <div class="__ag__confrontationlist__">
    <div class="__ag__conftitle__">
      <text class="__ag__conftitletext__">日期</text>
      <text class="__ag__conftitletext__ __ag__saishi__">赛事</text>
      <text class="__ag__conftitletext__">主队</text>
      <text class="__ag__conftitletext__">比分</text>
      <text class="__ag__conftitletext__">客队</text>
    </div>
    <div
      class="__ag__conftitle__"
      v-for="(item, index) in recordList"
      :key="index"
    >
      <text class="__ag__conftext__">{{
        util.dateFormat(item.beginTime)
      }}</text>
      <text class="__ag__conftext__ __ag__saishi__">{{ item.matchName }}</text>
      <text class="__ag__conftext__">{{ item.teamNamea }}</text>
      <div class="__ag__confscore__" v-if="item.scorea != item.scoreb">
        <text
          class="__ag__confscoretext__"
          v-if="item.teamNamea == teamName"
          :class="[
            item.scorea < item.scoreb
              ? '__ag__shu__'
              : item.scorea > item.scoreb
              ? '__ag__ying__'
              : '',
          ]"
          >{{ item.scorea }}</text
        >
        <text v-else class="__ag__confscoreg__">{{ item.scorea }}</text>
        <text class="__ag__confscoreg__">-</text>
        <text
          v-if="item.teamNameb == teamName"
          class="__ag__confscoretext__"
          :class="[
            item.scorea > item.scoreb
              ? '__ag__shu__'
              : item.scorea < item.scoreb
              ? '__ag__ying__'
              : '',
          ]"
          >{{ item.scoreb }}</text
        >
        <text v-else class="__ag__confscoreg__">{{ item.scoreb }}</text>
      </div>
      <div v-else class="__ag__confscore__">
        <div class="__ag__confscorediv__ __ag__ping__">
          <text class="__ag__confscoreg__ __ag__pingtext__">{{
            item.scorea
          }}</text>
          <text class="__ag__confscoreg__ __ag__pingtext__">-</text>
          <text class="__ag__confscoreg__ __ag__pingtext__">{{
            item.scoreb
          }}</text>
        </div>
      </div>
      <text class="__ag__conftext__">{{ item.teamNameb }}</text>
    </div>
  </div>
</template>

<script>
import util from "./util.js"
export default {
  props: {
    scheduleClass: {
      type: Number,
      default: undefined,
    },
    recordList: {
      type: Array,
      default: function () {
        return []
      },
    },
    teamName: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      util,
    }
  },
}
</script>

<style lang="less" scoped>
@import "../style/theme.less";
.__ag__confrontationlist__ {
  flex: 1;
  width: 750px;
  display: flex;
  padding-left: 32px;
  padding-right: 32px;
}
.__ag__conftitle__ {
  flex: 1;
  height: 72px;
  flex-direction: row;
  align-items: center;
  border-bottom-width: 1wx;
  border-bottom-style: solid;
  border-bottom-color: @gray5;
}
.__ag__conftitletext__ {
  flex: 1;
  font-style: normal;
  font-weight: 600;
  font-size: 13wx;
  color: @blue4;
}
.__ag__conftext__ {
  flex: 1;
  lines: 1;
  text-overflow: ellipsis;
  font-style: normal;
  font-weight: 400;
  font-size: 12wx;
  color: @black;
}
.__ag__confscore__ {
  flex: 1;
  flex-direction: row;
  align-items: center;
}
.__ag__saishi__ {
  flex: 0.7;
}
.__ag__confscoretext__ {
  font-style: normal;
  font-weight: 400;
  font-size: 12wx;
  color: @black;
  padding: 8px;
  padding-bottom: 1px;
  padding-top: 1px;
  border-radius: 4px;
}
.__ag__confscoreg__ {
  font-style: normal;
  font-weight: 400;
  font-size: 12wx;
  color: @black;
}
.__ag__shu__ {
  background-color: @gray11;
  color: @white;
}
.__ag__ying__ {
  background-color: @green4;
  color: @white;
}
.__ag__confscorediv__ {
  flex-direction: row;
  align-items: center;
  padding: 8px;
  padding-top: 1px;
  padding-bottom: 1px;
  border-radius: 4px;
}
.__ag__ping__ {
  background-color: @blue4;
}
.__ag__pingtext__ {
  color: @white;
}
</style>
