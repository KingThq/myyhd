const conn = require("./connPool");

module.exports = {
    getPicture: function (obj, res) {
        //获取商品大图
        var pool = conn();
        var result;
        pool.getConnection(function (err, conn) {
            if (err) {
                conn.release();
                throw err;
            } else {
                var goodsIconSelectSql = "select icon from goodspicture where goodsid=?";
                var param = [obj.goodsId];
                conn.query(goodsIconSelectSql, param, function (err, rs) {
                    conn.release();
                    if (err) throw err;
                    // console.log(rs)
                    result = rs;
                    res.write(encodeURIComponent(JSON.stringify(result)));
                    res.end();
                })
            }
        });
    }
};
