// miniprogram/pages/player/index.js
let musiclist = []
// 正在播放歌曲的index
let nowPlayIndex = -1
let songObj = {}
// 获取全局唯一的背景音频管理器
const backgroundAudioManager = wx.getBackgroundAudioManager()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl: '',
    isPlaying: false // false 暂停,true 播放
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    nowPlayIndex = options.index
    musiclist = wx.getStorageSync('musiclist')

    this._loadMusicDetail(options.musicid)
  },
  // 切换播放/暂停
  togglePlaying: function () {
    // 正在播放
    if (this.data.isPlaying) {
      backgroundAudioManager.pause()
    } else {
      backgroundAudioManager.play()
    }
    this.setData({
      isPlaying: !this.data.isPlaying
    })
  },
  onPrev: function () {
    nowPlayIndex--
    if (nowPlayIndex < 0) {
      nowPlayIndex = musiclist.length - 1
    }
    this._loadMusicDetail(musiclist[nowPlayIndex].id)
  },
  onNext: function () {
    backgroundAudioManager.pause()
    nowPlayIndex++
    if (nowPlayIndex > musiclist.length - 1) {
      nowPlayIndex = 0
    }
    this._loadMusicDetail(musiclist[nowPlayIndex].id)
  },
  _loadMusicDetail: function (musicId) {
    backgroundAudioManager.pause()
    let music = musiclist[nowPlayIndex]
    wx.showLoading({
      title: '加载中...',
    })
    this.setData({
      isPlaying: false
    })
    wx.cloud.callFunction({
      name: 'music',
      data: {
        musicId,
        $url: 'musicUrl'
      }
    }).then(res => {
      [songObj] = res.result
      if (!songObj.url) {
        wx.showToast({
          icon: 'error',
          title: '找不到音乐',
          duration: 2000
        })
      
        return false
      }
      backgroundAudioManager.src = songObj.url
      backgroundAudioManager.title = music.name
      backgroundAudioManager.coverImgUrl = music.album.picUrl
      backgroundAudioManager.singer = music.artists[0].name
      backgroundAudioManager.epname = music.album.name

      wx.setNavigationBarTitle({
        title: music.name,
      })
      this.setData({
        picUrl: music.album.picUrl,
        isPlaying: true
      })
      wx.hideLoading()
    })
  }
})