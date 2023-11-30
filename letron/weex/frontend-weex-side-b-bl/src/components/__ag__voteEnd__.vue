<template>
	<div class="__ag__vote__">
		<text  class="agiconfont __ag__voteclose__" @click="onclose">&#xe615;</text>
		<div class="__ag__votecontent__">
			<div class="__ag__votetitle__">
				<text class="__ag__votetitletext__">{{vote.title}}</text>
			</div>
			<div class="__ag__votebottomcontent__">
				<text class="agiconfont __ag__votecount__">&#xe605;</text>
				<text class="__ag__voteprogresstext__">{{vote.countAB}}</text>
				<text class="__ag__voteprogresstext__">已参与</text>
			</div>
			<div class="__ag__votebody__">
				<div class="__ag__voteprogress__">
					<div class="__ag__voteprogress_item__" :style="{'flex':vote.classA}">
						<div class="__ag__voteprogressleft__">
							<text class="__ag__voteprogress_text__">{{vote.progressA}}%</text>
						</div>
						<div class="__ag__vote_lf_line__" :class="[this.vote.classA == '.3'?'__ag__vote_linea_3__':'']"></div>
					</div>
					<div class="__ag__voteprogress_item__" :style="{'flex':vote.classB}">
						<div class="__ag__voteprogressright__">
							<text class="__ag__voteprogress_text__">{{vote.progressB}}%</text>
						</div>
						<div class="__ag__vote_rg_line__" :class="[this.vote.classB == '.3'?'__ag__vote_lineb_3__':'']"></div>
					</div>
				</div>
				<div class="__ag__voteoption__">
					<text class="__ag__voteoptionleft__">{{vote.optionA}}</text>
					<text class="__ag__voteoptionright__">{{vote.optionB}}</text>
				</div>
			</div>
			<div class="__ag__votebottom__">
				<div class="__ag__bottomleft__">
				</div>
				
				<div class="__ag__bottom_center__">
					<text class="__ag__votetitleend__ ">{{timeout}}</text>
				</div>

				<div class="__ag__bottomright__">
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props:{
		vote:{
			type:Object,
			default:function(){
				return {}
			},
		}
	},
	data() {
		return {
			timeout: '已结束',
			timeTimer: false
		}
	},
	methods: {
		onclose(){
			this.$emit('voteClose')
		},
	}
 }
</script>

