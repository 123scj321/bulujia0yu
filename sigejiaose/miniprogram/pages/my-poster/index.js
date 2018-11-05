// pages/my-poster/index.js
const handler = require("../../style/function.js");
const img = handler.allImg;
Page({

  /**
   * 页面的初始数据
   */
  data: {

    imgUrl: img,
    poster: [{ id: 0}, { id: 0}, { id: 0 }]
  },
  // 下拉刷新
  onReachBottom: function () {
    wx.showLoading({})
    let { poster } = this.data;
    let that = this;
    setTimeout(function () {
      poster.push({ id: 0 }, { id: 0}, { id: 0})
      that.setData({ poster });
      wx.hideLoading()
    }, 5000)
  }, 
  // 放大图片
  imgYu: function (event) {
    var src = event.currentTarget.dataset.src;//获取data-src
    var imgList = event.currentTarget.dataset.list;//获取data-list
    //图片预览
    console.log(src, imgList)
    wx.previewImage({
      current: 'http://img4.imgtn.bdimg.com/it/u=2603236761,3531481337&fm=26&gp=0.jpg',
      // 当前显示图片的http链接
      urls: ['http://img4.imgtn.bdimg.com/it/u=2603236761,3531481337&fm=26&gp=0.jpg']
      // 需要预览的图片http链接列表
    })
  },
  // 删除海报
  delete_hanlder:function(e){
    var id=e.currentTarget.dataset.id;
    const { poster}=this.data;
    const that=this;
    var posters=[];
    console.log(id, poster,'22222222222222')
    wx.showModal({
      content: '确认删除此海报？',
      success(e){
        if(e.confirm){
          for (var i = 0; i < poster.length; i++) {
            if (i != id) {
              posters.push(poster[i]);
            }
          }
          console.log(posters)
          wx.showLoading({})
          setTimeout(()=>{
            wx.hideLoading()
            wx.showToast({
              title: '删除成功',
              icon:"none"
            })
            that.setData({ poster: posters})
          },2000)
        }
      },
    })
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

})