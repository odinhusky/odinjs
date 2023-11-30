<template>
  <div>
    <image
      :src="imgSrc"
      @click="imgClick"
      class="__ag__msgusercontentimg__"
      resize="cover"
      :style="imgStyle"
      @load="loadimg($event, n)"
    ></image>
  </div>
</template>

<script>
import { reductionGlsToBase64ForAPP } from "./imgEncode.js"

export default {
  props: {
    src: {
      type: String,
      default: "",
    },
    imgStyle: {
      type: Object,
      default: { width: "130px", height: "130px" },
    },
  },
  data() {
    return {
      imgSrc: "",
    }
  },
  mounted() {
    this.loadImageAPP()
  },
  methods: {
    async loadImageAPP() {
      const base64string = await reductionGlsToBase64ForAPP(this.src, 100)

      this.imgSrc = base64string
    },
    loadimg($event, n) {
      this.$emit("load", $event, n)
    },
    imgClick() {
      this.$emit("clickImg", this.imgSrc, 6)
    },
  },
}
</script>