<style scoped lang="less">
    @import "../style/theme.less";
	.__ag__vote__ {
		position: absolute;
        width: 750px;
		top: 108px;
        left: 0px;
	}
	.__ag__voteclose__ {
        position: absolute;
        top: -50px;
        right: 45px;
        font-size: 20wx;
        color: #fff;
		background-color: rgba(119, 55, 199, 1);
		border-radius: 50wx;
		padding: 3px;
    }
	.__ag__votecontent__ {
		width: 660px;
		margin-left: 45px;
		margin-right: 45px;
		border-radius: 40px;
		background-image: linear-gradient(to right, #341b77, #7f3ad1);
    	box-shadow: 2px 2px 4px rgb(0 0 0 / 30%);
		padding-bottom: 40px;
	}
	.__ag__votetitle__ {
		width: 660px;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		padding: 20px;
		padding-top: 20px;
		padding-bottom: 20px;
	}
	.__ag__votetitletext__ {
		line-height: 35px;
		text-align: center;
		flex: 1;
		font-size: 13wx;
		font-weight: 600;
		color: #fff;
		lines:2;
		text-overflow: ellipsis;
	
	}
	.__ag__votetitletime__ {
		color: #ffd600;
		font-size: 15wx;
		text-align: center;
	}
	.__ag__votetitleend__ {
		color: #DD524D;
		font-size: 15wx;
		text-align: center;
	}
	.__ag__votebody__ {
		display: flex;
		flex-direction: column;
		width: 660px;
		padding-top: 20px;
	}
	.__ag__voteoption__ {
		flex: 1;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-around;
		margin-top: 35px;
	}
	.__ag__voteoptionleft__ {
		flex: 1;
		color: #ff5930;
		text-align: center;
		lines:2;
		line-height: 35px;
		padding-left: 30px;
		padding-right: 10px;
		text-overflow: ellipsis;
		font-size: 13wx;
		font-weight: 600;
		text-align: left;
	}
	.__ag__voteoptionright__ {
		flex: 1;
		color: #0ac63f;
		lines:2;
		line-height: 35px;
		padding-left: 10px;
		padding-right: 30px;
		text-overflow: ellipsis;
		text-align: center;
		font-size: 13wx;
		font-weight: 600;
		text-align: right;
	}
	.__ag__voteprogress__{ 
		height: 30wx;
		flex: 1;
		display: flex;
		flex-direction: row;
		padding: 20px;
		padding-top: 0px;
		padding-bottom: 0px;
		margin-bottom: 10wx;
		justify-content: space-between;
	}
	.__ag__voteprogress_item__ {
		flex: .5;
		height: 45wx;
		display: flex;
		flex-direction: row;
		align-items: center;
		position: relative;
		overflow: hidden;
	}
	.__ag__voteprogressleft__ {
		flex: 1;
		height: 45wx;
		border-top-left-radius: 50px;
		border-bottom-left-radius: 50px;
		background-image: linear-gradient(to right, #ff164a, #fda440);
		flex-direction: row;
		justify-content: flex-end;
		align-items: center;
		margin-right: 25px;
		padding-right: 30px;
	}
	.__ag__vote_lf_line__ {
		width: 30px;
		height: 55wx;
		background-color: #fca138;
		transform: rotate(16deg);
		position: absolute;
		right: 13px;
	}
	.__ag__vote_linea_3__ {
		background-color: #f99665;
	}
	.__ag__votecount__ {
		color: #fff;
		font-size: 16wx;
	}
	.__ag__voteprogresstext__ {
		margin-right: 5wx;
		margin-left: 5wx;
		color: #fff;
		font-size: 13wx;
	}
	.__ag__voteprogress_text__ {
		font-size: 14wx;
		font-weight: 600;
		color: #fff;
	}
	.__ag__voteprogressright__ {
		flex: 1;
		height: 45wx;
		background-image: linear-gradient(to right, #00d867, #18ab00);
		display: flex;
		flex-direction: row;
		border-top-right-radius: 50px;
		border-bottom-right-radius: 50px;
		justify-content: flex-start;
		align-items: center;
		margin-left: 25px;
		padding-left: 30px;
	}
	.__ag__vote_rg_line__ {
		width: 30px;
		height: 55wx;
		background-color: #00d867;
		transform: rotate(16deg);
		position: absolute;
		left: 13px;
	}
	.__ag__vote_lineb_3__ {
		background-color: #00d867;
	}
	.__ag__votebottom__ {
		display: flex;
		flex-direction: row;
		flex: 1;
		margin-top: 20wx;
		padding: 30px;
		padding-top: 0px;
		padding-bottom: 0px;
		align-items: center;
		justify-content: space-between;
	}
	.__ag__bottomleft__{ 
		flex: 1;
	}
	.__ag__votebottom_lf_text__ {
		color: #fff;
		font-size: 12wx;
		width:140px;
		height: 60px;
		border-radius: 60px;
		background-image: linear-gradient(to right, #ff1621, #fe993e);
		line-height: 60px;
		text-align: center;
	}
	.__ag__bottomright__ { 
		flex: 1;
		flex-direction: row;
		justify-content: flex-end;
	}
	.__ag__votebottom_rg_text__ {
		color: #fff;
		font-size: 12wx;
		width:140px;
		height: 60px;
		border-radius: 60px;
		line-height: 60px;
		text-align: center;
		background-image: linear-gradient(to right, #02d561, #19ab01);
	}
	.__ag__votebottomcontent__ {
		flex: 1;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}
	.pointer {
		background-image: linear-gradient(to right, #a5a5a6, #dcdcdc);
	}
	.pointertext {
		color: #000;
	}
	.__ag__bottom_center__ {
		flex: 1;
		flex-direction: row;
		justify-content: center;
	}
</style>
