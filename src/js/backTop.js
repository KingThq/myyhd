class BackTop {
    constructor( parent ) {
        this.bool = false;
        this.speed = 100;
        this.backTop = this.initCreate( parent );
    }
    initCreate( parent ) {
        if ( this.backTop ) return this.backTop;
        let div = $( "<div></div>" ).css({
            position: "fixed",
            right: "5px",
            bottom: "30px",
            width: "40px",
            height: "40px",
            lineHeight: "53px",
            textAlign: "center",
            border: "1px solid #cccccc",
            fontSize: "50px",
            opacity: "0",
            cursor: "default"
        }).text( "^" ).appendTo( parent );

        div.hover( function () {
            $( this ).css({
                backgroundColor: "#ff4040",
                color: "#ffffff"
            })
        }, function () {
            $( this ).css({
                backgroundColor: "#ffffff",
                color: "#000000"
            })
        } );

        this.clickBind = this.clickHandler.bind( this );
        div.on( "click", this.clickBind );
        this.scrollBind = this.scrollHandler.bind( this );
        document.addEventListener( "scroll", this.scrollBind );
        this.animationBind = this.animation.bind( this );
        setInterval( this.animationBind, 16 );
        return div;
    }
    clickHandler(e) {
        this.bool = true;
    }
    scrollHandler(e) {
        if( document.documentElement.scrollTop > 150 ){
            this.backTop.css( "opacity", "1" );
            return;
        }
        if( document.documentElement.scrollTop <= 0 ){
            this.backTop.css( "opacity", "0" );
        }
    }
    animation() {
        if ( !this.bool ) return;
        if( document.documentElement.scrollTop <= 0 ){
            this.bool=false;
            this.backTop.css( "opacity", "0" );
            return;
        }
        document.documentElement.scrollTop -= this.speed;
    }
}