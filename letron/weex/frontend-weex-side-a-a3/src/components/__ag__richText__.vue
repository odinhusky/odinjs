<template>
  <div class="__ag__richtext__">
    <div
      v-for="(item, index) in templateArr"
      :key="index"
      class="__ag__richbox__"
    >
      <image
        v-if="item.src"
        :src="__ag__url__(item.src)"
        class="__ag__newdetails__image__"
      ></image>
      <text class="__rich__text__" v-else>{{ item.text }}</text>
    </div>
  </div>
</template>

<script>
import agMinUrl from "./__ag__minurl__.js"
export default {
  mixins: [agMinUrl],
  props: {
    inner: {
      default: "",
    },
  },

  computed: {
    templateArr: function () {
      return this.transform(this.inner)
    },
  },
  methods: {
    transform(html) {
      let arr = []

      let ss = html.split(/[<]+/gi)
      // console.log('ss',ss)
      if (ss.length == 0) {
        return [{ text: html }]
      }

      for (let i in ss) {
        let s = ss[i]
        if (/^img/.test(s)) {
          let ie = s.indexOf(">")
          let src = s.substr(0, ie - 1)
          this.imgSrc(src, arr)
          let text = s.substr(ie + 1)

          if (text) {
            this.text(text, arr)
          }
        } else if (/^p/.test(s)) {
          let ie = s.indexOf(">")
          let text = s.substr(ie + 1)
          if (text) {
            this.text(text, arr)
          }
        } else {
          let ie = s.indexOf(">")
          let text = s.substr(ie + 1)
          if (text) {
            if (arr.length == 0) {
              this.text(text, arr)
            } else {
              let last = arr[arr.length - 1]
              last.text = last.text + text
            }
          }
        }
      }

      return arr
    },
    imgSrc(tag, arr) {
      let src = /src=['"]?([\S]+)['"]?/.exec(tag)
      if (src) {
        src = src[1]
        arr.push({ src })
      }
    },
    text(text, arr) {
      arr.push({ text })
    },
    transform1: function (html) {
      var arr = html.match(/<([a-z]+)(.*?)>(.*?)<.*?\/[a-z]+>/gi)
      if (!arr || !arr.length) return
      var templateArr = []
      for (var i = 0; i < arr.length; i++) {
        let r = arr[i]
        console.log(/<img.*?\>/.test(r))
        if (/<img.*?\/>/.test(r) || /<img.*?\>/.test(r)) {
          console.log("-----", r)
          let src = /src="(.+?)"/.exec(r)
          if (src) {
            src = src[1]
            templateArr.push({ src: src })
          }
        } else {
          //  let n = /<p.*?>(.*)<\/p>/.exec(r)[1]
          let n = /<([a-z]+)(.*?)>(.*)<\/[a-z]+>/.exec(r)[0]
          console.log(n)
          let text = contentHandler(n)
          if (text) {
            templateArr.push({ text: text })
          }
        }
      }

      return templateArr
      function contentHandler(str) {
        var str2 = str.replace(/&nbsp;/g, "")
        return str2.replace(/<.*?>/g, "")
      }
    },
  },
}
</script>
<style scoped>
.__ag__richtext__ {
  padding-bottom: 35px;
}
.__rich__text__ {
  white-space: pre-line;
  line-height: 28wx;
  font-size: 16wx;
  margin-bottom: 10wx;
}
.__ag__newdetails__image__ {
  width: 686px;
  min-height: 400px;
}
</style>
