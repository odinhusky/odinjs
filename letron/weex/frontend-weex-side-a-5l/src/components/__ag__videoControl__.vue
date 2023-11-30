<template>
	<div class="__ag__video-control__">
		<div v-show="isMute" @click.stop="notMute" class="__ag__video-mute__">
			<div class="__ag__text__">取消靜音模式</div>
			<div class="__ag__triangle__"></div>
		</div>
		<div class="__ag__video-content__" :style="{display: isDisplay}">
			<div class="__ag__video-start__" :class="{'__ag__video-start-mantle__': isDisplay}">
				<span v-if="isPlays" @click="clickPause" class="iconfont icon-pause __ag__play-icon__"></span>
				<span v-else @click="clickStart" class="iconfont icon-play __ag__pause-icon__"></span>
			</div>
			<div class="__ag__video-bar__">
				<div class="__ag__bar-lf__">
					<div class="__ag__lf-line__"></div>
					<span>{{qualityText}}直播中</span>
					<div class="__ag__danmu-item__" v-if="openDanmu">
						<span v-if="isDanmu" @click.stop="clickDanmu" class="iconfont icon-chat-open __ag__danmu-icon__"></span>
						<span v-else @click.stop="clickDanmu" class="iconfont icon-chat-close __ag__danmu-icon__"></span>
						<span style="font-size: 13px;">弹幕</span>
					</div>
				</div>
				<div class="__ag__bar-rg__">
					<span v-if="!isMute" @click.stop="clickMute" class="iconfont icon-mute1 __ag__video-mutes__"></span>
					<span v-else @click.stop="clickMute" class="iconfont icon-mute2 __ag__video-mutes__"></span>
					<div class="__ag__video-hd__" @click.stop="clickQuality"><span>{{qualityText}}</span></div>
					<span v-if="!isFullscreens" @click.stop="clickFullscreen" class="iconfont icon-fullscreen1 __ag__video-fullscreen__"></span>
					<span v-else @click.stop="exitFullscreen" class="iconfont icon-fullscreen-exit __ag__video-fullscreen__"></span>
				</div>
			</div>
		</div>
	</div>
</template>

<!-- 
	openDanmu 打开关闭弹幕
	isPlay 播放暂停
	isHideBar 打开关闭控制栏
	isFullscreen 打开关闭全屏
 -->
<script>
	export default {
		props: {
			openDanmu: {
				type: Boolean,
				default: false
			},
			isPlay: {
				type: Boolean,
				default: true
			},
			isHideBar: {
				type: Boolean,
				default: false
			},
			isFullscreen: {
				type: Boolean,
				default: false
			},
            isMutes: {
				type: Boolean,
				default: false
			},
		},
		data() {
			return {
				qualityText: '标清',
				checked: false,
				isDanmu: false
			}
		},
		watch: {
			
		},
		computed: {
			isPlays() {
				return this.isPlay
			},
			isDisplay() {
				let d = this.isHideBar ? 'none' : 'block'
				return d
			},
			isMute() {
				return this.isMutes
			},
			isFullscreens() {
				return this.isFullscreen
			},
		},
		destroyed() {
			
		},
		mounted() {
			
		},
		methods: {
			// 播放
			clickStart(e) {
				this.$emit('play',e)
			},
			// 暂停
			clickPause(e) {
				this.$emit('pause',e)
			},
			// 弹幕
			clickDanmu() {
				this.$emit('danmu')
			},
			// 声音
			clickMute() {
				this.$emit('mute',this.isMute)
			},
			// 标清
			clickQuality() {
				this.$emit('quality')
			},
			// 全屏
			clickFullscreen() {
				this.$emit('fullscreen')
			},
			// 取消全屏
			exitFullscreen() {
				this.$emit('exitFullscreen')
			},
			// 取消静音
			notMute() {
				this.$emit('mute',true)
			},
		}
	}
</script>

<style lang="less" scoped>
.__ag__video-control__{
    flex-direction: row;
    position: unset;
}
	.__ag__video-start__ {
		width: 100%;
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		margin: auto;
		z-index: 9999;
		display: flex;
		justify-content: center;
		align-items: center;
        flex-direction: row;
	}
	.__ag__video-start-mantle__ {
		background-color: rgba(0,0,0,.2);
	}
	.__ag__video-start__ .__ag__play-icon__ {
		font-size: 30px;
		color: #fff;
	}
	.__ag__pause-icon__ {
		font-size: 40px;
		color: #fff;
	}
    .__ag__video-content__ {
        width: 750px;
        flex-direction: row;
        position: unset;
    }
	.__ag__video-bar__ {
		width: 100%;
		height: 35px;
		background-color: rgba(0,0,0,.5);
		position: absolute;
		bottom: 0;
		right: 0;
		display: flex;
		align-items: center;
		z-index: 0;
		transform: translateZ(0);
		color: #fff;
		z-index: 9999;
        flex-direction: row;
	}
	.__ag__video-bar__ .__ag__bar-lf__ {
		flex: .4;
		display: flex;
		color: #fff;
		align-items: center;
		padding-left: 10px;
        flex-direction: row;
	}
	.__ag__bar-lf__ .__ag__lf-line__ {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background-color: #e60012;
		margin-right: 5px;
	}
    .__ag__bar-lf__ span {
        color: #fff;
         font-size: 13px;
    }
	.__ag__bar-rg__ {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		flex: .6;
		padding-right: 10px;
		position: relative;
        flex-direction: row;
	}
	.__ag__bar-rg__ .__ag__video-mutes__ {
		font-size: 22px;
		margin-right: 15px;
        color: #fff;
	}
	.__ag__bar-rg__ .__ag__video-fullscreen__ {
		font-size: 23px;
        color: #fff;
	}
	.__ag__bar-rg__ .__ag__video-hd__ {
		height: 18px;
		line-height: 20px;
		padding: 0px 2px;
		background-color: #fff;
		border-radius: 2px;
		margin-right: 15px;
        flex-direction: row;
        align-items: center;
	}
    .__ag__video-hd__ span{
        color: #000000;
        font-size: 12px;
    }
	.__ag__danmu-item__ {
		margin-left: 15px;
		display: flex;
		align-items: center;
        flex-direction: row;
	}
	.__ag__danmu-item__ .__ag__danmu-icon__ {
		font-size: 23px;
		margin-right: 5px;
	}
    .__ag__video-mute__{
	
        position: absolute;
        bottom: 35px;
        right: 55px;
        z-index: 99999;
        
        cursor: pointer;
    }
    .__ag__video-mute__ .__ag__text__ {
        font-size: 13px;
        background-color: rgba(255,106,51,0.8);
        border: 1px solid #ff6633;
        padding: 3px;
        border-radius: 5px;
        color: #fff;
    }

    .__ag__video-mute__ .__ag__triangle__ {
        width: 0px;                 /*  宽高设置为0，很重要，否则达不到效果 */
        height: 0px;
        border: 5px solid #ff6633;
        border-bottom-color: transparent;    /* 设置透明背景色 */
        border-left-color: transparent;
        border-right-color: transparent;
        margin: auto;
    }
    .is-mute {
        opacity: 0;
        transform: translateY(100%);
    }
    .video-mute-box {
        height: 41px;
        display: flex;
        align-items: center;
        flex-direction: row;
    }
</style>
