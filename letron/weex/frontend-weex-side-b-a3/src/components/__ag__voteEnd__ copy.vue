<template>
  <div class="__ag__voteend__">
    <div class="__ag__voteendtop__">
      <text class="__ag__voteendtoptext__">{{ vote.title }}</text>
      <div class="__ag__voteendtopright__">
        <text class="__ag__voteprogresstext__">{{ vote.countAB }}</text>
        <text class="agiconfont __ag__votecount__">&#xe605;</text>
      </div>
    </div>
    <div class="__ag__votechatoption__">
      <text class="__ag__votechatoptiontext__ optiona">{{ vote.optionA }}</text>
      <text class="__ag__votechatoptiontext__ optionb">{{ vote.optionB }}</text>
    </div>
    <div class="__ag__voteendprogress__">
      <div class="__ag__voteprogressleft__" :style="{ flex: vote.classA }">
        <text class="__ag__voteprogresstext__">{{ vote.countA }}</text>
        <text class="agiconfont __ag__votecount__">&#xe605;</text>
      </div>
      <div class="__ag__voteprogressright__" :style="{ flex: vote.classB }">
        <text class="__ag__voteprogresstext__">{{ vote.countB }}</text>
        <text class="agiconfont __ag__votecount__">&#xe605;</text>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    vote: {
      type: Object,
      default: function () {
        return {}
      },
    },
  },
}
</script>

<style scoped lang="less">
@import "../style/theme.less";
.__ag__voteend__ {
  width: 640px;
  height: 240px;
  background-color: @blue15;
  border-radius: 10px;
  border-width: 1wx;
  border-style: solid;
  border-color: @gray45;
  margin-right: 35px;
  margin-left: 35px;
}
.__ag__voteendtop__ {
  width: 640px;
  height: 70px;
  border-bottom-width: 1wx;
  border-bottom-style: solid;
  border-bottom-color: @gray45;
  padding: 10px;
  padding-top: 0px;
  padding-bottom: 0px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.__ag__voteendtoptext__ {
  flex: 1;
  color: @gray46;
  lines: 1;
  text-overflow: ellipsis;
  font-size: 20wx;
}
.__ag__voteendtopright__ {
  flex: 0 0 70px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.__ag__voteprogresstext__ {
  color: @gray46;
  font-size: 20wx;
  margin-right: 5px;
}
.__ag__votecount__ {
  color: @gray46;
  font-size: 20wx;
}
.__ag__votechatoption__ {
  height: 80px;
  padding: 10px;
  padding-top: 0px;
  padding-bottom: 0px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.__ag__votechatoptiontext__ {
  font-size: 13wx;
}
.optiona {
  color: @orange3;
}
.optionb {
  color: @blue16;
}
.__ag__voteendprogress__ {
  flex: 1;
  height: 60px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 10px;
  padding-top: 0px;
  padding-bottom: 0px;
}
.__ag__voteprogressleft__ {
  flex: 0.5;
  height: 45wx;
  background-color: @orange3;
  display: flex;
  flex-direction: row;
  border-top-left-radius: 15wx;
  border-bottom-left-radius: 15wx;
  padding-left: 20wx;
  /* justify-content: center; */
  align-items: center;
}
.__ag__voteprogressright__ {
  flex: 0.5;
  height: 45wx;
  background-image: linear-gradient(to right, @blue16, @blue17);
  display: flex;
  flex-direction: row;
  border-top-right-radius: 15wx;
  border-bottom-right-radius: 15wx;
  padding-right: 20wx;
  /* justify-content: center; */
  justify-content: flex-end;
  align-items: center;
}
</style>
