<template>
  <div class="swiper">
    <slider
      class="swiper"
      show-indicators="true"
      interval="3000"
      auto-play="true"
    >
      <div
        class="swiper"
        v-for="(item, index) in swipers"
        :key="index"
        @click="onurl(item)"
      >
        <image
          class="swiper"
          resize="cover"
          v-if="item.thumb"
          :src="__ag__url__(item.thumb)"
          mode="aspectFill"
        ></image>
      </div>
      <indicator
        v-if="swipers && swipers.length > 0"
        class="indicator"
      ></indicator>
    </slider>
  </div>
</template>

<script>
import agMinUrl from "@/components/__ag__minurl__.js"
import sport from "@/components/__ag__sport__.js"
import util from "@/components/util.js"

export default {
  name: "ag-swiper",
  mixins: [agMinUrl],
  props: {
    swipers: {
      type: Array,
      default: function () {
        return []
      },
    },
  },
  data() {
    return {}
  },
  methods: {
    onurl(item) {
      if (item.type == 1) {
        sport.urlTo(item, true)
        return
      }
      if (item.type == 2) {
        let data = {
          id: item.articleId,
        }
        util.getPush("__ag__newdetails__", data)
        return
      }
      if (item.type == 3) {
        let data = {
          uid: item.articleId,
        }
        util.getPush("__ag__live__", data)
        return
      }
    },
  },
}
</script>

<style>
.swiper {
  height: 175wx;
  width: 750px;
  margin-bottom: 12wx;
}
.indicator {
  width: 750px;
  height: 60px;
  position: absolute;
  bottom: 1px;
  item-color: rgba(255, 255, 255, 0.5);
  item-selected-color: #ffffff;
  item-size: 16px;
}
</style>
