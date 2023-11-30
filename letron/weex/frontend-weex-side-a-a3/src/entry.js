import Vue from 'vue';
import weex from 'weex-vue-render';
import util from '@/components/util.js'
import 'babel-polyfill'
import HbTitle from '@/components/__ag__headTop__.vue'
Vue.component('ag-hbtitle', HbTitle)
import userImg from '@/components/__ag__userImg__.vue'
Vue.component('ag-userimg', userImg)

import country from '@/components/__ag__country__.vue'
Vue.component('ag-country', country)


import title from '@/components/__ag__title__.vue'
Vue.component('ag-title', title)

import anchorItem from '@/components/__ag__anchorItem__.vue'
Vue.component('ag-anchor-item', anchorItem)

import recycleList from '@/components/__ag__recycleList__.vue'
Vue.component('ag-recycle-list', recycleList)

import HbMix from '@/components/__ag__mix__.vue'
Vue.component('ag-mix', HbMix)

import agScrollView from '@/components/__ag__scrollView__.vue'
Vue.component('ag-scroll-view', agScrollView)

import newsList from '@/components/__ag__newsList__.vue'
Vue.component('ag-newslist', newsList)

// import matchUpList from '@/components/__ag__matchUpList__.vue'
// Vue.component('ag-matchuplist', matchUpList)

import liveUpList from '@/components/__ag__liveUpList__.vue'
Vue.component('ag-liveuplist', liveUpList)

import uptitle from '@/components/__ag__uptitle__.vue'
Vue.component('ag-uptitle', uptitle)

Vue.filter('url',(url)=>{
	return util.url(url)
})
weex.init(Vue);



