<template>
	<div class="__ag__notlive__" v-if="upinfo && upinfo.uid" @click.stop="__ag__itemtap__(upinfo.uid)"> 
		<text class="__ag__notlivetext__">哎呀！主播现在不在家， 去看看其他賽事吧！</text>
		<div class="__ag__notlivetz__">
			<div class="__ag__notlivezb__">
				<ag-userimg class="__ag__notlivezbimg__" :avatar="upinfo.avatar" :name="upinfo.upName"></ag-userimg>
				<text class="__ag__notlivezbtext__">{{upinfo.upName}}</text>
			</div>
			<div class="__ag__notlivesais__">
				<image class="__ag__notlivesaisimg__" :src="__ag__url__(upinfo && upinfo.joinMap && upinfo.joinMap.schedule && upinfo.joinMap.schedule.teamFlaga)"></image>
				<text class="__ag__notlivezbtext__">{{upinfo && upinfo.joinMap && upinfo.joinMap.schedule && upinfo.joinMap.schedule.teamNamea}}</text>
				<text class="__ag__notlivezbvs__">VS</text>
				<image class="__ag__notlivesaisimg__" :src="__ag__url__(upinfo && upinfo.joinMap && upinfo.joinMap.schedule && upinfo.joinMap.schedule.teamFlagb)"></image>
				<text class="__ag__notlivezbtext__">{{upinfo && upinfo.joinMap && upinfo.joinMap.schedule && upinfo.joinMap.schedule.teamNameb}}</text>
			</div>
		</div>
	</div>
</template>

<script>
	import userimg from './__ag__userImg__.vue'
	import agMinUrl from './__ag__minurl__.js'
    import agMinix from './__ag__minix__.js'

	export default {
		mixins:[agMinUrl,agMinix],
		components:{
			"ag-userimg":userimg,
		},
		props:{
			upinfo:{
				type:Object,
                default:function(){
					return {}
				},
			}
		},
		data(){
			return {
				url:"2022/0225/c4c033affb394828ae6bdc3c6945779c.jpeg"
			}
		},
	}
</script>

<style lang="less">
	@import '../style/theme.less';
	.__ag__notlive__ {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.__ag__notlivetext__ {
		width: 350px;
		lines:2;
		text-overflow: ellipsis;
		color:#fff;
		font-size: 13wx;
		text-align: center;
	}
	.__ag__notlivetz__ {
		margin-top: 30px;
		/* flex: 1; */
		height: 84px;
		/* background-color: #00CC6A; */
		width: 638px;
		border-radius: 42px;
		border-width: 1wx;
		border-style: solid;
		border-color: @main-color;
		display: flex;
		flex-direction: row;
	}
	.__ag__notlivezb__ {
		width:236px;
		height: 83px;
		display: flex;
		flex-direction: row;
		padding: 12px;
		align-items: center;
		border-right-width: 1wx;
		border-right-color: @main-color;
		border-right-style: solid;
	}
	.__ag__notlivesais__ {
		flex: 1;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		padding-left: 10px;
	}
	.__ag__notlivezbimg__ {
		/* flex: 0 0 60px; */
		width: 60px;
		height: 60px;
		margin-right: 8px;
	}
	.__ag__notlivezbtext__ {
		flex: 1;
		font-style: normal;
		font-weight: normal;
		font-size: 13wx;
		color: @main-color;
		lines:1;
		text-overflow: ellipsis;
	}
	.__ag__notlivesaisimg__ {
		width: 40px;
		height: 40px;
		margin-right: 10px;
	}
	.__ag__notlivezbvs__ {
		width: 40px;
		font-style: normal;
		font-weight: 500;
		font-size: 11wx;
		color: #C4C4C4;
		margin-right: 10px;
	}
</style>
