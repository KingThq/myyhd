/*
* 商品放大镜
* */
class GoodsMagnifier{
    constructor( arr, parent ) {
        this.render( arr );
        this.pre = "";
        this.divWrap = this.initCreate( parent );
    }

    initCreate( parent ) {
        if ( this.divWrap ) return this.divWrap;
        let divWrap = $( "<div></div>" ).css({
            position: "relative",
            width: "402px"
        }).appendTo( parent );

        //左边大图
        this.createLeftBigImg( divWrap );
        //右边显示放大图片的容器
        this.createRightBigImg( divWrap );
        //下面显示小图片的外容器
        this.createIconImgList( divWrap );
        return divWrap;
    }

    createLeftBigImg( divWrap ) {
        this.leftBigImg = $("<div></div>").css({
            width: "400px",
            height: "400px",
            border: "1px solid #dddddd",
            position: "relative"
        }).appendTo( divWrap );

        this.createMask( this.leftBigImg );
        this.mouseBind = this.mouseHandler.bind( this );
        this.leftBigImg.on( "mousemove mouseleave mouseenter", this.mouseBind );
    }

    createMask( parent ) {
        //幕布的大小为：图片缩放的比例 * 父容器的大小
        let wh = parseInt( 400 / 600 * 400 );
        this.mask = $( "<div></div>" ).css({
            width:  wh + "px",
            height: wh + "px",
            backgroundColor: "rgba(255,192,0,0.3)",
            position: "absolute",
            display: "none"
        }).appendTo( parent );
    }

    createRightBigImg( divWrap ) {
        this.rightBigImg = $( "<div></div>" ).css({
            width: "400px",
            height: "400px",
            position: "absolute",
            top: 0,
            left: "402px",
            display: "none",
            border: "1px solid #dddddd",
            zIndex: 999
        }).appendTo( divWrap );
    }

    createIconImgList( divWrap ) {
        //存放所有小图片的父容器
        this.iconImgList = $( "<div></div>" ).css({
            fontSize: 0,
            height: "52px",
            width: "210px",
            margin: "10px 0 20px 60px"
        }).appendTo( divWrap );

        let list = Array.from( this.arr );
        for ( let i = 0; i < list.length; i ++ ) {
            let img = new Image();
            img.src = list[i];
            $( img ).css({
                border: "2px solid transparent",
                padding: "0 8px",
                height: "50px"
            }).appendTo( this.iconImgList );
            if ( i === 0 ) {
                this.selectImg( img );
            }
        }

        this.setImage(list[0]);
        this.iconSelectBind = this.iconSelectHandler.bind( this );
        this.iconImgList.on( "mouseover", this.iconSelectBind );
    }

    /*
    * 设置当前显示的图片对应的小图片出现红色边框
    * */
    selectImg( elem ) {
        if ( this.pre ) {
            $( this.pre ).css( "border", "2px solid transparent" );
        }
        this.pre = elem;
        $( this.pre ).css( "border", "2px solid #e01222" );
    }

    /*
    * 设置大图片的位置显示
    * */
    setImage( src ) {
        if ( this.leftBigImg.children().length === 1 ) {
            let img = new Image();
            img.src = src;
            $( img ).css({
                width: "400px",
                height: "400px",
                position: "absolute"
                //this.leftBigImg.get(0) 将jQuery元素变为Dom元素
            }).insertBefore( this.leftBigImg.get(0).firstElementChild );
        } else {
            this.leftBigImg.get(0).firstElementChild.src = src;
        }
        this.rightBigImg.css( "backgroundImage", "url(" + src + ")" );
    }

    /*
    * 点击小图片出现对应的大图片
    * */
    iconSelectHandler(e) {
        if ( e.target === this.iconImgList ) return;
        this.selectImg( e.target );
        this.setImage( e.target.src );
    }

    mouseHandler(e) {
        switch ( e.type ) {
            case "mousemove":
                //让鼠标位置在幕布的中间
                this.mask.css({
                    left: e.pageX - this.divWrap.get(0).offsetLeft - this.mask.get(0).offsetWidth / 2 + "px",
                    top: e.pageY - this.divWrap.get(0).offsetTop - this.mask.get(0).offsetHeight / 2 + "px"
                });
                if ( this.mask.get(0).offsetLeft < 0 ) {
                    this.mask.css( "left", 0 );
                }
                if ( this.mask.get(0).offsetTop < 0 ) {
                    this.mask.css( "top", 0 )
                }
                if ( this.mask.get(0).offsetLeft + this.mask.get(0).offsetWidth > this.leftBigImg.get(0).offsetWidth ) {
                    this.mask.css( "left", this.leftBigImg.get(0).offsetWidth - this.mask.get(0).offsetWidth + "px" );
                }
                if ( this.mask.get(0).offsetTop + this.mask.get(0).offsetHeight > this.leftBigImg.get(0).offsetHeight ) {
                    this.mask.css( "top", this.leftBigImg.get(0).offsetHeight - this.mask.get(0).offsetHeight + "px" );
                }
                this.rightBigImg.css({
                    backgroundPositionX: -this.mask.get(0).offsetLeft * ( 600 / 400 ) + "px",
                    backgroundPositionY: -this.mask.get(0).offsetTop * ( 600 / 400 ) + "px"
                });
                break;
            case "mouseleave":
                this.rightBigImg.css( "display", "none" );
                this.mask.css( "display", "none" );
                break;
            case "mouseenter":
                this.rightBigImg.css( "display", "block" );
                this.mask.css( "display", "block" );
                break;
        }
    }

    render( _arr ) {
        this.arr = _arr;
    }
}