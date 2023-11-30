<template>
    <div class="__ag__modal__" @click="$emit('close')" v-if="isModals" :style="videoStyle">
        <div class="__ag__modal_content__">
            <text class="iconfont success" v-if="type == 'success'">&#xe682;</text>
            <text class="iconfont error" v-if="type == 'error'">&#xe664; </text>
            <text class="iconfont fail" v-if="type == 'fail'">&#xe69f; </text>
            <text class="__modal_text__">{{modalText}}</text>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        modalText: {
            type: String,
            default: ''
        },
        type: {
            type: String,
            default: 'success'
        },
        isModal: {
            type: Boolean,
            default: false
        },
        isFull: {
            type: Boolean,
            default: false
        },
        fullDevice: {
            type: Object,
            default: function() {
                return {width:0,height:0,}
            }
        },
    },
    data() {
        return {
            isModals: false
        }
    },
    watch: {
       isModal(n) {
           this.isModals = n
           if (n) {
               setTimeout(()=> {
                   this.isModals = false
                   this.$emit('close')
               },1000)
           }
       } 
    },
    computed: {
        videoStyle() {
            let style ={}
            if(this.isFull){
                style.height = "750px"
                style.width = this.fullDevice.height.toFixed(2) + "px"
            } else {
                style.width = "750px"
            }
            return style
        }
    },
    mounted() {
        this.isModals = this.isModal
    }
}
</script>
<style scoped>
    .iconfont {
        font-family:iconfont;
		 font-size: 16wx;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-webkit-text-stroke-width: 0.2px;
		-moz-osx-font-smoothing: grayscale;
    }
    .__ag__modal__ {
        width: 750px;
        position: fixed;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        align-items: center;
        justify-content: center;
    }
    .__ag__modal_content__ {
        width: 218wx;
        height: 36wx;
        background-color: #4C4C4C;
        border-radius: 8wx;
        flex-direction: row;
        align-items: center;
        padding-left: 10wx;
        padding-right: 10wx;
    }
    .success {
        color: #07C160;
    }
    .error {
        color: #f56c6c;
    }
    .fail {
        color: #e6a23c;
    }
    .__modal_text__ {
        color: #fff;
        margin-left: 5wx;
        font-size: 12wx;
    }
</style>