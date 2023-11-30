<template>
    <div class="__ag__groups__" :class="[ipx ? '__ag__groups_ipx__' : '']">
        <div class="__ag__msgchattitle__">
            <ag-chattitle @onBackPress="onBackPress" :name="groupName"></ag-chattitle>
        </div>
        <scroller class="__ag__groups_content__" :show-scrollbar="false">
            <div class="__ag__groups_list__" v-if="groupUsersList && groupUsersList.length">
                <div class="__ag__groups_item__" v-for="item in groupUsersList" :key="item.id">
                    <div class="__ag__groups_i__">
                        <image class="__ag__i_img__" v-if="item.joinMap && item.joinMap.u && item.joinMap.u.avatar" :src="__ag__url__(item.joinMap && item.joinMap.u && item.joinMap.u.avatar)"></image>
                        <text v-else class="__ag__i_img__">{{item.joinMap && item.joinMap.u && item.joinMap.u.userNicename && item.joinMap.u.userNicename.charAt(0)}}</text>
                        <text class="__ag__i_text__">{{item.joinMap && item.joinMap.u && item.joinMap.u.userNicename}}</text>
                    </div>
                </div>
            </div>
        </scroller>
    </div>
</template>

<script>
import chattitle from './components/__ag__chatTitle__.vue'
import util from './components/util.js'
import agMinix from './components/__ag__minix__.js'
import agMinUrl from './components/__ag__minurl__.js'
export default {
    mixins:[agMinix,agMinUrl],
    components: {
        'ag-chattitle': chattitle,
    },
    data() {
        return {
            groupId: '',
            groupName:'',
            name: '',
            groupUsersList: []
        };
    },

    computed: {
    },

    mounted() {
        this.__ag__loadData__()
    },

    methods: {
        onBackPress() {
            util.pop()
        },
        __ag__loadData__() {
            let data =  util.getUrlParam(weex.config.bundleUrl)
            this.groupId = data.groupId
            
            this.getListGroupUsers()
        },
        async getListGroupUsers() {
            try {
                let datalist = await this.__ag__listGroup__({groupId: this.groupId})
                if(datalist.data && datalist.data.length>0){
                    let item = datalist.data[0]
                    let name = item.groupName || item.joinMap && item.joinMap.g && item.joinMap.g.name || '#' + item.groupId
                    let amount = item.joinMap && item.joinMap.g && item.joinMap.g.amount
                    this.groupName = name +'('+ amount +')'
                    this.name = name
                }
                let resp = await this.__ag__listGroupUser__({groupId: this.groupId})
                if (resp && resp.data && resp.data.length) {
                    this.groupUsersList = resp.data
                }
            } catch (error) {
                util.message(error.message)
            }
        },
        __ag__onGroups__() {

        }
    },
};
</script>
<style lang="less" scoped>
    @import "./style/theme.less";
    .__ag__groups__ {
        background-color: #EDEDED;
        width: 750px;
        position: fixed;
        top: 0px;
        bottom: 0;
        flex-direction: column;
        align-items: center;
        padding-top: 40px;
        padding-bottom: 20px;
    }
    .__ag__groups_ipx__ {
        padding-top: 60px;
        padding-bottom: 50px;
    }
    .__ag__msgchattitle__ {
        height: 90px;
        width: 750px;
        background-color: #ededed;
    }
    .__ag__groups_content__ {
        flex: 1;
    }
    .__ag__groups_list__ {
        width: 750px;
        padding: 16px;
        padding-right: 0px;
        padding-top: 30px;
        flex-direction: row;
        flex-wrap: wrap;
        background-color: #fff;
    }
    .__ag__groups_item__ {
        width: 130px;
        margin-right: 16px;
        margin-bottom: 30px;
    }
    .__ag__groups_i__ {
        flex: 1;
        align-items: center;
        justify-content: center;
    }
    .__ag__i_img__ {
        width: 110px;
        height: 110px;
        border-radius: 10px;
        font-size: 18wx;
        color: #000;
        text-align: center;
        line-height: 130px;
        background-color: #ededed;
    }
    .__ag__i_text__ {
        width: 110px;
        height: 35px;
        line-height: 35px;
        margin-top: 5px;
        text-align: center;
        color: rgba(0, 0, 0, 0.5);
        font-size: 13wx;
        lines:1;
        text-overflow: ellipsis;
    }
    .__ag__groups_bottom__ {
        width: 750px;
        height: 40px;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        padding-top: 20px;
        padding-bottom: 20px;
    }
    .__ag__bottom_text__ {
        font-size: 13wx;
        color: rgba(0, 0, 0, 0.6);
    }
    .__ag__groups_name__ {
        width: 750px;
        background-color: #fff;
        margin-top: 20px;
        padding: 15px;
        padding-left: 30px;
        padding-right: 30px;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        
    }
    .__ag__groups_name_text__ {
        line-height: 60px;
        font-size: 15wx;
        color: rgba(0, 0, 0, 0.5);
    }
</style>