<template>
  <div class="__share_popup__">
    <web
      ref="webview"
      class="__share_popup_content__"
      :class="[ipx ? '__share_popup_ipx_content__' : '']"
      :src="url"
      @pagestart="onPageStart"
      @pagefinish="onPageFinish"
      @error="onError"
    ></web>
    <div
      class="__bottom_btn__"
      v-if="!isLoading"
      :class="[ipx ? '__bottom_ipx_btn__' : '']"
      @click="__ag__close__"
    >
      <text class="__btn_text__" :class="[ipx ? '' : '__btn_ipx_text__']"
        >取消</text
      >
    </div>
    <div class="__ag__loading__" v-if="isLoading">
      <text class="__ag__loading_text__">加载中...</text>
    </div>
  </div>
</template>
<script>
import util from "./util.js"
export default {
  props: {
    url: {
      type: String,
      default: "",
    },
  },

  data() {
    return {
      isLoading: true,
    }
  },

  computed: {
    ipx() {
      let deviceModel = weex.config.env.deviceModel
      // if(deviceModel == 'x86_64'){
      // 	return false
      // }
      if (deviceModel >= "iPhone10,6") {
        if (deviceModel == "iPhone12,8") {
          return false
        }
        return true
      }
      if (deviceModel == "iPhone10,3") {
        return true
      }

      return false
    },
  },

  mounted() {},

  methods: {
    onPageStart() {},
    onPageFinish() {
      this.isLoading = false
    },
    onError() {},
    __ag__close__() {
      this.$emit("close")
    },
  },
}
</script>
<style lang="less" scoped>
.__share_popup__ {
  width: 750;
  position: fixed;
  top: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.72);
  align-items: center;
}
.__share_popup_content__ {
  width: 750;
  position: absolute;
  top: 0;
  bottom: 0;
  background-color: #ffffff;
  overflow: hidden;
}
.__share_popup_ipx_content__ {
  top: 258px;
}
.__bottom_btn__ {
  position: absolute;
  bottom: 0;
  width: 750px;
  height: 80px;
  background-color: #fff;
  justify-content: center;
}
.__bottom_ipx_btn__ {
  height: 120px;
  padding-bottom: 15px;
}
.__btn_text__ {
  font-style: normal;
  font-weight: 400;
  font-size: 22wx;
  color: #000;
  text-align: center;
}
.__btn_ipx_text__ {
  font-size: 16wx;
}
.__ag__loading__ {
  width: 750px;
  position: absolute;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  top: 0;
  bottom: 0;
}
.__ag__loading_text__ {
  color: #fff;
  font-size: 17wx;
  letter-spacing: 2px;
}
</style>
