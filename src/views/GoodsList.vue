<template>
	<div class="goodlist">
		这是商品列表页面
		<span>{{$route.params.goodsId}}</span>
    <router-link to="/goods/title">title</router-link>
    <router-link to="/goods/img">img</router-link>
    <router-view></router-view>
    <router-link to="/cart">跳转到购物车</router-link>
    <button @click="jump"> button- 跳转到购物车 </button>
    <router-link v-bind:to="{name:'cart'}">跳转到购物车</router-link>
	</div>
</template>

<script type="text/ecmascript-6">
  export default{
    data () {
      return {
        msg: 'Hello'
      }
    },
    methods: {
      jump () {
        this.$router.push({path: '/cart?goodsId=123'})
      }
    }
  }
</script>
<style rel="stylesheet">

</style>
