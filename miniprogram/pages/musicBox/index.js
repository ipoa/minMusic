// pages/player/index.js
let current = 0
Page({

  /**
   * 页面的初始数据
   */
  data: {
    titleText: '',
    currentTab: 0,
    tabBar: [{
        "text": "音乐",
        "iconPath": "/assets/images/tabBar/music.png",
        "selectedIconPath": "/assets/images/tabBar/music-actived.png",
      },
      {
        "text": "发现",
        "iconPath": "/assets/images/tabBar/blog.png",
        "selectedIconPath": "/assets/images/tabBar/blog-actived.png"
      },
      {
        "text": "我的",
        "iconPath": "/assets/images/tabBar/profile.png",
        "selectedIconPath": "/assets/images/tabBar/profile-actived.png"
      }
    ],
    swiperImgUrls: [{
        url: 'http://p1.music.126.net/oeH9rlBAj3UNkhOmfog8Hw==/109951164169407335.jpg',
      },
      {
        url: 'http://p1.music.126.net/xhWAaHI-SIYP8ZMzL9NOqg==/109951164167032995.jpg',
      },
      {
        url: 'http://p1.music.126.net/Yo-FjrJTQ9clkDkuUCTtUg==/109951164169441928.jpg',
      }
    ]
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
    console.log('onPullDownRefresh');
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
    console.log('onShareAppMessage');
  },

  switchTab: function (event) {
    // 优化响应郊果
    if (current === event.detail.current) {
      return null
    }
    current = event.detail.current;
    wx.setNavigationBarTitle({
      title: this.data.tabBar[current].text,
    })
    this.setData({
      currentTab: current,
    });
  },

})