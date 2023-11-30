<template>
  <div class="__ag__matchupitem__" v-if="item1 && item1.id">
    <div class="__ag__upitemtitle__">
      <ag-uptitle
        :item="item1"
        :amount="
          item1.joinMap && item1.joinMap.room && item1.joinMap.room.amount
        "
        :score="item1.joinMap && item1.joinMap.user && item1.joinMap.user.score"
        :isfollow="true"
      ></ag-uptitle>
    </div>
    <image
      class="__ag__matchupimg__"
      v-if="
        item1 && item1.joinMap && item1.joinMap.room && item1.joinMap.room.thumb
      "
      :src="__ag__url__(item.joinMap.room.thumb)"
      mode="aspectFill"
    ></image>
    <image
      class="__ag__matchupimg__"
      v-else-if="item1.thumb"
      @load="imgError"
      :src="__ag__url__(item1.thumb)"
      mode="aspectFill"
    ></image>
    <image class="__ag__matchupimg__" v-else mode="aspectFill"></image>
  </div>
</template>

<script>
import uptitle from "./__ag__uptitle__.vue"
import agMinUrl from "./__ag__minurl__.js"
export default {
  name: "ag-matchUpItem",
  mixins: [agMinUrl],
  props: {
    item: {
      type: Object,
      default: function () {
        return {}
      },
    },
  },
  components: {
    "ag-uptitle": uptitle,
  },
  data() {
    return {
      item1: {},
    }
  },
  watch: {
    item(n) {
      this.item1 = n
    },
  },
  mounted() {
    this.item1 = this.item
  },
  methods: {
    imgError(event) {
      if (!event.success) {
        this.item1.thumb = null
      }
    },
  },
}
</script>

<style>
.__ag__matchupitem__ {
  width: 710px;
  height: 469px;
  background-color: #ffffff;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
}
.__ag__matchupimg__ {
  height: 389px;
  border-style: solid;
  border-width: 1px;
  border-color: #e2e5ea;
}
.__ag__upitemtitle__ {
  height: 80px;
}
</style>
