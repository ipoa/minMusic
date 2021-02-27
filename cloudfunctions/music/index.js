// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')
const rp = require('request-promise')
const crypto = require('crypto')
const BASE_URL = "https://music.163.com"
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({
    event
  })
  const playListCollection = cloud.database().collection('playlist')
  const {
    start = 0, count = 10, playListId = '', musicId = ''
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
    ctx.body = await rp(BASE_URL + '/api/playlist/detail?id=' + parseInt(playListId)).then(res => {
      return JSON.parse(res).result
    })
  })

  // musicUrl
  app.router('musicUrl', async (ctx, next) => {
    const {
      params,
      encSecKey
    } = createEncrypt(musicId)
    console.log({
      params,
      encSecKey
    });
    ctx.body = await rp({
      method: 'POST',
      uri: BASE_URL + `/weapi/song/enhance/player/url/v1?csrf_token=`,
      form: {
        params,
        encSecKey
      },
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'User-agent': `Mozilla/5.0 (Macintosh; Intel Mac OS X 11_1_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36`,
        'referer': `https://music.163.com/`
      }
    }).then(res => {

      return JSON.parse(res).data
    })
  })

  return app.serve()
}

function createEncrypt(id) {
  const NONCE = '0CoJUm6Qyw8W8jud'
  const IV = '0102030405060708'
  const PUBLIC_KEY = '010001'
  const MODULUS = '00e0b509f6259df8642dbc35662901477df22677ec152b5ff68ace615bb7b725152b3ab17a876aea8a5aa76d2e417629ec4ee341f56135fccf695280104e0312ecbda92557c93870114af6c9d05c4f7f0c3685b7a46bee255932575cce10b424d813cfe4875d3e82047b97ddef52741d546b8e289dc6935b3ece0462db0a22b8e7'

  // const data = `{"ids":"[190072]","level":"standard","encodeType":"aac","csrf_token":""}`
  const data = `{"ids":"[${id}]","level":"standard","encodeType":"aac","csrf_token":""}`
  const encText = encrypt(NONCE, IV, data)
  // passwd 16个随机字符串
  const password = randomKey(16)
  const params = encrypt(password, IV, encText)

  let encSecKey = encryptSecKey(password, PUBLIC_KEY, MODULUS)

  // return `params=${encText}&encSecKey=${encSecKey}`
  return {
    params,
    encSecKey
  }
}

function randomKey(len) {
  let i,
    e,
    str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
    c = ''
  for (i = 0; len > i; i++) {
    e = Math.random() * str.length,
      e = Math.floor(e),
      c += str.charAt(e)
  }
  return c
}
/**
 * 加密方法
 * @param key 加密key
 * @param iv       向量
 * @param data     需要加密的数据
 * @returns string
 */
function encrypt(key, iv, data) {
  const cipher = crypto.createCipheriv('aes-128-cbc', key, iv)
  let crypted = cipher.update(data, 'utf8', 'binary')
  crypted += cipher.final('binary')
  crypted = new Buffer.from(crypted, 'binary').toString('base64')
  return crypted
}


function encryptSecKey(str, encryptionExponent, modulus) {
  const {
    setMaxDigits,
    RSAKeyPair,
    encryptedString
  } = require('rsa-js-java')
  setMaxDigits(131)
  let key = new RSAKeyPair(encryptionExponent, '', modulus)
  return encryptedString(key, str)
}