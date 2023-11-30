<template>
  <div class="user-img" @click.stop="itemtap">
    <image
      v-if="avatar3"
      :resize="resize"
      class="user-image"
      :class="[isRadius ? 'radius-img' : '']"
      @load="imgError"
      :src="__ag__url__(avatar2)"
    ></image>
    <image
      v-else-if="!avatar3 && islogo"
      :resize="resize"
      class="user-image"
      :class="[isRadius ? 'radius-img' : '']"
      @load="imgError"
      :src="__ag__url__(utl)"
    ></image>
    <div
      class="user-images"
      :class="[isRadius ? 'radius-img' : '', isNotImage ? 'not-img' : '']"
      v-else
    >
      <text
        class="user-image-text"
        :class="[
          fontSize ? 'fontsize' : '',
          isNotImage ? 'not-text' : '',
          isIndex ? 'index-size' : '',
        ]"
        >{{ charName(name) }}</text
      >
    </div>
  </div>
</template>

<script>
import agMinUrl from "./__ag__minurl__.js"
import util from "./util.js"
export default {
  name: "userImg",
  mixins: [agMinUrl],
  props: {
    avatar: {
      type: String,
      default: "",
    },
    islive: {
      type: Boolean,
      default: false,
    },
    fontSize: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      default: "",
    },
    uid: {
      type: Number,
      default: undefined,
    },
    isRadius: {
      type: Boolean,
      default: false,
    },
    isNotImage: {
      type: Boolean,
      default: false,
    },
    islogo: {
      type: Boolean,
      default: false,
    },
    resize: {
      type: String,
      default: "stretch",
    },
    isIndex: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      avatar2: "",
      utl: "static/logo-5L.png",
    }
  },
  watch: {
    avatar(n) {
      this.avatar2 = n
    },
  },
  computed: {
    avatar3() {
      if (!this.avatar2) {
        return false
      }
      return true
    },
  },
  mounted() {
    this.avatar2 = this.avatar
  },
  methods: {
    charName(name) {
      if (!name) {
        return ""
      }
      return name.charAt(0)
    },
    imgError(event) {
      if (!event.success) {
        if (!this.islogo) {
          this.avatar2 = ""
          return
        }
        this.avatar2 = "static/logo-5L.png"
      }
    },
    itemtap() {
      if (this.islive) {
        if (this.avatar3) {
          this.$emit("itemtap", this.avatar2)
          return
        }
        this.$emit("itemtap", "")
        return
      }
      if (!this.uid) {
        this.$emit("itemtap")
        return
      }
      this.$emit("islive")
      let uid = this.uid
      util.getPush("__ag__live__", { uid })
    },
  },
}
</script>

<style lang="less">
.user-image {
  flex: 1;
  border-radius: 60px;
  text-align: center;
  align-items: center;
  justify-content: center;
}
.user-images {
  flex: 1;
  background-color: #efefef;
  border-radius: 60px;
  text-align: center;
  align-items: center;
  justify-content: center;
}
.radius-img {
  border-radius: 4wx;
}
.not-img {
  background-color: rgba(0, 0, 0, 0.19);
}
.user-image-text {
  color: rgba(0, 0, 0, 0.3);
  font-size: 25px;
}
.fontsize {
  font-size: 36px;
}
.livelist-schedule-img .user-image {
  border-radius: 20px;
}
.not-text {
  color: #fff;
}
.index-size {
  font-size: 18px;
}
</style>
