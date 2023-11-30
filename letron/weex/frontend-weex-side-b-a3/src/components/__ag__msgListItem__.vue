<template>
  <!-- <scroller class="__ag__msg-list-item__" :show-scrollbar="false" scroll-direction="horizontal" @scrollstart="scrollend" offset-accuracy="100"> -->
  <div
    class="__ag__msg-list-item__"
    ref="start"
    @swipe="handleSwipe"
    @touchstart="handleStart"
    @touchend="handleEnd"
    @touchmove="handleMove"
  >
    <div class="list-item-swipe" @click.stop="__ag__onchat__(item)">
      <div class="list-item-left">
        <div class="list-item-user">
          <user-img
            class="user-img"
            :avatar="item.avatar"
            :name="item.name"
            :isRadius="true"
            :fontSize="true"
          ></user-img>
        </div>
        <text v-if="item.unread && item.unread > 0" class="unread">{{
          item.unread && item.unread > 99 ? 99 : item.unread
        }}</text>
      </div>
      <div class="list-item-right">
        <div class="list-item-content">
          <div class="content-name">
            <text class="name-text" v-if="item.amount"
              >{{ item.name }}({{ item.amount }})</text
            >
            <text class="name-text" v-else>{{ item.name }}</text>
          </div>
          <div class="content-msg">
            <text class="msg-text" v-if="isImage(item.lastMsg)">[图片]</text>
            <text class="msg-text" v-else>{{
              /^{/.test(item.lastMsg) ? "" : item.lastMsg
            }}</text>
          </div>
        </div>
        <div class="list-item-time">
          <text class="time-text">{{ time(item.lastTime) }}</text>
        </div>
      </div>
    </div>
    <div class="swipe-item-list" v-if="!islive">
      <text
        class="swipe-item"
        v-for="(sw, index) in swipeList"
        :key="'swi-' + sw.id"
        :class="[sw.class]"
        @click="__ag__clickSwipe__(item, index)"
        >{{ sw.name }}</text
      >
    </div>
  </div>
  <!-- </scroller> -->
</template>

<script>
import userImg from "./__ag__userImg__.vue";
import util from "./util.js";
const animation = weex.requireModule("animation");
export default {
  props: {
    item: {
      type: Object,
      default: function () {
        return {};
      },
    },
    el: {
      type: Object,
      default: function () {
        return {};
      },
    },
    islive: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    "user-img": userImg,
  },
  data() {
    return {
      touchX: 0,
      touching: false,
      direction: "",
      swipeList: [
        {
          id: 1,
          name: "删除",
          class: "swipe-del",
        },
      ],
    };
  },
  mounted() {},
  methods: {
    isImage(content) {
      let reg = /^202\d\/\d{4}\//;
      return reg.test(content);
    },
    __ag__onchat__(item) {
      let uid = "";
      if (item.type == 2) {
        uid = item.groupId;
      }
      if (item.type == 3) {
        uid = item.friendId;
      }
      let params = {
        uid: uid + "",
        type: item.type + "",
      };
      if (item.type == 3) {
        params.friendId = item.id;
      }
      this.$emit("change", {});
      if (this.islive) {
        this.$emit("onchat");
        return;
      }
      this.$emit("onmsgRead");
      util.getPush("__ag__chat__", params);
    },
    time(date) {
      return util.simpleDateTime(date);
    },
    handleSwipe(e) {
      this.direction = e.direction;
    },
    handleStart(e) {
      this.touching = true;
      this.touchHandle(e);
    },
    handleMove(e) {
      if (!this.touching) {
        return;
      }
      this.touchHandle(e);
    },
    handleEnd(e) {
      if (!this.touching) {
        return;
      }
      this.touching = false;
      this.changeSwipe();
    },
    touchHandle(e) {
      let pageX = 0;
      if (Array.isArray(e.changedTouches)) {
        e.changedTouches.forEach((item) => {
          pageX += item.pageX;
        });
      }
      this.touchX = pageX;
    },
    changeSwipe() {
      if (this.islive) {
        return;
      }
      let len = this.swipeList.length;
      let el = this.$refs.start;
      let touchM = 200 * len;
      if (this.direction == "left") {
        let touchD = 750 - this.touchX;
        if (touchD > 100 * len) {
          if (el) {
            animation.transition(el, {
              styles: {
                transform: `translateX(${-touchM}px)`,
                transformOrigin: "center center",
              },
              duration: 500, //ms
              timingFunction: "ease",
              delay: 0, //ms
            });
            this.$emit("change", this.item);
          }
        }
      } else if (this.direction == "right") {
        if (this.touchX > 100) {
          touchM = 0;
          if (el) {
            animation.transition(el, {
              styles: {
                transform: `translateX(${touchM}px)`,
                transformOrigin: "center center",
              },
              duration: 500, //ms
              timingFunction: "ease",
              delay: 0, //ms
            });
          }
          this.$emit("change", {});
        }
      }
    },
    close() {
      let el = this.$refs.start;
      let touchM = 0;
      if (el) {
        animation.transition(el, {
          styles: {
            transform: `translateX(${touchM}px)`,
            transformOrigin: "center center",
          },
          duration: 500, //ms
          timingFunction: "ease",
          delay: 0, //ms
        });
      }
    },
    __ag__clickSwipe__(item, index) {
      this.$emit("clickSwipe", item, index);
    },
  },
};
</script>

<style scoped lang="less">
@import "../style/theme.less";
.__ag__msg-list-item__ {
  flex-direction: row;
  width: 750px;
  height: 80wx;
}
.list-item-swipe {
  width: 750px;
  height: 80wx;
  padding: 16wx;
  padding-bottom: 0px;
  display: flex;
  flex-direction: row;
}
.list-item-left {
  position: relative;
  overflow: unset;
  padding-bottom: 16wx;
}
.list-item-user {
  width: 48wx;
  height: 48wx;
}
.user-img {
  width: 48wx;
  height: 48wx;
}
.unread {
  width: 20wx;
  height: 20wx;
  text-align: center;
  line-height: 20wx;
  border-radius: 50wx;
  background-color: @redHot;
  position: absolute;
  top: -10wx;
  right: -10wx;
  font-size: 10wx;
  color: @white;
}
.list-item-right {
  flex: 1;
  display: flex;
  flex-direction: row;
  margin-left: 12wx;
  padding-bottom: 16wx;
  border-bottom-style: solid;
  border-bottom-width: 1px;
  border-bottom-color: @black10;
}
.list-item-content {
  flex: 1;
}
.content-name {
  height: 20wx;
  line-height: 20wx;
  flex-direction: row;
  margin-top: 2wx;
}
.name-text {
  height: 20wx;
  line-height: 20wx;
  flex: 1;
  text-overflow: ellipsis;
  lines: 1;
  font-size: 17wx;
  color: @black90;
}
.content-msg {
  height: 20wx;
  line-height: 20wx;
}
.msg-text {
  height: 20wx;
  line-height: 20wx;
  flex: 1;
  text-overflow: ellipsis;
  lines: 1;
  margin-top: 3wx;
  font-style: normal;
  font-weight: normal;
  font-size: 14wx;
  color: @black30;
}
.list-item-time {
  width: 80wx;
}
.time-text {
  font-style: normal;
  font-weight: normal;
  font-size: 12wx;
  color: @black30;
  text-align: right;
}
.show {
  display: show;
}
.hide {
  display: hide;
}
.swipe-item-list {
  height: 80wx;
  flex-direction: row;
}
.swipe-item {
  color: @white;
  width: 200px;
  height: 80wx;
  line-height: 80wx;
  text-align: center;
}
.swipe-del {
  background-color: @redHot;
}
.swipe-bla {
  background-color: @black;
}
</style>
