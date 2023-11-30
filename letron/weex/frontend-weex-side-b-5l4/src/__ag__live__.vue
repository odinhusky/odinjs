<template>
  <div
    class="__ag__live__"
    :style="mainStyle"
    ref="video_full"
    @click="__ag__clickLive__"
  >
    <ag-keyboardsize
      class="__ag__keyboardsize__"
      ref="keyboardsize"
    ></ag-keyboardsize>
    <ag-ipx bg="#000000"></ag-ipx>
    <!-- <div class="__ag__livetitle__" >
			<ag-uptitle :isclose="true" :iswhite="true"
			:item="upinfo" :amount="info.joinMap && info.joinMap.room  && info.joinMap.room.amount"
			 :score="upinfo.score" :user="a__ag__user__" :isMatchUser="isMatchUser" :listFollowMap="listFollowMap" 
			 @cancelFollow="__ag__cancelFollow__" @followTap="__ag__followTap__" @switch="__ag__switch__" @onTab="changeHandler({index:3})"></ag-uptitle>
		</div> -->

    <!-- 视频模块 -->
    <div
      class="__ag__livenvideo__"
      :style="videoStyle"
      :class="[
        isFull && !ivx ? 'video_full' : '',
        ivx && isFull ? 'video_full_ivx' : '',
      ]"
      @swipe="handleSwipe"
    >
      <!-- 视频播放器 -->
      <ag-nvideo
        v-if="islive"
        :src="src"
        ref="video"
        :full="isFull"
        :fullDevice="fullDevice"
        :user="a__ag__user__"
        :isDanmu="isDanmu"
        :matchInfo="roomdata"
        :uid="uid"
        :showDanmu="showDanmu"
        :isLoading="isVideoLoading"
        :showVote="showVote"
        :isVote="isVote"
        :roomId="roomId"
        :voteItem="voteItem"
        @refresh="onFefresh"
        @closeInput="__ag__clickLive__"
        @changeLoading="changeLoading"
        @endMessageVote="__ag__endMessageVote__"
        @addMessageVote="addMessageVote"
        @voteClose="voteClose"
        @resultVote="resultVote"
        @onVote="__ag__onVote__"
      >
      </ag-nvideo>

      <ag-notlive v-if="!islive" :uid="uid"></ag-notlive>

      <!-- 弹幕 -->
      <!-- <div v-for="item in danmuList" :key="'d'+item.id" class="__ag_chat_danmu__" :style="{top: item.top,transform: translate}" :ref="'danmu-' + item.id">
				<text v-if="item.type == vars.TYPE_DANMU" class="__danmu_text__">{{item.content}}</text>
				<text v-if="item.type == vars.TYPE_ENTER" class="__danmu_text__">
					<text style="color:#fff;">{{item.enterA}}</text>
					<text style="color:#FEC023;">{{item.senderName}}</text>
					<text style="color:#fff;">{{item.enterB}}</text>
				</text>
			</div> -->

      <!-- 发送的消息 -->
      <!-- <div class="__ag__full_message__" :class="[isFull?'full-show':'full-hide']" v-if="fullMessageList && fullMessageList.length > 0 && isDanmu">
				<scroller class="__ag__messageList__" show-scrollbar="false"> 
					<text class="__message_text__" v-for="(item,index) in fullMessageList" :ref="'messages-' + item.id" :key="'full-' + item.id" :class="[fullMessageList.length > 4 ?'__item_'+ index : '',index == 4 ? 'last-text': '']">{{item.joinMap && item.joinMap.u && item.joinMap.u.userNicename}}：{{item.content}}</text>
				</scroller>
			</div> -->
    </div>

    <!-- 切换主播模块 -->
    <div class="__ag__anchorinfo_main__" v-if="!isFull">
      <div class="__ag__anchorinfo_lf__">
        <image
          class="__ag__anchorinfo_image__"
          v-if="env.id == 1"
          :src="__ag__url__('static/stream.gif')"
          mode="aspectFit"
        ></image>
        <image
          class="__ag__anchorinfo_image__ __ag__other_image__"
          v-else
          :src="__ag__url__('static/hb-stream.gif')"
          mode="aspectFit"
        ></image>
        <text class="__ag__anchorinfo_name__">{{ upinfo.userNicename }}</text>
        <text class="__ag__anchorinfo_text__">{{ iosUserId }}</text>
      </div>
      <div
        class="__ag__anchorinfo_rg__"
        v-if="listMatchUserLenth && showAnthor"
      >
        <scroller
          class="__ag__anchorinfo_scroll__"
          show-scrollbar="false"
          scroll-direction="horizontal"
        >
          <text
            class="__ag__anchorinfo_item__"
            :class="[
              index != listMatchUser2.length - 1 ? '__ag__item_border__' : '',
            ]"
            v-for="(item, index) in listMatchUser2"
            :key="item.id"
            @click="__ag__goLives__(item)"
            >{{ item.upName }}</text
          >
        </scroller>
      </div>
      <div
        class="__ag__anchorinfo_control__"
        v-if="listMatchUserLenth && showAnthor"
        @click="__ag__switch__"
      >
        <text class="agiconfont __ag__video__">&#xe820;</text>
        <text class="__ag__length__">{{ listMatchUserLenth }}</text>
        <text class="agiconfont __ag__video__" style="font-size: 20wx"
          >&#xec5c;</text
        >
      </div>
    </div>

    <!-- 切换标签模块 -->
    <div class="__ag__livechathead__" v-if="!isFull">
      <div class="__ag__livechattab__" @click="changeHandler({ index: 0 })">
        <text
          class="__ag__livechattabtext__"
          :class="[tab == 0 ? 'selected' : '']"
          >广场</text
        >
      </div>
      <div class="__ag__livechattab__" @click="changeHandler({ index: 1 })">
        <text
          :class="[tab == 1 ? 'selected' : '']"
          class="__ag__livechattabtext__"
          >主播私聊</text
        >
        <image
          class="__ag__tab_image__"
          v-if="isPrivate"
          :src="__ag__url__('static/giphy.gif')"
        ></image>
      </div>
      <div class="__ag__livechattab__" @click="changeHandler({ index: 2 })">
        <text
          :class="[tab == 2 ? 'selected' : '']"
          class="__ag__livechattabtext__"
          >聊天</text
        >
        <image
          class="__ag__tab_image__ __ag__chat_image__"
          v-if="isChatMsg"
          :src="__ag__url__('static/giphy.gif')"
        ></image>
      </div>
      <div class="__ag__livechattab__" @click="changeHandler({ index: 3 })">
        <text
          :class="[tab == 3 ? 'selected' : '']"
          class="__ag__livechattabtext__"
          >主播信息</text
        >
      </div>
      <div class="__ag__livechattab__" @click="changeHandler({ index: 4 })">
        <text
          :class="[tab == 4 ? 'selected' : '']"
          class="__ag__livechattabtext__"
          >赛况</text
        >
      </div>
    </div>
    <!-- 模块内容 -->
    <slider
      class="__ag__livechatcontentslider__"
      v-if="!isFull"
      @click="__ag__clickLive__"
      interval="3000"
      offset-x-accuracy="0.9"
      auto-play="false"
      infinite="false"
      @change="changeHandler"
      :index="tab"
      ref="slider"
      @swipe="handleSwipe"
    >
      <div
        class="__ag__livechatcontent__"
        v-for="item in tabList"
        :key="item.id"
      >
        <!-- 广场模块 -->
        <div class="__ag__livegz__" v-if="item.id == 0">
          <div v-if="!islive" class="__ag__notlive__">
            <text class="__ag__notlivetext__">主播不在家</text>
          </div>

          <!-- 广场聊天信息 -->
          <ag-messagelist
            ref="messagelist"
            :topTab="tab"
            :sysnotices="sysNotice"
            :upinfo="upinfo"
            :ofUpinfo1="ofUpinfo1"
            :uid="uid"
            :danmuTiming="danmuTiming"
            :intervalId="intervalId"
            :resp="a__ag__pageRoomMsg__"
            :isShowAnchor="isShowAnchor"
            :issocket="issocket"
            @onClick="__ag__clickLive__"
            @anchorClose="isShowAnchor = false"
            @addFriend="__ag__addFriend__"
          >
          </ag-messagelist>

          <!-- 定时弹幕 -->
          <ag-danmu
            :item="danmuTiming"
            @onclose="__ag__onDanmuClose__"
            v-if="isdanmuTiming && tab == 0 && keyboardSize == '0px'"
          ></ag-danmu>

          <!-- 投票 -->
          <ag-vote
            ref="vote"
            :tab="tab"
            :isVote="isVote"
            :voteItem="voteItem"
            :keyboardSize="keyboardSize"
            :user="a__ag__user__"
            :roomId="roomId"
            @endMessageVote="__ag__endMessageVote__"
            @addMessageVote="addMessageVote"
            @voteClose="voteClose"
            @resultVote="resultVote"
          >
          </ag-vote>

          <!-- 投票结果 -->
          <ag-voteend
            v-if="showEndVote"
            :vote="vote"
            @voteClose="showEndVote = false"
          ></ag-voteend>

          <!-- 投票图标 -->
          <image
            v-if="showVote"
            :src="__ag__url__('/static/topiao.png')"
            class="__ag__toupiao_img__"
            :class="[ipx ? '__ag__toupiao_img_ipx__' : '']"
            @click="__ag__onVote__"
          />

          <!-- 欢迎词 -->
          <div
            v-if="keyboardSize == '0px' && enterRoomName"
            class="__ag__enteriroominfo__"
            :class="[ipx ? '__ag__enteriroominfoipx__' : '']"
          >
            <text class="__ag__enteriroominfotext__">欢迎</text>
            <text class="__ag__enteriroomnametext__">{{ enterRoomName }}</text>
            <text class="__ag__enteriroominfotext__">光临我的直播间</text>
          </div>

          <!-- 底部栏 -->
          <div
            class="__ag__livesend__"
            :class="[
              ipx ? '__ag__livesendipx__' : '',
              keyboardSize != '0px' && ipx ? '__ag__livesendipxkey__' : '',
            ]"
            v-if="islive"
          >
            <div class="__ag__livesendinput__">
              <input
                :placeholder="isUser ? '发送消息' : '发信息需要登录'"
                class="__ag__livesendbodyinput__"
                ref="inputref"
                v-model="form.content"
                return-key-type="send"
                upriseOffset="16"
                :hideDoneButton="true"
                @return="__ag__keyboard__"
                @confirm="__ag__send__"
                @keyboard="keyboard"
              />
            </div>
            <div
              class="__ag__chatitem__"
              v-if="a__ag__user__ && a__ag__user__.userType < 3"
              @click="__ag__onEmotion__"
            >
              <text class="agiconfont __ag__vector__">&#xe69c;</text>
            </div>
            <div class="__ag__livefs__" @click="__ag__send__">
              <text class="__ag__livefstext__">发送</text>
            </div>
          </div>
        </div>

        <!-- 主播私聊模块 -->
        <div class="__ag__livezbmsg__" v-if="item.id == 1">
          <ag-chatlist
            ref="zbmsgchat"
            v-if="ofUpinfo && ofUpinfo.id"
            @keyboard="keyboard"
            :user="a__ag__user__"
            :ofUpinfo="ofUpinfo"
            :islive="true"
            :iszb="true"
            :name="upinfo.userNicename"
            :uid="assistId"
            :type="ofUpinfo.type"
            :tab="tab"
            :listFaq="listFaq"
          ></ag-chatlist>
          <div v-else class="__ag__liveupnotdiv__">
            <image
              class="__ag__liveupnotimg__"
              :src="__ag__url__(frameurl)"
            ></image>
          </div>
        </div>

        <!-- 聊天列表模块 -->
        <div class="__ag__livelt__" v-if="item.id == 2">
          <ag-msglist
            @onchat="onchat"
            v-if="a__ag__user__ && a__ag__user__.userType < 3 && ismsgtalkto"
            :islive="true"
            :msgList="msgList"
          ></ag-msglist>
          <div
            v-if="a__ag__user__ && a__ag__user__.userType == 3 && ismsgtalkto"
            @click="__ag__onlogin__"
            class="__ag__liveltdl__"
          >
            <text class="__ag__liveltdltext__">登录</text>
          </div>
          <ag-chat-msg-list
            ref="chatlist"
            v-if="!ismsgtalkto"
            @keyboard="keyboard"
            @onBackPress="onBackPress"
            :user="a__ag__user__"
            :islive="true"
            :uid="msgTalkto.uid"
            :iszb="false"
            :type="msgTalkto.type"
            :name="msgTalkto.name"
          ></ag-chat-msg-list>
        </div>

        <!-- 主播信息模块 -->
        <div class="__ag__livezb__" v-if="item.id == 3">
          <ag-upinfo
            :item="upinfo"
            :listFollowMap="listFollowMap"
            :tab="tab"
            :roomId="roomId"
            :uid="uid"
            :user="a__ag__user__"
            @cancelFollow="__ag__cancelFollow__"
            @followTap="__ag__followTap__"
          ></ag-upinfo>
        </div>

        <!-- 赛况模块 -->
        <div class="__ag__livemh__" v-if="item.id == 4">
          <ag-livematch :roomData="roomdata"></ag-livematch>
        </div>
      </div>
    </slider>

    <!-- 聊天室断开连接提示 -->
    <div class="__ag__socketerror__" v-if="issocket">
      <text class="__ag__socketerrortext__"
        >聊天室连接已断开,自动重连中,请稍候</text
      >
    </div>
    <div
      class="__ag__chatemotion__"
      v-if="isemotion"
      :class="[ipx ? 'emotion-ipx' : '']"
    >
      <ag-emotion @click="__ag__clickHeibai__"></ag-emotion>
    </div>

    <!-- 同场主播列表 -->
    <ag-popup
      class="__ag__switch_popup__"
      :class="[ipx ? 'popup-ipx' : '']"
      :isAnimate="isSwitch"
      :isSlate="isSwitch"
      @closePopup="isSwitch = false"
    >
      <ag-switch-user-list
        :list="listMatchUser2"
        @close="isSwitch = false"
        @pause="pause"
        :viewHeight="viewHeight"
      ></ag-switch-user-list>
    </ag-popup>
  </div>
