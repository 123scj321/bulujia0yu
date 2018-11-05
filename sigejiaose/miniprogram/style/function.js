// 路径
const url = "http://xyds.4hl.cn/xyds/index.php/";//url:"http://xyds.4hl.cn/xyds/index.php/",
// 登录事件
function loginHandler(callback) {
    wx.login({
      success: res => {
        // console.log(res);

        if (res.code) {
          wx.setStorageSync("openId", res.code );
          wx.getUserInfo({
            success: res => {
              wx.setStorageSync("userMessage", { avatar: res.userInfo.avatarUrl, username: res.userInfo.nickName, buttonText: "退出" });
            }
          })
        }
      }
    })
};
// 地址获取
function getLatLntHandler(callback){
  var latitude = null;
  var longitude = null;
  var speed = null;
  var accuracy = null;
  var addressName=null;
  wx.getLocation({
    type: 'gcj02',
    success (res) {
      latitude = res.latitude
      longitude = res.longitude
      speed = res.speed
      accuracy = res.accuracy;
      var locationString = res.latitude + "," + res.longitude;
        addressName_fun(latitude + "," + longitude,(address)=>{
          callback({ latitude, longitude, speed, accuracy, address})
        })
    },
    fail:function(){
      wx.showToast({
        title: '请求失败',
      })
    },
    complete:function(){
      wx.showToast({
        title: '请求失败',
      })
    }})
}
// 获取地址
function addressName_fun(params,call){
  wx.request({
    url: 'http://apis.map.qq.com/ws/geocoder/v1/?l&get_poi=1', //根据经纬度转换成具体地址
    data: {
      "key": "YLFBZ-WHAWI-ZXUGH-53Q65-TOJ7E-ADBNQ",
      "location": params
    },
    method: 'GET',
    // header: {},
    success(res) {
     
      call(res.data.result.address)
    },
    fail: function () {
      wx.showToast({
        title: '请求失败',
      })
    },
    complete: function () {
      wx.showToast({
        title: '请求失败',
      })
    }
  })
}
// 页面跳转
function intoPageHandler(params) {
  // console.log(params);
  // wx.redirectTo({
  //   url: params,
  // })
  wx.navigateTo({
    url: params,
  })
}
 
