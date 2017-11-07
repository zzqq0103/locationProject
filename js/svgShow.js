//禁止页面拖动
document.ontouchmove = function(e) {
    e.preventDefault();
};
var s; //存储svg元素
var flag = 1;
var swidth = (window.screen.width); //获取设备的宽
var sheight = (window.screen.height); //获取设备的高
console.log(swidth+' '+sheight+" map长款提示")
var imgPosition;
var imgStart;
var imgEnd;
var imgPath;
var imgCar;
var tapXY;
$(function() {
    localStorage.setItem("mapSelect", 1); //地图点击标志，1--普通选点；2--地图选点（导航）
    loadSvg();
    controlSvg();
    ui_autoAjust();
});
//加载svg文件
function loadSvg() {
    $.ajax({
        type: "GET",
        async:false,
        url: "dachuangPOI.svg",
        dataType: "html",
        success: function(data) {
            $("#svg1").append(data);
            s = Snap("#图层_1");
            //填充颜色，原svg为线段，填充后出现块
            s.selectAll("text").attr({
                fill: "red"
            });
            s.selectAll("polygon").attr({
                fill: "#C9C598"
            });
            // ui_autoAjust(s)
            // ui_zoomOut(0.5,0.5,534,332)
            //POI 显示板
            getNavigation(s, 1);
            $("text").on("click", function(o) {
                    console.log(o)
                })
                //获取设备的位置
                //getPosition();
                //显示路径
                // showPath();
            //设置起点与终点图片
            // initScale(s,swidth,sheight);
            console.log(s.attr().height)
            // setTranslated3d(0, 0, '0.5', '');
            imgStart = s.image("images/start.png", 600, 600, 30, 30).attr({
                display: "none"
            });
            imgEnd = s.image("images/end.png", 650, 650, 30, 30).attr({
                display: "none"
            });
            imgPosition = s.image('images/show2.png', 500, 500, 20, 20).attr({
                display: "none"
            });
            imgCar = s.image("images/carPosition.png", 0, 0, 30, 30).attr({
                display: "none"
            });
            imgPath = s.paper.path("M10 10L90 90").attr({
                display: "none"
            });
        }
    });
}
function initScale(pwidth,pheight) {
    console.log(s.attr())
    s.attr({
        // viewbox:"0 0 "+pwidth+" "+pheight
    });
}
//获取设备的位置,显示定位图片并更改至相应坐标
function getPosition(cx, cy) {
    // var offx,offy;
    // var cx = 500, cy = 500;//中心点坐标
    // var r = 10;//定位圆的半径
    // var circle = s.circle(cx, cy, r);
    // var img = s.image('images/show.png',cx,cy,30,30);
    // offx = swidth/2-cx;
    // offy = sheight/2 -cy;
    // setTranslated3d(offx,offy,'','');
    imgPosition.attr({
        x: cx - 16,
        y: cy - 30,
        display: "inline"
    });
    //rotated(cx, cy); //指示当前前进方向
    //rotated(500, 300); //指示当前前进方向
}
//获取停车位置
function getCar(cx, cy) {
    imgCar.attr({
        x: cx - 16,
        y: cy - 30,
        display: "inline"
    });
}
//设置translated3d的属性，用于完成平移
function setTranslated3d(offx, offy, scale, rotate) {
    //        console.log('settransform');
    var x = 0,
        y = 0,
        sc = 1,
        ro = 0;
    if (getTransform()) {
        var str = getTransform();
        //返回[3,x,y,0,scale,rotate]
        x = str[1] + "px";
        y = str[2] + "px";
        sc = str[4];
        ro = str[5] + 'deg';
    } else {
        // console.log("error");
    }
    if (offx !== "") {
        x = offx + "px";
    }
    if (offy !== "") {
        y = offy + "px";
    }
    if (scale !== "") {
        sc = scale;
    }
    if (rotate !== "") {
        ro = rotate + 'deg';
    }
    if (sc > 3) {
        sc = 3;
    } else if (sc < 0.5) {
        sc = 0.5;
    }
    $("#图层_1").attr({
        style: 'transform:translate3d(' + x + ',' + y + ',0) ' +
            'scale(' + sc + ') ' +
            'rotate(' + ro + ')'
    });
}
//获取transform里面的数字，返回[3,x,y,0,scale,rotate]
function getTransform() {
    //        console.log('gettransform');
    var str = $("#图层_1").attr('style');
    if (str === undefined) {
        return false;
    } else {
        var reg = /\-?[0-9]+\.?[0-9]*/g;
        //            var reg2 = /(\-|\+)?\d+(\.\d+)?/g;
        //            var reg3 = /(-?\d+)(\.\d+)?/g
        //            console.info("gettransform",str.match(reg3));
        return str.match(reg);
    }

}

