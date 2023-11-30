<template>
	<div class="__ag__liveuplist__">
		<ag-liveupitem v-for="(item) in listMatchUsers" :key="item.id" :item="item"></ag-liveupitem>
	</div>
</template>

<script>
	import liveUpitem from './__ag__liveUpItem__.vue'
	import agMinix from './__ag__minix__.js'
	export default {
		name:"ag-liveUpList",
		components:{
			'ag-liveupitem':liveUpitem,
		},
		props:{
			list: {
				type: Array,
				default:function() {
					return []
				}
			}
		},
		mixins:[agMinix],
		data() {
			return {

			};
		},
		computed:{
			listMatchUsers() {
				if(!this.list || !this.list.length){
					return []
				}
				let list = this.list.sort((a, b)=>{
					let amountA = a.joinMap && a.joinMap.room && a.joinMap.room.amount
					let amountB = b.joinMap && b.joinMap.room && b.joinMap.room.amount
					if (amountA && amountA) {
						return amountA > amountB ? -1 : 1
					}
					return 1
				})
				return list
			}
			// list(){
			// 	if(!this.a__ag__listUsersLive__ || !this.a__ag__listUsersLive__.data){
			// 		return []
			// 	}
			// 	let l  = this.a__ag__listUsersLive__.data
			// 	if(this.isindex){
			// 		if(l && l.length>3){
			// 			return l.slice(1,l.length)
			// 		}
			// 	}
			// 	return l
			// },
		},
		methods:{
		},
	}
</script>

<style>
	.__ag__liveuplist__ {
		/* width: 710px; */
		flex: 1;
		/* flex-direction: row; */
		/* margin-bottom: 16px; */
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		flex-wrap: wrap;
	}
	.__ag__liveuplistitem__ {
		flex: .45;
		/* flex: 0 0 300px; */
		/* display: block ; */
	}
</style>
