 $( "[type=submit]" ).click( function (e) {
     e.preventDefault();

     $.ajax({
         type: "POST",
         url: "http://127.0.0.1:3001",
         data: {
             //接口0x02用户数据库登录验证
             type: 0x02,
             account: $( "#account" ).val(),
             password: hex_md5( hex_md5($( "#password" ).val()) )
         },
         success: function ( _data ) {
             var data = JSON.parse( _data );
             console.log( data.message );
             if ( data.status ) {
                 //设置cookie 10天后过期
                 var date = new Date();
                 var expiresDay = 10;
                 date.setTime(date.getTime() + expiresDay * 24 * 3600 * 1000);
                 document.cookie = "account=" + data.data.account + ";expires=" + date.toGMTString();
                 setTimeout( function () {
                     location.href = "http://localhost:63342/yhd/index.html";
                 }, 1000 );
             } else {
                 // alert( "请正确填写用户名和密码！" );
                 alert(data.message );
             }
         }
       });
 } );
