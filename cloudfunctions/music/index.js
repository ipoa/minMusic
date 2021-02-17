// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')
const rp = require('request-promise')
const BASE_URL = "https://music.163.com/api"
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({
    event
  })
  const playListCollection = cloud.database().collection('playlist')
  const {
    start = 0, count = 10, playListId = ""
  } = event
  // playlist
  app.router('playlist', async (ctx, next) => {
    const playList = await playListCollection.skip(start)
      .limit(count)
      .orderBy('createTime', 'desc')
      .get().then(res => {
        return res
      })
    const {
      data: list = []
    } = playList
    // 残渣
    const residue = list.length % 3
    if (residue) {
      for (let i = 0; i < residue; i++) {
        list.pop()
      }
    }
    // 返回数据
    ctx.body = {
      code: 0,
      list
    }
  })

  // musiclist
  app.router('musiclist', async (ctx, next) => {
    ctx.body = await rp(BASE_URL + '/playlist/detail?id=' + parseInt(playListId)).then(res => {
      return JSON.parse(res).result
    })
  })
  return app.serve()
}