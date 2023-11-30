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
    <div class="__ag__loading__" v-if="isLoading">
      <text class="__ag__loading_text__">加载中...</text>
    </div>
    <image
      class="__close__image__"
      :class="[ipx ? '__close__image_ipx__' : '']"
      @click="__ag__close__"
      :src="handleImgPath('popup-close.png')"
    ></image>
    <image
      ref="imageref"
      v-if="imgPopupUrl"
      @click.stop="imgsave"
      resize="cover"
      :src="imgPopupUrl"
      class="__ag__imgpopupurl__"
    ></image>
  </div>
</template>

<script>
import agMinUrl from "./__ag__minurl__.js"
import util from "./util.js"
export default {
  mixins: [agMinUrl],
  props: {
    url: {
      type: String,
      default: "",
    },
  },

  data() {
    return {
      isLoading: true,
      imgPopupUrl: "",
    }
  },

  computed: {
    ipx() {
      let deviceModel = weex.config.env.deviceModel
      console.log("ios==", deviceModel)
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
    onPageStart(e) {
      let data = util.getUrlJson(e.url)
      if (data && data.url) {
        this.imgPopupUrl = data.url
        setTimeout(() => {
          this.imgsave()
        }, 500)
      }
    },
    onPageFinish(e) {
      this.isLoading = false
    },
    onError() {},
    __ag__close__() {
      this.$emit("close")
    },
    imgsave() {
      const $img = this.$refs.imageref
      let that = this
      if ($img) {
        $img.save((res) => {
          if (res.success) {
            util.message("保存成功")
          }
        })
      }
    },
  },
}
</script>
<style lang="less" scoped>
@import "../style/theme.less";
.__share_popup__ {
  width: 750;
  position: fixed;
  top: 0;
  bottom: 0;
  background-color: @black70;
  align-items: center;
}
.__share_popup_content__ {
  width: 750;
  position: absolute;
  top: 170px;
  bottom: 0;
  /* background-color:#ffffff; */
  overflow: hidden;
}
.__share_popup_ipx_content__ {
  top: 258px;
  bottom: 34;
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
  color: @white;
  font-size: 17wx;
  letter-spacing: 2px;
}
.__close__image__ {
  width: 60px;
  height: 60px;
  position: absolute;
  top: 100px;
  right: 40px;
}
.__close__image_ipx__ {
  top: 178px;
}
.__ag__imgpopupurl__ {
  width: 750px;
  position: fixed;
  top: 0;
  bottom: 0;
  left: -755px;
}
</style>
