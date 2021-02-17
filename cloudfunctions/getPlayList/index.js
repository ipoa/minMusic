// 云函数入口文件
const cloud = require('wx-server-sdk')
const rp = require('request-promise')
const MAX_LIMIT = 100
cloud.init()
const URL = 'http://music.163.com/api/search/get/web?csrf_token=hlpretag=&hlposttag=&s={%E7%83%AD%E9%97%A8%E6%8E%A8%E8%8D%90}&type=1000&offset=0&total=true&limit=50'
const db = cloud.database()
const playListCollection = db.collection('playlist')
// 云函数入口函数
exports.main = async (event, context) => {

  try {
    /// 原来云数据库里的数据列表 最大为100
    let originPlayList = await getCloudPlayList(MAX_LIMIT)
    // 请求网易云数据
    const {
      playlists = []
    } = await rp(URL).then(res => {
      return JSON.parse(res).result
    })
    let newData = []
    for (let i = 0; i < playlists.length; i++) {
      let flag = true
      // 对比去重
      for (let j = 0; j < originPlayList.data.length; j++) {
        if (playlists[i].id === originPlayList.data[j].id) {
          flag = false
          break
        }
      }
      if (flag) {
        newData.push(playlists[i])
      }
    }


    for (let i = 0, len = newData.length; i < len; i++) {
      const {
        coverImgUrl: picUrl = '',
        ...params
      } = newData[i]
      // 逐条插入数据库
      await playListCollection.add({
        data: {
          ...params,
          picUrl,
          createTime: db.serverDate()
        }
      }).then(res => {
        console.log('插入成功');
      })
    }
    return {
      code: 0,
      message:'操完成'
    }
  } catch (err) {
    console.log(err.name);

  }
}
// 云数据库里的数据列表 最大为100
async function getCloudPlayList(max_limit = 100) {
  // 云数据库总条数
  const {
    total = 0
  } = await playListCollection.count()
  const batchTimes = Math.ceil(total / max_limit)
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    let promise = playListCollection.skip(i * max_limit).limit(max_limit).get()
    tasks.push(promise)
  }
  let list = {
    data: []
  }
  if (tasks.length > 0) {
    list = (await Promise.all(tasks)).reduce((acc, current) => {
      return {
        // 拼接数据
        data: acc.data.conat(current.data)
      }
    })
  }
  return list
}