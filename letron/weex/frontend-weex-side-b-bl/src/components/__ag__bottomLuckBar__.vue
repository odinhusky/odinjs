<template>
    <div class="__ag__bottombar__"  :class="[ipx?'ipx':'']">
        <div class="__ag__bottombardiv__" @click.stop="__ag__onIndex__(1)">
            <image :src="__ag__url__(`static/shijiebei/${env.brand}-sy.png`)"  class="__ag__bottom_image__ first_image"></image>
            <text class="__ag__bottombartext__" :class="[topTab=='1' ? '__ag__tab__' :'']">首页</text>
        </div>
         <div class="__ag__bottombardiv__" @click.stop="__ag__onIndex__(2)">
            <image :src="__ag__url__(`static/shijiebei/${env.brand}-bs.png`)"  class="__ag__bottom_image__"></image>
            <text class="__ag__bottombartext__" :class="[topTab=='2' ? '__ag__tab__' :'']">比赛</text>
        </div>
         <div class="__ag__bottombardiv__" @click.stop="__ag__onIndex__(3)">
            <image :src="__ag__url__(`static/shijiebei/${env.brand}-lt.png`)"  class="__ag__bottom_image__"></image>
            <text class="__ag__bottombartext__" :class="[topTab=='3' ? '__ag__tab__' :'']">聊天</text>
            <div class="__ag__bottombarhot__" v-if="unreads>0">
                <text class="__ag__bottombarhottext__">{{unreads}}</text>
            </div>
        </div>
         <div class="__ag__bottombardiv__" @click.stop="__ag__onIndex__(4)">
            <image :src="__ag__url__(`static/shijiebei/${env.brand}-txl.png`)"  class="__ag__bottom_image__"></image>
            <text class="__ag__bottombartext__" :class="[topTab=='4' ? '__ag__tab__' :'']">通讯录</text>
        </div>
         <div class="__ag__bottombardiv__" @click.stop="__ag__onIndex__(5)">
            <image :src="__ag__url__(`static/shijiebei/${env.brand}-wd.png`)"  class="__ag__bottom_image__ last_image"></image>
            <text class="__ag__bottombartext__" :class="[topTab=='5' ? '__ag__tab__' :'']">我的</text>
        </div>
    </div>
</template>

<script>
    import agMinix from './__ag__minix__.js'
    import agMinUrl from './__ag__minurl__.js'
    import util from './util.js'
    import bc from './__ag__bc__.js'
    import env from './env.js'
    import sport from './__ag__sport__.js'

    export default {
        mixins:[agMinix,agMinUrl],
        props:{
			topTab:{
				type: String,
				default: '1'
			},
		},
        data(){
            return {
                unread:0,
                env,
            }
        },
        computed: {
            unreads() {
                return this.unread
            }
        },
        methods:{
            async __ag__loadData__(){
                bc.onmessage('onUnread',this.onunread)
            },
            onunread(e){
                let isShock =  !util.getItem('isShock')
                if(this.unread<e.data && isShock){
                    util.setVibrate(1000)
                }
                this.unread = e.data
                
				sport.setBadge(this.unread)
            },
            __ag__onIndex__(index){
                this.$emit('onclick',index+'')
            }
        }
    }
</script>

<style lang="less">
    @import '../style/theme.less';
    .__ag__bottombar__ {
        position: fixed;
        bottom: 0px;
        height: 66wx;
        width: 750px;
        background-color: #f7f7f7;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        padding-top: 18wx;
    }
    .ipx {
		bottom: 0px;
        padding-bottom: 34wx;
	}
    .__ag__bottombardiv__ {
        width: 150px;
        height: 66wx;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;
    }
    .__ag__bottombartext__ {
        font-weight: 500;
        font-size: 11wx;
        letter-spacing: 0.05em;
        color: #000000;
    }
    .__ag__tab__ {
        color: @main-color;
    }
    .__ag__iconfonttext__ {
        color: #000;
        font-size: 20wx;
    }
    .__ag__bottombarhot__ {
        position: absolute;
        width: 36px;
        height: 36px;
        background-color: #FA5151;
        border-radius: 18px;
        align-items: center;
        justify-content: center;
        top: 20px;
        right: 35px;
    }
    .__ag__bottombarhottext__ {
        font-size: 9wx;
        color: #fff;
    }
    .__ag__bottom_image__ {
        width: 45px;
        height: 45px;
        margin-bottom: 5px;
    }
    .first_image {
        width: 50px;
        height: 50px;
    }
    .last_image {
        height: 40px;
    }
</style>
