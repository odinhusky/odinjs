<template>
  <div class="__ag__notlive__">
    <ag-notuplive v-if="!isincomeLive" :upinfo="otherUp"></ag-notuplive>
    <ag-uptime v-if="isincomeLive" :info="incomeLive" :user="user"></ag-uptime>
  </div>
</template>

<script>
import notuplive from "./__ag__notUpLive__.vue"
import uptime from "./__ag__upTime__.vue"
import __ag__sport from "./__ag__sport__.js"
import agMinix from "./__ag__minix__.js"
import util from "./util.js"

export default {
  mixins: [agMinix],
  components: {
    "ag-notuplive": notuplive,
    "ag-uptime": uptime,
  },
  props: {
    uid: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      incomeLive: {},
      otherUp: {},
      isincomeLive: false,
      user: {},
    }
  },
  watch: {
    uid(n) {
      this.__ag__loadData__()
    },
  },
  methods: {
    async __ag__loadData__() {
      if (!this.uid) {
        return
      }
      this.user = util.getItem("user")
      let that = this
      const onlogin = new BroadcastChannel("onlogin")
      onlogin.onmessage = async function (event) {
        that.user = event.data
        await that.onUpAbsent({ uid: this.uid })
      }
      await this.onUpAbsent({ uid: this.uid })
    },
    async showOtherUp() {
      let resp = await this.__ag__showOtherUp__()
      if (resp.data && resp.data.length > 0) {
        this.otherUp = resp.data[0]
        // this.$set(this,"otherUp",otherUp)
      }
    },
    async onUpAbsent(form) {
      let resp = await this.__ag__pageUpSche__(form)
      if (resp && resp.data && resp.data.list) {
        let incomeLive = __ag__sport.hasIncomeLive(resp.data.list)
        this.incomeLive = incomeLive

        if (!incomeLive || !incomeLive.id) {
          await this.showOtherUp()
        } else {
          // t.startCountTime()
          this.isincomeLive = true
        }
      }
    },
  },
}
</script>

<style scoped>
.__ag__notlive__ {
  width: 750px;
  height: 421.875px;
  background-color: #000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
