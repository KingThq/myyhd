class ThreeLevelMenu {
    constructor( parent ) {
        this.menu = this.initCreate( parent );
        this.selectContent = "";
    }

    initCreate( parent ) {
        if ( this.menu ) return this.menu;
        let div = $( "<div></div>" ).css({
            position: "relative",
            float: "left"
        }).appendTo( parent );
        let bn = $( "<button></button>" ).css({
            width: "88px",
            height: "23px",
            backgroundColor: "transparent",
            border: "1px solid #000000",
            boxShadow: "1px 1px 1px #999999",
            position: "relative"
        }).appendTo( div );

        this.createButton( bn );
        this.createMenuList( div );
        this.mouseLeaveBind = this.mouseLeaveHandler.bind( this );
        div.on( "mouseleave", this.mouseLeaveBind );
        return div;
    }

    createButton( bn ) {
        this.menuTitle = $( "<span></span>" ).css({
            marginRight: "17px",
            fontSize: "14px"
        }).appendTo( bn );
        //下三角
        $( "<span></span>" ).css({
            display: "inline-block",
            width: "0",
            height: "0",
            borderTop:"9px solid #000000",
            borderLeft:"6px solid transparent",
            borderRight:"7px solid transparent",
            position: "absolute",
            right:"6px",
            top:"6px"
        }).appendTo( bn );

        this.openMenuBind = this.openMenuHandler.bind( this );
        bn.on( "click", this.openMenuBind );
    }

    createMenuList( div ) {
        if ( this.ulList ) {
            //自动删除 this.ulList 的所有事件
            this.ulList.remove();
            this.ulList = null;
        }
        this.ulList = $( "<ul></ul>" ).css({
            width: "86px",
            overflow:"auto",
            border: "1px solid #000000",
            position: "absolute",
            top:"30px",
            boxShadow: "1px 1px 1px #999999",
            display: "none",
            margin:0,
            padding:0,
            zIndex: 999
        }).appendTo( div );

        if ( this.data ) {
            for ( let i = 0; i < this.data.length; i ++ ) {
                if ( i === 0 ) {
                    this.menuTitle.text( this.data[i] );
                }
                $( "<li></li>" ).css({
                    backgroundColor: "#FFFFFF",
                    lineHeight: "23px",
                    cursor: "default",
                    textAlign: "center",
                    paddingRight: "5px",
                    borderBottom:"1px solid #000000"
                }).text( this.data[i] ).appendTo( this.ulList );
            }
            $( "li:last-child" ).css( "borderBottom", "none" );
            //li 的长度大于6，就固定ul的高度为155px，出现滚动条
            if ( this.data.length > 6 ) {
                this.ulList.css( "height", "155px" );
            }
        }

        this.ulClickBind = this.ulClickHandler.bind( this );
        this.ulList.on( "click mouseover mouseout", this.ulClickBind );
    }

    mouseLeaveHandler( e ) {
        this.ulList.css( "display", "none" );
    }

    openMenuHandler( e ) {
        this.ulList.css( "display", "block" );
    }

    ulClickHandler( e ) {
        if ( e.target.constructor !== HTMLLIElement ) return;
        switch ( e.type ) {
            case "click":
                this.menuTitle.text( e.target.textContent );
                $( e.currentTarget ).css( "display", "none" );
                let index = Array.from( this.ulList.get(0).children ).indexOf( e.target );
                let evt = new Event( ThreeLevelMenu.SELECT_CHANGE_EVENT );
                this.selectContent = evt.selectContent = e.target.textContent;
                evt.selectIndex = index;
                this.menu.get(0).self = this;
                this.menu.get(0).dispatchEvent( evt );
                break;
            case "mouseover":
                $( e.target ).css( "backgroundColor", "#cccccc" );
                break;
            case "mouseout":
                $( e.target ).css( "backgroundColor", "#ffffff" );
                break;
        }
    }

    setData( _data ) {
        if ( !_data || _data.length === 0 ) return;
        this.data = _data;
        this.createMenuList( this.menu );
        let evt = new Event( ThreeLevelMenu.SELECT_CHANGE_EVENT );
        this.selectContent = evt.selectContent = this.data[0];
        evt.selectIndex = 0;
        this.menu.get(0).self = this;
        this.menu.get(0).dispatchEvent( evt );
    }

    static get SELECT_CHANGE_EVENT() {
        return "select_change_event";
    }
}