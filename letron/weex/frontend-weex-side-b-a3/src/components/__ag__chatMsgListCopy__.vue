<template>
  <div
    class="__ag__msgchat__"
    :class="[keyboardSize != '0px' && ipx ? '__ag__msgchattop__' : '']"
  >
    <ag-keyboardsize v-if="!islive" ref="chatkeyboardsize"></ag-keyboardsize>
    <div class="__ag__msgchattitle__" v-if="!iszb">
      <ag-chattitle
        :islive="islive"
        @onBackPress="onBackPress"
        :name="name1"
        :isgroup="isgroup"
      ></ag-chattitle>
    </div>
    <scroller
      class="__ag__msgchatscroller__"
      :class="[keyboardSize == '0px' && ipx ? 'ipx' : '']"
      :show-scrollbar="false"
      @click="__ag__clickLive__"
    >
      <refresh
        class="__ag__refresh__"
        v-if="!iszb"
        @refresh="onrefresh"
        @pullingdown="onpullingdown"
        :display="a__ag__refreshing__ ? 'show' : 'hide'"
      >
        <text class="__ag__refreshtext__">{{ a__ag__freshText__ }}</text>
        <loading-indicator class="__ag__loading__"></loading-indicator>
      </refresh>
      <div
        class="__ag__msgcontent__"
        v-for="(n, index) in messageList"
        :key="n.id + '-' + index"
        :id="'i' + n.id"
        :ref="'i-' + n.id"
      >
        <div class="__ag__msgtime__">
          <text class="__ag__msgtimetext__">{{ n.showDate }}</text>
        </div>
        <div class="__ag__msglink__" v-if="n.url">
          <ag-chatlink :n="n"></ag-chatlink>
        </div>
        <div
          class="__ag__msgitementer__"
          v-else-if="n.messageType == 2 && n.type == vars.TYPE_ENTER"
        >
          <text
            >「{{
              n.senderName ||
              (n.joinMap && n.joinMap.u && n.joinMap.u.userNicename)
            }}」</text
          >
          <text class="__ag__msgitementertext__">邀请</text>
          <text>{{ getJsonRefContent(n.refContent) }} </text>
          <text class="__ag__msgitementertext__">加入群组</text>
        </div>
        <div
          v-else
          class="__ag__msgcontentleft__"
          :class="[msgRight(n) ? '__ag__msgcontentright__' : '']"
        >
          <!-- 头像 -->
          <ag-userimg
            class="__ag__msguserimg__"
            :name="senderName(n)"
            :isNotImage="true"
            :avatar="
              (n.joinMap && n.joinMap.u && n.joinMap.u.avatar) || n.avatar
            "
          ></ag-userimg>

          <div
            class="__ag__msguserleftcontent__"
            :class="[msgRight(n) ? '__ag__msguserrightcontent__' : '']"
          >
            <!-- 用户名 -->
            <text class="__ag__msgusername__" v-if="n.messageType == 2">{{
              senderName(n)
            }}</text>

            <!-- 图片类型 -->
            <image
              v-if="n.contentType == 3"
              class="__ag__msgusercontentimg__"
              ref="images"
              @click="clickImg(n.content)"
              :style="imageStyle(n)"
              resize="cover"
              :src="__ag__url__(n.content)"
              @load="loadimg($event, n)"
            ></image>

            <!-- 视频类型 -->
            <video
              v-if="n.contentType == 5"
              class="__ag__video__"
              controls
              :src="__ag__url__(n.content)"
            ></video>

            <div
              v-if="n.jsonContent && n.contentType != 5"
              class="__ag__msgusercontent__"
              :class="[
                msgRight(n) ? '__ag__msgusertextright__' : '',
                n.hi ? '__ag__msgusertextimg__' : '',
              ]"
            >
              <div
                v-for="(ji, index) in n.jsonContent"
                :key="'jc' + n.id + '-' + index"
              >
                <!-- 文本类型 -->
                <text
                  v-if="ji.type == 'text'"
                  class="__ag__msgusertext__ long-press"
                  @longpress="handleLongPress"
                  :class="[isLong ? 'long-press' : '']"
                  >{{ ji.content }}</text
                >
                <!-- 表情图片类型 -->
                <image
                  v-if="ji.type == 'image'"
                  class="__ag__msgcontentimg__"
                  lazy-load
                  mode="widthFix"
                  :src="__ag__url__(ji.content)"
                ></image>
                <!-- 链接类型 -->
                <text
                  class="__ag__msgusertexthttp__ long-press"
                  :class="[isLong ? 'long-press' : '']"
                  v-if="ji.type == 'http'"
                  @click="msgUrlTo(ji.content)"
                  @longpress="handleLongPress"
                  >{{ ji.content }}</text
                >
              </div>
              <div
                class="__ag__isaddfriend__"
                v-if="n.type == vars.TYPE_ADD_FRIEND && iszb && hasFriend"
              >
                <text class="agiconfont __ag__buttonaddfriend__">&#xe6cb;</text>
                <text class="__ag__buttonaddfriend__">好友</text>
              </div>
              <div
                class="__ag__notaddfriend__"
                @click="onbangding"
                v-if="
                  iszb && n.type == vars.TYPE_BANG && user && user.userType == 3
                "
              >
                <text class="agiconfont __ag__notaddfriendtext__"
                  >&#xe6cf;</text
                >
                <text class="__ag__notaddfriendtext__">立即绑定</text>
              </div>
              <div
                class="__ag__isaddfriend__"
                v-if="
                  iszb && n.type == vars.TYPE_BANG && user && user.userType < 3
                "
              >
                <text class="agiconfont __ag__buttonaddfriend__">&#xe6cf;</text>
                <text class="__ag__buttonaddfriend__">已绑定</text>
              </div>
            </div>
            <text
              v-if="!msgRight(n) && !n.hi && n.contentType != 3"
              class="agiconfont corners"
              :class="[n.messageType != 2 ? 'notgroup' : '']"
              >&#xe65f;</text
            >
            <text
              v-if="
                msgRight(n) && !n.hi && n.contentType != 3 && n.contentType != 5
              "
              class="agiconfont cornersright"
              :class="[n.messageType != 2 ? 'notgroup' : '']"
              >&#xec65;</text
            >
          </div>
        </div>
      </div>
      <div
        class="__ag__addfriend__"
        :class="[ipx ? '__ag__addfriend_ipx__' : '']"
        v-if="iszb && !hasFriend"
        @click="__ag__addFriend__"
      >
        <text class="agiconfont __ag__notaddfriendtext__">&#xe6b0;</text>
        <text class="__ag__notaddfriendtext__">加好友</text>
      </div>
    </scroller>
    <div class="__ag__msgsend__" :class="[ipx ? '__ag__msgsend_ipx__' : '']">
      <div
        class="__ag__livesendinput__"
        :class="[a__ag__content__ ? '__ag__iscontent__' : '']"
      >
        <input
          :placeholder="isUser"
          class="__ag__livesendbodyinput__"
          ref="inputref"
          v-model="a__ag__content__"
          return-key-type="send"
          :hideDoneButton="true"
          @return="__ag__keyboard__"
          @confirm="__ag__send__"
          @keyboard="keyboard"
          @input="__ag__onkeyup__"
          @focus="__ag__focus__"
        />
      </div>
      <div class="__ag__chatitem__" @click="__ag__onEmotion__">
        <text class="agiconfont __ag__vector__">&#xe69c;</text>
      </div>
      <div class="__ag__chatitem__">
        <!-- <div class="__ag__chat_upload__">
                    <text class="agiconfont __ag__vector__ __ag__upload__">&#xe6dd;</text>
                </div>
                <web ref="webview" class="__ag__web__" :src="webUrl" @pagefinish="onPageFinish"
                    @pagestart="onPageStart"></web> -->
        <div class="__ag__chatitem__" @click="__ag_imgcorp__">
          <text class="agiconfont __ag__vector__">&#xe6dd;</text>
        </div>
      </div>
      <div class="__ag__livefs__" v-if="a__ag__content__" @click="__ag__send__">
        <text class="__ag__livefstext__">发送</text>
      </div>
    </div>

    <ag-keyboardheight :keyboard="true"></ag-keyboardheight>

    <div
      class="__ag__chatemotion__"
      v-if="isemotion"
      :class="[ipx ? 'emotion-ipx' : '']"
    >
      <ag-emotion @click="__ag__clickHeibai__"></ag-emotion>
    </div>
    <div class="__ag__atuser__" v-if="atUserShow && type == 2">
      <ag-atuser
        :list="atUserList2"
        @atUser="atUser"
        @onclose="atUserShow = false"
      ></ag-atuser>
    </div>
    <ag-popup
      class="__ag__imgpopup__"
      v-if="imgPopup"
      @closePopup="
        imgPopup = false
        imgPopupUrl = ''
      "
      :isAnimate="imgPopup"
    >
      <image
        ref="imageref"
        @click="imgsave"
        resize="contain"
        :src="__ag__url__(imgPopupUrl)"
        class="__ag__imgpopupurl__"
      ></image>
    </ag-popup>
  </div>
