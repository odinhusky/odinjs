<template>
    <div class="__ag__teamrecord__" v-if="isTeamName">
        <div class="__ag__teamredleft__">
            <!-- <ag-userimg class="__ag__teamredimg__" :avatar="image" :name="teamName" :islive="true"></ag-userimg> -->
            <team-logo :teamType="teamType" :teamFlag="image" :teamName="teamName" class="__ag__team__"></team-logo>
            <text class="__ag__teamredtext__">{{teamName}}</text>
        </div>
        <div class="__ag__teamredrigth__" v-if="isDefeat">
            <div class="__ag__teamredrigthyuan__ __ag__sheng__"></div>
            <text class="__ag__teamredtext__">{{win.win}}胜</text>
            <div class="__ag__teamredrigthyuan__"></div>
            <text class="__ag__teamredtext__">{{win.ping}}平</text>
            <div class="__ag__teamredrigthyuan__ __ag__fu__"></div>
            <text class="__ag__teamredtext__">{{win.fu}}负</text>

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
            'ag-userimg':userimg,
            'team-logo':teamLogo
        },
        props: {
			isDefeat : {
				type: Boolean,
				default: false
			},
			teamName : {
				type: String,
				default: ''
			},
			image: {
				type: String,
				default: ''
			},
			isTeamName : {
				type: Boolean,
				default: false
			},
			win:{
				type: Object,
				default: function(){
					return {win:0,
					ping:0,
					fu:0,
					awin:0,
					bwin:0,
					afu:0,
					bfu:0,
					sl:0,
					ping6:0,
					win6:0,
					fu6:0,
					jq:0,
					sq:0}
				}
			},
            teamType: {
                type: Number,
                default: 1
            }
		},
        data(){
            return {
                url:'2022/0225/be5a0a5feaa04678b9d97c0166925035.png',
            }
        }
    }
</script>
<style lang="less" scoped>
    .__ag__teamrecord__ {
        height: 80px;
        width: 750px;
        padding-right: 32px;
        padding-left: 32px;
        background-color: #F2F3F4;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
    .__ag__teamredleft__ {
        flex: 1;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
    }
    .__ag__teamredimg__ {
        width: 44px;
        height: 44px;
        margin-right: 20px;
    }
    .__ag__team__ {
        margin-right: 20px;
    }
    .__ag__teamredtext__ {
        font-style: normal;
        font-weight: 600;
        font-size: 14wx;
        color: #000000;
        margin-right: 20px;
    }
    .__ag__teamredrigth__ {
        flex: 1;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
    }
    .__ag__teamredrigthyuan__ {
        width: 24px;
        height: 24px;
        border-radius: 8px;
        background-color: #8C97A5;
        margin-right: 8px ;
    }
    .__ag__sheng__ {
        background-color: #07C160;
    }
    .__ag__fu__ {
        background-color: #5B5B5B;
    }
</style>