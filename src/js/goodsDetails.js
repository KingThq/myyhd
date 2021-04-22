function init() {
    $(".info").text(sessionStorage.goodsInfo);
    $(".nowPrice").text(sessionStorage.nowPrice);

    // 商品放大镜图片获取
    $.ajax({
        type: "POST",
        url: "http://127.0.0.1:3001",
        data: {
            type: 13,
            goodsId: sessionStorage.goodsId
        },
        success: function (_data) {
            let data = JSON.parse(decodeURIComponent(_data));
            let list = [];
            for (let i = 0; i < data.length; i ++) {
                list.push(data[i].icon);
            }
            // console.log(list)
            new GoodsMagnifier( list, $( ".goods_imgs" ) );
        }
    });

    //商品计数器
    let obj = { id: sessionStorage.goodsId, num: {subtotal: 1, restNum: sessionStorage.restNum} };
    new StepNumber( obj, $( "div.step_num" ) );

    clickAddShopCar();
    changeStepNum();
}

//点击加入购物车按钮添加商品进购物车
function clickAddShopCar() {
    $( ".add_shopCar" ).on( "click", function (e) {
        if (!sessionStorage.stepNum) sessionStorage.stepNum = 1;
        // sessionStorage.restNum -= sessionStorage.stepNum;
        if (sessionStorage.restNum < 1) {
            sessionStorage.restNum = 0;
        }
        $.ajax({
            type: "POST",
            url: "http://127.0.0.1:3001",
            data:{
                type: 0x04,
                id: sessionStorage.goodsId,
                num: sessionStorage.stepNum,
                restNum: sessionStorage.restNum
            },
            success: function () {
                alert("该商品成功加入购物车~~");
            }
        });
    } );
}

//改变计数器的值，改变商品数量
function changeStepNum() {
    document.addEventListener( StepNumber.CHANGE_STEP_NUMBER_EVENT, changeStepNumHandler );
}
function changeStepNumHandler(e) {
    // console.log(e.num)
    sessionStorage.stepNum = e.num;
    if (e.changeNum === 1) {
        sessionStorage.restNum --;
    } else if (e.changeNum === -1) {
        sessionStorage.restNum ++;
    }
    $("div.step_num").children(0).remove();
    let obj = { id: sessionStorage.goodsId, num: {subtotal: e.num, restNum: sessionStorage.restNum} };
    new StepNumber( obj, $( "div.step_num" ) );
}