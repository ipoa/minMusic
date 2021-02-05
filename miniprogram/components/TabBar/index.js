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
      this.triggerEvent("change",{current:data.index})
      this.setData({
        current: data.index
      })
    }
  }
})