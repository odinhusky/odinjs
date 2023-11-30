<template>
  <div
    class="__ag__anchorlist-item__"
    :class="[isindex ? '__ag__index-anchor-item__' : '']"
    v-if="item && item.id"
  >
    <div v-if="isindex" class="__ag__anchorlist_box__">
      <div class="__ag__anchorlist-img__">
        <div
          class="__ag__image_border__"
          :class="[
            item &&
            item.joinMap &&
            item.joinMap.live &&
            item.joinMap.live.scheduleId
              ? '__ag__image_live_border__'
              : '',
          ]"
        >
          <ag-userimg
            class="__ag__anchorlist-image__"
            :fontSize="true"
            :avatar="item.avatar"
            :name="item.userNicename"
            @itemtap="$emit('onClick', item)"
          ></ag-userimg>
        </div>
        <div
          class="__ag__anchorlist-status__"
          v-if="
            item &&
            item.joinMap &&
            item.joinMap.live &&
            item.joinMap.live.scheduleId
          "
        >
          <text class="__ag__anchorlist-zb__">直播中</text>
        </div>
        <div
          class="__ag__anchorlist-status__ __ag__anchorlist-notstatus__"
          v-else
        >
          <text class="__ag__anchorlist-home__">不在家</text>
        </div>
      </div>
      <text class="__ag__anchorlist-text__">{{
        item && item.userNicename
      }}</text>
      <div v-if="showAction" class="__ag__anchorlist_follow__">
        <div
          class="__ag__anchorlist-gz__ __ag__anchorlist_item__ cancelfollow"
          @click.stop="__ag__cancelFollow__(item)"
          v-if="isFollow"
        >
          <!-- <text class="agiconfont icon-heart3 __ag__anchorlist-icon__ heart3">&#xe700;</text> -->
          <text class="__ag__anchorlist-dy__ heart3">已订阅</text>
        </div>
        <div
          v-else
          class="__ag__anchorlist-gz__ __ag__anchorlist_item__"
          @click.stop="__ag__followTap__(item)"
        >
          <!-- <text class="agiconfont icon-outlined_heart __ag__anchorlist-icon__">&#xe66d;</text> -->
          <text class="__ag__anchorlist-dy__">订阅</text>
        </div>
        <div
          v-if="
            item &&
            item.joinMap &&
            item.joinMap.live &&
            item.joinMap.live.scheduleId
          "
          class="__ag__anchorlist-gz__"
          @click.stop="__ag__private__(item)"
        >
          <!-- <text class="agiconfont icon-outlined_heart __ag__anchorlist-icon__">&#xe66d;</text> -->
          <text class="__ag__anchorlist-dy__">私聊</text>
        </div>
      </div>
      <div class="__ag__anchorlist-score__" v-if="showAction">
        <text class="__ag__anchorlist-num__">订阅人数:</text>
        <text class="__ag__anchorlist-num__">{{ item && item.score }}</text>
      </div>
    </div>
    <div class="__ag__anchorlist_w__" v-else>
      <div class="__ag_w_lf__">
        <div class="__ag__anchorlist-img__ __ag__anchorlist_img__">
          <div
            class="__ag__image_border__"
            :class="[
              item &&
              item.joinMap &&
              item.joinMap.live &&
              item.joinMap.live.scheduleId
                ? '__ag__image_live_border__'
                : '',
            ]"
          >
            <ag-userimg
              class="__ag__anchorlist-image__"
              :fontSize="true"
              :avatar="item.avatar"
              :name="item.userNicename"
              @itemtap="$emit('onClick', item)"
            ></ag-userimg>
          </div>
          <div
            class="__ag__anchorlist-status__"
            v-if="
              item &&
              item.joinMap &&
              item.joinMap.live &&
              item.joinMap.live.scheduleId
            "
          >
            <text class="__ag__anchorlist-zb__">直播中</text>
          </div>
          <div
            class="__ag__anchorlist-status__ __ag__anchorlist-notstatus__"
            v-else
          >
            <text class="__ag__anchorlist-home__">不在家</text>
          </div>
        </div>
        <div class="__ag_w_c__">
          <text class="__ag__anchorlist-text__ __ag__anchorlist_text__">{{
            item && item.userNicename
          }}</text>
          <div
            class="__ag__anchorlist-score__ __ag__anchorlist_score__"
            v-if="showAction"
          >
            <text class="__ag__anchorlist-num__ __ag__anchorlist_num__"
              >订阅人数:</text
            >
            <text class="__ag__anchorlist-num__ __ag__anchorlist_num__">{{
              item && item.score
            }}</text>
          </div>
        </div>
      </div>
      <div class="__ag_w_rg__">
        <div v-if="showAction" class="__ag__anchorlist_follow__">
          <div
            class="__ag__anchorlist-gz__ __ag__anchorlist_item__ cancelfollow __ag__anchorlist_gz__"
            @click.stop="__ag__cancelFollow__(item)"
            v-if="isFollow"
          >
            <text class="__ag__anchorlist-dy__ heart3">已订阅</text>
          </div>
          <div
            v-else
            class="__ag__anchorlist-gz__ __ag__anchorlist_item__ __ag__anchorlist_gz__"
            @click.stop="__ag__followTap__(item)"
          >
            <text class="__ag__anchorlist-dy__">订阅</text>
          </div>
          <div
            v-if="
              item &&
              item.joinMap &&
              item.joinMap.live &&
              item.joinMap.live.scheduleId
            "
            @click.stop="__ag__private__(item)"
          >
            <!-- 私聊Icon -->
            <image
              resize="contain"
              :src="handleImgPath('active-sliao.png')"
              class="__ag__sliao__"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import agMinix from "./__ag__minix__.js"
