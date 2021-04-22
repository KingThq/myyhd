const connPool = require("./connPool");
let goodsData;
let shoppingList = [];

const getGoodsData = (function () {
    const getFun = (callback) => {
        let pool = connPool();
        pool.getConnection(function (err, conn) {
            if (err) {
                throw err;
            } else {
                let goodsSelectSql = "SELECT * FROM goodslist";
                conn.query(goodsSelectSql, function (err, rs) {
                    conn.release();
                    if (err) throw err;
                    goodsData = rs;
                    callback && callback();
                    // console.log(goodsData);
                })
            }
        })
    };

    getFun();

    return getFun;
})();

/*let goodsData=[
    { id: 1001, icon: "./img/xiaomaihufu.jpg", info: "袋鼠妈妈孕妇护肤品套装小麦补水保湿6件套", nowPrice: "368", initPrice: "658", count: 100,kind: 1 },
    { id: 1002, icon: "./img/shushida.jpg", info: "舒适达多效护理抗敏感牙膏", nowPrice: "59.9", initPrice: "200", count: 100,kind: 1 },
    { id: 1003, icon: "./img/baiselianren.jpg", info: "北海道白色恋人12枚", nowPrice: "55", initPrice: "128", count: 100,kind: 1 },
    { id: 1004, icon: "./img/redaiyinxiang.jpg", info: "热带印象 泰式椰汁", nowPrice: "88", initPrice: "144", count: 100,kind: 1 },
    { id: 1005, icon: "./img/xinyamaojin.jpg", info: "新亚毛巾 新疆长绒棉加厚毛巾", nowPrice: "53.1", initPrice: "139", count: 100,kind: 1 },
    { id: 1006, icon: "./img/baicaoji.jpg", info: "佰草集新美肌梦幻曲面膜", nowPrice: "129", initPrice: "190", count: 100,kind: 1 },
    { id: 1007, icon: "./img/sanzhisongshu.jpg", info: "三只松鼠休闲零食特产混合装", nowPrice: "21.9", initPrice: "31", count: 100,kind: 1},
    { id: 1008, icon: "./img/yusan.png", info: "雨伞全自动十骨上午折叠伞", nowPrice: "29.9", initPrice: "69", count: 100,kind: 1 },
    { id: 1009, icon: "./img/ganghuamo.jpg", info: "苹果X/XS/XR钢化膜iPhone", nowPrice: "23.9", initPrice: "48", count: 100,kind: 1 }
];*/

