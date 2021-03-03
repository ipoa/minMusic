// components/Login/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    popupShow: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 关闭事件
    onCloseBottemPopupShow() {
      this.triggerEvent('close', {})
    },
    onHanderUserInfo(event) {
      const hasUserInfo = event.detail.userInfo
      // 允许授权
      if (hasUserInfo) {
        this.setData({
          popupShow: false
        })
        this.triggerEvent('close', {
          userInfo: hasUserInfo
        })
      } else {
        this.triggerEvent('close', {})
      }
    }
  }
})