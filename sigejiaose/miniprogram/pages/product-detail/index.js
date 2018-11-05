// pages/product-detail/index.js
// 0 图片选择 1 语音  2 读字
const handler = require("../../style/function.js");
const img = handler.allImg;
const VideoContext = wx.createVideoContext("top_video");
// 语音播放
const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: img,
    currentItemId:0,
    zan_status: false,
    play_status:false,//顶部图片播放状态
    document_play:{
      id:0,
      video_url:'',
      document_play_status: false,
      videoTime: 0,
    },
    document_video:[
      { id: 0, imgUrl: 'none', videoUrl: 'https://lmp4.vjshi.com/2018-09-27/dc18204af2acbc4e8f80aba813dd60b6.mp4', time_status: 0,title:"上传视频标题一" },
      { id: 1, imgUrl: 'none', videoUrl: 'https://lmp4.vjshi.com/2018-09-20/111eaf2d78d41a8a4cb8ebff8bc8ed11.mp4', time_status: 0, title: "上传视频标题二"},
    ],//视频播放模拟数据
    upload: [
      ],//上传文件模拟数据 style
    question:[
      {
        id: 0, style: 0,  question: "请回答下图的卡通人物哪个是布鲁?", 
        teacher_video:"https://lmp4.vjshi.com/2018-09-27/dc18204af2acbc4e8f80aba813dd60b6.mp4",
        answer: 1,
        context: [
          { id:0,imgUrl: img + "question-01.png", status: false },
          { id:1,imgUrl: img + "question-02.png", status: false },
          { id:2,imgUrl: img + "question-03.png", status: false },
          { id:3,imgUrl: img + "question-04.png", status: false },
        ]
      },
      {
        id: 1, style: 1, question: "请仔细听语音中描述，然后选择出你认为语音中描述正确的一个？",
        teacher_video: "https://lmp4.vjshi.com/2018-09-20/111eaf2d78d41a8a4cb8ebff8bc8ed11.mp4",
        answer: 2,
        context: [
          { id: 0, videoUrl: "http://img.tukuppt.com/preview_music/00/05/95/preview-5b835dd24cc9c5762.mp3", status: true,is_play:false },
          { id: 1, videoUrl: "http://img.tukuppt.com/origin_music/08/03/17/312c700e8e281f03976409deb434af16.mp3", status: false, is_play: false  },
          { id: 2, videoUrl: "http://img.tukuppt.com/preview_music/00/00/59/yulan-5b87c00c218143958.mp3", status: false, is_play: false  },
          { id: 3, videoUrl: "http://img.tukuppt.com/origin_music/08/03/15/e44043e8bef2f3704d9347c97b1e7e23.mp3", status: false, is_play: false  },
        ]
      },
      {
        id: 2, style: 2, question: "请按住语音按钮读出下列字",
        teacher_video: "https://lmp4.vjshi.com/2018-08-28/399365f0fcf8b1a1e533fcad877b079f.mp4",
        context: [
          { text:"这里是文字内容这里是文字内容这里是文字内容这里是文字内容这里是文字内容这里是文字内容这里是文字内容这里是文字内容这里是文字内容这里是文字内容这里是文字内容这里是文字内容这里是文字内容这里是文字内容这里是文字内容",
          voice_status:false},
        ]
      },
      {
        id: 3, style: 0, question: "请回答下图的卡通人物哪个是布鲁?",
        teacher_video: "https://lmp4.vjshi.com/2018-09-27/dc18204af2acbc4e8f80aba813dd60b6.mp4",
        answer: 1,
        context: [
          { id: 0, imgUrl: img + "question-01.png", status: false },
          { id: 1, imgUrl: img + "question-02.png", status: false },
          { id: 2, imgUrl: img + "question-03.png", status: false },
          { id: 3, imgUrl: img + "question-04.png", status: false },
        ]
      },
    ],//问题模拟数据
    current_question: {
      id: 0, style: 0, question: "请回答下图的卡通人物哪个是布鲁?",
      teacher_video: "https://lmp4.vjshi.com/2018-09-27/dc18204af2acbc4e8f80aba813dd60b6.mp4",
      answer:1,
      context: [
        {id:0, imgUrl: img + "question-01.png"},
        {id:1, imgUrl: img + "question-02.png"},
        {id:2, imgUrl: img + "question-03.png"},
        {id:3, imgUrl: img + "question-04.png"},
      ]
    },//当前问题模拟数据
    answer_id:-1,//问题回答选择按钮
    answer_all:[],//
    isScrollTop:false,//吸顶器展示
    upload_show:false,//显示上传框
    upload:[],
    current_upload:{
      type:-1,
      name:'',
      url:[]
    },
    tempFilePath:'',//录音地址
  },
  // 点赞事件
  zan_handler:function(e){
    wx.showLoading({})
    const that=this;
    setTimeout(() => { 
      wx.hideLoading()
      wx.showToast({
        title: '点赞成功',
        icon:'none'
      })
      that.setData({ zan_status: true})
      },3000)
  },
  // 未点赞事件
  close_zan_handler:function(){
    wx.showLoading({})
    const that = this;
    setTimeout(() => {
      wx.hideLoading()
      wx.showToast({
        title: '取消点赞',
        icon: 'none'
      })
      that.setData({ zan_status: false })
    }, 3000)
  },
  // 目录视频播放
  open_document_video:function(e){
    const that=this;
    var id = e.currentTarget.dataset.id;
    var videoUrl = e.currentTarget.dataset.video;
    var { document_play, document_video } = this.data;
    var time_status = document_video[id].time_status;
    console.log(document_video[id].time_status,'2222222222')
    if (time_status>0){
      wx.showModal({
        content: '是否接着上次未播放玩的播放',
        success:function(e){
          if(e.confirm){
            document_play = {
              id: id,
              video_url: videoUrl,
              document_play_status: true,
              videoTime: time_status,
            };
          }else{
            document_play = {
              id: id,
              video_url: videoUrl,
              document_play_status: true,
              videoTime: 0,
            };
          }
          that.setData({ document_play })
        }
      })
    }else{
      document_play = {
        id: id,
        video_url: videoUrl,
        document_play_status: true,
        videoTime: 0,
      };
      this.setData({ document_play })
    }
    console.log(document_play)
    
  },
  // 监听目录视频播放
  bindtimeupdate:function(e){
    
    var { document_play } = this.data;
    document_play.videoTime=e.detail.currentTime;
    console.log(e)
    this.setData({ document_play})
  },
  // 关闭视频
  bindended:function(e){
    var { document_play, document_video } = this.data;
    document_play.document_play_status = false;
    document_video[document_play.id].time_status = 0;
    this.setData({ document_play, document_video })
  },
  // 视频暂停
  bindpause: function (e) {
    var { document_play, document_video } = this.data;
    document_play.document_play_status=false;
    document_video[document_play.id].time_status = document_play.videoTime;
    this.setData({ document_play, document_video})
  },
  // 查看更多 目录
  detail_more:function(){
    const { document_video}=this.data;
    const that=this;
    wx.showLoading({})
    setTimeout(()=>{
      wx.hideLoading()
      document_video.push({ id: 0, imgUrl: 'none', videoUrl: 'https://lmp4.vjshi.com/2018-09-27/dc18204af2acbc4e8f80aba813dd60b6.mp4', time_status: 0, title: "上传视频标题一" },
        { id: 1, imgUrl: 'none', videoUrl: 'https://lmp4.vjshi.com/2018-09-20/111eaf2d78d41a8a4cb8ebff8bc8ed11.mp4', time_status: 0, title: "上传视频标题二" })
      that.setData({ document_video})
      
    },2000)
    
  },
  // 图片回答选项按钮
  chooseAnswer_handler:function(e){
    var id=e.currentTarget.dataset.id;
    const { current_question}=this.data;
    var context = current_question.context;
    for (var i = 0; i < context.length;i++){
      if(id==i){
        current_question.context[i].status = true;
      }else{
        current_question.context[i].status = false;
      }
    }
    this.setData({ current_question})
    current_question.context[id].status=true;
  },
  // 选择音频
  select_voice:function(e){
    var id = e.currentTarget.dataset.id;
    const { current_question } = this.data;
    var context = current_question.context;
    for (var i = 0; i < context.length; i++) {
      if (id == i) {
        current_question.context[i].status = true;
      } else {
        current_question.context[i].status = false;
      }
    }
    this.setData({ current_question })
    current_question.context[id].status = true;
  },
  //音频回答事件
  audio_answer_handler:function(e){
    var id = parseInt(e.currentTarget.dataset.id);
    const { question, current_question } = this.data;
    if (current_question.context[current_question.answer].status) {
      wx.showLoading({})
      setTimeout(() => {
        wx.hideLoading()
        this.setData({ answer_id: 1 })
      }, 1000)

    } else {
      wx.showLoading({})
      setTimeout(() => {
        wx.hideLoading()
        this.setData({ answer_id: 0 })
      }, 1000)
    }
  },
  //播放声音
  playVoice: function (e) {
    console.log(e)
    var id=e.currentTarget.dataset.id;
    var url = e.currentTarget.dataset.url;
    var that=this;
    const {current_question}=this.data;
    var context = current_question.context;
    for (var i = 0; i < current_question.context.length;i++){
      if(i==id){
        current_question.context[i].is_play=true
        innerAudioContext.autoplay = true
        innerAudioContext.src = url,
          innerAudioContext.onPlay(() => {
            // console.log('开始播放')
          setTimeout(() => {
            for (var i = 0; i < context.length; i++) {
              current_question.context[i].is_play = false;
            }
            that.setData({ current_question })
          }, 2000)
          })
        innerAudioContext.onError((res) => {
          console.log(res.errMsg)
          console.log(res.errCode)
        })
      }else{
        current_question.context[i].is_play = false
      }
    }
  },
  //开始录音的时候
  voice_start: function () {
    console.log(1111111111,'录音开始')
    const options = {
      duration: 10000,//指定录音的时长，单位 ms
      sampleRate: 16000,//采样率
      numberOfChannels: 1,//录音通道数
      encodeBitRate: 96000,//编码码率
      format: 'mp3',//音频格式，有效值 aac/mp3
      frameSize: 50,//指定帧大小，单位 KB
    }
    const { current_question}=this.data;
    const that=this;
    console.log(current_question);
    current_question.context[0].voice_status = true;
    this.setData({ current_question });
    //开始录音
    recorderManager.start(options);
    recorderManager.onStart(() => {
      console.log('recorder start')
    });
    console.log(this.data.current_question.context.voice_status);
    //错误回调
    recorderManager.onError((res) => {
      console.log(res);
    })
  },
  //停止录音
  voice_stop: function () {
    recorderManager.stop();
    const { current_question, question } = this.data;
    const that = this;
    wx.showModal({
      title: '提示',
      content: '是否上传跟读语音',
      success:function(result){
        if(result.confirm){
          current_question.context[0].voice_status = false;
          that.setData({ current_question, answer_id: 1 });
          recorderManager.onStop((res) => {
            this.tempFilePath = res.tempFilePath;
            console.log('停止录音', res.tempFilePath)
            const { tempFilePath } = res
          })
        }else{
          current_question.context[0].voice_status = false;
          that.setData({ current_question, });
        }
        
      },
    })
    
  },
  // 继续学习下个视频
  next_images_study:function(){
    const { current_question}=this.data;
    // ++current_question.id;
    wx.setStorageSync("study_progress", (++current_question.id))
    handler.redirectTo("../index/index?style=" + (++current_question.id))
  },
  // 图片回答问题确定按钮
  answer_handler:function(e){
   var id = parseInt(e.currentTarget.dataset.id);
    const { question, current_question}=this.data;
    if (current_question.context[current_question.answer].status){
    wx.showLoading({})
      setTimeout(()=>{
        wx.hideLoading()
        this.setData({ answer_id: 1 })
    },1000)
      
    }else{
      wx.showLoading({})
      setTimeout(() => {
        wx.hideLoading()
        this.setData({ answer_id: 0 })
      }, 1000)
    }
  },
  // 图片回答错误按钮
  again_answer:function(){
    const { current_question } = this.data;
    var context = current_question.context;
    for (var i = 0; i < context.length; i++) {
      current_question.context[i].status = false;
    }
    this.setData({ current_question, answer_id: -1 })
  },
  // 关闭结果图片
  close_answar:function(){
    const { current_question } = this.data;
    var context = current_question.context;
    for (var i = 0; i < context.length; i++) {
      current_question.context[i].status = false;
    }
    this.setData({ current_question, answer_id: -1 })
  },
  // 切换导航栏
  selectSwiper:function(e){
    console.log (e.currentTarget.dataset.listid);
    const id = e.currentTarget.dataset.listid;
    this.setData({ currentItemId: e.currentTarget.dataset.listid})
  },
  // 导航栏上拉固定
  onPageScroll: function (e) {
    if (e.scrollTop>158){
      this.setData({ isScrollTop:true})
    }else{
      this.setData({ isScrollTop: false })
    }
  },
  // 上传作品按钮
  upload_work:function(e){
    this.setData({ upload_show:true})
  },
  // 输入作品名称
  upload_name:function(e){
    console.log(e)
    const { current_upload}=this.data;
    if (current_upload.name.length<10){
      current_upload.name=e.detail.value;
      this.setData({ current_upload})
    }else{
      wx.showToast({
        title: '请输入10字以内的作品名称',
      })
    }
    // this.setData
  },
  // 上传作品事件
  upload_handler:function(){
    const that=this;
    wx.showActionSheet({
      itemList: ['上传图片', '上传语音', '上传视频'],//显示的列表项
      itemColor:'#333',
      success: function (res) {//res.tapIndex点击的列表项
        var id=res.tapIndex;
        if(id==0){
          that.upload_img()
        }else if(id==1){
          that.upload_audio()
        }else{
          that.upload_video()
        }
      },
      fail: function (res) { },
      complete: function (res) { }
    })
  },
  // 上传图片
  upload_img:function(){
    const that=this;
    const { current_upload}=this.data;
    handler.uploadImageHandler(function(res){
      console.log(res,'22222222222')
      if(res.length<=3){
        current_upload.url = res;
        current_upload.type = 0;
        that.setData({ current_upload })
      }else{
        wx.showToast({
          title: '请选择三张以内的内容',
          icon:'none'
        })
      }
      
    })
  },
  //上传音频
  upload_audio:function(){
    const that = this;
    const { current_upload } = this.data;
    handler.uploadVideoHandler(function(res){
      if (res.indexOf(".mp3")!=-1){
        current_upload.url = res;
        current_upload.type = 1;
        that.setData({ current_upload })
      }else{
        wx.showModal({
          content: '请上传MP3类型的音频',
          showCancel:false,
        })
      }
    })
  },
  // 上传视频
  upload_video: function () {
    const that = this;
    const { current_upload } = this.data;
    handler.uploadVideoHandler(function (res) {
      if (res.indexOf(".mp4") != -1) {
        current_upload.url = res;
        current_upload.type = 2;
        that.setData({ current_upload })
      } else {
        wx.showModal({
          content: '请上传MP4类型的视频',
          showCancel: false,
        })
      }
    })
  },
  // 确定上传按钮
  submit_upload:function(){
    const { upload, current_upload}=this.data;
    var testName=handler.regTest(current_upload.name,'请输入作品名称');
    var testUpload = handler.regTest(current_upload.url[0], '请上传作品');
    if (testName && testUpload){
      upload.push(current_upload)
      this.setData({
        upload_show: false, upload, current_upload: {
          type: -1,
          name: '',
          url: []} 
          })
    }else{
      var testName = handler.regTest(current_upload.name, '请输入作品名称');
      var testUpload = handler.regTest(current_upload.url[0], '请上传作品');
    }
  },
  // 关闭上传遮罩层
  close_upload:function(){
    this.setData({ upload_show: false})
  },
  // 分享图片事件
  onShareAppMessage: function (e) {
    console.log(e)
    var types=e.target.dataset.type;
    var imgUrl='';
    imgUrl = types == "img" ? img +'lvcao-logo.png':
      types == "poster" ? img + 'my-poster.png':'';
    return {
      title: '布鲁教育小程序',
      imageUrl: imgUrl,
      path: 'pages/index/index',
      success: function (res) {
        // 转发成功
        wx.showToast({
          title: '转发成功',
        })
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function (res) {
        // 转发失败
        wx.showToast({
          title: '转发失败',
        })
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  },
  onShow:function(){
    // const { question, current_question}=this.data;
    // this.setData({ current_question: question[2]})
  },
  onLoad:function(options){
    const { question, current_question } = this.data;
    this.setData({ current_question: question[options.open_id] })
  }
})