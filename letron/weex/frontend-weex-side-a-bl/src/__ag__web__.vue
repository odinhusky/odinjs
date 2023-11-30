<template>
    <div class="__ag__webdiv__">
        <ag-hbtitle :isback="true" :title="title"></ag-hbtitle>
        <div class="__ag__web_content__" :class="[ipx ? 'web-ipx' : '']">
            <web
                class="__ag__web__"
                @pagestart="onPageStart"
                @pagefinish="onPageFinish"
                @error="onError"
                :src="url"
                v-if="url"
            ></web>
        </div>
    </div>
</template>

<script>
import agMinix from './components/__ag__minix__.js'
import agUtil from './components/util.js'
import HbTitle from './components/__ag__headTop__.vue'
export default {
    mixins: [agMinix],
    components: {
        'ag-hbtitle':HbTitle
    },
    data() {
        return {
            url: '',
            title: '',
        }
    },
    mounted() {
        let data = agUtil.getUrlParam(weex.config.bundleUrl)

        this.url = data.url
        if (data.title == 'Privacy') {
            this.title = '隐私政策'
        } else if (data.title == 'Service') {
            this.title = '用户协议'
        }
    },
    methods: {
        onPageStart: function (e) {
            // util.message("onPageStart"+e)
            // console.log(e)
            // page start load
        },
        onPageFinish: function (e) {
            // util.message("onPageFinish"+e)
            // console.log(e)
            // page finish load
        },
        onError: function (e) {
            // util.message("onPageFinish"+e)
            // console.log(e)
            // page load error
        }
    }
}

</script>

<style>
.__ag__webdiv__ {
    width: 750px;
	background-color:#fff;
}
.__ag__web_content__ {
    position: fixed;
    top: 142px;
    bottom: 0px;
    width: 750px;
    border-top-left-radius: 20px;
	border-top-right-radius: 20px;
	background-color: #fff;
    overflow: hidden;
}
.web-ipx {
    top: 196px;
}
.__ag__web__ {
    flex: 1;
}
</style>
