<template>
  <div class="__ag__schedule_main__">
    <div class="__ag__schedule_content__" v-if="list && list.length > 0">
      <div class="__ag__schedule_item__" v-for="item in list" :key="item.id">
        <div class="__ag__item_left__">
          <div class="__ag__left_time__">
            <text class="__ag__time_t__">{{ formatDate(item.beginTime) }}</text>
            <text class="__ag__time_b__">{{ formatTime(item.beginTime) }}</text>
          </div>
          <text class="__ag__left_schedname__">{{
            item.joinMap.match.nameAbbr || item.matchName
          }}</text>
        </div>
        <div class="__ag__item_rg__">
          <div class="__ag__rg_t__">
            <image
              class="__ag__rg_img__"
              v-if="item.teamFlaga"
              :src="__ag__url__(item.teamFlaga)"
            ></image>
            <text class="__ag__rg_img__ __ag__rg_text__" v-else>{{
              item.teamNamea.charAt(0)
            }}</text>
            <text class="__ag__rg_name__">{{ item.teamNamea }}</text>
          </div>
          <div class="__ag__rg_t__ __ag__rg_b__">
            <image
              class="__ag__rg_img__"
              v-if="item.teamFlagb"
              :src="__ag__url__(item.teamFlagb)"
            ></image>
            <text class="__ag__rg_img__ __ag__rg_text__" v-else>{{
              item.teamNameb.charAt(0)
            }}</text>
            <text class="__ag__rg_name__">{{ item.teamNameb }}</text>
          </div>
        </div>
      </div>
    </div>
    <text
      v-if="!list || list.length <= 0"
      style="
        text-align: center;
        white-space: inherit;
        padding: 20wx;
        font-size: 14wx;
        padding-top: 4wx;
      "
      >暂无信息</text
    >
  </div>
</template>

<script>
import util from "./util.js"
import agMinUrl from "@/components/__ag__minurl__.js"
export default {
  mixins: [agMinUrl],
  props: {
    list: {
      type: Array,
      default: function () {
        return []
      },
    },
  },
  data() {
    return {}
  },
  methods: {
    formatDate(date) {
      return util.formatDate(date)
    },
    formatTime(date) {
      return util.formatTime(date)
    },
  },
}
</script>

<style scoped lang="less">
@import "../style/theme.less";
.__ag__schedule_main__ {
  width: 750px;
  padding-right: 16wx;
  padding-left: 16wx;
  padding-top: 16wx;
}
.__ag__schedule_content__ {
  flex: 1;
}
.__ag__schedule_item__ {
  flex: 1;
  padding-top: 10wx;
  padding-bottom: 10wx;
  padding-left: 9wx;
  padding-right: 9wx;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background-color: @white;
  margin-bottom: 8wx;
  border-radius: 4wx;
}
.__ag__item_left__ {
  flex: 1;
  display: flex;
  flex-direction: row;
}
.__ag__left_time__ {
  flex: 1;
}
.__ag__time_t__ {
  font-style: normal;
  font-weight: 500;
  font-size: 14wx;
  line-height: 15wx;
  color: @black;
  margin-bottom: 5wx;
}
.__ag__time_b__ {
  font-style: normal;
  font-weight: 400;
  font-size: 13wx;
  line-height: 15wx;
  color: @blue4;
}
.__ag__left_schedname__ {
  flex: 1;
  font-style: normal;
  font-weight: 400;
  font-size: 13wx;
  line-height: 15wx;
  color: @black;
}
.__ag__item_rg__ {
  flex: 1;
}
.__ag__rg_t__ {
  flex: 1;
  height: 22wx;
  display: flex;
  flex-direction: row;
  padding-top: 5wx;
  padding-bottom: 5wx;
  align-items: center;
}
.__ag__rg_b__ {
  margin-top: 10wx;
}
.__ag__rg_img__ {
  width: 22wx;
  height: 22wx;
  border-radius: 50wx;
}
.__ag__rg_text__ {
  line-height: 22wx;
  text-align: center;
  border-radius: 4wx;
  text-align: center;
  color: @black60;
  background-color: @gray2;
  font-size: 12wx;
}
.__ag__rg_name__ {
  margin-left: 15wx;
  font-style: normal;
  font-weight: 400;
  font-size: 13wx;
  letter-spacing: 0.05em;
  color: @black;
}
</style>
