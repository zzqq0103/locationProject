$().ready(function() {
    $.toast.prototype.defaults.duration = 500
    console.log("diaoyong search.js");
    var screenHeight = $(window).height();
    var screenWidth = $(window).width();
    console.log(screenHeight + "," + screenWidth);
    $("body").css("width", screenWidth);
    $("body").css("height", screenHeight);
});

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
    $('.view-1').css({
        "height":"65%"
    });
    $('#图层_1').css({
        "position":"absolute",
        "top": 0,
        "right": 0,
        "left": 0,
        "bottom": 0,
        "margin":'auto'
    });
    $('.selectDotPanel').show();
})

$('.backArrow').on('click',function () {
    $('.view-navigation').hide();
    $('.view-1 .foot').show();
    $('.selectDotPanel').hide();
    $('.view-1').css({
        "height":"80%"
    });
    $('#图层_1').css({
        "position":"absolute",
        "top": 0,
        "right": 0,
        "left": 0,
        "bottom": 0,
        "margin":'auto'
    });
})

$('.close-btn').on('click',function (){
    console.log('xxx');
    $('.selectDotPanel').hide();
})

$('#startIcon,#endIcon').on('click',function () {
    $('.selectDotPanel').show();
})

$('.to-here').on('click',function(){
    $.toast("设置起点成功", "text");
    var dotValue = $('.attribute').text();
    console.log(dotValue)
    if(dotValue){
        $('#startPosition').val(dotValue);
    }
    var startVal = $('#startPosition').val(),
        endVal = $("#endPosition").val();
    console.log(startVal+', '+endVal)
    if(startVal === endVal){
        $.toast("起点和终点不能相同", "text");
        return;
    }
    if(startVal && endVal){
        $('.line-3').show();
    }
})

$('.from-here').on('click',function(){
    $.toast("设置终点成功", "text");
    var dotValue = $('.attribute').text();
    console.log(dotValue)
    if(dotValue){
        $('#endPosition').val(dotValue);
    }
    var startVal = $('#startPosition').val(),
        endVal = $("#endPosition").val();
    console.log(startVal+', '+endVal)
    if(startVal === endVal){
        $.toast("起点和终点不能相同", "text");
        return;
    }
    if(startVal && endVal){
        $('.line-3').show();
    }
})

$('#transfer').on("click",function () {
    var startPValue = $('#startPosition').val();
    var endPValue = $("#endPosition").val();
    $('#startPosition').val(endPValue);
    $("#endPosition").val(startPValue);
    $(".attribute").val('');
})

