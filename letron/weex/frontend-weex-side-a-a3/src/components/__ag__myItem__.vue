<template>
  <div class="__ag__my-item-main__" @click="__ag__goJump__">
    <div class="__ag__my-item-box-lf__" v-if="isIcons">
      <slot></slot>
    </div>
    <div class="__ag__my-item-box-center__">
      <text class="__ag__my-item-box-text__">{{ title }}</text>
      <slot v-if="isImage"></slot>
    </div>
    <div class="__ag__my-item-box-rg__">
      <text style="color: #8c97a5; margin-right: 5wx" v-if="isReftes">0MB</text>
      <text class="iconfont back1-right __ag__item-icon__">&#xec6b;</text>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "",
    },
    isIcons: {
      type: Boolean,
      default: false,
    },
    isImage: {
      type: Boolean,
      default: false,
    },
    isReftes: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {}
  },
  methods: {
    __ag__goJump__() {
      this.$emit("goJump")
    },
  },
}
</script>

<style lang="less">
@import "../style/default.less";

.iconfont {
  font-family: iconfont;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -webkit-text-stroke-width: 0.2px;
  -moz-osx-font-smoothing: grayscale;
  color: rgba(0, 0, 0, 0.4);
}
.__ag__my-item-main__ {
  background-color: @white;
  height: 128px;
  padding-left: 70px;
  border-style: solid;
  flex-direction: row;
  align-items: center;
}
.__ag__my-item-box__ {
  padding-top: 10px;
  height: 100px;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.__ag__my-item-box-text__ {
  font-family: "Source Han Sans SC";
  font-style: normal;
  font-weight: 500;
  font-size: 18wx;
  color: @black;
}
.__ag__my-item-box-center__ {
  margin-left: 38px;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.__ag__my-item-box-lf__ {
  width: 60px;
  height: 60px;
  margin-right: 10px;
}
.__ag__my-item-box-center__ {
  flex: 1;
  font-style: normal;
  font-weight: normal;
  font-size: 34px;
  /* color: @black; */
}
.__ag__my-item-box-rg__ {
  width: 148px;
  height: 48px;
  margin-right: 60px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
}
.__ag__item-icon__ {
  font-size: 25wx;
  color: @primary;
}
</style>
