<template>
    <div class="__controls-main__" :style="videoStyle" @click.stop="">
        <div class="__controls-content__" :class="[isFullscreen?'full_content':'']">
            <div class="__controls-lf__">
                <!-- <text class="__ag__lf_text__" v-if="info && info.joinMap && info.joinMap.cls && info.joinMap.cls.name">{{info.joinMap.cls.name}}</text> -->
                <div class="__controls-direct__" >
                   <!-- <text class="__ag__match_item__" v-if="info">{{info.teamNamea}}vs{{info.teamNameb}}</text> -->
                </div>
            </div>
            <div class="__controls-rg__">
                <text class="iconfont __control-full__" v-if="isFullscreen" @click="clickFullscreen(0)">&#xe63f;</text>
                <text class="iconfont __control-full__" v-else @click="clickFullscreen(1)">&#xe63e;</text>

            </div>
        </div>
    </div>
</template>
<script>
import minurl from './__ag__minurl__.js'
import util from './util.js'
import module from './__ag__module__.js'
export default {
    mixins:[minurl],
    props: {
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
        info: {
            type: Object,
            default: function() {
                return {}
            }
        },
    },
    data() {
        return {
            isRefresh: false,
            tabtime: 0,
            keyboardSize: '0px',
            content: ''
        }
    },
    computed: {
        isFullscreen() {
            return this.isFull
		},
        videoStyle() {
            let style ={}
            if(this.isFull){
                style.height = "40wx"
                style.width = this.fullDevice.height.toFixed(2) + "px"
            } else {
                style.height = "40wx"
                style.width = "750px"
            }
            
            return style
        },
    },
    mounted() {
        
    },
    methods: {
        // 全屏、竖屏
        clickFullscreen(f) {
            this.$emit('full',f)
            util.setLandscape(f)
        },
    }
}
</script>
<style scoped>
 .iconfont {
    font-family: iconfont ;
    font-size: 16px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -webkit-text-stroke-width: 0.2px;
    -moz-osx-font-smoothing: grayscale;
}
.__controls-main__ {
    width: 750px;
    height: 40wx;
    position: absolute;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    transform: translateY(0px);
}
.full_content {
    padding-left: 30wx;
    padding-right: 30wx;
}
.__controls-content__ {
    flex: 1;
    padding-left: 20px;
    padding-right: 20px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}
.__controls-lf__ {
    flex: 1;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
}
.__ag__lf_text__ {
    width: 40wx;
    height: 15wx;
    background-image: linear-gradient(right, #4D139A, #6E0FAB);
    border-radius: 15px;
    font-size: 10wx;
    color: #FFFFFF;
    line-height: 15wx;
    text-align: center;
}
.__controls-direct__ {
    display: flex;
    flex-direction: row;
    align-items: center;
}
.__ag__match_item__ {
    color: #fff;
    margin-left: 15wx;
    font-style: normal;
    font-weight: 400;
    font-size: 14wx;
    letter-spacing: 0.02em;
}
.__line__ {
    width: 10wx;
    height: 10wx;
    border-radius: 50px;
    background-color: #FF3551;
    margin-right: 5px;
}
.__line-status__ {
    height: 40wx;
    width: 40wx;
    text-align: center;
    line-height: 40wx;
    color: #fff;
    font-size: 22wx;
}
.__line-refresh__ {
    height: 40wx;
    width: 40wx;
    text-align: center;
    line-height: 40wx;
    color: #fff;
    font-size: 18wx;
}
.__controls-rg__ {
    flex: 1;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
}
.__controls_danmu__ {
    width: 35wx;
    height: 40wx;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-right: 3wx;
    margin-left: 8wx;
}
.__danmu_text__ {
    width: 25wx;
    height: 25wx;
    background-color: #07C160;
    border-radius: 50wx;
    font-style: normal;
    font-weight: 400;
    font-size: 10wx;
    color: #FFFFFF;
    text-align: center;
    line-height: 25wx;
}
.__danmu_select__ {
    background-color: #07C160;
    color: #FFFFFF;
}
.__danmu_select_not__ {
    background-color: #ACACAC;
    color: #FFFFFF;
}
.__controls-limpid__ {
    height: 20wx;
    width: 35wx;
    border-radius: 8wx;
    border-style: solid;
    border-width: 1wx;
    border-color: #FFFFFF;
    margin-right: 8wx;
    margin-left: 8wx;
}
.__control-limpid-text__ {
    color: #fff;
    height: 18wx;
    width: 33wx;
    font-weight: 400;
    font-size: 10wx;
    text-align: center;
    line-height: 18wx;
}
.video-mutes,.__control-full__ {
    font-size: 25wx;
    color: #fff;
    font-weight: bold;
    height: 40wx;
    width: 40wx;
    text-align: center;
    line-height: 40wx;
}
.__controls_input__ {
    width: 200wx;
    height: 40wx;
    background-color: #252525;
    opacity: 0.6;
    border-style: solid;
    border-width: 1wx;
    border-color: #FFFFFF;
    box-sizing: border-box;
    border-radius: 4px;
    padding-left: 15px;
    margin-left: 16wx;
    color: #fff;
}
.__rg__share_item__ {
    width: 40wx;
    height: 40wx;
    justify-content: center;
    align-items: center;
}
.__rg__share_images__ {
    width: 35px;
    height: 35px;
}

</style>