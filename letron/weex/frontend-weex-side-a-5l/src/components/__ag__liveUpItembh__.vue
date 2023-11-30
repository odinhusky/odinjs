<template>
    <div  v-if="item1 && item1.id" class="__ag__liveupitem__" @click.stop="__ag__itemtap__(item1.uid)">
        <div class="__ag__liveupitemimgview__">
			<image resize="cover"  v-if="item1 && item1.joinMap && item1.joinMap.room && item1.joinMap.room.thumb"  :src="__ag__url__(item1.joinMap.room.thumb)"  class="__ag__liveupitemimg__"></image>
			<image resize="cover" v-else-if="item1.thumb" @load="imgError"  :src="__ag__url__(item1.thumb)"   class="__ag__liveupitemimg__"></image>
			<image resize="cover" v-else  class="__ag__liveupitemimg__"></image>
			<div class="__ag__liveupitemmatch__" v-if="item1.joinMap && item1.joinMap.match  && item1.joinMap.match.nameAbbr">
				<div class="__ag__lives__">
					<image :src="__ag__url__('static/bl/video1.png')"   class="__ag__lives_video__"></image>
					<text class="__ag__lives_text__">直播中</text>
				</div>
				<text class="__ag__liveupitemtext__">{{item1.joinMap && item1.joinMap.match  && item1.joinMap.match.nameAbbr}}</text>
			</div>
			<div class="__ag__liveupitemup__">
            	<div class="__ag__liveupitemtop__">
					<text class="__ag__title_text__">{{item1.title}}</text>
					<div class="__ag__liveupitemname__">
						<ag-userimg class="__ag__liveupitemupimg__" :avatar="item1.avatar" :uid="item1.uid" :name="item1.upName"></ag-userimg>
						<text class="__ag__liveupitemuptext__">{{item1.upName}}</text>
					</div>
				</div>
				<div class="__ag__liveupitembottom__">
					<image :src="__ag__url__('static/bl/hot.png')"   class="__ag__fire__"></image>
					<text class="__ag__liveupitembottomtext__" >{{amount1(item1.joinMap && item1.joinMap.room && item1.joinMap.room.amount)}}</text>
				</div>
			</div>
		</div>
        <div class="__ag__liveupitemcontent__">
            <text class="__ag__liveupitemtitletext__">{{item1.title}}</text>
        </div>
    </div>
</template>

<script>
    import agMinix from './__ag__minix__.js'
	import agMinUrl from './__ag__minurl__.js'
    import userImg from './__ag__userImg__.vue'
	import util from './util.js'
    export default {
        components:{
			'ag-userimg': userImg,
		},
        mixins:[agMinix,agMinUrl],
		props:{
			item:{
				type:Object,
				default:function(){
					return {}
				}
			},
		},
        data(){
            return {
                item1:{},
            }
        },
        watch:{
			item(n){
				this.item1 = n
			}
		},
		mounted(){
			this.item1 = this.item
		},
		methods:{
			amount1(amount){
				return util.numberReadable(amount)
			},
			imgError(event){
				console.log("event",event)
				if(!event.success){
					this.item1.thumb=null
				}
			},
			__ag__itemtap__(uid){
				if(!uid){
					return
				}
				let params = {
					tab: 2,
					uid: uid
				}
				util.getPush('__ag__live__',params)
			},
		}
    }
</script>

<style scoped lang="less">
	.agiconfont {
		font-family: iconfont;
		font-size: 16px;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-webkit-text-stroke-width: 0.2px;
		-moz-osx-font-smoothing: grayscale;
	}
    .__ag__liveupitem__ {
		width: 332px;
        height: 300px;
        border-radius: 10px;
        background-color: #fff;
        margin-bottom: 16wx;
		overflow: hidden;
		border-width: 1px;
		border-style: solid;
		border-color: #e5e5e5;
    }
    .__ag__liveupitemimgview__ {
		width: 332px;
        height: 300px;
		position: relative;
	}
	.__ag__liveupitemimg__ {
        width: 332px;
        height: 300px;
	}
	.__ag__liveupitemmatch__ {
		position: absolute;
		background-color: rgba(255, 231, 172, 0.4);
		border-radius: 32px;
		height: 40px;
		top: 14px;
		left:16px;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		padding-right: 18px;
	}
	.__ag__lives__ {
		height: 40px;
		background-color:  rgba(245, 152, 42, 0.8);
		border-radius: 32px;
		flex-direction: row;
		align-items: center;
		padding-left: 12px;
		padding-right: 12px;
		margin-right: 18px;
	}
	.__ag__lives_video__ {
		width: 30px;
		height: 30px;
	}
	.__ag__lives_text__ {
		margin-left: 8px;
		font-style: normal;
		font-weight: 400;
		font-size: 8wx;
		color: #FFFFFF;
	}
	.__ag__liveupitemup__ {
		width: 332px;
		position: absolute;
		bottom: 0px;
		background-color: rgba(0, 0, 0, 0.5);
		flex-direction: row;
		align-items: center;
		padding-left: 14px;
		padding-right: 14px;
		border-radius: 10px;
		padding-top: 5px;
		padding-bottom: 10px;
	}
	.__ag__liveupitemtop__ {
		flex: 1;
		justify-content: center;
	}
	.__ag__title_text__ {
		line-height: 30px;
		lines:1;
		text-overflow: ellipsis;
		overflow: hidden;
		font-style: normal;
		font-weight: 500;
		font-size: 11wx;
		letter-spacing: 0.02em;
		color: #FFFFFF;
		margin-bottom: 3px;
	}
	.__ag__liveupitemtext__ {
		font-style: normal;
		font-weight: normal;
		font-size: 20px;
		color: #FFFFFF;
		overflow: auto;
	}
    .__ag__liveupitemcontent__ {
        flex: 1;
        display: flex;
        flex-direction: row;
        padding: 6wx;
        height: 46wx;
        padding-top: 7wx;
    }
    .__ag__liveupitemupimg__ {
		width: 30px;
		height: 30px;
		margin-right: 8wx;
	}
    .__ag__liveitemcontentright__ {
        flex:1;
        display: flex;
        flex-direction: column;
    }
    .__ag__liveupitemtitletext__ {
		flex: 1;
		font-style: normal;
		font-weight: 400;
		font-size: 12wx;
		letter-spacing: 0.02em;
		color: #000000;
		lines:2;
        text-overflow: ellipsis;
		letter-spacing: 3em;
	}
    .__ag__liveupitemname__ {
		flex: 1;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    .__ag__liveupitemuptext__ {
        flex: 1;
		font-style: normal;
		font-weight: 400;
		font-size: 10wx;
        lines:1;
        text-overflow: ellipsis;
		color: #FFFFFF;
	}
    .__ag__liveupitembottom__ {
        align-items: center;
		justify-content: center;
    }
    .__ag__fire__ {
		color: #FF0000;
		font-size: 12wx;
	}
    .__ag__liveupitembottomtext__ {
        font-style: normal;
        font-weight: normal;
        font-size: 11wx;
        color: #FFFFFF;
    }
	.__ag__fire__ {
		width: 44px;
		height: 44px;
		margin-bottom: 5px;
	}
</style>