import agMinUrl from "./__ag__minurl__.js"
import util from "./util.js"
import env from "./env.js"
import userImg from "./__ag__userImg__.vue"
export default {
  mixins: [agMinix, agMinUrl],
  components: {
    "ag-userimg": userImg,
  },
  props: {
    item: {
      type: Object,
      default: function () {
        return {}
      },
    },
    isindex: {
      type: Boolean,
      default: false,
    },
    listFollowMap: {
      type: Object,
      default: function () {
        return {}
      },
    },
    showAction: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      f__ag_id__: 0,
      env,
    }
  },
  computed: {
    isFollow() {
      if (!this.listFollowMap) {
        return false
      }
      let r = this.listFollowMap[this.item.id]
      return r
    },
  },
  methods: {
    __ag__cancelFollow__(item) {
      this.$emit("cancelFollow", item)
    },
    __ag__followTap__(item) {
      this.$emit("followTap", item)
    },
    __ag__private__(item) {
      let uid = item.id
      let params = {
        tab: 1,
        uid: uid,
      }
      util.getPush("__ag__live__", params)
    },
  },
}
</script>

<style scoped lang="less">
@import "../style/theme.less";
.__ag__anchorlist-item__ {
  // background-color: @white;
  margin-bottom: 16wx;
  border-radius: 8px;
  flex-direction: column;
  justify-content: center;
  padding-bottom: 20px;
  padding-top: 10px;
}
.__ag__index-anchor-item__ {
  margin-bottom: 0px;
  padding-top: 0;
  padding-bottom: 0;
}
.__ag__anchorlist_box__ {
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.__ag__anchorlist-img__ {
  width: 120px;
  height: 120px;
  border-radius: 60px;
  background-color: @white;
  margin-top: 14px;
  position: relative;
  align-items: center;
  justify-content: center;
}
.__ag__image_border__ {
  width: 120px;
  height: 120px;
  border-radius: 60px;
  background-color: @white;
  align-items: center;
  justify-content: center;
  border-style: solid;
  border-width: 4px;
  border-color: @border1;
}
.__ag__image_live_border__ {
  border-color: @primary;
}
.__ag__anchorlist-image__ {
  width: 103px;
  height: 103px;
  background-color: @gray2;
  border-radius: 60px;
  color: @black30;
  text-align: center;
  display: flex;
  /* align-items: center; */
  justify-content: center;
  font-size: 40px;
}

.__ag__anchorlist-text__ {
  font-style: normal;
  font-weight: 500;
  font-size: 14wx;
  color: @black;
  margin-top: 20px;
  text-align: center;
  line-height: 40px;
  lines: 1;
  text-overflow: ellipsis;
}
.__ag__anchorlist-status__ {
  margin-top: 6px;
  height: 30px;
  display: flex;
  flex-direction: row;
  align-items: center;
  position: absolute;
  bottom: 0px;
  padding-left: 10px;
  padding-right: 10px;
  background-color: @primary;
  border-radius: 20px;
}
.__ag__anchorlist-notstatus__ {
  background-color: @gray3;
}
.__ag__anchorlist-yuan__ {
  background-color: @red2;
  width: 16px;
  height: 16px;
  border-radius: 50%;
}
.__ag__anchorlist-zb__ {
  font-style: normal;
  font-weight: normal;
  font-size: 9wx;
  text-align: center;
  letter-spacing: 0.05em;
  color: @white;
}
.__ag__anchorlist-home__ {
  font-style: normal;
  font-weight: normal;
  font-size: 9wx;
  letter-spacing: 0.05em;
  color: @white;
}
.__ag__anchorlist_follow__ {
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.__ag__anchorlist_item__ {
  margin-right: 15px;
}
.__ag__anchorlist-gz__ {
  margin-top: 7px;
  border-radius: 8px;
  height: 30wx;
  padding-left: 40px;
  padding-right: 40px;
  font-size: 13wx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: @white;
  flex-direction: row;
  background-color: @primary;
}
.cancelfollow {
  background-color: @button-bg-color;
  color: @primary;
}
.heart3 {
  color: @primary;
}
.__ag__anchorlist-dy__ {
  font-size: 13wx;
  color: @white;
}
.__ag__anchorlist-icon__ {
  font-size: 16wx;
  color: @white;
  margin-right: 3px;
}

.__ag__anchorlist-score__ {
  flex-direction: row;
  margin-top: 30px;
  align-items: center;
}
.__ag__anchorlist-num__ {
  font-style: normal;
  font-weight: normal;
  font-size: 11wx;
  color: @primary;
}

.__ag__anchorlist_w__ {
  flex-direction: row;
  align-items: center;
  background-color: @white;
}
.__ag_w_lf__ {
  flex: 1;
  flex-direction: row;
  align-items: center;
  padding-left: 40px;
}
.__ag__anchorlist_img__ {
  margin-top: 0px;
}
.__ag_w_c__ {
  flex: 1;
  padding-left: 20px;
  justify-content: center;
}
.__ag__anchorlist_text__ {
  text-align: left;
  margin-left: 0px;
  margin-right: 0px;
  margin-top: 0px;
  font-size: 16wx;
  font-weight: 600;
}
.__ag__anchorlist_score__ {
  margin-top: 18px;
}
.__ag__anchorlist_num__ {
  color: @gray4;
  font-size: 12wx;
}
.__ag_w_rg__ {
  padding-right: 40px;
  justify-content: center;
}
.__ag__sliao__ {
  width: 50px;
  height: 50px;
  margin-top: 2px;
}
.__ag__anchorlist_gz__ {
  border-radius: 40px;
  padding-left: 25px;
  padding-right: 25px;
  height: 52px;
  line-height: 52px;
  margin-right: 20px;
}
</style>
