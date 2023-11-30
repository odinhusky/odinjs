<template>
  <!-- v-if="!(type==6 &&( status==0 || status==2))" -->
  <div class="__ag__task-item-container__">
    <div class="__ag__icon-content__">
      <div class="__ag__task-icon__">
        <image :src="__ag__url__(icons)" class="__ag__task-icon-img__" />
      </div>
    </div>
    <div
      class="__ag__task-content-box__"
      :class="[border == 1 ? 'no-border' : '']"
    >
      <div class="__ag__task-text-wc__">
        <div class="__ag__task-amount-text__">
          <text class="__ag__task-title-wc__">{{ title }} (</text>
          <text class="__ag__task-amount__" v-if="activityType != 1">{{
            amount > everyAmount ? everyAmount : amount
          }}</text>
          <text class="__ag__task-amount__" v-else>{{
            done != 0 ? 1 : 0
          }}</text>
          <text class="__ag__task-everyAmount__">/{{ everyAmount }})</text>
        </div>
        <text class="__ag__task-description-wc__">{{ des }}</text>
      </div>

      <div
        class="__ag__task-button__"
        :class="[done == 0 ? '' : done == 1 ? 'toget' : 'done']"
        @click="toClick"
      >
        <text v-if="done === 0" class="__ag__task-button-text__">去完成</text>
        <text
          v-if="done === 1"
          class="__ag__task-button-text__"
          :class="[done == 1 ? '__ag__toget__' : '']"
          >领取</text
        >
        <text
          v-if="done === 2"
          class="__ag__task-button-text__"
          :class="[done == 2 ? '__ag__toget__' : '']"
          >已领取</text
        >
      </div>
    </div>
  </div>

  <!-- <div class="__ag__task-item-container__ reg-box" v-else>
		<div class="__ag__icon-content__">
			<div class="__ag__task-icon__">
				<image :src="__ag__url__(icons)" class="__ag__task-icon-img__"/>
			</div>
		</div>
		<div class="__ag__task-content-box__ __ag__reg-text__" :class="[border==1?'no-border':'']">
			<div class="__ag__task-text-wc__">
				<div class="__ag__task-amount-text__">
					<text class="__ag__task-title-wc__">已{{title}} </text>
				</div>
				<text class="__ag__task-description-wc__">{{des}}</text>
			</div>

		</div>
	</div> -->
</template>

<script>
// import api from './components/__ag__sport_api__.js'
// import util from './components/util.js'
import agMinUrl from "./__ag__minurl__.js"
export default {
  mixins: [agMinUrl],
  props: {
    icons: {
      type: String,
      defalut: "",
    },
    title: {
      type: String,
      default: "标题",
    },
    des: {
      type: String,
      default: "说明文字",
    },
    done: {
      default: 0,
    },
    times: {
      type: Number,
      default: 1,
    },
    border: {
      type: Number,
      default: 0,
    },
    id: {},
    postId: {},
    everyAmount: {
      type: Number,
      default: 1,
    },
    amount: {
      type: Number,
      default: 0,
    },
    activityType: {
      type: Number,
      required: true,
    },

    daily: {
      type: Number,
    },
    type: {
      type: Number,
    },
    status: {
      type: Number,
    },
  },
  data() {
    return {}
  },
  methods: {
    toClick() {
      let obj = {
        id: this.postId,
        daily: this.daily,
        status: this.done,
        type: this.activityType,
      }
      this.$emit("click", obj)
    },
  },
}
</script>

<style lang="less" scoped>
@import "../style/theme.less";
.__ag__task-item-container__ {
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-left: 16px;
  padding-bottom: 10px;
}
.__ag__icon-content__ {
  // flex:1;
  width: 94px;
  height: 94px;
  background-color: @red11;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
}
.__ag__task-content-box__ {
  width: 526px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-right: 26px;
  border-bottom-width: 1px;
  border-bottom-color: @gray37;
  border-bottom-style: solid;
}
.__ag__task-amount-text__,
.__ag__task-text-wc__ {
  width: 350px;
  padding-bottom: 10px;
}
.__ag__task-amount-text__ {
  flex-direction: row;
}
.__ag__task-icon-img__ {
  width: 66px;
  height: 66px;
}
.__ag__task-button__ {
  width: 128px;
  height: 46px;
  justify-content: center;
  align-items: center;
  border-radius: 46px;
  border-width: 1px;
  border-style: solid;
  border-color: @red12;
}
.__ag__task-button-text__ {
  color: @red12;
  font-style: normal;
  font-weight: 400;
  font-size: 14wx;
}
.toget {
  border-color: @primary;
}
.__ag__toget__ {
  color: @primary;
}
.done {
  background-color: @button-bg-color;
  border-color: @button-bg-color;
}
.__ag__task-title-wc__ {
  font-size: 14wx;
  line-height: 20wx;
  font-weight: 500;
  font-family: "PingFang SC";
  color: @black;
}
.__ag__task-description-wc__ {
  font-family: "PingFang SC";
  font-style: normal;
  font-weight: 400;
  font-size: 12wx;
  line-height: 17wx;
  color: @gray33;
}
.__ag__task-amount__ {
  color: @red12;
}
.reg-box {
  background-color: @gray38;
  width: 686px;
  border-radius: 5wx;
}
.no-border {
  border-bottom-width: 0;
  border-bottom-color: @gray38;
  border-bottom-style: solid;
}
.__ag__reg-text__ {
  padding-top: 5wx;
}
</style>
