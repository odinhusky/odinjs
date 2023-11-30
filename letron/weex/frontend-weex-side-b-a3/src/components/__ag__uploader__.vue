<template>
  <div ref="file" class="uploader" @click="chooseImage">
    <slot></slot>
  </div>
</template>

<script>
import util from "./util.js"
// import sport from './sport.js'

export default {
  data() {
    return {}
  },
  onLoad() {
    console.log("upload onLoad")
  },
  onShow() {},
  mounted() {},
  computed: {},
  methods: {
    chooseImage() {
      // uni.chooseImage({
      //     count: 1, //默认9
      //     sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
      //     sourceType: ['album','camera'], //从相册选择
      //     success:  (res)=> {
      // 		console.log(JSON.stringify(res.tempFilePaths))
      // 		let path = res.tempFilePaths[0]
      // 		let resSize = res.tempFiles[0].size
      // 		let isLt4M = resSize / 1024 / 1024 < 4;
      // 		if (!isLt4M) {
      // 		  util.message('上传图片大小不能超过 4MB!');
      // 		  return
      // 		}
      // 		let fileUrls = util.filePost('upload')
      // 		 uni.uploadFile({
      // 			url: fileUrls.url, //仅为示例，非真实的接口地址
      // 			filePath: path,
      // 			name: 'file',
      // 			header:{
      // 				aghash:fileUrls.aghash
      // 			},
      // 			success: (uploadFileRes) => {
      // 				if (!uploadFileRes || !uploadFileRes.data){
      // 					util.message('上传文件失败')
      // 					return
      // 				}
      // 				console.log('upload file',uploadFileRes.data)
      // 				let j = JSON.parse(uploadFileRes.data)
      // 				let url = j.data
      // 				this.$emit('input', url)
      // 			}
      // 		})
      //     }
      // })
    },
  },
}
</script>

<style scoped>
.uploader {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
