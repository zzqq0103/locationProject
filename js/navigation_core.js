/**
 * Created by admin on 2017/6/27.
 */
var  isStatic=false;
const FILTERING_VALAUE=0.84;
var A = 0.0, B = 0.0,
    lowX = 0, lowY = 0, lowZ = 0, X = 0, Y = 0, Z = 0,
    s = 0, sum = 0, x = 0, y = 0, z = 0, w = 0, b = 0,
    c = 0, d = 0, newsum = 0, time_s2, biaoji = 0, newsum2 = 0, o = 0,
    num = 0, flag = 0,previousStep = 0;
var west=0,left,right,degree,roDegree;
function initValue() {
    isStatic = false;
    A = 0.0;
    B = 0.0;
    lowX = 0;
    lowY = 0;
    lowZ = 0;
    X = 0; Y = 0; Z = 0;
    s = 0;sum = 0; x = 0; y = 0; z = 0; w = 0; b = 0;
    c = 0; d = 0; newsum = 0; biaoji = 0;newsum2 = 0;o = 0;
    num = 0; flag = 0;
    previousStep = 0;
}
function startMotionSensor() {
    initValue();
    window.addEventListener("devicemotion",onSensorChanged,false);
}
function onSensorChanged(e){
    var flag=0;
    if (b == 0) {
        x++;
    } else if (c == 0) {
        y++;
    } else if (d == 0) {
        z++;
    } else {
        w++;
    }
    if(e.accelerationIncludingGravity){
        var accGravity=e.accelerationIncludingGravity;
        X = accGravity.x;
        // console.log(X);
        Y = accGravity.y;
        Z = accGravity.z;
        // Low-Pass Filter
        lowX = lowX * FILTERING_VALAUE + X
            * (1.0 - FILTERING_VALAUE);
        lowY = lowY * FILTERING_VALAUE + Y
            * (1.0 - FILTERING_VALAUE);
        lowZ = lowZ * FILTERING_VALAUE + Z
            * (1.0 - FILTERING_VALAUE);
        A = Math.sqrt(lowX * lowX + lowY * lowY + lowZ * lowZ);
        B = A - 9.8;
        num++;
        if (B > 6 || B < -5.0) {
            s = 0;
            num = 0;
        }
        else{
                if (s == 0 && flag == 0) {
                    flag = 1;
                    biaoji = 0;
                    num = 0;
                    if (B < 0.5) {
                        s = 0;
                    } else {
                        s = 1;
                    }
                }
                if (s == 1 && flag == 0) {
                    time_s2 = 0;
                    flag = 1;
                    if (B < 0.9 && B >= 0.5) {
                        s = 1;
                    }
                    if (B >= 0.9) {
                        s = 2;
                    }
                    if (B < 0.5) {
                        s = 4;
                    }

                }

                if (s == 4 && flag == 0) {
                    flag = 1;
                    if (biaoji >= 10) {
                        s = 0;
                    } else {
                        if (B >= 0.5) {
                            s = 1;
                        } else {
                            biaoji++;
                        }
                    }

                }

                if (s == 2 && flag == 0) {
                    flag = 1;
                    time_s2++;
                    if (time_s2 > 100) {
                        s = 0;
                    } else {
                        if (B >= 0.9) {
                            s = 2;
                        }
                        if (B < -0.5) {
                            s = 3;
                        }
                    }
                }

                if (s == 3 && flag == 0) {
                    flag = 1;
                    s = 6;

                }

                if (s == 6 && flag == 0) {
                    flag = 1;

                    s = 0;
                    sum++;

                    if (sum < 4) {
                        newsum++;
                        isStatic = false;
                        if (b == 0) {
                            b++;
                            y = x;
                        } else if (c == 0) {
                            c++;
                            z = y;
                        } else if (d == 0) {
                            d++;
                            w = z;
                        } else {

                        }
                    } else {
                        if ((w - x) < 300 && (w - x) > 20) {
                            newsum++;
                            isStatic = true;
                            b = 0;
                            x = w;

                        } else if ((x - y) < 300 && (x - y) > 20) {

                            newsum++;
                            isStatic = true;
                            c = 0;
                            b = 1;
                            y = x;
                        } else if ((y - z) < 300 && (y - z) > 20) {
                            newsum++;
                            isStatic = true;
                            d = 0;
                            c = 1;
                            z = y;
                        } else if ((z - w) < 300 && (z - w) > 20) {
                            newsum++;
                            isStatic = true;
                            w = z;
                            d = 1;
                        } else {
                            newsum++;
                            isStatic = false;
                            sum = 1;
                            b = 1;
                            c = 0;
                            d = 0;
                            x = 40;
                            y = 40;
                            z = 0;
                            w = 0;
                        }
                    }

                    if (isStatic == false) {
                        o = 0;
                    } else {
                        if (o == 0) {
                            newsum2 = newsum2 + 3;
                        }
                        newsum2++;
                        o = 1;
                    }
                }
        }
    }
}
function getStepCnt() {
    return newsum;
}
function startOrientationSensor(){
    window.addEventListener("deviceorientation", orientationHandler, false);
}
function orientationHandler(event) {
    // console.log(event)
    west=event.alpha;
    if(event.webkitCompassHeading){
        roDegree=event.webkitCompassHeading;
    }else{
        roDegree=event.alpha;
    }
    // left=event.beta;
    // right=event.gamma;
    // degree=Number(360-(90+west)).toFixed(2);
    // roDegree=degree>=0?degree:(360+Number(degree));
}
//指示当前前进方向
function rotated(cx,cy) {

    imgPosition.transform(new Snap.Matrix().rotate(roDegree,cx,cy));
}