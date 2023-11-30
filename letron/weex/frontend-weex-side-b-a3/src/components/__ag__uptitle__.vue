<template>
  <div class="__ag__uptitle__">
    <div class="__ag__uptitle-left__">
      <div class="__uptitle_avatar__">
        <ag-userimg
          v-if="item && item.id"
          class="__ag__upimg__"
          :name="item.userNicename"
          :avatar="item.avatar"
          @itemtap="clickAnthor"
        ></ag-userimg>
      </div>
      <div class="__uptitle_info__">
        <text
          v-if="item && item.id"
          class="__ag__upname__"
          :class="[iswhite ? 'white' : 'black']"
          >{{ item.userNicename }} {{ iosUserId }}</text
        >
        <div class="__info_item__">
          <div class="__ag__uphot__" v-if="amount1 != 0">
            <text class="agiconfont __ag__fire__">&#xe6a5;</text>
            <text
              class="__ag__uptext__"
              :class="[iswhite ? 'white' : 'black']"
              >{{ amount1 }}</text
            >
          </div>
          <div class="__ag__upfollow__" v-if="score1 != 0">
            <text class="agiconfont __ag__heart3__">&#xe700;</text>
            <text
              class="__ag__uptext__"
              :class="[iswhite ? 'white' : 'black']"
              >{{ score1 }}</text
            >
          </div>
        </div>
      </div>
    </div>
    <div class="__ag__uptitle-right__">
      <agairplay class="airplay" v-if="item && item.id">
        <text class="agiconfont airplay-text">&#xe62c;</text>
      </agairplay>
      <div class="__ag_isfollow__" v-if="item && item.id">
        <text
          class="agiconfont __ag__outlined_heart__"
          v-if="!isFollow"
          @click="__ag__followTap__"
          >&#xe66d;</text
        >
        <text
          class="agiconfont __ag__vector__"
          v-else
          @click="__ag__cancelFollow__"
          >&#xe700;</text
        >
      </div>
      <text
        class="__ag__switch_anthor__"
        v-if="isMatchUser && item && item.id"
        @click="onSwitch"
        >切换主播</text
      >
      <text
        class="agiconfont __ag__back__"
        :class="[iswhite ? 'white' : 'black']"
        v-if="isclose"
        @click.stop="onclose"
        >&#xe64b;</text
      >
    </div>
  </div>
</template>

<script>
import util from "./util.js"
import agMinix from "./__ag__minix__.js"
import userImg from "./__ag__userImg__.vue"
export default {
  name: "ag-uptitle",
  mixins: [agMinix],
  components: {
    "ag-userimg": userImg,
  },
  props: {
    iswhite: {
      type: Boolean,
      default: false,
    },
    isclose: {
      type: Boolean,
      default: false,
    },
    amount: {
      type: Number,
      default: 0,
    },
    score: {
      type: Number,
      default: 0,
    },
    item: {
      type: Object,
      default: function () {
        return {}
      },
    },
    user: {
      type: Object,
      default: function () {
        return {}
      },
    },
    listFollowMap: {
      type: Object,
      default: function () {
        return {}
      },
    },
    isMatchUser: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      id: 0,
      isSwitch: false,
    }
  },
  computed: {
    amount1() {
      console.log("amount===", this.amount)
      return util.numberReadable(this.amount)
    },
    score1() {
      return util.numberReadable(this.score)
    },
    iosUserId() {
      if (WXEnvironment.platform == "iOS") {
        let i = this.user && this.user.id
        return util.base62(i)
      }
    },
    isFollow() {
      if (!this.listFollowMap) {
        return false
      }
      let r = this.listFollowMap[this.item.id]
      return r
    },
  },
  methods: {
    __ag__cancelFollow__() {
      this.$emit("cancelFollow", this.item)
    },
    __ag__followTap__() {
      this.$emit("followTap", this.item)
    },
    onclose() {
      util.pop()
    },
    onSwitch() {
      // this.isSwitch = !this.isSwitch
      this.$emit("switch")
    },
    clickAnthor() {
      this.$emit("onTab")
    },
  },
}
</script>

<style scoped lang="less">
@import "../style/theme.less";
.__ag__uptitle__ {
  height: 80px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-radius: 4px;
  padding: 20px;
  padding-top: 0px;
  padding-bottom: 0px;
  padding-right: 0px;
}
.__ag__uptitle-left__ {
  flex-direction: row;
  align-items: center;
}
.__ag__uptitle-right__ {
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
}
.__uptitle_avatar__ {
  flex: 0.4;
  flex-direction: row;
  align-items: center;
}

.__ag__upimg__ {
  width: 60px;
  height: 60px;
  margin-right: 6px;
}
.__uptitle_info__ {
  flex: 0.6;
  padding-left: 10wx;
}
.__ag__upname__ {
  font-size: 14wx;
  /* line-height: 18px; */
}
.__info_item__ {
  flex: 1;
  display: flex;
  flex-direction: row;
  padding-top: 1wx;
}
.white {
  color: @white;
}
.black {
  color: @black !important;
}
.__ag__back__ {
  font-size: 50px;
  color: @white;
  height: 40wx;
  width: 40wx;
  text-align: center;
  line-height: 40wx;
}
.__ag__heart3__ {
  font-size: 12wx;
  color: @primary;
  margin-right: 5px;
}
.__ag__fire__ {
  font-size: 14wx;
  color: @yellow5;
  margin-right: 5px;
}
.__ag__uptext__ {
  font-style: normal;
  font-weight: normal;
  font-size: 12wx;
}
.__ag__uphot__ {
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
}
.__ag__upfollow__ {
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.__ag_isfollow__ {
  width: 40wx;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.isfollow {
  margin-right: 10px;
}
.__ag__outlined_heart__ {
  width: 40px;
  height: 40px;
  font-size: 25wx;
  color: @white;
  font-weight: 500;
  height: 40wx;
  width: 40wx;
  text-align: center;
  line-height: 40wx;
}
.__ag__vector__ {
  padding-top: 3px;
  width: 40px;
  height: 40px;
  font-size: 20wx;
  color: @primary;
  font-weight: 500;
  height: 40wx;
  width: 40wx;
  text-align: center;
  line-height: 40wx;
}
.__ag__switch_anthor__ {
  width: 60wx;
  height: 20wx;
  line-height: 20wx;
  border-style: solid;
  border-width: 1wx;
  border-color: @primary;
  color: @primary;
  border-radius: 4wx;
  font-style: normal;
  font-weight: 400;
  font-size: 12wx;
  text-align: center;
  margin-left: 5px;
  margin-right: 5px;
}
.__ag__active__ {
  color: @primary;
}
.airplay {
  height: 40wx;
  width: 40wx;
  text-align: center;
  line-height: 40wx;
}
.airplay-text {
  color: @white;
  text-align: center;
  line-height: 37wx;
  font-size: 35px;
}
</style>
