<template>
	<div class="user-img"  @click.stop="itemtap">
		<image v-if="avatar2" class="user-image" @load="imgError" :src="__ag__url__(avatar2)"></image>
		<div class="user-image" v-else>
			<text class="user-image-text" :class="[fontSize ? 'fontsize':'']" >{{charName(name)}}</text>
		</div>
	</div>
</template>

<script>
	import agMinUrl from '@/components/__ag__minurl__.js'
	export default {
		name:"userImg",
		mixins:[agMinUrl],
		props:{
			avatar:{
				type:String,
				default:''
			},
			islive:{
				type:Boolean,
				default:false
			},
			fontSize:{
				type:Boolean,
				default:false
			},
			name:{
				type:String,
				default:''
			},
			uid:{
				type:Number,
				default:undefined,
			},
		},
		data() {
			return {
				avatar2:'',
			};
		},
		watch:{
			avatar(n){
				this.avatar2 = n
			}
		},
		mounted() {
			this.avatar2= this.avatar
		},
		methods:{
			charName(name){
				if(!name){
					return ''
				}
				return name.charAt(0)
			},
			imgError(event){
				// console.log('imgError',event)
				if (!event.success) {
					this.avatar2 = ''
				}
			},
			itemtap(){
				if(this.islive){
					return
				}
				if(!this.uid){
					this.$emit('itemtap')
					return
				}
				this.$emit('islive')
				// uni.redirectTo({
				// 	url:'/pages/__ag__live__?tab=5&uid='+this.uid
				// })
			},
		},
	}
</script>

<style lang="less">
	.user-image {
		flex: 1;
		background-color: #EFEFEF;
		border-radius: 60px;
		text-align: center;
		align-items: center;
		justify-content: center;
	}
	.user-image-text {
		color: rgba(0, 0, 0, 0.3);
		font-size: 25px;
	}
	.fontsize {
		font-size: 36px;
	}
	.livelist-schedule-img .user-image {
		border-radius: 20px;
	}
</style>
