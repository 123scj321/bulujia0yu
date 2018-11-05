// pages/company-resume/index.js
const handler = require("../../style/function.js");
const img = handler.allImg;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: img,
    latitude: 39.99662,
    longitude: 116.33478,
  },
  callPhoneHandler(e){
    handler.callPhoneHandler(e.currentTarget.dataset.phone)
  },
  // 打开地图
  openMap:function(){
    wx.openLocation({
      latitude: 39.99662,
      longitude: 116.33478,
    })
  },
})