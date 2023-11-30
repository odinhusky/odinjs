<template>
  <div class="__ag__indexheader__">
    <div
      class="__ag__indexheader__in__"
      :class="[
        env.brand == 'bl' ? '__ag__indexheader__in_bl__' : '',
        env.brand == 'bbg' ? '__ag__indexheader__in_bbg__' : '',
      ]"
    >
      <div
        :key="item.id"
        v-for="item in list"
        @click="$emit('changeClass', item)"
        :class="[
          item.id == scheduleClassId ? '__ag__selected__' : '',
          item.id == scheduleClassId && item.name == '世界杯'
            ? 'world-select'
            : '',
        ]"
        class="__ag__indexheader__item__"
      >
        <div class="__ag__indexheader__cont__">
          <text
            class="__ag__headertext__"
            :class="[
              item.id == scheduleClassId ? '__ag__selected__' : '',
              item.id == scheduleClassId && item.name == '世界杯'
                ? '__ag__selected_world_name__'
                : '',
            ]"
            >{{ item.name }}</text
          >
          <text
            class="__ag__classbottom__"
            :class="[
              env.brand == 'bl' ? '__ag__classbottom_bl__' : '',
              item.id == scheduleClassId ? '__ag__selectedbottom__' : '',
              item.id == scheduleClassId && item.name == '世界杯'
                ? '__ag__selected_world_bottom__'
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
    return {}
  },
}
</script>

<style scoped lang="less">
@import "../style/theme.less";
.__ag__indexheader__ {
  width: 750px;
  height: 45wx;
}
.__ag__indexheader__in__ {
  width: 750px;
  height: 45wx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  background-color: @gray14;
  padding-bottom: 1wx;
  background-image: linear-gradient(to top, @gray20, @gray21);
}
.__ag__indexheader__in_bl__ {
  background-color: @white;
  background-image: linear-gradient(to top, @white, @white);
}
.__ag__indexheader__in_bbg__ {
  background-color: @white;
  background-image: linear-gradient(to top, @white, @white);
}
.__ag__indexheader__item__ {
  flex: 1;
  font-size: 14px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
}
.__ag__indexheader__cont__ {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
.__ag__headertext__ {
  height: 43wx;
  line-height: 43wx;
  font-style: normal;
  text-align: center;
  font-weight: 500;
  font-size: 14wx;
  letter-spacing: 0.05em;
  color: @black;
}
.__ag__classbottom__ {
  width: 45wx;
  border-style: solid;
  border-width: 2px;
  border-color: @trans;
}
.__ag__classbottom_bl__ {
  border-color: @white;
}
.__ag__selectedbottom__ {
  border-color: @primary;
}
.__ag__selected_world_bottom__ {
  border-color: @red7;
}
.__ag__selected__ {
  flex: 1;
  font-size: 16wx;
  text-align: center;
  letter-spacing: 0.05em;
  color: @primary;
}
.__ag__selected_world_name__ {
  color: @white;
}
.world-select {
  background-color: @red7;
}
</style>
