<template>
  <div class="__ag__title__">
    <div class="__ag__titleleft__" v-if="!switchWorldcup">
      <image
        :src="handleImgPath(`rmbs.png`)"
        mode="aspectFit"
        v-if="id == 1"
        :class="[
          '__ag__newsimg_' + id + '_old__',
          '__ag__newsimg_' + env.brand + '_' + id + '__',
        ]"
      ></image>
      <image
        :src="handleImgPath(`rmzb.png`)"
        mode="aspectFit"
        v-if="id == 2"
        :class="[
          '__ag__newsimg_' + id + '_old__',
          '__ag__newsimg_' + env.brand + '_' + id + '__',
        ]"
      ></image>
      <image
        :src="handleImgPath(`rmzbo.png`)"
        mode="aspectFit"
        v-if="id == 3"
        :class="[
          '__ag__newsimg_' + id + '_old__',
          '__ag__newsimg_' + env.brand + '_' + id + '__',
        ]"
      ></image>
      <image
        :src="handleImgPath(`tuij.png`)"
        mode="aspectFit"
        v-if="id == 4"
        :class="[
          '__ag__newsimg_' + id + '_old__',
          '__ag__newsimg_' + env.brand + '_' + id + '__',
        ]"
      ></image>
      <image
        :src="handleImgPath(`xinw.png`)"
        mode="aspectFit"
        v-if="id == 5"
        :class="[
          '__ag__newsimg_' + id + '_old__',
          '__ag__newsimg_' + env.brand + '_' + id + '__',
        ]"
      ></image>
      <text class="__ag__titlelefttext__">{{ name }}</text>
    </div>

    <!-- 世界杯的圖片都拿掉了，找不到 -->
    <div class="__ag__titleleft__" v-if="switchWorldcup">
      <image
        :src="__ag__url__(`static/shijiebei/${env.brand}-rmbs.png`)"
        v-if="id == 1"
        :class="['__ag__newsimg_' + id + '__']"
      ></image>
      <image
        :src="__ag__url__(`static/shijiebei/${env.brand}-rmzb.png`)"
        v-if="id == 2"
        :class="['__ag__newsimg_' + id + '__']"
      ></image>
      <image
        :src="__ag__url__(`static/shijiebei/${env.brand}-rmzhub.png`)"
        v-if="id == 3"
        :class="['__ag__newsimg_' + id + '__']"
      ></image>
      <image
        :src="__ag__url__(`static/shijiebei/${env.brand}-tj.png`)"
        v-if="id == 4"
        :class="['__ag__newsimg_' + id + '__']"
      ></image>
      <image
        :src="__ag__url__(`static/shijiebei/${env.brand}-xw.png`)"
        v-if="id == 5"
        :class="['__ag__newsimg_' + id + '__']"
      ></image>
      <text class="__ag__titlelefttext__">{{ name }}</text>
    </div>

    <div v-if="isSwitch" class="__ag__titleright__" @click.stop="onclick">
      <text class="__ag__titlerighttext__">更多</text>
      <text class="agiconfont back1-right">&#xec6b;</text>
    </div>

    <!--
		<div v-if="!isSwitch" class="__ag__title_zt__" @click.stop="__ag__goWorld__">
			<text class="__ag__title_zt_text__">世界杯专题页</text>
			<text class="agiconfont back1-zt">&#xec6b;</text>
		</div>
     -->
  </div>
</template>

<script>
import agMinUrl from "./__ag__minurl__.js"
import util from "./util.js"
import env from "./env.js"
export default {
  name: "ag-title",
  mixins: [agMinUrl],
  props: {
    id: {
      type: String,
      default: "0",
    },
    name: {
      type: String,
      default: "",
    },
    isgd: {
      type: Boolean,
      default: false,
    },
    switchWorldcup: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      env,
    }
  },
  computed: {
    isSwitch() {
      if (!this.switchWorldcup) {
        return true
      }
      if (this.switchWorldcup && this.isgd && this.id == 1) {
        return false
      }
      return true
    },
  },
  methods: {
    onclick() {
      this.$emit("onclick")
    },
    __ag__goWorld__() {
      util.getPush("__ag__worldSpecial__")
    },
  },
}
</script>

<style lang="less">
@import "../style/theme.less";

.__ag__title__ {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.__ag__titlelefttext__ {
  font-style: normal;
  font-weight: 600;
  font-size: 20wx;
  color: @black;
  overflow: unset;
}
.__ag__titleright__ {
  height: 25wx;
  box-sizing: border-box;
  border-radius: 28px;
  text-align: center;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-style: solid;
  border-width: 1px;
  padding-left: 15px;
  padding-right: 2px;
  border-color: @primary;
  background-color: @trans;
}
.__ag__titlerighttext__ {
  height: 30wx;
  font-style: normal;
  font-weight: 500;
  font-size: 14wx;
  line-height: 30wx;
  letter-spacing: 0.05em;
  color: @primary;
  overflow: unset;
}
.__ag__title_zt__ {
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: 100px;
  padding-top: 4px;
  padding-right: 8px;
  padding-bottom: 4px;
  padding-left: 14px;
  box-shadow: 2px 4px 2px @red18;
  background-image: linear-gradient(to right, @red19, @red20);
}
.__ag__title_zt_text__ {
  color: @white;
  letter-spacing: 1px;
  font-family: "PingFang SC";
  font-style: normal;
  font-weight: 400;
  font-size: 12wx;
}
.back1-right {
  font-size: 18wx;
  color: @primary;
}
.back1-zt {
  font-size: 18wx;
  color: @white;
}
.__ag__titleleft__ {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 30wx;
}
.__ag__newsimg_1__ {
  width: 50px;
  height: 50px;
  margin-right: 8px;
}
.__ag__newsimg_2__ {
  width: 50px;
  height: 40px;
  margin-right: 12px;
}
.__ag__newsimg_3__ {
  width: 50px;
  height: 50px;
  margin-right: 8px;
}
.__ag__newsimg_4__ {
  width: 50px;
  height: 50px;
  margin-right: 8px;
}
.__ag__newsimg_5__ {
  width: 50px;
  height: 50px;
  margin-right: 8px;
}
.__ag__newsimg_1_old__ {
  width: 34px;
  height: 42px;
  margin-right: 4wx;
  margin-top: 5px;
}
.__ag__newsimg_2_old__ {
  width: 50px;
  height: 50px;
  margin-right: 4wx;
}
.__ag__newsimg_3_old__ {
  width: 50px;
  height: 50px;
  margin-right: 4wx;
  margin-top: 5px;
}
.__ag__newsimg_4_old__ {
  width: 56px;
  height: 52px;
  margin-top: 8px;
}
.__ag__newsimg_5_old__ {
  width: 40px;
  height: 40px;
  margin-right: 4wx;
}
.__ag__newsimg_hb_1__ {
  width: 42px;
  height: 42px;
  margin-right: 4wx;
  margin-top: 5px;
}
.__ag__newsimg_hb_2__ {
  width: 60px;
  height: 60px;
  margin-right: 4wx;
  margin-top: 6px;
}
.__ag__newsimg_hb_3__ {
  width: 50px;
  height: 50px;
  margin-right: 4wx;
  margin-top: 5px;
}
.__ag__newsimg_hb_4__ {
  width: 56px;
  height: 52px;
  margin-top: 2px;
  margin-right: 3px;
}
.__ag__newsimg_hb_5__ {
  width: 50px;
  height: 50px;
  margin-right: 4wx;
  margin-top: 3px;
}
</style>
