<template>
  <div class="__ag__msg-list-main__">
    <scroller
      class="__ag__follow-body-scroll__"
      :show-scrollbar="false"
      v-if="msgList && msgList.length > 0"
    >
      <refresh
        class="__ag__refresh__"
        v-if="!islive"
        @refresh="onrefresh"
        :display="a__ag__refreshing__ ? 'show' : 'hide'"
      >
        <loading-indicator class="__ag__loading__"></loading-indicator>
        <text class="__ag__refreshtext__">{{ a__ag__freshText__ }}</text>
      </refresh>
      <ag-msg-list-item
        @onchat="onchat(item)"
        @onmsgRead="onmsgRead(item)"
        :islive="islive"
        @change="change"
        @clickSwipe="__ag__clickSwipe__"
        :ref="'msg' + item.id"
        v-for="item in msgList"
        :item="item"
        :key="item.type + '-' + item.id"
      ></ag-msg-list-item>
    </scroller>
    <text v-else class="__ag__no-data__">暂无聊天信息</text>
  </div>
</template>
<script>
import agMinix from "./__ag__minix__.js"
import agMinUrl from "./__ag__minurl__.js"
import agMsgListItem from "./__ag__msgListItem__.vue"
import util from "./util.js"
import bc from "./__ag__bc__.js"
export default {
  mixins: [agMinix, agMinUrl],
  props: {
    msgList: {
      type: Array,
      default: function () {
        return []
      },
    },
    islive: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    "ag-msg-list-item": agMsgListItem,
  },
  data() {
    return {
      a__ag__freshText__: "下拉刷新",
      a__ag__refreshing__: false,
      lastItem: undefined,
    }
  },
  methods: {
    onmsgRead(item) {
      item.unread = 0
      this.$emit("onmsgRead", item)
    },
    onchat(item) {
      let uid = ""
      if (item.type == 2) {
        uid = item.groupId
      }
      if (item.type == 3) {
        uid = item.friendId
      }
      let params = {
        name: item.name,
        uid: uid + "",
        type: item.type + "",
      }
      if (item.type == 2) {
        let amount = item.joinMap && item.joinMap.g && item.joinMap.g.amount
        params.name = item.name + "(" + amount + ")"
      }
      item.unread = 0
      bc.postMessage("onchat", item)
      this.$emit("onchat", params)
    },
    async onrefresh() {
      if (this.a__ag__refreshing__) {
        return
      }
      this.a__ag__refreshing__ = true
      this.a__ag__freshText__ = "加载中..."
      this.$emit("onrefresh")
      setTimeout(() => {
        this.a__ag__refreshing__ = false
      }, 1000)
    },
    change(item) {
      if (this.lastItem) {
        let ref = this.$refs["msg" + this.lastItem.id]
        if (ref) {
          ref[0].close()
        }
      }
      this.lastItem = item
    },
    async __ag__clickSwipe__(n, index) {
      if (index == 0) {
        this.$emit("changeSwipe", n)
        return
      }
    },
  },
}
</script>
<style scoped lang="less">
@import "../style/theme.less";
.__ag__msg-list-main__ {
  width: 750px;
  position: absolute;
  top: 0;
  bottom: 0;
  background-color: #fff;
}
.__ag__follow-body-scroll__ {
  width: 750px;
  position: absolute;
  top: 0;
  bottom: 0;
}
.__ag__refresh__ {
  width: 750px;
  padding: 10wx;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.__ag__loading__ {
  margin-right: 15wx;
}
.__ag__no-data__ {
  width: 750px;
  text-align: center;
  color: #ccc;
  font-size: 17wx;
  padding-top: 30wx;
  padding-bottom: 30wx;
}
</style>
