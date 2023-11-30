<template>
  <div class="__ag__teamscoretitle__">
    <text class="__ag__teamnametext__">球员</text>
    <text class="__ag__teamitemtext__">时间</text>
    <text class="__ag__teamitemtext__">得分</text>
    <text class="__ag__teamitemtext__">篮板</text>
    <text class="__ag__teamitemtext__">助攻</text>
    <text class="__ag__teamitemtext__">投篮</text>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
}
</script>

<style lang="less" scoped>
@import "../style/theme.less";
.__ag__teamscoretitle__ {
  width: 686px;
  height: 72px;
  margin-left: 32px;
  margin-right: 32px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-bottom-style: solid;
  border-bottom-width: 1wx;
  border-bottom-color: @gray5;
}
.__ag__teamnametext__ {
  flex: 1;
  font-style: normal;
  font-weight: 600;
  font-size: 13wx;
  color: @blue4;
}
.__ag__teamitemtext__ {
  flex: 0.5;
  text-align: center;
  font-style: normal;
  font-weight: 600;
  font-size: 13wx;
  color: @blue4;
}
</style>
