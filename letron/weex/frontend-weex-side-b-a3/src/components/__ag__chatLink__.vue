<template>
  <div v-if="n && n.url" class="__ag__chatlink__" @click="urlTo(n)">
    <div class="__ag__chatlinktop__" v-if="isAnchor">
      <div class="__ag__chatlink_content__">
        <div class="__ag__chatlink_lf__">
          <ag-userimg
            class="__ag__upimg__"
            :name="upinfo.userNicename"
            :avatar="upinfo.avatar"
          ></ag-userimg>
        </div>
        <div class="__ag__chatlink_rg__">
          <div class="__ag__chatlinkbody_">
            <text class="__ag__chatlinkbodytext_">{{ n.content }}</text>
          </div>
          <div class="__ag__chatlinkcontent__">
            <div class="__ag__chatlinkpic__">
              <image :src="__ag__url__(n.thumb)" class="__ag__chatlinkimg__" />
            </div>
            <div class="__ag__chatlinktitle__">
              <text class="__ag__chatlinktitle_text__">{{ n.title }}</text>
              <text class="agiconfont __ag__next_text__">&#xec5a;</text>
            </div>
          </div>
          <text class="agiconfont corners">&#xec62;</text>
        </div>
      </div>
    </div>
    <div class="__ag__notices_content__" v-else>
      <div class="__ag__notices_top__">
        <div class="__ag__chatlink_content__">
          <div class="__ag__notices_lf__">
            <text class="__ag__notices_title__">{{ n.title }}</text>
            <text class="__ag__notices_item__">{{ n.content }}</text>
          </div>
          <div class="__ag__notices_rg__">
            <image :src="__ag__url__(n.thumb)" class="__ag__notices_image__" />
          </div>
        </div>
      </div>
      <div class="__ag__border__"></div>
      <div class="__ag__notices_bottom__">
        <text class="__ag__chatlinktitle_text__">公告</text>
        <text class="agiconfont __ag__next_text__">&#xec5a;</text>
      </div>
    </div>
  </div>
</template>

<script>
import agMinUrl from "@/components/__ag__minurl__.js"
import sport from "./__ag__sport__.js"
import util from "./util.js"
import userImg from "./__ag__userImg__.vue"

export default {
  components: {
    "ag-userimg": userImg,
  },
  props: {
    n: {
      type: Object,
      default: function () {
        return {}
      },
    },
    isAnchor: {
      type: Boolean,
      default: false,
    },
    upinfo: {
      type: Object,
      default: function () {
        return {}
      },
    },
  },
  mixins: [agMinUrl],
  data() {
    return {}
  },
  methods: {
    urlTo(item) {
      sport.urlTo(item)
    },
  },
}
</script>

<style scoped lang="less">
@import "../style/theme.less";
.__ag__chatlink__ {
  width: 718px;
  flex: 1;
}
.__ag__chatlinktop__ {
  flex: 1;
}
.__ag__chatlink_content__ {
  flex-direction: row;
  align-items: flex-start;
}
.__ag__chatlink_lf__ {
  width: 110px;
  height: 110px;
}
.__ag__upimg__ {
  width: 88px;
  height: 88px;
}
.__ag__chatlinkpic__ {
  width: 46px;
  height: 46px;
}
.__ag__chatlinkimg__ {
  width: 46px;
  height: 46px;
}
.__ag__chatlink_rg__ {
  flex: 1;
  border-radius: 10px;
  margin-left: 10px;
  padding-left: 20px;
  padding-right: 20px;
  background-color: @white;
  box-shadow: 0px 2px 2px @black25;
  border-style: solid;
  border-width: 1px;
  border-color: @border2;
  border-left-style: solid;
  border-left-width: 0px;
  border-left-color: @border2;
  padding-bottom: 20px;
  position: relative;
}
.__ag__chatlinkcontent__ {
  flex-direction: row;
  padding-left: 10px;
  padding-right: 10px;
}
.__ag__chatlinktitle__ {
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: @gray6;
  flex: 1;
  padding-left: 15px;
  margin-left: 15px;
}
.__ag__chatlinktitle_text__ {
  font-size: 15wx;
  lines: 1;
  text-overflow: ellipsis;
  color: @primary;
}
.__ag__next_text__ {
  font-size: 14wx;
  color: @primary;
  font-weight: bold;
}
.__ag__chatlinkbody_ {
  padding-top: 10px;
  padding-bottom: 15px;
  padding-left: 10px;
}
.__ag__chatlinkbodytext_ {
  font-size: 13wx;
  color: @black;
  line-height: 30px;
  lines: 5;
  text-overflow: ellipsis;
}
.corners {
  position: absolute;
  left: -35px;
  top: -2px;
  font-size: 40wx;
  color: @white;
}
.__ag__notices_content__ {
  flex: 1;
  background-color: @white;
  border-radius: 10px;
  padding-top: 20px;
  padding-bottom: 20px;
  box-shadow: 0px 2px 2px @black25;
  border-style: solid;
  border-width: 1px;
  border-color: @border2;
  padding-left: 20px;
  padding-right: 20px;
}
.__ag__notices_top__ {
  flex: 1;
}
.__ag__notices_lf__ {
  flex: 1;
  padding-right: 20px;
}
.__ag__notices_title__ {
  line-height: 30px;
  lines: 2;
  text-overflow: ellipsis;
  font-size: 13wx;
  color: #000;
  margin-bottom: 10px;
}
.__ag__notices_item__ {
  line-height: 35px;
  lines: 5;
  text-overflow: ellipsis;
  font-size: 13wx;
  color: @gray7;
}
.__ag__border__ {
  height: 2px;
  margin-top: 10px;
  margin-bottom: 10px;
  background-color: @primary;
}
.__ag__notices_rg__ {
  width: 130px;
  margin-bottom: 10px;
}
.__ag__notices_image__ {
  width: 110px;
  height: 110px;
}
.__ag__notices_bottom__ {
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-top: 10px;
  padding-bottom: 10px;
}
</style>
