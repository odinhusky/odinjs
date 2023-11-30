<template>
  <div class="__ag__userInfo-main__">
    <div class="__ag__userInfo-item__">
      <div class="__ag__userInfo-item-image__" v-if="info && info.userType < 3">
        <image
          v-if="info && info.avatar"
          class="__ag__avatar__"
          mode="aspectFill"
          :src="__ag__url__(info.avatar)"
        ></image>
        <text class="__ag__avatar_text__" v-else>{{
          info && info.userNicename && info.userNicename.charAt(0)
        }}</text>
      </div>
      <div class="__ag__userInfo-item-image__" v-else>
        <image
          class="__ag__avatar-user__"
          mode="aspectFill"
          :src="staticPath('notuser.png')"
        ></image>
      </div>

      <div
        class="__ag__userInfo-item-name__"
        v-if="info && info.userType < 3"
        @click="__ag__modifyUserInfo__"
      >
        <text class="__ag__userInfo-item-user-ame__">{{
          info && info.userNicename
        }}</text>
        <text class="__ag__userInfo-item-account__"
          >登录账号: {{ info && info.userLogin | removePrefix }}</text
        >
      </div>
      <div v-else class="__ag__userInfo-item-name__" @click="__ag__goLogin__">
        <text class="__ag__userInfo-item-user-ame__">点击登录</text>
        <text class="__ag__userInfo-item-account__">登录可享更多服务</text>
      </div>
    </div>
    <div
      class="__ag__userInfo-btn__"
      v-if="info && info.userType < 3"
      @click="__ag__modifyUserInfo__"
    >
      <image
        :src="__ag__url__('/static/a3/edit.png')"
        class="__ag__editimg__"
      ></image>
    </div>
    <div class="__ag__userInfo-item-name__" v-else>
      <div
        class="__ag__userInfo-btntext__ __ag__btn_orther__"
        @click="__ag__goLogin__"
      >
        <text class="__ag__modify__text__"> 点击登录</text>
      </div>
    </div>
  </div>
</template>

<script>
import userImg from "./__ag__userImg__.vue"
import agMinix from "./__ag__minix__.js"
import agMinUrl from "./__ag__minurl__.js"
import util from "./util.js"
export default {
  name: "ag-userInfo",
  mixins: [agMinix, agMinUrl],
  components: {
    "user-img": userImg,
  },
  props: {
    info: {
      type: Object,
      default: function () {
        return {}
      },
    },
  },
  data() {
    return {
      util,
    }
  },
  methods: {
    // 跳转登录页面
    __ag__goLogin__() {
      util.getPush("__ag__login__")
    },
    // 跳转个人信息
    __ag__modifyUserInfo__() {
      util.getPush("./__ag__modifyUser__")
    },
  },
  filters: {
    removePrefix(str) {
      if (str && typeof str === "string") {
        return str.indexOf("-") !== -1 ? str.split("-")[1] : str
      } else {
        return ""
      }
    },
  },
}
</script>

<style lang="less">
@import "../style/default.less";

.__ag__modify__text__ {
  color: @primary;
  font-size: 30px;
}
.__ag__userInfo-main__ {
  height: 474px;

  background-color: @white;
}
.__ag__userInfo-item__ {
  justify-content: center;
  align-items: center;
}
.__ag__userInfo-item-image__ {
  width: 130px;
  height: 130px;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: rgba(206, 206, 206, 0.5);
  border-radius: 50wx;
  margin-top: 66px;
}
.__ag__avatar__ {
  width: 130px;
  height: 130px;
}
.__ag__avatar_text__ {
  width: 130px;
  height: 130px;
  color: @black;
  font-size: 25wx;
  text-align: center;
  line-height: 140px;
  border-radius: 50wx;
}
.__ag__avatar-user__ {
  width: 130px;
  height: 130px;
  border-radius: 50wx;
}
.__ag__userInfo-item-name__ {
  text-align: center;
  margin-top: 40px;
  align-items: center;
}
.__ag__userInfo-item-user-ame__ {
  font-family: "PingFang SC";
  font-style: normal;
  font-weight: 500;
  font-size: 22wx;
  line-height: 31wx;
  color: @black;
  white-space: unset;
}
.__ag__userInfo-item-account__ {
  font-family: "Source Han Sans SC";
  font-style: normal;
  font-weight: 400;
  font-size: 12wx;
  line-height: 17wx;
  color: @black;
  white-space: unset;
  margin-top: 15px;
}
.__ag__userInfo-btn__ {
  height: 120px;
  position: absolute;
  top: 70px;
  right: 70px;
}
.__ag__userInfo-btntext__ {
  width: 520px;
  height: 70px;
  align-items: center;
  justify-content: center;
  font-style: normal;
  font-weight: 500;
  font-size: 16wx;
  letter-spacing: 0.05em;
  border-style: solid;
  border-width: 1wx;
  border-color: @primaryLighter;
  color: @primaryDark;
}
.__ag__btn_hb__ {
  border-radius: 21wx;
}
.__ag__btn_orther__ {
  border-radius: 20wx;
}
.__ag__editimg__ {
  width: 48px;
  height: 48px;
}
</style>
