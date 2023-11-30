<template>
  <div class="wrapper">
    <div style="flex-direction: row">
      <div v-for="(item, index) in contentList1" :key="index">
        <text
          v-if="item.type == 'text'"
          class="__ag__messagelivechatcontent__"
          :class="[
            isAnchor ? '__ag__anchor_text_color__' : '',
            isUpAssistant ? '__ag__assistant_text_color__' : '',
          ]"
          >{{ item.content }}</text
        >
      </div>
    </div>
  </div>
</template>

<script>
import util from "./util.js"
export default {
  props: {
    data: {
      type: Object,
      default: function () {
        return {}
      },
    },
    isAnchor: {
      type: Boolean,
      default: false,
    },
    isUpAssistant: {
      type: Boolean,
      default: false,
    },
    userNicename: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      richTextwidth: 718,
      contentList: [],
    }
  },
  computed: {
    contentList1() {
      let list = []
      if (!this.contentList || !this.contentList.length) {
        return []
      }

      let r = this.contentList[0]
      list.push(r)
      return list
    },
  },
  mounted() {
    this.handleContent()
  },
  methods: {
    handleContent() {
      //这个地方对数据做重新封装之后再添加到data里面去
      let data = this.data

      let sw = util.calculationText(26, this.userNicename)

      if (this.isAnchor || this.isUpAssistant) {
        sw += 72 + 10
      }
      //定义当前行可用的展示空间，第一行的时候，默认就是设置的行宽
      let w = this.richTextwidth - sw

      //对data做判空处理，不为空时这里为true
      if (data && data.jsonContent) {
        //这个数组是我们对传入数组处理之后得到的新的数据源
        let tempContent = []
        let contents = ""
        //对传入的数据源做for循环操作得到每一个具体的元素
        for (let i in data.jsonContent) {
          let r = data.jsonContent[i]
          if (r.type == "text") {
            //获取到当前索引下的content
            let tempStr = r.content
            //strLength表示当前字符串的内容长度，默认是0
            let strLength = 0
            //总长度做求和操作
            strLength = util.calculationText(26, tempStr)
            // 对比当前字符串长度是否小于当前可展示空间
            if (
              strLength >= 0 &&
              strLength <= w &&
              !tempContent &&
              !tempContent.length
            ) {
              //长度小于当前可用空间长度，直接存储到数组中
              tempContent.push(r)
            } else {
              //截取当前字符串长度，按照当前可用空间做截取
              let arr = this.subStr2Length(r, w)
              //当前行可用空间能展示的当前字符串的最大索引值
              let index = arr[0]
              let content = r.content.substring(0, index)
              contents = r.content.substring(index, r.content.length)
              // let content = r.content.replace('/\r\n/','\n');
              // let content = r.content
              // let n = content.indexOf('\n') || content.indexOf('\r');

              // if ( n!= -1) {
              //     let bs = content.substring(0, n)
              //     let bw = util.calculationText(26, bs)
              //     if (bw >=0 && bw <= w ) {
              //         content = content.substring(0, n)
              //         contents = r.content.substring(n, r.content.length)
              //     } else {
              //         content = content.substring(0, index)
              //         contents = r.content.substring(index, r.content.length)
              //     }

              // } else {
              //     content = content.substring(0, index)
              //     contents = r.content.substring(index, r.content.length)
              // }

              let item1 = {
                //截取真实长度填充到当前行末尾的可用空间中
                content: content,
                type: r.type,
              }
              tempContent.push(item1)
              //如果可以展示完，直接添加
              let item2 = {
                /**
                 * 需要说明一点，这里的subString跟Java中有细微区别，Vue中subString不会出现索引越界的问题，超出的话，截取至末尾
                 */
                content: contents.replace("\n", ""),
              }
              r.contents = contents.replace("\r\n", "")
            }
          }
        }

        this.contentList = tempContent
      }
    },
    //按照长度（px）裁剪当前字符串，返回一个数组，0索引位置返回的是当前换行时的index，1索引位置记录的是截取的元素的真实长度。
    subStr2Length(data, lenght) {
      if (data.content) {
        let char = data.content.split("")
        if (lenght && lenght != 0) {
          let tempLenght = 0
          for (let j = 0; j < char.length; j++) {
            let ratio = util.calculationText(26, char[j])
            if (char[j].indexOf("\r") != -1 || char[j].indexOf("\n") != -1) {
              let arr = [j, tempLenght - ratio]
              return arr
            }
            tempLenght += ratio
            if (tempLenght > lenght) {
              let arr = [j, tempLenght - ratio]
              return arr
            }
          }
          //当截取传入的长度超出了剩余长度的时候，返回最后的真实长度和索引
          return [char.length, tempLenght]
        } else {
          return [0, 0]
        }
      }
    },
  },
}
</script>

<style lang="less" scoped>
@import "../style/theme.less";
.__ag__messagelivechatcontent__ {
  font-size: 13wx;
  color: @gray29;
}
.__ag__anchor_text_color__ {
  color: @main-text-color;
}
.__ag__assistant_text_color__ {
  color: @yellow7;
}
</style>
