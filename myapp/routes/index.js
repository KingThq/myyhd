var express = require('express');
var router = express.Router();
const db = require('./db');

/* GET home page. */
router.get('/', function(req, res, next) {
  // console.log(req.cookies.adminName)
    db.select(1, "", "admin").then(rs => {
        let degree = -1;
        rs.forEach(adminUserInfo => {
            if (adminUserInfo.account === req.cookies.adminName) {
                degree = adminUserInfo.degree;
            }
        });
        res.render('index', {
            activeIndex: 0,
            adminName: req.cookies.adminName,
            data: rs,
            degree: Number(degree)
        });
    });
});

router.get('/login', function (req, res, next) {
   res.render('login');
});

router.post('/loginAction', function (req, res, next) {
    db.selectAdmin(req.body).then(rs => {
        if (rs.length === 0) {
            //没有该管理员
            res.redirect('/login');
        } else {
            //有这个管理员
            res.cookie('loginAction', 'ok');
            res.cookie('adminName', req.body.adminname);
            res.cookie("degree", rs[0].degree);
            res.redirect('/');
        }
    })
});

router.post('/addAdmin', function (req, res, next) {
    // console.log(req.body)
    db.insert(req.body, "admin").then(() => {
        res.redirect('/');
    });
});

router.get('/adminDelete', function (req, res, next) {
    db.delete(req.query.id, 'admin').then(() => {
        res.redirect('/');
    });
});

router.get('/adminUpdate', function(req, res, next) {
    // console.log(req.query);
    db.select(0, req.query.id, 'admin').then(rs => {
        res.render('admin_update', {
            activeIndex: 0,
            adminName: req.cookies.adminName,
            id: rs[0].id,
            account: rs[0].account,
            password: rs[0].password,
            degree: rs[0].degree
        });
    });
});

router.post('/updateAdmin', function (req, res, next) {
    db.update(req.body, 'admin').then(() => {
        // console.log(req.body)
        res.redirect('/');
    })
});

module.exports = router;
