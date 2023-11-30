<template>
    <div class="__ag__team__" v-if="incomeLive && incomeLive.id">
        <div class="__ag__teamitem__">
            <!-- <ag-userimg class="__ag__teamitemimg__" :avatar="incomeLive && incomeLive.teamFlaga" :islive="true" :name="incomeLive && incomeLive.teamNamea"></ag-userimg> -->
            <team-logo teamType="1" :teamFlag="incomeLive.teamFlaga" :teamName="incomeLive.teamNamea"></team-logo>
            <text class="__ag__teamitemtext__">{{incomeLive && incomeLive.teamNamea}}</text>
        </div>
        <text class="__ag__teamvs__">{{tips}}</text>
        <div class="__ag__teamitem__">
            <text class="__ag__teamitemtext__ __ag__teamitemtextb__">{{incomeLive && incomeLive.teamNameb}}</text>
            <!-- <ag-userimg class="__ag__teamitemimg__" :avatar="incomeLive && incomeLive.teamFlagb" :islive="true" :name="incomeLive && incomeLive.teamNameb"></ag-userimg> -->
            <team-logo teamType="2" :teamFlag="incomeLive.teamFlagb" :teamName="incomeLive.teamNameb"></team-logo>
        </div>
    </div>
</template>
<script>
	import agMinUrl from './__ag__minurl__.js'
	import userimg from './__ag__userImg__.vue'
    import teamLogo from './__ag__teamLogo__.vue'
    export default {
        mixins:[agMinUrl],
        components:{
            "ag-userimg":userimg,
            'team-logo':teamLogo
        },
        props: {
			tips: {
				type: String,
				default:'VS'
			},
			incomeLive: {
				type: Object,
				default:function(){
					return {}
				}
			},
		},
        data(){
            return {
                url:'2022/0225/be5a0a5feaa04678b9d97c0166925035.png',
            }
        }
    }
</script>
<style scoped>
    .__ag__team__ {
        width: 750px;
        height: 80px;
        background-color: #F2F3F4;
        display: flex;
        flex-direction: row;
        align-content: center;
        justify-content: space-between;
        padding-left: 32px;
        padding-right: 32px;
    }
    .__ag__teamitem__ {
        flex: 1;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
    }
    .__ag__teamitemimg__ {
        width: 44px;
        height: 44px;
    }
    .__ag__teamitemtext__ {
        flex: 1;
        lines:1;
        text-overflow: ellipsis;
        font-style: normal;
        font-weight: 600;
        font-size: 14wx;
        color: #000000;
        margin-right: 18px;
        margin-left: 18px;
    }
    .__ag__teamvs__ {
        max-width: 160px;
        height: 80px;
        text-align: center;
        line-height: 80px;
        font-style: normal;
        font-weight: 600;
        font-size: 14wx;
        color: #8C97A5;
    }
    .__ag__teamitemtextb__ {
        text-align: right;
    }
</style>
