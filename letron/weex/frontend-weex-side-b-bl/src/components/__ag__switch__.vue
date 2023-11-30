<template>
  <div
    class="__ag__switch__"
    :class="[ischecked ? '__ag__switchchecked__' : '']"
    @click="change"
  >
    <div
      class="__ag__switchiput__"
      :class="[ischecked ? '__ag__inputchecked__' : '__ag__inputnotchecked__']"
    ></div>
  </div>
</template>
<script>
export default {
  props: {
    checked: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      ischecked: false,
    }
  },
  watch: {
    checked(n) {
      this.ischecked = n
    },
  },
  mounted() {
    this.ischecked = this.checked
  },
  methods: {
    change() {
      this.ischecked = !this.ischecked
      let e = {
        value: this.ischecked,
      }
      this.$emit("shockChange", e)
    },
  },
}
</script>
<style lang="less" scoped>
.__ag__switch__ {
  width: 104px;
  height: 64px;
  position: relative;
  background-color: #dfdfdf;
  border-radius: 32px;
  border-style: solid;
  border-width: 1px;
  border-color: #dfdfdf;
  transition: background-color 0.1s;
  transition: border 0.1s;
}
.__ag__switchiput__ {
  position: absolute;
  top: 0;
  left: 0;
  height: 60px;
  border-radius: 30px;
  width: 60;
  background-color: #fff;
  transition: transform 0.3s;
}
.__ag__switchchecked__ {
  background-color: #07c160;
  border-color: #07c160;
}
.__ag__inputchecked__ {
  transform: translateX(42px);
}
.__ag__inputnotchecked__ {
  transform: translateX(0px);
}
</style>
