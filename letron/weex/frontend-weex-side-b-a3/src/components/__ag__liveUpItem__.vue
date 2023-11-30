<template>
  <div
    v-if="item1 && item1.id"
    class="__ag__liveupitem__"
    @click.stop="__ag__itemtap__(item1.uid)"
  >
    <div class="__ag__liveupitemimgview__">
      <image
        resize="cover"
        v-if="thumbType(item1)"
        :src="__ag__url__(item1.joinMap.room.thumb)"
        class="__ag__liveupitemimg__"
      ></image>
      <image
        resize="cover"
        v-else-if="item1.thumb"
        @load="imgError"
        :src="__ag__url__(item1.thumb)"
        class="__ag__liveupitemimg__"
      ></image>
      <image
        resize="cover"
        v-else
        class="__ag__liveupitemimg__"
        :src="handleImgPath('def-jt.png')"
      ></image>
      <div
        class="__ag__liveupitemmatch__"
        v-if="
          item1.joinMap && item1.joinMap.match && item1.joinMap.match.nameAbbr
        "
      >
        <text class="__ag__liveupitemtext__">{{
          item1.joinMap && item1.joinMap.match && item1.joinMap.match.nameAbbr
        }}</text>
        <div class="__ag__liveup_rg__">
          <image
            class="__ag__anchorinfo_image__"
            :src="handleImgPath('stream.gif')"
            mode="aspectFit"
          ></image>
          <text class="__ag__liveupitembottomtext__">{{
            getFormattedViewerCount(item1)
          }}</text>
        </div>
      </div>
      <div class="__ag__liveupitem_match__" v-if="!item1.thumb">
        <div class="__ag__match_lf__">
          <image
            resize="cover"
            v-if="
              item1.joinMap &&
              item1.joinMap.schedule &&
              item1.joinMap.schedule.teamFlaga
            "
            :src="
              __ag__url__(
                item1.joinMap &&
                  item1.joinMap.schedule &&
                  item1.joinMap.schedule.teamFlaga
              )
            "
            class="__ag__match_image__"
          ></image>
          <div class="__ag__match_item__" v-else>
            <text class="__ag__match_text__">{{
              item1.joinMap &&
              item1.joinMap.schedule &&
              item1.joinMap.schedule.teamNamea &&
              item1.joinMap.schedule.teamNamea.charAt(0)
            }}</text>
          </div>
        </div>
        <div class="__ag__match_rg__">
          <image
            resize="cover"
            v-if="
              item1.joinMap &&
              item1.joinMap.schedule &&
              item1.joinMap.schedule.teamFlagb
            "
            :src="
              __ag__url__(
                item1.joinMap &&
                  item1.joinMap.schedule &&
                  item1.joinMap.schedule.teamFlagb
              )
            "
            class="__ag__match_image__"
          ></image>
          <div class="__ag__match_item__" v-else>
            <text class="__ag__match_text__">{{
              item1.joinMap &&
              item1.joinMap.schedule &&
              item1.joinMap.schedule.teamNameb &&
              item1.joinMap.schedule.teamNameb.charAt(0)
            }}</text>
          </div>
        </div>
      </div>
      <div class="__ag__liveupitem_info__">
        <ag-userimg
          class="__ag__liveupitemupimg__"
          :isIndex="true"
          :avatar="item1.avatar"
          :uid="item1.uid"
          :name="item1.upName"
        ></ag-userimg>
        <text class="__ag__liveupitemuptext__">{{ item1.upName }}</text>
      </div>
    </div>
    <div class="__ag__liveupitemcontent__">
      <div class="__ag__liveitemcontentright__">
        <text class="__ag__liveupitemtitletext__">{{ item1.title }}</text>
        <!-- <div class="__ag__liveupitemname__">
                    
                   <div class="__ag__liveupitembottom__">
                        <text class="agiconfont __ag__fire__">&#xe61c;</text>
                        <image src="../static/__ag__fire__.png" mode="aspectFit" class="__ag__fire__"></image>
                       
                    </div>
                </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import agMinix from "./__ag__minix__.js"
import agMinUrl from "./__ag__minurl__.js"
import userImg from "./__ag__userImg__.vue"
import util from "./util.js"
import env from "./env.js"

