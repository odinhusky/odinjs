<template>
  <div class="__ag__msg-main__" @click="__ag__clickLive__">
    <ag-ipx
      bg="#E6E6E6"
      image="linear-gradient(to top, #d6d6d6, #c0c0c0)"
    ></ag-ipx>
    <div class="__ag__msg-title__">
      <text style="width: 100px; text-align: center">聊天</text>
      <text
        class="agiconfont msg-add"
        v-if="this.a__ag__user__ && this.a__ag__user__.userType < 3"
        @click="__ag__addFriend__"
        >&#xe6b1;</text
      >
    </div>
    <div
      class="__ag__msg-search__"
      v-if="this.a__ag__user__ && this.a__ag__user__.userType < 3"
    >
      <input
        class="__ag__msg-search-input__"
        type="text"
        placeholder="搜索"
        :hideDoneButton="true"
        ref="inputref"
        v-model="searchVal"
        return-key-type="search"
        @focus="__ag__focus__"
        @blur="__ag__blur__"
        @keyboard="keyboard"
      />
      <text class="search-text" v-if="isSearch" @click="__ag__cancel__"
        >取消</text
      >
    </div>

    <div
      class="__ag__msg-content__"
      :class="[ipx ? '__ag__msg-contentipx__' : '']"
      v-if="this.a__ag__user__ && this.a__ag__user__.userType < 3"
    >
      <ag-msg-list
        :msgList="msgList"
        @onmsgRead="onmsgRead"
        @onrefresh="onrefresh"
        @changeSwipe="changeSwipe"
      ></ag-msg-list>
    </div>
    <div
      class="__ag__logged-content__"
      :class="[ipx ? '__ag__logged-contentipx__' : '']"
      v-else
    >
      <div class="__ag__logged-item">
        <text class="agiconfont logged-icon">&#xe688;</text>
        <text class="logged-text">当前未登录，立即登录看更多</text>
        <button class="login-btn" @click="__ag__onLogin__">
          <text class="login-btn-text">登录</text>
        </button>
      </div>
    </div>
    <div
      class="__friend-popup__"
      :class="[ipx ? 'popup-ipx' : '']"
      v-if="isAddFriend"
    >
      <text class="agiconfont __pop-icon__">&#xec62;</text>
      <div class="__friend-item__" @click="__openFriend__">
        <text class="agiconfont __friend-icon__">&#xe6c4;</text>
        <text class="__friend-item-text__">新增好友</text>
      </div>
    </div>
  </div>
