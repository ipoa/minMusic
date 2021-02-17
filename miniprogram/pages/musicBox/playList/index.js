// pages/player/playList/index.js
const MAX_LIMIT = 12
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    swiperImgUrls: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    playList: []
  },
  lifetimes: {
    attached: function () {
      this._getPlayList()
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleScrolltolower(e) {
      this._getPlayList()
    },
    _getPlayList() {
      wx.showLoading({
        title: '加载中...',
      })
      wx.cloud.callFunction({
        name: 'music',
        data: {
          start: this.data.playList.length,
          count: MAX_LIMIT,
          $url: 'playlist'
        }
      }).then(res => {
        this.setData({
          playList: this.data.playList.concat(res.result.list)
        })
        wx.hideLoading()
      })
    },
    goToMusicList(event){
      const {currentTarget={dataset:{id:0}}}=event
      wx.navigateTo({
        url: `/pages/musicList/index?playListId=${currentTarget.dataset.id}`,
      })
    }
  }
})