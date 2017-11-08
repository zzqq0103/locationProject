/**
 * Created by admin on 2017/6/15.
 */
var type;
//POI面板显示控制,flag-1普通选点，2-地图选点
function showOrhide(data,bool,flag) {
    if(bool && flag==1){//普通点击
        console.log("类型1")
        $('.attribute').html(data);
        $('.selectDotPanel').show();
        $('.line-2').show();
        $('.line-3').hide();
    }else if(bool && flag==2){//地图选点
        console.log("类型2")
        $('.selectDotPanel').show();
        $('.attribute').html(data);
        $('.line-2').hide();
        $('.line-3').hide();
    }else{
        $('.attribute').html('');
        $('.line-3').show();
        $('line-2').show();
        $('.layer3').hide();
    }
}
//POI 显示板;参数：s--polygon对象；flag--1>普通点击，2>地图选点
function getNavigation(s,flag) {
    $("polygon").on("click", function (e) {
        var _this = $(this);
        console.log(_this);
        var fillColor = _this.attr('fill');
        var map=POS.controler();//获取POI信息
        console.log(map)
        var POI=map.getPOIPolygon(_this);
        console.log(POI)
        var data=POI[0]["-displayName"];
        if(flag==1){
            if (fillColor != "#F57421") {//获取点击事件
                console.log("普通点击")
                s.selectAll("polygon").attr({//所有的块设为白色
                    fill: "#C9C598"
                });
                _this.attr({//当前块设置为蓝色
                    "fill": "#F57421"
                });
                showOrhide(data,true,1);
            } else {
                _this.attr({
                    "fill": "#C9C598"
                });
                showOrhide(data,false,1);
            }
            return;
        } else{
            console.log("地图选点")
            if (fillColor != "#F57421") {//获取点击事件
                s.selectAll("polygon").attr({//所有的块设为白色
                    fill: "#C9C598"
                });
                _this.attr({//当前块设置为蓝色
                    "fill": "#F57421"
                });
                showOrhide(data,true,2);
            } else {
                _this.attr({
                    "fill": "#C9C598"
                });
                showOrhide(data,false,2);
            }
            console.log("地图选点"+JSON.stringify(POI[0]));
            setPositionFlag2(POI[0]['-displayName'],type);
            return selectCallback(type,POI[0]);
        }
    });
}
//功能--（地图选点）添加起始点标识,str--热区名字，type--地点类型，1-起点，2-终点
function getPositionFlag(str,type) {
    s = Snap("#图层_1");
    var map=POS.controler();
    var pos=map.getCenterPXByStr(str);
    console.log(pos)
    var offx,offy;
    var cx = pos.x-16, cy = pos.y-30;//中心点坐标
    var r = 10;//定位圆的半径
    // var circle = s.circle(cx, cy, r);
    if(type==1){
        var img = s.image('images/start.png',cx,cy,30,30);
    }else {
        var img = s.image('images/end.png',cx,cy,30,30);
    }
    offx = swidth/2-cx;
    offy = sheight/2 -cy;
    setTranslated3d(offx,offy,'','');
}
//功能--（地图选点）添加终结点标识,str--热区名字，flag--地点类型，1-起点，2-终点
function setPositionFlag(str,type){
    s = Snap("#图层_1");
    var map=POS.controler();
    var pos=map.getCenterPXByStr(str);
    console.log(pos)
    var offx,offy;
    var cx = pos.x-16, cy = pos.y-30;//中心点坐标
    var r = 10;//定位圆的半径
    // var circle = s.circle(cx, cy, r);
    if(type=='start'){
        var img = s.image('images/start.png',cx,cy,30,30);
    }else {
        var img = s.image('images/end.png',cx,cy,30,30);
    }
    offx = swidth/2-cx;
    offy = sheight/2 -cy;
    setTranslated3d(offx,offy,'','');
}
/**
 * 修改的函数
 * */
function setPositionFlag2(str,type){
    s = Snap("#图层_1");
    var map=POS.controler();
    var pos=map.getCenterPXByStr(str);
    console.log(pos)
    var offx,offy;
    var cx = pos.x-16, cy = pos.y-30;//中心点坐标
    var r = 10;//定位圆的半径
    // var circle = s.circle(cx, cy, r);
    if(type=='start'){
        imgStart.attr({
            display:"inline",
            x:cx,
            y:cy
        });
    }else {
        imgEnd.attr({
            display:"inline",
            x:cx,
            y:cy
        });
    }
    // offx = swidth/2-cx;
    // offy = sheight/2 -cy;
    // setTranslated3d(offx,offy,'','');
}
function getPositionFlag2(str,type) {
    s = Snap("#图层_1");
    var map=POS.controler();
    var pos=map.getCenterPXByStr(str);
    console.log(pos)
    var offx,offy;
    var cx = pos.x-16, cy = pos.y-30;//中心点坐标
    var r = 10;//定位圆的半径
    // var circle = s.circle(cx, cy, r);
    if(type==1){
        imgStart.attr({
            display:"inline",
            x:cx,
            y:cy
        });
    }else {
        imgEnd.attr({
            display:"inline",
            x:cx,
            y:cy
        });
    }
    // offx = swidth/2-cx;
    // offy = sheight/2 -cy;
    // setTranslated3d(offx,offy,'','');
}
//功能--点击获取起始点


//功能--去这里
// function toHere() {
//     var here= $('.attribute').html();
//     getPositionFlag2(here,2)
//     $('#end_input').val(here);
//     $('#start_input').val('');
//     $('.view-2').show();
//     $('.view-1').hide();
// }

//功能--从这里出发
// function fromHere(){
//     var here= $('.attribute').html();
//     getPositionFlag2(here,1)
//     $('#end_input').val('');
//     $('#start_input').val(here);
//     $('.view-2').show();
//     $('.view-1').hide();
// }

//功能--返回
// function goBack(){
//     var svg=Snap("#图层_1");
//     $('polygon').unbind()
//     getNavigation(svg,1);
//     $('.view-2').hide();
//     $('.view-1').show();
// }

//功能--地图选点（点击后回滚函数）
// function selectCallback(type,data) {
//     if(type=='start'){
//         // $('#end_input').val('');
//         $('#start_input').val(data['-displayName']);
//         $('#start_input').data('x',data['-markX']);
//         $('#start_input').data('y',data['-markY']);
//     }else {
//         $('#end_input').val(data['-displayName']);
//         $('#start_input').data('x',data['-markX']);
//         $('#start_input').data('y',data['-markY']);
//     }
//     // $('.view-2').show();
//     // $('.view-1').hide();
// }

//功能--（接上)点击获取对应位置信息
// function getMapPoint(obj){
//     $('.view-2').hide();
//     $('.view-1').show();
//     type=obj[0].dataset.type;
//     $('.layer3').hide();
//     var svg=Snap("#图层_1");
//     $('polygon').unbind()
//     getNavigation(svg,2);
// }