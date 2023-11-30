<template>
	<scroller class="__ag__messageList__" show-scrollbar="false" @scroll="__ag__scroll__" @loadmore="__ag__scrollend__" v-if="resp.data.list && resp.data.list.length>0 || sysnotices"> 
		<div class="__ag__sysnotice__" v-if="sysnotices">
			<text class="__ag__sysnoticetext__">{{sysnotices}}</text>
		</div>
		<div class="__ag__messagecontent__" v-for="item in resp.data.list" :key="item.id" @click="$emit('onClick')" :ref="'indicator-' + item.id">
			<div class="__ag__messagelivechat__" v-if="item.type==4">
				<text class="__ag__anthors_text__" v-if="item.senderId == uid">主播</text>
				<text class="__ag__messagelivename__">{{item.joinMap.u.userNicename}}：</text>
				<text class="__ag__messagelivechatcontent__">{{item.content}}</text>
			</div>
			<!-- <div :ref="'indicator-' + index" class="indicator"></div> -->
		</div>
		<div class="__ag__showscrollinfoLive__" v-if="a__ag__showscroll__ && !a__isScroll__" @click="__ag__goscroll__(resp.data.list.length)"><text class="__ag__showscrollinfotext__" style="color:#fff">向下滚动查看更多消息</text></div>
	</scroller >
</template>

<script>
	let modal = weex.requireModule('modal');
	import util from '../components/util.js'
	import agMinix from '../components/__ag__minix__.js'
  	let dom = undefined
	export default {
		mixins:[agMinix],
		name:"ag-messageList",
		
		props:{
			resp:{
				type:Object,
				default:function(){
					return {data:{list:[]}}
				},
			},
			sysnotices:{
				type:String,
				default:'',
			},
			uid: {
				type:String,
				default:'',
			}
		},
		data() {
			return {
				a__ag__showscroll__: false,
				a__isScroll__ : true,
			};
		},
		computed: {
			messageList() {
				if (!this.resp || !this.resp.data || !this.resp.data.list || !this.resp.data.list.length) {
					return []
				}
				return this.resp.data.list
			}
		},
		methods:{
			__ag__scroll__(Event) {
				let y = parseInt(Math.abs(Event.contentOffset.y))
				let h = parseInt(Math.abs(Event.contentSize.height))
				let s = h-y
				let p = 1000
				this.a__ag__showscroll__ = s > p
			},
			__ag__scrollend__() {
				this.a__isScroll__ = false
			},
			__ag__goscroll__(length) {
				if (!dom) {
					dom = weex.requireModule('dom');
				}
				let id = this.messageList[length - 1].id
				const indicatorId = 'indicator-' + id;
				const indicator = this.$refs[indicatorId][0];
				// 滚动到上一条消息的底部
				this.a__isScroll__ = false
				if (indicator) {
					const el = indicator;
					dom.scrollToElement(el, {});
				}
					
				
			}
		}
	}
</script>

<style lang="less" scoped>
@import '../style/default.less';
	.__ag__messageList__ {
		width: 750px;
		position: absolute;
		top: 0;
		bottom: 90px;
		flex: 1;
		padding: 16px;
		padding-top: 20px;
		background-color: #FFFFFF;
	}
	.__ag__sysnotice__ {
		background-color: #f2f3f4;
		border-radius: 5px;
		font-size: 26px;
		line-height: 1.5;
		margin-top: 10px;
		padding: 10px;
		margin-bottom: 20px;
	}
	.__ag__sysnoticetext__ {
		color: #999;
    	font-size: 13wx;
	}
	.__ag__messagelivechat__ {
		line-height: 2em;
		font-size: 26px;
		margin-bottom: 15px;
		display: flex;
		flex-direction: row;
	}
	.__ag__anthors_text__ {
		width: 36wx;
		height: 18wx;
		background-color: #F5982A;
		border-radius: 100px;
		font-style: normal;
		font-weight: 500;
		font-size: 9wx;
		color: #FFFFFF;
		margin-right: 5wx;
		text-align: center;
		line-height: 18wx;
		letter-spacing: 1px;
	}
	.__ag__messagelivename__ {
		font-size: 13wx;
		color: #F5982A;
		white-space: pre-wrap;
	}
	.__ag__messagelivechatcontent__ {
		font-size: 13wx;
		color: #474B55;
		flex: 1;
	}
	.__ag__showscrollinfoLive__ {
		position: fixed;
		bottom: 130px;
		width: 350px;
		left: 200px;
		right: 0;
		background-color: rgba(112, 110, 110, 0.5);
		border-radius: 10px;
		padding: 5px;
		padding-left: 10px;
		padding-right: 10px;
	}
	.message-ipx {
		bottom: 200px;
	}
	.__ag__showscrollinfotext__ {
		height: 50px;
		display: flex;
		text-align: center;
		line-height: 50px;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}
</style>
