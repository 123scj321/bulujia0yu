// pages/study-record/index.js
const handler = require("../../style/function.js");
const img = handler.allImg;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: img,
    news_list: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 1 }, { id: 1 }, { id: 2 }, { id: 3 },],
  },
  //formSubmit 页面跳转
  formSubmit: function (e) {
    handler.intoPageHandler(e.currentTarget.dataset.url)
  },
  //底部导航
  footer_handler: function (e) {
    handler.redirectTo(e.currentTarget.dataset.url)
  }, 
  // 下拉刷新
  onReachBottom: function () {
    wx.showLoading({})
    let { news_list } = this.data;
    let that = this;
    setTimeout(function () {
      news_list.push({ id: 1 }, { id: 2 }, { id: 3 }, { id: 1 }, { id: 2 }, { id: 3 },)
      that.setData({ news_list });
      wx.hideLoading()
    }, 5000)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  }
})