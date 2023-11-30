<template>
    <div class="__ag__gengxin__" v-if="isgb">
        <div class="__ag__gengxincontent__">
            <div class="__ag__onguanbi__" v-if="ver.force == 0" @click="onclose">
                <text class="iconfont vector" >&#xe686;</text>
            </div>
            <text class="__ag__gengxintext__">{{ver.remark}}</text>
            <div class="__ag__gengxindiv__" :class="[isgengxin?'__ag__gengxinz__' : '']" @click="downloadFileWgt(ver)">
                <text class="__ag__gengxindivtext__" :class="[isgengxin?'__ag__gengxinztext__' : '']"> {{gengxintite}}</text>
            </div>
        </div>
    </div>
</template>
<script>
    import util from './util.js'
    import sport from './__ag__sport__.js'
    export default {
        props:{
            ver:{
                type:Object,
                default:function(){
                    return {}
                }
            }
        },
        data() {
            return {
                isgb:false,
                isgengxin:false,
                gengxintite:'立即更新'
            }
        },
        watch:{
            ver(n){
				console.log('bbb===5',util.toStirng(n))
                if(n && n.id){

                    this.isgb = true
                }else {

                    this.isgb = false
                }
            }
        },
        mounted(){
            if(this.ver && this.ver.id){
                this.isgb = true
            }else {
                this.isgb = false
            }
        },
        methods:{
            onclose(){
                this.isgb = false
            },
            downloadFileWgt(ver){
                sport.urlTo(ver)
            },
        }
    }
</script>
<style lang="less" scoped>
@import "../style/default.less";
    .iconfont {
        font-family: iconfont ;
        font-size: 16px;
        font-style: normal;
        -webkit-font-smoothing: antialiased;
        -webkit-text-stroke-width: 0.2px;
        -moz-osx-font-smoothing: grayscale;
    }
    .__ag__gengxin__ {
        position: fixed;
        top: 0px;
        bottom: 0px;
        width: 750px;
        background-color: rgba(0, 0, 0, 0.7);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    .__ag__gengxincontent__ {
        width: 630px;
        margin-left: 60px;
        margin-right: 60px;
        height: 400px;
        background-color: #fff;
        border-radius: 4wx;
        padding: 40px;
        position: relative;
    }
    .__ag__gengxintext__ {
        width: 550px;
        lines:5;
        text-overflow: ellipsis;
        height: 200px;
        font-style: normal;
        font-weight: 500;
        font-size: 14wx;
        line-height: 20wx;
        color: rgba(0, 0, 0, 0.5);
        margin-bottom: 20px;
    }
    .__ag__gengxindiv__ {
        width: 550px;
        height: 80px;
        background-color: @zhuse;
        border-radius: 4px;
        align-items: center;
        justify-content: center;
    }
    .__ag__gengxindivtext__ {
        font-style: normal;
        font-weight: 600;
        font-size: 17wx;
        color: #FFFFFF;
    }
    .__ag__onguanbi__ {
        position: absolute;
        top: 20px;
        right: 40px;
        width: 20wx;
        height: 20wx;
    }
    .vector {
        color: rgba(0, 0, 0, 0.5);
        font-size: 20wx;
    }
    .__ag__gengxinz__ {
        background-color: #EBEEF5;
    }
    .__ag__gengxinztext__ {
        color: #C0C4CC;
    }
</style>