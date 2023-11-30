	import util from "./util.js"
	export default {
    data() {
      return {}
    },
    methods: {
      __ag__url__(url) {
        return util.url(url)
      },
      handleImgPath(url) {
        return util.imgPath(url)
      },
      staticPath(fileName) {
        let middlePath = ""
        const extension = fileName.split(".")[1]

        switch (extension) {
          case "jpeg":
          case "png":
          case "gif":
            middlePath = "img"
            break
          case "html":
            middlePath = "page"
            break
        }

        return `./static/${middlePath}/${fileName}`
      },
    },
  }