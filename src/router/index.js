import Vue from 'vue'
import Router from 'vue-router'
// import Hello from '@/components/Hello'
import GoodsList from '@/views/GoodsList'
import Cart from '@/views/Cart'

Vue.use(Router)

export default new Router({
  mode: 'history', // history or hash
  routes: [
    {
      path: '/',
      name: 'GoodsList',
      component: GoodsList
    },
    {
      path: '/cart',
      name: 'Cart',
      component: Cart
    }
  ]
})
