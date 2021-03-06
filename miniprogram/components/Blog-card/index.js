// blog-card/index.js
import '../../utils/formatTime.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blog: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    _createTime: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 预览图片
    onPreviewImage:(event)=>{
      wx.previewImage({
        urls: event.target.dataset.imgs,
        current:event.target.dataset.imgsrc
      })
    }
  },

  observers: {
    ['blog.createTime'](val) {
      this.setData({
        _createTime: new Date(val).Format('yyyy-MM-dd hh:mm:ss')
      })
    }
  }
})