</template>

<script>
import agMinix from "./__ag__minix__.js"
import userImg from "./__ag__userImg__.vue"
import util from "./util.js"
import chattitle from "./__ag__chatTitle__.vue"
import chatlink from "./__ag__chatLink__.vue"
import vars from "./vars.js"
import env from "./env.js"
import sport from "./__ag__sport__.js"
import bc from "./__ag__bc__.js"
import agMinUrl from "./__ag__minurl__.js"
import keyboardsize from "./__ag__keyboardSize__.vue"
import keyboardHeight from "./__ag__bottomHeight__.vue"
import emotion from "./__ag__emotion__.vue"
import atuser from "./__ag__atUser__.vue"
import agPopup from "./__ag__popup__.vue"
import __ag__sport_api__ from "./__ag__sport_api__.js"
let dom = undefined
let seq = -1
let weq = -10000
const clipboard = weex.requireModule("clipboard")
export default {
  mixins: [agMinix, agMinUrl],
  components: {
    "ag-userimg": userImg,
    "ag-chattitle": chattitle,
    "ag-chatlink": chatlink,
    "ag-keyboardsize": keyboardsize,
    "ag-keyboardheight": keyboardHeight,
    "ag-emotion": emotion,
    "ag-atuser": atuser,
    "ag-popup": agPopup,
  },
  props: {
    uid: {
      type: String,
      default: "", // 好友的id 或者是群聊的id
    },
    type: {
      type: String,
      default: "0",
    },
    name: {
      type: String,
      default: "",
    },
    islive: {
      type: Boolean,
      default: false,
    },
    iszb: {
      type: Boolean,
      default: false,
    },
    ofUpinfo: {
      type: Object,
      default: function () {
        return {}
      },
    },
    user: {
      type: Object,
      default: function () {
        return {}
      },
    },
  },
  data() {
    return {
      a__ag__isFreshing__: false,
      a__ag__freshing__: false,
      a__ag__triggered__: false,
      a__ag__freshText__: "释放更新",
      a__ag__refreshing__: false,
      a__ag__content__: "",
      a__ag__pageMsgForm__: { size: 20, page: 1, friendId: 0, toId: null },
      a__ag__pageMsgGroup__: { size: 20, page: 1, groupId: 0, toId: null },
      a__ag__messageList__: [],
      isgroup: false,
      name1: "",
      vars,
      env,
      keyboardSize: "0px",
      loading: false,
      isemotion: false,
      hasFriend: false,
      addFriending: false,
      zbtiem: 0,
      isLong: false,
      atUserShow: false,
      atUserWord: "",
      atUserList: [],
      imgPopup: false,
      imgPopupUrl: "",
      issocket: false,
      webUrl: "./upload.html?host=" + env.host,
    }
  },
  watch: {
    uid(n) {
      // this.iszb= false
      // this.a__ag__messageList__ = []
      //
      console.log("data=====2", n)
      if (n) {
        this.__ag__loadData__()
      }
    },
    name(n) {
      this.name1 = n
    },
    user(n) {
      // this.__ag__loadData__()
    },
  },
  computed: {
    msgsendstyle() {
      // :class="[ipx?'__ag__msgsendipx__':'',keyboardSize!='0px' && ipx ? '__ag__msgsendipxkey__':'']"
      // .__ag__msgsendipx__ {
      // height: ;
      // padding-bottom: ;
      // }
      // .__ag__msgsendipxkey__ {
      // height: 90px;
      // padding-bottom: 0px;
      // }
      let style = {}
      // if(!this.ipx || this.keyboardSize!='0px'){
      //     style.height = "190px"
      //     style.paddingBottom = "122px"
      // } else {
      //     style.height = "124px"
      //     style.paddingBottom = "34px"
      // }
      style.height = "124px"
      style.paddingBottom = "34px"
      return style
    },
    isUser() {
      if (this.iszb && !this.hasFriend) {
        return "添加主播回复主播助理信息"
      }
      return "发送消息"
    },
    messageList() {
      if (!this.a__ag__messageList__ || this.a__ag__messageList__.length == 0) {
        return []
      }
      let map = {}
      let list = []
      for (let i in this.a__ag__messageList__) {
        let r = this.a__ag__messageList__[i]
        let m = map[r.id]
        if (m && m.id) {
          continue
        }
        map[r.id] = r
        list.push(r)
      }
      return list
    },
    atUserList2() {
      let w = this.atUserWord
      return this.atUserList.filter((r) => {
        if (this.user && r.uid == this.user.id) {
          return false
        }
        if (!w) {
          return true
        }
        if (!r.userNicename) {
          return false
        }

        if (r.userNicename.indexOf(w) == -1) {
          return false
        }
        return true
      })
    },
  },
  mounted() {
    this.name1 = this.name
  },
  destroyed() {
    this.__ag__clickLive__()
  },
  created() {
    let that = this
    let globalEvent = weex.requireModule("globalEvent")
    globalEvent.addEventListener(
      "WXApplicationWillResignActiveEvent",
      function (e) {
        that.checkPageMoreMsg()
      }
    )
  },
  methods: {
    onPageStart(e) {
      let data = util.getUrlJson(e.url)
      if (data) {
        console.log("d---", data.url)
        if (data.code == 200) {
          util.message("上传成功")
          if (data.type == "img") {
            let content = data.data
            this.__ag__imgSend__(content)
          } else {
            this.__ag__videoSend__(data)
          }
        } else if (data.code == 500) {
          util.message("上传失败")
        } else if (data.code == 400) {
          util.message("网络超时")
        } else if (data.code == 403) {
          util.message("请选择图片或视频")
        } else if (data.code == 4) {
          util.message("上传图片大小不能超过 8MB!")
        } else if (data.code == 100) {
          util.message("上传视频大小不能超过 100MB!")
        } else if (data.code == 202) {
          // let user = util.getItem('user')
          // let f = {}
          // f.contentType = 3
          // f.messageType = 3
          // f.content = data.data
          // f.uid = user.id
          // f.senderId = user.id
          // f.joinMap = {
          //     u: {
          //         avatar: user.avatar,
          //         userNicename: user.userNicename
          //     }
          // }
          console.log("edit== ", util.toString(f))
          // this.__ag__addMessage__(r)
        }
      }
    },
    onPageFinish(e) {},
    imageStyle(n) {
      let style = { width: n.width || "130px", height: n.height || "130px" }
      return style
    },
    loadimg(e, n) {
      if (e.success) {
        let s = util.reszeImage(e.size.naturalWidth, e.size.naturalHeight)
        let w = s.w + "px"
        let h = s.h + "px"
        this.$set(n, "width", w)
        this.$set(n, "height", h)
      }
    },
    imgsave() {
      const $img = this.$refs.imageref
      if ($img) {
        const modal = weex.requireModule("modal")
        modal.confirm(
          {
            message: "是否保存图片",
            duration: 0.3,
            okTitle: "确认",
            cancelTitle: "取消",
          },
          function (value) {
            if (value == "确认") {
              $img.save((res) => {
                if (res.success) {
                  util.message("保存成功")
                }
              })
            }
          }
        )
      }
    },
    atUser(item) {
      this.atUserShow = false
      let i = this.a__ag__content__.lastIndexOf("@")
      if (i == -1) {
        this.a__ag__content__ += "@" + item.userNicename + " "
      } else {
        this.a__ag__content__ =
          this.a__ag__content__.substr(0, i + 1) + item.userNicename + " "
      }
    },
    __ag__focus__() {
      this.checkPageMoreMsg()
    },
    checkPageMoreMsg() {
      if (this.type == 3) {
        this.getMoreMsg()
      }
      if (this.type == 2) {
        this.getMoreGroupMsg()
      }
    },
    async getMoreMsg() {
      if (!this.issocket) {
        console.log("aa---socket", this.issocket)
        return
      }
      let friendId = this.a__ag__pageMsgForm__.friendId || ""
      let f = {
        friendId: friendId,
        page: 1,
        size: 20,
        fromId: this.getLastId(),
      }
      if (!f.fromId) {
        console.log("aa---fromId", "!f.fromId")
        return
      }
      if (this.loading) {
        return
      }
      this.loading = true

      try {
        let data = await this.__ag__loadMsg__(f)
        let list = data && data.list
        console.log("aa---f", util.toString(list))
        this.loading = false
        if (list && list.length > 0) {
          list.reverse().forEach((r) => {
            this.__ag__addMessage__(r)
          })
          let r = list[list.length - 1]
          sport.subFriendUnread.call(this, list, this.uid)
          this.__ag__goscroll__(r.id)
        }
      } catch (err) {
        this.loading = false
        util.message(err.message)
      }
    },
    async getMoreGroupMsg() {
      if (!this.issocket) {
        console.log("aa---socket", this.issocket)
        return
      }
      let groupId = this.a__ag__pageMsgGroup__.groupId || ""
      let f = {
        groupId: groupId,
        size: 20,
        fromId: this.getLastId(),
      }
      if (!f.fromId) {
        console.log("aa---fromId", f.fromId)
        return
      }
      if (this.loading) {
        return
      }
      this.loading = true

      try {
        let data = await this.__ag__loadGroupMsg__(f)
        this.loading = false
        let list = data && data.list
        if (list && list.length > 0) {
          list.reverse().forEach((r) => {
            this.__ag__addMessage__(r)
          })
          let r = list[list.length - 1]
          this.__ag__goscroll__(r.id)
        }
      } catch (err) {
        this.loading = false
        util.message(err.message)
      }
    },
    getLastId() {
      let list = this.a__ag__messageList__
      if (!list || !list.length) {
        console.log(list)
        return 1
      }
      for (let i = list.length - 1; i >= 0; i--) {
        let id = list[i].id
        if (id > 0) {
          return id
        }
      }
      return 1
    },
    __ag__onkeyup__(e) {
      console.log("con==", util.toString(e.target))
      let a = e.target && e.target.attr
      this.atUserWord = ""
      // // console.log(a)
      if (!this.atUserShow) {
        if (a.value == "@") {
          this.atUserShow = true
          return
        }
        // console.log(a.detail.value.lastIndexOf('@') )
        if (a.value.lastIndexOf("@") != -1) {
          let val = a.value
          if (/@$/g.test(val)) {
            this.atUserShow = true
            return
          }
        }
      }
      if (this.atUserShow) {
        let el = a
        let val = el.value
        let ei = val.lastIndexOf("@")
        // console.log(ei)
        if (ei == -1) {
          this.atUserShow = false
          return
        }
        this.atUserWord = val.substr(ei + 1)
      }
    },
    __ag_imgcorp__() {
      let options = {
        includeExif: true,
        mediaType: "photo",
        cropping: false,
        includeBase64: true,
      }
      bc.postMessage("imgcorp", options)
    },
    handleLongPress(e) {
      this.isLong = true
      let val = e.target.attr.value
      clipboard.setString(val)
      this.isLong = false
      util.message("已复制")
    },
    __ag__clickLive__() {
      this.isemotion = false
      let ipt = this.$refs.inputref
      if (ipt) {
        ipt.blur()
      }
    },
    __ag__clickFoucs__() {
      this.isemotion = false
      let ipt = this.$refs.inputref
      if (ipt && this.hasFriend) {
        ipt.focus()
      }
    },
    onbangding() {
      util.getPush("__ag__bangding__")
    },
    async __ag__addFriend__() {
      if (this.addFriending) {
        return
      }
      this.addFriending = true
      let item = this.ofUpinfo
      let f = {
        friendId: item.assistId,
        remark: this.name,
        uid: item.upId,
      }
      try {
        let resp = await this.__ag__editFriend__(f)
        util.message("添加好友成功")
        this.addFriending = false
        this.hasFriend = true
        if (this.ofUpinfo.joinMap && this.ofUpinfo.joinMap.f) {
          this.ofUpinfo.joinMap.f = resp.data
        }
        await this.__ag__ofUpmsg__()
      } catch (error) {
        this.addFriending = false
        util.message("无法添加好友")
      }
    },
    onBackPress() {
      this.$emit("onBackPress")
    },
    async __ag__clickHeibai__(i) {
      let content = "[" + i + "]"
      if (this.loading) {
        util.message("请稍候...")
        return
      }
      let f = this
      let type = f.type
      let id = this.uid
      if (!id) {
        util.message("请选择接收对象")
        return
      }
      if (!i) {
        util.message("请输入聊天信息")
        return
      }
      let sendForm = {}
      sendForm.content = content
      this.loading = true
      // this.autoScroll = true
      if (type == 2) {
        sendForm.groupId = id
        try {
          let resp = await this.__ag__editGroupMsg__(sendForm)
          // let r = resp.data
          // this.addMessage(r)
          // this.a__ag__content__ = ''
          this.isemotion = false
          this.loading = false
        } catch (err) {
          this.loading = false
          util.message(err.message)
        }
        return
      }
      if (type == 3) {
        sendForm.tid = id
        try {
          let resp = await this.__ag__editMsg__(sendForm)
          let r = resp.data
          this.__ag__addMessage__(r)
          this.__ag__goscroll__(r.id)
          this.isemotion = false
          this.loading = false
        } catch (err) {
          this.loading = false
          util.message(err.message)
        }
        return
      }
    },
    __ag__onEmotion__() {
      this.isemotion = true
    },
    keyboard(event) {
      bc.postMessage("keyboardSize", event)
      if (this.ipx) {
        this.keyboardSize = util.keyboardHeights(event) + "px"
      } else {
        this.keyboardSize = util.keyboardHeight(event) + "px"
      }
      if (this.islive) {
        let e = {
          keyboardSize: event.keyboardSize,
        }
        this.$emit("keyboard", e)
        return
      }
      if (this.a__ag__messageList__ && this.a__ag__messageList__.length > 0) {
        let r = this.a__ag__messageList__[this.a__ag__messageList__.length - 1]
        this.__ag__goscroll__(r.id)
      }
      this.$refs.chatkeyboardsize.keyboardSize(this.keyboardSize)
    },
    msgUrlTo(href) {
      // util.message(href)
      sport.urlTo({ url: href })
    },
    clickImg(img) {
      // let url = this.__ag__url__(img)
      // util.getPush('__ag__web__',{url:url})
      this.imgPopupUrl = img
      this.imgPopup = true
    },
    getJsonRefContent(content) {
      try {
        let userlist = JSON.parse(content)
        let msg = "「"
        for (let i in userlist) {
          let r = userlist[i]
          if (r.nicename) {
            if (msg.length > 1) {
              msg += "、" + r.nicename
            } else {
              msg += r.nicename
            }
          }
        }
        msg += "」"
        return msg
      } catch (e) {
        return ""
        //TODO handle the exception
      }
    },
    __ag__keyboard__() {
      this.__ag__send__()
      this.__ag__clickLive__()
    },
    __ag__goscroll__(id) {
      if (!dom) {
        dom = weex.requireModule("dom")
      }
      setTimeout(() => {
        const indicatorId = "i-" + id
        const indicator = this.$refs[indicatorId][0]
        if (indicator) {
          const el = indicator
          dom.scrollToElement(el, {})
        }
      }, 500)
    },
    async __ag__send__() {
      if (this.loading) {
        util.message("请稍候...")
        return
      }
      if (this.iszb && !this.hasFriend) {
        util.message("请添加主播")
        return
      }
      let f = this
      let type = f.type
      let id = this.uid
      console.log("12===", this.uid)
      if (!id) {
        util.message("请选择接收对象")
        return
      }
      if (!this.a__ag__content__) {
        util.message("请输入聊天信息")
        return
      }
      let sendForm = {}
      sendForm.content = this.a__ag__content__
      this.loading = true
      // this.autoScroll = true
      if (type == 2) {
        sendForm.groupId = id
        try {
          let resp = await this.__ag__editGroupMsg__(sendForm)
          // let r = resp.data
          // this.addMessage(r)
          this.a__ag__content__ = ""
          this.loading = false
          this.__ag__clickLive__()
        } catch (err) {
          this.loading = false
          util.message(err.message)
        }
        return
      }
      if (type == 3) {
        sendForm.tid = id
        try {
          let resp = await this.__ag__editMsg__(sendForm)
          let r = resp.data
          console.log("edit==", util.toString(r))
          this.__ag__addMessage__(r)
          this.__ag__goscroll__(r.id)
          this.a__ag__content__ = ""
          this.loading = false
          this.__ag__clickLive__()
        } catch (err) {
          this.loading = false
          util.message(err.message)
        }
        return
      }
    },
    senderName(n) {
      let name =
        n.senderName ||
        n.userNicename ||
        (n.joinMap && n.joinMap.u && n.joinMap.u.userNicename)
      return name || "游"
    },
    msgRight(n) {
      if (this.user && this.user.id == n.senderId) {
        return true
      }
      return false
    },
    __ag__addMessage__(msg, prev) {
      let l = this.a__ag__messageList__
      if (msg.contentType != 3) {
        let jsonContent = sport.jsonContent(msg.content, msg)
        msg.jsonContent = jsonContent
      }
      if (msg.contentType == 3) {
        msg.imgload = false
      }
      let len = l.length

      let last = undefined
      if (len > 0) {
        last = prev ? l[0] : l[len - 1]
      }
      msg.showDate = this.showDate(msg, last)
      if (prev) {
        l.unshift(msg)
      } else {
        l.push(msg)
        // util.message(this.a__ag__messageList__.length)
      }
    },
    showDate(cur, last) {
      let t1 = this.getTime(cur)
      if (!last) {
        return util.dateFormat(t1, "yyyy-MM-dd HH:mm:ss")
      }
      let t0 = this.getTime(last)
      let t = t1.getTime() - t0.getTime()
      if (t < 0) t = -t
      if (t <= 300000) {
        return ""
      }
      return util.dateFormat(t1, "yyyy-MM-dd HH:mm:ss")
    },
    getTime(msg) {
      let t1 = msg.time
      if (!t1 || typeof t1 == "string") {
        let ts = msg.addTime || msg.createTime
        t1 = util.parseDate(ts)
        msg.time = t1
      }
      return t1
    },
    __ag__onmsg__(msg) {
      if (!msg) {
        return
      }
      for (let i in msg) {
        let r = msg[i]
        if (
          r.type == vars.TYPE_ENTER &&
          r.messageType == this.type &&
          r.messageType != 2
        ) {
          continue
        }
        if (r.type == vars.TYPE_LEAVE) {
          continue
        }
        //过滤重复消息
        if (
          this.ofUpinfo &&
          r.senderId == this.ofUpinfo.assistId &&
          r.type == 1 &&
          r.messageType == 3
        ) {
          this.ofUpinfo.joinMap.f = {
            id: r.refId,
          }
          this.hasFriend = true
        }
        let list = this.a__ag__messageList__
        let msgLen = list.length - 1
        if (r.type != vars.TYPE_LIVE_UPDATE && msgLen >= 0) {
          let lastMsg = list[msgLen]
          if (lastMsg.id == r.id && r.type != vars.TYPE_REMOVE_MESSAGE) {
            continue
          }
        }
        if (r.type == vars.TYPE_REMOVE_MESSAGE) {
          if (r.messageType == this.type) {
            sport.delMsg(this.a__ag__messageList__, r)
            continue
          }
        }
        if (r.message) {
          if (r.roomId == this.uid && r.type == vars.TYPE_LEAVE) {
            // this.talking=''
            r.content = "您已被移出该群聊"
            r.senderName = "系统消息"
            this.__ag__addMessage__(r)
            continue
          }
          if (r.roomId == this.uid && r.type == vars.TYPE_ENTER) {
            // this.talking=''
            r.content = "欢迎加入群聊"
            // r.senderName='系统消息'
            this.__ag__addMessage__(r)
          }
        }
        if (r.messageType == 2 && this.type == 2) {
          if (r.roomId == this.uid) {
            // util.message(r.roomId)
            r.avatar = r.senderAvator
            __ag__sport_api__
              .pageGroupMsg(this.a__ag__pageMsgGroup__)
              .then((resp) => {})
              .catch((err) => {
                console.log("获取数据失败")
              })
            this.__ag__addMessage__(r)
            this.__ag__goscroll__(r.id)
            r.status = 0
            // sport.subGroupUnread.call(this, [r],  this.uid)
          }
          console.log("a__ag__messageList__", this.a__ag__messageList__)
        }
        if (r.messageType == 3 && this.type == 3) {
          if (r.senderId == this.uid) {
            let c = r
            c.avatar = c.senderAvator
            __ag__sport_api__
              .pageMsg(this.a__ag__pageMsgForm__)
              .then((resp) => {})
              .catch((err) => {
                console.log("获取数据失败")
              })
            this.__ag__addMessage__(c)
            this.__ag__goscroll__(r.id)
            r.status = 0
            console.log("co---chat", util.toString(c))
            sport.subFriendUnread.call(this, [r], this.uid)
          }
        }
      }
    },
    async __ag__ofUpmsg__() {
      let tiem = new Date().getTime()
      if (this.zbtiem + 1000 > tiem) {
        // console.log("has===4",this.zbtiem,tiem)
        return
      }
      this.zbtiem = tiem
      this.a__ag__messageList__ = []
      this.a__ag__pageMsgForm__.friendId = this.uid
      this.hasFriend =
        this.ofUpinfo.joinMap &&
        this.ofUpinfo.joinMap.f &&
        this.ofUpinfo.joinMap.f.id
      if (this.ofUpinfo.welcome) {
        let welcome = this.ofUpinfo.welcome
        let id = --seq
        this.__ag__addOfUpmsg__(welcome, vars.TYPE_NORMAL, id)
      }
      if (!this.hasFriend) {
        // console.log("has===",this.hasFriend)
        let welcome = `我是您的专属助理${
          this.ofUpinfo &&
          this.ofUpinfo.joinMap &&
          this.ofUpinfo.joinMap.ass &&
          this.ofUpinfo.joinMap.ass.userNicename
        }，添加我为好友，会有更多优惠哟～`
        let welcome2 = `欢迎你来到${this.name1 || "我"}的直播间`
        let id = --seq
        let wid = --weq
        this.__ag__addOfUpmsg__(welcome, vars.TYPE_ADD_FRIEND, id)
        this.__ag__addOfUpmsg__(welcome2, vars.TYPE_ADD_FRIEND, wid)
      } else {
        let content = `谢谢你加${
          this.ofUpinfo &&
          this.ofUpinfo.joinMap &&
          this.ofUpinfo.joinMap.ass &&
          this.ofUpinfo.joinMap.ass.userNicename
        }为好友`
        this.__ag__addOfUpmsg__(content, vars.TYPE_NORMAL)
        let item = {
          id:
            this.ofUpinfo.joinMap &&
            this.ofUpinfo.joinMap.f &&
            this.ofUpinfo.joinMap.f.id,
          type: 3,
        }
        bc.postMessage("onchat", item)
        // console.log("has===1",this.a__ag__messageList__.length)
      }
      this.__ag__ofUpAddBing__(this.a__ag__messageList__)
      if (this.hasFriend) {
        await this.__ag__friendloadMsg__()
      }
    },
    __ag__ofUpAddBing__(list) {
      if (this.hasFriend && this.user && this.user.userType == 3) {
        let item = {
          content:
            "绑定电话号码，聊天消息不丟失，体验更多功能，还有机会获得神秘礼物！",
          type: vars.TYPE_BANG,
          messageType: 3,
          contentType: 1,
          senderName:
            this.ofUpinfo &&
            this.ofUpinfo.joinMap &&
            this.ofUpinfo.joinMap.ass &&
            this.ofUpinfo.joinMap.ass.userNicename,
          avatar:
            this.ofUpinfo &&
            this.ofUpinfo.joinMap &&
            this.ofUpinfo.joinMap.ass &&
            this.ofUpinfo.joinMap.ass.avatar,
          time: new Date(),
          id: new Date().getTime() + 3,
          senderId: this.ofUpinfo && this.ofUpinfo.assistId,
        }
        let jsonContent = sport.jsonContent(item.content, item)
        item.jsonContent = jsonContent
        list.push(item)
      }
    },
    __ag__addOfUpmsg__(content, type, id) {
      let item1 = {
        content: content,
        type: type,
        contentType: 1,
        messageType: 3,
        senderName:
          this.ofUpinfo &&
          this.ofUpinfo.joinMap &&
          this.ofUpinfo.joinMap.ass &&
          this.ofUpinfo.joinMap.ass.userNicename,
        avatar:
          this.ofUpinfo &&
          this.ofUpinfo.joinMap &&
          this.ofUpinfo.joinMap.ass &&
          this.ofUpinfo.joinMap.ass.avatar,
        time: new Date(),
        id: id || new Date().getTime(),
        senderId: this.ofUpinfo && this.ofUpinfo.assistId,
      }
      let jsonContent = sport.jsonContent(item1.content, item1)
      item1.jsonContent = jsonContent
      this.a__ag__messageList__.push(item1)
      console.log("has===2", util.toString(item1))
    },
    async __ag__videoSend__(data) {
      if (!data) {
        util.message("发送失败")
        return
      }
      let f = {
        content: data.data,
        contentType: 5,
      }
      let type = this.type
      let id = this.uid
      if (!id) {
        util.message("请选择接收对象")
        return
      }
      // this.autoScroll = true
      if (this.loading) {
        return
      }
      this.loading = true
      if (type == 2) {
        f.groupId = id
        try {
          let resp = await this.__ag__editGroupMsg__(f)
          // let r = resp.data
          // this.addMessage(r)
          // this.a__ag__content__ = ''
          this.isemotion = false
          this.loading = false
        } catch (err) {
          this.loading = false
          util.message(err.message)
        }
        return
      }
      if (type == 3) {
        f.tid = id
        try {
          let resp = await this.__ag__editMsg__(f)
          let r = resp.data
          console.log("edit==", util.toString(r))
          this.__ag__addMessage__(r)
          this.__ag__goscroll__(r.id)
          this.isemotion = false
          this.loading = false
        } catch (err) {
          this.loading = false
          util.message(err.message)
        }
        return
      }
    },
    async __ag__imgSend__(data) {
      if (!data) {
        return
      }
      let f = {
        content: data,
        contentType: 3,
      }
      let type = this.type
      let id = this.uid
      if (!id) {
        util.message("请选择接收对象")
        return
      }
      // this.autoScroll = true
      if (this.loading) {
        return
      }
      this.loading = true
      if (type == 2) {
        f.groupId = id
        try {
          let resp = await this.__ag__editGroupMsg__(f)
          // let r = resp.data
          // this.addMessage(r)
          // this.a__ag__content__ = ''
          this.isemotion = false
          this.loading = false
        } catch (err) {
          this.loading = false
          util.message(err.message)
        }
        return
      }
      if (type == 3) {
        f.tid = id
        try {
          let resp = await this.__ag__editMsg__(f)
          let r = resp.data
          console.log("edit==", util.toString(r))
          this.__ag__addMessage__(r)
          this.__ag__goscroll__(r.id)
          this.isemotion = false
          this.loading = false
        } catch (err) {
          this.loading = false
          util.message(err.message)
        }
        return
      }
    },
    onSocket(data) {
      this.issocket = !data
    },
    async __ag__loadData__() {
      let that = this
      const msg = new BroadcastChannel("msg")
      msg.onmessage = function (event) {
        that.__ag__onmsg__(event.data)
      }
      const imgsuccess = new BroadcastChannel("imgsuccess")
      imgsuccess.onmessage = function (event) {
        that.__ag__imgSend__(event.data)
      }

      const socket = new BroadcastChannel("socket")
      socket.onmessage = function (event) {
        that.onSocket(event.data)
      }

      this.a__ag__messageList__ = []
      try {
        if (this.iszb) {
          await this.__ag__ofUpmsg__()
          return
        }
        console.log("data=====3", this.type)
        if (this.type == "2") {
          this.isgroup = true
          this.a__ag__pageMsgGroup__.groupId = this.uid
          try {
            console.log("data=====1", util.toString(this.a__ag__pageMsgGroup__))
            let data = await this.__ag__loadGroupMsg__(
              this.a__ag__pageMsgGroup__
            )
            let list = data && data.list
            if (list && list.length > 0) {
              list.reverse().forEach((r) => {
                this.__ag__addMessage__(r)
              })
              let r = list[list.length - 1]
              this.__ag__goscroll__(r.id)
            }
            this.atUserList = []
            let userdata = await this.__ag__listGroupUser__({
              groupId: this.uid,
            })
            if (userdata && userdata.data && userdata.data.length > 0) {
              let userlist = userdata.data
              for (let i in userlist) {
                let r = userlist[i]
                let u = {
                  uid: r.uid,
                  avatar: r.joinMap && r.joinMap.u && r.joinMap.u.avatar,
                  userNicename:
                    r.joinMap && r.joinMap.u && r.joinMap.u.userNicename,
                }
                this.atUserList.push(u)
              }
            }
          } catch (err) {
            util.message(err.message)
          }
          // this.a__ag__messageList__ = data.list
          return
        }
        if (this.type == "3") {
          this.isgroup = false
          this.a__ag__pageMsgForm__.friendId = this.uid
          await this.__ag__friendloadMsg__()
        }
      } catch (error) {
        util.message(error.message)
      }
      // await this.__ag__pageArticle__()
    },
    async __ag__friendloadMsg__() {
      try {
        let data = await this.__ag__loadMsg__(this.a__ag__pageMsgForm__)
        let list = data && data.list
        if (list && list.length > 0) {
          list.reverse().forEach((r) => {
            this.__ag__addMessage__(r)
          })
          console.log("asda", this.a__ag__messageList__)
          let r = list[list.length - 1]
          sport.subFriendUnread.call(this, list, this.uid)
          this.__ag__goscroll__(r.id)
        }
      } catch (err) {
        util.message(err.message)
      }
    },
    async onrefresh() {
      this.a__ag__refreshing__ = true
      this.a__ag__freshText__ = "加载中..."
      await this.refresh()
      // setTimeout(()=>{
      this.a__ag__refreshing__ = false
      // },2000)
    },
    async refresh() {
      return await this.prevMsg()
    },
    onpullingdown() {
      this.a__ag__freshText__ = "释放更新"
    },
    async prevMsg() {
      if (this.type == 3) {
        let f = { friendId: this.uid, size: 20 }
        if (this.a__ag__messageList__.length > 0) {
          f.toId = this.a__ag__messageList__[0].id
          try {
            let data = await this.__ag__loadMsg__(f)
            if (data.total == 0) {
              util.message("没有更多消息")
              return
            }
            let list = data && data.list
            if (list && list.length > 0) {
              list.reverse().forEach((r) => {
                this.__ag__addMessage__(r, true)
              })
            }
          } catch (err) {
            util.message(err.message)
          }
        }
      }
      if (this.type == 2) {
        let f = { groupId: this.uid, size: 20 }
        if (this.a__ag__messageList__.length > 0) {
          f.toId = this.a__ag__messageList__[0].id
          try {
            let data = await this.__ag__loadGroupMsg__(f)
            if (data.total == 0) {
              util.message("没有更多消息")
              return
            }
            let list = data && data.list
            if (list && list.length > 0) {
              list.reverse().forEach((r) => {
                this.__ag__addMessage__(r, true)
              })
            }
          } catch (err) {
            util.message(err.message)
          }
        }
      }
      return
    },
  },
}
</script>

