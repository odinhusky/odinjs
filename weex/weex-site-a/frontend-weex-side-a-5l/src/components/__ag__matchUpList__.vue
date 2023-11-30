<template>
	<div class="__ag__matchUpList__" v-if="item && item.id" @click.stop="__ag__itemtap__(item.uid)">
		<ag-matchupitem :item="item"></ag-matchupitem>
		<div class="__ag__matchupcontent__" v-if="schedule">
			<div class="__ag__matchname__">
				<image class="__ag__matchnameimg__" :src="__ag__url__(schedule.teamFlaga)" mode="aspectFit"></image>
				<div class="__ag__matchnameview__">
					<text  class="__ag__matchnametext__">{{schedule.teamNamea}}</text>
				</div>
				<text class="__ag__matchnamebf__">{{schedule.scorea}}:{{schedule.scoreb}}</text>
				<div class="__ag__matchnameview__">
					<text  class="__ag__matchnametext__">{{schedule.teamNameb}}</text>
				</div>
				<image class="__ag__matchnameimg__" :src="__ag__url__(schedule.teamFlagb)" mode="aspectFit"></image>
			</div>
		</div>
	</div>
</template>

<script>
	import agMatchUpItem from './__ag__matchUpItem__.vue'
	import agMinix from './__ag__minix__.js'
	import agMinUrl from './__ag__minurl__.js'
	export default {
		name:"ag-matchUpList",
		components:{
			"ag-matchupitem":agMatchUpItem,
		},
		mixins:[agMinix,agMinUrl],
		props: {
			item: {
				type:Object,
				default: ()=>{
					return {}
				}
			}
		},
		computed:{
			// item(){
			// 	if(!this.a__ag__listUsersLive__ || !this.a__ag__listUsersLive__.data){
			// 		return {}
			// 	}
			// 	let l  = this.a__ag__listUsersLive__.data[0]
			// 	return l
			// },
			schedule(){
				if(!this.item || !this.item.id){
					return {}
				}
				let l  = this.item
				if(!l || !l.joinMap || !l.joinMap.schedule){
					return {}
				}
				let schedule1 = l.joinMap.schedule
				return schedule1
			},
		},
		methods:{
		},
	}
</script>

<style >
	.__ag__matchUpList__ {
		width: 710px;
		background-color: #F2F3F4;
		margin: 20px;
		margin-bottom: 0px;
		border-radius: 16px;
	}
	.__ag__text__ {
		overflow: hidden;
		text-overflow: hidden;
	}
	.__ag__nowrap__ {
		overflow: hidden;
		text-overflow: hidden;
		white-space:nowrap;
		word-break:break-all; 
		text-overflow: ellipsis;
	}
	.__ag__matchupcontent__ {
		width: 710px;
		height:116px;
		background-color: #F2F3F4;
		/* border-radius: 0px 0px 4px 4px; */
		border-bottom-right-radius: 16px;
		border-bottom-left-radius: 16px;
		flex-direction: column;
		
	}
	.__ag__matchname__ {
		/* padding: 13px 14px 15px 14px; */
		height: 116px;
		padding-top: 13px;
		padding-right: 14px;
		padding-bottom: 15px;
		padding-left: 14px;
		flex-direction: row;
		align-items: center;
		justify-content: space-around;
	}
	.__ag__matchnameimg__ {
		width: 60px;
		height: 60px;
	}
	.__ag__matchnameview__ {
		width: 150px;
		height: 80px;
		overflow: hidden;
		text-overflow: hidden;
		white-space:nowrap;
		word-break:break-all; 
		text-overflow: ellipsis;
		
	}
	.__ag__matchnametext__ {
		height: 80px;
		font-style: normal;
		font-weight: normal;
		font-size: 30px;
		color: #000000;
		white-space:unset;
		line-height: 80px;
	}
	.__ag__matchnamebf__ {
		font-style: normal;
		font-weight: bold;
		font-size: 18wx;
		color: #000000;
	}
	.__ag__matchupqt__ {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 8px 0px;
	}
	.__ag__matchupyuan__ {
		width: 8px;
		height: 8px;
		margin-right: 4px;
		border-radius: 50%;
		background: #FF0000;
	}
	.__ag__matchupqttext__ {
		font-style: normal;
		font-weight: normal;
		font-size: 10px;
		line-height: 12px;
		letter-spacing: 0.05em;
		color: #000000;
	}
	.__ag__matchupscrollx__ {
		display: flex;
		flex-direction: row;
	}
	.__ag__matchupscrollitem__ {
		width: auto;
		height: 36px;
		background: #FFFFFF;
		border: 1px solid #FF3551;
		box-sizing: border-box;
		border-radius: 20px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		padding: 4px 0px;
		margin-right: 4px;
	}
	.__ag__matchupscrollitem__:last-child{
		margin-right:0px;
	}
	.__ag__matchupscrollimg__ {
		width: 28px;
		height: 28px;
		border-radius: 50%;
		margin: 0px 4px;
	}
	.__ag__matchupscrollitemname__ {
		max-width: 69px;
		margin-right: 4px;
		overflow: hidden;
		text-overflow: hidden;
		white-space:nowrap;
		word-break:break-all; 
		text-overflow: ellipsis;
	}
	.__ag__matchupscrollitemnametext__ {
		font-style: normal;
		font-weight: normal;
		font-size: 13px;
		line-height: 20pxpx;
		letter-spacing: 0.05em;
		color: #FF3551;
	}
	.__ag__matchupscrollitemtm__ {
		width: 36px;
		height: 36px;
		position: absolute;
		right: 0px;
		bottom: 11px;
		background: linear-gradient(270deg, #FFFFFF 14.58%, rgba(255, 255, 255, 0) 100%);
	}
</style>