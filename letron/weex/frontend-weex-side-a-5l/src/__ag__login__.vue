<template>
	<div class="__ag__login-main__">
		<ag-hbtitle :isback="false" :isBl="true"></ag-hbtitle>
		<div class="__ag__login-main-content__"  :class="[ipx ? 'login-ipx' : '']"  @click="__ag__clickLive__">
			<text class="__ag__login_text__">登录</text>
			<div class="__ag__login-phone__">
				<div class="__ag__login-phone-item__">
					<div class="__ag__login__head__">
						<input type="text" class="__ag__country__" v-model="form.country"  @focus="__ag__onCountry__"/>
						<text  class="iconfont  __ag__country_icon__" >&#xec6b;</text>
					</div>
					<input
						type="number"
						ref="account"
						class="__ag__login-phone-input__"
						:hideDoneButton="true"
						v-model="form.account"
						placeholder="请输入手机号码"
					/>
				</div>
			</div>
			<div class="__ag__login-pw__">
				<div class="__ag__login-phone-item__" v-if="pc == 'phone'">
					<div class="__ag__login__head__">
						<text class="__ag__country__">密码</text>
						<!-- <text class="iconfont icon-seasondown-copy __ag__navmore__"></text> -->
					</div>
					<input
						type="password"
						ref="phone"
						class="__ag__login-phone-input__"
						:hideDoneButton="true"
						v-model="form.password"
						placeholder="请输入密码"
					/>
				</div>
				<div class="__ag__login-box__" v-if="pc == 'code'">
					<text class="__ag__code_text__">短信验证码</text>
					<div class="__ag__login-item__">
						<input type="number" ref="code" class="__ag__login-item-input__" placeholder="请输入验证码" v-model="form.code" :hideDoneButton="true" />
					</div>
					<div
						class="__ag__message-btn__"
						:class="[!form.account ? 'disabled' : '']"
						@click="__ag__sendCode__"
						v-show="ag__sec__ == 0"
					>
						<text class="__ag__message-btn-text__" v-if="ag__sec__ == 0" >{{ ag__loading__ ? '发送中...' : '获取验证码' }}</text>
						<text class="__ag__message-btn-text__" v-if="ag__sec__ > 0">{{ ag__sec__ }}</text>
					</div>
				</div>
			</div>
			<div class="__ag__loginpc__">
				<text
					v-if="pc == 'code'"
					@click="__ag__changeLogin('phone')"
					class="__ag__loginphone__"
					:class="[pc == 'phone' ? 'select' : '']"
				>使用密码登录</text>
				<text
					v-else
					@click="__ag__changeLogin('code')"
					class="__ag__loginphonec__"
					:class="[pc == 'code' ? 'select' : '']"
				>使用验证码登录</text>
			</div>
			<div class="__ag__login-service__" @click="service = !service">
				<text class="iconfont __ag__login-gou__" :class="[service ? 'gouselected' : '']">&#xe682;</text>
				<text class="inline">请阅读并同意</text>
				<text class="inline" @click.stop="__ag__goJump__(0)">《用户隐私协议》</text>
				<text class="inline">和</text>
				<text class="inline" @click.stop="__ag__goJump__(1)">《用户服务协议》</text>
			</div>
			<div class="__ag__login-btn__" @click="__ag__sendLogin__">
				<text class="__ag__login-btn-text__" >登录</text>
			</div>
			<div class="__ag__login-regist__" v-if="pc == 'code'">
				<text class="__ag__login-regist_text__">如果未注册,登录后将自动为您创建账号。</text>
			</div>
		</div>
	</div>
</template>

<script>

import hbtitle from './components/__ag__headTop__.vue'
import agMinix from './components/__ag__minix__.js'
import util from './components/util.js'
import vars from './components/vars.js'
import env from './components/env.js'
import __ag__sportApi__ from './components/__ag__sport_api__.js'
import agMinUrl from './components/__ag__minurl__.js'
import ag__sport__ from './components/__ag__sport__.js'
import moduleFun from './components/__ag__moduleFun__.js'
let cd = 0
const picker = weex.requireModule('picker')

