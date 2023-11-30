<template>
  <div class="__ag__uplive__">
    <ag-hbtitle :isback="true"></ag-hbtitle>
    <ag-title class="__ag__indexagtitle__" name="主播"></ag-title>
    <div class="__ag__uplivecontent__" :class="[ipx ? 'ipx' : '']">
      <anchor-list :isindex="true"></anchor-list>
    </div>
  </div>
</template>

<script>
import agMinix from "./components/__ag__minix__.js"
import HbTitle from "./components/__ag__headTop__.vue"
import anchorlist from "./components/__ag__anchorList__.vue"
import title from "./components/__ag__title__.vue"
export default {
  mixins: [agMinix],
  components: {
    "ag-hbtitle": HbTitle,
    "ag-title": title,
    "anchor-list": anchorlist,
  },
  data() {
    return {}
  },
  computed: {},
  methods: {},
}
</script>

<style lang="less" scoped>
@import "./style/default.less";
.__ag__uplive__ {
  background-color: @anchorBg;
  width: @fullWidth;
  flex-direction: column;
  align-items: center;
}
.__ag__uplivecontent__ {
  width: @fullWidth;
  padding: 16px;
  background-color: @anchorBg;
  position: fixed;
  top: 130wx;
  bottom: 0px;
  z-index: 9;
  flex-direction: column;
  align-items: center;
}
.__ag__refresh__ {
  padding: 60px;
  align-items: center;
  justify-content: center;
}
.__ag__indexagtitle__ {
  margin-bottom: 16px;
  position: fixed;
  top: 100wx;
  bottom: 0px;
  z-index: 9;
  padding-left: 20px;
}
.__ag__refreshtext__ {
  padding-bottom: 40px;
}
.__ag__loading__ {
  color: @black;
}
.ipx {
  bottom: 0px;
  padding-bottom: 34px;
}
</style>