function payHandler(e) {
  var money = '0.01';
  wx.request({
    url: 'http://cjapp.135k.com/index.php/api/Pay/rechargePay',
    method: 'get',
    data: {
      uid: wx.getStorageSync('uid'),
      money: money,
    },
    success: function (res) {
      // console.log('res', res)
      var prepay_id = res.data.weixin.package
      var pay_id = prepay_id.slice(10);
      wx.requestPayment({
        'timeStamp': '' + res.data.weixin.timeStamp + '',
        'nonceStr': '' + res.data.weixin.nonceStr + '',
        'package': '' + res.data.weixin.package + '',
        'signType': 'MD5',
        'paySign': '' + res.data.weixin.paySign + '',
        'success': function (res) {
          wx.showToast({
            title: '支付成功',
            duration: 1500,
            success: function (res) {
              // console.log('eres', res)
              //支付成功后回调处理数据
              wx.request({
                url: 'http://cjapp.135k.com/index.php/api/Pay/callback',
                method: "get",
                data: {
                  uid: wx.getStorageSync('uid'),
                  openid: wx.getStorageSync('openid'),
                  pay_id: pay_id,
                },
                success: function (res) {
                  // console.log('resresres', res)
                }
              })
            }
          })
        },
        'fail': function (res) {
          // wx.navigateTo({
          //   url: '../smallclass/index',
          // })
        }
      })
    }
  })
}
// 获取位置路线
function getPolyline(callback) {
  wx.request({
    url: `https://apis.map.qq.com/ws/direction/v1/bicycling/?from=${wx.getStorageSync("current_address").latitude},${wx.getStorageSync("current_address").longitude}&to=34.28,108.94&key=Z6RBZ-6H4CU-AV6V5-2OTIO-Q2CLZ-VMF5T`,
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {
      var coors = res.data.result.routes[0].polyline;
      for (var i = 2; i < coors.length; i++)
      { coors[i] = coors[i - 2] + coors[i] / 1000000 }
      // console.log(coors);
      const points = [];
      for (var j = 0; j < coors.length; j += 2) {
        points[points.length] = { longitude: coors[j + 1], latitude: coors[j] }
      }
      callback(points);
    },
    fail: function () {
    }
  })
}
// callPhoneHandler 联系客服
function callPhoneHandler(params) {
  wx.makePhoneCall({
    phoneNumber: params,
  })
}
// showToast 显示提示信息函数
function showToast(message, icon) {
  wx.showToast({
    title: message,
    icon: icon
  })
}
// 
function showModal(showtitle, showconttent, callback) {
  wx.showModal({
    title: showtitle,
    content: showconttent,
    success: function (res) {
      callback(res.confirm)
    },
    fail: function () {
      showToast("网络出现问题，请重试", "none")
    }
  })
}
// phoneTest 电话号码验证
function regTest(params, message, reg) {
  if (reg !== undefined){
    if (params == '' || !reg.test(params)) {
      showToast(message, "none")
      return false;
    } else {
      return true;
    }
  }else{
    if (params == '' || params == undefined ) {
      showToast(message, "none")
      return false;
    } else {
      return true;
    }
  }
  
}
//倒计时 倒数
function countDown(params, callback) {
  var seconds = 59;
  var countTimer = setInterval(function () {
    seconds--;
    callback(params + "s");
    if (seconds <= 0) {
      countTimer = clearInterval(countTimer);
      callback("获取验证码");
    }
  }, 1000);
}
// 验证银行卡号
function bankTest(bankno) {
  var lastNum = bankno.substr(bankno.length - 1, 1);//取出 最后一位（与 luhm 进行比较） 
  var first15Num = bankno.substr(0, bankno.length - 1);// 前 15 或 18 位 
  var newArr = new Array();
  for (var i = first15Num.length - 1; i > -1; i--) {
    newArr.push(first15Num.substr(i, 1));
  }
  var arrJiShu = new Array(); //奇数位*2 的积 <9 
  var arrJiShu2 = new Array(); //奇数位*2 的积 >9 
  var arrOuShu = new Array(); //偶数位数组 
  for (var j = 0; j < newArr.length; j++) {
    if ((j + 1) % 2 == 1) {
      //奇数位 
      if (parseInt(newArr[j]) * 2 < 9)
        arrJiShu.push(parseInt(newArr[j]) * 2);
      else arrJiShu2.push(parseInt(newArr[j]) * 2);
    }
    else
      arrOuShu.push(newArr[j]);
  }
  var jishu_child1 = new Array();//奇数位*2 >9 的分割之 后的数组个位数 
  var jishu_child2 = new Array();//奇数位*2 >9 的分割之 后的数组十位数 
  for (var h = 0; h < arrJiShu2.length; h++) { jishu_child1.push(parseInt(arrJiShu2[h]) % 10); jishu_child2.push(parseInt(arrJiShu2[h]) / 10); } var sumJiShu = 0; //奇数位*2 < 9 的数组之和 
  var sumOuShu = 0; //偶数位数组之和 
  var sumJiShuChild1 = 0; //奇数位*2 >9 的分割之后的数组 个位数之和 
  var sumJiShuChild2 = 0; //奇数位*2 >9 的分割之后的数组 十位数之和 
  var sumTotal = 0;
  for (var m = 0; m < arrJiShu.length; m++) { sumJiShu = sumJiShu + parseInt(arrJiShu[m]); }
  for (var n = 0; n < arrOuShu.length; n++) { sumOuShu = sumOuShu + parseInt(arrOuShu[n]); }
  for (var p = 0; p < jishu_child1.length; p++) { sumJiShuChild1 = sumJiShuChild1 + parseInt(jishu_child1[p]); sumJiShuChild2 = sumJiShuChild2 + parseInt(jishu_child2[p]); }
  //计算总和 
  sumTotal = parseInt(sumJiShu) + parseInt(sumOuShu) + parseInt(sumJiShuChild1) + parseInt(sumJiShuChild2);
  //计算 Luhm 值 
  var k = parseInt(sumTotal) % 10 == 0 ? 10 : parseInt(sumTotal) % 10;
  var luhm = 10 - k; if (lastNum == luhm) {
    return true;
  }
  else {
    showToast("请输入正确的银行卡号", "none")

    // console.log("验证失败");
    return false;
  }
}
// 身份证号验证
function IdCardTest(idCard) {
  //15位和18位身份证号码的正则表达式
  var regIdCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;

  //如果通过该验证，说明身份证格式正确，但准确性还需计算
  if (regIdCard.test(idCard)) {
    if (idCard.length == 18) {
      var idCardWi = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2); //将前17位加权因子保存在数组里
      var idCardY = new Array(1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2); //这是除以11后，可能产生的11位余数、验证码，也保存成数组
      var idCardWiSum = 0; //用来保存前17位各自乖以加权因子后的总和
      for (var i = 0; i < 17; i++) {
        idCardWiSum += idCard.substring(i, i + 1) * idCardWi[i];
      }
      var idCardMod = idCardWiSum % 11;//计算出校验码所在数组的位置
      var idCardLast = idCard.substring(17);//得到最后一位身份证号码
      //如果等于2，则说明校验码是10，身份证号码最后一位应该是X
      if (idCardMod == 2) {
        if (idCardLast == "X" || idCardLast == "x") {
          return true;
        } else {
          showToast("身份证号码错误!", "none")

          return false;
        }
      } else {
        //用计算出的验证码与最后一位身份证号码匹配，如果一致，说明通过，否则是无效的身份证号码
        if (idCardLast == idCardY[idCardMod]) {
          return true;
        } else {
          showToast("身份证号码错误!", "none")
          return false;
        }
      }
    }
  } else {
    showToast("身份证格式不正确！", "none")
    return false;
  }
}
// 时间选择器
function selectTimeHandler(dateParams, hoursParams, minutesParams) {
  // console.log(dateParams);
  const data = new Date();
  const hour = data.getHours();
  const hours = [];
  const minute = [];
  // console.log(dateParams, hoursParams, minutesParams);
  if (dateParams === 0 && hoursParams === 0) {

    hours.push("现在");
    for (var i = hour + 1; i < 24; i++) {
      hours.push(i + "点");
    }
    return { hours }
  } else if (dateParams === 0 && hoursParams !== 0) {
    hours.push("现在");
    for (var i = hour + 1; i < 24; i++) {
      hours.push(i + "点");
    }
    for (var i = 0; i < 60; i += 10) {
      minute.push(i);
    }
    return { hours, minute };
  } else if (dateParams !== 0) {
    for (var i = 0; i < 24; i++) {
      hours.push(i + "点");
    }
    for (var i = 0; i < 60; i += 10) {
      minute.push(i);
    }
    return { hours, minute };
  }
}
// 图片选择器
function uploadImageHandler(callback){
  wx.chooseImage({
    count: 9, // 默认9
    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
    success: function (res) {
      // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
      callback(res.tempFilePaths);
    },
    fail: function (res) {
      wx.hideLoading();
    }
  })
}
// 视频上传器
function uploadVideoHandler(callback) {
  wx.chooseVideo({
    sourceType: ['album', 'camera'],
    maxDuration: 60,
    camera: ['front', 'back'],
    success: function (res) {
      callback(res.tempFilePath);
    },
    fail:function(res){
      wx.hideLoading();
    }
  })
}
function requestData(url,data,callback){
  wx.request({
    // url: "http://192.168.1.121/xyds/index.php/"+url,
    url:"http://xyds.4hl.cn/xyds/index.php/"+url,
    data: data,
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded' // 默认值
    },
    success: function (res) {
      callback(res.data);
    }
  })
}

