<template>
    <div class="__ag__lineupbestgame__">
        <text class="__ag__bestgamename__">{{item.namea}}</text>
        <text class="__ag__bestgamescore__">{{item.scroea}}</text>
        <text class="__ag__bestgametext__">{{item.textType}}</text>
        <text class="__ag__bestgamescore__">{{item.scroeb}}</text>
        <text class="__ag__bestgamename__ __ag__right__">{{item.nameb}}</text>
    </div>
</template>
<script>
export default {
    props:{
        item:{
            type:Object,
            default:function(){
                return {}
            }
        }
    },
    data() {
        return {

        }
    },
}
</script>
<style lang="less" scoped>
    .__ag__lineupbestgame__ {
        width: 686px;
        height: 72px;
        margin-left: 32px;
        margin-right: 32px;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        border-bottom-style: solid;
        border-bottom-width: 1wx;
        border-bottom-color: #F2F3F4;
    }
    .__ag__bestgamename__ {
        flex: 1;
        lines:1;
        text-overflow: ellipsis;
        font-style: normal;
        font-weight: 400;
        font-size: 13wx;
        color: #000000;
        text-align: left;
        
    }
    .__ag__right__ {
        text-align: right;
    }
    .__ag__bestgamescore__ {
        flex: .4;
        lines:1;
        text-overflow: ellipsis;
        font-style: normal;
        font-weight: 400;
        font-size: 13wx;
        color: #000000;
    }
    .__ag__bestgametext__ {
        flex: .4;
        lines:1;
        text-overflow: ellipsis;
        font-style: normal;
        font-weight: 400;
        font-size: 13wx;
        color: #8C97A5;
    }
</style>