<style scoped lang="less">
@import "../style/theme.less";
.__ag__msgchat__ {
  flex: 1;
  /* position: relative;
        top: 0px; */
  padding: 16px;
  padding-top: 0px;
  padding-bottom: 0px;
  background-color: @gray8;
}

.__ag__msgchattop__ {
  padding-top: 0px;
}

.__ag__msgchattitle__ {
  /* position: absolute;
        top: 0px;
        left: 0px; */
  height: 44wx;
  width: 718px;
  background-color: @gray8;
  padding-top: 10px;
}

.__ag__msgchatscroller__ {
  /* position: absolute;
        top: 44wx;
        bottom: 90px; */
  /* height: 500px; */
  width: 718px;
  padding-bottom: 95px;
  background-color: @gray8;
  position: relative;
}

.ipx {
  padding-bottom: 130px;
}

.__ag__msgsend__ {
  position: absolute;
  bottom: 0px;
  width: 750px;
  left: 0px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  /* height: 90px; */
  background-color: @gray1;
  padding-left: 16wx;
  padding-right: 16wx;
  padding-top: 22px;
  padding-bottom: 22px;
}

.__ag__msgsend_ipx__ {
  padding-bottom: 34px;
}

.__ag__refresh__ {
  width: 750px;
  padding: 60px;
  align-items: center;
  justify-content: center;
}

