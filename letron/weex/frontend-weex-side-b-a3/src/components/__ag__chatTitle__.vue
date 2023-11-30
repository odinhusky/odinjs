<template>
  <div class="__ag__chattitle__">
    <text class="agiconfont __ag__back__" @click.stop="__ag__onBackPress__"
      >&#xe61d;</text
    >
    <text class="__ag__title__">{{ name }}</text>
    <text
      class="agiconfont __ag__isgroup__"
      v-if="isgroup"
      @click="__ag__goGroup__"
      >&#xe626;</text
    >
  </div>
</template>

<script>
import util from "./util.js"
export default {
  props: {
    name: {
      type: String,
      default: "",
    },
    isgroup: {
      type: Boolean,
      default: false,
    },
    islive: {
      type: Boolean,
      default: false,
    },
    groupId: {
      type: String,
      default: "",
    },
  },
  methods: {
    __ag__onBackPress__() {
      if (this.islive) {
        this.$emit("onBackPress")
        return
      }
      util.pop("chat")
    },
    __ag__goGroup__() {
      let f = {
        groupId: this.groupId,
      }
      util.getPush("__ag__groupList__", f)
    },
  },
}
</script>

<style scoped lang="less">
@import "../style/theme.less";
.__ag__chattitle__ {
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 44wx;
  background-color: @gray8;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: @black10;
  /* padding-right: 20px; */
  /* padding-left: 20px; */
}
.__ag__back__ {
  width: 50px;
  color: @black;
  font-size: 30wx;
}
.__ag__title__ {
  padding-left: 20px;
  padding-right: 20px;
  flex: 1;
  lines: 1;
  text-overflow: ellipsis;
  font-style: normal;
  font-weight: 500;
  font-size: 17wx;
  color: @black90;
  text-align: center;
}
.__ag__isgroup__ {
  width: 50px;
  font-size: 24wx;
  color: @black;
}
</style>
