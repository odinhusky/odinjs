<template>
  <div class="__ag__follow-main__">
    <ag-hbtitle :isback="true" title="我的关注"></ag-hbtitle>
    <scroller
      class="__ag__follow-main-content__"
      show-scrollbar="false"
      :class="[ipx ? 'about-ipx' : '']"
      v-if="followList.length > 0"
    >
      <div
        class="__ag__follow-item__"
        v-for="item in followList"
        :key="item.id"
      >
        <div
          class="__ag__avatar-box__"
          :class="[item.joinMap.streamer.avatar ? '' : 'grayground']"
        >
          <image
            :src="__ag__url__(item.joinMap.streamer.avatar)"
            class="__ag__avatar-img__"
            v-if="item.joinMap.streamer.avatar"
          ></image>
          <text class="__ag__firststr__" v-else>{{
            item.joinMap.streamer.userNicename.slice(0, 1)
          }}</text>
        </div>
        <div class="__ag__info-box__">
          <text class="__ag__upname__">{{
            item.joinMap.streamer.userNicename
          }}</text>
          <div class="__ag__follow-num-box__">
            <!-- <text>icon</text> -->
            <text class="iconfont __ag__like__">&#xe700;</text>
            <text class="__ag__follownum-text__"></text>
            <!-- {{ag__util__.numberReadable(item.score)}} -->
          </div>
        </div>
        <div
          class="__ag__follow-button__"
          @click="cancelFollow(item)"
          :class="[item.status == 1 ? '__ag__followed__' : '']"
        >
          <text class="__ag__folowedtext__" v-if="item.status == 1"
            >已关注</text
          >
          <text class="__ag__follow-button-text__" v-else>关注</text>
        </div>
      </div>
    </scroller>

    <div
      class="__ag__follow-main-content__"
      :class="[ipx ? 'about-ipx' : '']"
      v-else
    >
      <div class="__ag__noresult__">
        <text>您还没有关注主播</text>
      </div>
    </div>
  </div>
</template>

<script>
import ag__sport__ from "./components/__ag__sport__.js"
import a__ag__env__ from "./components/env.js"
import ag__util__ from "./components/util.js"
import agMinix from "./components/__ag__minix__.js"

import HbTitle from "./components/__ag__headTop__.vue"
import agMinUrl from "./components/__ag__minurl__.js"
import module from "./components/__ag__module__.js"

let sis = undefined
const clipboard = weex.requireModule("clipboard")
export default {
  mixins: [agMinix, agMinUrl], // 使用mixin
  components: {
    "ag-hbtitle": HbTitle,
  },
  data() {
    return {
      a__ag__env__,
      ag__clickTime__: 0,
      followList: [],
    }
  },
  async mounted() {
    await this.getFollow()
  },

  methods: {
    async cancelFollow(item) {
      if (item.status == 1) {
        try {
          let result = await this.__ag__editFollowCancel__({ id: item.id })

          if (result.success == true) {
            this.followList.find((obj) => {
              if (obj.id == item.id) {
                obj.status = 0
              }
            })
            ag__util__.message("已取消关注")
          }
        } catch (err) {
          ag__util__.message("操作失败")
        }
      } else {
        try {
          let result = await this.__ag__editFollow__({
            streamerId: item.streamerId,
          })
          if (result.success == true) {
            this.followList.find((obj) => {
              if (obj.id == item.id) {
                obj.status = 1
              }
            })
            ag__util__.message("已关注")
          }
        } catch (err) {
          ag__util__.message("操作失败")
        }
      }
    },
    async getFollow() {
      let l = await this.__ag__listFollow__({ status: 1 })
      this.followList = l.data
    },
    __ag__goJump__(n) {
      if (n == 0) {
        ag__sport__.goPolicy(this)
        return
      }
      if (n == 1) {
        ag__sport__.goAgreement(this)
        return
      }
    },
  },
}
</script>

