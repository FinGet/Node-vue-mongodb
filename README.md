# mall

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## 前端路由有什么优点和缺点？
- 优点：
	用户体验好，不需要每次都从服务器全部获取，快速展现给用户
- 缺点：
	+ 不利于SEO
	+ 使用浏览器的前进，后退键的时候会重新发送请求，没有合理地利用缓存
	+ 单页面无法记住之前滚动的位置，无法在前进，后退的时候记住滚动的位置

动态路由的例子

```
<span>{{$route.params.goodsId}}</span> // 89

export default new Router({
  routes: [
    {
      path: '/goods/:goodsId',
      name: 'GoodsList',
      component: GoodsList
    }
  ]
})

// http://localhost:8080/#/goods/89
```

嵌套路由
```
routes: [
    {
      path: '/goods',
      name: 'GoodsList',
      component: GoodsList,
      children: [
        {
          path: 'title',
          name: 'title',
          component: Title
        },
        {
          path: 'img',
          name: 'img',
          component: Img
        }
      ]
    }
  ]
```
```
<template>
	<div>
		这是商品列表页面
		<span>{{$route.params.goodsId}}</span>
    <router-link to="/goods/title">title</router-link> // 不能只写 /
    <router-link to="/goods/img">img</router-link>
    <router-view></router-view>
	</div>
</template>
```
编程式路由
>通过js来实现页面的跳转
```
$router.push("name")
$router.push({path:"name"})
$router.push({path:"name?a=123"}) or $router.push({path:"name",query:{a:123}})
$router.go(1) // 前进一步
```
```
// router.js
{
  path: '/cart',
  name: 'cart',
  component: Cart
}
// 需要跳转的页面
<button @click="jump"> button- 跳转到购物车 </button>
methods: {
  jump () {
    this.$router.push('/cart')
    // or this.$router.push({path: '/cart'})
  }
}
```
```
// 如果跳转传递了参数
jump () {
  this.$router.push({path: '/cart?goodsId=123'})
}
// 在cart页面, 可以通过`$route.query.goodsId`获取到
<span>{{$route.query.goodsId}}</span> // 123
```
命名路由和命名试图
>给路由定义不同的名字，根据名字进行匹配
>给不同的router-view定义名字，通过名字进行对应组件的渲染
```
// 路由
{
  path: '/cart',
  name: 'cart',
  component: Cart
}
// 页面, 必须要使用v-bind指令绑定to，因为通过v-bind绑定之后，{name:'cart'}会进行运算而生成地址
<router-link v-bind:to="{name:'cart'}">跳转到购物车</router-link>
```
```
{
  path: '/cart/:cartId',
  name: 'cart',
  component: Cart
}
<router-link v-bind:to="{name:'cart',params:{cartId:123}}">跳转到购物车</router-link>
```
```
// app.vue
<router-view></router-view>
<router-view name="title"></router-view>
<router-view name="img"></router-view>
//routes 注意是components
{
  path: '/goods',
  name: 'GoodsList',
  components: {
    default: GoodsList,
    title: Title,
    img: Img
  }
}
```
## vue-resource

支持的HTTP方法
vue-resource的请求API是按照REST风格设计的，它提供了7种请求API：

- get(url, [options])
- head(url, [options])
- delete(url, [options])
- jsonp(url, [options])
- post(url, [body], [options])
- put(url, [body], [options])
- patch(url, [body], [options])

### options对象

发送请求时的options选项对象包含以下属性：

| 参数        | 类型           | 描述  |
| ------------- |:-------------:|:-----|
| url      | string | 请求的URL |
| method     | string     |   请求的HTTP方法，例如：'GET', 'POST'或其他HTTP方法 |
| body | Object, FormData string      |    request body |
| params | Object      |    请求的URL参数对象 |
| headers | Object      |    request header |
| timeout | number      |    单位为毫秒的请求超时时间 (0 表示无超时时间) |
| before | function(request)      |    请求发送前的处理函数，类似于jQuery的beforeSend函数 |
| progress | function(event)      |    ProgressEvent回调处理函数 |
| credientials | boolean      |    表示跨域请求时是否需要使用凭证 |
| emulateHTTP | boolean      |   发送PUT, PATCH, DELETE请求时以HTTP POST的方式发送，并设置请求头的X-HTTP-Method-Override |
| emulateJSON | boolean      |    将request body以application/x-www-form-urlencoded content type发送 |

##### emulateHTTP的作用
  如果Web服务器无法处理PUT, PATCH和DELETE这种REST风格的请求，你可以启用enulateHTTP选项。启用该选项后，请求会以普通的POST方法发出，并且HTTP头信息的X-HTTP-Method-Override属性会设置为实际的HTTP方法。Vue.http.options.emulateHTTP = true;
##### emulateJSON的作用
  如果Web服务器无法处理编码为application/json的请求，你可以启用emulateJSON选项。启用该选项后，请求会以application/x-www-form-urlencoded作为MIME type，就像普通的HTML表单一样。Vue.http.options.emulateJSON = true;

### 全局拦截器 interceptors

```
Vue.http.interceptors.push((request, next) => {
    // ...
    // 请求发送前的处理逻辑
    // ...
  next((response) => {
     // ...
     // 请求发送后的处理逻辑
     // ...
     // 根据请求的状态， response参数会返回给successCallback或errorCallback
  })
})
```
## 两种等价的app的挂载方式
```
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})

// new Vue({
//   router,
//   template: '<App/>',
//   components: { App }
// }).$mount("#app");

```
## 加载mock json数据
第一步：创建一个json数据
```
{
  "status":"0",
  "msg":"",
  "result":[
    {
      "productId":"10001",
      "productName":"小米6",
      "prodcutPrice":"2499",
      "prodcutImg":"mi6.jpg"
    },
    ……
  ]
}
```
第二步：在dev-server.js中设置后台路由,提供给前台加载
```
var app = express()

var router = express.Router() // 通过express拿到路由
var goodsData = require('./../mock/goods.json') // 加载模拟json数据进来
router.get("/goods", function (req, res, next) {
  res.json(goodsData); // json()可以直接输出一个json
})
app.use(router) // 最后通过app.use使用这个路由

```
第三步：在页面中通过axios请求json数据
```
mounted: function () {
  this.getGoodsList()
},
methods: {
  // 获取商品列表
  getGoodsList () {
    axios.get('/goods').then((result) => {
      var res = result.data
      // this.goodsList = res.result
    })
  }
}
```
# 图片懒加载
```
npm install vue-lazyload --save
```

```
// main.js 导入组件 可以在所有组件中使用
import VueLazyLoad from 'vue-lazyload'
Vue.use(VueLazyLoad, {
  loading: 'static/loading-svg/loading-bars.svg', // 加载动画
  try: 3 // default 1
})
```
```
// 使用
<img v-lazy="'static/'+item.prodcutImg" alt="">
```
# 搭建基于Express框架运行环境
```
npm i -g express-generator
```

```
// 在项目文件下
express server
```