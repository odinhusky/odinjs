<template>
	<div class="__ag__my-item-main__" @click="__ag__goJump__">
		<div class="__ag__my-item-box-lf__" v-if="isIcons">
			<slot></slot>
		</div>
		<div class="__ag__my-item-box-center__" :class="[isright ? '__ag__isright__' : '']">
			<text class="__ag__my-item-box-text__">{{title}}</text>
			<slot v-if="isright"></slot>
		</div>
		<div class="__ag__my-item-box-rg__" v-if="!isright">
			<text class="agiconfont back1-right __ag__item-icon__">&#xec6b;</text>
		</div>
	</div>
</template>

<script>
	export default {
		name:"ag-myItem",
		props: {
			title: {
				type:String,
				default: ''
			},
			isIcons: {
				type:Boolean,
				default: false
			},
			isright: {
				type:Boolean,
				default: false
			}
		},
		data() {
			return {
				
			};
		},
		methods: {
			__ag__goJump__() {
				this.$emit('goJump')
			}
		}
	}
</script>

<style scoped lang="less">
	@import "../style/theme.less";
	.__ag__my-item-main__ {
		background-color: #FFFFFF;
		height:120px;
		width: 750px;
		padding-left: 20px;
		border-style: solid;
		border-bottom-width: 1wx;
		border-bottom-style: solid;
		border-bottom-color: rgba(206, 206, 206,0.8);
		flex-direction: row;
		align-items: center;
	}
	.__ag__my-item-box__ {
		padding-top: 10px;
		height: 100px;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.__ag__my-item-box-text__{
		font-style: normal;
		font-weight: normal;
		font-size: 17wx;
		color: #000000;
	}
	.__ag__my-item-box-center__{
		display: flex;
		flex-direction: row;
		margin-left:20px;
	}
	.__ag__my-item-box-lf__ {
		width: 60px;
		height: 60px;
		margin-right: 10px;
		display: flex;
		flex-direction: row;
		align-content: center;
	}
	.__ag__my-item-box-center__ {
		flex: 1;
		font-style: normal;
		font-weight: normal;
		font-size: 34px;
		/* color: #000000; */
	}
	.__ag__isright__ {
		position: relative;
	}
	.__ag__my-item-box-rg__ {
		width: 48px;
		height: 48px;
		margin-right: 20px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.__ag__item-icon__ {
		font-size: 40px;
		color: rgba(0,0,0,0.4);
	}
</style>
