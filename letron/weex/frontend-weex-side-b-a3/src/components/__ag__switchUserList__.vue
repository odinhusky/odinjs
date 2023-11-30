<template>
  <div
    class="__ag__switch_main__"
    v-if="list && list.length > 0"
    :style="switchstyle"
  >
    <!-- <div class="__ag__anthor_title__">
            <text class="title-text">请选择主播</text>
            <text class="agiconfont __ag__back__" @click.stop="$emit('close')">&#xe64b;</text>
        </div> -->
    <scroller class="__ag__switch_scroller__" show-scrollbar="false">
      <div class="__ag__anthor_item__" v-for="item in list" :key="item.id">
        <div class="__item_lf__">
          <div class="__lf_avatar__">
            <div class="__lf_avatar_item__">
              <avator
                class="__ag__upimg__"
                :avatar="item.avatar"
                :islive="true"
                :name="item.upName"
              ></avator>
            </div>
            <text class="__ag__live_text__">直播中</text>
          </div>
          <text class="__lf_text__">{{ item && item.upName }}</text>
        </div>
        <div class="__item_rg__">
          <div class="__rg_item__">
            <text class="agiconfont __ag__fire__">&#xe6a5;</text>
            <text class="__ag__uptext__">{{
              item &&
              item.joinMap &&
              item.joinMap.room &&
              item.joinMap.room.amount
            }}</text>
          </div>
          <div class="__rg_item__">
            <text class="agiconfont __ag__heart3__">&#xe700;</text>
            <text class="__ag__uptext__">{{
              item &&
              item.joinMap &&
              item.joinMap.user &&
              item.joinMap.user.score
            }}</text>
          </div>
          <text class="__rg_btn__" @click="__ag__goLives__(item)">观看</text>
        </div>
      </div>
    </scroller>
  </div>
</template>

<script>
import agMinix from "./__ag__minix__.js"
import bc from "./__ag__bc__.js"
import avator from "./__ag__userImg__.vue"
export default {
  mixins: [agMinix],
  props: {
    list: {
      type: Array,
      default: function () {
        return []
      },
    },
    viewHeight: {
      type: Number,
      default: 0,
    },
  },
  components: {
    avator,
  },
  computed: {
    switchstyle() {
      let style = {}
      style.maxHeight = this.viewHeight + "px"
      return style
    },
  },
  methods: {
    __ag__goLives__(item) {
      let uid = item.uid
      bc.postMessage("switchAnthor", uid)
      // this.__ag__itemtap__(uid)
      this.$emit("close")
      this.$emit("pause")
    },
  },
}
</script>

<style scoped lang="less">
@import "../style/theme.less";
.__ag__switch_main__ {
  width: 750px;
  position: absolute;
  /* top: 80px; */
  bottom: 0;
  border-top-left-radius: 8wx;
  border-top-right-radius: 8wx;
  background-color: @white;
  justify-content: flex-end;
}
.__ag__anthor_title__ {
  width: 750px;
  height: 50wx;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: relative;
  border-bottom-style: solid;
  border-bottom-width: 1wx;
  border-bottom-color: @gray8;
  background-color: @gray5;
}
.title-text {
  font-style: normal;
  font-weight: 500;
  font-size: 17wx;
  color: @black;
  opacity: 0.9;
}
.__ag__back__ {
  font-size: 50px;
  color: @black;
  position: absolute;
  right: 15wx;
}
.__ag__switch_scroller__ {
  width: 750px;
}
.__ag__anthor_item__ {
  width: 750px;
  height: 75wx;
  padding-left: 24wx;
  padding-right: 24wx;
  border-bottom-style: solid;
  border-bottom-width: 1wx;
  border-bottom-color: @gray8;
  flex-direction: row;
  align-items: center;
}
.__lf_avatar__ {
  width: 43wx;
  height: 43wx;
  border-radius: 50wx;
  position: relative;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.__lf_avatar_item__ {
  width: 43wx;
  height: 43wx;
  border-radius: 50wx;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-style: solid;
  border-width: 3px;
  border-color: @primary;
}
.__ag__live_text__ {
  position: absolute;
  bottom: -1px;
  padding: 5px;
  border-radius: 2px;
  font-style: normal;
  font-weight: 500;
  font-size: 7wx;
  color: @white;
  background-color: @primary;
}
.__item_lf__ {
  flex: 0.4;
  flex-direction: row;
  align-items: center;
}
.__lf_text__ {
  flex: 1;
  font-style: normal;
  font-weight: 400;
  font-size: 14wx;
  line-height: 19wx;
  color: @blue7;
  margin-left: 8wx;
  lines: 1;
  text-overflow: ellipsis;
}
.__item_rg__ {
  flex: 0.6;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-left: 15wx;
}
.__rg_item__ {
  height: 20wx;
  flex-direction: row;
  align-items: center;
}
.__ag__fire__ {
  font-size: 16wx;
  color: @orange1;
}
.__ag__heart3__ {
  font-size: 14wx;
  color: @primary;
}
.__ag__uptext__ {
  font-style: normal;
  font-weight: 400;
  font-size: 13wx;
  color: @blue7;
  margin-left: 5wx;
}
.__ag__upimg__ {
  width: 35wx;
  height: 35wx;
}
.__rg_btn__ {
  width: 108px;
  height: 52px;
  background-color: @primary;
  font-style: normal;
  font-weight: 500;
  font-size: 13wx;
  color: @white;
  line-height: 52px;
  text-align: center;
  border-radius: 26px;
}
</style>
