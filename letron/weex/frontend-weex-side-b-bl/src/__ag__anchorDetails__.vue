<template>
    <div class="__ag__uplive__">
        <ag-hbtitle :isback="true" title="主播详情"></ag-hbtitle>
        <div class="__ag__uplivecontent__" :class="[ipx?'ipx':'']" >
            <ag-upinfo ref="upAnthor" :item="upinfo" :listFollowMap="listFollowMap" :uid="uid" :user="a__ag__user__" :isDetail="isDetail" @cancelFollow="__ag__cancelFollow__" @followTap="__ag__followTap__"></ag-upinfo>
        </div>
    </div>
</template>

<script>
    import agMinix from './components/__ag__minix__.js'
	import HbTitle from './components/__ag__headTop__.vue'
	import agupinfo from './components/__ag__upinfo__.vue'
    import util from './components/util.js'
    import bc from './components/__ag__bc__.js'
	export default {
		mixins:[agMinix],
		components:{
			'ag-hbtitle': HbTitle,
            'ag-upinfo':agupinfo,
		},
		data() {
            return {
                upinfo: {},
                listFollowMap: {},
                uid: '',
                a__ag__user__: {},
				isDetail: true
            }
		},
		computed:{
        },
        mounted() {
			let up = this.$refs.upAnthor
			if (up) {
				up.__ag__getPageRecommend__()
			}
        },
		methods:{
            async __ag__loadData__(){
                let that = this
				this.a__ag__user__ = util.getItem('user')
                let data = util.getUrlParam(weex.config.bundleUrl)
				this.uid = data.uid

				const Steve = new BroadcastChannel('onlogin')
				Steve.onmessage= async function(event){
					that.__ag__login__(event.data)
					await that.__ag__Up__()
				}

                await this.__ag__Up__()
            },
			__ag__login__(data) {
				this.a__ag__user__ = data
			},
            async __ag__Up__() {
                
                try {
					let resp =  await this.__ag__pageUpById__({id :this.uid})
					if(resp && resp.data && resp.data.list && resp.data.list.length>0){
						let item = resp.data.list[0]
						this.upinfo  = item
						if (item && item.joinMap && item.joinMap.follow && item.joinMap.follow.id) {
							let follow = item.joinMap.follow
							this.$set(this.listFollowMap,item.id,follow)
						}
						
					}
				} catch (err) {
					util.message(err.message)
				}
            },
            async __ag__cancelFollow__(item) {
                if(!this.a__ag__user__ || this.a__ag__user__.userType == 3){
					util.message('请登录账号')
					util.getPush('__ag__login__')
					return 
				}
				let r = this.listFollowMap[item.id]
				if (!r) {
					return
				}
				let id = r.id
				try {
					let resp = await this.__ag__editFollowCancel__({id})
                    if(resp.success){
						let f = {
							streamerId: item.id
						}
						util.message(resp.message)
						this.$delete(this.listFollowMap,item.id)
						bc.postMessage('cancelFollow',f)
                    }
				}catch(err) {
					util.message(err.message)
				}
            },
            async __ag__followTap__(item) {
                if(!this.a__ag__user__ || this.a__ag__user__.userType == 3){
					util.message('请登录账号再订阅')
					util.getPush('__ag__login__')
					return 
				}
				if(!item.id){
					return 
				}
				try {
					let resp = await this.__ag__editFollow__({streamerId: item.id})
                    if(resp.success){
						util.message(resp.message)
                        let r = resp.data
                        this.$set(this.listFollowMap,r.streamerId,r)
						bc.postMessage('followTap',r)
                    }
				}catch(err) {
					util.message(err.message)
				}
            }
		}
	}
</script>

<style>
    .__ag__uplive__ {
		background-color: #f2f3f4;
		width: 750px;
		flex-direction: column;
		align-items: center;
	}
    .__ag__uplivecontent__ {
        width: 750px;
        padding: 16px;
        background-color: #f2f3f4;
        position: fixed;
		top: 128px;
		bottom: 0px;
		z-index: 9;
        flex-direction: column;
		align-items: center;
		padding-top: 0px;
    }
	.ipx {
		top: 166px;
		bottom: 0px;
		padding-bottom: 34px;
	}
</style>
