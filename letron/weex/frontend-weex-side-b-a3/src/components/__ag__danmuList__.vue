<template>
  <div class="__ag__denmu_main__">
    <div
      class="__ag__denmu_list__"
      :class="['__ag__denmu-' + index + '__']"
      v-for="(item, index) in danmuList"
    >
      <div
        class="__ag__denmu_item__"
        :class="[li.stopDan ? 'move-danmu' : 'move-danmu-no']"
        v-for="li in item.list"
        :style="{ left: li.left }"
      >
        <div class="__ag__avator_item__" v-if="li.senderType == 1">
          <image
            class="__ag__avator_img__"
            mode="widthFix"
            :src="__ag__url__(li.senderAvator)"
          ></image>
          <text class="__ag__avator_text__">主播</text>
        </div>
        <text v-if="li.senderType == 2" class="__ag__assistant_item__"
          >助理</text
        >
        <text
          class="__ag__denmu_text__"
          :class="[
            li.senderType == 1 ? '__ag__anthor_text__' : '',
            li.senderType == 2 ? '__ag__assistant_text__' : '',
          ]"
          @click.stop="__ag__click__(li.link)"
          >{{ li.content }}</text
        >
      </div>
    </div>
  </div>
</template>

<script>
import sport from "./__ag__sport__.js"
import agMinUrl from "./__ag__minurl__.js"
import util from "./util.js"
export default {
  mixins: [agMinUrl],
  props: {
    isFull: {
      type: Boolean,
      default: false,
    },
    fullDevice: {
      type: Object,
      default: function () {
        return { width: 0, height: 0 }
      },
    },
  },
  data() {
    return {
      danmuList: [],
    }
  },
  watch: {},
  mounted() {
    for (let i = 0; i < 6; i++) {
      this.danmuList.push({ list: [], left: 0 })
    }
  },
  methods: {
    add(item) {
      let li = this.current()
      this.$set(item, "stopDan", false)
      this.$set(item, "left", "780px")
      if (this.isFull) {
        this.$set(item, "left", this.fullDevice.height.toFixed(2) + 30 + "px")
      }

      item.link = util.getLink(item.content)
      item.content = item.content.replace(/[\r\n]+/g, " ")
      let w = util.calculationText(26, item.content) + 100
      li.left += w
      item.w = w
      setTimeout(() => {
        item.stopDan = true
        item.left = -w + "px"
      }, 250)

      setTimeout(() => {
        let index = li.list.indexOf(item)
        if (index > -1) {
          li.list.splice(index, 1)
          li.left -= item.w
        }
      }, 6000)

      li.list.push(item)
    },
    current() {
      let min = -1
      let index = 0
      for (let i in this.danmuList) {
        let r = this.danmuList[i]
        if (min == -1 || r.left < min) {
          min = r.left
          index = i
        }
      }
      return this.danmuList[index]
    },
    urlTo(item) {
      sport.urlTo(item)
    },
    onclose() {
      this.$emit("onclose")
    },
    __ag__click__(url) {
      if (!url) {
        return
      }
      sport.urlTo({ url })
    },
  },
}
</script>

<style lang="less" scoped>
@import "../style/theme.less";
.__ag__denmu_main__ {
  position: absolute;
  width: 750px;
  top: 70px;
  bottom: 70px;
}
.__ag__denmu_list__ {
  width: 750px;
  height: 46.83px;
  position: relative;
}
/* .__ag__denmu-0__ {
        background-color: yellow;
    }
    .__ag__denmu-1__ {
        background-color: red;
    }
    .__ag__denmu-2__ {
        background-color: blue;
    }
    .__ag__denmu-3__ {
        background-color: green;
    }
    .__ag__denmu-4__ {
        background-color: orange;
    }
    .__ag__denmu-5__ {
        background-color: orchid;
    } */
.__ag__denmu_item__ {
  position: absolute;
  transition-property: left;
  flex-direction: row;
  align-items: center;
}
.move-danmu-no {
  left: 750px;
}
.move-danmu {
  transition-duration: 5s;
  transition-delay: 0s;
}
.__ag__denmu_text__ {
  color: @white;
  font-size: 13wx;
}
.__ag__denmu_thhp__ {
  color: @blue3;
  font-size: 13wx;
}
.__ag__avator_item__ {
  width: 60px;
  height: 60px;
  border-radius: 50wx;
  position: relative;
  margin-right: 20px;
}
.__ag__avator_text__ {
  width: 54px;
  height: 28px;
  text-align: center;
  line-height: 24px;
  position: absolute;
  left: -27px;
  top: -5px;
  border-style: solid;
  border-width: 3px;
  border-color: @primary;
  border-radius: 6px;
  color: @primary;
  font-size: 8wx;
  font-weight: 600;
}
.__ag__avator_img__ {
  width: 60px;
  height: 60px;
  border-radius: 50wx;
}
.__ag__anthor_text__ {
  color: @primary;
}
.__ag__assistant_item__ {
  width: 80px;
  height: 40px;
  text-align: center;
  line-height: 37px;
  border-style: solid;
  border-width: 3px;
  border-color: @primary;
  border-radius: 12px;
  color: @primary;
  font-size: 12wx;
  font-weight: 600;
  margin-right: 20px;
}
.__ag__denmu_content__ {
  flex-direction: row;
  align-items: center;
}
.__ag__assistant_text__ {
  color: @primary;
}
</style>
