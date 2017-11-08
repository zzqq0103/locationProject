$().ready(function() {
    var screenHeight = $(window).height();
    var screenWidth = $(window).width();
    console.log(screenHeight + "," + screenWidth);
    $(".container").css("width", screenWidth);
    $(".container").css("height", screenHeight);
    // 点击转换 “起点” 与 “终点“ 数据交换
    $("#btn_swap").on("click", function() {
        var start_input = $("#start_input").val();
        var end_input = $("#end_input").val();
        $("#start_input").val(end_input);
        $("#end_input").val(start_input);
    });
    $("#btn_search").on("click", function() {
        if (checkInputInfo()) {
            //进入路线规划展示
            setRoadMap();
            ui_realTimeNav();
            imgStartHide();
            $('.view-2').hide();
            $('.view-1').show();
        }
    });
});

//审核起点与终点的数据的有效性
function checkInputInfo() {
    var start_input = $("#start_input").val();
    var end_input = $("#end_input").val();
    if (!start_input || !end_input) {
        if (!start_input && !end_input) {
            $("#errInfo").show().html("起点和终点不能为空");
            return false;
        } else if (!start_input) {
            $("#errInfo").show().html("起点不能为空");
            return false;
        } else if (!end_input) {
            $("#errInfo").show().html("终点不能为空");
            return false;
        }
    } else {
        return true;
    }
}

//进入对地库图片的展示
function setRoadMap() {
    //获取输入框名称
    var start_input = $("#start_input").val();
    var end_input = $("#end_input").val();
    //根据名称获取中心点坐标
    var map = POS.controler();
    var posStart = map.getCenterPXByStr(start_input);
    var startX = posStart.x,
        startY = posStart.y; //中心点坐标
    var posEnd = map.getCenterPXByStr(end_input);
    var endX = posEnd.x,
        endY = posEnd.y;
    //通过起止坐标点绘制路径
    getPath(startX, startY, endX, endY);
}

//接受起止坐标，绘制路径
function getPath(startX, startY, endX, endY) {
    //将起止点坐标传给后台获得路径坐标
    var json = {
        start: { startX: startX, startY: startY },
        end: { endX: endX, endY: endY }
    };
    console.log(JSON.stringify(json));
    $.ajax({
        type: "POST",
        url: "http://www.mcilab.cn/LocationWebapp/shougang/navigation",
        // data:JSON.stringify(json),
        data: {
            data: JSON.stringify(json)
        },
        success: function(data) {
            console.log(data)
            var pcList = JSON.parse(data).data.pcList;
            // var pcList = [{ pcX: 344, pcY: 544 }, { pcX: 415, pcY: 535 }, { pcX: 380, pcY: 458 }, { pcX: 291, pcY: 458 }, { pcX: 279, pcY: 291 }];
            //绘制路径
            showPath(pcList,startX,startY,endX,endY);
            //显示起点与终点
            imgStart.attr({
                display: "inline",
                x: startX - 16,
                y: startY - 30
            });
            imgEnd.attr({
                display: "inline",
                x: endX - 16,
                y: endY - 30
            });
        },
        error: function(err) {
            console.log("ajax error");
        }
    });
}

//开始导航,调用前提示（使用当前位置开始导航）
function startPath() {
    console.log("startPath");
    //获取当前位置与终点
    var nowPosition = localStorage.getItem("position");
    var end_input = $("#end_input").val().split(",");
    var parsenowPosition = JSON.parse(nowPosition);
    // console.log(JSON.stringify(parsenowPosition));
    var startX = parsenowPosition.X,
        startY = parsenowPosition.Y;
    console.log("当前定位点：" + parsenowPosition.X + " " + parsenowPosition.Y)
    var endX = end_input[0],
        endY = end_input[1];
    //绘制路径
    getPath(startX, startY, endX, endY);
    //判断当前位置是否接近终点
    // if ((-5 < (startX - endX) < 5) && (-5<(startY - endY )<5)) {
    //     //如果过于接近，停止导航
    //     /**------停止导航函数--------**/
    // }else{
    //     //1秒后再次执行
    //     setTimeout('startPath', 1000);
    // }
    setTimeout('startPath()', 1000);
}
var startflag = 0;

function startPathTest() {
    var end_input = $("#end_input").val().split(",");
    var endX = end_input[0],
        endY = end_input[1];
    console.log(testArr[startflag])
    getPath(testArr[startflag].x, testArr[startflag].y, endX, endY);
    //判断当前位置是否接近终点
    //1秒后再次执行
    // i++;
    startflag++;
    if (startflag < testArr.length) {
        var t = setTimeout('startPathTest()', 1000);
    } else {
        startflag = 0;
        t = null;
    }
}

$('.car-search').on('click',function () {
    $('.view-navigation').show();
    $('.view-1 .foot').hide();
})