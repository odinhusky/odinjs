<template>
  <div class="__ag__bottombar__" :class="[ipx ? 'ipx' : '']">
    <div class="__ag__bottombardiv__" @click.stop="backHomeClick">
      <image
        v-if="tab == 1"
        class="__ag__hbtitleimg__ __ag__img__ __ag__img_h__"
        :src="staticPath('home2.png')"
      />
      <image
        v-else
        class="__ag__hbtitleimg__ __ag__img_n__"
        :src="staticPath('home1.png')"
      />
    </div>
    <div class="__ag__bottombardiv__" @click.stop="__ag__onIndex__(2)">
      <image
        v-if="tab == 2"
        class="__ag__hbtitleimg__ __ag__img__"
        :src="staticPath('match2.png')"
      />
      <image
        v-else
        class="__ag__hbtitleimg__"
        :src="staticPath('match1.png')"
      />
    </div>
    <div class="__ag__bottombardiv__" @click.stop="__ag__onIndex__(3)">
      <image
        v-if="tab == 3"
        class="__ag__hbtitleimg__ __ag__img__"
        :src="staticPath('my2.png')"
      />
      <image v-else class="__ag__hbtitleimg__" :src="staticPath('my1.png')" />
    </div>
  </div>
</template>

<script>
import agMinix from "./__ag__minix__.js"
import agMinUrl from "./__ag__minurl__.js"
import env from "./env.js"

const backHomeBroadcast = new BroadcastChannel("backHomeBroadcast");

export default {
  mixins: [agMinix, agMinUrl],
  props: {
    tabs: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      env,
      tab: 1,
    }
  },
  computed: {},
  mounted() {
    this.tab = this.tabs
  },
  methods: {
    __ag__onIndex__(index) {
      this.tab = index
      this.$emit("onclick", index)
    },
    backHomeClick() {
      this.__ag__onIndex__(1)
      backHomeBroadcast.postMessage({ type: "backHomeTrigger" });
    },
  },
  destroyed() {
    backHomeBroadcast.close()
  },
}
</script>

<style lang="less">
@import "../style/default.less";

.__ag__bottombar__ {
  position: fixed;
  bottom: 0px;
  height: 134px;
  width: 750px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-top-left-radius: 40px;
  border-top-right-radius: 40px;
  background-color: @white;
  box-shadow: -2px -2px 4px rgba(214, 214, 214, 0.3);
}
.ipx {
  bottom: 0px;
  padding-bottom: 34px;
}
.__ag__bottombardiv__ {
  height: 134px;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}
.__ag__hbtitleimg__ {
  width: 52px;
  height: 52px;
}
.__ag__img__ {
  width: 75px;
  height: 75px;
}
.__ag__img_h__ {
  width: 75px;
}
.__ag__img_n__ {
  width: 55px;
}
</style>
