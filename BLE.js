/**
 * Created by admin on 2017/6/1.
 * 微信基本配置
 } */
function getAccessToken() {
    var accessToken;
    $.ajax({
        type: "post",
        async: false,
        url: 'http://118.190.41.235:8080/SmartyAgriculture/accessToken/getToken',
        data: {},
        dataType: "json",
        success: function(data) {
            console.log(data)
            accessToken = data.content;
        }
    });
    return accessToken;
}
function getTicket(access_token) {
    var ticket;
    console.log(access_token);
    $.ajax({
        type: "post",
        async: false,
        url: "http://118.190.41.235:8080/SmartyAgriculture/accessToken/getTicketBy",
        data: {
            accessToken: access_token
        },
        dataType: "text",
        success: function(data) {
            data=JSON.parse(data);
            console.log(data['content']);
            ticket = data['content']['Ticket'];
        },
        error: function(data) {
            console.log(data);
        }
    });
    return ticket;
}
$(document).ready(function(){
    $('.floorlist-btn').on('click',function (e) {
        $('.floor-list').slideToggle("slow");
        $('.floorlist-btn').toggleClass("floorlist-btn-hover");
    });
    $('#get-pos').on('click',function (e) {
        // $('.layer2').show();
        getLocation();
    });
    // $('.close-btn').on('click',function (e) {
    //     $('.layer3').hide();
    // });
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
    // $('.confirm').on('click',function (e) {
    //     $('.view-2').show();
    //     $('.view-1').hide();
    // });
    if (!window.DeviceMotionEvent){
        $.alert("此设备不支持重力传感器");
    }
    loadMOtionEvent();
    loadJSAPI();
});
//功能--配置公众号JSapi
function loadJSAPI() {
    var access_token=getAccessToken();
    console.log(access_token)
    var sha1 = new Hashes.SHA1();
    var noncestr = "Wm3WZYTPz0wzccnW";
    var timestramp = new Date().getTime();
    var jsapi_ticket = getTicket(access_token);
    var url = window.location.href;
    var tmpstr = "jsapi_ticket=" + jsapi_ticket + "&noncestr=" + noncestr + "&timestamp=" + timestramp + "&url=" + url;
    var signstr = sha1.hex(tmpstr);
    console.log(tmpstr);
    console.log(signstr);
    wx.config({
        beta: true,
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: 'wx364978a4b74fac34', // 必填，公众号的唯一标识
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
        // wx.invoke('openWXDeviceLib', {'connType':'blue'}, function(res) {
        //     alert(JSON.stringify(res))
        //     if(res.err_msg=='openWXDeviceLib:ok')
        //     {
        //         if(res.bluetoothState=='off')
        //         {
        //             alert("使用前请先打开手机蓝牙！");
        //         };
        //         if(res.bluetoothState=='unauthorized')
        //         {
        //             alert("请授权微信蓝牙功能并打开蓝牙！");
        //         };
        //         // if(res.bluetoothState=='on')
        //         // {
        //         //     alert("蓝牙已开启！");
        //         // };
        //     }
        //     else
        //     {
        //         alert("微信蓝牙打开失败");
        //     }
        // });
    });
}
var resAccObj=[62];//保存重力加速度传感
//功能--定位（获取蓝牙列表、重力加速度传感列表）
function getLocation(){
    wx.startSearchBeacons({
        ticket:"",
        complete:function(argv){
            if(argv['errMsg']=="startSearchBeacons:bluetooth power off"){
                $.alert("请打开蓝牙","提示");
            }else{
                wx.onSearchBeacons({
                    complete:function(res){
                        // $('.res-panel').html("")
                        var resBleObj=new Array();//保存蓝牙搜索结果
                        jQuery.each(res['beacons'],function (i,val) {
                            if(val['rssi']!=0){
                                resBleObj.push({"minor":Number(val['minor']),"rssi":Number(val['rssi'])})
                            }
                        });
                        var res=setData(resBleObj,resAccObj);
                        sendData(res);
                    }
                });
            }
        }
    });
}
//功能--获取加速度传感功能
function getAccele() {
    
}
//功能--获取加速度值
function motionHandler(eventData) {
    $('.res-panel').html('');
    var accGravity=eventData.accelerationIncludingGravity;
    var tmp={"accX":accGravity.x,"accY":accGravity.y,"accZ":accGravity.z};
    if(resAccObj.length>62){
        resAccObj.shift();
        resAccObj.push(tmp);
    }else {
        resAccObj.push(tmp);
    }
    // $('.res-panel').html(JSON.stringify(resAccObj)+"加速度传感对象："+resAccObj.length);
}
//功能--判断浏览器对加速度传感支持情况
function loadMOtionEvent() {
    if (window.DeviceMotionEvent) {
        window.addEventListener("devicemotion", motionHandler, false);
    } else {
        document.body.innerHTML = "What user agent u r using???";
    }
    if (window.DeviceOrientationEvent) {
        window.addEventListener("deviceorientation", orientationHandler, false);
    } else {
        document.body.innerHTML = "What user agent u r using???";
    };
}
//功能--撤销重力传感监听事件
function motionEventCancel(){
    window.removeEventListener("devicemotion",motionHandler,false)
}
function orientationHandler() {

}
//功能--传输后台数据整理
function setData(ble,acc) {
    var data={};
    data.bleList=ble;
    data.accList=acc;
    var res=JSON.stringify(data);
    console.log(JSON.stringify(data));
    return res;
}
//功能--发送数据
function sendData(data){
    $.ajax({
        type:'POST',
        url:"http://mayiwoaini.6655.la:20052/LocationWebapp/shougang/location",
        data:{
            data:data,
        },
        dataType:"JSON",
        success:function (data) {
            // alert(JSON.stringify(data))
            var x=data['data']['pcX'];
            var y=data['data']['pcY'];
            getPosition(x,y);
            var positionObj={"X":x,"Y":y};
            localStorage.removeItem("position");
            localStorage.setItem("position",positionObj);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
                        $.alert(XMLHttpRequest.status);
                        $.alert(XMLHttpRequest.readyState);
                        $.alert(textStatus);
        }
    })
}