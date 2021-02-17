// components/musicList/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    musicid: -1
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onSelect(event) {
      const {
        currentTarget: cur = {
          dataset: {
            musicid: 0
          }
        }
      } = event
      const {musicid=-1}=cur.dataset
      this.setData({
        musicid
      })
      this.triggerEvent('select',{playingId:musicid})
    }
  }
})