</template>

<script>
import nvideo from "./components/__ag__nvideo__.vue"
import agmessagelist from "./components/__ag__messageList__.vue"
import agupinfo from "./components/__ag__upinfo__.vue"
import aglivematch from "./components/__ag__livematch__.vue"
import vars from "./components/vars.js"
import env from "./components/env.js"
import util from "./components/util.js"
import bc from "./components/__ag__bc__.js"
import msglist from "./components/__ag__msgList__.vue"
import chatList from "./components/__ag__chatList__.vue"
import chatMsgList from "./components/__ag__chatMsgList__.vue"
import agMinix from "./components/__ag__minix__.js"
import minurl from "./components/__ag__minurl__.js"
import __ag__sport from "./components/__ag__sport__.js"
import api from "./components/__ag__sport_api__.js"
import uptitle from "./components/__ag__uptitle__.vue"
import keyboardsize from "./components/__ag__keyboardSize__.vue"
import danmu from "./components/__ag__danmu__.vue"
import vote from "./components/__ag__vote__.vue"
import voteend from "./components/__ag__voteEnd__.vue"
import notlive from "./components/__ag__notlive__.vue"
import ipx from "./components/__ag__ipx__.vue"
import emotion from "./components/__ag__emotion__.vue"
import switchUserList from "./components/__ag__switchUserList__.vue"
import agPopup from "./components/__ag__popup__.vue"

