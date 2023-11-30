<template>
  <div class="__ag__activity__">
    <image :src="handleImgPath('lbg.png')" class="__ag__bg_image__" />
    <div class="__ag__activite_content__">
      <div class="__ag__activity_title__">
        <div class="__ag__activity_lf__" @click="onNavback">
          <text class="agiconfont __ag__back__">&#xe61d;</text>
        </div>
        <div class="__ag__activity_cen__">
          <text class="__ag__cen_text__">幸运大抽奖</text>
        </div>
        <div class="__ag__activity_rg__"></div>
      </div>
      <div class="__ag__activite_contianer__">
        <div class="__ag__activite_box__">
          <div class="activity-title">
            <div class="ti-lf">
              <image :src="handleImgPath('ve.png')" class="vector" />
              <image :src="handleImgPath('ve.png')" class="vector-tow" />
            </div>
            <text class="ti-cen">活动规则</text>
            <div class="ti-rg">
              <image :src="handleImgPath('ve.png')" class="vectorg-tow" />
              <image :src="handleImgPath('ve.png')" class="vector" />
            </div>
          </div>
          <text class="activity-tips"
            >活动期间，同一用户每天可通过做任务获得抽奖机会，每次抽奖机会将消耗1次抽奖次数，随机出奖，抽奖次数一旦消耗不支持退回。</text
          >
          <div class="tip-box">
            <text class="tips-title">活动时间</text>
            <div class="tips-content">
              <text class="tips-text">即日起-2022年12月18日</text>
            </div>
          </div>
          <div class="tip-box">
            <text class="tips-title">奖品</text>
            <div class="tips-content">
              <text class="tips-text">（1）苹果手机 iPhone 14</text>
              <text class="tips-text">（2）苹果耳机 AirPods</text>
              <text class="tips-text">（3）苹果手表 Apple Watch</text>
              <text class="tips-text">（4）世界杯竞彩18元现金</text>
              <text class="tips-text">（5）世界杯竞彩58元现金</text>
              <text class="tips-text">（6）世界杯竞彩98元现金</text>
              <text class="tips-text">（7）世界杯队伍自选球衣</text>
              <text class="tips-text">（8）世界杯足球</text>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import agMinUrl from "./components/__ag__minurl__.js"
import agMinix from "./components/__ag__minix__.js"
import util from "./components/util.js"
export default {
  mixins: [agMinix, agMinUrl], // 使用mixin
  components: {},
  data() {
    return {}
  },
  created() {},
  mounted() {},
  methods: {
    onNavback() {
      util.pop()
    },
  },
}
</script>

<style lang="less" scoped>
@import "./style/theme.less";
.__ag__activity__ {
  width: 750px;
  position: fixed;
  top: 0;
  bottom: 0;
  background-color: @white;
}
.__ag__bg_image__ {
  width: 750px;
  position: absolute;
  top: 78px;
  right: 0;
  bottom: 0;
  left: 0;
}
.__ag__activite_content__ {
  width: 750px;
  padding-left: 16px;
  padding-right: 16px;
  align-items: center;
  padding-bottom: 68px;
  position: absolute;
  top: 78px;
  bottom: 0;
}
.__ag__activity_title__ {
  width: 700px;
  height: 80px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  color: @white;
  margin-top: 17px;
  padding-left: 9px;
  padding-right: 9px;
}
.__ag__activity_lf__ {
  width: 120px;
  height: 80px;
  display: flex;
  justify-content: center;
}
.__ag__back__ {
  font-size: 25wx;
  color: @white;
}
.__ag__activity_cen__ {
  flex: 1;
}
.__ag__cen_text__ {
  font-style: normal;
  font-weight: 600;
  font-size: 25wx;
  letter-spacing: 0.7px;
  text-align: center;
  color: @white;
}
.__ag__activity_rg__ {
  width: 120px;
  flex-direction: row;
  justify-content: flex-end;
}
.__ag__rg_text__ {
  font-style: normal;
  font-weight: 500;
  font-size: 14wx;
  letter-spacing: 0.7px;
  color: @white;
  margin-left: 3px;
}
.__ag__activite_contianer__ {
  position: absolute;
  top: 120px;
  bottom: 0;
  align-items: center;
  // justify-content: center;
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 20px;
}
.__ag__activite_box__ {
  width: 718px;
  background-color: @red6;
  border-radius: 10px;
  align-items: flex-start;
  padding: 20px;
  padding-top: 40px;
  padding-bottom: 40px;
}
.activity-title {
  width: 718px;
  display: flex;
  flex-direction: row;
  height: 60px;
  align-items: center;
  justify-content: center;
}
.ti-lf {
  flex: 0.5;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  padding-right: 15px;
}
.vector {
  width: 16px;
  height: 16px;
}
.vector-tow {
  width: 32px;
  height: 32px;
  margin-left: 32px;
}
.vectorg-tow {
  width: 32px;
  height: 32px;
  margin-right: 32px;
}
.ti-cen {
  padding-left: 32px;
  padding-right: 32px;
  text-align: center;
  font-style: normal;
  font-weight: 400;
  font-size: 20wx;
  letter-spacing: 0.2em;
  color: @blue18;
  text-shadow: 2px 2px 2px @black25;
}
.ti-rg {
  flex: 0.5;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding-left: 15px;
}
.activity-tips {
  padding-top: 24px;
  font-family: "PingFang SC";
  font-style: normal;
  font-weight: 500;
  font-size: 12wx;
  line-height: 40px;
  letter-spacing: 0.01em;
  color: @white;
}
.tip-box {
  padding-top: 60px;
}
.tips-title {
  font-family: "PingFang SC";
  font-style: normal;
  font-weight: 500;
  font-size: 16wx;
  line-height: 44px;
  letter-spacing: 0.06em;
  color: @blue18;
}
.tips-text {
  font-family: "PingFang SC";
  font-style: normal;
  font-weight: 400;
  font-size: 12wx;
  line-height: 34px;
  letter-spacing: 0.01em;
  color: @white;
}
.tips-content {
  padding-top: 10px;
}
</style>