module.exports = {
    //返回数据库中的商品
    getGoods: function (obj, res) {
        let result = { error: null, type: obj.type };
        getGoodsData(() => {
            result.resolute = goodsData.filter(function (t) {
                return t.kind === Number(obj.kind);
            });
            res.write(encodeURIComponent(JSON.stringify(result)));
            res.end();
        });
    },

    //返回购物车列表
    backShoppingList: function ( obj, res ) {
        let result = { error: null, type: obj.type };
        result.resolute = shoppingList;
        res.write(encodeURIComponent(JSON.stringify(result)));
        res.end();
    },

    //向购物车中添加商品
    addShoppingList: function ( obj, res ) {
        let result = { error: null, type: obj.type };
        let pool = connPool();
        pool.getConnection(function (err, conn) {
            if (err) {
                throw err;
            } else {
                let goodsUpdateSql = "UPDATE goodslist SET count=? where id=?";
                let param = [Number(obj.restNum), Number(obj.id)];
                conn.query(goodsUpdateSql, param, function (err, rs) {
                    conn.release();
                    if (err) throw err;
                });
            }
        });
        if( !addShoppingCar(Number(obj.id ), Number( obj.num )) ){
           shoppingList.forEach(function (t) {
               if ( t.id === Number(obj.id ) ) {
                   t.num.subtotal += Number( obj.num );
                   t.num.restNum -= Number( obj.num );
                   if (t.num.restNum < 1) {
                       t.num.restNum = 0;
                   }
               }
           })
        }
        result.resolute = shoppingList;
        res.write(encodeURIComponent(JSON.stringify(result)));
        res.end();
    },

    //改变商品数量
    changeGoodsNum: function ( obj, res ) {
        let result = { error: null, type: obj.type };
        shoppingList.forEach(function (t) {
            if ( t.id === Number( obj.id ) ) {
                t.num.subtotal = Number(obj.num);
                t.num.restNum -= Number(obj.changeNum);
                if (t.num.restNum < 1) {
                    t.num.restNum = 0;
                }
                if ( t.selected === "true" ) {
                    t.sum = t.num.subtotal * t.price;
                }
                let pool = connPool();
                pool.getConnection(function (err, conn) {
                    if (err) {
                        throw err;
                    } else {
                        let goodsUpdateSql = "UPDATE goodslist SET count=? where id=?";
                        let param = [t.num.restNum, Number(obj.id)];
                        conn.query(goodsUpdateSql, param, function (err, rs) {
                            conn.release();
                            if (err) throw err;
                        });
                    }
                });
            }
        });
        result.resolute = shoppingList;
        res.write(encodeURIComponent(JSON.stringify(result)));
        res.end();
    },

    //删除商品
    removeGoods: function ( obj, res ) {
        let result = { error: null, type: obj.type };
        shoppingList.forEach(function (t) {
           if (t.id === Number(obj.id)) {
               let pool = connPool();
               // console.log(t.num.restNum, t.num.subtotal)
               let _count = t.num.restNum + t.num.subtotal;
               pool.getConnection(function (err, conn) {
                   if (err) {
                       throw err;
                   } else {
                       let goodsUpdateSql = "UPDATE goodslist SET count=? where id=?";
                       let param = [_count, Number(obj.id)];
                       conn.query(goodsUpdateSql, param, function (err, rs) {
                           conn.release();
                           if (err) throw err;
                       });
                   }
               });
           }
        });
        let shops = shoppingList.filter(function (t) {
            return t.id !== Number(obj.id);
        });
        if(shops.length === shoppingList.length){
            result.error = {error:"删除内容不存在"};
        } else {
            shoppingList = shops;
        }
        result.resolute = shoppingList;
        res.write(encodeURIComponent(JSON.stringify(result)));
        res.end();
    },

    //选中商品
    selectGoods: function ( obj, res ) {
        let result = { error: null, type: obj.type };
        shoppingList.forEach(function (t) {
            if(t.id === Number( obj.id )){
                t.selected = obj.selected;
                if ( t.selected === "true" ) {
                    t.sum = t.num.subtotal * t.price;
                } else {
                    t.sum = 0;
                }
            }
        });
        result.resolute = shoppingList;
        if ( !result.resolute ) {
            result.error = {error:"未选中该商品"};
        }
        res.write(encodeURIComponent(JSON.stringify(result)));
        res.end();
    },

    //全选
    selectAllGoods: function ( obj, res ) {
        let result = { error: null, type: obj.type };
        shoppingList.forEach(function (t) {
            t.selected = obj.selected;
            if ( t.selected === "true" ) {
                t.sum = t.num.subtotal * t.price;
            } else {
                t.sum = 0;
            }
        });
        // console.log(shoppingList)
        result.resolute = shoppingList;
        res.write(encodeURIComponent(JSON.stringify(result)));
        res.end();
    }
};

function addShoppingCar( id, _num ) {
    id = Number( id );
    let arr = shoppingList.filter(function (t) {
        return t.id === id;
    });
    //如果这个商品存在，不需要重复加入购物车，只要改变数量
    if ( arr.length > 0 ) return false;
    getGoodsData(() => {
        let data = goodsData.filter(function (t) {
            return t.id === id;
        })[0];
        shoppingList.push({
            selected: false,
            id: data.id,
            icon: data.icon,
            info:data.info,
            price:Number(data.nowPrice),
            num: { subtotal: _num, restNum: data.count},
            sum:0,
            deleted:false
        });
    });
    return true;
}
