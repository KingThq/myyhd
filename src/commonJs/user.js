var connPool = require( "./connPool" );

module.exports = {
    register: function ( obj, res ) {
        var pool = connPool();
        var result = {};

        pool.getConnection(function ( err, conn ) {
            if ( err ) {
                console.log( err.message );
                result.status = 0;
                result.message = "数据库连接错误，请稍后再试！";
                res.write( JSON.stringify( result ) );
                res.end();
                return;
            }

            var userAddSql = 'INSERT users(account, password, phone) VALUES(?, ?, ?);';
            var param = [obj.account, obj.password, obj.phone];
            conn.query( userAddSql, param, function ( err, rs ) {
                if ( err ) {
                    conn.release();
                    console.log( err.message );
                    var errorStr = err.message;
                    result.status = 0;
                    //账号重复
                    if ( errorStr.indexOf( "account" ) > -1 ) {
                        result.message = "此账号已被注册！请换个账号试试吧~";
                        //其余错误
                    } else {
                        result.message = "注册系统错误，请稍后再试！"
                    }
                    res.write( JSON.stringify( result ) );
                    res.end();
                    return;
                }

                result.status = 1;
                result.message = "注册成功~";
                result.data = obj;
                res.write( JSON.stringify( result ) );
                res.end();
                conn.release();
            } );
        });
    },

    login: function ( obj, res ) {
        var pool = connPool();
        var result = {};

        pool.getConnection(function ( err, conn ) {
            if (err) {
                console.log(err.message);
                result.status = 0;
                result.message = "数据库连接错误，请稍后再试！";
                res.write( JSON.stringify( result ) );
                res.end();
                return;
            }

            var userSelectSql = 'SELECT * FROM users WHERE account=? AND password=?;';
            var param = [obj.account, obj.password];
            conn.query( userSelectSql, param, function ( err, rs ) {
                //连接错误
                if (err) {
                    conn.release();
                    console.log(err.message);
                    result.status = 0;
                    result.message = "登录系统错误，请稍后再试！";
                    res.write( JSON.stringify( result ) );
                    res.end();
                    return;
                }

                conn.release();

                if ( rs.length < 1 ) {
                    result.status = 0;
                    result.message = "账号或密码错误，请重新登录！";
                    res.write( JSON.stringify( result ) );
                    res.end();
                    return;
                }

                result.status = 1;
                result.message = "登陆成功~";
                result.data = obj;
                res.write( JSON.stringify( result ) );
                res.end();
            });
        });
    },

    userSelect: function (obj, res) {
        var pool = connPool();
        var result = {};

        pool.getConnection(function ( err, conn ) {
            if (err) {
                console.log(err.message);
                result.status = 0;
                result.message = "数据库连接错误，请稍后再试！";
                res.write( JSON.stringify(result));
                res.end();
                return;
            }

            var userSelectSql = 'SELECT id,phone FROM users WHERE account=?';
            var param = [obj.account];
            conn.query( userSelectSql, param, function ( err, rs ) {
                //连接错误
                if (err) {
                    conn.release();
                    console.log(err.message);
                    result.status = 0;
                    result.message = "登录系统错误，请稍后再试！";
                    res.write(JSON.stringify(result));
                    res.end();
                    return;
                }

                conn.release();
                if ( rs.length < 1 ) {
                    result.status = 0;
                    result.message = "未找到该用户！";
                    res.write( JSON.stringify(result));
                    res.end();
                    return;
                }

                result.status = 1;
                result.message = "查找成功";
                result.resolve = rs;
                res.write( JSON.stringify(result));
                res.end();
            });
        });
    }
};