const dom = weex.requireModule("dom")
const animation = weex.requireModule("animation")

let danmuIndex = 0
export default {
  components: {
    "ag-nvideo": nvideo,
    "ag-messagelist": agmessagelist,
    "ag-upinfo": agupinfo,
    "ag-livematch": aglivematch,
    "ag-uptitle": uptitle,
    "ag-keyboardsize": keyboardsize,
    "ag-danmu": danmu,
    "ag-vote": vote,
    "ag-voteend": voteend,
    "ag-msglist": msglist,
    "ag-chatlist": chatList,
    "ag-chat-msg-list": chatMsgList,
    "ag-notlive": notlive,
    "ag-ipx": ipx,
    "ag-emotion": emotion,
    "ag-switch-user-list": switchUserList,
    "ag-popup": agPopup,
  },
  mixins: [agMinix, minurl],
  data() {
    return {
      env,
      frameurl: "static/frame.png",
      src: "",
      tab: 0,
      uid: undefined,
      roomId: undefined,
      form: {
        contentType: 1,
        content: "",
        title: "",
        thumb: "",
        url: "",
        messageType: 1,
        type: 4,
      },
      item: { joinMap: {} },
      upinfo: {},
      info: {},
      islive: true,
      vars,
      a__ag__user__: {},
      keyboardSize: "0px",
      intervalId: 0,
      live: {},
      adInterval: 0,
      danmuTiming: {},
      isdanmuTiming: false,
      dTimingInterval: 0,
      vote: {},
      ismsgtalkto: true,
      msgTalkto: {},
      a__ag__msgList__: [],
      a__ag__msgMap__: {},
      newFriendOrNewGroup: false,
      ofUpinfo: {},
      ofUpinfo1: {},
      welcome: "",
      listFollowMap: {},
      sysNotice: "",
      tabList: [
        { id: 0, name: "广场" },
        { id: 1, name: "直播私聊" },
        { id: 2, name: "聊天" },
        { id: 3, name: "主播" },
        { id: 4, name: "赛况" },
      ],
      assistId: "",
      isemotion: false,
      loading: false,
      issocket: false,
      enterRoomName: "",
      listMatchUser: [],
      isSwitch: false,
      viewHeight: 0,
      isFull: false,
      fullDevice: {
        width: 0,
        height: 0,
      },
      a__ag__pageRoomMsgList__: [],
      isDanmu: true,
      isShowAnchor: true,
      pageConfig: {
        barrage: false,
        changeUp: false,
      },
      isVideoLoading: false,
      voteItem: {},
      showVote: false,
      isVote: false,
      showEndVote: false,
      timeTimer: false,
      isPrivateChat: true,
      unread: 0,
      logViewTimer: null,
      listFaq: [],
    }
  },
  computed: {
    showDanmu() {
      return this.pageConfig.barrage
    },
    showAnthor() {
      return this.pageConfig.changeUp
    },
    iosUserId() {
      if (WXEnvironment.platform == "iOS") {
        let i = this.a__ag__user__ && this.a__ag__user__.id
        return util.base62(i)
      }
    },
    roomdata() {
      if (
        this.a__ag__listMatchScheduleById__ &&
        this.a__ag__listMatchScheduleById__.data &&
        this.a__ag__listMatchScheduleById__.data.length
      ) {
        return this.a__ag__listMatchScheduleById__.data[0]
      }
      return {}
    },
    msgList() {
      let list = this.a__ag__msgList__
      return list
        .filter((r) => {
          if (r.userHide) {
            return false
          }
          return true
        })
        .sort((a, b) => {
          if (a.unread) {
            return -1
          }
          return a.lastTime <= b.lastTime ? 1 : -1
        })
    },
    isMatchUser() {
      let list = this.listMatchUser
      if (!list || !list.length || list.length == 0) {
        return false
      }
      let m = this.listMatchUser.filter((r) => {
        if (r.uid == this.uid) {
          return false
        }
        return true
      })
      if (m.length > 0) {
        return true
      }
      return false
    },
    listMatchUser2() {
      if (!this.listMatchUser || !this.listMatchUser.length) {
        return
      }
      return this.listMatchUser.filter((r) => {
        if (r.uid == this.uid) {
          return false
        }
        return true
      })
    },
    listMatchUserLenth() {
      if (!this.listMatchUser2 || !this.listMatchUser2.length) {
        return 0
      }
      return this.listMatchUser2 && this.listMatchUser2.length
    },
    mainStyle() {
      let style = {}
      if (this.isFull) {
        style.width = this.fullDevice.height.toFixed(2) + "px"
        if (this.ivx) {
          style.transform = "rotate(90deg)"
        }
      } else {
        style.width = "750px"
        if (this.ivx) {
          style.transform = "rotate(0deg)"
        }
      }

      return style
    },
    videoStyle() {
      let style = {}
      if (this.isFull) {
        style.height = "750px"
        style.width = this.fullDevice.height.toFixed(2) + "px"
      } else {
        style.height = "421.875px"
        style.width = "750px"
      }
      return style
    },
    translate() {
      let translate = 0
      if (this.isFull) {
        translate = `translateX(${this.fullDevice.height.toFixed(2)} + "px")`
      } else {
        translate = "translateX(750px)"
      }
      return translate
    },
    fullMessageList() {
      if (
        !this.a__ag__pageRoomMsgList__ ||
        !this.a__ag__pageRoomMsgList__.length
      ) {
        return []
      }

      let list = this.a__ag__pageRoomMsgList__
        .filter((r) => {
          if (r.type != 4) {
            return false
          }
          return true
        })
        .reverse()

      return list.splice(0, 5).reverse()
    },
    isPrivate() {
      if (this.isPrivateChat) {
        return true
      }
      return false
    },
    isChatMsg() {
      if (
        !this.a__ag__user__ ||
        !this.a__ag__user__.userType ||
        this.a__ag__user__.userType == 3
      ) {
        return false
      }
      if (!this.unread || this.unread == 0) {
        return false
      }
      return true
    },
  },
  mounted() {
    // 直播间统计埋点
    this.logViewTimer = setInterval(() => {
      if (this.info && this.info.joinMap && this.info.joinMap.live.id) {
        api.logView({ liveId: this.info.joinMap.live.id }).then((resp) => {})
      }
    }, 60000)
  },
  created() {
    util.setAudioCategory(0)
    let globalEvent = weex.requireModule("globalEvent")
    globalEvent.addEventListener(
      "WXApplicationWillResignActiveEvent",
      function (e) {
        bc.postMessage("onPause")
      }
    )
    globalEvent.addEventListener(
      "WXApplicationDidBecomeActiveEvent",
      function (e) {
        // bc.postMessage('onplay')
      }
    )
  },
  destroyed() {
    util.setLandscape(0)
    if (this.timeTimer) {
      clearTimeout(this.timeTimer)
      this.timeTimer = false
    }
    clearInterval(this.logViewTimer)
  },
  methods: {
    statusbar(b) {
      util.statusbar(b)
    },
    async __ag__loadData__() {
      let that = this
      // 获取用户信息
      that.a__ag__user__ = util.getItem("user")

      // 用户登录
      const Steve = new BroadcastChannel("onlogin")
      Steve.onmessage = async function (event) {
        that.__ag__login__(event.data)
        await that.__ag__Up__()
      }

      // 接受ws返回的信息
      const msg = new BroadcastChannel("msg")
      msg.onmessage = function (event) {
        that.__ag__onmsg__(event.data)
      }

      const socket = new BroadcastChannel("socket")
      socket.onmessage = function (event) {
        that.onSocket(event.data)
      }

      bc.onmessage("msgUnread", this.msgUnread)

      bc.onmessage("onUnread", this.onunread)

      bc.onmessage("switchAnthor", this.switchAnthor)

      bc.onmessage("changeFull", this.changeFull)

      bc.onmessage("landscape", this.landscape)

      bc.onmessage("sendMessage", this.sendMessage)

      bc.onmessage("changeDanmu", this.changeDanmu)

      bc.onmessage("cancelFollow", this.changeCancelFollow)

      bc.onmessage("followTap", this.changeFollowTap)

      let data = util.getUrlParam(weex.config.bundleUrl)
      this.uid = data.uid

      if (data.tab) {
        this.tab = data.tab
        setTimeout(() => {
          this.__ag__addFriend__()
        }, 300)
      }

      await this.__ag__getData__()

      let sf = this.$refs.slider
      if (sf) {
        dom.getComponentRect(sf, (option) => {
          this.viewHeight = option.size.height
        })
      }
    },
    landscape(e) {
      let orientation = e.data.orientation

      if (orientation == 1) {
        this.isFull = false
      } else {
        this.isFull = true
      }
    },
    changeDanmu(event) {
      this.isDanmu = event.data
    },
    async switchAnthor(event) {
      this.uid = event.data
      this.ofUpinfo = {}
      this.assistId = ""
      this.ismsgtalkto = true
      this.__ag__clickLive__()
      await this.__ag__getData__()
      let v = this.$refs.video
      if (v) {
        v.onplay()
      }
      try {
        await this.__ag__getMsgList__()
      } catch (err) {}
      bc.postMessage("changeData")
    },
    async onFefresh() {
      this.isVideoLoading = true
      if (!this.isFull) {
        util.message("加载中")
      }
      this.src = ""
      try {
        let resp = await this.__ag__getListMatchScheduleById__({
          uid: this.uid,
        })
        if (resp.data && resp.data.length > 0) {
          let item = resp.data[0]
          if (item && item.joinMap && item.joinMap.live) {
            this.src = item.joinMap.live.pull
          }
        }
      } catch (err) {
        util.message(err.message)
      }
    },
    changeLoading(e) {
      this.isVideoLoading = e
    },
    async __ag__getData__() {
      this.isVideoLoading = true
      try {
        await this.__ag__listMatchScheduleById__({ uid: this.uid })
      } catch (err) {
        util.message(err.message)
      }
      if (
        !this.a__ag__listMatchScheduleById__.data ||
        !this.a__ag__listMatchScheduleById__.data.length
      ) {
        this.islive = false
      }
      let item = this.a__ag__listMatchScheduleById__.data[0]
      this.islive = true
      this.item = item
      item.joinMap.streamer.id = this.uid
      this.roomId = item.joinMap.room.id
      this.info = item
      let joinMap = item.joinMap
      this.info.upName = joinMap.streamer.userNicename
      this.info.avatar = joinMap.streamer.avatar
      this.roomId = joinMap.room.id
      this.src = item.joinMap.live.pull
      let live = item.joinMap.live
      this.welcome = live.welcome
      if (process.env.NODE_ENV == "development") {
        // this.src = 'https://5lpullali.dasll.com/live/3a35b75fccbe4811bf69c144480286c0.m3u8?auth_key=1663893774-46fe4dc6742841fb825f279e78169e11-0-bd409ed9de1fda63d621043c72e1dc86'
      }
      this.form.roomId = this.roomId
      this.__ag__Up__()
      this.__ag__assistOfUp__()
      try {
        await this.__ag__editRoomUsers__(this.roomId)
      } catch (err) {
        util.message(err.message)
      }
      try {
        await this.__ag__pageRoomMsg__(this.roomId)
      } catch (err) {
        util.message(err.message)
      }
      await this.__ag__updateLive__(live)

      await this.__ag__getListUsersLive__()

      await this.__ag__getListVote__()

      await this.__ag__getMsgList__()

      if (this.a__ag__user__ && this.a__ag__user__.userType < 3) {
        // await this.__ag__getListFaq__()
      }
    },
    pause() {
      let v = this.$refs.video
      if (v) {
        v.onPause()
      }
    },
    changeFull(event) {
      this.isFull = event.data == 1 ? true : false

      let v = this.$refs["video_full"]
      let that = this
      if (v) {
        dom.getComponentRect(v, function (ret) {
          that.fullDevice = ret.size
        })
      }
      this.__ag__goscroll__()
      if (this.isFull) {
        this.__ag__danmuScroll__()
      }
    },
    __ag__switch__() {
      this.isSwitch = !this.isSwitch
      this.__ag__getListUsersLive__()
    },
    __ag__goLives__(item) {
      this.isSwitch = false
      this.pause()
      let f = {
        data: item.uid,
      }
      this.switchAnthor(f)
    },
    onEnterRoomMsg(item) {
      this.enterRoomName = item.senderName
      setTimeout(() => {
        this.enterRoomName = ""
      }, 3000)
    },
    async changeHandler(e) {
      let id = this.tabList[e.index].id
      await this.ontab(id)
    },
    onBackPress() {
      this.ismsgtalkto = true
      this.msgTalkto = {}
      this.onkeyboardSize()
    },
    onkeyboardSize() {
      if (this.keyboardSize != "0px") {
        let zbmsgchat = this.$refs.zbmsgchat

        if (zbmsgchat && zbmsgchat.length > 0) {
          zbmsgchat[0].__ag__clickLive__()
        }
      }
      this.keyboardSize = "0px"
      this.$refs.keyboardsize.keyboardSize("0px")
    },
    onchat(n) {
      let allMsg = this.a__ag__msgMap__
      let id = n.uid
      let key = `${n.type}-${this.a__ag__user__.id}-${id}`
      let r = allMsg[key]
      if (r) {
        if (n.type == 2) {
          this.msgOnunread(key, r.unread)
        }
        r.unread = 0
        this.$set(this.a__ag__msgMap__, key, r)
      }
      this.ismsgtalkto = false
      this.msgTalkto = n
    },
    __ag__onlogin__() {
      util.getPush("__ag__login__")
    },
    __ag__endMessageVote__(item) {
      this.isVote = false
      this.vote = item
      if (
        item.messageType == 1 &&
        item.type &&
        item.type == vars.TYPE_VOTE_RESULT
      ) {
        this.showEndVote = true
        this.__ag__setTimeout__()
      }
    },
    addMessageVote(item) {
      this.isVote = false
      this.vote = item
      if (
        item.messageType == 1 &&
        item.type &&
        item.type == vars.TYPE_VOTE_RESULT
      ) {
        this.showEndVote = true
        this.__ag__setTimeout__()
      }
    },
    __ag__setTimeout__() {
      if (this.timeTimer) {
        clearTimeout(this.timeTimer)
        this.timeTimer = false
      }
      this.timeTimer = setTimeout(() => {
        this.showEndVote = false
      }, 10000)
    },
    __ag__onDanmuClose__() {
      this.isdanmuTiming = false
    },
    __ag__danmuTimingImmediate__() {
      let time = this.danmuTiming.danmuInterval / 2
      if (time > 10) time = 10
      setTimeout(() => {
        this.isdanmuTiming = false
      }, time * 1000)
    },
    __ag__danmuTimingInterval__() {
      this.__ag__clearDanmuTimingInterval__()
      setTimeout(() => {
        this.isdanmuTiming = true
        this.__ag__danmuTimingImmediate__()
        this.dTimingInterval = setInterval(() => {
          this.isdanmuTiming = true
          this.__ag__danmuTimingImmediate__()
        }, this.danmuTiming.danmuInterval * 1000)
      }, 5000)
    },
    __ag__clearDanmuTimingInterval__() {
      if (this.dTimingInterval) {
        clearInterval(this.dTimingInterval)
        // this.isdanmuTiming=false
        this.dTimingInterval = 0
      }
    },
    __ag__updateLive__(live) {
      this.live = live
      this.sysNotice = live.sysNotice
      let notice = {
        id: -1,
        messageType: 1,
        type: vars.TYPE_NOTICE,
        contentType: this.live.noticeThumb ? 2 : 1,
        content: this.live.noticeContent,
        title: this.live.noticeTitle,
        thumb: this.live.noticeThumb,
        url: this.live.noticeUrl,
      }

      this.a__ag__pageRoomMsg__.data &&
        this.a__ag__pageRoomMsg__.data.list &&
        this.a__ag__pageRoomMsg__.data.list.push(notice)
      this.__ag__goscroll__()
      if (live.danmu && live.danmuInterval) {
        this.danmuTiming.url = live.danmuUrl
        this.danmuTiming.danmu = live.danmu
        this.danmuTiming.danmuInterval = live.danmuInterval
        this.__ag__danmuTimingInterval__()
      } else {
        this.__ag__clearDanmuTimingInterval__()
      }
      if (live.adThumb && live.adInterval) {
        this.__ag__addAdInterval__(live.adInterval)
        return
      }
      if (live.adInterval == 0) {
        this.__ag__clearAdTnterval__()
      }
    },
    __ag__clearAdTnterval__() {
      if (this.adInterval) {
        clearInterval(this.adInterval)
        this.adInterval = 0
      }
    },
    __ag__pushInterval__() {
      let item = {}
      let intervalId = new Date().getTime()
      item.id = intervalId
      this.intervalId = intervalId
      item.contentType = 2
      item.title = this.live.adTitle
      item.content = this.live.adContent
      item.thumb = this.live.adThumb
      item.url = this.live.adUrl
      item.isgg = true
      this.a__ag__pageRoomMsg__.data &&
        this.a__ag__pageRoomMsg__.data.list &&
        this.a__ag__pageRoomMsg__.data.list.push(item)
      this.__ag__goscroll__()
      return (
        this.a__ag__pageRoomMsg__.data &&
        this.a__ag__pageRoomMsg__.data.list &&
        this.a__ag__pageRoomMsg__.data.list.length - 1
      )
    },
    __ag__addAdInterval__(adInterval) {
      this.__ag__clearAdTnterval__()
      setTimeout(() => {
        this.__ag__pushInterval__()
        this.adInterval = setInterval(() => {
          this.__ag__pushInterval__()
        }, adInterval * 1000)
      }, 5000)
    },
    async __ag__Up__() {
      try {
        let resp = await this.__ag__pageUpById__({ id: this.uid })

        if (resp && resp.data && resp.data.list && resp.data.list.length > 0) {
          let item = resp.data.list[0]
          this.upinfo = item
          if (
            item &&
            item.joinMap &&
            item.joinMap.follow &&
            item.joinMap.follow.id
          ) {
            let follow = item.joinMap.follow
            this.$set(this.listFollowMap, item.id, follow)
          }
        }
      } catch (err) {
        util.message(err.message)
      }
    },
    keyboard(event) {
      let keySize = util.keyboardHeight(event)
      if (keySize > 0) {
        if (this.ipx) {
          keySize = keySize - 15
        } else {
          keySize = keySize + 10
        }
      } else {
        keySize = "0"
      }

      this.keyboardSize = keySize + "px"
      // let s =util.toString(event.keyboardSize)
      // util.message(this.keyboardSize)
      this.__ag__goscroll__()
      this.$refs.keyboardsize.keyboardSize(this.keyboardSize)
      // const keyboardSize = new BroadcastChannel('keyboardSize')
      // keyboardSize.postMessage(this.keyboardSize)
      // Vue.$emit("keyboardSize",this.keyboardSize)
    },
    async __ag__assistOfUp__() {
      this.ofUpinfo = {}
      this.assistId = ""
      if (!this.uid) {
        return
      }
      let upId = this.uid
      try {
        let resp = await this.__ag__listAssistOfUp__({ upId })
        if (resp.data && resp.data.length > 0) {
          this.ofUpinfo = resp.data[0]
          this.ofUpinfo1 = resp.data[0]
          this.ofUpinfo.type = "3"
          this.ofUpinfo.assistId = this.ofUpinfo.assistId + ""
          this.assistId = this.ofUpinfo.assistId
          this.ofUpinfo.welcome = this.welcome
          let zbmsgchat = this.$refs.zbmsgchat
          if (zbmsgchat && zbmsgchat.length > 0) {
            zbmsgchat[0].__ag__ofUpmsg__()
          }
        }
      } catch (err) {
        util.message(err.message)
      }
    },
    async ontab(tab) {
      this.msgTalkto = {}
      this.tab = tab
      this.__ag__clickLive__()
      this.ismsgtalkto = true
      if (tab == 1) {
        this.isPrivateChat = false
      }
      if (tab == 2) {
        if (this.a__ag__user__ && this.a__ag__user__.userType < 3) {
          await this.__ag__getMsgList__()
        }
      }
      if (tab == 0) {
        this.__ag__goscroll__()
      }
      this.onkeyboardSize()
      // this.ismsgtalkto = true
      // let ipt = this.$refs.zbmsgchat
      // if(ipt && ipt.length>0){
      // 	ipt[0].__ag__clickLive__()
      // }
      let msgt = this.$refs.chatlist
      if (msgt && msgt.length > 0) {
        msgt[0].__ag__clickLive__()
      }
    },
    __ag__clickLive__() {
      // if(this.tab == 0){
      this.isemotion = false
      let ipt = this.$refs.inputref
      if (ipt && ipt.length > 0 && !this.isFull) {
        ipt[0].blur()
      }
      // 	return
      // }
      // if(this.tab == 1){
      let zbmsgchat = this.$refs.zbmsgchat
      if (zbmsgchat && zbmsgchat.length > 0) {
        zbmsgchat[0].__ag__clickLive__()
      }
      // 	return
      // }
      // if(this.tab == 2){
      let chatlist = this.$refs.chatlist
      if (chatlist && chatlist.length > 0) {
        chatlist[0].__ag__clickLive__()
      }
      // 	return
      // }
    },
    __ag__addFriend__() {
      this.tab = 1
      setTimeout(() => {
        this.$nextTick(() => {
          let zbmsgchat = this.$refs.zbmsgchat
          if (zbmsgchat && zbmsgchat.length > 0) {
            zbmsgchat[0].__ag__clickFoucs__()
          }
        })
      }, 500)
    },
    async __ag__onmsg__(msg) {
      if (!msg) {
        return
      }
      this.newFriendOrNewGroup = false
      for (let i in msg) {
        let item = msg[i]

        if (item.type == vars.TYPE_VOTE) {
          this.isVote = false
          this.showVote = false
          this.showEndVote = false
          this.__ag__getListVote__()
          this.showVote = true
          continue
        }

        // 直播配置更新
        if (item.object && item.type === 8) {
          this.updatePageConfig(item.object, 1)
        }

        let list =
          this.a__ag__pageRoomMsg__.data && this.a__ag__pageRoomMsg__.data.list
        let msgLen = list.length - 1
        if (item.type != vars.TYPE_LIVE_UPDATE && msgLen >= 0) {
          let lastMsg = list[msgLen]
          if (lastMsg.id == item.id && item.type != vars.TYPE_REMOVE_MESSAGE) {
            continue
          }
        }
        if (item.type == vars.TYPE_REMOVE_MESSAGE) {
          if (this.tab == 0 && item.messageType == 1) {
            __ag__sport.delMsg(this.a__ag__pageRoomMsg__.data.list, item)
            continue
          }
        }
        if (item.messageType == 2 || item.messageType == 3) {
          this.newmsg(item)
        }
        if (item.index) {
          continue
        }
        if (item.type == vars.TYPE_ENTER && msg.length > 1) {
          this.__ag__addMessage__(item)
          continue
        }
        this.__ag__addMessage__(item)
      }
      if (this.newFriendOrNewGroup) {
        await this.__ag__getMsgList__()
      }
    },

    // 直播间配置更新
    updatePageConfig(_config, type) {
      let config
      if (type == 1) {
        config = _config
      }
      if (type == 2) {
        const currentLiveItem = _config.data.filter(
          (ele) => ele.uid.toString() === this.uid.toString()
        )[0]
        config = currentLiveItem
      }
      this.pageConfig.barrage = config.barrageIos == 1 ? true : false
      this.pageConfig.changeUp = config.changeUpIos == 1 ? true : false
    },
    msgUnread(event) {
      let key = event.data.key
      let unread = event.data.unread
      this.msgOnunread(key, unread)
    },
    onunread(e) {
      this.unread = e.data || 0
    },
    msgOnunread(key, unread) {
      if (!unread) {
        unread = 0
      }
      try {
        let r = this.a__ag__msgMap__[key]
        if (!r) {
          this.__ag__getMsgList__()
          return
        }
        r.unread -= unread
        if (r.unread < 0) {
          r.unread = 0
        }
        this.checkUnread()
      } catch (e) {}
    },
    newmsg(msg) {
      let id = msg.messageType == 3 ? msg.senderId : msg.roomId

      let allMsg = this.a__ag__msgMap__

      let key = `${msg.messageType}-${this.a__ag__user__.id}-${id}`
      let r = allMsg[key]

      //如果目标在当前列表
      if (r) {
        r.lastMsg = msg.content
        //如果是发送者
        if (msg.senderId == this.a__ag__user__.id) {
          return
        }
        //如果是当前聊天对象
        if (
          this.msgTalkto.type == msg.messageType &&
          id == this.msgTalkto.uid
        ) {
        } else {
          //未读数+1
          r.unread++
        }
        r.userHide = 0
        r.lastMsgId = msg.id
        r.lastTime = msg.createTime
      } else {
        this.newFriendOrNewGroup = true
        return
      }
    },
    __ag__addMessage__(item) {
      if (item.contentType != 3 && item.type == vars.TYPE_NORMAL) {
        let jsonContent = __ag__sport.jsonContent(item.content, item)
        item.jsonContent = jsonContent
      }
      if (item.type == vars.TYPE_LEAVE) {
        return
      }
      if (item.messageType == 1 && item.roomId != this.roomId) {
        return
      }
      item.guest = item.senderName && item.senderName.indexOf("游客") == 0

      if (item.type == vars.TYPE_ENTER && item.messageType != 2) {
        this.info.joinMap.room.amount++
        this.onEnterRoomMsg(item)
        if (this.live.enterVisible == 0) {
          return
        }
        if (this.live.enterA || this.live.enterB) {
          this.__ag__addEnter__(item)
        }
        return
      }
      if (item.senderId == this.a__ag__user__.id) {
        return
      }
      if (item.type == vars.TYPE_LIVE_UPDATE) {
        this.__ag__updateLive__(item.object)
        // this.scroll()
        return
      }
      if (item.type == vars.TYPE_VOTE_RESULT) {
        // this.a__ag__pageRoomMsg__.data.list.push(this.vote)
        this.__ag__goscroll__()
        return
      }

      // if (item.type == vars.TYPE_DANMU) {
      // 	this.__ag__addDanmu__(item)
      // 	return
      // }

      if (item.messageType == 1) {
        item.joinMap = {
          u: {
            userNicename: item.senderName,
          },
        }
        this.a__ag__pageRoomMsg__.data.list.push(item)
        this.__ag__goscroll__()
        // 弹幕
        if (this.isDanmu && item.type == 4 && this.showDanmu) {
          let senderType =
            item.senderId == this.uid
              ? 1
              : item.senderId == this.ofUpinfo1.assistId
              ? 2
              : 0
          this.$set(item, "senderType", senderType)
          this.__ag__addDanmu__(item)
        }
      }

      if (item.messageType == 3) {
        if (item.senderId == this.ofUpinfo.assistId) {
          if (this.tab != "1" && item.senderId == this.ofUpinfo.assistId) {
            this.isPrivateChat = true
          }
        }
      }
    },
    arrayRemove(array, val) {
      for (let i in array) {
        let r = array[i]
        if (r.id == val.id) {
          array.splice(i, 1)
        }
      }
    },
    __ag__addEnter__(item) {
      if (this.live.enterVisible == 0) {
        return
      }
      let enterA = this.live.enterA
      let enterB = this.live.enterB
      if (!enterA && !enterB) {
        return
      }
      let senderName = item.senderName || "游客#" + item.id

      let userNicename =
        "进入" + this.upinfo && this.upinfo.userNicename + "的直播间"
      if (!enterA) {
        enterA = `欢迎`
      } else {
        enterA = `${enterA}`
      }
      if (!enterB) {
        enterB = `${userNicename}`
      } else {
        enterB = `${enterB}`
      }
      let content = enterA + senderName + enterB
      let enter = {
        id: item.id,
        senderName: senderName,
        move: false,
        content,
        enterA,
        enterB,
        type: item.type,
      }
      this.__ag__addDanmu__(enter)
      this.onEnterRoomMsg(item)
    },
    __ag__addDanmu__(item) {
      let dan = this.$refs.video
      if (dan) {
        dan.__ag__handleDanmu__(item)
      }
    },
    __ag__keyboard__() {
      let ipt = this.$refs.inputref
      if (ipt && ipt.length > 0 && !this.isFull) {
        ipt[0].focus()
      }
      this.__ag__send__()
    },
    async sendMessage(e) {
      this.form.content = e.data
      await this.__ag__send__()
    },
    async __ag__send__() {
      if (!this.a__ag__user__ || this.a__ag__user__.userType == 3) {
        util.setLandscape(0)
        util.message("登录账号发消息")
        util.getPush("__ag__login__")
        return
      }
      if (!this.roomId) {
        util.message("主播不在家")
        return
      }
      if (!this.form.content) {
        util.message("消息不能为空")
        return
      }
      try {
        let f = Object.assign({}, this.form)
        f.senderName = this.a__ag__user__.userNicename
        f.messageType = 1
        f.senderId = this.a__ag__user__.id
        let resp = await this.__ag__editRoomMessage__(f)
        this.form.content = ""
        let r = resp.data
        if (r.contentType != 3) {
          let jsonContent = __ag__sport.jsonContent(r.content, r)
          r.jsonContent = jsonContent
        }

        this.a__ag__pageRoomMsg__.data.list.push(r)
        this.__ag__goscroll__()
        bc.postMessage("clearInput")
        // this.__ag__clickLive__()

        // 弹幕
        if (this.isDanmu && this.showDanmu) {
          let senderType =
            r.senderId == this.uid
              ? 1
              : r.senderId == this.ofUpinfo1.assistId
              ? 2
              : 0
          this.$set(r, "senderType", senderType)
          this.__ag__addDanmu__(r)
        }
      } catch (err) {
        util.message(err.message)
      }
    },
    __ag__onEmotion__() {
      this.isemotion = true
    },
    async __ag__clickHeibai__(i) {
      let content = "[" + i + "]"
      if (this.loading) {
        util.message("请稍候...")
        return
      }
      if (!this.a__ag__user__ || this.a__ag__user__.userType == 3) {
        util.message("登录账号发消息")
        util.getPush("__ag__login__")
        return
      }
      if (!i) {
        util.message("请输入聊天信息")
        return
      }
      let h = {
        content: content,
        type: 4,
        contentType: 1,
      }
      let f = Object.assign({}, h)
      f.messageType = 1
      f.senderName = this.a__ag__user__.userNicename
      f.senderId = this.a__ag__user__.id
      f.roomId = this.roomId
      try {
        let resp = await this.__ag__editRoomMessage__(f)
        this.isemotion = false
        let r = resp.data
        if (r.contentType != 3) {
          let jsonContent = __ag__sport.jsonContent(r.content, r)
          r.jsonContent = jsonContent
        }
        this.a__ag__pageRoomMsg__.data.list.push(r)
        this.__ag__goscroll__()
      } catch (err) {
        this.isemotion = false
        util.message(err.message)
      }
    },
    async __ag__login__(data) {
      this.a__ag__user__ = data
      if (this.a__ag__user__ && this.a__ag__user__.userType < 3) {
        this.__ag__assistOfUp__()
        try {
          await this.__ag__getMsgList__()
        } catch (err) {
          util.message(err.message)
        }
        if (!this.islive || !this.roomId) {
          return
        }
        try {
          await this.__ag__editRoomUsers__(this.roomId)
        } catch (err) {
          util.message(err.message)
        }
      }
    },
    onSocket(data) {
      this.issocket = !data
    },
    async __ag__getListUsersLive__() {
      let scheduleId = this.item.id

      if (!scheduleId) {
        return
      }
      try {
        let resp = await this.__ag__listUsersLive__({ scheduleId })
        if (resp.success) {
          if (resp.data && resp.data.length) {
            this.updatePageConfig(resp, 2)
            this.listMatchUser = resp.data
          }
        }
      } catch (err) {}
    },
    __ag__goscroll__() {
      if (
        this.a__ag__pageRoomMsg__.data &&
        this.a__ag__pageRoomMsg__.data.list &&
        this.a__ag__pageRoomMsg__.data.list.length > 0
      ) {
        let length = this.a__ag__pageRoomMsg__.data.list.length
        setTimeout(() => {
          let messagelist = this.$refs.messagelist
          if (messagelist && messagelist[0]) {
            messagelist[0].__ag__goscroll__(length)
          }
        }, 200)
      }
    },
    changeCancelFollow(item) {
      let r = this.listFollowMap[item.data.streamerId]
      if (r) {
        this.$delete(this.listFollowMap, item.data.streamerId)
      }
    },
    changeFollowTap(item) {
      this.$set(this.listFollowMap, item.data.streamerId, item.data)
    },
    async __ag__cancelFollow__(item) {
      if (!this.a__ag__user__ || this.a__ag__user__.userType == 3) {
        util.message("请登录账号")
        util.getPush("__ag__login__")
        return
      }
      let r = this.listFollowMap[item.id]
      if (!r) {
        return
      }
      let id = r.id
      try {
        let resp = await this.__ag__editFollowCancel__({ id })
        if (resp.success) {
          let f = {
            streamerId: item.id,
          }
          util.message(resp.message)
          this.$delete(this.listFollowMap, item.id)
          bc.postMessage("cancelFollow", f)
        }
      } catch (err) {
        util.message(err.message)
      }
    },
    async __ag__followTap__(item) {
      if (!this.a__ag__user__ || this.a__ag__user__.userType == 3) {
        util.message("请登录账号再订阅")
        util.getPush("__ag__login__")
        return
      }
      if (!item.id) {
        return
      }
      try {
        let resp = await this.__ag__editFollow__({ streamerId: item.id })
        if (resp.success) {
          util.message(resp.message)
          let r = resp.data
          this.$set(this.listFollowMap, r.streamerId, r)
          bc.postMessage("followTap", r)
        }
      } catch (err) {
        util.message(err.message)
      }
    },
    handleSwipe(e) {
      if (e.direction == "right") {
        if (this.tab == 0) {
          this.isFull = false
          util.pop()
        }
      }
    },
    __ag__danmuScroll__() {
      let length = this.fullMessageList.length

      if (length && length > 0) {
        setTimeout(() => {
          let id = this.fullMessageList[length - 1].id
          const indicatorId = "messages-" + id
          const indicator = this.$refs[indicatorId][0]

          // 滚动到上一条消息的底部
          if (indicator) {
            const el = indicator
            dom.scrollToElement(el, {})
          }
        }, 200)
      }
    },
    async __ag__getListVote__() {
      if (!this.roomId) {
        return
      }
      let f = {
        roomId: this.roomId,
        status: 1,
      }
      try {
        let resp = await this.__ag__listVote__(f)
        this.showEndVote = false
        this.isVote = false
        if (resp.data && resp.data.list) {
          this.voteItem = resp.data.list[0]
          this.$set(this.voteItem, "isCountA", true)
          this.$set(this.voteItem, "isCountB", true)
          this.$set(this.voteItem, "progressA", 0)
          this.$set(this.voteItem, "progressB", 0)
          this.$set(this.voteItem, "countAB", 0)
          if (this.voteItem && this.voteItem.status == 1) {
            this.showVote = true
          }
        }
      } catch (error) {}
    },
    __ag__onVote__() {
      this.isVote = true
      this.showVote = false
      this.showEndVote = false
    },
    voteClose() {
      this.isVote = false
      this.showVote = true
      this.showEndVote = false
    },
    resultVote() {
      this.isVote = false
      this.showVote = false
    },
    async __ag__getListFaq__() {
      try {
        let resp = await api.listFaq({ label: "question" })
        if (resp && resp.data && resp.data.length) {
          this.listFaq = resp.data
        }
      } catch (error) {}
    },
  },
}
</script>

