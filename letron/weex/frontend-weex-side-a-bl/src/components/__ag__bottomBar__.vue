<template>
    <div class="__ag__bottombar__"  :class="[ipx?'ipx':'']">
        <div class="__ag__bottombardiv__" @click.stop="__ag__onIndex__(1)">
            <image class="__ag__hbtitleimg__ __ag__img__ __ag__img_h__" v-if="tab == 1" :src="__ag__url__('static/bl/home2.png')"/>
            <image class="__ag__hbtitleimg__ __ag__img_n__" v-else :src="__ag__url__('static/bl/home1.png')"/>
        </div>
        <div class="__ag__bottombardiv__" @click.stop="__ag__onIndex__(2)">
            <image class="__ag__hbtitleimg__ __ag__img__" v-if="tab == 2" :src="__ag__url__('static/bl/match2.png')"/>
            <image class="__ag__hbtitleimg__" v-else :src="__ag__url__('static/bl/match1.png')"/>
        </div>
        <div class="__ag__bottombardiv__" @click.stop="__ag__onIndex__(3)">
            <image class="__ag__hbtitleimg__ __ag__img__" v-if="tab == 3" :src="__ag__url__('static/bl/my2.png')"/>
            <image class="__ag__hbtitleimg__" v-else :src="__ag__url__('static/bl/my1.png')"/>
        </div>
        
    </div>
</template>

<script>
    import agMinix from './__ag__minix__.js'
    import agMinUrl from './__ag__minurl__.js'
    import env from './env.js'

    export default {
        mixins:[agMinix,agMinUrl],
        props: {
            tabs: {
                type: Number,
                default: 1
            }
        },
        data(){
            return {
                env,
                tab: 1
            }
        },
        computed: {

        },
        mounted() {
            this.tab = this.tabs
        },
        methods:{
            __ag__onIndex__(index){
                this.tab = index
                this.$emit('onclick',index)
            }
        }
    }
</script>

<style lang="less">
    .__ag__bottombar__ {
        position: fixed;
        bottom: 0px;
        height: 134px;
        width: 750px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        border-top-left-radius: 40px;
		border-top-right-radius: 40px;
        background-color: #fff;
        box-shadow: -2px -2px 4px rgba(214, 214, 214, 0.3);
    }
    .ipx {
		bottom: 0px;
        padding-bottom: 34px;
	}
    .__ag__bottombardiv__ {
        height: 134px;
        flex: 1;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;
    }
    .__ag__hbtitleimg__ {
        width: 52px;
        height: 52px;
    }
    .__ag__img__ {
        width: 75px;
        height: 75px;
    }
    .__ag__img_h__ {
        width: 75px;
    }
    .__ag__img_n__ {
        width: 55px;
    }
</style>
