<template>
  <div class="__ag__denmu__">
    <text class="agiconfont __ag__danmuclose__" @click="onclose">&#xe615;</text>
    <div class="__ag__denmucontent__" @click="urlTo(item)">
      <text class="__ag__denmutext__">{{ item.danmu }}</text>
      <text class="agiconfont __ag__denmuicon__">&#xe66f;</text>
    </div>
  </div>
</template>

<script>
import sport from "./__ag__sport__.js"
export default {
  props: {
    item: {
      type: Object,
      default: function () {
        return {}
      },
    },
  },
  data() {
    return {}
  },
  methods: {
    urlTo(item) {
      sport.urlTo(item)
    },
    onclose() {
      this.$emit("onclose")
    },
  },
}
</script>

<style scoped lang="less">
@import "../style/theme.less";

.__ag__denmu__ {
  position: fixed;
  width: 750px;
  bottom: 120wx;
  left: 0px;
}
.__ag__denmucontent__ {
  width: 600px;
  /* flex: 1; */
  margin-left: 75px;
  margin-right: 75px;
  background-color: @blue5;
  border: 1px solid;
  border-width: 1px;
  border-style: solid;
  border-color: @blue6;
  border-radius: 4px;
  padding: 15px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.__ag__denmutext__ {
  flex: 1;
  font-style: normal;
  font-weight: 500;
  font-size: 14wx;
  letter-spacing: 0.05em;
  color: @white;
}
.__ag__denmuicon__ {
  flex: 0 0 60px;
  align-items: center;
  justify-content: center;
  font-size: 16wx;
  color: @blue4;
}
.__ag__danmuclose__ {
  position: absolute;
  top: -50px;
  right: 75px;
  font-size: 30wx;
  color: @blue6;
}
</style>
