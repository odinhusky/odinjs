<template>
    <div class="__ag__comparisonitem__">
        <text class="__ag__comparisonitemtext__">{{item.a}}</text>
        <text class="__ag__comparisonitemcontent__">{{item.b}}</text>
        <text class="__ag__comparisonitemtext__ __ag__comparisonitemtextb__">{{item.c}}</text>
    </div>
</template>
<script>
export default {
    props: {
        item: {
            type:Object,
            default:function() {
                return {}
            }
        }
	},
    data(){
        return {

        }
    }
}
</script>
<style lang="less" scoped>
    .__ag__comparisonitem__ { 
        flex: 1;
        height: 86px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding-left: 32px;
        padding-right: 32px;
        border-bottom-color: #f2f3f4;
        border-bottom-style: solid;
        border-bottom-width: 1wx;
    }
    .__ag__comparisonitemtext__ {
        flex: 1;
        font-style: normal;
        font-weight: 400;
        font-size: 13wx;
        color: #000000;
        display: flex;
        flex: content;
        align-items: center;
        justify-content: flex-start;
    }
    .__ag__comparisonitemtextb__ {
        justify-content: flex-end;
        text-align: right;
    }
    .__ag__comparisonitemcontent__ {
        max-width: 160px;
        text-align: center;
        font-style: normal;
        font-weight: 600;
        font-size: 13wx;
        color: #8C97A5;
        margin-left: 16px;
        margin-right: 16px;
    }
</style>