.__ag__refreshtext__ {
  padding-bottom: 40px;
}

.__ag__loading__ {
  color: @black;
}

.__ag__livesendinput__ {
  flex: 1;
  height: 60px;
  padding-left: 16px;
  padding-right: 16px;
  background-color: @white;
  border-radius: 4px;
  margin-right: 30px;
  border-width: 1px;
  border-style: solid;
  border-color: @gray5;
}

.__ag__iscontent__ {
  width: 390px;
}

.__ag__livesendbodyinput__ {
  font-size: 25px;
  color: @black30;
  height: 58px;
  background-color: @white;
}

.__ag__livesendbodyinput__ .input-placeholder {
  color: @gray9 !important;
}

.__ag__livefs__ {
  width: 90px;
  height: 60px;
  background-color: @green3;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
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
  position: relative;
}

.__ag__web__ {
  width: 60px;
  height: 60px;
}

.vector {
  font-size: 20wx;
}

.__ag__chat_upload__ {
  width: 60px;
  height: 60px;
  position: absolute;
  left: 0px;
  top: 0px;
  justify-content: center;
  align-items: center;
}

.__ag__livefstext__ {
  font-size: 20px;
  letter-spacing: 0.05em;
  color: @white;
}

.__ag__msgcontent__ {
  padding: 10px;
  /* clear: both; */
  width: 718px;
  /* flex: auto; */
}