<style scoped lang="less">
@import "./style/theme.less";
.__ag__live__ {
  /* padding-top: 20px; */
  background-color: #000;
}
.__ag__livetitle__ {
  padding-left: 10px;
  padding-right: 10px;
  height: 80px;
  background-color: #000;
}
/* .__ag__livetitleipx__ {
		padding-top: 34wx;
		height: 148px;
	} */
/* .live-ipx {
		padding-bottom: 34px;
	} */
.__ag__livenvideo__ {
  width: 750px;
  height: 421.875px;
  position: relative;
}
.__ag__livechatcontentslider__ {
  flex: 1;
  background-color: #ededed;
}
.__ag__livechatcontent__ {
  /* // bottom: 0px; */
  width: 750px;
  flex: 1;
  position: relative;
}
.__ag__anchorinfo_main__ {
  width: 750px;
  height: 80px;
  background-color: #fff;
  flex-direction: row;
  align-items: center;
  border-bottom-style: solid;
  border-bottom-width: 2px;
  border-bottom-color: #ededed;
  padding-left: 24px;
  padding-right: 24px;
}
.__ag__anchorinfo_lf__ {
  flex-direction: row;
  align-items: center;
  padding-right: 16px;
  border-right-style: solid;
  border-right-width: 1px;
  border-right-color: #ededed;
}
.__ag__anchorinfo_image__ {
  width: 36px;
  height: 36px;
  border-radius: 50wx;
}
.__ag__other_image__ {
  background-color: @main-color;
}
.__ag__anchorinfo_name__ {
  font-style: normal;
  font-weight: 500;
  font-size: 14wx;
  text-align: center;
  color: #000000;
  margin-left: 8px;
  margin-right: 8px;
}
.__ag__anchorinfo_text__ {
  font-style: normal;
  font-weight: 500;
  font-size: 14wx;
  text-align: center;
  color: #000000;
}

