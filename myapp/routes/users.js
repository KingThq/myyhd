var express = require('express');
var db = require('./db');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    db.select(1, '', 'users').then(rs => {
        res.render('users', {
            activeIndex: 1,
            isShow: 1,
            adminName: req.cookies.adminName,
            data: rs
        });
    });
});

/*
* 用户编辑页面显示的信息
* */
router.get('/update', function(req, res, next) {
    // console.log(req.query);
    db.select(0, req.query.id, 'users').then(rs => {
        res.render('users_update', {
            activeIndex: 1,
            adminName: req.cookies.adminName,
            id: rs[0].id,
            account: rs[0].account,
            password: rs[0].password,
            phone: rs[0].phone
        });
    });
});

router.get('/delete', function(req, res, next) {
    db.delete(req.query.id, 'users').then(() => {
        res.redirect('/users');
    })
});

router.post('/addUser', function (req, res, next) {
    db.insert(req.body, 'users').then(() => {
        res.redirect('/users');
    })
});

router.post('/updateUser', function (req, res, next) {
    let updateObj;
    db.select(0, req.body.uid, "users").then(rs => {
        // console.log(rs[0].password)
        if (rs[0].password === req.body.password) {
            updateObj = {
                //未修改密码时，不需要对密码再次加密
                data: req.body,
                status: 0
            }
        } else {
            updateObj = {
                //修改密码时，需要对密码再次加密
                data: req.body,
                status: 1
            }
        }
        db.update(updateObj, 'users').then(() => {
            // console.log(req.body)
            res.redirect('/users');
        });
    });
});

module.exports = router;
