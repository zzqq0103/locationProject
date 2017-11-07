/**
 * Created by admin on 2017/6/30.
 * 界面控件操作
 */
//功能-自适应屏幕宽高
function ui_autoAjust(){
    // var svg=Snap('#图层_1')
    var root=$('#图层_1')[0];
    console.log(root)
    var windowWidth = $(window).width();
    var viewInfo=root.getAttribute('viewBox');
    var views=viewInfo.split(" ");
    var viewwidth=views[2];
    var viewheight=views[3];
    root.removeAttribute("width");
    root.removeAttribute("height");
    var setwidth=windowWidth;
    var setheight=(setwidth*viewheight)/viewwidth;
    root.setAttribute("width",setwidth);
    root.setAttribute("height",setheight);
}
//功能--实时导航
function ui_realTimeNav(){
    $('.layer1').hide();
    $('.layer3').hide();
    $('.layer-realtime').show()
}
//显示定位图标,i-icon
function imglocationShow(){
    imgPosition.attr({
        display:"block"
    })
}
//功能--关闭定位图标
function imgstopLocation(){
    imgPosition.attr({
        display:"none"
    })
}
/*
 缩放-
    x 数值。水平方向缩放的比例。1表示不缩放。
    y 数值。垂直方向缩放的比例。1表示不缩放。
    cx 数值。表示缩放中心点的x位置。
    cy 数值。表示缩放中心点的y位置。
    */
function ui_zoomOut(x,y,cx,cy) {
    // console.log("缩放开始")
    var svg = Snap("#图层_1");
    var m = new Snap.Matrix();
    m.scale(x, y,cx,cy);
    svg.transform(m);
}
//显示起点
function imgStartShow(){
    imgPosition.attr({
        display:"block"
    })
}
function imgStartHide(){
    imgStart.attr({
        display:"none"
    })
}
function tipsRealNav(){
    $.confirm({
        title: '提示',
        text: '是否从当前位置开始导航',
        onOK: function () {
            startPathTest();
        },
        onCancel: function () {
            //取消
        }
    });
}