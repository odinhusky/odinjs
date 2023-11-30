<template>
    <!-- <scroller class="__ag__msg-list-item__" :show-scrollbar="false" scroll-direction="horizontal" @scrollend="scrollend"> -->
    <div class="__ag__msg-list-item__" ref="start" @swipe="handleSwipe" @touchstart="handleStart" @touchend="handleEnd" @touchmove="handleMove">
        <div class="list-item-swipe" @click.stop="__ag__onchat__(item)">
            <div class="list-item-left">
                <div class="list-item-user">
                    <user-img class="user-img" :avatar="item.avatar" :name="item.name" :isRadius="true" :fontSize="true"></user-img>
                </div>
            </div>
            <div class="list-item-right">
                <div class="list-item-content">
                    <text class="name-text">{{item.name}}</text>
                </div>
            </div>
        </div>
        <div class="swipe-item-list">
            <text class="swipe-item" v-for="(sw,index) in swipeList" :key="'swi-'+sw.id" :class="[sw.class]" @click="__ag__clickSwipe__(item,index)">{{sw.name}}</text>
        </div>
    </div>
    <!-- </scroller> -->
</template>
<script>
    import userImg from './__ag__userImg__.vue'
    import util from './util.js'
    const animation = weex.requireModule('animation')
    export default {
        props: {
            item: {
                type: Object,
                default: function() {
                    return {}
                }
            },
            el: {
                type: Object,
                default: function() {
                    return {}
                }
            }
        },
        components: {
            'user-img':userImg
        },
        data() {
            return {
                touchX: 0,
                touching: false,
                direction: '',
                swipeList: [
                    {
                        id: 1,
                        name: '删除',
                        class:'swipe-del'
                    },
                    {
                        id: 2,
                        name: '拉黑',
                        class:'swipe-bla'
                    }
                ]
            }
        },
        mounted() {
        },
        methods: {
            __ag__onchat__(item){
				let  uid =''
				if(item.type == 2){
					uid = item.groupId
				}
				if(item.type == 3){
					uid =  item.friendId
				}
				let params = {
					uid: uid +'',
					type:item.type+''
                    
				}
                if(item.type == 3){
                    params.friendId = item.id
                }
                this.$emit('change',{})
				util.getPush('__ag__chat__',params)
			},
            handleSwipe(e) {
                this.direction = e.direction
            },
            handleStart(e) {
                this.touching = true
                this.touchHandle(e);
            },
            handleMove(e) {
                if (!this.touching) {
                    return
                }
                this.touchHandle(e);
            },
            handleEnd(e) {
                if (!this.touching) {
                    return
                }
                this.touching = false
                this.changeSwipe()
            },
            touchHandle(e) {
                let pageX = 0
                if (Array.isArray(e.changedTouches)) {
                    e.changedTouches.forEach(item => {
                        pageX += item.pageX
                    });
                }
                this.touchX = pageX
            },
            changeSwipe() {
                let len = this.swipeList.length
                let el = this.$refs.start
                let touchM = 200 * len
                if (this.direction == 'left') {
                    let touchD = 750 - this.touchX
                    if (touchD > 100 * len) {
                        if (el){
                            animation.transition(el, {
                                styles: {
                                    transform: `translateX(${-touchM}px)`,
                                    transformOrigin: 'center center'
                                },
                                duration: 500, //ms
                                timingFunction: 'ease',
                                delay: 0 //ms
                            })
                            this.$emit('change',this.item)
                        }
                    }
                } else if (this.direction == 'right'){
                    if (this.touchX > 100) {
                        touchM = 0
                        if (el){
                            animation.transition(el, {
                                styles: {
                                    transform: `translateX(${touchM}px)`,
                                    transformOrigin: 'center center'
                                },
                                duration: 500, //ms
                                timingFunction: 'ease',
                                delay: 0 //ms
                            })
                        }
                        this.$emit('change',{})
                    }
                }
            },
            close() {
                let el = this.$refs.start
                let touchM = 0
                if (el){
                    animation.transition(el, {
                        styles: {
                            transform: `translateX(${touchM}px)`,
                            transformOrigin: 'center center'
                        },
                        duration: 500, //ms
                        timingFunction: 'ease',
                        delay: 0 //ms
                    })
                }
            },
            __ag__clickSwipe__(item,index) {
                this.$emit('clickSwipe',item,index)
            }
        }
    }
</script>
<style scoped>
    .__ag__msg-list-item__ {
        flex-direction: row;
        width: 750px;
        height:65wx;
        align-items: center;
    }
    .list-item-swipe {
        width: 750px;
        height:65wx ;
        padding-left: 16wx;
        padding-right: 16wx;
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    .list-item-left {
        position: relative;
        overflow: unset;
    }
    .list-item-user {
        width: 48wx;
        height: 48wx;
    }
    .user-img {
        width: 48wx;
        height: 48wx;
    }
    .list-item-right {
        flex: 1;
        height: 65wx;
        display: flex;
        flex-direction: row;
        margin-left: 12wx;
        padding-bottom: 16wx;
        border-bottom-style:solid;
        border-bottom-width: 1px;
        border-bottom-color: rgba(0, 0, 0, 0.1);
    }
    .list-item-content {
        height: 65wx;
        flex: 1;
        flex-direction: row;
        align-items: center;
    }
    .name-text {
        height: 20wx;
        line-height: 20wx;
        flex: 1;
        text-overflow: ellipsis;
        lines:1;
        font-size: 17wx;
        color: rgba(0, 0, 0, 0.9);
    }
    .swipe-item-list {
        height: 65wx;
        flex-direction: row;
    }
    .swipe-item {
        color: #fff;
        width: 200px;
        height: 65wx;
        line-height: 65wx;
        text-align: center;
    }
    .swipe-del {
        background-color: #FA5151;
    }
    .swipe-bla {
        background-color: #00CC6A;
    }
</style>