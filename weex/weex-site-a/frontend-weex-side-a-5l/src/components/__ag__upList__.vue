<template>
	<div class="__ag__uplist__" v-if="list2 && list2.length>0">
		<scroller scroll-direction="horizontal" :show-scrollbar="false" class="__ag__uplistscroll__" >
			<div v-for="(item) in list2" :key="'p'+item.id" class="__ag__uplistitem__">
				<ag-bh-itemup :item="item"></ag-bh-itemup>
			</div>
		</scroller >
	</div>
</template>

<script>
	import agitemup from "./__ag__upItem__.vue"
	import agitemupbh from "./__ag__upItembh__.vue"
	import agMinix from './__ag__minix__.js'
	import __ag__util__ from './util.js'
	import env from './env.js'
	export default {
		name:"ag-liveuplist",
		components:{
			'ag-liveup':agitemup,
			'ag-bh-itemup':agitemupbh,
		},
		mixins:[agMinix],
		data(){
			return {
				env,
			}
		},
		computed:{
			list2(){
				if(!this.a__ag__pageUp__ || !this.a__ag__pageUp__.data || !this.a__ag__pageUp__.data.list){
					return []
				}
				let data = this.a__ag__pageUp__.data
				let l = data.list
				let list = l.sort((a,b)=>{ 
					let scorea = this.score(a)
					let scoreb = this.score(b)
					return scoreb - scorea
				})

				if(list && list.length>20){
					return list.slice(0,20)
				}
				return list
			}
		},
		methods:{
			score(a){
				let s = 0
				if(a.joinMap && a.joinMap.live && a.joinMap.live.scheduleId){
					s += 100000000000
				}
				//订阅人数
				s+= a.score
				return s
				
			},
			async __ag__loadData__(){
				try {
					await this.__ag__pageUp__()
				} catch (error) {
					__ag__util__.message(error.message)
				}
			},
			__ag__onlive__(){
				__ag__util__.getPush('__ag__anchor__')
			},
		}
	}
</script>

<style>
	.__ag__uplist__ {
		width: 750px;
		background: #F2F3F4;
		padding-bottom: 16px;
	}
	.__ag__uplistscroll__ {
		width: 750px;
		flex-direction: row;
		align-items: center;
		padding-left: 32px;
		padding-right: 12px;
	}
	.__ag__uplistitem__ {
		margin-right: 40px;
	}
</style>
