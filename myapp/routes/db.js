const connPool = require('./connPool');
const md5 = require("md5");
const pool = connPool();

const db = {
    select (selectType, id, whichTable) {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, conn) => {
                if (err) {
                    conn.release();
                    throw err;
                }
                let userSelectSql, param;
                if (selectType) {
                    //selectType 为 1，表示查询整个表
                    userSelectSql = 'SELECT * FROM ' + whichTable;
                    param = [];
                } else {
                    //selectType 为 0，根据id查询对应的用户
                    userSelectSql = 'SELECT * FROM ' + whichTable + ' WHERE id=?';
                    param = [id];
                }
                conn.query(userSelectSql, param, (err, rs) => {
                    conn.release();
                    console.log('conn, query', userSelectSql, param);
                    if (err) throw err;
                    console.log('query success', rs);
                    resolve(rs);
                })
            })
        })
    },
    selectAdmin (selectObj) {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, conn) => {
                if (err) {
                    conn.release();
                    throw err;
                }
                let adminSelectSql = 'SELECT account,password,degree FROM admin WHERE account=? AND password=?';
                let param = [selectObj.adminname, selectObj.adminpassword];
                conn.query(adminSelectSql, param, (err, rs) => {
                    conn.release();
                    if (err) throw err;
                    resolve(rs);
                })
            })
        })
    },
    delete (id, whichTable) {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, conn) => {
                if (err) {
                    conn.release();
                    throw err;
                }
                let userDeleteSql;
                if (whichTable === 'goodspicture') {
                    userDeleteSql = 'DELETE FROM ' + whichTable + ' WHERE goodsid=?';
                } else {
                    userDeleteSql = 'DELETE FROM ' + whichTable + ' WHERE id=?';
                }
                let param = [id];
                conn.query(userDeleteSql, param, (err, rs) => {
                    conn.release();
                    if (err) throw err;
                    resolve();
                })
            })
        })
    },
    insert (insertObj, whichTable) {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, conn) => {
                if (err) {
                    conn.release();
                    throw err;
                }
                let userInsertSql, param;
                if (whichTable === "users") {
                    userInsertSql = 'INSERT ' + whichTable + '(account,password,phone) VALUES(?,?,?)';
                    param = [insertObj.account, md5(md5(insertObj.password)),insertObj.phone];
                } else if (whichTable === 'goodslist') {
                    userInsertSql = 'INSERT ' + whichTable + '(id,icon,info,nowPrice,initPrice,count,kind) VALUES(?,?,?,?,?,?,?)';
                    param = [insertObj.pid, insertObj.icon, insertObj.info, insertObj.nowPrice, insertObj.initPrice, insertObj.count,insertObj.kind];
                } else if (whichTable === 'goodspicture') {
                    userInsertSql = 'INSERT ' + whichTable + '(goodsid, icon) VALUES(?,?)';
                    param = [insertObj.pid, insertObj.icon];
                } else if (whichTable === "admin") {
                    userInsertSql = 'INSERT ' + whichTable + '(account, password, degree) VALUES(?, ?, ?)';
                    param = [insertObj.account, insertObj.password, insertObj.degree];
                }
                conn.query(userInsertSql, param, (err, rs) => {
                    conn.release();
                    if (err) throw err;
                    resolve();
                })
            })
        })
    },
    update (updateObj, whichTable) {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, conn) => {
                if (err) {
                    conn.release();
                    throw err;
                }
                let userUpdateSql, param;
                if (whichTable === "users") {
                    if (updateObj.status === 0) {
                        userUpdateSql = 'UPDATE ' + whichTable + ' SET phone=? where id=?';
                        param = [updateObj.data.phone, updateObj.data.uid];
                    } else {
                        userUpdateSql = 'UPDATE ' + whichTable + ' SET password=?,phone=? where id=?';
                        param = [md5(md5(updateObj.data.password)), updateObj.data.phone, updateObj.data.uid];
                    }
                } else if (whichTable === 'goodslist') {
                    userUpdateSql = 'UPDATE ' + whichTable + ' SET icon=?,info=?,nowPrice=?,initPrice=?,count=?,kind=? where id=?';
                    param = [updateObj.icon, updateObj.info, updateObj.nowPrice, updateObj.initPrice, updateObj.count, updateObj.kind, updateObj.pid];
                } else if (whichTable === 'salelist') {
                    userUpdateSql = 'UPDATE ' + whichTable + ' SET address=? where id=?';
                    param = [updateObj.addr, updateObj.saleId];
                }
                else if (whichTable === 'admin') {
                    userUpdateSql = 'UPDATE ' + whichTable + ' SET password=?, degree=? where id=?';
                    param = [updateObj.password, updateObj.degree, updateObj.adminId];
                }
                conn.query(userUpdateSql, param, (err, rs) => {
                    conn.release();
                    if (err) throw err;
                    resolve();
                })
            })
        })
    }
};

module.exports = db;