var express = require('express');
var router = express.Router();

var User = require('./../models/user')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// 登录
router.post("/login", function (req,res,next) {
  var param = {
    userName:req.body.userName,
    userPwd:req.body.userPwd
  }
  User.findOne(param, function (err,doc) {
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
        res.json({
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
// 登出
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
// 校验
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
// 查询当前用户的购物车数据
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

// 购物车删除
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
router.post("/editCheckAll", function (req, res, next) {
  var userId = req.cookies.userId,
      checkAll = req.body.checkAll?'1':'0'
  User.findOne({userId:userId}, function (err, doc) {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      });
    }else{
      if (doc) {
        doc.cartList.forEach((item) => {
          item.checked = checkAll
        })
        doc.save(function (err1, doc1) {
          if (err1) {
            res.json({
              status:'1',
              msg:err1.message,
              result:''
            })
          } else {
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
})
module.exports = router;
