<template>
  <div class="__ag__messageList_wrapper__">
    <scroller
      class="__ag__messageList__"
      :class="[isShowAnchor && topTab == 0 ? '__ag__messageList_anthor__' : '']"
      show-scrollbar="false"
      @scroll="__ag__scroll__"
      @loadmore="__ag__scrollend__"
      v-if="resp.data.list && resp.data.list.length > 0"
    >
      <!-- 直播间公告 -->
      <div class="__ag__sysnotice__" v-if="sysnotices && topTab == 0">
        <text class="__ag__sysnoticetext__">{{ sysnotices }}</text>
      </div>

      <!-- 聊天内容 -->
      <div
        class="__ag__messagecontent__"
        v-for="item in resp.data.list"
        :key="item.id"
        @click="$emit('onClick')"
        :ref="'indicator-' + item.id"
      >
        <!-- <div class="__ag__sysnotice__" v-if="item.type==6"></div> -->

        <!-- 普通公告 -->
        <div
          class="__ag__notice__"
          v-if="
            item.messageType == 1 &&
            item.type == vars.TYPE_NOTICE &&
            item.contentType == 1 &&
            item.content
          "
        >
          <image
            class="__ag__notice_image__"
            :src="__ag__url__('/static/gonggao.png')"
          ></image>
          <text class="__ag__notice_text__">直播公告：</text>
          <text class="__ag__notice_content__">{{ item.content }}</text>
        </div>

        <!-- 定时聊天广告、直播间广告 -->
        <div
          class="__ag__msglink__"
          v-if="
            (item.contentType == 2 && intervalId == item.id && item.isgg) ||
            (item.contentType == 2 && item.type == 4)
          "
        >
          <ag-chatlink
            :n="item"
            :isAnchor="true"
            :upinfo="upinfo"
          ></ag-chatlink>
        </div>

        <!-- 公告 -->
        <div
          class="__ag__msglink__"
          v-if="item.contentType == 2 && !item.isgg && item.type !== 4"
        >
          <ag-chatlink :n="item" :isAnchor="false"></ag-chatlink>
        </div>

        <div
          class="__ag__messagelivechat__"
          v-if="
            (item.messageType == 1 &&
              item.contentType == 1 &&
              item.type == vars.TYPE_NORMAL) ||
            (item.messageType == 1 &&
              item.contentType == 1 &&
              item.type == vars.TYPE_DANMU) ||
            (item.messageType == 1 &&
              item.contentType == 3 &&
              item.type == vars.TYPE_NORMAL)
          "
        >
          <div class="__ag__messagelivecontent__">
            <!-- 主播发送的消息 -->
            <text
              class="__ag__anchor_text__ __ag__anchor_background__"
              v-if="isAnchor(item)"
              >主播</text
            >
            <!-- 助理发送的消息 -->
            <text
              class="__ag__anchor_text__ __ag__assistant_background__"
              v-if="isUpAssistant(item)"
              >助理</text
            >
            <!-- 发送人的名称 -->
            <text
              class="__ag__messagelivename__"
              :class="[
                isAnchor(item) ? '__ag__anchor_name_color__' : '',
                isUpAssistant(item) ? '__ag__assistant_name_color__' : '',
              ]"
              >{{
                item.joinMap && item.joinMap.u && item.joinMap.u.userNicename
              }}：</text
            >

            <ag-msg-rich-text
              :data="item"
              :isAnchor="isAnchor(item)"
              :isUpAssistant="isUpAssistant(item)"
              :userNicename="
                item.joinMap && item.joinMap.u && item.joinMap.u.userNicename
              "
            >
            </ag-msg-rich-text>

            <!-- 图片类型 -->
            <image
              v-if="item.contentType == 3"
              class="__ag__msgusercontent_img__"
              :style="imageStyle(item)"
              ref="images"
              resize="cover"
              :src="__ag__url__(item.content)"
              @load="loadimg($event, item)"
            ></image>

            <div class="json-content" v-if="item.jsonContent">
              <div
                class="__json-content-div__"
                v-for="(ji, index) in item.jsonContent"
                :key="'jc' + item.id + '-' + index"
              >
                <image
                  v-if="ji.type == 'image'"
                  class="__ag__msgusercontentimg__"
                  lazy-load
                  mode="widthFix"
                  :src="__ag__url__(ji.content)"
                ></image>
              </div>
            </div>
          </div>

          <!-- 发送到内容信息 -->
          <div class="json-content" v-if="item.jsonContent">
            <div
              class="__json-content-div__"
              v-for="(ji, index) in item.jsonContent"
              :key="'jc' + item.id + '-' + index"
            >
              <text
                v-if="ji.type == 'text'"
                :class="[
                  isAnchor(item) ? '__ag__anchor_text_color__' : '',
                  isUpAssistant(item) ? '__ag__assistant_text_color__' : '',
                ]"
                class="__ag__messagelivechatcontent__"
                >{{ ji.contents }}</text
              >
              <!-- <image v-if="ji.type=='image'" class="__ag__msgusercontentimg__" 
							lazy-load mode="widthFix" :src="__ag__url__(ji.content)"></image> -->
              <text
                class="__ag__msgusertexthttp__"
                v-if="ji.type == 'http'"
                @click="msgUrlTo(ji.content)"
                >{{ ji.content }}</text
              >
            </div>
          </div>
        </div>
        <!-- <div :ref="'indicator-' + index" class="indicator"></div> -->
      </div>
      <div
        class="__ag__showscrollinfoLive__"
        v-if="a__ag__showscroll__ && !a__isScroll__ && topTab == 0"
        @click="
          a__ag__showscroll__ = fasle
          __ag__goscroll__(resp.data.list.length)
        "
      >
        <text class="__ag__showscrollinfotext__" style="color: #fff"
          >向下滚动查看更多消息</text
        >
      </div>
    </scroller>
    <!-- 主播信息 -->
    <div class="__ag__mesage_anchor__" v-if="isShowAnchor && topTab == 0">
      <text
        class="agiconfont __ag__anchor_close__"
        @click="$emit('anchorClose')"
        >&#xe64b;</text
      >
      <div class="__ag__anchor_item__">
        <div class="__ag__anchor_avatar__">
          <ag-userimg
            class="__ag__upimg__"
            :name="upinfo.userNicename"
            :avatar="upinfo.avatar"
          ></ag-userimg>
        </div>
        <div class="__ag__anchor_content__">
          <text class="__ag__anchor_name__">{{ upinfo.userNicename }}</text>
          <div class="__ag__anchor_scroe__">
            <text class="__ag__scroe_text__">已推荐 {{ total }}次</text>
            <text class="__ag__scroe_text__">准确率 {{ rate }}%</text>
          </div>
        </div>
        <text class="__ag__anchor_btn__" @click="$emit('addFriend')">私聊</text>
      </div>
    </div>

    <!-- 聊天室断开连接提示 -->
    <div class="__ag__socketerror__" v-if="issocket">
      <text class="agiconfont __ag__socketerror_lf__">&#xe631;</text>
      <text class="__ag__socketerrortext__">聊天室已断开,自动重连中...</text>
      <text class="agiconfont __ag__socketerror_icon__">&#xe647;</text>
    </div>
  </div>
