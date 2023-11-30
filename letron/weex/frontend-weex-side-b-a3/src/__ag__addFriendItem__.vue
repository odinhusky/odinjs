<template>
  <div class="__addFriend-main__" :class="[ipx ? 'recom-ipx' : '']">
    <ag-hbtitle :isback="true" title="新增好友"></ag-hbtitle>
    <div class="__addFriend-content__">
      <div class="__add-item__">
        <div class="__add_item-img">
          <image
            class="head-image"
            v-if="friendUser.avatar"
            :src="__ag__url__(friendUser.avatar)"
          ></image>
          <text class="item-text" v-else>{{
            charName(friendUser.userNicename)
          }}</text>
        </div>
        <text class="__item-name__">{{ friendUser.userNicename }}</text>
      </div>
      <div class="__add-btn__" @click="__ag__sendMessage__">
        <text class="agiconfont icon-send">&#xe6b9;</text>
        <text class="send-text">发消息</text>
      </div>
    </div>
  </div>
</template>
<script>
import agMinix from "./components/__ag__minix__.js"
import hbtitle from "./components/__ag__headTop__.vue"
import util from "./components/util.js"
import bc from "./components/__ag__bc__.js"
import agMinUrl from "./components/__ag__minurl__.js"
export default {
  mixins: [agMinix, agMinUrl],
  components: {
    "ag-hbtitle": hbtitle,
  },
  data() {
    return {
      user: {},
      isFriend: false,
      friendUser: { id: "", avatar: "", userNicename: "", userLogin: "" },
      id: 0,
    }
  },
  methods: {
    charName(name) {
      if (!name) {
        return ""
      }
      return name.charAt(0)
    },
    async __ag__loadData__() {
      let data = util.getUrlParam(weex.config.bundleUrl)
      this.id = data.id
      let f = {
        friendId: data.id,
      }
      await this.__ag__addFriend__(f)
    },
    async __ag__addFriend__(f) {
      try {
        let resp = await this.__ag__editFriend__(f)
        if (resp && resp.success) {
          util.message(resp.message)
          bc.postMessage("afreshData")
          let l = resp.data
          let u = l.joinMap.u
          this.friendUser.friendId = l.friendId
          this.friendUser.id = l.id
          this.friendUser.avatar = u.avatar
          this.friendUser.userNicename = u.userNicename
          this.isFriend = true
        }
      } catch (err) {
        util.message(err.message)
      }
    },
    __ag__sendMessage__() {
      let u = this.friendUser
      let f = {
        uid: u.friendId,
        type: 3,
        friendId: u.id,
      }
      util.getPush("__ag__chat__", f)
    },
  },
}
</script>
<style scoped lang="less">
@import "./style/theme.less";
.__addFriend-main__ {
  width: 750px;
  position: fixed;
  bottom: 0px;
  top: 105px;
  background-color: @gray20;
}
.recom-ipx {
  top: 150px;
}
.__addFriend-content__ {
  width: 750px;
  flex: 1;
  padding-bottom: 150px;
}
.__add-item__ {
  width: 750px;
  background-color: @white;
  padding-top: 30wx;
  padding-bottom: 30wx;
}
.__add_item-img {
  display: flex;
  justify-content: center;
  align-items: center;
}
.head-image {
  width: 80wx;
  height: 80wx;
  border-radius: 4px;
}
.item-text {
  width: 80wx;
  height: 80wx;
  border-radius: 4px;
  text-align: center;
  line-height: 80wx;
  background-color: @gray20;
}
.__item-name__ {
  margin-top: 20wx;
  text-align: center;
  font-style: normal;
  font-weight: normal;
  font-size: 17wx;
  line-height: 20wx;
  color: @black90;
}
.__add-btn__ {
  width: 750px;
  height: 56wx;
  background-color: @white;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 10wx;
}
.icon-send {
  color: @blue19;
  font-size: 17wx;
}
.send-text {
  color: @blue19;
  font-style: normal;
  font-weight: 500;
  font-size: 17wx;
  margin-left: 2wx;
}
</style>
