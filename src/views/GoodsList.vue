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
          <a href="javascript:void(0)" class="price" v-bind:class="{'sort-up':sortFlag}" @click="sortGoods">Price <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
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
                    <div class="price">{{item.salePrice}}</div>
                    <div class="btn-area">
                      <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div class="view-more-normal"
                 v-infinite-scroll="loadMore"
                 infinite-scroll-disabled="busy"
                 infinite-scroll-distance="20">
              <img src="./../assets/loading-spinning-bubbles.svg" v-show="loading">
            </div>
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
        sortFlag: true,
        page: 1,
        pageSize: 8,
        busy:true,
        loading:false,
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
      getGoodsList (flag) {
        var param = {
          page: this.page,
          pageSize: this.pageSize,
          sort: this.sortFlag ? 1 : -1,
          priceLevel: this.priceChecked
        }
        this.loading = true;
        axios.get('/goods/list',{
          params: param
        }).then((result) => {
          // var res = result.data
          // this.goodsList = res.result
          let res = result.data
          this.loading = false;
          if (res.status == "0") {
            if (flag) {
              this.goodsList = this.goodsList.concat(res.result.list)
              if( res.result.count == 0) {
                this.busy = true
              } else {
                this.busy = false
              }
            } else {
              this.goodsList = res.result.list
              this.busy = false
            }
            // console.log(this.goodsList)
          }else {
            this.goodsList = []
          }
        })
      },
      // 排序
      sortGoods() {
        this.sortFlag = !this.sortFlag
        // 点击排序，要将page设为1，从第一页开始
        this.page = 1
        this.getGoodsList()
      },
      // 点击价格索引
      setPriceFilter (index) {
        this.priceChecked = index
        this.page = 1;
        this.getGoodsList()
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
      },
      // 向下滚动加载更多
      loadMore(){
        this.busy = true;
        setTimeout(() => {
          this.page++;
          this.getGoodsList(true);
        }, 500);
      },
      // 添加购物车
      addCart(productId){
        axios.post("/goods/addCart", {
          productId:productId
        }).then((res) => {
          var res = res.data
          if(res.status == 0){
            alert("加入成功")
          }else {
            alert(res.msg)
          }
        })
      }
    }
  }
</script>
<style rel="stylesheet">

</style>