function controlSvg() {
    var myElement = document.getElementById("svg1");
    var dx, dy;
    var mc = new Hammer(myElement);
    var pinch = new Hammer.Pinch();
    //        var rotate=new Hammer.Rotate();
    var pan = new Hammer.Pan();
    //        pinch.recognizeWith(rotate);

    //        mc.add([pinch,rotate,pan]);
    mc.add([pinch, pan]);

    mc.get('pan').set({ direction: Hammer.DIRECTION_ALL });

    mc.on('panstart', function(ev) {
        //            console.log(ev);
        //按下的时候获取当前的translated3d的值
        if (getTransform()) {
            var str = getTransform();
            dx = parseInt(str[1]);
            dy = parseInt(str[2]);
        }
        //            ev.preventDefault();
    });
    mc.on('panmove', function(ev) {
        var offx = dx + ev.deltaX;
        var offy = dy + ev.deltaY;
        setTranslated3d(offx, offy, '', '');
    });
    mc.on('panend', function(ev) {
        //            console.info(ev);
        ev.preventDefault();
    });


    var oldscale = 1;
    var oldrotate = 0;
    var ro = 0;
    var rotatenum = 0;

    mc.on('pinchstart ', function(ev) {
        if (getTransform()) {
            var str = getTransform();
            oldscale = str[4];
        }
        ro = ev.rotation;
    });
    mc.on("pinchmove ", function(ev) {
        var scale = oldscale * ev.scale;
        setTranslated3d('', '', scale, rotatenum);
    });

    mc.on('pinchend ', function(ev) {
        ev.preventDefault();

    });
    //获取当前点击的svg坐标
    // mc.on("tap", function(ev) {
    //     tapXY = ev.changedPointers[0];
    //     console.info("点击的坐标点",tapXY);
    // });

    //        mc.on('pinchstart rotatestart',function (ev) {
    //            if(getTransform()){
    //                var str = getTransform();
    //                oldscale = str[4];
    //            }
    //            ro = ev.rotation;
    //        });
    //        mc.on("pinchmove rotatemove",function (ev) {
    ////            console.info(ev.scale,oldscale);
    //            var scale = oldscale * ev.scale;
    //            rotatenum = oldrotate + ev.rotation-ro;
    //            setTranslated3d('','',scale,rotatenum);
    //        });
    //
    //        mc.on('pinchend rotateend',function (ev) {
    //            ev.preventDefault();
    //            //有时候没有触发这个事件？？？
    //            oldrotate = rotatenum;
    //            console.log("end    ",oldrotate);
    //        });


    //        var oldscale = 1 ;
    //        var oldrotate = 0;
    //        var ro = 0;
    //        var rotate = 0;
    //
    //        mc.on('pinchstart rotatestart',function (ev) {
    //            if(getTransform()){
    //                oldscale = getTransform()[4];
    //            }
    //            ro = ev.rotation;
    //            mc.on("pinchmove rotatemove",function (ev) {
    ////            console.info(ev.scale,oldscale);
    //                var scale = oldscale * ev.scale;
    //                rotate = oldrotate + ev.rotation-ro;
    //                setTranslated3d('','',scale,rotate);
    //
    //                mc.on('pinchend rotateend',function (ev) {
    //                    oldrotate = rotate
    //                });
    //                ev.preventDefault();
    //            });
    //            ev.preventDefault();
    //        });

}

function showPath(list, startX, startY, endX, endY) {
    // var pList = [{pcX:344,pcY:544},{pcX:415,pcY:535},{pcX:380,pcY:458},{pcX:291,pcY:458},{pcX:279,pcY:291}];
    var pList = list;
    console.log("位置是："+startX+' '+startY)
    if (pList.length > 0) {
        var pstr = 'M' + startX + ' ' + startY;
        for (var i = 0; i < pList.length; i++) {
            // if (i == 0) {
            //     pstr += 'M' + pList[i].pcX + ' ' + pList[i].pcY;
            // } else {
            //     pstr += 'L' + pList[i].pcX + ' ' + pList[i].pcY;
            // }
            pstr += 'L' + pList[i].pcX + ' ' + pList[i].pcY;
        }
        pstr += 'L' + endX + ' ' + endY;
        imgPath.attr({
            d: pstr,
            fill: "none",
            stroke: "#7d83bb",
            strokeWidth: 2,
            display: "inline"
        });
        // console.info("长度", p.getTotalLength());
        imgPath.addClass("path");
        // var imgStartX = pList[0].pcX-16,imgStartY = pList[0].pcY-30;
        // var imgEndX = pList[0].pcX-16,imgEndY = pList[0].pcY-30;
        // var img_start = s.paper.image("images/start.png",imgStartX,imgStartY);
        // var img_end = s.paper.image("images/end.png",imgEndX,imgEndY);
    } else {
        console.log("没有获得路径");
    }

}