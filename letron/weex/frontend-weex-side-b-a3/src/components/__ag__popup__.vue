<template>
  <div
    class="__ag__popup__"
    v-if="isAnimate"
    :class="[isSlate ? '__ag__popup_animate__' : '__ag__popup_main__']"
    ref="animate"
    @click="$emit('closePopup')"
  >
    <slot></slot>
  </div>
</template>

<script>
const animation = weex.requireModule("animation")
export default {
  props: {
    isAnimate: {
      type: Boolean,
      default: false,
    },
    isSlate: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    isAnimate(n) {
      // this.animate(n)
    },
  },
  methods: {
    animate(n) {
      let el = this.$refs.animate
      let t = 0
      let d = 0
      if (n) {
        t = 0
        d = 100
      } else {
        t = 100
        d = 50
      }
      if (el) {
        animation.transition(el, {
          styles: {
            transform: `translateY(${t}%)`,
            transformOrigin: "center center",
          },
          duration: d, //ms
          timingFunction: "linear",
          delay: 0, //ms
        })
      }
    },
  },
}
</script>

<style scoped lang="less">
@import "../style/theme.less";
.__ag__popup__ {
  width: 750px;
  /* position: absolute;
		top: 0px;
		bottom: 0px; */
}
.__ag__popup_main__ {
  width: 750px;
  position: fixed;
  top: 0px;
  bottom: 0px;
}
.__ag__popup_animate__ {
  /* transform:translateY(100%) */
}
</style>
