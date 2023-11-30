<template>
    <div class="__ag__comparison__">
        <ag-teamname :incomeLive="incomeLive" :tips="tips"></ag-teamname>
        <ag-comparisonitem v-for="(item,index) in recordList" :key="index" :item="item"></ag-comparisonitem>
    </div>
</template>
<script>
import comparisonitem from './__ag__comparisonitem__.vue'
import teamname from './__ag__teamName__.vue'
export default {
    components:{
        "ag-comparisonitem":comparisonitem,
        'ag-teamname':teamname,
    },
    props:{
        incomeLive: {
            type:Object,
            default:function(){
                return {}
            }
        },
        scheduleClass: {
            type: Number,
            default: undefined
        },
        awin:{
            type: Object,
            default: function(){
                return { win:0,ping6:0,win6:0,fu6:0,jq:0,
                sq:0,
                ping:0,
                fu:0,
                awin:0,
                bwin:0,
                afu:0,
                bfu:0,
                sl:0,}
            }
        },
        bwin:{
            type: Object,
            default: function(){
                return { win:0,ping:0,fu:0,ping6:0,win6:0,fu6:0,jq:0,
                sq:0,
                awin:0,
                bwin:0,
                afu:0,
                bfu:0,
                sl:0,}
            },
        },
	},
    data (){
        return {
            tips: 'VS',
        }
    },
    computed:{
			recordList(){
				let awin =this.awin
				let bwin =this.bwin
				if(this.scheduleClass == 4){
					return [{
						a:'-',
						b:'排名',
						c:'-'
					},{
						a:`${awin.win}胜${awin.fu}负`,
						b:'总战绩',
						c:`${bwin.win}胜${bwin.fu}负`
					},{
						a:`${awin.sl}`,
						b:'胜率',
						c:`${bwin.sl}`
					},{
						a:'-',
						b:'连续战绩',
						c:'-'
					},{
						a:`${awin.awin}胜${awin.afu}负`,
						b:'主场战绩',
						c:`${bwin.awin}胜${bwin.afu}负`
					},{
						a:`${awin.bfu}胜${awin.bwin}负`,
						b:'客场战绩',
						c:`${bwin.bfu}胜${bwin.bwin}负`
					}]
				}else if(this.scheduleClass == 5){
					return [{
						a:'-',
						b:'实力指数',
						c:'-'
					},{
						a:`${awin.win6}胜${awin.ping6}平${awin.fu6}负`,
						b:'近6场交锋',
						c:`${bwin.win6}胜${awin.ping6}平${bwin.fu6}负`
					},{
						a:`${awin.win}胜${awin.ping}平${awin.fu}负`,
						b:'近10场战绩',
						c:`${bwin.win}胜${awin.ping}平${bwin.fu}负`
					},{
						a:'-',
						b:'近10场同主客',
						c:'-'
					},{
						a:`${awin.jq}球`,
						b:'场均进球',
						c:`${bwin.jq}球`
					},{
						a:`${awin.sq}球`,
						b:'场均失球',
						c:`${bwin.sq}球`
					},{
						a:'-',
						b:'身价',
						c:'-'
					}]
				}
			}
		},
}
</script>
<style scoped>
    .__ag__comparison__ {
        flex: 1;
        width: 750px;
        background-color: #ffffff;
        display: flex;
        flex-direction: column;
    }
</style>