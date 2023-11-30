<template>
    <div class="__ag__uplive__" :class="[ipx?'ipx':'']" @swipe="handleSwipe">
        <ag-hbtitle :isback="true" title="直播"></ag-hbtitle>
		<div class="__ag__uplivetabs__">
			<div class="__ag__uplivetabsitem__" v-for="item in tabList" :key="item.id" @click="change(item)">
				<image resize="contain" :src="__ag__url__(`static/${env.brand}/${env.brand}-remen.png`)" class="__ag__tabs_image__" v-if="item.name == '热门' && tab == item.id"/>
				<image resize="contain" :src="__ag__url__(`static/tab-remen.png`)" class="__ag__tabs_image__" v-if="item.name == '热门' && tab != item.id"/>
				<image resize="contain" :src="__ag__url__(`static/${env.brand}/${env.brand}-all.png`)" class="__ag__tabs_image__" v-if="item.name == '全部' && tab == item.id"/>
				<image resize="contain" :src="__ag__url__(`static/tab-all.png`)" class="__ag__tabs_image__" v-if="item.name == '全部' && tab != item.id"/>
				<image resize="contain" :src="__ag__url__(`static/${env.brand}/${env.brand}-lanqiu.png`)" class="__ag__tabs_image__" v-if="item.name == '篮球' && tab == item.id"/>
				<image resize="contain" :src="__ag__url__(`static/tab-lanqiu.png`)" class="__ag__tabs_image__" v-if="item.name == '篮球' && tab != item.id"/>
				<image resize="contain" :src="__ag__url__(`static/${env.brand}/${env.brand}-zuqiu.png`)" class="__ag__tabs_image__" v-if="item.name == '足球' && tab == item.id"/>
				<image resize="contain" :src="__ag__url__(`static/tab-zuqiu.png`)" class="__ag__tabs_image__" v-if="item.name == '足球' && tab != item.id"/>
				<image resize="contain" :src="__ag__url__(`static/${env.brand}/${env.brand}-qt.png`)" class="__ag__tabs_image__" v-if="item.name == '其他' && tab == item.id"/>
				<image resize="contain" :src="__ag__url__(`static/tab-qt.png`)" class="__ag__tabs_image__" v-if="item.name == '其他' && tab != item.id"/>
                <text class="__ag__tabstext__" :class="[tab == item.id?'__ag__tabselecttext__':'']">{{item.name}}</text>
            </div>
		</div>
		<slider class="__ag__slider__" interval="10" offset-x-accuracy="200" auto-play="false" infinite="false" @change="changeHandler" :index="sliderIndex">
			<div class="__ag__uplivecontent__" v-for="item in tabList" :key="item.id">
				<scroller class="__ag__uplivecontentscroller__"  :show-scrollbar="false">
					<refresh class="__ag__refresh__"  @refresh="onrefresh" @pullingdown="onpullingdown" :display="a__ag__refreshing__ ? 'show' : 'hide'">
						<loading-indicator  class="__ag__loading__"></loading-indicator>
						<text  class="__ag__refreshtext__" >{{a__ag__freshText__}}</text>
					</refresh>
					<div class="__ag__liveuplist__" v-if="item.list && item.list.length>0">
						<ag-liveuplist :list="item.list"  :isindex="true"></ag-liveuplist>
					</div>
					
					<div class="__ag__liveupnotlist__" @click="change({id:1})" v-if="item.list && item.list.length<=0">
						<image class="__ag__liveupnotimg__" :src="__ag__url__(url)"></image>
						<text class="__ag__liveupnottext__">目前没有直播，点我看更多</text>
					</div>
				</scroller>
			</div>
		</slider>
        <!-- <ag-title class="__ag__indexagtitle__" name="" id="1"></ag-title> -->
    </div>
</template>

