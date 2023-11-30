<template>
    <div class="__ag__lamp__">
        <text class="box-text" ref="turn">{{item.name}}</text>
    </div>
</template>
<script>
const animation = weex.requireModule('animation')
export default {
    props: {
        item: {
            type: Object,
            default: function() {
                return {}
            }
        }
    },
    data() {
        return {
            timer: null,
            time: 0
        };
    },
    mounted() {
        
        this.move()
    },
    destroyed() {
        clearInterval(this.timer)
    },

    methods: {
        move() {
            if (this.timer) {
                clearInterval(this.timer)
            }
            let el = this.$refs.turn;
            let translateX = ''
            let len = this.item.name.length * 8
            setTimeout(() => {
                if (el){
                    animation.transition(el, {
                        styles: {
                            transform: `translateX(-${len}px)`,
                            transformOrigin: 'center center'
                        },
                        duration: 1000, //ms
                        timingFunction: 'linear',
                        delay: 500 //ms
                    })
                }
            }, 100);
            
            this.timer = setInterval(() => {
                this.time ++
                if (this.time%2 == 0) {
                    translateX = `translateX(-${len}px)`
                } else {
                    translateX = 'translateX(10px)'
                }
                
                if (el){
					animation.transition(el, {
						styles: {
							transform: translateX,
							transformOrigin: 'center center'
						},
						duration: 1000, //ms
						timingFunction: 'linear',
						delay: 500 //ms
					})
				}
            }, 2000);
        },
    },
};
</script>
<style lang="less" scoped>
    .__ag__lamp__ {
        flex: 1;
        flex-direction: row;
        align-items: center;
    }
    .box-text {
        text-align: center;
        font-style: normal;
        font-weight: 500;
        font-size: 13wx;
        letter-spacing: 0.02em;
        color: #710E2E;
        line-height: 60px;
        transform: translateX(0px);
    }
</style>