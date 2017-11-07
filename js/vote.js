/**
 * Created by 18348 on 2017/11/3.
 */
(function ($) {
    $.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }
})(jQuery);
newUrl="";
var power=0;
var flag=true;
var numScan=0;
var isJudge=0;//保证蓝牙没开启后  无任何后续提示
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
            var jsapi_ticket=(JSON.parse(data['content'])).ticket;
            localStorage.setItem("jsapi_ticket",jsapi_ticket);
        }
    });
}

function loadJSAPI() {
    getAccessToken();
    var sha1 = new Hashes.SHA1();
    var noncestr = "Wm3WZYTPz0wzccnW";
    var timestramp = new Date().getTime();
    var jsapi_ticket = localStorage.getItem("jsapi_ticket");
    var url = window.location.href;
    var tmpstr = "jsapi_ticket=" + jsapi_ticket + "&noncestr=" + noncestr + "&timestamp=" + timestramp + "&url=" + url;
    var signstr = sha1.hex(tmpstr);
    wx.config({
        beta: true,
        debug: false,
        appId: 'wxff6b7d963bc7dad9',
        timestamp: timestramp,
        nonceStr: 'Wm3WZYTPz0wzccnW',
        signature: signstr,
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
        // searchBeacon();
        wx.startSearchBeacons({
            ticket:"",
            complete:function(argv){
                console.log(argv)
                if(argv['errMsg']=="startSearchBeacons:bluetooth power off"){
                    isJudge=1;
                    $(".weui-loadmore").hide();
                    $.alert({
                        title: '提示',
                        text: '请打开系统蓝牙，完成后刷新页面',
                        onOK: function () {
                            // window.location.reload();
                        }

                    });
                    //$.alert("请打开系统蓝牙，完成后刷新页面","提示");
                }else{
                    console.log("开始扫描")
                    wx.onSearchBeacons({
                        complete:function(res){
                            console.log(res)
                            power=1;
                            numScan+=1;
                            console.log(numScan);
                            listenPower();
                            // window.location.href=newUrl;
                        }
                    });
                    //setTimeout("judgePower()",2000);
                }
            }
        });
    });
}

function searchBeacon() {
    wx.startSearchBeacons({
        ticket:"",
        complete:function(argv){
            console.log(argv)
            if(argv['errMsg']=="startSearchBeacons:bluetooth power off"){
                //$.alert("请打开系统蓝牙，完成后刷新页面","提示");
            }else{
                console.log("开始扫描")
                wx.onSearchBeacons({
                    complete:function(res){
                        console.log(res)
                        power=1;
                        numScan+=1;//防止每次扫描后都跳转页面（重复跳转）
                        console.log(numScan);
                        listenPower();
                    }
                });
            }
        }
    });
    setTimeout("searchBeacon()",1000);
}
var flag=true
function listenPower() {
    if(flag&&numScan==1){
        flag=false;
        wx.stopSearchBeacons({
            complete:function(res){
            }
        });
        console.log(newUrl)
        window.location.href=newUrl;
    }
    //setTimeout("listenPower()",100);
}
function judgePower() {
    if(power==1){
        // wx.stopSearchBeacons({
        //     complete:function(res){}
        // });
        //window.location.href=url;
    }else{
        if(isJudge==0){//蓝牙一打开
            $(".weui-loadmore").hide();
            $.alert("抱歉！此投票仅限体育馆内。","提示");
        }
    }
}

function getid() {
    var id =parseInt(getUrlParam('id'));
    var stramp=Date.parse(new Date());
    stramp=parseInt(stramp.toString().substr(0,10));
    var data={"id":id,"stamp":stramp};
    $.ajax({
        type: "post",
        async: false,
        url: "http://39.106.20.224/LocationWebapp/shougang/vote",
        contentType: "application/json",
        data: JSON.stringify(data),
        dataType: "JSON",
        success: function (res) {
            newUrl="http://www.joyreserve.com/index.php/init/vote/id/"+id+"/signature/"+res['secret'];
            loadJSAPI();
        }
    });
}
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}
$(document).ready(function () {
    getid();
    searchBeacon();
    //listenPower();
})