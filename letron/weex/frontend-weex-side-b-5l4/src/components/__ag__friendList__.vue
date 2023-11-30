<template>
    <div class="__ag__friend-main__" @click="__ag__clickLive__">
		<ag-ipx bg="#E6E6E6" image="linear-gradient(to top, #d6d6d6, #c0c0c0)"></ag-ipx>
        <div class="__ag__msg-title__">
            <!-- <text style="width: 100px"></text> -->
            <text style="width: 100px;text-align:center">通讯录</text>
            <text class="agiconfont msg-add" v-if="this.a__ag__user__ && this.a__ag__user__.userType < 3" @click="__openFriend__">&#xe6b0;</text>
            <!-- <text style="width: 100px" v-else></text> -->
        </div>
        <div class="__ag__msg-search__" v-if="this.a__ag__user__ && this.a__ag__user__.userType < 3">
            <input class="__ag__msg-search-input__" :hideDoneButton="true" type="text" placeholder="搜索" ref="inputref" v-model="searchVal" return-key-type="search" @focus="__ag__focus__" @blur="__ag__blur__" @keyboard="keyboard">
            <text class="search-text" v-if="isSearch" @click="__ag__cancel__">取消</text>
        </div>
        <div class="__ag__msg-content__" :class="[ipx?'__ag__msg-contentipx__':'']" v-if="this.a__ag__user__ && this.a__ag__user__.userType < 3" >
            <scroller class="__ag__follow-body-scroll__" :show-scrollbar="false" v-if="friendList2 && friendList2.length > 0">
                <refresh class="__ag__refresh__"  @refresh="onrefresh" :display="a__ag__refreshing__ ? 'show' : 'hide'">
                    <loading-indicator class="__ag__loading__"></loading-indicator>
                    <text  class="__ag__refreshtext__" >{{a__ag__freshText__}}</text>
                </refresh>
                <div class="__ag__friend-item__" v-for="(item,index) in friendList2" :key="'friend-'+item.id">
                    <div v-if="index==0 || item.index != friendList2[index-1].index" class="first-letter">
                        <text class="first-letter-text">{{item.index}}</text>
                    </div>
                    <friend-list-item :item="item" :ref="'fri'+ item.id" @change="change" @clickSwipe="__ag__clickSwipe__"></friend-list-item>
                </div>
            </scroller>
            <text v-else class="__ag__no-data__">暂无好友</text>
        </div>
        <div class="__ag__logged-content__" :class="[ipx?'__ag__logged-contentipx__':'']" v-else>
            <div class="__ag__logged-item">
                <text class="agiconfont logged-icon">&#xe688;</text>
                <text class="logged-text">当前未登录，立即登录看更多</text>
            </div>
            <button class="login-btn" @click="__ag__onLogin__"><text class="login-btn-text">登录</text></button>
        </div>
    </div>
