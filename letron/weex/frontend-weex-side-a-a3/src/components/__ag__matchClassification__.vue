<template>
  <div class="__ag__indexheader__">
    <div
      class="__ag__indexheader__in__"
      :class="[ipx ? '__ag__indexheader_ipx__' : '']"
    >
      <div
        :key="item.id"
        v-for="item in list"
        @click="$emit('changeClass', item)"
        :class="[item.id == scheduleClassId ? '__ag__selected__' : '']"
        class="__ag__indexheader__item__"
        v-if="item.name != '世界杯'"
      >
        <div class="__ag__indexheader__cont__">
          <text
            class="__ag__headertext__"
            :class="[item.id == scheduleClassId ? '__ag__selected__' : '']"
            >{{ item.name }}</text
          >
          <text
            class="__ag__classbottom__"
            :class="[
              item.id == scheduleClassId ? '__ag__selectedbottom__' : '',
              item.id != scheduleClassId && ipx
                ? '__ag__classbottom_ipx__'
                : '',
            ]"
          ></text>
        </div>
      </div>
    </div>
    <ag-mix />
  </div>
</template>

<script>
import agMinix from "./__ag__minix__.js"
import env from "./env.js"
export default {
  props: {
    list: {
      type: Array,
      default: function () {
        return []
      },
    },
    scheduleClassId: {
      type: Number,
      default: 1,
    },
  },
  mixins: [agMinix], // 使用mixin
  data() {
    return {
      env,
    }
  },
}
</script>

<style lang="less" scoped>
@import "../style/default.less";
.__ag__indexheader__ {
  width: 750px;
  height: 50wx;
}
.__ag__indexheader__in__ {
  width: 750px;
  height: 40wx;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  // background-image: linear-gradient(to bottom, #fdc501, #fdc501);
  background-color: @primary;
  padding-bottom: 35px;
}
.__ag__indexheader_ipx__ {
  // background-image: linear-gradient(to bottom, #fd9b3a, #fd9b3a);
  background-color: @primary;
  padding-bottom: 30px;
}
.__ag__indexheader__item__ {
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.__ag__indexheader__cont__ {
  width: 35wx;
  display: flex;
  justify-content: center;
}
.__ag__headertext__ {
  height: 35wx;
  line-height: 35wx;
  font-style: normal;
  text-align: center;
  font-weight: 500;
  font-size: 14wx;
  letter-spacing: 0.05em;
  color: @white;
}
// 所有類別 underline 的設定
.__ag__classbottom__ {
  width: 35wx;
  height: 4wx;
  border-style: solid;
  border-width: 4px;
  border-color: @primary;
}
.__ag__classbottom_ipx__ {
  border-color: @primary;
}
// 被選中的類別 underline 的底色
.__ag__selectedbottom__ {
  border-color: @white;
}
.__ag__selected__ {
  font-size: 16wx;
  text-align: center;
  letter-spacing: 0.05em;
  color: @white;
}
.__ag__selected_hb__ {
  font-size: 16wx;
  text-align: center;
  letter-spacing: 0.05em;
  color: @white;
}
</style>
