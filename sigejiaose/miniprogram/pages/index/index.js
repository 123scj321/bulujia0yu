// pages/index/index.js
const handler=require("../../style/function.js");
const img = handler.allImg;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:img,
    document_play: {
      id: 0,
      video_url: 'https://lmp4.vjshi.com/2018-09-27/dc18204af2acbc4e8f80aba813dd60b6.mp4',
      document_play_status: false,
      videoTime: 0,
    },
    movies: [{ id: 1, banner_img: img + "banner-01.png" },
    { id: 2, banner_img: img + "banner-02.png" }],
    current_role: [{ id: 0, status: true }, { id: 1, status: false }, { id: 2, status: false }, { id: 3, status: false }],//当前角色
  },
  // 角色一 布鲁角色
  buluHandler:function(e){
    var that = this;
    var user = wx.getStorageSync('user') || {};
    var userInfo = wx.getStorageSync('userInfo') || {};
    if (userInfo.nickName) {
      handler.intoPageHandler(e.currentTarget.dataset.url)
    } else {
      this.getUserInfo()
    }
  },
  // 其他角色
  into_detail:function(e){
    var { id, status,url}=e.currentTarget.dataset;
    if (status){
      handler.intoPageHandler(e.currentTarget.dataset.url)
    }else{
      wx.showModal({
        showCancel: false,
        content: '请先完成第' + id + '视频内容才可开启第' + (++id) +'个视频',
      })
    }
  },
  // 用户授权
  getUserInfo: function (e) {
    var user = wx.getStorageSync('user') || {};
    var userInfo = wx.getStorageSync('userInfo') || {};
    var loginStatus = true;
    const  that=this;
    if (!loginStatus) {
      wx.openSetting({
        success: function (data) {
          if (data) {
            if (data.authSetting["scope.userInfo"] == true) {
              loginStatus = true;
              wx.getUserInfo({
                withCredentials: false,
                success: function (data) {
                  // 数据获取成功
                  wx.setStorageSync("userInfo",
                    { avatarUrl: data.userInfo.avatarUrl, nickName: data.userInfo.nickName }
                  )
                  wx.setStorageSync("userAllInfo",
                    data.userInfo
                  )
                  
                  handler.intoPageHandler("../login/index")
                },
                fail: function () {
                }
              });
            }
          }
        },
        fail: function () {
          
        }
      });
    } else {
      wx.login({
        success: function (res) {
          if (res.code) {
            wx.getUserInfo({
              withCredentials: false,
              success: function (data) {
                // 数据获取成功
                wx.setStorageSync("userInfo", 
                  { avatarUrl: data.userInfo.avatarUrl, nickName: data.userInfo.nickName}
                )
                wx.setStorageSync("userAllInfo",
                  data.userInfo
                )
                handler.intoPageHandler("../login/index")
              },
              fail: function () {
                console.info("1授权失败返回数据");
                loginStatus = false;
                // 显示提示弹窗
                wx.showModal({
                  content: '如果你不授权，有些功能可能无法使用',
                  showCancel:false,
                  success: function (res) {
                    if (res.confirm) {
                      console.log('用户点击确定')
                    } else if (res.cancel) {
                      wx.openSetting({
                        success: function (data) {
                          if (data) {
                            if (data.authSetting["scope.userInfo"] == true) {
                              loginStatus = true;
                              wx.getUserInfo({
                                withCredentials: false,
                                success: function (data) {
                                  console.info("3成功获取用户返回数据");
                                  console.info(data.userInfo);
                                  // 数据获取成功
                                  wx.setStorageSync("userInfo",
                                    { avatarUrl: data.userInfo.avatarUrl, nickName: data.userInfo.nickName }
                                  )
                                  wx.setStorageSync("userAllInfo",
                                    data.userInfo
                                  )
                                  handler.intoPageHandler("../login/index")
                                },
                                fail: function () {
                                  console.info("3授权失败返回数据");
                                }
                              });
                            }
                          }
                        },
                        fail: function () {
                          console.info("设置失败返回数据");
                        }
                      });
                    }
                  }
                });
              }
            });
          }
        },
        fail: function () {
          console.info("登录失败返回数据");
        }
      });
    }
      
  },
  //formSubmit 页面跳转
  formSubmit: function (e) {
    handler.intoPageHandler(e.currentTarget.dataset.url)
  },
  //底部导航
  footer_handler: function (e) {
    handler.redirectTo(e.currentTarget.dataset.url)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
   // this.donghua();
    var study_progress = wx.getStorageSync("study_progress");
    if (study_progress!=undefined){
      const { current_role } = this.data;
      console.log(current_role)
      for (var i = 0; i < current_role.length; i++) {
        console.log(current_role[i].status,i)
        if (i <= study_progress){
          current_role[i].status=true
        }else{
          current_role[i].status = false
        }
      }
      this.setData({ current_role })
    }
  },
  onReady(){
  }
})