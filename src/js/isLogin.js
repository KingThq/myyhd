/*
* 登录成功后显示用户账户，隐藏登录、注册选项
* */
(function () {
    console.log( document.cookie );
    var str = document.cookie.split(";")[0];
    if ( document.cookie.indexOf( "account" ) === -1 || document.cookie.indexOf( "account=admin" ) > 0 ) return;

    //将登录注册隐藏
    var headRightDiv = $( ".head_top_right" );
    var login = $(".login").css("display", "none");
    var regist = $(".regist").css("display", "none");

    //显示用户账户
    var showAccount = $( "<div></div>" ).css({
        width: "70px",
        height: "30px",
        lineHeight: "30px",
        cursor: "pointer",
        color: "#666666",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        paddingRight: "10px",
        position: "relative"
    })
        .text( "Hi~ " + str.split( "=" )[1] )
        .appendTo(headRightDiv);

    //退出按钮
    var signOUt = $( "<div></div>" ).css({
        width: "70px",
        height: "27px",
        display: "none",
        position: "absolute",
        backgroundColor: "#f4f4f4",
        top: "30px",
        left: "-5px",
        cursor: "pointer",
        lineHeight: "27px",
        textAlign: "center",
        border: "1px solid #cccccc",
        zIndex: 999
    }).text( "退出" ).appendTo( headRightDiv )
        .click(function (e) {
            var date = new Date();
            date.setTime(date.getTime() - 10000);
            document.cookie = str + ";expires=" + date.toGMTString();  //转换成标准时间
            location.href = "./index.html";
        });

    showAccount.on( "mouseenter click mouseleave", function (e) {
        if ( e.target.constructor === HTMLDivElement ) {
            switch ( e.type ) {
                case "mouseenter":
                    $( this ).css( "color", "#ff4e40" );
                    break;
                case "mouseleave":
                    $( this ).css( "color", "#666666" );
                    break;
                case "click":
                    this.bool = !this.bool;
                    if (this.bool) {
                        $( signOUt ).css( "display", "block" );
                    } else {
                        $( signOUt ).css( "display", "none" );
                    }
                    break;
            }
        } else {
            $( signOUt ).css( "display", "none" );
        }
    } );
})();