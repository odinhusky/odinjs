<template>
  <div class="__ag__recordtitle__" :class="[isBottom ? 'title-bottom' : '']">
    <text class="__ag__recordtitletext__">{{ name }}</text>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: "",
    },
    isBottom: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="less" scoped>
@import "../style/theme.less";
.__ag__recordtitle__ {
  height: 80px;
  width: 750px;
  padding: 32px;
  padding-top: 20px;
  padding-bottom: 20px;
}
.__ag__recordtitletext__ {
  font-style: normal;
  font-weight: 600;
  font-size: 15wx;
  color: @black;
}
.title-bottom {
  border-bottom-style: solid;
  border-bottom-width: 1wx;
  border-bottom-color: @black10;
}
</style>