function withData(param) {
  return param < 10 ? '0' + param : '' + param;
}
function getLoopArray(start, end) {
  var start = start || 0;
  var end = end || 1;
  var array = [];
  for (var i = start; i <= end; i++) {
    array.push(withData(i));
  }
  return array;
}
function getMonthDay(year, month) {
  var flag = year % 400 == 0 || (year % 4 == 0 && year % 100 != 0), array = null;
  switch (month) {
    case '01':
    case '03':
    case '05':
    case '07':
    case '08':
    case '10':
    case '12':
      array = getLoopArray(1, 31)
      break;
    case '04':
    case '06':
    case '09':
    case '11':
      array = getLoopArray(1, 30)
      break;
    case '02':
      array = flag ? getLoopArray(1, 29) : getLoopArray(1, 28)
      break;
    default:
      array = '月份格式不正确，请重新输入！'
  }
  return array;
}
function getNewDateArry() {
  // 当前时间的处理
  var newDate = new Date();
  var year = withData(newDate.getFullYear()),
    mont = withData(newDate.getMonth() + 1),
    date = withData(newDate.getDate()),
    hour = withData(newDate.getHours()),
    minu = withData(newDate.getMinutes()),
    seco = withData(newDate.getSeconds());
  return [year, mont, date, hour, minu, seco];
}
function dateTimePicker(startYear, endYear, date) {
  // 返回默认显示的数组和联动数组的声明
  var dateTime = [], dateTimeArray = [[], [], [], [], [], []];
  var start = startYear || 1978;
  var end = endYear || 2100;
  // 默认开始显示数据
  var defaultDate = date ? [...date.split(' ')[0].split('-'), ...date.split(' ')[1].split(':')] : getNewDateArry();
  // 处理联动列表数据
  /*年月日 时分秒*/
  dateTimeArray[0] = getLoopArray(start, end);
  dateTimeArray[1] = getLoopArray(1, 12);
  dateTimeArray[2] = getMonthDay(defaultDate[0], defaultDate[1]);
  dateTimeArray[3] = getLoopArray(0, 23);
  dateTimeArray[4] = getLoopArray(0, 59);
  dateTimeArray[5] = getLoopArray(0, 59);
  dateTimeArray.forEach((current, index) => {
    dateTime.push(current.indexOf(defaultDate[index]));
  });
  return {
    dateTimeArray: dateTimeArray,
    dateTime: dateTime
  }
}
function wechatPay(data,callBack) {
  app.request({
    url:"",
    method: 'post',
    data: data,
    success: function (res) {
      wx.requestPayment({
        timeStamp: res.data.timeStamp,
        nonceStr: res.data.nonceStr,
        package: res.data.package,
        signType: res.data.signType,
        paySign: res.data.paySign,
        success: function () {
          callBack({code:1,msg:"支付成功"})
        },
        fail: function () {
          wx.showToast({
            title: '支付失败',
            icon: 'success',
            duration: 1500
          })
        }
      })
    }
  })
}
// 日历函数
/**
 * 判断是否闰年
 */
