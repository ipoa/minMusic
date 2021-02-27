// pages/musicList/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    musicList: [],
    listInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    wx.showLoading({
      title: '加载中...',
    })
    wx.cloud.callFunction({
      name: 'music',
      data: {
        $url: 'musiclist',
        playListId: options.playListId
      }
    }).then(res => {
      const {
        tracks: musicList = '',
        coverImgUrl = '',
        name = ''
      } = res.result
      this.setData({
        musicList,
        listInfo: {
          coverImgUrl,
          name
        }
      })
      this._setMusicList(this.data.musicList)
      wx.hideLoading()
    })
  },
  _setMusicList: function (data) {
    wx.setStorageSync('musiclist', data)
  },

  onChooseASong: function (event) {
    const {
      musicid = -1, index = -1
    } = event.detail
    wx.navigateTo({
      url: `../player/index?musicid=${musicid}&index=${index}`,
    })
  }
})