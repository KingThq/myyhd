var connPool = require("./connPool");

module.exports = {
    submitOrder: function (obj, res) {
        var pool = connPool();
        var result;

        pool.getConnection(function ( err, conn ) {
            if (err) {
                console.log(err.message);
                result = "数据库连接错误，请稍后再试！";
                res.write(JSON.stringify(encodeURIComponent(result)));
                res.end();
                return;
            }
            var orderAddSql = 'INSERT salelist(account, info, address, phone, totalPrice) VALUES(?, ?, ?, ?, ?);';
            var param = [ obj.account, obj.info, obj.address, obj.phone, obj.totalPrice];
            conn.query(orderAddSql, param, function (err, rs) {
                if (err) {
                    conn.release();
                    result = "订单提交错误，请稍后再试！";
                    res.write(JSON.stringify(encodeURIComponent(result)));
                    res.end();
                    return;
                }
                conn.release();
                result = "订单提交成功！";
                res.write(JSON.stringify(encodeURIComponent(result)));
                res.end();
            })
        })
    }
};