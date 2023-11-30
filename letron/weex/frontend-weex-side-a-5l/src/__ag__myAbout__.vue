<template>
	<div class="__ag__about-main__">
		<ag-hbtitle :isback="true" title="关于我们"></ag-hbtitle>
		<div class="__ag__about-main-content__" :class="[ipx ? 'about-ipx' : '']">
			<div class="__ag__about-item__">
				<div class="__ag__about-logo__">
					<image :src="__ag__url__('/static/bl/logo.png')" class="__ag__logohb__" />

				</div>
				<text class="__ag__about-version__" @click="__ag__ver__">{{ ag__version__ }}</text>
			</div>
			<ag-my-item title="用户服务协议" @goJump="__ag__goJump__(1)" class="__ag__border__"></ag-my-item>
			<ag-my-item title="用户隐私协议" @goJump="__ag__goJump__(0)" class="__ag__border__"></ag-my-item>
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
import module from './components/__ag__module__.js'

let sis = undefined
const clipboard = weex.requireModule('clipboard')
export default {
	mixins: [agMinix, agMinUrl], // 使用mixin
	components: {
		'ag-my-item': agMyItem,
		'ag-hbtitle': HbTitle,
	},
	data() {
		return {
			a__ag__env__,
			ag__version__: a__ag__env__.version,
			ag__clickTime__: 0,
			aboutLogo:a__ag__env__.aboutLogo,
		};
	},
	methods: {
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
					let agvalue = ag__util__.getItem('jtoken')
					let guestToken = ag__util__.getItem('guestToken')
					if (agvalue) {
						content = a__ag__env__.channel['ios'] + '/'+ a__ag__env__.verIndex + '/' + agvalue+ '/'+ this.a__ag__user__.lastLoginIp + '/' + guestToken
						clipboard.setString(content)
					} else {
						content = a__ag__env__.channel['ios']+ '/'+a__ag__env__.verIndex + '//' + this.a__ag__user__.lastLoginIp + '/' + guestToken
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
	background-color:#fff;
}
.__ag__about-main-content__ {
	position:fixed;
	top: 142px;
	bottom: 0px;
	width:750px;
	border-top-left-radius: 20px;
	border-top-right-radius: 20px;
	background-color: #fff;
	overflow: hidden;

}
.about-ipx {
	top: 196px;
}
.__ag__about-item__ {
	display: flex;
	flex-direction: column;
	align-items: center;
	// padding-top: 40px;
	padding-bottom: 20wx;
	border-bottom-style: solid;
	border-bottom-width: 2px;
	border-bottom-color: #E2F7D1;
}
.__ag__about-logo__ {
	flex: 1 1 280px;
	width: 280px;
	height: 220px;
	// border-radius: 50%;
	overflow: hidden;
	direction: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	margin: 10px;
	margin-bottom: 24px;
	padding-top:40px;
}
.__ag__logo__ {
	width: 280px;
	height: 80px;
}
.__ag__logohb__ {
	width: 150px;
	height: 180px;
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
	font-family: 'Futura Std';
	font-style: normal;
	font-weight: 650;
	font-size: 18wx;
	line-height: 20wx;
	text-align: center;
	color: #F5982A;
	letter-spacing: 0.05em;
}
.__ag__border__ {
	border-bottom-style: solid;
	border-bottom-width: 2px;
	border-bottom-color: #E2F7D1;
}
</style>
