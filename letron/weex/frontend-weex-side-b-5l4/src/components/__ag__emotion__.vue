<template>
    <scroller class="__ag__emotionscroller__" :show-scrollbar="false">
        <div class="__ag__emotion__">
            <div @click="itemClick(item, index)" class="__ag__emotiondiv__" v-for="(item, index) in vars.emoji" :key="item">
                <image class="__ag__emotionimg__" resize="contain" :src ="src(index)"></image>
            </div>
        </div>
    </scroller>
</template>

<script>
	import agMinUrl from '@/components/__ag__minurl__.js'
    import vars from '@/components/vars.js'
    export default {
        mixins:[agMinUrl],
        data(){
            return {
                vars,
            }
        },
        methods:{
            src(index){
              let img =  `emoji/${index+1}.jpg`
                return  this.__ag__url__(img)
            },
            itemClick(item, index){
                this.$emit('click', item)

            },
        }
    }
</script>

<style>
    .__ag__emotionscroller__ {
       flex: 1;
    }
    .__ag__emotion__ {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }
    .__ag__emotiondiv__ {
        margin: 5wx;
        width: 60wx;
        height: 60wx;
    }
    .__ag__emotionimg__ {
        width: 60wx;
        height: 60wx;
    }
</style>
