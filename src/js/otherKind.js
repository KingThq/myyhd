function init() {
    //轮播图
    carousel( $( "div.banner" )[0] );
    //商品列表
    let parent = $( "div.goods" ).eq(0);
    $.ajax({
        type: "POST",
        url: "http://127.0.0.1:3001",
        data: {
            type: 12,
            kind: 4
        },
        success: function (_data) {
            let data = JSON.parse(decodeURIComponent(_data));
            // console.log(data.resolute);
            for ( let i = 0; i < data.resolute.length; i ++ ) {
                new GoodsItem( data.resolute[i], parent );
            }
        }
    });
    //返回顶部
    new BackTop( $( "div.back_top" ).eq(0) );
}