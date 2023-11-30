<template>
	<div class="__ag__voteend__">
		<div class="__ag__voteendtop__">
			<text class="__ag__voteendtoptext__">{{vote.title}}</text>
			<div class="__ag__voteendtopright__">
				<text class="__ag__voteprogresstext__">{{vote.countAB}}</text>
				<text class="agiconfont __ag__votecount__">&#xe605;</text>
			</div>
		</div>
		<div class="__ag__votechatoption__">
			<text class="__ag__votechatoptiontext__ optiona">{{vote.optionA}}</text>
			<text class="__ag__votechatoptiontext__ optionb">{{vote.optionB}}</text>
		</div>
		<div class="__ag__voteendprogress__">
			<div class="__ag__voteprogressleft__" :style="{'flex':vote.classA}">
				<text class="__ag__voteprogresstext__">{{vote.countA}}</text>
				<text class="agiconfont __ag__votecount__">&#xe605;</text>
			</div>
			<div class="__ag__voteprogressright__" :style="{'flex':vote.classB}">
				<text class="__ag__voteprogresstext__">{{vote.countB}}</text>
				<text class="agiconfont __ag__votecount__">&#xe605;</text>
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
 }
</script>

<style scoped lang="less">
    @import "../style/theme.less";
	.__ag__voteend__ {
		width: 640px;
		height: 240px;
		background-color: #EEF7FF;
		border-radius: 10px;
		border-width: 1wx;
		border-style: solid;
		border-color: #dbdbdb;
		margin-right: 35px;
		margin-left: 35px;
	}
	.__ag__voteendtop__ {
		width: 640px;
		height: 70px;
		border-bottom-width: 1wx;
		border-bottom-style: solid;
		border-bottom-color: #dbdbdb;
		padding: 10px;
		padding-top: 0px;
		padding-bottom: 0px;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}
	.__ag__voteendtoptext__ {
		flex: 1;
		color: #333;
		lines:1;
		text-overflow: ellipsis;
		font-size: 20wx;
	}
	.__ag__voteendtopright__ {
		flex: 0 0 70px;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}
	.__ag__voteprogresstext__ {
		color: #9C9C9C;
		font-size: 20wx;
		margin-right: 5px;
	}
	.__ag__votecount__ {
		color: #9C9C9C;
		font-size: 20wx;
	}
	.__ag__votechatoption__ {

		height: 80px;
		padding: 10px;
		padding-top: 0px;
		padding-bottom: 0px;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}
	.__ag__votechatoptiontext__ {
		font-size: 13wx;

	}
	.optiona { 
		color: #FF6633;
	}
	.optionb { 
		color: #339DFF;
	}
	.__ag__voteendprogress__ {
		flex: 1;
		height: 60px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		padding: 10px;
		padding-top: 0px;
		padding-bottom: 0px;
	}
	.__ag__voteprogressleft__ {
		flex: .5;
		height: 45wx;
		background-color: #FF6633;
		display: flex;
		flex-direction: row;
		border-top-left-radius: 15wx;
		border-bottom-left-radius: 15wx;
		padding-left: 20wx;
		/* justify-content: center; */
		align-items: center;
	}
	.__ag__voteprogressright__ {
		flex: .5;
		height: 45wx;
		background-image: linear-gradient(to right, #339DFF, rgba(51, 109, 255, 0.2));
		display: flex;
		flex-direction: row;
		border-top-right-radius: 15wx;
		border-bottom-right-radius: 15wx;
		padding-right: 20wx;
		/* justify-content: center; */
		justify-content: flex-end;
		align-items: center;
	}
</style>
