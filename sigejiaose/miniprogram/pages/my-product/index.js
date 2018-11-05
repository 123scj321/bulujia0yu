// pages/my-product/index.js
const handler = require("../../style/function.js");
const img = handler.allImg;
const VideoContext = wx.createVideoContext("myVideo")
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: img,
    product: [
      { id: 0, style: 0, title: "图片内容标签", praise: 500, container: [{ img: "001" }, { img: "001" }, { img: "001" }] }, 
      { id: 1, style: 1, title: "视频内容标签", praise: 500, container: [{vidoe:""}] }, 
      { id: 2, style: 2, title: "语音内容标签", praise: 500, container: [{audio:""}] }
    ],
    voice_play:false
  },
  // 下拉刷新
  onReachBottom: function () {
    wx.showLoading({})
    let { product } = this.data;
    let that = this;
    setTimeout(function () {
      product.push({ id: 0, style: 0, title: "图片内容标签", praise: 500, is_praise: false, container: [{ img: "001" }, { img: "001" }, { img: "001" }] },
        { id: 1, style: 1, title: "视频内容标签", praise: 500, is_praise: false, container: [{ vidoe: "" }] },
        { id: 2, style: 2, title: "语音内容标签", praise: 500, is_praise: false, container: [{ audio: "" }]
        })
      that.setData({ product });
      wx.hideLoading()
    }, 5000)
  }, 
  // 删除当前数据
  delete_handler:function(e){
    console.log(e.currentTarget.dataset)
    var id = e.currentTarget.dataset.index;
    const { product}=this.data;
    const that=this;
    wx.showModal({
      content: '确定删除本条海报信息',
      success(e){
        if(e.confirm){
          wx.showLoading({})
          var products = [];
          for (var i = 0; i < product.length; i++) {
            if (i !== id) {
              products.push(product[i])
            }
          }
          setTimeout(()=>{
            wx.hideLoading()
            that.setData({ product: products })
          },2000)
        }
      }
    })
  },
  // 放大图片
  imgYu: function (event){
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
  // 视频播放全屏显示
  bindplayHnadler:function(){
    console.log(1)
    VideoContext.requestFullScreen({ direction: 90 })
  },
  // 退出全屏播放
  bindpause:function(){
    console.log(2)
    
  },
  // 
  bindended:function(){
    console.log(3)
  },
  // 语音播放按钮
  playVoice:function(e){
    this.setData({ voice_play:true})
    setTimeout(()=>{
      this.setData({ voice_play: false});
    },5000)
    // 语音播放功能
    // wx.playVoice({ 
    //     filePath: "",
    //     success:function(e){
    //       console.log(e,"1111111")
    //     },
    // })
  },
  // 停止语音播放
  stop_voice:function(){
    this.setData({ voice_play: false });
    // 语音播放功能
    wx.stopVoice();
  },
  onShareAppMessage(options){
    console.log(options,'222222222222')
    
  },
  // 点赞事件
  zan_handler:function(e){
    var id=e.currentTarget.dataset.id;
    const that=this;
    const { product}=this.data;
    product[id].is_praise= true;
    ++product[id].praise ;
    wx.showLoading({})
    setTimeout(()=>{
      wx.hideLoading()
      wx.showToast({
        title: '成功点赞',
        icon: "none",
      })
      that.setData({ product })
    },3000)
  },
  // 取消点赞
  cancle_zan_handler:function(e){
    var id = e.currentTarget.dataset.id;
    const that = this;
    const { product } = this.data;
    product[id].is_praise = false;
    --product[id].praise;
    wx.showLoading({})
    setTimeout(() => {
      wx.hideLoading()
      wx.showToast({
        title: '已取消',
        icon: "none",
      })
      that.setData({ product })
    }, 3000)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      imgUrl: img, product: [
        { id: 0, style: 0, title: "图片内容标签", praise: 500, is_praise:false,container: [{ img: "001" }, { img: "001" }, { img: "001" }] },
        { id: 1, style: 1, title: "视频内容标签", praise: 500, is_praise: false,container: [{ vidoe: "" }] },
        { id: 2, style: 2, title: "语音内容标签", praise: 500, is_praise:false,container: [{ audio: "" }] }
      ]})
  }
  
})