<style lang="less">
@import "./style/default.less";

.iconfont {
  font-family: iconfont;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -webkit-text-stroke-width: 0.2px;
  -moz-osx-font-smoothing: grayscale;
}
.__ag__follow-main__ {
  width: @fullWidth;
  background-color: @white;
}
.__ag__follow-main-content__ {
  position: fixed;
  top: @contentOriginalPositionTop;
  bottom: 0px;
  width: @fullWidth;
  border-top-left-radius: @contentBorderRadius;
  border-top-right-radius: @contentBorderRadius;
  background-color: @white;
  overflow: hidden;
}
.about-ipx {
  top: @ipxPositionTop;
}
.__ag__follow-item__ {
  width: @fullWidth;
  height: 168px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-bottom-style: solid;
  border-bottom-width: 1px;
  border-bottom-color: @border;
}
.__ag__about-logo__ {
  flex: 1 1 280px;
  width: 280px;
  height: 220px;
  // border-radius: 50%;
  overflow: hidden;
  direction: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 10px;
  margin-bottom: 24px;
  padding-top: 40px;
}
.__ag__logo__ {
  width: 280px;
  height: 80px;
}
.__ag__logohb__ {
  width: 150px;
  height: 180px;
}
.__ag__about-title__ {
  flex: 1 1 30px;
  width: 200px;
  text-align: center;
  font-style: normal;
  font-weight: 500;
  font-size: 30px;
  line-height: 40px;
  letter-spacing: 0.05em;
}
.__ag__about-version__ {
  font-family: "Futura Std";
  font-style: normal;
  font-weight: 650;
  font-size: 18wx;
  line-height: 20wx;
  text-align: center;
  color: @primary;
  letter-spacing: 0.05em;
}
.__ag__border__ {
  border-bottom-style: solid;
  border-bottom-width: 2px;
  border-bottom-color: @border;
}
.__ag__avatar-img__ {
  height: 108px;
  width: 108px;
  border-radius: 50%;
}
.__ag__follow-button__ {
  flex: 1;
  width: 140px;
  height: 52px;
  background-color: @primary;
  border-radius: 10px;
  margin-right: 48px;
  color: @white;
}
.__ag__followed__ {
  background-image: unset;
  background-color: @primaryLighter;
  color: @primaryDark;
  align-items: center;
}
.__ag__follow-button-text__ {
  font-family: "PingFang SC";
  font-style: normal;
  font-weight: 500;
  font-size: 12wx;
  line-height: 52px;
  color: @white;
  text-align: center;
}
.__ag__avatar-box__ {
  // flex:1;
  margin-left: 52px;

  min-height: 108px;
  min-width: 108px;
  border-radius: 50%;
  justify-content: center;
  margin-right: 16px;
}
.grayground {
  background-color: @avatarGray;
}
.__ag__firststr__ {
  font-size: 40px;
  text-align: center;
}
.__ag__info-box__ {
  justify-content: center;
  flex: 3;
}
.__ag__follownum-text__ {
  font-family: "PingFang SC";
  font-style: normal;
  font-weight: 400;
  font-size: 12wx;
  line-height: 17wx;
  line-height: 17wx;
  color: @black;
  margin-left: 12px;
}
.__ag__upname__ {
  font-family: "Futura Std";
  font-style: normal;
  font-weight: 400;
  font-size: 16wx;
  line-height: 19wx;
  color: @black;
}
.__ag__follow-num-box__ {
  height: 34px;
  margin-top: 12px;
  flex-direction: row;
  align-items: center;
}
.__ag__like__ {
  font-size: 32px;
  color: @red;
}
.__ag__folowedtext__ {
  font-family: "PingFang SC";
  font-style: normal;
  font-weight: 500;
  font-size: 12wx;
  line-height: 52px;
  color: @primary;
}
.__ag__noresult__ {
  align-items: center;
  padding-top: 200px;
}
</style>
