// pages/template/blog/index.js
const MAX_LIMIT = 10
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  options: {
    styleIsolation: 'apply-shared'
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 底部弹出层 默认:false 不显示;true显示
    bottomPopupShow: false,
    // 博客列表
    blogList: []
  },

  lifetimes: {
    attached: function () {
      this._getBlogList()
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    _getBlogList() {
      wx.showLoading({
        title: '加载中...',
      })
      wx.cloud.callFunction({
        name: 'blog',
        data: {
          start: this.data.blogList.length,
          count: MAX_LIMIT,
          $url: 'list'
        }
      }).then(res => {
        this.setData({
          blogList: this.data.blogList.concat(res.result)
        })
      })

    },

    // 发布功能
    async onPublish() {
      wx.showLoading({
        title: '加载中...',
      })
      // 判断用户是否授权
      const result = await wx.getSetting()
      if (result.authSetting['scope.userInfo']) {
        const userInfoResult = await wx.getUserInfo()
        this.onClosePopupShow({
          detail: {
            userInfo: userInfoResult.userInfo
          }
        })
      } else {
        this.setData({
          bottomPopupShow: true
        })
      }
      wx.hideLoading()
    },

    async onClosePopupShow(event) {
      const hasUserInfo = event.detail.userInfo
      // 充许授权
      if (hasUserInfo) {
        const {
          nickName = '', avatarUrl = ''
        } = hasUserInfo
        this.setData({
          bottomPopupShow: false
        })
        wx.navigateTo({
          url: `/pages/blog-edit/index?nickName=${nickName}&avatarUrl=${avatarUrl}`,
        })

      } else {
        await wx.showModal({
          title: '发布失败',
          content: '授权用户才能发布',
          success: (res) => {
            let bottomPopupShow = false
            if (res.confirm) {
              bottomPopupShow = true
            }

            this.setData({
              bottomPopupShow
            })
          }
        })
      }
    }
  }
})