</template>

<script>
let modal = weex.requireModule("modal")
import userImg from "./__ag__userImg__.vue"
import util from "./util.js"
import agMinUrl from "./__ag__minurl__.js"
import agMinix from "./__ag__minix__.js"
import sport from "./__ag__sport__.js"
import vars from "./vars.js"
import chatlink from "./__ag__chatLink__.vue"
import msRichText from "./__ag__msRichText__.vue"

let dom = undefined
export default {
  mixins: [agMinix, agMinUrl],
  name: "ag-messageList",
  components: {
    "ag-chatlink": chatlink,
    "ag-userimg": userImg,
    "ag-msg-rich-text": msRichText,
  },
  props: {
    resp: {
      type: Object,
      default: function () {
        return { data: { list: [] } }
      },
    },
    intervalId: {
      type: Number,
      default: 0,
    },
    danmuTiming: {
      type: Object,
      default: function () {
        return {}
      },
    },
    sysnotices: {
      type: String,
      default: "",
    },
    topTab: {
      type: Number,
      default: 0,
    },
    isShowAnchor: {
      type: Boolean,
      default: true,
    },
    upinfo: {
      type: Object,
      default: function () {
        return {}
      },
    },
    uid: {
      type: String,
      default: "",
    },
    ofUpinfo1: {
      type: Object,
      default: function () {
        return {}
      },
    },
    issocket: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      a__ag__showscroll__: false,
      a__isScroll__: true,
      vars,
      util,
      upinfo2: {},
      ofUpinfo2: {},
      isVote: true,
    }
  },
  watch: {
    upinfo(n) {
      this.upinfo2 = n
    },
    ofUpinfo1(n) {
      this.ofUpinfo2 = n
    },
  },
  computed: {
    messageList() {
      if (
        !this.resp ||
        !this.resp.data ||
        !this.resp.data.list ||
        !this.resp.data.list.length
      ) {
        return []
      }
      return this.resp.data.list
    },

    total() {
      if (!this.upinfo) {
        return 0
      }
      let r = this.upinfo.redCount || 0
      let b = this.upinfo.blackCount || 0
      let total = r + b
      if (!total) {
        return 0
      }
      return total
    },
    rate() {
      if (!this.total) {
        return 0
      }
      let rate = (this.upinfo.redCount * 100) / this.total

      rate = Math.floor(rate)
      return rate
    },
  },
  mounted() {
    this.upinfo2 = this.upinfo
    this.ofUpinfo2 = this.ofUpinfo1
  },
  methods: {
    imageStyle(n) {
      let style = { width: n.width || "130px", height: n.height || "130px" }
      return style
    },
    loadimg(e, n) {
      if (e.success) {
        let s = util.reszeliveImage(e.size.naturalWidth, e.size.naturalHeight)
        let w = s.w + "px"
        let h = s.h + "px"
        this.$set(n, "width", w)
        this.$set(n, "height", h)
      }
    },
    isAnchor(item) {
      if (this.upinfo2 && this.upinfo2.id && item && item.senderId) {
        return (
          this.upinfo2.id == item.senderId || this.upinfo2.id == item.receiverId
        )
      }
      return false
    },

    isUpAssistant(item) {
      if (this.ofUpinfo2 && this.ofUpinfo2.assistId && item && item.senderId) {
        return this.ofUpinfo2.assistId == item.senderId
      }

      return false
    },
    msgUrlTo(href) {
      // util.message(href)
      sport.urlTo({ url: href })
    },
    __ag__scroll__(Event) {
      let y = parseInt(Math.abs(Event.contentOffset.y))
      let h = parseInt(Math.abs(Event.contentSize.height))
      let s = h - y
      let p = 1000
      this.a__ag__showscroll__ = s > p
    },
    __ag__scrollend__() {
      this.a__isScroll__ = false
    },
    __ag__goscroll__(length) {
      if (this.a__ag__showscroll__) {
        return
      }
      if (!dom) {
        dom = weex.requireModule("dom")
      }
      let id = this.messageList[length - 1].id
      const indicatorId = "indicator-" + id
      const indicator = this.$refs[indicatorId][0]
      // 滚动到上一条消息的底部
      this.a__isScroll__ = false
      if (indicator) {
        const el = indicator
        dom.scrollToElement(el, {})
      }
    },
  },
}
</script>

