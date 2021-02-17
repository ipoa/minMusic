// components/PlayList/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: {
      type: Object,
      value: {}
    }
  },
  observers: {
    ['data.playCount'](count) {
      this.setData({
        _count: this._tarnNumber(count, 2)
      })
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    _count: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _tarnNumber(num, point) {
      const [numStr] = num.toString().split('.')
      const length = numStr.length


      if (length < 6) { // 数字为十万以内的数据
        return numStr
      } else if (length >= 6 && length <= 8) { // 数字为万以上,亿以下的数据
        let decimal = numStr.substring(length - 4, length - 4 + point)
        return parseFloat(parseInt(num / 10000) + '.' + decimal) + '万'
      } else if (length > 8) {
        let decimal = numStr.substring(length - 8, length - 8 + point)
        return parseFloat(parseInt(num / (10000 * 10000)) + '.' + decimal) + '亿'
      }
    }
  }
})