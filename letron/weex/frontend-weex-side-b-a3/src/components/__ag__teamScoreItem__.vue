<template>
  <div class="__ag__teamscoretitle__">
    <text class="__ag__teamnametext__">{{ item.name }}</text>
    <text class="__ag__teamitemtext__">{{ item.playtime }}</text>
    <text class="__ag__teamitemtext__">{{ item.score }}</text>
    <text class="__ag__teamitemtext__">{{ item.rebound }}</text>
    <text class="__ag__teamitemtext__">{{ item.assist }}</text>
    <text class="__ag__teamitemtext__"
      >{{ item.shootHit }} - {{ item.shoot }}</text
    >
  </div>
</template>

<script>
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
  lines: 1;
  text-overflow: ellipsis;
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
