// components/Bottom-model/index.js
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

  options: {
    styleIsolation: 'apply-shared',
    multipleSlots: true
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
    // 关闭按扭
    onCloseBtn() {
      this.setData({
        popupShow: false
      })
      this.triggerEvent('close', {
        show: false
      })
    }
  }
})