.__ag__msgtime__ {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}

.__ag__msgtimetext__ {
  font-style: normal;
  font-weight: normal;
  font-size: 13wx;
  color: @black30;
}

.__ag__msgcontentleft__ {
  display: flex;
  flex-direction: row;
}

.__ag__msguserimg__ {
  width: 72px;
  height: 72px;
  border-radius: 50wx;
  overflow: hidden;
}

.__ag__msguserleftcontent__ {
  display: flex;
  flex-direction: column;
  padding-left: 20px;
  align-items: flex-start;
  width: 600px;
}

.__ag__msguserrightcontent__ {
  display: flex;
  flex-direction: column;
  padding-right: 20px;
  align-items: flex-end;
  width: 600px;
}

.__ag__msgusername__ {
  font-style: normal;
  font-weight: normal;
  font-size: 12wx;
  color: @black50;
  lines: 1;
  text-overflow: ellipsis;
  margin-bottom: 5px;
}

.__ag__msgusercontent__ {
  /* border-radius: 4px;
        position: relative; */
  background-color: @white;
  border-radius: 4px;
  padding: 10px;
  padding-top: 20px;
  padding-bottom: 20px;
}

.__ag__msgusertext__ {
  flex: 1;
  font-style: normal;
  font-weight: normal;
  font-size: 14wx;
  color: @black;
  /* cursor: auto;
		user-select: text;
		-webkit-user-select: text; */
}

