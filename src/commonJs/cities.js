var fs = require("fs");
var cities = {};
fs.readFile("../../cities.json", "utf-8", function (err, data) {
    if (err) throw err;
    cities = JSON.parse(data);
});

module.exports = {
    province: function ( obj, res ) {
        var resArr = [];
        for(var key0 in cities){
            resArr.push(key0);
        }
        // console.log(JSON.stringify({ resArr: resArr }))
        res.write(encodeURIComponent(JSON.stringify({ resArr: resArr })));
        res.end();
    },
    city: function (obj, res) {
        var resArr = [];
        for (var key1 in cities[obj.province]) {
            resArr.push(key1);
        }
        res.write(encodeURIComponent(JSON.stringify({ resArr: resArr })));
        res.end();
    },
    district: function (obj, res) {
        var resArr = [];
        cities[obj.province][obj.city].forEach(function (t) {
            resArr.push(t);
        });
        res.write(encodeURIComponent(JSON.stringify({ resArr: resArr })));
        res.end();
    }
};
