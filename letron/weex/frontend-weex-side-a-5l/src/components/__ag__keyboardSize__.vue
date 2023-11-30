<template>
    <div :style="{height:isheight}">
    </div>
</template>

<script>
import agMinix from './__ag__minix__.js'
import util from './util.js'
export default {
    mixins:[agMinix],
    data(){
        return {
            isheight:'0px',
        }
    },
    methods:{
        async __ag__loadData__(){
            // let that = this
            // const keyboardSize = new BroadcastChannel('keyboardSize')
            // keyboardSize.onmessage= function(event){
            //     that.isheight = event.data
            // }
            
        },
        keyboardSize(s){
            // util.message("asdad")
            this.isheight = s
        },
    },
}
</script>

<style>

</style>