.__ag__anchorinfo_rg__ {
  flex: 1;
  margin-right: 16px;
}
.__ag__anchorinfo_scroll__ {
  flex: 1;
  flex-direction: row;
  align-items: center;
}
.__ag__anchorinfo_item__ {
  height: 60px;
  line-height: 60px;
  padding-left: 16px;
  padding-right: 16px;
  font-style: normal;
  font-weight: 500;
  font-size: 13wx;
  color: #acacac;
  lines: 1;
  text-overflow: ellipsis;
}
.__ag__item_border__ {
  border-right-style: solid;
  border-right-width: 1px;
  border-right-color: #ededed;
}
.__ag__anchorinfo_control__ {
  flex-direction: row;
  align-items: center;
}
.__ag__length__ {
  font-style: normal;
  font-weight: 500;
  font-size: 13wx;
  color: #acacac;
  padding-left: 5px;
  padding-right: 5px;
}
.__ag__video__ {
  color: #acacac;
}

.__ag__livechathead__ {
  width: 750px;
  height: 80px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  background-color: #ffffff;
  border-bottom-style: solid;
  border-bottom-width: 1px;
  border-bottom-color: rgba(0, 0, 0, 0.1);
}
.__ag__livechattab__ {
  flex: 1;
  height: 80px;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  position: relative;
}
.__ag__tab_image__ {
  width: 50px;
  height: 60px;
  position: absolute;
  right: -10px;
  top: -10px;
}
.__ag__chat_image__ {
  right: 20px;
}
.__ag__livechattabtext__ {
  height: 74px;
  line-height: 74px;
  font-weight: 500;
  font-size: 25px;
  letter-spacing: 0.05em;
  transition: color 0.5s;
  transition: border-bottom-color 0.5s;
  display: flex;
  align-items: center;
  color: #000;
  border-bottom-style: solid;
  border-bottom-color: #ffffff;
  border-bottom-width: 3wx;
}
.selected {
  color: @main-color;
  border-bottom-color: @main-color;
}
.__ag__livezb__ {
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 0px;
  width: 750px;
  background-color: #ededed;
}
.__ag__livegz__ {
  /* position: absolute; */
  flex: 1;
  width: 750px;
  background-color: #ededed;
}
.__ag__livezbmsg__ {
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 0px;
  flex: 1;
  width: 750px;
  background-color: #ededed;
}
.__ag__livelt__ {
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 0px;
  /* flex: 1; */
  width: 750px;
  /* background-color: #EDEDED; */
}
.__ag__liveltipx__ {
  bottom: 34px;
}
.__ag__livemh__ {
  width: 750px;
  padding: 10px;
  padding-right: 20px;
  padding-left: 20px;
  background-color: #fff;
}
.__ag__livemessage__ {
  width: 750px;
  padding: 12px;
  padding-bottom: 0px;
}
.__ag__livesend__ {
  position: absolute;
  bottom: 0px;
  width: 750px;
  height: 90px;
  background-color: #f7f7f7;
  padding: 16px;
  padding-right: 15px;
  padding-left: 15px;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.__ag__toupiao_img__ {
  width: 118px;
  height: 118px;
  position: absolute;
  right: 0;
  bottom: 144px;
}
.__ag__toupiao_img_ipx__ {
  bottom: 178px;
}
.__ag__enteriroominfo__ {
  position: absolute;
  bottom: 90px;
  width: 750px;
  height: 80px;
  padding: 10px;
  padding-top: 0px;
  padding-bottom: 0px;
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #d6d6d6;
}
.__ag__enteriroominfoipx__ {
  bottom: 124px;
}
.__ag__enteriroominfotext__ {
  color: #333;
  font-size: 13wx;
}
.__ag__enteriroomnametext__ {
  color: @main-color;
  padding: 5px;
  padding-top: 0px;
  padding-bottom: 0px;
  font-size: 13wx;
  lines: 1;
  text-overflow: ellipsis;
}
.__ag__livesendipx__ {
  padding-bottom: 34px;
  height: 124px;
}
.__ag__livesendipxkey__ {
  height: 90px;
  padding-bottom: 22px;
}
.__ag__livesendinput__ {
  flex: 1;
  height: 60px;
  padding-left: 16px;
  padding-right: 16px;
  background-color: #fff;
  border-radius: 4px;
  margin-right: 30px;
}
.__ag__livesendbodyinput__ {
  font-size: 25px;
  color: rgba(0, 0, 0, 0.3);
  height: 60px;
  line-height: 60px;
  background-color: #fff;
  border-width: 0px;
  border-style: solid;
}
.__ag__chatitem__ {
  width: 60px;
  height: 60px;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  margin-right: 10px;
}
.__ag__livesendbodyinput__ .input-placeholder {
  color: #fefefe !important;
}
.__ag__livefs__ {
  width: 90px;
  height: 60px;
  padding: 6px;
  padding-left: 12px;
  padding-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  background-color: @main-color;
}
.__ag__livefstext__ {
  font-size: 20px;
  letter-spacing: 0.05em;
  color: #fff;
}
.__ag__notlive__ {
  padding-top: 50px;
  align-items: center;
  justify-content: center;
}
.__ag__notlivetext__ {
  color: #777777;
  font-size: 30px;
}
.__ag__liveltdl__ {
  width: 700px;
  margin-right: 25px;
  margin-left: 25px;
  background-color: @main-color;
  border-radius: 4px;
  height: 80px;
  margin-top: 30px;
  align-items: center;
  justify-content: center;
}
.__ag__liveltdltext__ {
  color: #fff;
  font-size: 20wx;
  font-style: normal;
  font-weight: 500;
}
.show {
  left: 0;
}
.hide {
  left: 750px;
}
.ipx {
  bottom: 34wx;
}
.__ag__chatemotion__ {
  position: fixed;
  bottom: 0px;
  width: 750px;
  height: 300wx;
  background-color: #ffffff;
  left: 0px;
}
.emotion-ipx {
  padding-bottom: 34wx;
}
.__ag__socketerror__ {
  position: fixed;
  margin-left: 100px;
  margin-right: 100px;
  width: 550px;
  bottom: 124px;
  background-color: rgba(128, 128, 128, 0.1);
  align-items: center;
  justify-content: center;
  border-radius: 5px;
}
.__ag__socketerrortext__ {
  color: #999999;
  font-size: 16wx;
}
.__ag__keyboardsize__ {
  background-color: #000;
}
.__ag__switch_popup__ {
  width: 750px;
  background-color: rgba(0, 0, 0, 0.4);
  position: fixed;
  top: 535.875px;
  bottom: 0px;
}
.popup-ipx {
  top: 565.875px;
}
.video_full {
  height: 700px;
  position: fixed;
  top: 0;
  bottom: 0px;
  left: 0;
  right: 0;
}
.video_full_ivx {
  height: 700px;
  position: fixed;
  bottom: 0px;
  left: 0;
  right: 0;
}
.__ag_chat_danmu__ {
  position: absolute;
  top: 0px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  padding: 5px;
  padding-left: 10px;
  padding-right: 10px;
}
.__danmu_text__ {
  color: #fff;
  font-size: 24px;
  flex-direction: row;
  align-items: center;
}
.__ag__has_link__ {
  background-color: rgba(250, 180, 11, 0.7);
  transition-duration: 15s;
}
.__ag__full_message__ {
  position: absolute;
  width: 253wx;
  height: 400.875px;
  bottom: 50wx;
  border-radius: 4wx;
  overflow: hidden;
  left: 750px;
}
.full-show {
  left: 30wx;
}
.__ag__liveupnotdiv__ {
  flex: 1;
  align-items: center;
  justify-content: center;
}
.__ag__liveupnotimg__ {
  width: 100px;
  height: 70px;
}
.__ag__messageList__ {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}
.__message_text__ {
  line-height: 25wx;
  color: #fff;
  background-color: rgba(37, 37, 37, 0.7);
  opacity: 1;
  margin-bottom: 10wx;
  padding: 5px;
  padding-left: 16wx;
  padding-right: 16wx;
}
.last-text {
  margin-bottom: 0wx;
}
.__item_0 {
  opacity: 0.1;
}
.__item_1 {
  opacity: 0.3;
}
.__item_2 {
  opacity: 0.5;
}
.__item_3 {
  opacity: 0.7;
}
.__item_4 {
  opacity: 1;
}
</style>
<style>
.weex-slider-inner {
  flex: 1;
}
</style>
