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

module.exports = router