<template>
	<div class="__ag__hbtitle__">
		<ag-ipx :bg="bg" :image="image"></ag-ipx>
		<div class="__ag__hbtitle_content__" :class="[env.brand == 'bl'?'__ag__hbtitle_content_bl__':'',env.brand == '5'?'__ag__hbtitle_content_5__':'']">
			<div class="__ag__hbtitletop__" v-if="isback && title">
				<text class="__ag__hbtitletoptext__"  >{{title}}</text>
			</div>
			<image class="__ag__hbtitleimg__" @click.stop="__ag__onIndex__" :src="__ag__url__('static/__ag__logohbd__.png')" v-if="!isback" />
			<div v-if="isback" class="__ag__backdiv__" @click.stop="__ag__onBackPress__">
				<text  class="agiconfont  __ag__back__">&#xe61d;</text>
			</div>
			<div class="__ag__hbtitleright__"  v-if="!isback" >
				<div class="__ag__hbtitlerightview__" @click.stop="__ag__onIndex__">
					<text class="agiconfont home"  :class="[tab == 1?'__ag__tab__':'']">&#xe678;</text>
				</div>
				<div class="__ag__hbtitlerightview__" @click.stop="__ag__onMatch__">
					<text class="agiconfont calendar"  :class="[tab == 2?'__ag__tab__':'']">&#xe67c;</text>
				</div>
				<div class="__ag__hbtitlerightview__" @click.stop="__ag__onMy__">
					<text class="agiconfont profile"  :class="[tab == 3?'__ag__tab__':'']">&#xe677;</text>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import util from './util.js'
	import agMinix from './__ag__minix__.js'
	import agMinUrl from './__ag__minurl__.js'
	import agIpx from './__ag__ipx__.vue'
	export default {
		mixins:[agMinix,agMinUrl],
		components: {
			agIpx
		},
		props:{
			topTab:{
				type: String,
				default: '1'
			},
			isback:{
				type: Boolean,
				default: false,
			},
			title:{
				type: String,
				default: '',
			}
		},
		watch:{
			topTab(n){
				this.tab = n
			},
		},
		mounted() {
			this.tab = this.topTab
		},
		data() {
			return {
				tab: 1,
			};
		},
		methods:{
			__ag__onBackPress__(){
				util.pop()
			},
			__ag__onIndex__(){
				this.$emit('onclick','1')
			},
			__ag__onMatch__(){
				this.$emit('onclick','2')
			},
			__ag__onMy__(){
				this.$emit('onclick','3')
			},
		},
	}
</script>

<style scoped lang="less">
	@import '../style/theme.less';
	.__ag__hbtitle__{
		position: fixed;
		top:0px;
		width:750px;
	}
	.__ag__hbtitle_content__ {
		width: 750px;
		height: 88px;
		background-color:  #EBEBEB;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding-right: 20px;
		border-bottom-width:1wx ;
		border-bottom-color: #E0E0E0;
		border-bottom-style: solid;
		background-image: linear-gradient(to top, #EBEBEB,#d6d6d6);
		overflow: hidden;
	}
	.__ag__hbtitle_content_bl__ {
		background-color:  #FCC400;
		background-image: linear-gradient(to top, #FCC400,#FCC400);
	}
	.__ag__hbtitle_content_5__ {
		background-color:  #07C160;
		background-image: linear-gradient(to top, #07C160,#07C160);
	}
	.title-ipx {
		height: 158px;
		top: 0px;
		padding-top: 68px;
	}
	.ipx {
		padding-top: 34px;
	}
	.__ag__hbtitletop__ {
		height: 85px;
		flex: 1;
		align-items: center;
		justify-content: center;
		position: absolute;
		left: 100px;
		right: 100px;
	}
	.__ag__hbtitletoptext__{
		color: @modify-finsh;
		font-size: 30px;
		lines:1;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.__ag__hbtitleimg__ {
		
		margin-left: 32px;
		margin-left: 32px !important;
		width:168px;
		height: 56px;
	}
	.__ag__hbtitleright__ {
		/* display: flex; */
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}
	.__ag__hbtitlerightview__ {
		width: 100px;
		/* margin-left: 30px; */
		align-items: center;
		justify-content: center;
	}
	.calendar,
	.home {
		font-size: 50px;
		color: #FFFFFF;
	}
	.profile {
		font-size: 50px ;
		color: #FFFFFF;
	}
	.__ag__tab__ {
		color: @main-color;
	}
	.__ag__backdiv__ {
		width: 100px;
		height: 88px;
		align-items: center;
		justify-content: center;
	}
	.__ag__back__ {
		color: @modify-finsh;
		font-size: 50px ;
	}
</style>