export default {
	mixins: [agMinix,agMinUrl],
	data() {
		return {
			vars,
			env,
			ag__sec__: 0,
			form: {
				account: '',
				password: '',
				code: '',
				country: '+86',
				deviceType : 2
			},
			pc: 'code',
			ag__loading__: false,
			service: false,
			showCountry: false,
			countryMap:{},
			selectIndex: undefined
		};
	},
	components: {
		'ag-hbtitle': hbtitle,
	},
	computed: {
		list2() {
			return vars.country
		}
	},
	methods: {
		__ag__clickLive__(){
			let ipt = this.$refs.account
			console.log('b---',ipt)
			if (ipt) {
				ipt.blur()
			}
			if(this.pc == 'phone'){
				let phone = this.$refs.phone
				if (phone) {
					phone.blur()
				}
			}
			if(this.pc == 'code'){
				let code = this.$refs.code
				if (code) {
					code.blur()
				}
			}
		},
		__ag__loadData__(){
			moduleFun.__ag__oiOpenInstall_()
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
		__ag__changeLogin(type) {
			this.pc = type
		},
		async __ag__sendCode__() {
			if (!this.form.account) {
				util.error("请输入手机号码")
				return
			}
			if (this.ag__sec__ > 0) {
				util.error("请稍等...")
				return
			}
			if (this.ag__loading__) {
				util.error("发送中...")
				return
			}
			this.ag__loading__ = true
			try {
				let resp = await __ag__sportApi__.editSendCode({ mobile: this.form.account, country: this.form.country })
				console.log("aaa", resp)
				if (resp.success) {
					this.ag__loading__ = false
					this.startCountDown(599)
				} else {
					this.ag__loading__ = false
				}
				util.message(resp.message)
			} catch (e) {
				console.log("aaa", e)
				this.ag__loading__ = false
				util.message(e.message)
				//TODO handle the exception
			}


		},
		startCountDown(sec) {
			if (cd) {
				clearInterval(cd)
			}
			this.ag__sec__ = sec
			cd = setInterval(() => {
				if (this.ag__sec__ <= 0) {
					clearInterval(cd)
					return
				}
				this.ag__sec__ = this.ag__sec__ - 1
			}, 1000)

		},
		async __ag__sendLogin__() {
			if (!this.service) {
				util.message("请同意用户隐私协议和用户服务协议")
				return
			}
			if (this.form.account == "") {
				util.message("请输入账号")
				return
			}
			if (this.pc == 'code' && this.form.code == '') {
				util.message("请输入验证码")
				return
			}
			if (this.pc == 'phone' && this.form.password == '') {
				util.message("请输入密码")
				return
			}
			if (this.pc == 'phone') {
				await this.__ag__login__(this.form)
			} else if (this.pc == 'code') {
				// util.message("code")
				await this.__ag__loginByCode__(this.form)
			}
		},
		__ag__onCountry__() {
			let country1 = []
			for(let i in vars.country) {
				let r = vars.country[i]
				let name = r.name + `（+${r.id}）`
				country1.push(name)
				this.countryMap[i] = r.id
				if (r.name == '中国大陆' && !this.selectIndex) {
					this.selectIndex = i
					continue
				}
			}
			let that = this
			picker.pick({
				items: country1,
				index: this.selectIndex
				}, event => {
				if (event.result === 'success') {
					// let country = vars.country2[event.data]
					let country = that.countryMap[event.data]
					that.selectIndex = event.data
					that.form.country = '+' +country
				}
			})
		}
	},
}
</script>

<style lang="less">
@import './style/default.less';
.iconfont {
	font-family: iconfont;
	font-size: 16px;
	font-style: normal;
	-webkit-font-smoothing: antialiased;
	-webkit-text-stroke-width: 0.2px;
	-moz-osx-font-smoothing: grayscale;
}
.__ag__login-main__ {
	width: 750px;
	background-color: #ffffff;
}
.__ag__login-main-content__ {
	width: 750px;
	position: fixed;
	top: 142px;
	bottom: 0px;
	background-image: linear-gradient(to bottom, #FDC501, #fd9b3a);
	align-items: center;
}
.login-ipx {
	top: 196px;
}
.__ag__login_text__ {
	font-family: 'Source Han Sans SC';
	font-style: normal;
	font-weight: 500;
	font-size: 30wx;
	line-height: 43wx;
	position: absolute;
	top: 110px;
	width: 750px;
	left:40px;
	color:#fff;
}
.__ag__login-pw__ ,
.__ag__login-phone__ {
	height: 100px;
	align-items: center;
	width: 670px;
	/* padding-top:20px; */
	margin-top: 250px;
	justify-content: center;
	background-color: #fff;
	border-radius: 60px;
	// padding-left:21wx;
}
.__ag__login-pw__ {
	margin-top: 30px;
	position: relative;
}
.__ag__loginphoneText__ {
	font-size: 40px;
}
.__ag__login-phone-item__ {
	flex-direction: row;
	align-items: center;
}
.__ag__login__head__ {
	width: 200px;
	flex-direction: row;
	align-items: center;
}
.__ag__country__ {
	flex: 1;
	border-radius: 3px;
	height: 100px;
	line-height: 100px;
	font-style: normal;
	font-weight: normal;
	font-size: 17wx;
	color: #252932;
	padding-left:21wx;
	text-align: center;
}
.__ag__country_icon__ {
	font-size: 20wx;
	color: #000000;
	margin-left: 13wx;
}
.__ag__login-phone-input__ {
	width: 470px;
	padding-left: 21wx;
	font-family: 'Source Han Sans SC';
	font-style: normal;
	font-weight: 400;
	font-size: 16wx;
	height: 100px;
	line-height: 100px;
	color: #252932;
}
.__ag__navmore__ {
	color: #252932;
}
.__ag__login-box__ {
	width: 670px;
	flex-direction: row;
	align-items: center;
}
.__ag__login-item__ {
	flex: 1;
	margin-right: 11px;
	font-size: 34px;
}
.__ag__code_text__ {
	width: 200px;
	height: 100px;
	line-height: 100px;
	font-size: 17wx;
	text-align: right;
}
.__ag__login-item-input__ {
	flex: 1;
	height: 100px;
	font-family: 'Source Han Sans SC';
	font-style: normal;
	font-weight: 400;
	line-height: 100px;
	font-size: 16wx;
	color: #252932;
	padding-left: 21wx;
}
.__ag__message-btn__ {
	width: 200px;
	height: 52px;
	flex-direction: row;
	align-items: center;
	justify-content: center;
}
.__ag__message-btn-text__ {
	width: 130px;
	height: 52px;
	border-width: 1px;
	border-style: solid;
	border-color: #F5982A;
	border-radius:40px;
	text-align: center;
	line-height: 52px;
	font-style: normal;
	font-weight: 400;
	font-size: 10wx;
	color: #F5982A;
}

.__ag__login-btn-text__ {
	font-family: 'Source Han Sans SC';
	font-style: normal;
	font-weight: 500;
	font-size: 20wx;
	line-height: 84px;
	color: #F5982A;
	text-align: center;
	
}
.__ag__loginpc__ {
	margin-bottom: 30px;
	margin-top:60px;
	width: 670px;
	flex-direction: row;
	justify-content: flex-end;
}
.__ag__loginphonec__,
.__ag__loginphone__ {
	font-size: 17wx;
	margin-right: 56px;
	color: #EBEBEB;
}

.select {
	flex: 1;
	text-align: center;
	color: @zhuse;
}
.__ag__login-regist__ {
	text-align: center;
	font-family: 'Source Han Sans SC';
	font-style: normal;
	font-weight: 400;
	font-size: 12wx;
	line-height: 17wx;
	width: 750px;
	margin-top:52px;
}
.__ag__login-regist_text__ {
	color: #fff;
	font-family: 'Source Han Sans SC';
	font-style: normal;
	font-weight: 400;
	font-size: 12wx;
	line-height: 17wx;
	text-align: center;
}
.__ag__login-service__ {
	width: 750px;
	height: 50px;
	flex-direction: row;
	flex-wrap: wrap;
	align-items: center;
	margin-top: 40px;
	margin-bottom: 40px;
	padding-left: 20wx;
}
.__ag__login-btn__ {
	width: 670px;
	height: 84px;
	margin-top: 26px;
	background-color: #fff;
	border-radius: 23wx;
}
.__ag__login-gou__ {
	font-size: 40px;
	margin-right: 8px;
	color: #ccc;
}
.gouselected {
	font-size: 40px;
	margin-right: 8px;
	color: #fff;
}
.__ag__policy__ {
	/* width: 670px;
	flex-direction: row;
	flex-wrap: wrap; */
	/* display: unset; */
	/* background-color: red; */
	/* align-items: center; */
}
.__ag__policytext__ {
	width: 670px;
	font-size: 28px;
	display: unset;
	overflow: auto !important;
	color: #000000;
}
.__ag__policyspan__ {
	font-size: 30px;
}
.inline {
	font-family: 'Roboto';
font-style: normal;
font-weight: 400;
	display: inline;
	color: #ffffff;
	font-size: 24px;
}

</style>
