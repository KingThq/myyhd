var http = require( "http" );
var query = require( "querystring" );
var server;
var route;

function start( _route ) {
    route = _route;
    server = http.createServer( createServer );
    server.listen( 3001, "127.0.0.1", function () {
        console.log( "开启服务" );
    } )
}

function createServer( req, res ) {
    var str = "";
    req.on( "data", function ( _data ) {
        str += _data;
    } );
    req.on( "end", function () {
        // console.log( str );
        var obj = query.parse( str );
        res.writeHeader(200,{"content-type":"text/html","Access-Control-Allow-Origin":"*"});
        switch ( Number( obj.type ) ) {
            case  1:
                route.userRegister( obj, res );
                break;
            case 2:
                route.userLogin( obj, res );
                break;
            case 3:
                route.backShoppingList( obj, res );
                break;
            case 4:
                route.addShoppingList( obj, res );
                break;
            case 5:
                route.changeGoodsNum( obj, res );
                break;
            case 6:
                route.removeGoods( obj, res );
                break;
            case 7:
                route.selectGoods( obj, res );
                break;
            case 8:
                route.selectAllGoods( obj, res );
                break;
            case 9:
                route.province( obj, res );
                break;
            case 10:
                route.city( obj, res );
                break;
            case 11:
                route.district( obj, res );
                break;
            case 12:
                route.goodslist(obj, res);
                break;
            case 13:
                route.goodsIcon(obj, res);
                break;
            case 14:
                route.submitOrder(obj, res);
                break;
            case 15:
                route.userSelect(obj, res);
                break;
        }
    } )
}
exports.start = start;