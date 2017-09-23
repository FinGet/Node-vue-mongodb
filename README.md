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

# ejs 代替jade
```
npm install ejs --save
```
```
// server/app.js
var ejs = require('ejs')

app.engine('.html', ejs.__express)
app.set('view engine', 'html');
```
# windows平台下MongoDB安装和环境搭建
- 高可扩展性
- 分布式存储
- 低成本
- 结构灵活
>mongoDB以json文档形式进行存储

+ 下载安装包或者压缩包
+ 添加db存储和日志存储文件
+ 添加服务、配置环境变量、启动Mongo
[mongoDB安装配置参考](http://www.imooc.com/article/18438)
>mongoDB图形工具推荐mongoChef

## mongoDB基本语法
| SQL术语/概念   | MongoDB术语/概念 | 解释/说明  |
| ------------- |:-------------   |:-----|
| database      | database        | 数据库 |
| table         | collection      |数据库表/集合|
| row           | document        |数据记录行/文档|
| column        | field           |数据字段/域  |
| index         | index           |索引 |
| table joins   |                 |表连接，MongoDB不支持 |
| primary key   | primary key     |主键，mongodb自动将_id字段设置为主键   |

- 插入文档
- 更新文档
- 删除文档
- 查询文档

> // 通过shell终端导入数据库表 (but 我没成功 原因待续……)
> mongoimport -d mall -c goods --file c:\……

```
数据库常用命令

1、Help查看命令提示

 help

  db.help();

  db.yourColl.help();

  db.youColl.find().help();

  rs.help();

2、切换/创建数据库

 use yourDB;  当创建一个集合(table)的时候会自动创建当前数据库

3、查询所有数据库

 show dbs;

4、删除当前使用数据库

 db.dropDatabase();

5、从指定主机上克隆数据库

 db.cloneDatabase(“127.0.0.1”); 将指定机器上的数据库的数据克隆到当前数据库

6、从指定的机器上复制指定数据库数据到某个数据库

 db.copyDatabase("mydb", "temp", "127.0.0.1");将本机的mydb的数据复制到temp数据库中

7、修复当前数据库

 db.repairDatabase();

8、查看当前使用的数据库

 db.getName();

 db; db和getName方法是一样的效果，都可以查询当前使用的数据库

9、显示当前db状态

 db.stats();

10、当前db版本

 db.version();

11、查看当前db的链接机器地址

 db.getMongo();
```
```
Collection聚集集合

1、创建一个聚集集合（table）

 db.createCollection(“collName”, {size: 20, capped: 5, max: 100});

2、得到指定名称的聚集集合（table）

 db.getCollection("account");

3、得到当前db的所有聚集集合

 db.getCollectionNames();

4、显示当前db所有聚集索引的状态

 db.printCollectionStats();
```
```
用户相关

1、添加一个用户

 db.addUser("name");

 db.addUser("userName", "pwd123", true); 添加用户、设置密码、是否只读

2、数据库认证、安全模式

 db.auth("userName", "123123");

3、显示当前所有用户

 show users;

4、删除用户

 db.removeUser("userName");
```
```
聚集集合查询

1、查询所有记录

db.userInfo.find();

相当于：select* from userInfo;

默认每页显示20条记录，当显示不下的情况下，可以用it迭代命令查询下一页数据。注意：键入it命令不能带“；”

但是你可以设置每页显示数据的大小，用DBQuery.shellBatchSize= 50;这样每页就显示50条记录了。


2、查询去掉后的当前聚集集合中的某列的重复数据

db.userInfo.distinct("name");

会过滤掉name中的相同数据

相当于：select distict name from userInfo;


3、查询age = 22的记录

db.userInfo.find({"age": 22});

相当于： select * from userInfo where age = 22;


4、查询age > 22的记录

db.userInfo.find({age: {$gt: 22}});

相当于：select * from userInfo where age >22;


5、查询age < 22的记录

db.userInfo.find({age: {$lt: 22}});

相当于：select * from userInfo where age <22;


6、查询age >= 25的记录

db.userInfo.find({age: {$gte: 25}});

相当于：select * from userInfo where age >= 25;


7、查询age <= 25的记录

db.userInfo.find({age: {$lte: 25}});


8、查询age >= 23 并且 age <= 26

db.userInfo.find({age: {$gte: 23, $lte: 26}});
 

9、查询name中包含 mongo的数据

db.userInfo.find({name: /mongo/});

//相当于%%

select * from userInfo where name like ‘%mongo%’;


10、查询name中以mongo开头的

db.userInfo.find({name: /^mongo/});

select * from userInfo where name like ‘mongo%’;


11、查询指定列name、age数据

db.userInfo.find({}, {name: 1, age: 1});

相当于：select name, age from userInfo;

当然name也可以用true或false,当用ture的情况下河name:1效果一样，如果用false就是排除name，显示name以外的列信息。


12、查询指定列name、age数据, age > 25

db.userInfo.find({age: {$gt: 25}}, {name: 1, age: 1});

相当于：select name, age from userInfo where age >25;


13、按照年龄排序

升序：db.userInfo.find().sort({age: 1});

降序：db.userInfo.find().sort({age: -1});


14、查询name = zhangsan, age = 22的数据

db.userInfo.find({name: 'zhangsan', age: 22});

相当于：select * from userInfo where name = ‘zhangsan’ and age = ‘22’;


15、查询前5条数据

db.userInfo.find().limit(5);

相当于：selecttop 5 * from userInfo;


16、查询10条以后的数据

db.userInfo.find().skip(10);

相当于：select * from userInfo where id not in (

selecttop 10 * from userInfo

);


17、查询在5-10之间的数据

db.userInfo.find().limit(10).skip(5);

可用于分页，limit是pageSize，skip是第几页*pageSize


18、or与 查询

db.userInfo.find({$or: [{age: 22}, {age: 25}]});

相当于：select * from userInfo where age = 22 or age = 25;


19、查询第一条数据

db.userInfo.findOne();

相当于：selecttop 1 * from userInfo;

db.userInfo.find().limit(1);

20、查询某个结果集的记录条数

db.userInfo.find({age: {$gte: 25}}).count();

相当于：select count(*) from userInfo where age >= 20;

如果要返回限制之后的记录数量，要使用count(true)或者count(非0) 
db.users.find().skip(10).limit(5).count(true);

21、按照某列进行排序

db.userInfo.find({sex: {$exists: true}}).count();

相当于：select count(sex) from userInfo;
```
# 在webstrom中配置node启动调试环境
```
webstrom 菜单栏选择Run->Edit Configurations
新建一个nodejs configuration
javaScript file 选择 server/bin/www
```
# 基于Express开发商品列表查询接口
- 安装Mongoose `npm i mongoose --save`
- 创建model
- 创建路由
- 基于mongoose，实现商品列表的查询功能
```
- server
  - bin
    - www
  - models
    - goods.js
  - public
    - images
    - javascripts
    - stylesheets
  - routers
    - goods.js
    - index.js
    - users.js
  - views
  - app.js
```

+ 第一步:在server下新建一个models文件夹
+ 第二步:在models下新建一个goods.js
```
var mongoose = require('mongoose') // 1、加载mongoose
var Schema = mongoose.Schema // 2、定义一个Schema
var produtSchema = new Schema({ // 3、通过schema定义表模型
    "productId": String,
    "productName": String,
    "salePrice": Number,
    "productImage": String
})

module.exports = mongoose.model('Good', produtSchema)
/*
  在mongo集合中定义了goods集合,在这里就直接定义Good，它会自动加上's'去寻找，
  如果在集合中定义的是good集合：
  module.exports = mongoose.model('Good', produtSchema, 'good')
*/
```
+ 第三步:在routes里定义一个goods.js路由
```
var express = require('express') // 加载express模块
var router = express.Router() // 通过express框架扩展出router
var mongoose = require('mongoose') // 加载mongoose
var Goods = require('../models/goods') // 加载模型表

// 链接MongoDB数据库
mongoose.connect('mongodb://127.0.0.1:27017/mall')
// 链接成功
mongoose.connection.on("connected", function() {
    console.log("MongoDB connected success")
})
// 链接失败
mongoose.connection.on("error", function() {
    console.log("MongoDB connected error")
})
// 断开了
mongoose.connection.on("disconnected", function() {
    console.log("MongoDB connected disconnected")
})

router.get("/", function (req, res, next) { // next继续执行的函数
    // res.send('hello,goods list')
    Goods.find({}, function (err, doc) { // obj.find(参数, 回调)
        if (err) {
            res.json({
                status:'1',
                msg:err.message
            })
        }else {
            res.json({
                status:'0',
                msg:'',
                result:{
                    count:doc.length,
                    list:doc
                }
            })
        }
    })
})

// 输出路由，不然无法访问到goods路由
module.exports = router

```
+ 第四步:在app.js里面设置goods一级路由
```
var goods = require('./routes/goods')
app.use('/goods', goods);
```
+ 最后
```
node server/bin/www
// http://localhost:3000/goods // 可以加载出数据
```
>module.exports是nodejs规范

# 前端怎样去通过后端接口加载渲染商品列表数据
+ 第一步:在goodsList里请求数据
```
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
}
```
>注意：前端请求的端口并不是后台的端口，所以存在跨越问题，而axios不能跨越
>代理办法:config/index.js
```
proxyTable: {
  '/goods':{
    target:'http://localhost:3000' // 内部转发到3000这个端口
  }
}
```

# 后端商品列表分页，排序
```
router.get("/", function (req, res, next) {
    // res.send('hello,goods list')
    // req.param接收前端传过来的参数
    let page = parseInt(req.param("page"))
    // 通过req.param()取到的值都是字符串，而limit()需要一个数字作为参数
    let pageSize = parseInt(req.param("pageSize"))
    let sort = req.param("sort") //排序 
    let params = {}
    let skip = (page-1)*pageSize // 分页跳过几条
    let goodsModel = Goods.find(params).skip(skip).limit(pageSize)
    goodsModel.sort({'salePrice':sort}) // mongoDB是非关系型数据，查询条件必须是对象 sort是mongoose提供的api
    goodsModel.exec(function (err, doc) { 
        if (err) {
            res.json({
                status:'1',
                msg:err.message
            })
        }else {
            res.json({
                status:'0',
                msg:'',
                result:{
                    count:doc.length,
                    list:doc
                }
            })
        }
    })
})
// http://127.0.0.1:3000/goods?page=1&pageSize=5&sort=1
```

# 前端传递排序分页参数
```
getGoodsList () {
  var param = {
    page: this.page,
    pageSize: this.pageSize,
    sort: this.sortFlag ? 1 : -1
  }
  axios.get('/goods',{
    params: param
  }).then((result) => {
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
```
```
// 安装 vue-infinite-scroll 实现滚动分页
getGoodsList (flag) {
  var param = {
    page: this.page,
    pageSize: this.pageSize,
    sort: this.sortFlag ? 1 : -1
  }
  this.loading = true;
  axios.get('/goods',{
    params: param
  }).then((result) => {
    // var res = result.data
    // this.goodsList = res.result
    let res = result.data
    this.loading = false;
    if (res.status == "0") {
      if (flag) {
        this.goodsList = this.goodsList.concat(res.result.list) // 叠加，不是覆盖
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
loadMore(){
  this.busy = true;
  setTimeout(() => {
    this.page++;
    this.getGoodsList(true);
  }, 500);
}
```
# 区间条件查询
```
// 在param中加一个参数
priceLevel: this.priceChecked
```
```
// 在api中处理参数，也可以直接在前端处理之后再传值
// 全部查询，意思就是不加条件的查询，默认查询就是全部查询
var priceGt = '',priceLte = ''
if(priceLevel!='All'){
    switch (priceLevel){
        case '0':priceGt = 0;priceLte=100;break;
        case '1':priceGt = 100;priceLte=500;break;
        case '2':priceGt = 500;priceLte=1000;break;
        case '3':priceGt = 1000;priceLte=5000;break;
    }
    params = {
        salePrice:{
            $gt:priceGt,
            $lte:priceLte
        }
    }
}
```

> get方式取参 -> req.param()
> post方式取参 -> req.body.productId

# 添加到购物车(没考虑用户，直接定义了用户id)
>只说思路，代码看server/routes/goodsjs 和server/models/user.js
- 点击添加购物车，前端将productId传递到后端
- 后端先获取当前登录的用户Id和前端传过来的商品Id（var userId = '100000077',productId = req.body.productId）
- 先通过userId查询用户信息
- 如果存在该用户，则遍历该用户购物车（cartList）中是否有这个商品,如果有，则商品数量+1,然后存进数据库
```
userDoc.cartList.forEach(function (item) {
  if (item.productId == productId) {
    goodsItem = item
    item.productNum ++
  }
})
```
- 如果用户是第一添加该商品，则通过商品Id(productId)查询该商品信息，为啥不直接从前端传递呢？防止有人串改，而误存进数据库
```
Goods.findOne({productId:productId}, function (err1, doc) 
```
- 最后就是将这个商品信息加入用户购物车，数量为1
```
if (doc) {
  doc.productNum = 1
  doc.checked = 1
  userDoc.cartList.push(doc)
  userDoc.save(function (err2,doc2) {
    if (err2) {
      res.json({
        status:'1',
        msg:err2.message
      })
    }else {
      res.json({
        status:'0',
        msg:'',
        result:'suc'
      })
    }
  })
}
```
# 用户登录
```
// 前端
login() {
  //console.log(1)
  if (!this.userName || !this.userPwd) {
    this.errorTip = true
    return
  }
  axios.post("/users/login",{ // 通过post方式更安全
    userName: this.userName,
    userPwd: this.userPwd
  }).then((response) => {
    let res = response.data
    if (res.status == '0') {
      //console.log(1)
      this.loginModalFlag = false
      this.nickName = res.result.userName
      // console.log(res)
    }else {
      this.errorTip = true
    }
  })
}
// 后端
router.post("/login", function (req,res,next) {
  var param = { // 通过req.body获取前端传过来的用户名和密码
    userName:req.body.userName,
    userPwd:req.body.userPwd
  }
  User.findOne(param, function (err,doc) { // 在数据库中查询是否存在该用户
    if(err){
        res.json({
            status:"1",
            msg:err.message
        });
    }else{
      if(doc){
        res.cookie("userId",doc.userId,{
          path:'/',
          maxAge:1000*60*60
        });
        res.cookie("userName",doc.userName,{
          path:'/',
          maxAge:1000*60*60
        });
        //req.session.user = doc;
        res.json({ // 最后返回一个用户名，前端呈现在页面上
          status:'0',
          msg:'',
          result:{
            userName:doc.userName
          }
        })
      }
    }
  })
})
```
# 用户登出
```
router.post("/logout", function(req, res, next) {
  // 清除cookie
  res.cookie("userId", "",{
    path:"/",
    maxAge: -1
  })
  res.json({
    status:'0',
    msg:'',
    result:''
  })
})
```
>前端调用接口，将nickName=''就ok

# 全局的拦截（未登录就不能添加购物车）
server/app.js
>主要就是通过路由判断
```
// 全局拦截
app.use(function(req, res, next) {
  if(req.cookies.userId) {
    next() // 无操作，直接向下执行
  }else {
    // 白名单
    // req.originalUrl.indexOf('/goods/list')>-1 req.path == '/goods/list'
    if(req.originalUrl.indexOf('/goods/list')>-1 || req.originalUrl == '/users/login' || req.originalUrl == '/users/logout') {
      next()
    }else {
      res.json({
        status:'10001',
        msg:'当前未登录',
        result:''
      })
    }
  }
})
```
# 登录校验
>已经登录的用户，会存下cookie，当页面刷新时，去获取cookie，将用户名呈现在页面上
```
// api
router.get("/checkLogin", function (req,res,next) {
  if(req.cookies.userId){
      res.json({
        status:'0',
        msg:'',
        result:req.cookies.userName || ''
      });
  }else{
    res.json({
      status:'1',
      msg:'未登录',
      result:''
    });
  }
})
```
```
// 如果登录过了，在cookie时间内，刷新页面都会查找cookie中的用户名
checkLogin(){
  axios.get("/users/checkLogin").then((response)=>{
    var res = response.data;
    if(res.status=="0"){
      this.nickName = res.result;
    }
  })
}
```
# 渲染购物车数据
> 就是通过用户id查询用户数据，再返回用户数据中的cartList
```
router.get("/cartList", function(req, res, next) {
  var userId = req.cookies.userId
  User.findOne({userId:userId}, function(err, doc){
    if (err){
      res.json({
        status:'1',
        msg: err.message,
        result: ''
      })
    }else {
      if(doc) {
        res.json({
          status:'0',
          msg:'',
          result:doc.cartList
        })
      }
    }
  })
})
```
# 购物车删除功能
```
router.post("/cartDel", function (req, res, next) {
  var userId = req.cookies.userId, productId = req.body.productId
  User.update(
    {
      userId:userId
    }, {
      $pull:{ // $pull从数组中删除满足条件的元素
        'cartList':{
          'productId':productId
        }
      }
    }, function (err, doc) {
      if (err) {
        res.json({
          status: '1',
          msg: err.message,
          result: ''
        })
      }else {
        res.json({
          status: '0',
          msg:'',
          result: 'suc'
        })
      }
    })
})
```
# 修改商品数量
```
// 修改商品数量
router.post("/cartEdit", function (req,res,next) {
  var userId = req.cookies.userId,
    productId = req.body.productId,
    productNum = req.body.productNum,
    checked = req.body.checked
  User.update({"userId":userId,"cartList.productId":productId},{
    "cartList.$.productNum":productNum,
    "cartList.$.checked":checked
  }, function (err,doc) {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      });
    }else{
      res.json({
        status:'0',
        msg:'',
        result:'suc'
      })
    }
  })
})
```
