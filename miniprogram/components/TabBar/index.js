Component({
  data: {
    color: "#474747",
    selectedColor: "#d13c13",
  },
  properties:{
    list: {
      type:Array,
      value:[]
    },
    current:{
      type:Number,
      value:0
    }
  },
  attached() {
  },
  methods: {
    switchTab(event) {
      const data = event.currentTarget.dataset
   //   const url = data.path
      // wx.switchTab({url})
      this.triggerEvent("switchTab",{current:data.index})
      this.setData({
        current: data.index
      })
    }
  }
})