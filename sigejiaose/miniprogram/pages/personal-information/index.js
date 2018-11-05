// pages/personal-information/index.js

const handler = require("../../style/function.js");
const img = handler.allImg;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: img,
    sign: "做一个优秀的萌宝",
    edit_open: true,
    user_type: wx.getStorageSync("user_type"),
    userData: [],
    user_info: wx.getStorageSync("user_info"),
    customePhone: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  test_type: function () {
    const that = this;
  },
  getCustomePhone: function () {
    var that = this;
    handler.requestData("customePhone", {}, function (res) {
      that.setData({ customePhone: res.data })
    });
  },
  //formSubmit 页面跳转
  formSubmit: function (e) {
    console.log(e)
    handler.intoPageHandler(e.currentTarget.dataset.url)
  },
  //底部导航
  footer_handler: function (e) {
    handler.redirectTo(e.currentTarget.dataset.url)
  },
  handler_next_page_new: function () {
    const that = this;
    var user_type = wx.getStorageSync('user_info').user_type;
    const { is_certification, user_info } = this.data;
    if (user_info.user_type == 1) {
      console.log(1);
      if (is_certification !== 1) {
        that.test_type();
        console.log(2);
      } else {
        console.log(3);
        handler.intoPageHandler('../teacher-appointment-record/index');
      }
    } else {
      console.log(4);
      handler.intoPageHandler('../user-appointment-record/index');
    }
  },
  handler_next_page_new_less: function () {
    var user_type = wx.getStorageSync('user_info').user_type;
    if (user_type == 1) {
      handler.intoPageHandler('../teacher-record/index');
    } else {
      handler.intoPageHandler('../lesson-record/index');
    }
  },
  into_page_next_new_avatar: function () {
    const that = this;
    var user_type = wx.getStorageSync('user_info').user_type;
    const { is_certification, user_info } = this.data;
    if (user_info.user_type == 1) {
      console.log(1);
      if (is_certification !== 1) {
        that.test_type();
        // console.log(2);
      } else {
        // console.log(3);
        handler.intoPageHandler('../teacher-setup-information/index');
      }
    } else {
      console.log(4);
      handler.intoPageHandler('../user-setup-information/index');
    }
  },
  // 打电话
  callPhoneHandler: function () {
    var customePhone = this.data.customePhone;
    if (customePhone) {
      handler.callPhoneHandler(customePhone)
    } else {
      wx.showToast({
        title: '没有客服',
        icon: 'loading'
      })
    }

  },
  //用户编辑
  edit_handler: function () {
    var { edit_open } = this.data;
    this.setData({ edit_open: !edit_open });
  },
  get_edit: function (e) {
    var { sign } = this.data;
    if (sign.length<20){
      console.log(sign.length)
      this.setData({ sign: e.detail.value });
    }else{
      console.log(sign.length,'------------------')
      wx.showToast({
        title: '请输入20字以内的标签',
        icon:"none"
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.test_type();
    var that = this;
    var para = {
      "user_id": wx.getStorageSync('user_info').id,
      "user_type": wx.getStorageSync('user_info').user_type
    };
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
})