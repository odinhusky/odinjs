<template>
	<div class="__ag__indexheader__">
		<div class="__ag__indexheader__in__">
			<div :key="item.id" v-for="item in list" @click="$emit('changeClass',item)"
				:class="[item.id == scheduleClassId?'__ag__selected__':'']" class="__ag__indexheader__item__">
				<div class="__ag__indexheader__cont__">
					<text class="__ag__headertext__" :class="[item.id == scheduleClassId?'__ag__selected__':'']">{{
					    item.name
					}}</text>
					<text class="__ag__classbottom__" :class="[item.id == scheduleClassId?'__ag__selectedbottom__':'']"></text>
				</div>
				
			</div>
		</div>
		<ag-mix/>
	</div>
</template>

<script>
	import agMinix from './__ag__minix__.js'
	export default {
		props: {
			list: {
				type: Array,
				default: function() {
					return []
				}
			},
			scheduleClassId: {
				type:Number,
				default: 1
			}
		},
		mixins: [agMinix], // 使用mixin
		data() {
			return {
			};
		},
	}
		
</script>

<style scoped lang="less">
	 @import '../style/theme.less';
	.__ag__indexheader__ {
		width: 750px;
		height: 45wx;
	}
	.__ag__indexheader__in__ {
		width: 750px;
		height: 45wx;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: row;
		background-color: #E6E6E6;
		padding-bottom: 1wx;
		background-image: linear-gradient(to top, #EBEBEB,#d6d6d6);
	}
	.__ag__indexheader__item__{
		flex:1;
		font-size: 14px;
		box-sizing: border-box;
		display: flex;
		flex-direction: row;
		justify-content: center;
	}
	.__ag__indexheader__cont__ {
		width: 35wx;
		display: flex;
		justify-content: center;
	}
	.__ag__headertext__ {
		height: 43wx;
		line-height: 43wx;
		font-style: normal;
		text-align: center;
		font-weight: 500;
		font-size: 14wx;
		letter-spacing: 0.05em;
		color: #000;
	}
	.__ag__classbottom__{
		width: 35wx;
		border-style: solid;
		border-width:2px;
		border-color: #E8E8E8;
	}
	.__ag__selectedbottom__ {
		border-color: @main-color;
	}
	.__ag__selected__{
		font-size: 16wx;
		text-align: center;
		letter-spacing: 0.05em;
		color: @main-color;
	}
</style>
