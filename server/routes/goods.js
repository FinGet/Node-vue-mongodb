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

module.exports = router