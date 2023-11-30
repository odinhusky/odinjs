<template>
  <div class="__ag__share__" :class="[ipx ? 'share-ipx' : '']">
    <div class="__ag__shareb__">
      <image
        class="__ag__shareimgb__"
        resize="cover"
        :src="__ag__url__(`static/${env.brand}-share-b.png`)"
      ></image>
      <div class="__ag__sharecontent__">
        <image
          class="__ag__shareimg__"
          v-if="env.brand == 'bl'"
          :src="__ag__url__(`static/${env.brand}-share-1.png`)"
        ></image>
        <image
          class="__ag__shareimg__"
          v-else
          :src="__ag__url__(`static/${env.brand}-share.png`)"
        ></image>
        <div
          class="__ag__shareqr_item__"
          v-if="url"
          :class="[
            env.brand == 'bl' ? '__ag__shareqr_item_bl__' : '',
            env.brand == 'bl' && !ipx ? '__ag__shareqr_item_ipx__' : '',
          ]"
        >
          <web
            ref="webview"
            class="__ag__shareqr__"
            :src="url"
            @pagestart="onPageStart"
            @pagefinish="onPageFinish"
            @error="onError"
          ></web>
          <text class="__ag__shareqr_text__">截图分享给好友</text>
        </div>
      </div>
    </div>
    <div class="__ag__back__" @click="onclose">
      <text class="agiconfont __ag__back_text__">&#xe61d;</text>
    </div>
  </div>
</template>

<script>
import util from "./components/util.js"
import env from "./components/env.js"
import sport from "./components/__ag__sport__.js"
import api from "./components/__ag__sport_api__.js"
import agMinUrl from "./components/__ag__minurl__.js"
export default {
  mixins: [agMinUrl],
  components: {},
  data() {
    return {
      env,
      qrUrl: "",
      url: "",
    }
  },
  computed: {},
  created() {},
  mounted() {
    this.__ag__editQR__()
  },
  methods: {
    onPageStart() {},
    onPageFinish() {
      this.isLoading = false
    },
    onError() {},
    onclose() {
      util.pop()
    },
    async __ag__editQR__() {
      let map = util.getItem("metaDataMap")
      let label = "shareUrl"
      if (!map) {
        await sport.getListMetaData()
      }
      let switchWorldcup = map["switchWorldcup"]
      if (switchWorldcup) {
        label = "downUrl"
      }
      await this.getListMetaData(label)
    },
    getListMetaData(label) {
      api
        .listMetaData({ label })
        .then((resp) => {
          if (resp.data && resp.data.length) {
            let ref = sport.getRef()
            let value = resp.data[0].value
            let q = value.indexOf("?") == -1 ? "?" : "&"
            let url = value + q + "From=" + ref
            this.qrUrl = url
            this.url = "./shareApp.html?qrUrl=" + this.qrUrl
          } else {
            this.getListMetaData("shareUrl")
          }
        })
        .catch((err) => {})
    },
  },
}
</script>

<style lang="less">
@import "./style/theme.less";
.__ag__share__ {
  width: 750px;
  position: fixed;
  top: 0;
  bottom: 0;
  background-color: #fff;
}
.__ag__shareb__ {
  flex: 1;
  position: relative;
}
.__ag__back__ {
  width: 80px;
  height: 80px;
  line-height: 80px;
  margin-right: 15px;
  position: fixed;
  top: 100px;
  left: 20px;
  text-align: center;
}
.__ag__back_text__ {
  color: #fff;
  font-size: 30wx;
  font-weight: bold;
  text-align: center;
  line-height: 80px;
}
.__ag__shareimgb__ {
  flex: 1;
}
.__ag__sharecontent__ {
  position: fixed;
  width: 750px;
  top: 130px;
  bottom: 0;
}
.__ag__shareimg__ {
  flex: 1;
}
.__ag__shareqr_item__ {
  width: 750px;
  position: absolute;
  bottom: 120wx;
  left: 0;
  right: 0;
  justify-content: center;
  align-items: center;
}
.__ag__shareqr_item_bl__ {
  bottom: 308px;
}
.__ag__shareqr_item_ipx__ {
  bottom: 200px;
}
.__ag__shareqr__ {
  width: 360px;
  height: 360px;
}
.__ag__shareqr_text__ {
  color: #fff;
  font-size: 14wx;
  margin-top: 80px;
}
</style>