<style scoped lang="less">
@import "../style/theme.less";
.__ag__messageList_wrapper__ {
  width: 750px;
  position: absolute;
  top: 0;
  bottom: 90px;
  flex: 1;
  padding: 16px;
  padding-top: 20px;
  padding-bottom: 16wx;
  background-color: #ededed;
}
.__ag__messageList__ {
  flex: 1;
}
.__ag__messageList_anthor__ {
  padding-top: 142px;
}
.__ag__mesage_anchor__ {
  position: absolute;
  top: 32px;
  left: 38px;
  right: 38px;
  width: 674px;
  height: 108px;
  background-color: #ffffff;
  border-style: solid;
  border-width: 1px;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
  border-radius: 12px;
  border-color: @main-color;
  padding-left: 16px;
  padding-right: 16px;
  flex-direction: row;
  align-items: center;
}
.__ag__anchor_close__ {
  width: 36px;
  height: 36px;
  border-radius: 50wx;
  position: absolute;
  right: -20px;
  top: -24px;
  text-align: center;
  line-height: 36px;
  font-size: 14wx;
  color: #fff;
  background-color: @main-color;
}
.__ag__anchor_item__ {
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.__ag__upimg__ {
  width: 88px;
  height: 88px;
}
.__ag__anchor_content__ {
  flex: 1;
  padding-left: 16px;
}
.__ag__anchor_name__ {
  font-style: normal;
  font-weight: 500;
  font-size: 15wx;
  letter-spacing: 0.05em;
  color: #000000;
}
.__ag__anchor_scroe__ {
  flex-direction: row;
  align-items: center;
  margin-top: 3px;
}
.__ag__scroe_text__ {
  font-style: normal;
  font-weight: 500;
  font-size: 13wx;
  color: #acacac;
  margin-right: 16px;
}
.__ag__anchor_btn__ {
  width: 128px;
  height: 52px;
  line-height: 52px;
  text-align: center;
  border-radius: 8px;
  font-style: normal;
  font-weight: 600;
  font-size: 13wx;
  color: #ffffff;
  margin-right: 16px;
  background-color: @main-color;
}
.__ag__messagecontent__ {
  width: 718px;
}
.__ag__sysnotice__ {
  background-color: #fff;
  border-radius: 5px;
  color: #999;
  margin: 10px;
  padding: 10px;
  margin-bottom: 16px;
}
.__ag__sysnoticetext__ {
  color: #999;
  font-size: 13wx;
}
.__ag__messagelivechat__ {
  width: 718px;
  margin-bottom: 30px;
}
.__ag__messagelivecontent__ {
  width: 718px;
  display: flex;
  flex-direction: row;
}
.__ag__anchor_text__ {
  width: 72px;
  height: 32px;
  line-height: 32px;
  border-radius: 20px;
  font-style: normal;
  font-weight: 500;
  font-size: 9wx;
  letter-spacing: 0.05em;
  text-align: center;
  color: #ffffff;
  margin-right: 6px;
}
.json-content {
  /* flex: 1; */
  /**/
}
.__json-content-div__ {
  /* flex: 1; */
  /* background-color: red; */
}
.__ag__messagelivename__ {
  font-size: 13wx;
  color: rgba(0, 0, 0, 0.3);
  white-space: pre-wrap;
  font-weight: bold;
  line-height: 30px;
}
.__ag__messagelivechatcontent__ {
  font-size: 13wx;
  color: #404040;
  line-height: 40px;
  /* width: 500px; */
}
.__ag__msgusertexthttp__ {
  white-space: pre-wrap;
  word-break: break-all;
  word-wrap: break-word;
  flex: 1;
  font-size: 13wx;
  line-height: 40px;
}
.__ag__msgusercontentimg__ {
  width: 66wx;
  height: 66wx;
  border-radius: 4px;
}
.__ag__msgusercontent_img__ {
  border-radius: 4px;
}
.__ag__showscrollinfoLive__ {
  position: fixed;
  bottom: 130px;
  width: 350px;
  left: 200px;
  right: 0;
  background-color: rgba(112, 110, 110, 0.5);
  border-radius: 10px;
  padding: 5px;
  padding-left: 10px;
  padding-right: 10px;
}
.message-ipx {
  bottom: 200px;
}
.__ag__showscrollinfotext__ {
  height: 50px;
  display: flex;
  text-align: center;
  line-height: 50px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.__ag__msglink__ {
  flex: 1;
  margin-bottom: 30px;
}
.__ag__notice__ {
  flex-direction: row;
  align-items: flex-start;
}
.__ag__notice_image__ {
  width: 36px;
  height: 36px;
  margin-right: 10px;
}
.__ag__notice_text__ {
  font-size: 13wx;
  line-height: 36px;
  color: rgb(238, 0, 0);
}
.__ag__notice_content__ {
  flex: 1;
  line-height: 36px;
  font-size: 13wx;
  color: rgb(238, 0, 0);
}
.__ag__anchor_name_color__ {
  color: @main-color;
}
.__ag__assistant_name_color__ {
  color: #f3a600;
}
.__ag__anchor_text_color__ {
  color: @main-text-color;
}
.__ag__assistant_text_color__ {
  color: #f3a600;
}
.__ag__anchor_background__ {
  background-color: @main-color;
}
.__ag__assistant_background__ {
  background-color: #f3a600;
}
.__ag__socketerror__ {
  width: 500px;
  height: 80px;
  background-color: #f7b309;
  border-radius: 40px;
  position: absolute;
  left: 15px;
  top: 30px;
  flex-direction: row;
  align-items: center;
  padding-left: 30px;
  padding-right: 30px;
}
.__ag__socketerrortext__ {
  text-align: center;
  font-size: 15wx;
  color: #fff;
}
.__ag__socketerror_lf__ {
  font-size: 22wx;
  color: #fff;
  margin-right: 5px;
}
.__ag__socketerror_icon__ {
  position: absolute;
  top: -32px;
  left: 30px;
  font-size: 28wx;
  color: #f7b309;
  transform: rotate(-90deg);
}
</style>
