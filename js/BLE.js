/**
 * Created by admin on 2017/7/6.
 */
/**
 * Created by admin on 2017/6/1.
 * 微信基本配置 } */
var testArr=[{'x':224,'y':405},
    {'x':227,'y':412},
    {'x':233,'y':430},
    {'x':235,'y':453},
    {'x':238,'y':482},
    {'x':243,'y':502},
    {'x':241,'y':548},
    {'x':237,'y':565},
    {'x':239,'y':608}];
var initSend=0;//用户首次定位标志
var previousStep,currentStep;
(function ($) {
    $.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }
})(jQuery);

function getAccessToken() {
    var url ='https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxff6b7d963bc7dad9&secret=8e89b21130ce986674c4b46c323d09da'
    $.ajax({
        type: "get",
        async: false,
        url: "http://www.isee-edu.com/SunEnglishHome/weixin/user/getWeiXinToken",
        data: {
            url: url,
        },
        dataType: "JSON",
        success: function (data) {
            console.log(data);
            var ticket_access_token=(JSON.parse(data['content'])).access_token;
            localStorage.setItem("jsapi_access_token",ticket_access_token);
            getTicket(ticket_access_token);
        }
    });
}

function getTicket(ticket_access_token) {
    var url='https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token='+ticket_access_token+'&type=jsapi'
    $.ajax({
        type: "get",
        async: false,
        url: "http://www.isee-edu.com/SunEnglishHome/weixin/user/getWeiXinToken",
        data: {
            url: url,
        },
        dataType: "JSON",
        success: function (data) {
            console.log(data);
            var jsapi_ticket=(JSON.parse(data['content'])).ticket;
            localStorage.setItem("jsapi_ticket",jsapi_ticket);
        }
    });
}

// function getTicket(access_token) {
//     var ticket;
//     console.log(access_token);
//     $.ajax({
//         type: "post",
//         async: false,
//         url: "http://118.190.41.235:8080/SmartyAgriculture/accessToken/getTicketBy",
//         data: {
//             accessToken: access_token
//         },
//         dataType: "text",
//         success: function(data) {
//             data=JSON.parse(data);
//             console.log(data['content']);
//             ticket = data['content']['Ticket'];
//         },
//         error: function(data) {
//             console.log(data);
//         }
//     });
//     return ticket;
// }

var isRecu   //是否递归
$(document).ready(function(){
    $('.floorlist-btn').on('click',function (e) {
        $('.floor-list').slideToggle("slow");
        $('.floorlist-btn').toggleClass("floorlist-btn-hover");
    });
    $('#get-pos').on('click',function () {
        // $('.layer2').show();
        isRecu=true;
        getLocation();
    });
    $('.close-btn').on('click',function (e) {
        $('.layer3').hide();
    });
    $('.to-here').on('click',function (e) {
        toHere();
    });
    $('.from-here').on('click',function (e) {
        fromHere();
    });
    $('#nav_back').on('click',function (e) {
        goBack();
    });
    $('.btn_pickup').on('click',function (e) {
        console.log(e);
        var obj=$(this);
        console.log(obj)
        getMapPoint(obj);
    });
    $('.confirm').on('click',function (e) {
        $('.view-2').show();
        $('.view-1').hide();
    });
    $('.test-btn').on('click',function () {//路径测试
        $('.view-2').show();
        $('.view-1').hide();
    });
    $('.realtime-icon').on('click',function () {
        tipsRealNav();//实时导航提示
    });
    if(!localStorage.getItem('openId')||localStorage.getItem('openId')==undefined||localStorage.getItem('openId')==null){
        //获取openid
        if(!$.getUrlParam('code')){
            getOpencode();
        }else{
            getOpenId();
            // getAccessToken();
        }
        if (!window.DeviceMotionEvent){
            $.alert("此设备不支持重力传感器");
        }
    }else{

    }
    startMotionSensor();//开启计步器
    startOrientationSensor();//开启指南针
    loadJSAPI();
});

function _log(){
    $('.res-panel').html("当前步数："+newsum+"指北针："+roDegree)
    $('.layer2').show();
    console.log('指南针测试');
}

//功能--配置公众号JSapi
function loadJSAPI() {
    getAccessToken();
    var sha1 = new Hashes.SHA1();
    var noncestr = "Wm3WZYTPz0wzccnW";
    var timestramp = new Date().getTime();
    var jsapi_ticket = localStorage.getItem("jsapi_ticket");
    var url = window.location.href;
    var tmpstr = "jsapi_ticket=" + jsapi_ticket + "&noncestr=" + noncestr + "&timestamp=" + timestramp + "&url=" + url;
    var signstr = sha1.hex(tmpstr);
    console.log(tmpstr);
    console.log(signstr);
    wx.config({
        beta: true,
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: 'wxff6b7d963bc7dad9', // 必填，公众号的唯一标识
        timestamp: timestramp, // 必填，生成签名的时间戳
        nonceStr: 'Wm3WZYTPz0wzccnW', // 必填，生成签名的随机串
        signature: signstr,// 必填，签名，见附录1
        jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage",'openWXDeviceLib',
            'closeWXDeviceLib','getWXDeviceInfos',
            'getWXDeviceBindTicket',
            'getWXDeviceUnbindTicket',
            'startScanWXDevice',
            'stopScanWXDevice','onWXDeviceStateChange',
            'onScanWXDeviceResult',
            'onReceiveDataFromWXDevice',
            'onWXDeviceBluetoothStateChange'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    });
    wx.error(function(){
        $.alert("JSAPI配置失败","提示");
    })
    wx.ready(function (){
    });

}

