class GoodsItem {
    constructor( _props, parent ) {
        this.props = _props;
        this.goods = this.initCreate( parent );
        this.render( _props );
    }

    initCreate( parent ) {
        if ( this.goods ) return this.goods;
        let divWrap = $( "<div></div>" ).appendTo( parent )
            .css( {
                height: "389px",
                width: "282px",
                backgroundColor: "#ffffff",
                margin: "10px 20px 0 0",
                float: "left",
                borderRadius: "5px"
            } );
        let divInner = $( "<div></div>" )
            .css({
                padding: "15px 20px",
                height: "318px"
            })
            .appendTo( divWrap );
        this.createImgCon( divInner );
        this.createBottomInfo( divInner );
        this.createBuyBn( divWrap );
        return divWrap;
    }

    createImgCon( divInner ) {
        let imgCon = $( "<div></div>" ).appendTo( divInner )
            .css({
                height: "282px",
                width: "242px",
                position: "relative"
            });
        this.goodsImg = new Image();
        $( this.goodsImg ).css({
                width: "242px",
                height: "242px",
                cursor: "pointer",
                transition: "all 0.5s",
                position: "absolute",
                top: "8px"
            })
            .appendTo( imgCon )
            .hover( function () {
                $( this ).css( {
                    top: 0
                } );
            }, function () {
                $( this ).css( {
                    top: "8px"
                } );
            } );
        this.imgClickBind = this.imgClickHandler.bind( this );
        $( this.goodsImg ).on( "click", this.imgClickBind );
        this.goodsInfo = $( "<p></p>" ).css( {
            height: "22px",
            width: "242px",
            color: "#333333",
            fontSize: "14px",
            lineHeight: "22px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            position: "absolute",
            bottom: "0px"
        } ).appendTo( imgCon );
    }

    createBottomInfo( divInner ) {
        let price_num_con = $( "<div></div>" )
            .css({
                marginTop: "10px",
                lineHeight: "20px",
                height: "20px"
            }).appendTo( divInner );
        let priceCon = $( "<div></div>" ).css({
            float: "left"
        }).appendTo( price_num_con )
            .addClass( "clearfix" );
        this.nowPrice = $( "<span></span>" ).css({
            color: "#ff3f34",
            fontSize: "18px",
            fontWeight: "bold"
        }).appendTo( priceCon );
        this.initPrice = $( "<span></span>" ).css({
            color: "#8c8c8c",
            fontSize: "14px",
            textDecoration: "line-through",
            marginLeft: "5px"
        }).appendTo( priceCon );

        let numCon = $( "<div></div>" ).css({
            float: "right"
        }).appendTo( price_num_con )
            .addClass( "clearfix" );
        $( "<span></span>" ).text( "剩余数量:" ).appendTo( numCon );
        this.goodsNum = $( "<span></span>" ).css({
            marginLeft: "10px"
        }).appendTo( numCon );
    }

    createBuyBn( divWrap ) {
        let buyBn = $( "<div></div>" ).css({
            height: "40px",
            width: "100%",
            backgroundColor: "#fd5b45",
            color: "#ffffff",
            fontSize: "16px",
            textAlign: "center",
            lineHeight: "40px",
            borderRadius: "5px",
            cursor: "pointer"
        }).text( "加入购物车" )
            .appendTo( divWrap );
        this.clickBind = this.clickHandler.bind( this );
        buyBn.on( "click", this.clickBind );
    }

    imgClickHandler( e ) {
        sessionStorage.goodsId = this.id;
        sessionStorage.goodsInfo = this.goodsInfo.text();
        sessionStorage.nowPrice = this.nowPrice.text();
        sessionStorage.restNum = this.props.count - 1;
        window.open("http://localhost:63342/yhd/goodsDetails.html", "_blank");
    }

    clickHandler( e ) {
        if ( this.props.count <= 0 ) return;
        this.props.count--;
        //点击向购物车中添加数据
        $.ajax({
            type: "POST",
            url: "http://127.0.0.1:3001",
            data: {
                type: 0x04,
                id: this.id,
                num: 1,
                restNum: this.props.count
            },
            success:  () => {
                this.goodsNum.text(this.props.count);
                sessionStorage.restNum = this.props.count;
            }
        });
    }

    render( _props ) {
        this.id = _props.id;
        this.goodsImg.src = _props.icon;
        this.goodsInfo.text( _props.info );
        this.nowPrice.text( "￥" + Number( _props.nowPrice ).toFixed(2) );
        this.initPrice.text( "￥" + _props.initPrice );
        this.goodsNum.text( _props.count );
    }
}