<template>
  <div
    class="__ag__modify-user-mian__"
    :class="[ipx ? 'user-ipx' : '']"
    @click="__ag__clickLive__"
  >
    <ag-hbtitle :isback="true" title="编辑个人档案"></ag-hbtitle>
    <text
      class="__ag__modify-finsh__"
      :class="[ipx ? 'finsh-ipx' : '']"
      @click.stop="__ag__modifyFinsh__"
      >完成</text
    >
    <div class="__ag__modify-user-content__" v-if="a__ag__userInfo__">
      <div class="__ag__modify-user-img__" @click="uploadImage">
        <image
          v-if="a__ag__userInfo__ && a__ag__userInfo__.avatar"
          class="__ag__upinfotitleimg__"
          mode="aspectFill"
          :src="__ag__url__(this.a__ag__userInfo__.avatar)"
        ></image>
        <text v-else class="info-text">{{
          a__ag__userInfo__ &&
          a__ag__userInfo__.userNicename &&
          a__ag__userInfo__.userNicename.charAt(0)
        }}</text>
        <text class="__ag__modify-text__">更换大头贴照</text>
      </div>
      <div class="__ag__modify-user-item__">
        <text class="__ag__modify-user-text__">昵称</text>
        <input
          type="text"
          ref="inputref"
          :hideDoneButton="true"
          class="__ag__modify-input__"
          placeholder="请输入昵称"
          v-model="a__ag__userInfo__.userNicename"
        />
      </div>
      <div
        class="__ag__modify-user-bio__"
        v-if="a__ag__userInfo__.userType == 1"
      >
        <text class="__ag__modify-user-text__">主播简介</text>
        <textarea
          type="text"
          class="__ag__modify-textarea__"
          placeholder="主播简介放这里，最多不能超过40個字。"
          v-model="a__ag__userInfo__.bio"
          row="2"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script>
import agMinix from "./components/__ag__minix__.js"
import HbTitle from "./components/__ag__headTop__.vue"
import agMinUrl from "./components/__ag__minurl__.js"
import __ag__sport__ from "./components/__ag__sport__.js"
import __ag__sportApi__ from "./components/__ag__sport_api__.js"
import util from "./components/util.js"
import bc from "./components/__ag__bc__.js"

import { get } from "lodash"

const thisFileName = "__ag__modifyUser__"

export default {
  mixins: [agMinix, agMinUrl],
  components: {
    "ag-hbtitle": HbTitle,
  },
  data() {
    return {
      a__ag__userInfo__: {},
    }
  },
  computed: {
    avatar() {
      return this.a__ag__userInfo__.avatar
    },
  },
  destroyed() {
    bc.postMessage("afreshUser")
  },
  methods: {
    async __ag__loadData__() {
      this.a__ag__userInfo__ = util.getItem("user")
      let that = this

      const imgurl = new BroadcastChannel("imgurl")
      imgurl.onmessage = function (event) {
        that.chooseImage(event.data)
      }

      const imgsuccess = new BroadcastChannel("imgsuccess")
      imgsuccess.onmessage = function (event) {
        const data = get(event, "data.data", event.data)

        that.chooseImage(data)
      }
    },
    __ag__clickLive__() {
      let ipt = this.$refs.inputref
      if (ipt) {
        ipt.blur()
      }
    },
    async __ag__modifyFinsh__() {
      let f = {}
      if (!this.a__ag__userInfo__.userNicename) {
        util.message("昵称不能为空")
        return
      }
      if (
        this.a__ag__userInfo__.avatar &&
        this.a__ag__userInfo__.avatar.indexOf("data:image/") == 0
      ) {
        util.message("图片上传中...")
        return
      }
      f.nicename = this.a__ag__userInfo__.userNicename
      f.avatar = this.a__ag__userInfo__.avatar
      if (this.a__ag__userInfo__.userType == 1) {
        if (!this.a__ag__userInfo__.bio) {
          util.message("主播简介不能为空")
          return
        }
        f.bio = this.a__ag__userInfo__.bio
      }
      try {
        let resp = await __ag__sportApi__.editUsers(f)
        if (resp.success) {
          let data = this.a__ag__userInfo__
          util.setItem("user", data)
          this.__ag__clickLive__()
          // this.__ag__loadData__()
          util.message(resp.message)
        }
      } catch (err) {
        util.message(err.message)
      }
    },
    uploadImage() {
      let options = {
        width: 300,
        height: 300,
        includeExif: true,
        mediaType: "photo",
        cropping: true,
        includeBase64: true,
        compressImageQuality: 0.8,
        target: thisFileName,
      }

      bc.postMessage("imgcorp", options)
    },
    chooseImage(data) {
      this.a__ag__userInfo__.avatar = data
      if (
        this.a__ag__userInfo__.avatar &&
        this.a__ag__userInfo__.avatar.indexOf("data:image/") == -1
      ) {
        util.message("图片上传成功")
      }
    },
  },
}
</script>

<style scoped lang="less">
@import "./style/theme.less";

.__ag__modify-user-mian__ {
  position: fixed;
  top: 105px;
  bottom: 0;
  width: 750px;
  background-color: #efefef;
}
.user-ipx {
  top: 155px;
}
.__ag__modify-user-content__ {
  padding-top: 30px;
  background-color: #fff;
}
.__ag__modify-user-img__ {
  width: 750px;
  justify-content: center;
  align-items: center;
  padding-top: 20wx;
  padding-bottom: 50wx;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: rgba(37, 41, 50, 0.1);
}
.__ag__upinfotitleimg__ {
  width: 130px;
  height: 130px;
  margin-bottom: 12wx;
}
.info-text {
  width: 60wx;
  height: 60wx;
  border-radius: 50wx;
  text-align: center;
  line-height: 60wx;
  font-size: 20wx;
  color: rgba(0, 0, 0, 0.6);
  background-color: #efefef;
  margin-bottom: 15wx;
}
.__ag__modify-text__ {
  font-style: normal;
  font-weight: normal;
  font-size: 13wx;
  text-align: center;
  color: @main-color;
  opacity: 0.9;
}
.__ag__modify-user-item__ {
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16wx;
  border-bottom-style: solid;
  border-bottom-width: 1px;
  border-bottom-color: rgba(37, 41, 50, 0.1);
  flex-direction: row;
}
.__ag__modify-user-text__ {
  width: 100wx;
  font-style: normal;
  font-weight: 500;
  font-size: 17wx;
  color: #000000;
}
.__ag__modify-input__ {
  flex: 1;
  height: 30wx;
  padding-left: 10wx;
  font-style: normal;
  font-weight: normal;
  font-size: 17wx;
}
.__ag__modify-textarea__ {
  flex: 1;
  padding-left: 10wx;
  font-style: normal;
  font-weight: normal;
  font-size: 17wx;
}
.__ag__modify-user-bio__ {
  width: 750px;
  display: flex;
  flex-direction: row;
  padding-top: 16wx;
  padding-left: 16wx;
  padding-bottom: 16wx;
}
.__ag__modify-finsh__ {
  width: 50wx;
  height: 88px;
  position: fixed;
  top: 20wx;
  right: 0;
  color: @modify-finsh;
  text-align: center;
  font-size: 15wx;
  line-height: 88px;
}
.finsh-ipx {
  top: 84x;
}
</style>
