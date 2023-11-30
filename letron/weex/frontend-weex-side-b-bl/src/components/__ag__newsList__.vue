<template>
	<div class="__ag__newslist__" :class="{isindex:isindex}">
		<ag-newsitem v-for="(item,index) in list" :item="item" :index="index" :length="list.length" :isindex="isindex" :key="item.id"></ag-newsitem>
	</div>
</template>

<script>
	import newitem from './__ag__newsItem__.vue';
	import agMinix from '../components/__ag__minix__.js'

	export default {
		name:"ag-newsList",
		mixins:[agMinix],
		components:{
			'ag-newsitem':newitem,
		},
		props:{
			isindex:{
				type:Boolean,
				default:false
			},
		},
		data() {
			return {
				isnet:false,
			};
		},
		computed:{
			list(){
				if(!this.a__ag__pageArticle__ || !this.a__ag__pageArticle__.data){
					return {}
				}
				let list = this.a__ag__pageArticle__.data.list
				let l = list
				if(this.isindex){
					if(l && l.length>5){
						return l.slice(0,5)
					}
				}
				return l
			}
		},
		methods:{
            async __ag__loadData__(option){
				await this.__ag__pageArticle__()
			},
		}
	}
</script>

<style lang="less" scoped>
	.__ag__newslist__ {
		flex: 1;
		/* background-color: #fff; */
	}
	.isindex {
		flex: 1;
	}
</style>
