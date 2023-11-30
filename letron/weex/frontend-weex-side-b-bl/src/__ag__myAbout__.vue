<template>
	<div class="__ag__about-main__">
		<ag-hbtitle :isback="true" title="关于我们"></ag-hbtitle>
		<div class="__ag__about-main-content__" :class="[ipx?'about-ipx':'']">
			<div class="__ag__about-item__">
				<div class="__ag__about-logo__">
					<image resize="contain" :src="__ag__url__(aboutLogo)" class="__ag__logo__" :class="[a__ag__env__.code == 'bl'?'__ag__logo_bl__':'']"/>
				</div>
				<text class="__ag__about-version__" @click="__ag__ver__">{{ag__version__}}</text>
			</div>
			<ag-my-item title="用户隐私协议" @goJump="__ag__goJump__(0)">
			</ag-my-item>
			<ag-my-item title="用户服务协议" @goJump="__ag__goJump__(1)">
			</ag-my-item>
		</div>
	</div>
</template>

<script>
	import ag__sport__ from './components/__ag__sport__.js'
	import a__ag__env__ from './components/env.js'
	import ag__util__ from './components/util.js'
	import agMinix from './components/__ag__minix__.js'
	import agMyItem from "./components/__ag__myItem__.vue"
	import HbTitle from './components/__ag__headTop__.vue'
	import agMinUrl from './components/__ag__minurl__.js'
	const clipboard = weex.requireModule('clipboard')
	export default {
		mixins: [agMinix,agMinUrl], // 使用mixin
		components: {
			'ag-my-item':agMyItem,
			'ag-hbtitle': HbTitle,
		},
		data() {
			return {
				a__ag__env__,
				ag__version__:a__ag__env__.version,
				ag__clickTime__: 0,
				a__ag__user__: {},
				aboutLogo: a__ag__env__.aboutLogo,
			};
		},
		methods: {
			async __ag__loadData__(){
				let that = this
                this.a__ag__user__ = util.getItem('user')
			},
			__ag__goJump__(n) {
				if (n == 0) {
					ag__sport__.goPolicy(this)
					return
				}
				if (n == 1) {
					ag__sport__.goAgreement(this)
					return
				}
			},
			__ag__ver__() {
				this.ag__clickTime__++;
				let content = ''
				if(this.ag__clickTime__==3){

					// let agvalue = weex.requireModule('agvalue').getItem('jtoken')

					let agvalue = ag__util__.getItem('jtoken')
					let guestToken = ag__util__.getItem('guestToken')
					
					if (agvalue) {
						content = a__ag__env__.channel['ios'] + '/'+ a__ag__env__.verIndex + '/' + agvalue+ '/'+ this.a__ag__user__.lastLoginIp + '/' + guestToken
						clipboard.setString(content)
					} else {
						content = a__ag__env__.channel['ios']+ '/'+a__ag__env__.verIndex + '//'+ this.a__ag__user__.lastLoginIp + '/' + guestToken
						clipboard.setString(content)
					}
					ag__util__.message('已复制')
				}
				setTimeout(()=>{
					this.ag__clickTime__=0
				}, 1000)
			}
		}
	}
</script>

<style lang="less">
.__ag__about-main__ {
	width: 750px;
	position: fixed;
	top: 0;
	bottom: 0;
	background-color: #fff;
}
.__ag__about-main-content__ {
	padding-top: 100px;
}
.about-ipx {
	padding-top: 148px;
}
.__ag__about-item__ {
	margin-top: 25wx;
	display: flex;
	flex-direction: column;
	align-items: center;
	height: 240px;
	border-bottom-style: solid;
	border-bottom-width: 1px;
	border-bottom-color: rgb(206, 206, 206,0.5);
}
.__ag__about-logo__ {
	flex: 1 1 80px;
	overflow: hidden;
	margin: 10px 0;
}
.__ag__logo__ {
	width: 120px;
	height: 120px;
	border-radius: 8px;
}
.__ag__logo_bl__ {
	width: 150px;
	height: 150px;
}
.__ag__about-title__ {
	flex: 1 1 30px;
	width: 200px;
	text-align: center;
	font-style: normal;
	font-weight: 500;
	font-size: 30px;
	line-height: 40px;
	letter-spacing: 0.05em;
}
.__ag__about-version__ {
	flex: 1 1 30px;
	line-height: 50px;
	width: 200px;
	text-align: center;
	font-size: 24px;
	color: rgba(0, 0, 0, 0.5);
	letter-spacing: 0.05em;
}
</style>