.long-press:active {
  background-color: @blue1;
}

.__ag__msgusertexthttp__ {
  flex: 1;
  font-style: normal;
  font-weight: normal;
  font-size: 14wx;
  color: @blue2;
}

.__ag__msgusertextright__ {
  background-color: @green1;
}

.corners {
  position: absolute;
  top: 37px;
  /* background-color: @white; */
  color: @white;
  font-size: 20wx;
  left: -3px;
}

.notgroup {
  top: 0px;
}

.__ag__msgcontentright__ {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  flex-direction: row-reverse;
}

.cornersright {
  position: absolute;
  top: 35px;
  color: @green1;
  font-size: 20wx;
  right: -3px;
}

.__ag__msgitementer__ {
  /* padding: 0px 20px; */
  padding-left: 20px;
  padding-right: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}

.__ag__msgitementertext__ {
  color: @black30;
  font-style: normal;
  font-weight: normal;
  font-size: 13wx;
}

.__ag__msglink__ {
  margin: 10px;
  flex: 1;
}

.__ag__msgusercontentimg__ {
  border-radius: 4px;
}

.__ag__msgcontentimg__ {
  width: 132px;
  height: 132px;
}

.__ag__video__ {
  width: 300px;
  height: 300px;
  background-color: @gray8;
}

