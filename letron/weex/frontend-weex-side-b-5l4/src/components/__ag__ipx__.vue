<template>
    <div :style="style" class="__ag__ipx__">
    </div>
</template>

<script>
    export default {
        props:{
            bg:{
                type:String,
                default:'#000000',
            },
            image: {
                type:String,
                default:'',
            }
        },
        computed:{
            ipx(){
                let deviceModel  = weex.config.env.deviceModel
                if(deviceModel>='iPhone10,6'){
                    if(deviceModel=='iPhone12,8'){
                        return false
                    }
                    return true
                }
                if(deviceModel=='iPhone10,3'){
                    return true
                }
                
                return false
            },
            style(){
                let sy = {}
                if(this.ipx){
                        sy.height = '44wx'
                        
                    // return `background-color: ${this.bg}; height: 35wx;`
                }else {
                     sy.height = '20wx'
                    // return `background-color: ${this.bg}; height:20wx;`
                }
                sy.backgroundColor = this.bg
                if (this.image) {
                    sy.backgroundImage = this.image
                }
                return sy
            }
        },
    }
</script>

<style>
    .__ag__ipx__ {
        width: 750px;
    }
</style>
