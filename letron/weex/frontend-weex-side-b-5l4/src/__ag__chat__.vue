<template>
  <div class="__ag__chat__">
    <div class="__ag__chatcontent__" :class="[ipx ? 'chat-ipx' : '']">
      <ag-chatlist
        :uid="uid"
        :type="type"
        :user="a__ag__user__"
        :name="name"
      ></ag-chatlist>
    </div>
  </div>
</template>

<script>
import agMinix from "./components/__ag__minix__.js"
import chatlist from "./components/__ag__chatMsgList__.vue"
import util from "./components/util.js"
import bc from "./components/__ag__bc__.js"
export default {
  mixins: [agMinix],
  components: {
    "ag-chatlist": chatlist,
  },
  data() {
    return {
      uid: "", // 好友的id 或者是群聊的id
      type: "0",
      name: "",
      friendId: 0, // 是好友列表的id
      a__ag__user__: {},
    }
  },
  destroyed() {
    bc.postMessage("afreshData")
  },
  methods: {
    async __ag__loadData__() {
      let that = this
      that.a__ag__user__ = util.getItem("user")
      let data = util.getUrlParam(weex.config.bundleUrl)
      this.uid = data.uid
      this.type = data.type

      let form = {}
      if (this.type == "2") {
        form.groupId = this.uid
        try {
          let datalist = await this.__ag__listGroup__(form)
          if (datalist.data && datalist.data.length > 0) {
            let item = datalist.data[0]
            let name =
              item.groupName ||
              (item.joinMap && item.joinMap.g && item.joinMap.g.name) ||
              "#" + item.groupId
            let amount = item.joinMap && item.joinMap.g && item.joinMap.g.amount
            this.name = name + "(" + amount + ")"
          }
        } catch (err) {
          util.message(err.message)
        }
        return
      }
      if (this.type == "3") {
        this.friendId = data.friendId
        form.friendId = this.friendId
        try {
          let datalist = await this.__ag__pageFriend__(form)
          //  util.message(datalist)
          let list = datalist.data.list
          if (list && list.length > 0) {
            let item = list[0]
            this.name =
              item &&
              item.joinMap &&
              item.joinMap.u &&
              item.joinMap.u.userNicename
          }
        } catch (err) {
          util.message(err.message)
        }
        return
      }
    },
  },
}
</script>

<style>
.__ag__chat__ {
  background-color: #ededed;
  width: 750px;
  flex-direction: column;
  align-items: center;
}
.chat-ipx {
  top: 30wx;
  /* padding-bottom: 34px; */
}
.__ag__chatcontent__ {
  position: fixed;
  top: 20wx;
  bottom: 0px;
  width: 750px;
}
</style>
