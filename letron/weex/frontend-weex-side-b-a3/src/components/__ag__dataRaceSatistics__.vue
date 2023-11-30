<template>
  <div class="__ag__satistics__main__">
    <div class="__satistics_item__" v-for="item in listMatch" :key="item.id">
      <div class="__satistics_score__">
        <text class="__score_text__ __score_text_first__">{{
          item.a || 0
        }}</text>
      </div>
      <div class="__satistics_progress__ __satistics_progress_first__">
        <div class="__progress_box__" :style="{ flex: '.' + item.pa }"></div>
      </div>
      <text class="__satistics_title__">{{ item.b }}</text>
      <div class="__satistics_progress__">
        <div
          class="__progress_box__ __progress_box_end__"
          :style="{ flex: '.' + item.pc }"
        ></div>
      </div>
      <div class="__satistics_score__">
        <text class="__score_text__">{{ item.c || 0 }}</text>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    listMatchDetail: {
      type: Array,
      default: function () {
        return []
      },
    },
  },
  data() {
    return {
      listMatch: [],
    }
  },
  watch: {
    listMatchDetail(l) {
      this.listMatch = l
    },
  },
  mounted() {
    this.listMatch = this.listMatchDetail
  },
}
</script>

<style scoped lang="less">
@import "../style/theme.less";
.__ag__score__main__ {
  width: 750px;
}
.__satistics_item__ {
  padding-left: 16wx;
  padding-right: 16wx;
  display: flex;
  flex-direction: row;
  height: 36wx;
  align-items: center;
}
.__satistics_score__ {
  flex: 0.5;
}
.__score_text__ {
  flex: 1;
  font-style: normal;
  font-weight: bold;
  font-size: 15wx;
  color: @black;
  text-align: right;
  line-height: 36wx;
}
.__score_text_first__ {
  text-align: left;
}
.__satistics_title__ {
  flex: 1;
  text-align: center;
  font-style: normal;
  font-weight: normal;
  font-size: 13wx;
  color: @black;
  margin-left: 10wx;
  margin-right: 10wx;
}
.__satistics_progress__ {
  flex: 1;
  height: 4wx;
  background-color: @black10;
  border-radius: 4wx;
  flex-direction: row;
  justify-content: flex-start;
}
.__satistics_progress_first__ {
  justify-content: flex-end;
}
.__progress_box__ {
  height: 4wx;
  background-color: @blue7;
  border-radius: 4wx;
}
.__progress_box_end__ {
  background-color: @green4;
}
</style>
