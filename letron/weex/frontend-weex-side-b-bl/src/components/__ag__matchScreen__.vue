<template>
	<div class="__ag__match-screen__" :class="[!ishot && env.brand == 'bl'?'__ag__match_date__':'',!ishot && env.brand == '5'?'__ag__match_date_5__':'']">
		<div class="__ag__screen-date__">
			<text class="__ag__screen-date-text__" v-if="day">{{ day }}</text>
			<text class="__ag__screen-date-text__">{{ date }}</text>
			<text class="__ag__screen-date-text__">{{ week }}</text>
		</div>
		<div class="__ag__screen-content__" v-if="!ishot">
			<div class="__ag__screen-body__" :class="[env.brand == 'bl'?'__ag__screen-body_bl__':'',screen == 0?'__ag__select__': '']" @click="onscreen(0)">
				<text class="__ag__screen-body-text__" :class="[screen == 0?'__ag__select-status__': '']">赛事</text>
			</div>
			<div class="__ag__screen-body__" :class="[env.brand == 'bl'?'__ag__screen-body_bl__':'',screen == 1?'__ag__select__': '']" @click="onscreen(1)">
				<text class="__ag__screen-body-text__" :class="[screen == 1?'__ag__select-status__': '']">赛果</text>
			</div>
		</div>
	</div>
</template>

<script>
	import util from './util.js'
	import env from './env.js'
	export default {
		name:"ag-matchScreen",
		props: {
			screen: {
				type: Number,
				default:0
			},
			datetime: {
				type: String,
				default: ''
			},
			ishot:{
				type:Boolean,
				default:false,
			}
		},
		data() {
			return {
				util,
				env
			};
		},
		computed: {
			day(){
				try{
					let date = util.formatDate(this.datetime)
					let newDate = util.formatDateTime(new Date())
					if(util.formatDate(newDate)==date){
						return '今天'
					}
				}catch(e){
					console.error('scheduleList',e)
				}
				return ''
				
			},
			date(){
				return util.formatDate(this.datetime, 'MM月dd日')
			},
			week(){
				return util.formatWeeks(this.datetime)
			}
		},
		methods: {
			onscreen(ty) {
				this.$emit('onscreen',ty)
			}
		}
	}
</script>

<style scoped lang="less">
	@import '../style/theme.less';
	.__ag__match-screen__ {
		width: 750px;
		padding-left: 16wx;
		padding-right: 16wx;
		height: 40wx;
		/* background-color: #F2F3F4; */
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}
	.__ag__match_date__ {
		background-color: #FFF9E3;
	}
	.__ag__match_date_5__ {
		background-color: #E6F9F0;
	}
	.__ag__screen-content__ {
		display: flex;
		flex-direction: row;
	}
	.__ag__screen-date__ {
		display: flex;
		flex-direction: row;
	}
	.__ag__screen-body__ {
	    width: 41wx;
	    height: 25wx;
		border-style: solid;
		border-width: 1px;
		border-color: @main-color;
	    box-sizing: border-box;
	    border-radius: 4px;
		text-align: center;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		margin-left: 5wx;
		margin-right: 5wx;
	}
	.__ag__screen-body_bl__ {
		width: 45wx;
		border-radius: 40px;
	}
	.__ag__select__ {
	    background-color: @main-color;
	}
	.__ag__screen-body-text__ {
	    font-size: 15wx;
		color: @main-color;
	}
	.__ag__select-status__ {
		color: #FFFFFF;
	}
	.__ag__screen-date-text__ {
		font-size: 15wx;
		color: #000000;
		margin-right: 8px;
		font-weight: 600;
	}
	
</style>
