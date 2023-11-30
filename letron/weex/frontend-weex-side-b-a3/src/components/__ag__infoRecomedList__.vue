<template>
  <div class="__ag__recommed-list-main__">
    <div class="recomed-list" v-if="list1 && list1.length > 0">
      <text class="recomed-title-text">本场推荐</text>
      <ag-recommed-new-item
        v-for="(item, index) in list1"
        :item="item"
        :key="item.id"
        :index="index"
        @jumpRecommed="jumpRecommed"
        :user="user"
      ></ag-recommed-new-item>
    </div>
    <div class="recomed-list">
      <text class="recomed-title-text" v-if="list2 && list2.length > 0"
        >{{ anchor && anchor.userNicename }}的其它场次推荐</text
      >
      <ag-recommed-new-item
        v-for="(item, index) in list2"
        :item="item"
        :key="item.id"
        :index="index"
        @jumpRecommed="jumpRecommed"
        :user="user"
      ></ag-recommed-new-item>
    </div>
    <text
      v-if="(!list1 || list1.length <= 0) && (!list2 || list2.length <= 0)"
      style="
        text-align: center;
        white-space: inherit;
        padding: 20wx;
        font-size: 14wx;
      "
      >暂无信息</text
    >
  </div>
</template>

<script>
import agRecommedNewItem from "../components/__ag__recommedNewItem__.vue"
import agMinix from "../components/__ag__minix__.js"
export default {
  mixins: [agMinix],
  props: {
    list1: {
      type: Array,
      default() {
        return []
      },
    },
    list2: {
      type: Array,
      default() {
        return []
      },
    },
    anchor: {
      type: Object,
      default() {
        return {}
      },
    },
    user: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  components: {
    "ag-recommed-new-item": agRecommedNewItem,
  },
  data() {
    return {
      a__ag__user__: {},
    }
  },
  methods: {
    __ag__loadData__() {
      let that = this
      const Steve = new BroadcastChannel("onlogin")
      Steve.onmessage = async function (event) {
        that.a__ag__user__ = event.data
      }
    },
  },
}
</script>

<style scoped lang="less">
@import "../style/theme.less";
.__ag__recommed-list-main__ {
  width: 750px;
  padding-right: 16wx;
  padding-left: 16wx;
}
.recomed-title-text {
  height: 30wx;
  line-height: 30wx;
  font-style: normal;
  font-weight: 600;
  font-size: 14wx;
  color: @black;
  opacity: 0.9;
  margin-top: 8wx;
}
</style>
