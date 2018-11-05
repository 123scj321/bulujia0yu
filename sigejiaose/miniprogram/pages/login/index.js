// pages/server/authority-first/index.js
const handler = require("../../style/function.js");
const img = handler.allImg;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: img,
    sendtxt: "60s",
    name:null,
    phone: null,
    verificationcode: null,
    verificationcodeTest: false,
    gettingCode: true,
    password: null,
    copypassword: null
  },
  // phonename 获取姓名
  nameinput: function (event) {
    var that = this
    that.setData({
      name: event.detail.value
    })
    handler.regTest(event.detail.value,"请输入您的姓名")
  },
  // phoneinput 获取电话号码
  phoneinput: function (event) {
    var that = this
    that.setData({
      phone: event.detail.value
    })
    handler.regTest(event.detail.value,"请输入正确格式的电话号码",/^1[3578]\d{9}$/)
  },
  // 发送验证码
  sendcode: function () {
    var that = this;
    const { phone}=this.data;
    const testPhone = handler.regTest(phone, "请输入正确格式的电话号码", /^1[3578]\d{9}$/);
    if (testPhone){
      // 倒计时功能
      wx.showLoading({})
      setTimeout(function () {
        wx.hideLoading()
        wx.showToast({
          title: "发送成功",
        })
        that.countDown()
      }, 5000)
    }else{
      handler.regTest(phone, "请输入正确格式的电话号码", /^1[3578]\d{9}$/)
    }
      

    // console.log('触发发验证码')
    
  },
  //倒计时 倒数
  countDown: function () {
    var that = this;
    that.data.gettingCode = true;
    that.setData({ verificationcodeTest:true})
    var seconds = 59;
    var countTimer = setInterval(function () {
      that.setData({
        sendtxt: seconds + "s"
      })
      seconds--;
      if (seconds <= 0) {
        countTimer = clearInterval(countTimer);
        that.setData({
          sendtxt: '获取验证码'
        })
        that.data.gettingCode = true;
        that.setData({ verificationcodeTest: false })
      }
    }, 1000);
  },
  // 获取验证码
  verificationinput:function(e){
    this.setData({ verificationcode:e.detail.value})
  },
  // getPhoneLogin 认证获取用户名，电话号码，验证码
  getPhoneLogin: function () {
    const {
      sendtxt,
      name,
      phone,
      verificationcode,
      verificationcodeTest
    } = this.data;
    var testName=handler.regTest(name,'请输入用户名')&&true;
    var testPhone = handler.regTest(phone, '请输入电话号码') && true;
    var testVerificationcode = handler.regTest(verificationcode, '请输入验证码') && true;
    if (testName && testPhone && testVerificationcode){
      wx.setStorageSync("user_authority", {name,phone,verificationcode})
      handler.redirectTo("../index/index")
    }else{
      var testName = handler.regTest(name, '请输入用户名') && true;
      var testPhone = handler.regTest(phone, '请输入电话号码') && true;
      var testVerificationcode = handler.regTest(verificationcode, '请输入验证码') && true;
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})