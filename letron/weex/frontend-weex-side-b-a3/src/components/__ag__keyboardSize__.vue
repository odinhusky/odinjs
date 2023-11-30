<template>
  <div :style="{ height: isheight }" class="__ag__keyboard__"></div>
</template>

<script>
import agMinix from "./__ag__minix__.js"
export default {
  mixins: [agMinix],
  data() {
    return {
      isheight: "0px",
    }
  },
  methods: {
    async __ag__loadData__() {
      // let that = this
      // const keyboardSize = new BroadcastChannel('keyboardSize')
      // keyboardSize.onmessage= function(event){
      //     that.isheight = event.data
      // }
    },
    keyboardSize(s) {
      // util.message("asdad")
      this.isheight = s
    },
  },
}
</script>

<style>
.__ag__keyboard__ {
  /* background-color: red; */
}
</style>
