<template>
	
	<view class="ag-input">
		
		<view class="ag-input-view">
			<text class="agiconfont" :class="icon"></text>	
			<input @focus="onfocus" @blur="onblur" :value="val" @input="inputChange" :placeholder="placeholder" :hideDoneButton="true"/>
		</view>
		
	</view>
	
</template>

<script>
	
	import util from './util.js'
	// import sport from './sport.js'
	
	import vars from '@/components/vars.js'
	
	
export default {
	data() {
		return {
			val:''
		}
	},
	props:{
		icon: {
			type: String,
			default: 'icon-search'
		},
		value: {
			type: String,
			default: ''
		},
		placeholder: {
			type: String,
			default: ''
		}
	},
	onLoad() {
		this.val = this.value
	},
	onShow() {
	},
	mounted() {
	},
	computed:{
	},
	methods: {
		inputChange(event){
			
			this.val = event.detail.value
			this.$emit('input', this.val)
		},
		onfocus(event){
			this.$emit('focus', event)
		},
		onblur(event){
			this.$emit('blur', event)
		}
	}
}
</script>

<style scoped>

.ag-input {
	
	background-color: #fff;
	
}

	.ag-input-view {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: #f2f2f2;
		border-radius: 5px;
		height: 26px;
		padding: 0 10px;
		width: calc(100% - 20px);
		
		
	}
.icon-search {
	flex: 0 0 20px;
	font-size: 13px;
}
input {
	font-size: 13px;
	width: 100%;
}

</style>
