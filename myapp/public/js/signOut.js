(function () {
    // console.log(document.cookie);
    $(".headerSignOut").click(function (e) {
        var strArr = document.cookie.split(";");
        var str;
        for (var i = 0; i < strArr.length; i ++) {
            if (strArr[i].indexOf("loginAction=ok") > -1) {
                str = strArr[i];
                var date = new Date();
                date.setTime(date.getTime() - 10000);
                document.cookie = str + ";expires=" + date.toGMTString();  //转换成标准时间
                location.href = "/index";
                break;
            }
        }
    });
})();