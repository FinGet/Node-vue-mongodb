import Vue from 'vue'
import Router from 'vue-router'
// import Hello from '@/components/Hello'
import GoodsList from '@/views/GoodsList'
import Title from '@/views/title'
import Img from '@/views/img'
import Cart from '@/views/cart'

Vue.use(Router)

export default new Router({
  mode: 'history', // history or hash
  routes: [
    {
      path: '/goods',
      name: 'GoodsList',
      components: {
        default: GoodsList,
        title: Title,
        img: Img
      }
    },
    {
      path: '/cart',
      name: 'cart',
      component: Cart
    }
  ]
})
