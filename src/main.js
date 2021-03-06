// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from 'vuex'
import VueLazyLoad from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'
import {currency} from './util/currency'

import './assets/css/base.css'
import './assets/css/checkout.css'
import './assets/css/product.css'

Vue.config.productionTip = false
Vue.use(Vuex)
Vue.use(VueLazyLoad, {
  loading: 'static/loading-svg/loading-bars.svg', // 加载动画
  try: 3 // default 1
})
Vue.use(infiniteScroll)

const store = new Vuex.Store({
  state: {
    nickName: '',
    cartCount: 0
  },
  mutations: {
    updateUserInfo(state, nickName) {
      state.nickName = nickName
    },
    updateCartCount(state, cartCount) {
      state.cartCount += cartCount
    },
    initCartCount(state, cartCount) {
      state.cartCount = cartCount
    }
  }
})

// 定义全局过滤器
Vue.filter("currency",currency)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
})

