// pages/player/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
        tabBar:[
          {
            "text": "音乐",
            "name":"playList",
            "iconPath": "/images/tabBar/music.png",
            "selectedIconPath": "/images/tabBar/music-actived.png"
          },
          {
            "text": "发现",
            "name":"blog",
            "iconPath": "/images/tabBar/blog.png",
            "selectedIconPath": "/images/tabBar/blog-actived.png"
          }
          ,
          {
            "text": "我的",
            "name":"profile",
            "iconPath": "/images/tabBar/profile.png",
            "selectedIconPath": "/images/tabBar/profile-actived.png"
          }
        ],
        currentTab:0
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

  },

  switchTab: function (event) {
    var cur = event.detail.current;
    this.setData({
        currentTab: cur,
    });
     }
})