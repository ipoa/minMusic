// 最大的输入的文字个数
const MAX_WORD_NUM = 140
// 最大的图片上传数量 9
const MAX_IMG_NUM = 9

let userInfo = {}
let content = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 输入的文字个数
    wordsNum: 0,
    // 键盘高度
    footerBottom: 0,
    images: [],
    // 判断是否还可以选择图片,默认为true可以选择
    selectPhotoShow: true
  },

  onInput: function (event) {
    let wordsNum = event.detail.value && event.detail.value.length
    if (wordsNum >= MAX_WORD_NUM) {
      wordsNum = `最大字数为${MAX_WORD_NUM}`
    }
    this.setData({
      wordsNum
    })
    content = event.detail.value
  },

  /**
   * 键盘高度修改
   */
  onKeyboardheightchange: function (event) {
    this.setData({
      footerBottom: event.detail.height
    })
  },

  /**
   * 取消输入焦点
   */
  onBlur: function () {
    this.setData({
      footerBottom: 0
    })
  },

  onChooseImage: function () {
    // 还能再选几张图片
    let max = MAX_IMG_NUM - this.data.images.length
    if (max <= 0) {
      return false
    }
    // 从本地相册选择图片或使用相机拍照
    wx.chooseImage({
      count: max,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          images: this.data.images.concat(res.tempFilePaths)
        })
        // 再次判断,还能再选几张图片,如果为0隐藏图片选择框
        this.setSelectPhotoShow()
      }
    })
  },

  /**
   * 在新的页面中全屏预览图片
   */
  onPreVeiwImage(event) {
    const imageSrc = event.target.dataset['image-src']
    wx.previewImage({
      urls: this.data.images,
      current: imageSrc
    })
  },

  onDelPhoto(event) {
    const index = event.target.dataset.index
    this.data.images.splice(index, 1)

    this.setData({
      images: this.data.images
    })

    this.setSelectPhotoShow()
  },

  /**
   * 发送功能
   */
  onPublishBtn: async function () {
    // 未输入内容
    if (content.trim() === '') {
      wx.showToast({
        title: '输入新鲜事嘛~',
        icon: 'error'
      })
      return false
    }
    const wordsNum = content.length
    if (wordsNum >= MAX_WORD_NUM) {
      wx.showToast({
        title: `最大字数为${MAX_WORD_NUM}`,
        icon: 'error'
      })
      return false
    }

    const db = wx.cloud.database({})
    const blogCollection = db.collection('blog')

    wx.showLoading({
      title: '正在发布...',
    })
    const promiseArr = await this.uploadFiles('music/blog/', this.data.images)
    // 存入云数据库
    Promise.all(promiseArr).then(fileIDs => {

      blogCollection.add({
        data: {
          ...userInfo,
          content,
          imgs: fileIDs,
          createTime: db.serverDate()
        }
      }).then(() => {
        wx.showToast({
          title: '发布成功',
          icon: 'success'
        })
        // 返回并刷新页面
        setTimeout(() => {
          wx.navigateBack()
        }, 1000)
      }).catch(() => {
        wx.showToast({
          title: '发布失败',
          icon: 'error'
        })
      })
    })
    wx.hideLoading()
  },

  uploadFiles: (cloudPath, files) => {
    return new Promise((resolve) => {
      let result = []
      for (let i = 0; i < files.length; i++) {
        let filePath = files[i]
        // 文字扩展名
        const [suffix] = /\.\w+$/.exec(filePath)
        const path = cloudPath + Date.now() + '-' + Math.floor(Math.random() * 100000000) + suffix
        const p = new Promise((pResolve, pReject) => {
          wx.cloud.uploadFile({
            cloudPath: path,
            filePath,
            success: (res) => {
              pResolve(res.fileID)
            },
            fail: (err) => {
              pReject(err)
            }
          })
        })
        result.push(p)
      }
      resolve(result)
    })
  },


  setSelectPhotoShow() {
    let max = MAX_IMG_NUM - this.data.images.length
    this.setData({
      selectPhotoShow: max > 0
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    userInfo = options
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

  }
})
