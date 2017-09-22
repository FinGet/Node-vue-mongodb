var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
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
// 查询商品列表数据
router.get("/list", function (req, res, next) {
    // res.send('hello,goods list')
    // req.param接收前端传过来的参数
    let page = parseInt(req.param("page"))
    // 通过req.param()取到的值都是字符串，而limit()需要一个数字作为参数
    let pageSize = parseInt(req.param("pageSize"))
    let priceLevel = req.param("priceLevel")
    let sort = req.param("sort") //排序
    let params = {}
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
    let skip = (page-1)*pageSize // 分页跳过几条
    let goodsModel = Goods.find(params).skip(skip).limit(pageSize)
    goodsModel.sort({'salePrice':sort}) // mongoDB是非关系型数据，查询条件必须是对象
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

// 加入购物车
router.post("/addCart", function (req, res, next) {
  // 先拿到当前用户的数据
  var userId = '100000077',productId = req.body.productId
  var User = require('../models/user')

  // findOne()只拿当前第一个用户
  User.findOne({userId:userId}, function (err, userDoc) {
    if (err) {
      res.json({
        status:'1',
        msg:err.message
      })
    }else {
      // console.log(userDoc)
      if(userDoc) {
        let goodsItem = '' // 定义一个变量
        // 遍历请求到的data里有没有当前这个商品，如果有的话，则数量+1
        userDoc.cartList.forEach(function (item) {
          if (item.productId == productId) {
            goodsItem = item
            item.productNum ++
          }
        })
        if (goodsItem) {
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
        }else {
          Goods.findOne({productId:productId}, function (err1, doc) { // 通过productId去查询数据，而不是直接通过前端把所有数据传过来
            if (err1) {
              res.json({
                status:'1',
                msg:err1.message
              })
            } else {
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
            }
          })
        }
      }
    }
  })
})

module.exports = router
