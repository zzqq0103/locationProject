// 全局变量 stoplocation 保存“停车”定位位置
var stopLocation = null;

// 全局变量 findLocation 保存“寻车”定位位置
var findLocation;
var startX, startY, endX, endY;

//全局循环次数的计数变量
var count = 0;

var resetTime = 1;

function locatedPosition() {
    // alert("停车定位");
    // alert("停车定位次数: " + resetTime + " 次");
    //照旭给的定位接口
    getLocation();
    count = 0;
    do {
        stopLocation = localStorage.getItem("position");
        count++;
    } while (!stopLocation && count < 5);
    //确定当前位置函数 , 0 表示是对停车是的位置确认
    if (stopLocation) {
        confirmPosition(stopLocation, 0);
    } else {

        if (resetTime++ < 3) {
            locatedPosition();
        } else {
            return;
        }

    }
}


// 点击寻车的按钮，一直需要调用 “定位” 的函数，传给后台，获取实时的位置信息，之后再调用又中写的画路径的函数。需要实时的进行操作。
function findCar() {
    alert("开始寻车");
    var parseStopLocation,
        parsefindLocation;
    if (stopLocation == null) {
        $.toast("请先定位您的停车位置", "text");
        return;
    } else {
        parseStopLocation = JSON.parse(stopLocation);
        alert(parseStopLocation.X + "   " + parseStopLocation.Y);
    }
    // 在SVG图中显示停车的位置
    // getCar(parseStopLocation.X, parseStopLocation.Y);
    // alert("停车的定位坐标X：" + parseStopLocation.X);
    // alert("停车的定位坐标Y：" + parseStopLocation.Y);
    count = 0;
    do {
        findLocation = localStorage.getItem('position');
        count++;
    }
    while (!findLocation && count < 5);
    //确认寻车的起点。 1 表示是对寻车起点的位置确认
    confirmPosition(findLocation, 1);
    // if (findLocation == null) {
    //     $.toast("寻车起始位置未定位", "text");
    //     return;
    // } else {
    //     parsefindLocation = JSON.parse(findLocation);
    //     alert(parsefindLocation.X + "   " + parsefindLocation.Y);
    // }
    // getPath(parseStopLocation.X, parseStopLocation.Y, parsefindLocation.X, parsefindLocation.Y);
    // getPath(parseStopLocation.X, parseStopLocation.Y, 292, 402);
}


function confirmPosition(position, flag) {
    //传入的position变量，经过了while函数的判断，一直是有效的对象（Object),而不会是null空对象。
    // flag = 0 表示的是停车位置的确认信息
    if (flag == 0) {
        $.modal({
            title: "确定停车位置",
            text: "您是否确定当前停车位置？",
            buttons: [{
                    text: "重新定位",
                    onClick: function() {
                        // count = 0;
                        // do {
                        //     position = localStorage.getItem("position");
                        //     count++;
                        // }
                        // while (!position && count < 5);
                        // confirmPosition(position, 0);
                    }
                },
                {
                    text: "确定",
                    onClick: function() {
                        endX = JSON.parse(position).X;
                        endY = JSON.parse(position).Y;
                        getCar(JSON.parse(position).X, JSON.parse(position).Y);

                    }
                },
            ]
        });
    } else {
        // flag = 1 表示的是起始寻车位置的确认信息
        $.modal({
            title: "确定寻车起点位置",
            text: "确定从当前位置开始寻车？",
            buttons: [{
                    text: "重新定位",
                    onClick: function() {
                        // count = 0;
                        // do {
                        //     position = localStorage.getItem("position");
                        //     count++;
                        // }
                        // while (!position && count < 5);
                        // confirmPosition(position, 1);
                    }
                },
                {
                    text: "确定",
                    onClick: function() {
                        loadPath();
                    }
                },
            ]
        });
    }
}


function loadPath() {
    console.log("loadPath");
    //获取寻车实时位置与停车位置
    var shishiPosition = localStorage.getItem("position");
    var parseshishiPosition = JSON.parse(shishiPosition);
    console.log("当前定位点：" + parseshishiPosition.X + " " + parseshishiPosition.Y)
    var stopX = JSON.parse(stopLocation).X,
        stopY = JSON.parse(stopLocation).Y;
    // getPath(parseshishiPosition.X, parseshishiPosition.Y, stopX, stopY);
    getPath(534,332, stopX, stopY);
    setTimeout('loadPath()', 1000);
}