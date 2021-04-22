var express = require('express');
var router = express.Router();
var db = require('./db');
var multiparty = require('multiparty');
var fs = require('fs');
var async = require('async');

/* GET users listing. */
router.get('/', function(req, res, next) {
    db.select(1, '', 'goodslist').then(rs => {
        res.render('product', {
            activeIndex: 2,
            isShow: 1,
            adminName: req.cookies.adminName,
            data: rs
        });
    })
});

router.get('/update', function(req, res, next) {
    // console.log(req.query);
    db.select(0, req.query.id, 'goodslist').then(rs => {
        res.render('product_update', {
            activeIndex: 2,
            adminName: req.cookies.adminName,
            id: rs[0].id,
            icon: rs[0].icon,
            info: rs[0].info,
            nowPrice: rs[0].nowPrice,
            initPrice: rs[0].initPrice,
            count: rs[0].count,
            kind: rs[0].kind
        });
    });
});

router.get('/delete', function(req, res, next) {
    db.delete(req.query.id, 'goodslist').then(() => {
        db.delete(req.query.id, 'goodspicture').then(() => {
            res.redirect('/product');
        })
    });
});

router.get('/addProduct', function(req, res, next) {
    res.render('product_add', {
        activeIndex: 2,
        adminName: req.cookies.adminName,
    });
});

router.get('/addGoodsPictures', function(req, res, next) {
    res.render('product_addPictures', {
        activeIndex: 2,
        adminName: req.cookies.adminName,
    });
});

router.post('/addGoods', function (req, res, next) {
    var form = new multiparty.Form();
    form.uploadDir = "../img/uploadtemp";
    form.parse(req, function (err, fields, files) {
        // console.log(fields)
        var insertObj = {
            pid: fields.pid[0],
            icon: '',
            info: fields.info[0],
            nowPrice: fields.nowPrice[0],
            initPrice: fields.initPrice[0],
            count: fields.count[0],
            kind: fields.kind[0]
        };
        if (files.icon[0].originalFilename !== "") {
            // console.log(files)
            // 处理图片
            var files1 = files.icon[0];
            var originalFilename = files1.originalFilename;
            var temPath = files1.path;
            var newPath = '../img/goodsIcon/' + originalFilename;

            // 准备读写操作
            // 准备读取临时文件路径
            var fileReadStream = fs.createReadStream(temPath);
            // 准备写入正式文件路径
            var fileWriteStream = fs.createWriteStream(newPath);
            // 准备就绪，开启管道流
            fileReadStream.pipe(fileWriteStream);
            // 监听写入事件，一旦写入完毕，执行回调函数
            fileWriteStream.on("close", function () {
                // 删除临时文件夹中的图片
                fs.unlinkSync(temPath);
                console.log('copy over');
                insertObj.icon = newPath.slice(1);
                // console.log(insertObj)
                db.insert(insertObj, 'goodslist').then(() => {
                    res.redirect('/product');
                })
            })
        } else {
            insertObj.icon = './img/goodsIcon/default.jpg';
            // console.log(obj)
            db.insert(insertObj, 'goodslist').then(() => {
                // console.log(req.body)
                res.redirect('/product');
            })
        }

    })
});

router.post('/updateProduct', function (req, res, next) {
    var form = new multiparty.Form();
    form.uploadDir = "../img/uploadtemp";
    form.parse(req, function (err, fields, files) {
        // console.log(fields)
        // console.log(files.icon)
        var _kind;
        if (fields.kind[0] === "生活用品") {
            _kind = 1;
        } else if (fields.kind[0] === "零食小吃") {
            _kind = 2;
        } else if (fields.kind[0] === "手机数码") {
            _kind = 3;
        } else {
            _kind = 4;
        }
        var updateObj = {
            pid: fields.pid[0],
            icon: '',
            info: fields.info[0],
            nowPrice: fields.nowPrice[0],
            initPrice: fields.initPrice[0],
            count: fields.count[0],
            kind: _kind
        };
        if (files.icon[0].originalFilename !== "") {
            // console.log(files)
            // 处理图片
            var files1 = files.icon[0];
            var originalFilename = files1.originalFilename;
            var temPath = files1.path;
            var newPath = '../img/goodsIcon/' + originalFilename;

            // 准备读写操作
            // 准备读取临时文件路径
            var fileReadStream = fs.createReadStream(temPath);
            // 准备写入正式文件路径
            var fileWriteStream = fs.createWriteStream(newPath);
            // 准备就绪，开启管道流
            fileReadStream.pipe(fileWriteStream);
            // 监听写入事件，一旦写入完毕，执行回调函数
            fileWriteStream.on("close", function () {
                // 删除临时文件夹中的图片
                fs.unlinkSync(temPath);
                console.log('copy over');
                updateObj.icon = newPath.slice(1);
                // console.log(updateObj)
                db.update(updateObj, 'goodslist').then(() => {
                    res.redirect('/product');
                })
            })
        } else {
            db.select(0, fields.pid[0], 'goodslist').then(rs => {
                // console.log(rs)
                updateObj.icon = rs[0].icon;
                // console.log(updateObj)
                db.update(updateObj, 'goodslist').then(() => {
                    res.redirect('/product');
                })
            });
        }
    })
});

