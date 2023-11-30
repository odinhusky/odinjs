<template>
  <div class="__ag__newslist__" :class="{ isindex: isindex }">
    <div v-for="item in list" class="__ag__newsitem__" :key="item.id">
      <ag-bh-newsitem :item="item" :isindex="isindex"></ag-bh-newsitem>
    </div>
  </div>
</template>

<script>
import newitem from "./__ag__newsItem__.vue"
import newsItembh from "./__ag__newsItembh__.vue"
import util from "./util.js"
import env from "./env.js"
import agMinix from "../components/__ag__minix__.js"
export default {
  name: "ag-newsList",
  mixins: [agMinix],
  components: {
    "ag-newsitem": newitem,
    "ag-bh-newsitem": newsItembh,
  },
  props: {
    // 是不是在首頁引用的，不是的話不用特別給，除了樣式以外好像沒有特別的影響
    isindex: {
      type: Boolean,
      default: false,
    },
    // 一定要給的內容
    list: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      env,
    }
  },
  methods: {
    async __ag__loadData__(option) {
      try {
        await this.__ag__pageArticle__()
      } catch (error) {
        util.message(error.message)
      }
    },
  },
}
</script>

<style>
.__ag__newslist__ {
  width: 750px;
  padding-left: 32px;
  padding-right: 32px;
  height: auto;
}
.isindex {
  flex: 1;
}
.__ag__newsitem__ {
  flex: 1;
}
</style>
