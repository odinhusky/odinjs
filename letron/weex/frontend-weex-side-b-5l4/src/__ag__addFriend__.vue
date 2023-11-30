<template>
    <div class="__addFriend-main__" :class="[ipx?'recom-ipx':'']">
        <ag-hbtitle :isback="true" title="新增好友"></ag-hbtitle>
        <div class="__addFriend-content__" @click="__ag__clickLive__">
            <div class="__ag__msg-search__">
                <input class="__ag__msg-search-input__" type="text" :hideDoneButton="true" placeholder="用户名称" ref="inputref" v-model="searchVal" return-key-type="search" @return="returnEnter" @focus="__ag__focus__" @blur="__ag__blur__" @keyboard="keyboard">
                <text class="search-text" v-if="isSearch" @click="__ag__cancel__">取消</text>
            </div>
            <div class="empty" v-if="isUsers">
				<text class="empty-text">该用户不存在</text>
			</div>
        </div>
    </div>
</template>
<script>
import agMinix from './components/__ag__minix__.js'
import hbtitle from './components/__ag__headTop__.vue'
import util  from './components/util.js'
import bc  from './components/__ag__bc__.js'
export default {
    mixins:[agMinix],
    components: {
        'ag-hbtitle': hbtitle,
    },
    data() {
        return {
            searchVal: '',
            isSearch: false,
            isUsers: false
        }
    },
    destroyed() {
       bc.postMessage('afreshData')
    },
    methods: {
         __ag__focus__() {
            this.isSearch = true
        },
        __ag__blur__() {
            this.isSearch = false
        },
        __ag__clickLive__() {
            let ipt = this.$refs.inputref
            if (ipt) {
                ipt.blur()
            }
        },
        keyboard() {

        },
        __ag__cancel__() {
            this.searchVal = ''
        },
        async returnEnter(e) {
            if (e.returnKeyType != 'done') {
                await this.__addFriend__()
            }
        },
        async __addFriend__() {
            if(!this.searchVal){
                util.message("请输入手机号码/用户名称")
                return
            }
            let f = {
                search:this.searchVal,
                isFriend:0
            }
            try {
                let resp = await this.__ag__getUsers__(f)
                if (resp && resp.success) {
                    if(resp.data.list.length == 0){
                        this.isUsers=true
                    }else if(resp.data.list.length==1){
                        this.isUsers = false
                        let list = resp.data.list
                        let id =  list[0].id
                        util.getPush('__ag__addFriendItem__',{id:id})
                    }
                }
            } catch (err) {
                util.error(err.message || '服务异常')
            }
        }
    }
}
</script>
<style scoped>
    .__addFriend-main__ {
        width: 750px;
        position: fixed;
        bottom: 0px;
        top: 105px;
        background-color: #EBEBEB;
    }
    .recom-ipx {
        top: 150px;
    }
    .__addFriend-content__ {
        width: 750px;
        flex: 1;
        padding-bottom: 150px;
    }
    .__ag__msg-search__ {
        width: 750px;
        padding: 16wx;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    .__ag__msg-search-input__ {
        flex: 1;
        height: 32wx;
        background-color: #fff;
        border-radius: 4wx;
        text-align: center;
    }
    .search-text {
        width: 32wx;
        height: 32wx;
        line-height: 32wx;
        text-align: center;
        margin-left: 8wx;
        font-size: 15wx;
    }
    .empty {
        width: 750px;
        padding: 16wx;
        line-height: 100wx;
    }
    .empty-text {
        color: #999;
	    text-align: center;
        font-size: 16wx;
    }
</style>