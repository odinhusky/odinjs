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
      <text class="__rich__text__" v-if="item.text">{{ item.text }}</text>
      <a class="__rich_a__" v-if="item.href" @click="goJumps(item.href)"
        ><text class="__rich_a_text__">{{ item.atext }}</text></a
      >
    </div>
  </div>
</template>

<script>
import agMinUrl from "./__ag__minurl__.js"
import sport from "./__ag__sport__.js"
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

      if (ss.length == 0) {
        return [{ text: html }]
      }
      for (let i in ss) {
        let s = ss[i]
        s = s.trim()

        if (/^img/.test(s)) {
          let ie = s.indexOf(">")
          let src = s.substr(0, ie - 1)
          this.imgSrc(src, arr)
          let text = s.substr(ie + 1)
          if (text) {
            this.text(text, arr)
          }
        } else if (/^a/.test(s)) {
          let ie = s.indexOf(">")
          let ah = s.substr(0, ie - 1)
          let text = s.substr(ie + 1)
          let ai = i * 1 + 1
          let st = ss[ai]
          if (st.indexOf("a") > 0) {
            text = s.substr(ie + 1)
          } else {
            let at = st.indexOf(">")
            let ae = st.substr(at + 1)
            text = ae.trim()
            ss.splice(ai, 1)
          }

          this.aHref(ah, text, arr)
        } else {
          let ie = s.indexOf(">")
          let text = s.substr(ie + 1)
          if (text) {
            text = text.trim()
            this.text(text, arr)
          }
        }
      }
      // console.log('arr',arr)
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
    aHref(hr, t, arr) {
      let href = /href=['"]([^'"]*)['"]?/.exec(hr)
      if (href) {
        href = href[1]
        let re = /&amp;/g
        href = href.replace(re, "&")
        let obj = {
          href: href,
          atext: t,
        }
        arr.push(obj)
      }
    },
    goJumps(href) {
      if (href) {
        sport.urlTo({ url: href })
      }
      // console.log('arr',href)
    },
  },
}
</script>

<style scoped lang="less">
@import "../style/theme.less";
.__ag__richtext__ {
  padding-bottom: 20px;
}
.__ag__richbox__ {
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.__rich__text__ {
  flex: 1;
  line-height: 25wx;
  white-space: inherit;
  overflow: auto;
  margin-bottom: 10wx;
}
.__ag__newdetails__image__ {
  flex: 1;
  height: 400px;
}
.__rich_a__ {
  text-decoration: underline;
  margin-bottom: 10wx;
}
.__rich_a_text__ {
  color: @blue10;
}
</style>
