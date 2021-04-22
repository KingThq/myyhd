var rollImg, imgCon, dotUl, pre,
    imgList = [],
    bnList = [],
    position = 0,
    direction = "",
    imgMoveBool = false,
    speed = 30,
    time = 200,
    autoBool = false,
    imgSrcList = ["left.png", "right.png", "banner1.jpg", "banner2.jpg", "banner3.jpg" ];

const IMG_WIDTH = 1228;
const IMG_HEIGHT = 346;

function carousel( parent ) {
    loadImages( parent );
}

function getImage(src) {
    return new Promise(function (res, rej) {
        var img = new Image();
        img.src = src;
        img.onload = function () {
            res(img);
        }
    })
}

function loadImages( parent ) {
    var list = [];
    for (var i = 0; i < imgSrcList.length; i++) {
        list.push(getImage("./img/" + imgSrcList[i]));
    }
    Promise.all(list).then(function (_imgList) {
        bnList = _imgList.splice(0, 2);
        imgList = _imgList.splice(0);

        createRollImage(parent);
        rollImg.on("mouseenter mouseleave", function (e) {
            if (e.type === "mouseenter") {
                autoBool = false;
            } else if (e.type === "mouseleave") {
                autoBool = true;
                time = 200;
            }
        });
        createLeftRight();
        createDotList();
        setDotStyle();
        animation();
    })
}

function createRollImage( parent ) {
    rollImg = $("<div></div>")
        .css({
            width: IMG_WIDTH + "px",
            height: IMG_HEIGHT + "px",
            position: "relative",
            margin: "0 auto",
            overflow: "hidden",
            padding: 0
        })
        .appendTo( parent );
    imgCon = $("<div></div>")
        .css({
            width: IMG_WIDTH + "px",
            height: IMG_HEIGHT + "px",
            position: "absolute"
        })
        .appendTo( rollImg );

    for (var i = 0; i < imgList.length; i++) {
        $(imgList[i]).width(IMG_WIDTH).height(IMG_HEIGHT);
    }

    imgCon.append($(imgList[0]));
}

function createLeftRight() {
    for (var i = 0; i < bnList.length; i++) {
        rollImg.append($(bnList[i]));

        $(bnList[i]).css({
            position: "absolute",
            top: (IMG_HEIGHT - $(bnList[i]).height()) / 2 + "px"
        }).on("click", function () {
            if (imgMoveBool) return;
            if ( this.src.indexOf( "left" ) > -1 ) {
                position --;
                direction = "right";
                if (position < 0) {
                    position = imgList.length - 1;
                }
            } else if ( this.src.indexOf( "right" ) > -1 ) {
                position ++;
                direction = "left";
                if (position > imgList.length - 1) position = 0;
            }
            initNextImg();
        });

        if (i === 0) {
            $(bnList[i]).css("left", "10px");
            continue;
        }
        $(bnList[i]).css("right", "10px")
    }
}

function createDotList() {
    dotUl = $("<ul></ul>").css({
        listStyle: "none",
        position: "absolute",
        margin: 0,
        padding: 0,
        bottom: "10px"
    }).appendTo(rollImg).on("click", function (e) {
        if (imgMoveBool) return;

        if (e.target.constructor === HTMLUListElement) return;
        var arr = Array.from($(this).children());
        var index = arr.indexOf(e.target);
        // console.log ( arr, index, position );
        if (index === position) return;
        if (index > position) {
            direction = "left";
        } else {
            direction = "right";
        }

        position = index;
        initNextImg();
    });

    for (var i = 0; i < imgList.length; i ++) {
        $("<li></li>").css({
            width: "15px",
            height: "15px",
            float: "left",
            border: "1px solid red",
            borderRadius: "8px",
            marginLeft: "10px"
        }).appendTo(dotUl);
    }

    dotUl.css("left", (IMG_WIDTH - dotUl.width()) / 2 + "px");
}

function setDotStyle() {
    if ( pre ) {
        pre.css("backgroundColor", "rgba(255,0,0,0)");
    }
    pre = dotUl.children().eq( position );
    // console.log ( pre )
    pre.css("backgroundColor", "rgba(255,0,0,0.5)");
}

function initNextImg() {
    if (direction !== "left" && direction !== "right") return;
    imgCon.width( IMG_WIDTH * 2 );
    if (direction === "left") {
        $( imgList[position] ).appendTo( imgCon );
    } else if (direction === "right") {
        $( imgList[position] ).prependTo( imgCon );
        imgCon.css( "left", -IMG_WIDTH + 'px' );
    }
    setDotStyle();
    imgMoveBool = true;
}

function animation() {
    requestAnimationFrame(animation);
    moveImg();
    rollAutoImg();
}

function moveImg() {
    if (!imgMoveBool) return;

    if (direction === "left") {
        // console.log ( (imgCon.position().left - speed + "px") )
        imgCon.css( "left", (imgCon.position().left - speed + "px") );
        if ( imgCon.position().left <= -IMG_WIDTH) {
            imgMoveBool = false;
            imgCon.children().eq(0).remove();
            imgCon.css( "left", "0px" );
        }
    } else if (direction === "right") {
        imgCon.css( "left", (imgCon.position().left + speed + "px") );
        if ( imgCon.position().left >= 0) {
            imgMoveBool = false;
            imgCon.children().eq(1).remove();
            imgCon.css( "left", "0px" );
        }
    }
}

function rollAutoImg() {
    if (!autoBool) return;
    time--;
    if (time > 0) return;
    time = 200;
    direction = "left";
    position++;
    if (position > imgList.length - 1) position = 0;

    initNextImg();
}
