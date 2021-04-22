let shoppingTable,
    arr = [];

function init() {
    getCities();

    //提交订单
    let balance = document.querySelector(".balance");
    balance.addEventListener("click", balClickHandler);

    //购物车列表
    $.ajax({
        type: "POST",
        url: "http://127.0.0.1:3001",
        data:{
            type: 0x03
        },
        success: function ( _data ) {
            let data = JSON.parse(decodeURIComponent(_data));
            if ( shoppingTable ) {
                shoppingTable.dispose();
                shoppingTable = null;
            }
            shoppingTable = new ShoppingTable( data.resolute, $( ".shoppingCar_list" ) );
            getTotalPrice( data.resolute );
        }
    });

    document.addEventListener( ShoppingTable.DELETED_GOODS_EVENT, shoppingTableHandler );
    document.addEventListener( ShoppingTable.SELECT_GOODS_EVENT, shoppingTableHandler );
    document.addEventListener( ShoppingTable.SELECT_ALL_GOODS_EVENT, shoppingTableHandler );
    document.addEventListener( StepNumber.CHANGE_STEP_NUMBER_EVENT, shoppingTableHandler );
}

function shoppingTableHandler( e ) {
    switch ( e.type ) {
        case StepNumber.CHANGE_STEP_NUMBER_EVENT:
            // console.log(e.data.id, e.num)
            $.ajax({
                type: "POST",
                url: "http://127.0.0.1:3001",
                data: {
                    type: 0x05,
                    id: e.data.id,
                    num: e.num,
                    changeNum: e.changeNum
                },
                success: function ( _data ) {
                    let data = JSON.parse(decodeURIComponent(_data));
                    if ( shoppingTable ) {
                        shoppingTable.dispose();
                        shoppingTable = null;
                    }
                    getTotalPrice( data.resolute );
                    shoppingTable = new ShoppingTable( data.resolute, $( ".shoppingCar_list" ) );
                }
            });
            break;
        case ShoppingTable.DELETED_GOODS_EVENT:
            $.ajax({
                type: "POST",
                url: "http://127.0.0.1:3001",
                data: {
                    type: 0x06,
                    id: e.data.id
                },
                success: function ( _data ) {
                    let data = JSON.parse(decodeURIComponent(_data));
                    if ( shoppingTable ) {
                        shoppingTable.dispose();
                        shoppingTable = null;
                    }
                    getTotalPrice( data.resolute );
                    shoppingTable = new ShoppingTable( data.resolute, $( ".shoppingCar_list" ) );
                }
            });
            break;
        case ShoppingTable.SELECT_GOODS_EVENT:
            // console.log( e.select )
            $.ajax({
                type: "POST",
                url: "http://127.0.0.1:3001",
                data: {
                    type: 0x07,
                    id: e.data.id,
                    selected:e.select
                },
                success: function ( _data ) {
                    let data = JSON.parse(decodeURIComponent(_data));
                    if ( shoppingTable ) {
                        shoppingTable.dispose();
                        shoppingTable = null;
                    }
                    getTotalPrice( data.resolute );
                    shoppingTable = new ShoppingTable( data.resolute, $( ".shoppingCar_list" ) );
                }
            });
            break;
        case ShoppingTable.SELECT_ALL_GOODS_EVENT:
            // console.log( e.select )
            $.ajax({
                type: "POST",
                url: "http://127.0.0.1:3001",
                data: {
                    type: 0x08,
                    selected:e.select
                },
                success: function ( _data ) {
                    let data = JSON.parse(decodeURIComponent(_data));
                    if ( shoppingTable ) {
                        shoppingTable.dispose();
                        shoppingTable = null;
                    }
                    getTotalPrice( data.resolute );
                    shoppingTable = new ShoppingTable( data.resolute, $( ".shoppingCar_list" ) );
                }
            });
            break;
    }
}

function getTotalPrice( arr ) {
    let totalPrice = 0;
    arr.forEach(function (t) {
        if ( t.selected === "true" ) {
            totalPrice += Number( t.sum );
        }
    });
    $( ".total" ).text( "￥" + totalPrice.toFixed(2) );
}

function getCities() {
    //三级联动城市菜单
    for ( let i = 0; i < 3; i ++ ) {
        arr.push(new ThreeLevelMenu( $( ".cities" ) ));
        arr[i].menu.get(0).addEventListener(ThreeLevelMenu.SELECT_CHANGE_EVENT,menuSelectHandler);
    }
    $.ajax({
        type: "POST",
        url: "http://127.0.0.1:3001",
        data: { type: 0x09 },
        success: function ( _data ) {
            let data = JSON.parse(decodeURIComponent(_data));
            arr[0].setData(data.resArr);
        }
    })
}

function menuSelectHandler(e) {
    let index = arr.indexOf(this.self);
    if (index === 0) {
        $.ajax({
            type: "POST",
            url: "http://127.0.0.1:3001",
            data: {
                type: 10,
                province: e.selectContent
            },
            success: function (_data) {
                let data = JSON.parse(decodeURIComponent(_data));
                arr[1].setData(data.resArr);
            }
        })
    }else if(index===1){
        // ajax({type:2,province:arr[0].selectContent,city:e.selectContent});
        $.ajax({
            type: "POST",
            url: "http://127.0.0.1:3001",
            data: {
                type: 11,
                province: arr[0].selectContent,
                city: e.selectContent
            },
            success: function (_data) {
                let data = JSON.parse(decodeURIComponent(_data));
                arr[2].setData(data.resArr);
            }
        })
    } else if (index === 2) {
        $(".adDetails").val(arr[0].selectContent + arr[1].selectContent + e.selectContent);
    }
}

function balClickHandler(e) {
    if (document.cookie.indexOf("account") === -1 || $(".total").text() === "￥0.00" || $(".adDetails").val() === "") {
        alert("请先登录并选中商品后才能提交订单");
        return;
    }
    var str = document.cookie.split(";")[0];
    var username = str.split( "=" )[1];
    var status, tel, goodsInfo = "";

    $.ajax({
        type: "POST",
        url: "http://127.0.0.1:3001",
        data: {
            type: 0x03
        },
        success: function (_data) {
            let data = JSON.parse(decodeURIComponent(_data));
            // console.log(data.resolute);
            for (let i = 0; i < data.resolute.length; i ++) {
                if (data.resolute[i].selected === "true") {
                    goodsInfo += data.resolute[i].info.slice(0, 6) + " X" + data.resolute[i].num.subtotal + " ";
                }
            }
            // console.log(goodsInfo)

            $.ajax({
                //查找users表取得用户id和phone
                type: "POST",
                url: "http://127.0.0.1:3001",
                data: {
                    type: 15,
                    account: username
                },
                success: function (_data) {
                    let data = JSON.parse(_data);
                    // console.log(data);
                    status = data.status;
                    if (Number(status)) {
                        tel = data.resolve[0].phone;
                        //生成订单
                        $.ajax({
                            type: "POST",
                            url: "http://127.0.0.1:3001",
                            data: {
                                type: 14,
                                account: username,
                                info: goodsInfo,
                                address: $(".adDetails").val(),
                                phone: tel.toString(),
                                totalPrice: $(".total").text().slice(1)
                            },
                            success: function (_data) {
                                let data = JSON.parse(decodeURIComponent(_data));
                                // console.log(data);
                                alert(data);
                            }
                        });
                    }
                }
            });
        }
    });
}