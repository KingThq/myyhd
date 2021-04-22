var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productRouter = require('./routes/product');
var orderRouter = require('./routes/order');

var app = express();
var adminManage = {
    0: ['', 'users','product','order'],
    1: ['', 'users'],
    2: ['', 'product'],
    3: ['', 'order']
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.all('*', (req, res, next) => {
    if (req.url === '/login' || req.url === '/loginAction') {
        next();
        return;
    }
    if (req.cookies.loginAction === "ok") {
        var url = req.url.split('/')[1];
        var degree =  parseInt(req.cookies.degree) ;
        switch (degree) {
            case 0:
                //超级管理员
                next();
                break;
            case 1:
                //管理用户信息管理员
                if (adminManage[degree].indexOf(url) !== -1) {
                next();
            } else {
                    if (url.indexOf("product") !== -1) {
                        res.render('product', {
                            activeIndex: 2,
                            adminName: req.cookies.adminName,
                            isShow: 0
                        });
                    } else if (url.indexOf("order") !== -1) {
                        res.render('order', {
                            activeIndex: 3,
                            adminName: req.cookies.adminName,
                            isShow: 0
                        });
                    }
                    next();
            }
                break;
            case 2:
                //管理商品信息管理员
                if (adminManage[degree].indexOf(url) !== -1) {
                    next();
                } else {
                    if (url.indexOf("users") !== -1) {
                        res.render('users', {
                            activeIndex: 1,
                            adminName: req.cookies.adminName,
                            isShow: 0
                        });
                    } else if (url.indexOf("order") !== -1){
                        res.render('order', {
                            activeIndex: 3,
                            adminName: req.cookies.adminName,
                            isShow: 0
                        });
                    }
                    next();
                }
                break;
            case 3:
                //管理订单信息管理员
                if (adminManage[degree].indexOf(url) !== -1) {
                    next();
                } else {
                    if (url.indexOf("users") !== -1) {
                        res.render('users', {
                            activeIndex: 1,
                            adminName: req.cookies.adminName,
                            isShow: 0
                        });
                    } else if (url.indexOf("product") !== -1) {
                        res.render('product', {
                            activeIndex: 2,
                            adminName: req.cookies.adminName,
                            isShow: 0
                        });
                    }
                    next();
                }
                break;
        }
    } else {
        res.redirect('/login');
    }
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/product', productRouter);
app.use('/order', orderRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
