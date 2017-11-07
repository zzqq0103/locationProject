/**
 * Created by admin on 2017/6/9.
 * 个人--svg操控库
 */
(function () {
    window['POS']={};
    function  MapControler(){
        var map=new Object();//定义自己的地图对象
        map.getCenterPX=function(o){// 获取中心点，参数--对象；返回值--包含X、Y的坐标对象
            var res=new Object();
            var x=0,y=0;//保存中心点坐标
            var num=0;
            var arr=new Array();
            var list=o[0].attributes.points.nodeValue;
            arr=list.split(/\s+/);
            for(var i=0;i<arr.length;i++){
                if(arr[i].length>0){
                    x+=Number(arr[i].split(',')[0]);
                    y+=Number(arr[i].split(',')[1]);
                    ++num;
                }
            }
            // console.log(x+' '+y+' '+num)
            x=(x/num).toFixed(3);
            y=(y/num).toFixed(3);
            res.X=x;
            res.Y=y;
            console.log("中心点："+x+" "+y);
            return res;
        };
        map.getCenterPXByStr=function (str){//获取中心点，参数--名称字符串；返回值--中心点坐标对象（x,y）
            console.log("点选坐标："+str)
            var target=svgConfig.FloorPOIMgr.PolygonPOI.filter(function (a) {
                return (a["-displayName"]==str);
            });
            var res={"x":target[0]["-markX"],"y":target[0]['-markY']};
            console.log("zuo坐标对象"+JSON.stringify(res));
            return res;
        }
        map.getPOIPolygon=function(obj){//获取面对象的POI信息，参数——面对像；返回值——POI属性对象
            //  console.log(e)
            // var obj=e.target();
            var centerPX=map.getCenterPX(obj);
            var configX = parseInt(centerPX.X);
            var configY = parseInt(centerPX.Y);
            var configName = svgConfig.FloorPOIMgr.PolygonPOI.filter(function (a) {
                return (parseInt(a["-cx"]) == configX && parseInt(a["-cy"]) == configY);
            });
            console.log(configName)
            return configName;
        }
    return map;
    }
    window['POS']['controler']=MapControler;
})();