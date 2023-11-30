<template> 
	<div class="__ag__liveuplist__">
		<div v-for="item in list" :key="item.id" class="__ag__liveuplistitem__" @click.stop="__ag__itemtap__(item.uid,isindex)">
			<ag-hb-liveupitem :item="item" :isindex="isindex"></ag-hb-liveupitem>
		</div>
	</div>
</template>

<script>
	import liveUpitem from './__ag__liveUpItem__.vue'
	import hbliveUpItem from './__ag__liveUpItembh__.vue'
	import agMinix from './__ag__minix__.js'
	import env from './env.js'
	export default {
		name:"ag-liveUpList",
		components:{
			'ag-liveupitem':liveUpitem,
			'ag-hb-liveupitem':hbliveUpItem,

		},
		props:{
			isindex:{
				type:Boolean,
				default:false,
			},
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
				env,
			};
		},
		computed:{
		},
		methods:{
		},
	}
</script>

<style>
	.__ag__liveuplist__ {
		width: 690px;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
	}
	.__ag__liveuplistitem__ {
		width: 332px;
		height: 300px;
		margin-bottom: 30px;
	}
	.__ag__liveuplist_last__ {
		margin-bottom: 0px;
	}
</style>