</template>
<script>
import agMinix from "./__ag__minix__.js"
import util from "./util.js"
import agMinUrl from "./__ag__minurl__.js"
import agMsgList from "./__ag__msgList__.vue"
import __ag__sportApi__ from "./__ag__sport_api__.js"
import ipx from "./__ag__ipx__.vue"
import bc from "./__ag__bc__.js"
export default {
  mixins: [agMinix, agMinUrl],
  props: {
    topTab: {
      type: String,
      default: "",
    },
  },
  components: {
    "ag-msg-list": agMsgList,
    "ag-ipx": ipx,
  },
  data() {
    return {
      searchVal: "",
      isSearch: false,
      a__ag__user__: {},
      isAddFriend: false,
      a__ag__msgMap__: {},
      a__ag__msgList__: [],
      newFriendOrNewGroup: false,
      talking: {},
      pageBack: false,
      broadMsg: "",
    }
  },
  watch: {
    async topTab(n, o) {
      if (n == o) {
        return
      }
      if (n == "3") {
        await this.__ag__getMsgList__()
      }
    },
  },
  computed: {
    msgList() {
      let w = this.searchVal.toUpperCase()
      let list = this.a__ag__msgList__
      return list
        .filter((r) => {
          if (r.userHide) {
            return false
          }
          if (w && r.name && r.name.indexOf(w) == -1) {
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
  },
  mounted() {},
  destroyed() {
    // this.broadMsg.close()
  },
  created() {
    // let that = this
    // const msg = new BroadcastChannel('msg')
    // msg.onmessage = function (event) {
    //     that.__ag__onmsg__(event)
    // }
    // this.broadMsg = msg
  },
  methods: {
    onmsgRead(item) {
      this.talking = item
      if (item.type == 2) {
        this.talking.targetId = item.groupId
      }
      if (item.type == 3) {
        this.talking.targetId = item.friendId
      }
      this.checkUnread()
    },
    async __ag__loadData__() {
      let that = this
      that.a__ag__user__ = util.getItem("user")
      bc.onmessage("onlogin", this.bcOnlogin)

      // bc.onmessage('pop-chat',this.__ag__popGetMsgList__)

      bc.onmessage("afreshData", this.__ag__popGetMsgList__)

      bc.onmessage("onchat", this.onchat)

      bc.onmessage("msg", this.__ag__onmsg__)

      bc.onmessage("msgUnread", this.msgUnread)
    },
    async bcOnlogin(event) {
      this.a__ag__user__ = event.data
      await this.__ag__getMsgList__()
    },
    async __ag__popGetMsgList__(event) {
      this.talking = {}
      await this.__ag__getMsgList__()
    },
    onchat(event) {
      let item = event.data
      for (let i in this.a__ag__msgList__) {
        let r = this.a__ag__msgList__[i]
        if (r.id == item.id && item.type == r.type) {
          r.unread = 0
          break
        }
      }
      this.checkUnread()
    },
    async onrefresh() {
      await this.__ag__getMsgList__()
    },
    msgUnread(event) {
      let key = event.data.key
      let unread = event.data.unread
      this.msgOnunread(key, unread)
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
    async __ag__onmsg__(event) {
      let msg = event.data
      if (!msg) {
        return
      }

      this.newFriendOrNewGroup = false
      for (let i in msg) {
        let item = msg[i]
        if (item.messageType == 2 || item.messageType == 3) {
          this.newmsg(item)
        }
      }
      if (this.newFriendOrNewGroup) {
        await this.__ag__getMsgList__()
      } else {
      }
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
        if (
          this.talking.type == msg.messageType &&
          id == this.talking.targetId
        ) {
        } else {
          if (r.msgId != msg.msgId) {
            //未读数+1
            r.unread++
          }
        }

        r.userHide = 0
        r.lastMsgId = msg.id
        r.lastTime = msg.createTime
        r.msgId = msg.msgId
        this.checkUnread()
      } else {
        this.newFriendOrNewGroup = true
        return
      }
    },
    async changeSwipe(n) {
      let allMsg = this.a__ag__msgMap__
      let id = n.type == 2 ? n.gruopId : n.friendId
      let keys = `${n.type}-${this.a__ag__user__.id}-${id}`
      let r = allMsg[keys]
      if (r) {
        r.unread = 0
      }
      let act = undefined
      if (n.type == 2) {
        act = "editGroupUserHideMessage"
      }
      if (n.type == 3) {
        act = "editFriendHideMessage"
      }
      let data = { id: n.id }
      let key
      if (n.friendId) {
        key = n.type + "_" + n.friendId
      } else {
        key = n.type + "_" + n.groupId
      }
      let resp = await __ag__sportApi__[act](data)
      if (resp.success) {
        n.userHide = true
        util.message("操作成功")
      }
    },
    __ag__focus__() {
      this.isSearch = true
    },
    __ag__blur__() {
      this.isSearch = false
    },
    __ag__clickLive__() {
      let ipt = this.$refs.inputref
      if (ipt) {
        ipt.blur()
      }
    },
    keyboard() {},
    __ag__cancel__() {
      this.searchVal = ""
    },
    __ag__onLogin__() {
      util.getPush("__ag__login__")
    },
    __ag__addFriend__() {
      this.isAddFriend = !this.isAddFriend
    },
    __openFriend__() {
      this.isAddFriend = false
      util.getPush("__ag__addFriend__")
    },
  },
}
</script>
<style scoped lang="less">
@import "../style/theme.less";
.__ag__msg-main__ {
  position: fixed;
  top: 0;
  bottom: 66wx;
  background-color: #ebebeb;
}
.msg-ipx {
  top: 35wx;
}
.__ag__msg-title__ {
  width: 750px;
  height: 44wx;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: relative;
  border-bottom-style: solid;
  border-bottom-width: 1wx;
  border-bottom-color: rgba(0, 0, 0, 0.1);
  background-color: #c0c0c0;
  background-image: linear-gradient(to top, #ebebeb, #d6d6d6);
}
.msg-add {
  position: absolute;
  right: 44px;
  font-size: 25wx;
  // text-align: right;
}
.__ag__msg-search__ {
  width: 750px;
  padding: 16wx;
  padding-top: 16px;
  padding-bottom: 16px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.__ag__msg-search-input__ {
  flex: 1;
  height: 32wx;
  background-color: #fff;
  border-radius: 4wx;
  text-align: center;
}
.search-text {
  width: 32wx;
  height: 32wx;
  line-height: 32wx;
  text-align: center;
  margin-left: 8wx;
  font-size: 15wx;
}
.__ag__msg-content__ {
  width: 750px;
  position: absolute;
  top: 230px;
  bottom: 0;
  background-color: #fff;
}
.__ag__msg-contentipx__ {
  top: 256px;
}
.login-btn {
  width: 343wx;
  height: 40wx;
  background-color: @main-color;
  border-radius: 4wx;
  margin-top: 80wx;
}
.__ag__logged-content__ {
  width: 750px;
  position: absolute;
  top: 128px;
  bottom: 0;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  padding-bottom: 64wx;
}
.__ag__logged-contentipx__ {
  top: 160px;
}
.login-btn-text {
  color: #fff;
  text-align: center;
  line-height: 40wx;
}
.__ag__logged-item {
  width: 750px;
  justify-content: center;
  align-items: center;
  // background-color: red;
}
.logged-icon {
  font-size: 50wx;
  color: #8c97a5;
  margin-bottom: 15wx;
}
.logged-text {
  font-style: normal;
  font-weight: normal;
  font-size: 17wx;
  color: #8c97a5;
}
.__friend-popup__ {
  width: 146wx;
  background-color: #4a4c53;
  border-radius: 4px;
  position: absolute;
  top: 74wx;
  right: 16wx;
}
.popup-ipx {
  top: 84wx;
}
.__friend-item__ {
  padding: 15wx;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.__friend-icon__ {
  font-size: 18wx;
  color: #ffffff;
}
.__friend-item-text__ {
  margin-left: 5wx;
  font-style: normal;
  font-weight: normal;
  font-size: 17wx;
  color: #ffffff;
}
.__pop-icon__ {
  font-size: 30wx;
  position: absolute;
  right: -3wx;
  top: -13wx;
  color: #4a4c53;
  transform: rotate(90deg);
}
</style>