var resAccObj=[62];//保存重力加速度传感

//功能--定位（获取蓝牙列表、重力加速度传感列表）
function noNettest() {
     var positionObj={"X":600,"Y":400};
    localStorage.removeItem("position");
    localStorage.setItem("position",JSON.stringify(positionObj));
    getPosition(positionObj.X,positionObj.Y);
    // ui_zoomOut(1.5,1.5,534,534)
}

function getLocation() {
    //noNettest();
    // _log();
    if(isRecu){
        wx.startSearchBeacons({
            ticket:"",
            complete:function(argv){
                 console.log(argv)
                if(argv['errMsg']=="startSearchBeacons:bluetooth power off"){
                    $.alert("请打开蓝牙","提示");
                    isRecu=false;
                }else{
                    console.log("开始扫描")
                    wx.onSearchBeacons({
                        complete:function(res){
                            console.log(res)
                            // $.alert("扫描完成")
                             var _static;
                            if(initSend==0){
                                previousStep=currentStep=getStepCnt();
                                _static =true;
                                initSend=1;
                            }else{
                                currentStep=getStepCnt();
                                // console.log(currentStep==previousStep)
                                _static=(currentStep==previousStep)?true:false;
                                previousStep=currentStep;
                            }
                            var resBleObj=new Array();//保存蓝牙搜索结果
                            jQuery.each(res['beacons'],function (i,val) {
                                if(val['rssi']!=0){
                                    resBleObj.push({"minor":Number(val['minor']),"rssi":Number(val['rssi'])})
                                }
                            });
                            var res=setData(resBleObj,_static);
                            $('.res-panel').html("当前步数："+currentStep+"指北针："+roDegree+" 是否静止："+_static)
                            $('.layer2').show()
                            if(JSON.parse(res).bleList.length>0){
                                console.log(res)
                                sendData(res);
                            }
                        }
                    });
                    isRecu=true;
                }
            }
        });
        //setTimeout('getLocation()',1000)
    }
}

function getBeacons() {

}

//功能--停止扫描蓝牙+加速度传感
function stopGetLocation() {
    wx.startSearchBeacons({
        ticket:"",
        complete:function(argv){
            $.alert(argv)
        }
    });
    stopSensor();//关闭传感器
}

//功能--传输后台数据整理
function setData(ble,acc) {
    var data={};
    data.bleList=ble;
    data.isStatic=acc;
    data.openid=localStorage.getItem('openId');
    var res=JSON.stringify(data);
    return res;
}

//功能--发送数据
function sendData(data){
    $.ajax({
        type:'POST',
        url:"http://www.mcilab.cn/LocationWebapp/shougang/location",
        // url:"http://192.168.1.100:8080/LocationWebapp/shougang/location",
        data:{
            data:data,
        },
        dataType:"JSON",
        success:function (data) {
            // alert(JSON.stringify(data))
            console.log(JSON.stringify(data));
            var x=data['data']['pcX'];
            var y=data['data']['pcY'];
            getPosition(x,y);
            var positionObj={"X":x,"Y":y};
            // console.log("当前定位结果是："+JSON.stringify(positionObj))
            localStorage.removeItem("position");
            localStorage.setItem("position",JSON.stringify(positionObj));
            wx.stopSearchBeacons({
                complete:function(res){
                    console.log("关闭扫描")
                }
            });
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            $.alert(XMLHttpRequest.status);
            $.alert(XMLHttpRequest.readyState);
            $.alert(textStatus);
        }
    })
}

//功能--获取id
function getOpencode(){
    var appId='wxff6b7d963bc7dad9';
    var uri=window.location.href;
    uri=encodeURIComponent(uri);
    var url='https://open.weixin.qq.com/connect/oauth2/authorize?appid='+appId+'&redirect_uri='+uri+'&response_type=code&scope=snsapi_base'
        +'&state=12345#wechat_redirect';
    window.location.href=url;
}

function getOpenId() {
    var appId='wxff6b7d963bc7dad9';
    var code=$.getUrlParam('code');
    var secret='';
    var url='https://api.weixin.qq.com/sns/oauth2/access_token?appid='+appId+'&secret=8e89b21130ce986674c4b46c323d09da&code='+code+'&grant_type=authorization_code';
    $.ajax({
        type:"get",
        async:false,
        url:"http://www.isee-edu.com/SunEnglishHome/weixin/user/getWeiXinToken",
        data:{
            url:url,
        },
        dataType:"JSON",
        success:function (data) {
            //console.log(JSON.parse(data.content));
            localStorage.setItem('openId',(JSON.parse(data.content)).openid)
        }
    });
}