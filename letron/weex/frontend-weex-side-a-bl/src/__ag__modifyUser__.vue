<template>
	<div class="__ag__modify-user-mian__" >
		<ag-hbtitle :isback="true" title="个人信息"></ag-hbtitle>
		<text class="__ag__modify-finsh__" :class="[ipx?'finsh-ipx':'']"  @click.stop="__ag__modifyFinsh__">完成</text>
		<div class="__ag__modify-user-content__" v-if="a__ag__userInfo__" :class="[ipx?'user-ipx':'']">
			<div class="__ag__modify-user-item__" @click="uploadImage" >
				<text class="__ag__modify-user-text__">头像</text>
				<image v-if="a__ag__userInfo__ && a__ag__userInfo__.avatar" class="__ag__upinfotitleimg__" mode="aspectFill" :src="__ag__url__(this.a__ag__userInfo__.avatar)"></image>
				<text class="__ag__upinfotitleimg__" v-else>{{a__ag__userInfo__ && a__ag__userInfo__.userNicename && a__ag__userInfo__.userNicename.charAt(0)}}</text>
			</div>
			<div class="__ag__modify-user-item__">
				<text class="__ag__modify-user-text__">昵称</text>
				<input type="text" ref="inputref" :hideDoneButton="true" 
				class="__ag__modify-input__" placeholder="请输入昵称" v-model="a__ag__userInfo__.userNicename"/>
			</div>
		</div>
	</div>
</template>

<script>
	import agMinix from './components/__ag__minix__.js'
	import util from './components/util.js'
	import HbTitle from './components/__ag__headTop__.vue'
	import agMinUrl from './components/__ag__minurl__.js'
	import __ag__sportApi__ from './components/__ag__sport_api__.js'
	const picker = weex.requireModule('picker')
	const typeArr = ["打开相机", "打开相册"];
	export default {
		mixins:[agMinix,agMinUrl],
		components: {
			'ag-hbtitle': HbTitle,
		},
		data() {
			return {
				a__ag__userInfo__: {},
				selectIndex: 0
			};
		},
		computed: {
			avatar() {
				return this.a__ag__userInfo__.avatar
			}
		},
		destroyed() {
			const afreshUser = new BroadcastChannel('afreshUser')
   			afreshUser.postMessage()
		},
		methods: {
			async __ag__loadData__() {
				this.a__ag__userInfo__ = util.getItem('user')
				let that = this
				const imgurl = new BroadcastChannel('imgurl')
				imgurl.onmessage= function(event){
					that.chooseImage(event.data)
				}
				const imgsuccess = new BroadcastChannel('imgsuccess')
				imgsuccess.onmessage= function(event){
					that.chooseImage(event.data)
				}
				
			},
			async __ag__modifyFinsh__() {
				let f ={}
				if(!this.a__ag__userInfo__.userNicename){
					util.message('昵称不能为空')
					return
				}
				if (this.a__ag__userInfo__.avatar && this.a__ag__userInfo__.avatar.indexOf('data:image/') == 0) {
					util.message('图片上传中...')
					return
				}
				f.nicename=this.a__ag__userInfo__.userNicename
				f.avatar = this.a__ag__userInfo__.avatar
				if(this.a__ag__userInfo__.userType == 1){
					if(!this.a__ag__userInfo__.bio ){
						util.message('主播简介不能为空')
						return
					}
					f.bio=this.a__ag__userInfo__.bio
				}
				try {
					let resp = await __ag__sportApi__.editUsers(f)
					if (resp.success) {
						let data = this.a__ag__userInfo__
						util.setItem('user',data)
						this.__ag__clickLive__()
						// this.__ag__loadData__()
						util.message(resp.message)
						util.pop()
					}
				}catch(err) {
					util.message(err.message)
				}
				
			},
			__ag__clickLive__() {
				let ipt = this.$refs.inputref
				if (ipt) {
					ipt.blur()
				}
			},
			uploadImage() {
				let options = {
					width: 300,
					height: 300,
					includeExif: true,
					mediaType: 'photo',
					cropping: true,
					includeBase64: true,
					compressImageQuality: 0.8,
				}

				let that = this
				picker.pick({
					items: typeArr,
					index: this.selectIndex
					}, event => {
					if (event.result === 'success') {
						const Steve = new BroadcastChannel('imgcorp')
   						Steve.postMessage({options,index:event.data})
						console.log('result---',event.data)
					}
				})

				
			},
			chooseImage(data) {
				this.a__ag__userInfo__.avatar = data
				if (this.a__ag__userInfo__.avatar && this.a__ag__userInfo__.avatar.indexOf('data:image/') == -1) {
					util.message('图片上传成功')
				}
			},
		},
	}
</script>

<style scoped>
	.__ag__modify-user-mian__ {
		width: 750px;
		background-color: #fff;
	}
	.__ag__modify-user-content__ {
		position:fixed;
		top: 142px;
		bottom: 0px;
		width:750px;
		border-top-left-radius: 20px;
		border-top-right-radius: 20px;
		overflow: hidden;
		background-color: #fff;
	}
	.user-ipx {
		top: 196px;
	}
	.__ag__modify-user-text__{
		font-size:40px;
	}
	.__ag__modify-user-item__ {
		background-color: #fff;
		height: 120px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding:20px;
		border-bottom-style: solid;
		border-bottom-width: 1wx;
		border-bottom-color: #ccc;
	}
	.__ag__upinfotitleimg__ {
		width: 77px;
		height: 77px;
		margin-top: 20px;
		line-height: 77px;
		text-align: center;
		background-color: #f2f3f4;
		border-radius: 50wx;
	}
	.__ag__modify-finsh__ {
		width: 50wx;
		height: 88px;
		position: fixed;
		top: 50px;
		right: 20px;
		color: #fff;
		text-align: center;
		font-size: 18wx;
		line-height: 88px;
	}
	.finsh-ipx {
		top: 103px;
	}
	.__ag__modify-input__ {
		flex: 1;
		height: 30wx;
		padding-left: 10wx;
		font-style: normal;
		font-weight: normal;
		font-size: 17wx;
		text-align: right;
	}
</style>