router.post('/addGoodsPictures', function (req, res, next) {
    var form = new multiparty.Form();
    form.uploadDir = "../img/uploadtemp";
    form.parse(req, function (err, fields, files) {
        // console.log(fields);
        // console.log(files.icon[0]);
        var insertObj = {
            pid: fields.pid[0],
            icon: ''
        };
        var iconOjb0 = files.icon[0];
        // console.log(iconOjb0)
        var iconOjb1 = files.icon[1];
        var iconOjb2 = files.icon[2];
        if (iconOjb0.originalFilename !== "") {
            // 处理图片
            var files1 = iconOjb0;
            var originalFilename = files1.originalFilename;
            var temPath = files1.path;
            var newPath = '../img/goodsDetails/' + originalFilename;

            // 准备读写操作
            // 准备读取临时文件路径
            var fileReadStream = fs.createReadStream(temPath);
            // 准备写入正式文件路径
            var fileWriteStream = fs.createWriteStream(newPath);
            // 准备就绪，开启管道流
            fileReadStream.pipe(fileWriteStream);
            // 监听写入事件，一旦写入完毕，执行回调函数
            fileWriteStream.on("close", function () {
                // 删除临时文件夹中的图片
                fs.unlinkSync(temPath);
                console.log('copy over');
                insertObj.icon = newPath.slice(1);
                // console.log(insertObj)
                db.insert(insertObj, 'goodspicture').then(() => {
                    if (iconOjb1.originalFilename !== "") {
                        // 处理图片
                        var files1 = iconOjb1;
                        var originalFilename = files1.originalFilename;
                        var temPath = files1.path;
                        var newPath = '../img/goodsDetails/' + originalFilename;

                        // 准备读写操作
                        // 准备读取临时文件路径
                        var fileReadStream = fs.createReadStream(temPath);
                        // 准备写入正式文件路径
                        var fileWriteStream = fs.createWriteStream(newPath);
                        // 准备就绪，开启管道流
                        fileReadStream.pipe(fileWriteStream);
                        // 监听写入事件，一旦写入完毕，执行回调函数
                        fileWriteStream.on("close", function () {
                            // 删除临时文件夹中的图片
                            fs.unlinkSync(temPath);
                            console.log('copy over');
                            insertObj.icon = newPath.slice(1);
                            // console.log(insertObj)
                            db.insert(insertObj, 'goodspicture').then(() => {
                                if (iconOjb2.originalFilename !== "") {
                                    // 处理图片
                                    var files1 = iconOjb2;
                                    var originalFilename = files1.originalFilename;
                                    var temPath = files1.path;
                                    var newPath = '../img/goodsDetails/' + originalFilename;

                                    // 准备读写操作
                                    // 准备读取临时文件路径
                                    var fileReadStream = fs.createReadStream(temPath);
                                    // 准备写入正式文件路径
                                    var fileWriteStream = fs.createWriteStream(newPath);
                                    // 准备就绪，开启管道流
                                    fileReadStream.pipe(fileWriteStream);
                                    // 监听写入事件，一旦写入完毕，执行回调函数
                                    fileWriteStream.on("close", function () {
                                        // 删除临时文件夹中的图片
                                        fs.unlinkSync(temPath);
                                        console.log('copy over');
                                        insertObj.icon = newPath.slice(1);
                                        // console.log(insertObj)
                                        db.insert(insertObj, 'goodspicture').then(() => {
                                            res.redirect('/product');
                                        })
                                    })
                                }
                            })
                        })
                    }
                })
            })
        }
    });
});

module.exports = router;