<script>
    import agMinix from './components/__ag__minix__.js'
	import HbTitle from './components/__ag__headTop__.vue'
	import liveUpList from './components/__ag__liveUpList__.vue'
	import title from './components/__ag__title__.vue'
    import minurl from './components/__ag__minurl__.js'
    import util from './components/util.js'
	import env from './components/env.js'
	export default {
		mixins:[agMinix,minurl],
		components:{
			'ag-hbtitle': HbTitle,
			'ag-title':title,
			'ag-liveuplist':liveUpList,
		},
		data() {
            return {
				env,
                a__ag__isFreshing__: false,
				a__ag__freshing__: false,
				a__ag__triggered__: false,
				a__ag__freshText__: '释放更新',
				a__ag__refreshing__:false,
				tabList: [{id:0,name:'热门',list:[]},{id:1,name:'全部',list:[]},{id:2,name:'篮球',list:[]},{id:3,name:'足球',list:[]},{id:4,name:'其他',list:[]}],
				tab: 0,
				sliderIndex: 0,
				url:'static/frame.png',
            }
		},
		computed:{
            list(){
				if(!this.a__ag__listUsersLive__ || !this.a__ag__listUsersLive__.data){
					return []
				}
				let l  = this.a__ag__listUsersLive__.data
				
				return l.filter(r=>{
					if(this.tab == 0 && (r.joinMap && r.joinMap.match && r.joinMap.match.hot != 1)){
						return false
					}
					if(this.tab == 2 && r.matchClassId != 4){
						return false
					}
					if(this.tab == 3 && r.matchClassId != 5){
						return false
					}
					if(this.tab == 4 && r.matchClassId != 6){
						return false
					}
					return true
				})
			},
        },
		methods:{
			change(item) {
				this.tab= item.id
				this.sliderIndex = item.id
			},
			changeHandler(e) {
            	this.tab = this.tabList[e.index].id;
				this.sliderIndex = this.tab
        	},
            async __ag__loadData__(){
				try {
					await this.__ag__listUsersLive__()
				} catch (err) {
					util.message(err.message)
				}
				this.__ag__pustList__()
			},
			__ag__pustList__(){
				let l  = this.a__ag__listUsersLive__.data
				if(!l || !l.length){
					return
				}
				this.tabList=[
							{id:0,name:'热门',list:[]},
							{id:1,name:'全部',list:[]},
							{id:2,name:'篮球',list:[]},
							{id:3,name:'足球',list:[]},
							{id:4,name:'其他',list:[]}]
				let list =l
				for(let i in list){
					let r = list[i]
					this.tabList[1].list.push(r)
					if(r.joinMap.match.hot == 1){
						this.tabList[0].list.push(r)
					}
					if(r.matchClassId == 4){
						this.tabList[2].list.push(r)
						continue
					}
					if(r.matchClassId == 5){
						this.tabList[3].list.push(r)
						continue
					}
					if(r.matchClassId == 6 || !r.matchClassId){
						this.tabList[4].list.push(r)
						continue
					}
				}
			},
            async onrefresh(){
				this.a__ag__refreshing__ = true
				this.a__ag__freshText__ = '加载中...'
				await this.refresh()
				// setTimeout(()=>{
					this.a__ag__refreshing__ = false
				// },2000)
			},
			async __ag__refreshUsersLive__(){
				try {
					await this.__ag__listUsersLive__()
				} catch (err) {
					util.message(err.message)
				}
				this.__ag__pustList__()
				return true
			},
            async refresh(){
				return  await this.__ag__refreshUsersLive__()
			},
			onpullingdown(){
				this.a__ag__freshText__ = '释放更新'
			},
			handleSwipe(e) {
				if (e.direction == 'right') {
					if (this.tab == 0) {
						util.pop()
					}
				}
			}
		}
	}
</script>

<style lang="less">
	@import './style/theme.less';

	.__ag__uplive__ {
		background-color: #F2F3F4;
		width: 750px;
		position: fixed;
		top: 128px;
		bottom: 0px;
	}
	.ipx {
        top: 166px;
    }
	.__ag__uplivetabs__ {
		width: 750px;
		display: flex;
        background-color: #F8F8F8;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
		box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);
	}
	.__ag__uplivetabsitem__ {
		height: 140px;
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
		padding-left: 10wx;
		padding-right: 10wx;
    }
	.__ag__tabstext__ {
        font-style: normal;
        font-weight: normal;
        font-size: 15wx;
        color: #000000;
		font-weight: 600;
    }
	.__ag__tabselecttext__ {
		color:  @main-color;
	}
	.__ag__tabs_image__ {
		width: 42px;
		height: 42px;
		margin-bottom: 15px;
	}
	.__ag__slider__ {
		flex: 1;
        padding-bottom: 170px;
	}
    .__ag__uplivecontent__ {
        width: 750px;
		flex: 1;
        /* position: fixed;
		top: 50wx;
		bottom: 0px;
		z-index: 9;
        flex-direction: column;
		align-items: center; */
    }
	.__ag__uplivecontentscroller__ {
        width: 750px;
		padding-left: 16wx;
		padding-right: 16wx;
	}
	.__ag__liveuplist__ {
		background-color: #F2F3F4;
		padding-top: 32px;
		margin-top: 5px;
	}

    .__ag__refresh__ {
		width: 750px;
		padding: 40px;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}
    .__ag__indexagtitle__ {
        margin-bottom: 16px;
        position: fixed;
		top: 100wx;
		bottom: 0px;
		z-index: 9;
    }
    .__ag__refreshtext__ {
		margin-left: 30px;
	}
    .__ag__loading__ {
		color: #000000;
	}
	.__ag__liveupnotlist__ {
		flex: 1;
		/* background-color: red; */
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.__ag__liveupnotimg__ {
		width: 100px;
		height: 70px;
	}
	.__ag__liveupnottext__ {
		margin-top: 20px;
		color: #8C97A5;
		font-style: normal;
		font-weight: normal;
		font-size: 14wx;
	}
</style>
