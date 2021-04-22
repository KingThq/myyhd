var user = require( "./user" );
var shopCar = require( "./shopCarModule" );
var cities = require( "./cities" );
var goodsPicture = require("./goodsPicture");
var order = require("./order");
var server = require( "./server" );
var obj = {
    userRegister: user.register,
    userLogin: user.login ,
    userSelect: user.userSelect,
    goodslist: shopCar.getGoods,
    backShoppingList: shopCar.backShoppingList,
    addShoppingList: shopCar.addShoppingList,
    changeGoodsNum: shopCar.changeGoodsNum,
    removeGoods: shopCar.removeGoods,
    selectGoods: shopCar.selectGoods,
    selectAllGoods: shopCar.selectAllGoods,
    province: cities.province,
    city: cities.city,
    district: cities.district,
    goodsIcon: goodsPicture.getPicture,
    submitOrder: order.submitOrder
};
server.start( obj );