var express = require('express');
var router = express.Router();
require('./../util/util')

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
// 查询用户地址接口
router.get("/addressList", function (req, res, next) {
  var userId = req.cookies.userId
  User.findOne({userId:userId}, function (err, doc) {
    if (err) {
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else {
      res.json({
        status:'0',
        msg:'',
        result:doc.addressList
      })
    }
  })
})
// 设置默认地址
router.post("/setDefault", function (req, res, next) {
  var userId = req.cookies.userId,
      addressId = req.body.addressId
  if(!addressId) {
    res.json({
      status:'1003',
      msg:'addressId is null',
      result:''
    })
  } else {
    User.findOne({userId: userId}, function (err, doc) {
      if(err) {
        res.json({
          status:'1',
          msg:err.message,
          result:''
        })
      } else {
        var addressList = doc.addressList
        // 修改数据
        addressList.forEach((item) => {
          if (item.addressId == addressId) {
            item.isDefault = true
          } else {
            item.isDefault = false
          }
        })
        // 保存数据
        doc.save(function (err1, doc1) {
          if (err) {
            res.json({
              status:'1',
              msg:err.message,
              result:''
            })
          }else {
            res.json({
              status:'0',
              msg:'',
              result:''
            })
          }
        })
      }
    })
  }
})
// 删除地址
router.post("/delAddress", function (req, res, next) {
  var userId = req.cookies.userId, addressId = req.body.addressId
  User.update({
    userId: userId
  },{
    $pull: {
      'addressList': {
        'addressId': addressId
      }
    }
  }, function (err, doc) {
    if(err) {
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    } else {
      res.json({
        status:'0',
        msg:'',
        result:''
      })
    }
  })
})
// 生成订单
router.post("/payMent", function (req, res, next) {
  var userId = req.cookies.userId, 
      orderTotal = req.body.orderTotal,
      addressId = req.body.addressId
  User.findOne({userId: userId}, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      var address = '', goodsList = []
      // 获取当前用户的地址信息
      doc.addressList.forEach((item) => {
        if (addressId == item.addressId) {
          address = item
        }
      })
      // 获取用户购物车的购买商品
      doc.cartList.filter((item) => {
        if (item.checked == '1') {
          goodsList.push(item)
        }
      })

      // 创建订单id
      var r1 = Math.floor(Math.random() * 10);
      var r2 = Math.floor(Math.random() * 10);
      
      var platform = '622'
      var sysDate = new Date().Format('yyyyMMddhhmmss')
      var createDate = new Date().Format('yyyy-MM-dd hh:mm:ss')
      var orderId = platform + r1 + sysDate + r2
      var order = {
        orderId: orderId,
        orderTotal: orderTotal,
        addressInfo: address,
        goodsList: goodsList,
        orderStatus: '1',
        createDate: createDate
      }

      doc.orderList.push(order)
      doc.save(function (err1, doc1) {
         if (err1) {
          res.json({
            status: '1',
            msg: err.message,
            result: ''
          })
         } else {
          res.json({
            status: '0',
            msg: '',
            result: {
              orderId: order.orderId,
              orderTotal: order.orderTotal
            }
          })
         }
      })
    }
  })
})
module.exports = router;