</template>
<script>
    import agMinix from './__ag__minix__.js'
    import util from './util.js'
	import agMinUrl from './__ag__minurl__.js'
    import friendListItem from './__ag__friendListItem__.vue'
    import __ag__sportApi__ from './__ag__sport_api__.js'
    import ipx from './__ag__ipx__.vue'
    import bc from './__ag__bc__.js'
    export default {
        mixins:[agMinix,agMinUrl],
        props: {
            topTab: {
                type: String,
                default: ''
            }
        },
        components: {
            'friend-list-item':friendListItem,
            'ag-ipx':ipx,
        },
        data () {
            return {
                searchVal: '',
                isSearch: false,
                a__ag__user__: {},
                a__ag__friendList__: [],
                a__ag__freshText__: '下拉刷新',
                a__ag__refreshing__: false,
                lastItem: undefined
            }
        },
        watch: {
            async topTab(n,o) {
                if (n == o) {
                    return
                }
                if (n == '4') {
                    await this.__ag__getFriendList__()
                }
            }
        },
        computed: {
            friendList2(){
				let w = this.searchVal.toUpperCase()
				return this.a__ag__friendList__.filter(r=>{
					if(r.userHide == 2){
						return false
					}
					
					if(w && r.name && r.name.indexOf(w)==-1 && r.pinyin.indexOf(w)==-1){
						return false
					}
					return true
				})
				
			},
        },
        methods: {
            async __ag__loadData__(){
                let that = this
				that.a__ag__user__ = util.getItem('user')
				const Steve = new BroadcastChannel('onlogin')
				Steve.onmessage= async function(event){
					that.a__ag__user__ = event.data
                    if (event.data && event.data.userType < 3) {
                        await that.__ag__getFriendList__()
                    }
				}

                bc.onmessage('afreshData',this.__ag__getFriendList__)
            },
            async onrefresh() {
               if (this.a__ag__refreshing__) {
					return
				}
                this.a__ag__refreshing__ = true
				this.a__ag__freshText__ = '加载中...'
                await this.__ag__getFriendList__()
                setTimeout(()=> {
                    this.a__ag__refreshing__ = false
                },1000)
           },
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
            change(item) {
                if (this.lastItem) {
                    let ref =  this.$refs['fri'+ this.lastItem.id]
                    if (ref) {
                        ref[0].close()
                    }
                }
                this.lastItem = item
            },
            __ag__cancel__() {
                this.searchVal = ''
            },
            __ag__onLogin__() {
               util.getPush('__ag__login__')
            },
            async __ag__clickSwipe__(n,index) {
                if(index == 0) {
                    await this.__ag__deleteFriend__(n)
                    return
                }
                if(index == 1) {
                    await this.__ag__blackFriend__(n)
                    return
                }
            },
           async __ag__deleteFriend__(n) {
                let act = undefined
                let data = {}
                if(n.type == 2){
                    act = 'editGroupUsersLeave'
                    data.groupUserId=n.id
                }
                if(n.type == 3){
                    act = 'removeFriend'
                    data.id=n.id
                }
                try {
                    let resp = await __ag__sportApi__[act](data)
                    if (resp.success) {
                        n.userHide = 2
                        util.message('操作成功')
                    }
                } catch (err) {
                    util.message(err.message)
                }
                
            },
            async __ag__blackFriend__(n) {
                let act = undefined
                let data = {}
                if(n.type == 2){
                    act = 'editGroupUsersLeave'
                    data.groupUserId=n.id
                }
                if(n.type == 3){
                    act = 'removeFriend'
                    data.id=n.id
                }
                try {
                    let resp = await __ag__sportApi__[act](data)
                    if (resp.success) {
                        n.userHide = 2
                        util.message('操作成功')
                    }
                } catch (err) {
                    util.message(err.message)
                }
            },
            __openFriend__() {
                util.getPush('__ag__addFriend__')
            }
        }
    }
</script>
<style scoped lang="less">
     @import '../style/theme.less';
    .__ag__friend-main__ {
        position: fixed;
        top: 0;
        bottom: 66wx;
        background-color: #EBEBEB;
    }
    .friend-ipx {
        top: 35wx;
    }
    .__ag__msg-title__ {
        width: 750px;
        height: 44wx;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        border-bottom-style:solid;
        border-bottom-width: 1wx;
        border-bottom-color: rgba(0, 0, 0, 0.1);
        background-color: #E6E6E6;
        background-image: linear-gradient(to top, #EBEBEB,#d6d6d6);
        position: relative;
    }
    .msg-add {
        font-size: 25wx;
        position: absolute;
        right: 44px;
    }
    .__ag__msg-search__ {
        width: 750px;
        padding: 16wx;
        padding-top: 8wx;
        padding-bottom: 8wx;
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
    .__ag__msg-content__ {
        width: 750px;
        position: absolute;
        top: 230px;
        bottom: 0;
        background-color: #fff;
    }
    .__ag__msg-contentipx__ {
        top: 256px;
    }
    .__ag__refresh__ {
        width: 750px;
		padding: 10wx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
    }
    .first-letter {
        width: 750px;
        background-color: #EDEDED;
        height: 30wx;
        padding-left: 16wx;
    }
    .first-letter-text {
        color: #666;
        font-size: 16wx;
        line-height: 30wx;
    }
    .login-btn {
        width: 343wx;
        height: 40wx;
        background-color: @main-color;
        border-radius: 4wx;
    }
    .__ag__logged-content__ {
        width: 750px;
        position: absolute;
        top: 128px;
        bottom: 0;
        justify-content: center;
        align-items: center;
        background-color: #fff;
        padding-bottom: 64wx;
    }
     .__ag__logged-contentipx__ {
        top: 160px;
    }
    .login-btn-text {
        color: #fff;
        text-align: center;
        line-height: 40wx;
    }
    .__ag__logged-item {
        width: 750px;
        margin-bottom: 80wx;
        justify-content: center;
        align-items: center;
    }
    .logged-icon {
        font-size: 50wx;
        color: #8C97A5;
        margin-bottom: 15wx;
    }
    .logged-text {
        font-style: normal;
        font-weight: normal;
        font-size: 17wx;
        color: #8C97A5;
    }
    .__ag__no-data__ {
        width: 750px;
        text-align: center;
        color: #ccc;
        font-size: 17wx;
        padding-top: 30wx;
        padding-bottom: 30wx;
    }
    .__ag__loading__ {
        margin-right: 15wx;
    }
</style>