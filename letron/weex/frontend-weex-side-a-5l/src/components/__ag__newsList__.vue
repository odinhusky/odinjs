<template>
	<div class="__ag__newslist__" :class="{isindex:isindex}">
		<div v-for="item in list" class="__ag__newsitem__" :key="item.id">
			<ag-bh-newsitem  :item="item" :isindex="isindex" ></ag-bh-newsitem>
		</div>
	</div>
</template>

<script>
	import newitem from './__ag__newsItem__.vue';
	import newsItembh from './__ag__newsItembh__.vue';
	import util from './util.js';
	import env from './env.js';
	import agMinix from '../components/__ag__minix__.js'
	export default {
		name:"ag-newsList",
		mixins:[agMinix],
		components:{
			'ag-newsitem':newitem,
			'ag-bh-newsitem':newsItembh,
		},
		props:{
			isindex:{
				type:Boolean,
				default:false
			}
		},
		data() {
			return {
				env,
			};
		},
		computed:{
			list(){
				if(!this.a__ag__pageArticle__ || !this.a__ag__pageArticle__.data){
					return {}
				}
				let l = this.a__ag__pageArticle__.data.list
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
				try {
					await this.__ag__pageArticle__()
				} catch (error) {
					util.message(error.message)
				}
			},
		}
	}
</script>

<style>
	.__ag__newslist__ {
		width: 750px;
		padding-left: 32px;
		padding-right: 32px;
		height: auto;
	}
	.isindex {
		flex: 1;
	}
	.__ag__newsitem__ {
		flex: 1;
	}
</style>
