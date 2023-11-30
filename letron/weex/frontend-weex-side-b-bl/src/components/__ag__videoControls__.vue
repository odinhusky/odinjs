<template>
    <div class="__controls-main__" :style="videoStyle" @click.stop="">
        <div class="__controls-content__" :class="[isFullscreen?'full_content':'']">
            <div class="__controls-lf__">
                <div class="__controls-direct__"  v-if="!isFull">
                    <!-- <div class="__line__"></div> -->
                    <!-- <text class="__line-status__">直播中</text> -->
                    <text class="agiconfont __line-status__" v-if="isPlay" @click.stop="clickPause">&#xe646;</text>
                    <text class="agiconfont __line-status__" v-if="!isPlay && state != 'fail'" @click.stop="clickStart">&#xe66c;</text>
                    <text class="agiconfont __line-refresh__" ref="__video_refresh__" @click="clickRefresh">&#xe631;</text>
                </div>
                <div class="__controls-direct__"  v-if="isFull && ivx">
                    <text class="agiconfont __line-status__" v-if="isPlay" @click.stop="clickPause">&#xe646;</text>
                    <text class="agiconfont __line-status__" v-if="!isPlay && state != 'fail'" @click.stop="clickStart">&#xe66c;</text>
                    <text class="agiconfont __line-refresh__" ref="__video_refresh__" @click="clickRefresh">&#xe631;</text>
                </div>
                <div class="__controls-direct__" v-if="isFull && !ivx">
                    <text class="agiconfont __line-status__" v-if="isDanmus" @click.stop="isDanmus = false">&#xe69b;</text>
                    <text class="agiconfont __line-status__" v-else @click.stop="isDanmus = true">&#xe69a;</text>
                    <input ref="inputref" class="__controls_input__"
                    v-if="isDanmus"
                    :style="keyboardInput" 
                    placeholder="说点什么吧" v-model="content"
                    return-key-type="send" :hideDoneButton="true"
					@confirm="__ag__send__"
                    @return="__ag__send__"
                    @keyboard="keyboard"
                    />
                </div>
            </div>
            <div class="__controls-rg__">
                <div class="__controls-direct__" v-if="isFull && !ivx">
                    <text class="agiconfont __line-status__" v-if="isPlay" @click.stop="clickPause">&#xe646;</text>
                    <text class="agiconfont __line-status__" v-if="!isPlay && state != 'fail'" @click.stop="clickStart">&#xe66c;</text>
                    <text class="agiconfont __line-refresh__" ref="__video_refresh__" @click="clickRefresh">&#xe631;</text>
                </div>
                <!-- <div v-if="isVolume">
                    <text class="agiconfont video-mutes" v-if="!isMutes" @click.stop="__ag_changeMute__(0)">&#xe6e7;</text>
				    <text class="agiconfont video-mutes" v-else @click.stop="__ag_changeMute__(0.7)">&#xe6e9;</text>
                </div> -->
                <div class="__ag__dan_mu__" v-if="showDanmu">
                     <image class="__ag__danmu_image__" v-if="isDanmu" :src="__ag__url__(danmuImg)" mode="aspectFit" @click.stop="__ag_changeDanmu__('0')"></image>
                    <image class="__ag__danmu_image__" v-else :src="__ag__url__('static/danmu-2.png')" mode="aspectFit" @click.stop="__ag_changeDanmu__('1')"></image>
                </div>
                <div class="__controls-limpid__" @click.stop="__ag__changeLimpid__"><text class="__control-limpid-text__" ref="__limpid__">{{isLimpids}}</text></div>
                <text class="agiconfont __control-full__" v-if="!isFullscreen" @click.stop="clickFullscreen('1')">&#xe63e;</text>
                <text class="agiconfont __control-full__" v-else @click.stop="clickFullscreen('0')">&#xe63f;</text>
            </div>
        </div>
    </div>
