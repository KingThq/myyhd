let bool1 = false,
    bool2 = false,
    bool3 = false,
    bool4 = false;
let pass;

init();
function init() {
    $( "input#account" ).on( "input", inputHandler);
    $( "input#password" ).on( "input", inputHandler );
    $( "input#confirmpass" ).on( "input", inputHandler );
    $( "input#phone" ).on( "input", inputHandler );
    $( "[type=submit]" ).click( function (e) {
        e.preventDefault();
        if ( !bool1 || !bool2 || !bool3 || !bool4 ) {
            alert( "请正确填写信息" );
            return;
        }
        $.ajax({
            type: "POST",
            url: "http://127.0.0.1:3001",
            data: {
                type: 0x01,
                account: $( "#account" ).val(),
                password: hex_md5( hex_md5($( "#password" ).val()) ),
                phone: $("#phone").val()
            },
            success: function ( _data ) {
                var data = JSON.parse( _data );
                console.log( data.message );
                if ( data.status ) {
                    document.cookie = "account=" + data.data.account + ";expires=" + new Date().setMinutes(3);
                    setTimeout( function () {
                        location.href = "http://localhost:63342/yhd/index.html";
                    }, 1000 );
                } else {
                    alert( data.message );
                }
            }
        });
    } );
}

function inputHandler(e) {
    // console.log( e.target.id === "account" );
    switch ( e.target.id ) {
        case "account":
            if ( e.target.value.length < 4 || e.target.value.length > 10 ) {
                $( e.target ).next( "span" ).text( "用户名格式错误" )
                    .css( "color", "red" );
                bool1 = false;
            } else {
                $( e.target ).next( "span" ).text( "用户名填写正确" )
                    .css( "color", "green" );
                bool1 = true;
            }
            break;
        case "password":
            if ( /^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9]{8,16}$/.test( e.target.value ) ) {
                $( e.target ).next( "span" ).text( "密码填写正确" )
                    .css( "color", "green" );
                pass = e.target.value;
                bool2 = true;
            } else {
                $( e.target ).next( "span" ).text( "密码格式错误" )
                    .css( "color", "red" );
                bool2 = false;
            }
            break;
        case "confirmpass":
            if ( e.target.value === pass ) {
                $( e.target ).next( "span" ).text( "密码填写正确" )
                    .css( "color", "green" );
                bool3 = true;
            } else {
                $( e.target ).next( "span" ).text( "两次密码不一致" )
                    .css( "color", "red" );
                bool3 = false;
            }
            break;
        case "phone":
            if ((/^1[34578]\d{9}$/).test(this.value)) {
                $( e.target ).next( "span" ).text( "手机号填写正确" )
                    .css( "color", "green" );
                bool4 = true;
            } else {
                $( e.target ).next( "span" ).text( "手机号格式错误" )
                    .css( "color", "red" );
                bool4 = false;
            }
            break;
    }
}