export default {
  components: {
    "ag-userimg": userImg,
  },
  mixins: [agMinix, agMinUrl],
  props: {
    item: {
      type: Object,
      default: function () {
        return {}
      },
    },
  },
  data() {
    return {
      item1: {},
      jturl: "",
      env,
    }
  },
  watch: {
    item(n) {
      this.item1 = n
    },
  },
  mounted() {
    this.item1 = this.item
    if (env.brand == "hb") {
      this.jturl = "static/a3/def-jt.png"
    } else {
      this.jturl = "static/a3/jt.png"
    }
  },
  methods: {
    getFormattedViewerCount(item) {
      const viewerCount =
        item && item.joinMap && item.joinMap.room && item.joinMap.room.amount
      return viewerCount >= 10000
        ? `${(viewerCount / 10000).toFixed(1)}万`
        : viewerCount
    },
    thumbType(item) {
      let type =
        item.joinMap && item.joinMap.room && item.joinMap.room.thumbType
      let thumb = item.joinMap && item.joinMap.room && item.joinMap.room.thumb
      if (thumb && type && type != 3) {
        return true
      }
      return false
    },
    imgError(event) {
      console.log("event", event)
      if (!event.success) {
        this.item1.thumb = null
      }
    },
    __ag__itemtap__(uid) {
      if (!uid) {
        return
      }
      let params = {
        uid: uid,
      }
      util.getPush("__ag__live__", params)
    },
  },
}
</script>

<style lang="less">
@import "../style/theme.less";
.__ag__liveupitem__ {
  flex: 0.48;
  height: 146wx;
  border-radius: 4wx;
  background-color: @white;
  margin-bottom: 16wx;
  /* margin-right: 15px; */
}
.__ag__liveupitemimgview__ {
  /* width: 340px; */
  /* flex: 1; */
  /* width: 310px; */
  height: 100wx;
  /* border-radius: 16px; */
  position: relative;
}
.__ag__liveupitemimg__ {
  flex: 1;
  height: 100wx;
  border-radius: 8px;
  border-style: solid;
  border-width: 1px;
  border-color: @gray23;
}
.__ag__liveupitemmatch__ {
  flex: 1;
  position: absolute;
  height: 40px;
  top: 0px;
  left: 0;
  right: 0;
  padding-left: 16px;
  padding-right: 16px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.__ag__liveupitemtext__ {
  height: 40px;
  background-color: @black70;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  text-align: center;
  line-height: 40px;
  padding-left: 10px;
  padding-right: 10px;
  font-style: normal;
  font-weight: normal;
  font-size: 20px;
  color: @white;
  overflow: auto;
}
.__ag__liveup_rg__ {
  flex-direction: row;
  align-items: center;
  background-color: @black50;
  border-radius: 14px;
  padding-right: 5px;
}
.__ag__liveupitem_match__ {
  flex: 1;
  position: absolute;
  height: 100wx;
  bottom: 0px;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}
.__ag__match_lf__ {
  width: 100px;
  height: 100wx;
  flex-direction: row;
  align-items: flex-end;
  padding-bottom: 30px;
}
.__ag__match_rg__ {
  width: 100px;
  height: 100wx;
  flex-direction: row;
  align-items: flex-end;
  padding-bottom: 30px;
}
.__ag__match_image__ {
  width: 100px;
  height: 100px;
  border-radius: 50wx;
}
.__ag__match_item__ {
  width: 100px;
  height: 100px;
  border-radius: 50wx;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: @gray23;
}
.__ag__match_text__ {
  width: 80px;
  height: 80px;
  border-radius: 50wx;
  color: @black;
  font-size: 16wx;
  text-align: center;
  line-height: 80px;
}
.__ag__liveupitem_info__ {
  flex: 1;
  position: absolute;
  height: 40px;
  bottom: 0px;
  left: 0;
  right: 0;
  padding-left: 16px;
  padding-right: 16px;
  flex-direction: row;
  align-items: center;
  background-image: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.96),
    rgba(0, 0, 0, 0.04)
  );
}
.__ag__liveupitemcontent__ {
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 12px;
  padding-right: 12px;
  height: 46wx;
}
.__ag__liveupitemupimg__ {
  width: 30px;
  height: 30px;
  margin-right: 16px;
}
.__ag__liveitemcontentright__ {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.__ag__liveupitemtitletext__ {
  width: 306px;
  font-style: normal;
  font-weight: normal;
  font-size: 12wx;
  letter-spacing: 0.02em;
  color: @black;
  /* lines:1;
        text-overflow: ellipsis; */
}
.__ag__liveupitemname__ {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 18wx;
}
.__ag__liveupitemuptext__ {
  width: 60wx;
  font-style: normal;
  font-weight: normal;
  font-size: 11wx;
  lines: 1;
  text-overflow: ellipsis;
  color: @white;
}
.__ag__liveupitembottom__ {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 18wx;
}
.__ag__fire__ {
  color: @red2;
  font-size: 12wx;
}
.__ag__liveupitembottomtext__ {
  font-style: normal;
  font-weight: normal;
  font-size: 11wx;
  color: @white;
}
.__ag__anchorinfo_image__ {
  width: 24px;
  height: 26px;
  border-radius: 50wx;
  margin-right: 8px;
  background-color: @primary;
}
.__ag__other_image__ {
  background-color: @primary;
}
</style>