let leapYear = function (Year) {
  if (((Year % 4) == 0) && ((Year % 100) != 0) || ((Year % 400) == 0)) {
    return (true);
  } else {
    return (false);
  }
}
/**
 * 判断指定月天数
 */
let countDayByMonth = function (Year, Month) {
  if (Month == 1 | Month == 3 | Month == 5 | Month == 7 | Month == 8 | Month == 10 | Month == 12) {
    return 31;
  } else if (Month == 4 | Month == 6 | Month == 9 | Month == 11) {
    return 30;
  } else if (Month == 2) {
    let isLeapYear = leapYear(Year);
    if (isLeapYear) {
      return 29;
    } else {
      return 28;
    }
  }
}

/**
 * 获取当月第一天星期几
 */
let getDayByMonth = function (Year, Month) {
  return new Date(Year + '-' + Month + '-1').getDay();
}
function calendarHandler(year, month,callback){
  let currentMonth = countDayByMonth(year, month);
  let monthArr = [];
  let currentDay = getDayByMonth(year, month);
  let i, tempArr = [];

  /**
   * 填充默认
   */
  for (i = 0; i < currentDay; i++) {
    tempArr.push({
      name: "",
    });
  }

  /**
   * 日期遍历
   */
  for (i = 0; i < currentMonth; i++) {
    currentDay++;
    
      tempArr.push({
        name: year + '-' + month + '-' + (i + 1),
        value: i + 1,
        flag: false
      });


    if (currentDay % 7 == 0 || i == currentMonth - 1) {
      monthArr.push(tempArr);
      tempArr = [];
    }
  }
  callback({
    dateArr: {
      year: year,
      month: month,
      day: countDayByMonth(year, month)
    },
    monthArr: monthArr})
}
// 底部导航跳转
function redirectTo(url){
  wx.redirectTo({
    url: url,
  })
}

module.exports = {
  getLatLntHandler: getLatLntHandler,
  intoPageHandler: intoPageHandler,
  loginHandler: loginHandler,
  payHandler: payHandler,
  getPolyline: getPolyline,
  callPhoneHandler: callPhoneHandler,
  showToast: showToast,
  showModal: showModal,
  regTest: regTest,
  bankTest: bankTest,
  IdCardTest: IdCardTest,
  selectTimeHandler: selectTimeHandler,
  uploadVideoHandler: uploadVideoHandler,
  uploadImageHandler: uploadImageHandler,
  requestData: requestData,
  redirectTo: redirectTo,
  dateTimePicker: dateTimePicker,
  getMonthDay: getMonthDay,
  wechatPay: wechatPay,
  calendarHandler: calendarHandler,
  allImg:"../../images/",
}