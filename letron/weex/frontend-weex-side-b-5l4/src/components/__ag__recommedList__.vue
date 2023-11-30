<template>
    <div class="__ag__recommed-list-main__">
        <ag-recommed-item v-for="(item,index) in list2" :item="item" :key="item.id" :index="index" :length="list.length" @jumpRecommed="jumpRecommed"></ag-recommed-item>
    </div>
</template>
<script>
    import agRecommedItem from './__ag__recommedItem.vue'
    import agMinix from '../components/__ag__minix__.js'

    export default {
        mixins:[agMinix],
        props: {
            list: {
				type: Array,
				default: function() {
					return []
				}
			},
        },
        components: {
            'ag-recommed-item':agRecommedItem
        },
        data() {
            return {
                a__ag__user__: {},
                listRecommed: []
            }
        },
        watch: {
            list(n) {
                this.listRecommed = n
            }
        },
        computed:{
			list2(){
			    return this.listRecommed
			}
		},
        mounted() {
            this.listRecommed = this.list
        },
		methods:{
            async __ag__loadData__(option){
                let that = this
                const Steve = new BroadcastChannel('onlogin')
                Steve.onmessage= async function(event){
                    that.a__ag__user__ = event.data
                }
			},
		}
    }
</script>
<style scoped>
    .__ag__recommed-list-main__ {
        background-color: #fff;
        padding-right: 16wx;
		padding-left: 16wx;
        box-shadow: 0px 5px 3px rgba(0, 0, 0, 0.1);
        border-bottom-left-radius: 4wx;
        border-bottom-right-radius: 4wx;
    }
</style>