.__ag__vector__ {
  font-size: 18wx;
}

.__ag__chatemotion__ {
  position: fixed;
  bottom: 0px;
  width: 750px;
  height: 300wx;
  background-color: @white;
  left: 0px;
}

.__ag__atuser__ {
  position: fixed;
  bottom: 90px;
  width: 750px;
  height: 300wx;
  background-color: @white;
  left: 0px;
}

.emotion-ipx {
  padding-bottom: 34wx;
}

.__ag__isaddfriend__ {
  background-color: @green2;
  border-radius: 4px;
  height: 68px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 15px;
}

.__ag__buttonaddfriend__ {
  font-style: normal;
  font-weight: normal;
  font-size: 18wx;
  color: @primary;
}

.__ag__notaddfriend__ {
  background-color: @primary;
  border-radius: 4px;
  height: 68px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 15px;
}

.__ag__addfriend__ {
  position: absolute;
  bottom: 34px;
  width: 540px;
  left: 105px;
  right: 105px;
  height: 68px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: 40px;
  background-color: @primary;
}

.__ag__addfriend_ipx__ {
  bottom: 54px;
}

.__ag__notaddfriendtext__ {
  font-style: normal;
  font-weight: normal;
  font-size: 18wx;
  color: @white;
}

.__ag__msgusertextimg__ {
  background-color: @black;
}

.__ag__imgpopup__ {
  width: 750px;
  background-color: @gray10;
  position: fixed;
  top: 0px;
  bottom: 0px;
  align-items: center;
  justify-content: center;
}

.__ag__imgpopupurl__ {
  width: 750px;
  height: 1000px;
}
</style>