</template>
<script>
const animation = weex.requireModule('animation')
import util from './util.js'
import bc from './__ag__bc__.js'
import agMinUrl from './__ag__minurl__.js'
import agMinix from './__ag__minix__.js'
export default {
    mixins: [agMinUrl,agMinix],
    props: {
        isPlay: {
            type: Boolean,
            default: true
        },
        isHideBar: {
            type: Boolean,
            default: false
        },
        isFull: {
            type: Boolean,
            default: false
        },
        isMute: {
            type: Boolean,
            default: false
        },
        isLimpid: {
            type: Boolean,
            default: false
        },
        fullDevice: {
            type: Object,
            default: function() {
                return {width:0,height:0,}
            }
        },
        isVolume: {
            type: Boolean,
            default: false
        },
        isDanmu: {
            type: Boolean,
            default: false
        },
        showDanmu: {
            type:Boolean,
            default: true
        },
        state: {
            type: String,
            default: 'start'
        }
    },
    data() {
        return {
            isRefresh: false,
            tabtime: 0,
            keyboardSize: '0px',
            content: '',
            isDanmus: true
        }
    },
    computed: {
        isPlays() {
			return this.isPlay
        },
        isLimpids() {
            let d = this.isLimpid ? '高清' : '标清'
            return d
        },
        isMutes() {
            return this.isMute
        },
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
        keyboardInput() {
            let style ={}
           
            if(this.isFull && this.keyboardSize != '0px'){
                style.position = 'absolute'
                style.bottom = this.keyboardSize
                style.left = '40wx'
            }

            return style
        },
        danmuImg() {
            if(this.env.brand == 'bl') {
                return 'static/danmu-bl.png'
            }
            return 'static/danmu-1.png'
        }
    },
    mounted() {
        this.__ag__loadData__()
    },
    methods: {
        __ag__loadData__() {
            bc.onmessage('clearInput',this.clearInput)
        },
        // 播放
        clickStart() {
            this.$emit('play')
        },
        // 暂停
        clickPause() {
            this.$emit('pause')
        },
        // 刷新
        clickRefresh() {
            let time =  new Date().getTime()
            let el = this.$refs.__video_refresh__
            if(this.tabtime + 3000 < time){
                this.tabtime = time
                this.isRefresh = true
                if (this.isRefresh) {
                    if (el) {
                        animation.transition(el, {
                            styles: {
                                transform: `rotate(720deg)`,
                                transformOrigin: 'center center'
                            },
                            duration: 500, //ms
                            timingFunction: 'ease',
                            delay: 0 //ms
                        })
                    }
                }
                this.$emit('refresh')
            }
            setTimeout(()=> {
                this.isRefresh = false
                if (el) {
                    animation.transition(el, {
                        styles: {
                            transform: `rotate(0deg)`,
                            transformOrigin: 'center center'
                        },
                        duration: 0, //ms
                        timingFunction: 'ease',
                        delay: 0 //ms
                    })
                }
            },3000)
        },
        // 全屏、竖屏
        clickFullscreen(f) {
            this.$emit('full',f)
            if (!this.ivx) {
                util.setLandscape(f)
            }
            this.keyboardSize ='0px'
            this.$emit('changeKeyboard',this.keyboardSize)
        },
        // 打开、关闭弹幕
        clickDanmu() {

        },
        // 音量
        __ag_changeMute__(m) {
            this.$emit('muted',m)
            util.setVolume(m)
        },
        // 清晰度切换
        __ag__changeLimpid__() {
            this.$emit('limpid',this.isLimpid)
        },
        // 开启、关闭弹幕
        __ag_changeDanmu__(t) {
            let danmu = t == 1 ? true : false
            bc.postMessage('changeDanmu',danmu)
            this.$emit('danmu')
        },
        // 隐藏键盘
        hideKeyboard() {
            let ipts = this.$refs['inputref']
            if (ipts && this.keyboardSize != '0px') {
                ipts.blur()
            }
        },
        // 计算键盘高度
        keyboard(event){
            let keySize = util.keyboardHeight(event) 
            
            if(keySize>0){
                if(this.ipx){
                    keySize = util.keyboardHeight(event) * 1
                }else {
                    keySize = util.keyboardHeight(event) * 1  + 40
                }
            }else {
                keySize = '0'
            }
            this.keyboardSize = keySize+ 'px'
            this.$emit('changeKeyboard',this.keyboardSize)
        },
        __ag__send__() {
            bc.postMessage('sendMessage',this.content)
        },
        clearInput() {
            this.content = ''
        }
    }
}
</script>
<style scoped lang="less">
    @import "../style/theme.less";
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
}
.__controls-direct__ {
    display: flex;
    flex-direction: row;
    align-items: center;
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
.__ag__dan_mu__ {
    width: 55px;
    height: 55px;
    border-radius: 50wx;
    align-items: center;
    justify-content: center;
    margin-right: 8wx;
}
.__ag__danmu_image__ {
    width: 55px;
    height: 55px;
    margin-bottom: 2px;
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

</style>