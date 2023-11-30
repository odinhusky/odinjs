<template>
    <div :style="{height:isheight}" class="__ag__keyboard__" >
    </div>
</template>

<script>
import agMinix from './__ag__minix__.js'
import bc from './__ag__bc__.js'
import util from './util.js'
export default {
    mixins:[agMinix],
    props: {
        keyboard: {
            type:Boolean,
            default:false
        }
    },
    data(){
        return {
            isheight:'0px',
        }
    },
    computed() {

    },
    mounted() {

    },
    methods:{
         __ag__loadData__(){
            if (this.ipx && this.keyboard) {
                bc.onmessage('keyboardSize',this.keyboardSize) 
            }
        },
        keyboardSize(event){
            let height = util.keyboardHeight(event.data)
            if (height > 0) {
                this.isheight = '34px'
            }
        },
    },
}
</script>

<style>
    .__ag__keyboard__ {
        /* background-color: yellow; */
    }
</style>
