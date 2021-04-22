class ShoppingTable{
    constructor( _data, parent ) {
        this.data = _data;
        this.table = this.initCreate( parent );
    }

    initCreate( parent ) {
        if ( this.table ) return this.table;
        this.checkBind = this.checkHandler.bind( this );
        this.deleteBind = this.deleteHandler.bind( this );
        let table = $( "<table></table>" ).css({
            borderCollapse: "collapse",
            position:"relative",
            width:"1200px",
            margin:"auto"
        }).appendTo( parent );

        this.createTableHead( table );
        this.createTrAndTd( table );
        return table;
    }

    createTableHead( table ) {
        let tr = $( "<tr></tr>" ).css({
            border: "1px solid #cccccc",
            padding: "5px 0"
        }).appendTo( table );
        let tableHeadList = [ "全选", "",  "商品信息", "单价（元）", "数量", "小计（元）", "操作" ];
        let widthList = [ 80, 120, 240, 110, 135, 125, 80 ];

        for ( let i = 0; i < tableHeadList.length; i ++ ) {
            let th = $( "<th></th>" ).css({
                backgroundColor:"#F3F3F3",
                color:"#666666",
                fontSize:"12px",
                lineHeight:"32px",
                height:"32px",
                width:widthList[i]+"px"
            }).text( tableHeadList[i] ).appendTo( tr );
            if ( tableHeadList[i] === "全选" ) {
                let check = $( "<input type='checkbox'>" ).css({
                    position: "relative",
                    top: "2px",
                    left: "-40px"
                }).appendTo( th ).on( "click", this.checkBind );
                check.get(0).checked = this.getAllChecked();
            }
            if ( tableHeadList[i] === "商品信息" ) {
                th.css({
                    textAlign: "left",
                    paddingLeft: "20px"
                })
            }
        }
    }

    createTrAndTd( table ) {
        for ( let i = 0; i < this.data.length; i ++ ) {
            let tr = $( "<tr></tr>" ).css( "border", "1px solid #cccccc" )
                .appendTo( table );
            for ( let prop in this.data[i] ) {
                if ( prop === "id" ) continue;
                let td = $( "<td></td>" ).css({
                    textAlign: "center",
                    fontSize: "12px",
                    backgroundColor: "#f3f3f3"
                }).appendTo( tr );
                this.createTdContent( td, prop, this.data[i] );
            }
        }
    }

    createTdContent( td, prop, item ) {
        // console.log( item )
        switch ( prop ) {
            case "selected":
                let check = $( "<input type='checkbox'>" ).css( "marginLeft", "-55px" )
                    .appendTo( td );
                // console.log(Boolean( item[prop] ) )
                check.get(0).checked = item[prop] === "true";
                check.get(0).data = item;
                check.on( "click",this.checkBind );
                break;
            case "icon":
                let img = new Image();
                img.src = item[prop];
                $( img ).css({
                    width: "50px",
                    height: "50px",
                    paddingTop: "2px"
                }).appendTo( td );
                break;
            case "num":
                let step = new StepNumber( item, td );
                step.step = Number( item.num.subtotal );
                break;
            case "deleted":
                let del = $( "<a></a>" ).css( "cursor", "pointer" )
                    .text( "删除" )
                    .appendTo( td )
                    .on( "click", this.deleteBind );
                del.get(0).data = item;
                break;
            case "info":
                td.css({
                    textAlign: "left",
                    paddingLeft: "20px"
                });
            default:
                let msg = item[prop].toString().length > 20 ? item[prop].toString().slice(0, 20) : item[prop];
                if ( !isNaN( Number( msg ) ) ) {
                    //保留两位小数
                    msg = Number( msg ).toFixed(2);
                }
                td.text( msg );
                break;
        }
    }

    checkHandler( e ) {
        let evt;
        if ( !e.currentTarget.data ) {
            //如果是全选按钮
            evt = new Event( ShoppingTable.SELECT_ALL_GOODS_EVENT );
            evt.select = e.currentTarget.checked;
        } else {
            //多选按钮
            evt = new Event( ShoppingTable.SELECT_GOODS_EVENT );
            evt.data = e.currentTarget.data;
            evt.select = e.currentTarget.checked;
        }
        document.dispatchEvent( evt );
    }

    deleteHandler( e ) {
        let evt = new Event( ShoppingTable.DELETED_GOODS_EVENT );
        evt.data = e.currentTarget.data;
        document.dispatchEvent( evt );
    }

    getAllChecked() {
        //判断当前购物车列表中的商品是否全被选中
        //如果全被选中，则全选按钮被选中
        //否则，不选中全选按钮
        return this.data.every(function (t) {
            return t.selected === "true" ? true : false;
        })
    }

    dispose() {
        this.table.remove();
        this.table = null;
    }

    static get DELETED_GOODS_EVENT(){
        return "deleted_goods_event";
    }
    static get SELECT_ALL_GOODS_EVENT(){
        return "select_all_goods_event";
    }
    static get SELECT_GOODS_EVENT(){
        return "select_goods_event";
    }
}