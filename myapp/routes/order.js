var express = require('express');
var router = express.Router();
var db = require("./db");

/* GET users listing. */
router.get('/', function(req, res, next) {
    db.select(1, "", 'salelist').then(rs => {
        res.render('order', {
            activeIndex: 3,
            isShow: 1,
            adminName: req.cookies.adminName,
            data: rs
        });
    })
});

router.get('/delete', function(req, res, next) {
    db.delete(req.query.id, 'salelist').then(rs => {
        res.redirect('/order');
    })
});

router.get('/update', function(req, res, next) {
    db.select(0, req.query.id, 'salelist').then(rs => {
        res.render('order_update', {
            activeIndex: 3,
            adminName: req.cookies.adminName,
            account: rs[0].account,
            info: rs[0].info,
            totalPrice: rs[0].totalPrice,
            address: rs[0].address,
            phone: rs[0].phone
        });
    })
});

router.post('/updateOrder', function (req, res, next) {
   db.update(req.body, 'salelist').then(() => {
       res.redirect('/order');
   })
});

module.exports = router;
