<template>
	<div class="goodlist">
    <!--头部-->
    <nav-header></nav-header>
    <!--面包屑导航-->
    <nav-bread>
      <span>Goods</span>
    </nav-bread>

    <div class="accessory-result-page accessory-page">
      <div class="container">
        <div class="filter-nav">
          <span class="sortby">Sort by:</span>
          <a href="javascript:void(0)" class="default cur">Default</a>
          <a href="javascript:void(0)" class="price">Price <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
          <a href="javascript:void(0)" class="filterby stopPop" >Filter by</a>
        </div>
        <div class="accessory-result">
          <!-- filter -->
          <div class="filter stopPop" id="filter">
            <dl class="filter-price">
              <dt>Price:</dt>
              <dd><a href="javascript:void(0)">All</a></dd>
              <dd>
                <a href="javascript:void(0)"></a>
              </dd>
            </dl>
          </div>

          <!-- search result accessories list -->
          <div class="accessory-list-wrap">
            <div class="accessory-list col-4">
              <ul>
                <li v-for="item in goodsList" :key="item.id">
                  <div class="pic">
                    <a href="#"><img :src="'static/'+item.prodcutImg" alt=""></a>
                  </div>
                  <div class="main">
                    <div class="name">{{item.productName}}</div>
                    <div class="price">{{item.prodcutPrice}}</div>
                    <div class="btn-area">
                      <a href="javascript:;" class="btn btn--m">加入购物车</a>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <!--<div class="view-more-normal"-->
                 <!--v-infinite-scroll="loadMore"-->
                 <!--infinite-scroll-disabled="busy"-->
                 <!--infinite-scroll-distance="20">-->
              <!--<img src="./../assets/loading-spinning-bubbles.svg" v-show="loading">-->
            <!--</div>-->
          </div>
        </div>
      </div>
    </div>

    <!--底部-->
    <nav-footer></nav-footer>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavHeader from '@/components/header'
  import NavBread from '@/components/bread'
  import NavFooter from '@/components/footer'
  import axios from 'axios'
  export default{
    data () {
      return {
        goodsList: []
      }
    },
    components: {
      NavHeader,
      NavFooter,
      NavBread
    },
    mounted: function () {
      this.getGoodsList()
    },
    methods: {
      // 获取商品列表
      getGoodsList () {
        axios.get('/goods').then((result) => {
          var res = result.data
          this.goodsList = res.result
        })
      }
    }
  }
</script>
<style rel="stylesheet">

</style>
