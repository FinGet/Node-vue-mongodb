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
          <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
        </div>
        <div class="accessory-result">
          <!-- filter -->
          <div class="filter stopPop" id="filter" :class="{'filterby-show':filterBy}">
            <dl class="filter-price">
              <dt>Price:</dt>
              <dd><a href="javascript:void(0)" @click="setPriceFilter('All')" :class="{'cur':priceChecked=='All'}">All</a></dd>
              <dd v-for="(price, index) in priceFilter" :key="price.id">
                <a href="javascript:void(0)" @click="setPriceFilter(index)" :class="{'cur':priceChecked==index}" >{{price.startPrice}} - {{price.endPrice}}</a>
              </dd>
            </dl>
          </div>

          <!-- search result accessories list -->
          <div class="accessory-list-wrap">
            <div class="accessory-list col-4">
              <ul>
                <li v-for="item in goodsList" :key="item.id">
                  <div class="pic">
                    <a href="#"><img v-lazy="'static/'+item.productImage" alt=""></a>
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
    <div class="md-overlay" v-show="overLayFlag" @click.stop="closePop"></div>
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
        goodsList: [],
        priceFilter: [
          {
            startPrice: '0.00',
            endPrice: '500.00'
          },
          {
            startPrice: '100.00',
            endPrice: '500.00'
          },
          {
            startPrice: '500.00',
            endPrice: '1000.00'
          },
          {
            startPrice: '1000.00',
            endPrice: '5000.00'
          }
        ],
        priceChecked: 'All',
        filterBy: false,
        overLayFlag: false
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
          // var res = result.data
          // this.goodsList = res.result
          let res = result.data
          if (res.status == "0") {
            this.goodsList = res.result.list
            // console.log(this.goodsList)
          }else {
            this.goodsList = []
          }
        })
      },
      // 点击价格索引
      setPriceFilter (index) {
        this.priceChecked = index
      },
      // 当屏幕缩小，点击filterby显示价格导航
      showFilterPop () {
        this.filterBy = true
        this.overLayFlag = true
      },
      // 点击遮罩层隐藏价格导航
      closePop () {
        this.filterBy = false
        this.overLayFlag = false
      }
    }
  }
</script>
<style rel="stylesheet">

</style>
