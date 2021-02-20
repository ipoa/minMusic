// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')
const rp = require('request-promise')
const crypto = require('crypto')
const BASE_URL = "https://music.163.com/api"
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
    ctx.body = await rp(BASE_URL + '/playlist/detail?id=' + parseInt(playListId)).then(res => {
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
      uri: `https://music.163.com/weapi/song/enhance/player/url/v1?csrf_token=646350082bdddf33b7351f040d7b1462`,
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

// ======
let maxDigits,
  ZERO_ARRAY,
  bigZero,
  bigOne,
  dpl10,
  lr10,
  hexatrigesimalToChar,
  hexToChar,
  highBitMasks,
  lowBitMasks,
  biRadixBase = 2,
  biRadixBits = 16,
  bitsPerDigit = biRadixBits,
  biRadix = 65536,
  biHalfRadix = biRadix >>> 1,
  biRadixSquared = biRadix * biRadix,
  maxDigitVal = biRadix - 1,
  maxInteger = 9999999999999998
setMaxDigits(20),
  dpl10 = 15,
  lr10 = biFromNumber(1e15),
  hexatrigesimalToChar = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
  hexToChar = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'],
  highBitMasks = [0, 32768, 49152, 57344, 61440, 63488, 64512, 65024, 65280, 65408, 65472, 65504, 65520, 65528, 65532, 65534, 65535],
  lowBitMasks = [0, 1, 3, 7, 15, 31, 63, 127, 255, 511, 1023, 2047, 4095, 8191, 16383, 32767, 65535]

function createEncrypt(id) {
  const NONCE = '0CoJUm6Qyw8W8jud'
  const IV = '0102030405060708'
  const PUBLIC_KEY = '010001'
  const MODULUS = '00e0b509f6259df8642dbc35662901477df22677ec152b5ff68ace615bb7b725152b3ab17a876aea8a5aa76d2e417629ec4ee341f56135fccf695280104e0312ecbda92557c93870114af6c9d05c4f7f0c3685b7a46bee255932575cce10b424d813cfe4875d3e82047b97ddef52741d546b8e289dc6935b3ece0462db0a22b8e7'

  // const data = `{"ids":"[190072]","level":"standard","encodeType":"aac","csrf_token":""}`
  const data = `{"ids":"[${id}]","level":"standard","encodeType":"aac","csrf_token":"646350082bdddf33b7351f040d7b1462"}`
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

function RSAKeyPair(encryptionExponent, decryptionExponent, modulus) {
  this.e = biFromHex(encryptionExponent),
    this.d = biFromHex(decryptionExponent),
    this.m = biFromHex(modulus),
    this.chunkSize = 2 * biHighIndex(this.m),
    this.radix = 16,
    this.barrett = new BarrettMu(this.m)
}

function twoDigit(a) {
  return (10 > a ? '0' : '') + String(a)
}

function encryptedString(a, b) {
  let e = 0,
    f,
    g,
    h,
    i,
    j,
    k,
    l,
    c = [],
    d = b.length
  for (; d > e;) {
    c[e] = b.charCodeAt(e),
      e++
  }
  for (; 0 !== c.length % a.chunkSize;) {
    c[e++] = 0
  }
  for (f = c.length,
    g = '',
    e = 0; f > e; e += a.chunkSize) {
    for (j = new BigInt,
      h = 0,
      i = e; i < e + a.chunkSize; ++h) {
      j.digits[h] = c[i++],
        j.digits[h] += c[i++] << 8
    }
    k = a.barrett.powMod(j, a.e),
      l = 16 == a.radix ? biToHex(k) : biToString(k, a.radix),
      g += l + ' '
  }
  return g.substring(0, g.length - 1)
}

function decryptedString(a, b) {
  let e,
    f,
    g,
    h,
    c = b.split(' '),
    d = ''
  for (e = 0; e < c.length; ++e) {
    for (h = 16 == a.radix ? biFromHex(c[e]) : biFromString(c[e], a.radix),
      g = a.barrett.powMod(h, a.d),
      f = 0; f <= biHighIndex(g); ++f) {
      d += String.fromCharCode(255 & g.digits[f], g.digits[f] >> 8)
    }
  }
  return 0 == d.charCodeAt(d.length - 1) && (d = d.substring(0, d.length - 1)),
    d
}

function setMaxDigits(a) {
  maxDigits = a,
    ZERO_ARRAY = new Array(maxDigits)
  for (let b = 0; b < ZERO_ARRAY.length; b++) {
    ZERO_ARRAY[b] = 0
  }
  bigZero = new BigInt,
    bigOne = new BigInt,
    bigOne.digits[0] = 1
}

function BigInt(a) {
  this.digits = 'boolean' == typeof a && 1 == a ? null : ZERO_ARRAY.slice(0),
    this.isNeg = !1
}

function biFromDecimal(a) {
  for (let d, e, f, b = '-' === a.charAt(0), c = b ? 1 : 0; c < a.length && "0" === a.charAt(c);) {
    ++c
  }
  if (c === a.length) {
    d = new BigInt
  } else {
    for (e = a.length - c,
      f = e % dpl10,
      0 === f && (f = dpl10),
      d = biFromNumber(Number(a.substr(c, f))),
      c += f; c < a.length;) {
      d = biAdd(biMultiply(d, lr10), biFromNumber(Number(a.substr(c, dpl10)))),
        c += dpl10
    }
    d.isNeg = b
  }
  return d
}

function biCopy(a) {
  let b = new BigInt(!0)
  return b.digits = a.digits.slice(0),
    b.isNeg = a.isNeg,
    b
}

function biFromNumber(a) {
  let c,
    b = new BigInt
  for (b.isNeg = 0 > a,
    a = Math.abs(a),
    c = 0; a > 0;) {
    b.digits[c++] = a & maxDigitVal,
      a >>= biRadixBits
  }
  return b
}

function reverseStr(a) {
  let c,
    b = ''
  for (c = a.length - 1; c > -1; --c) {
    b += a.charAt(c)
  }
  return b
}

function biToString(a, b) {
  let d,
    e,
    c = new BigInt
  for (c.digits[0] = b,
    d = biDivideModulo(a, c),
    e = hexatrigesimalToChar[d[1].digits[0]]; 1 === biCompare(d[0], bigZero);) {
    d = biDivideModulo(d[0], c),
      digit = d[1].digits[0],
      e += hexatrigesimalToChar[d[1].digits[0]]
  }
  return (a.isNeg ? '-' : '') + reverseStr(e)
}

function biToDecimal(a) {
  let c,
    d,
    b = new BigInt
  for (b.digits[0] = 10,
    c = biDivideModulo(a, b),
    d = String(c[1].digits[0]); 1 === biCompare(c[0], bigZero);) {
    c = biDivideModulo(c[0], b),
      d += String(c[1].digits[0])
  }
  return (a.isNeg ? '-' : '') + reverseStr(d)
}

function digitToHex(a) {
  let b = 15,
    c = ''
  for (i = 0; 4 > i; ++i) {
    c += hexToChar[a & b],
      a >>>= 4
  }
  return reverseStr(c)
}

function biToHex(a) {
  let d,
    b = ''
  for (biHighIndex(a),
    d = biHighIndex(a); d > -1; --d) {
    b += digitToHex(a.digits[d])
  }
  return b
}

function charToHex(a) {
  let h,
    b = 48,
    c = b + 9,
    d = 97,
    e = d + 25,
    f = 65,
    g = 90
  return h = a >= b && c >= a ? a - b : a >= f && g >= a ? 10 + a - f : a >= d && e >= a ? 10 + a - d : 0
}

function hexToDigit(a) {
  let d,
    b = 0,
    c = Math.min(a.length, 4)
  for (d = 0; c > d; ++d) {
    b <<= 4,
      b |= charToHex(a.charCodeAt(d))
  }
  return b
}

function biFromHex(a) {
  let d,
    e,
    b = new BigInt,
    c = a.length
  for (d = c,
    e = 0; d > 0; d -= 4,
    ++e) {
    b.digits[e] = hexToDigit(a.substr(Math.max(d - 4, 0), Math.min(d, 4)))
  }
  return b
}

function biFromString(a, b) {
  let g,
    h,
    i,
    j,
    c = '-' === a.charAt(0),
    d = c ? 1 : 0,
    e = new BigInt,
    f = new BigInt
  for (f.digits[0] = 1,
    g = a.length - 1; g >= d; g--) {
    h = a.charCodeAt(g),
      i = charToHex(h),
      j = biMultiplyDigit(f, i),
      e = biAdd(e, j),
      f = biMultiplyDigit(f, b)
  }
  return e.isNeg = c,
    e
}

function biDump(a) {
  return (a.isNeg ? '-' : '') + a.digits.join(' ')
}

function biAdd(a, b) {
  let c,
    d,
    e,
    f
  if (a.isNeg !== b.isNeg) {
    b.isNeg = !b.isNeg,
      c = biSubtract(a, b),
      b.isNeg = !b.isNeg
  } else {
    for (c = new BigInt,
      d = 0,
      f = 0; f < a.digits.length; ++f) {
      e = a.digits[f] + b.digits[f] + d,
        c.digits[f] = 65535 & e,
        d = Number(e >= biRadix)
    }
    c.isNeg = a.isNeg
  }
  return c
}

function biSubtract(a, b) {
  let c,
    d,
    e,
    f
  if (a.isNeg !== b.isNeg) {
    b.isNeg = !b.isNeg,
      c = biAdd(a, b),
      b.isNeg = !b.isNeg
  } else {
    for (c = new BigInt,
      e = 0,
      f = 0; f < a.digits.length; ++f) {
      d = a.digits[f] - b.digits[f] + e,
        c.digits[f] = 65535 & d,
        c.digits[f] < 0 && (c.digits[f] += biRadix),
        e = 0 - Number(0 > d)
    }
    if (-1 == e) {
      for (e = 0,
        f = 0; f < a.digits.length; ++f) {
        d = 0 - c.digits[f] + e,
          c.digits[f] = 65535 & d,
          c.digits[f] < 0 && (c.digits[f] += biRadix),
          e = 0 - Number(0 > d)
      }
      c.isNeg = !a.isNeg
    } else {
      c.isNeg = a.isNeg
    }
  }
  return c
}

function biHighIndex(a) {
  for (var b = a.digits.length - 1; b > 0 && 0 === a.digits[b];) {
    --b
  }
  return b
}

function biNumBits(a) {
  let e,
    b = biHighIndex(a),
    c = a.digits[b],
    d = (b + 1) * bitsPerDigit
  for (e = d; e > d - bitsPerDigit && 0 == (32768 & c); --e) {
    c <<= 1
  }
  return e
}

function biMultiply(a, b) {
  let d,
    h,
    i,
    k,
    c = new BigInt,
    e = biHighIndex(a),
    f = biHighIndex(b)
  for (k = 0; f >= k; ++k) {
    for (d = 0,
      i = k,
      j = 0; e >= j; ++j,
      ++i) {
      h = c.digits[i] + a.digits[j] * b.digits[k] + d,
        c.digits[i] = h & maxDigitVal,
        d = h >>> biRadixBits
    }
    c.digits[k + e + 1] = d
  }
  return c.isNeg = a.isNeg != b.isNeg,
    c
}

function biMultiplyDigit(a, b) {
  let c,
    d,
    e,
    f
  for (result = new BigInt,
    c = biHighIndex(a),
    d = 0,
    f = 0; c >= f; ++f) {
    e = result.digits[f] + a.digits[f] * b + d,
      result.digits[f] = e & maxDigitVal,
      d = e >>> biRadixBits
  }
  return result.digits[1 + c] = d,
    result
}

function arrayCopy(a, b, c, d, e) {
  let g,
    h,
    f = Math.min(b + e, a.length)
  for (g = b,
    h = d; f > g; ++g,
    ++h) {
    c[h] = a[g]
  }
}

function biShiftLeft(a, b) {
  let e,
    f,
    g,
    h,
    c = Math.floor(b / bitsPerDigit),
    d = new BigInt
  for (arrayCopy(a.digits, 0, d.digits, c, d.digits.length - c),
    e = b % bitsPerDigit,
    f = bitsPerDigit - e,
    g = d.digits.length - 1,
    h = g - 1; g > 0; --g,
    --h) {
    d.digits[g] = d.digits[g] << e & maxDigitVal | (d.digits[h] & highBitMasks[e]) >>> f
  }
  return d.digits[0] = d.digits[g] << e & maxDigitVal,
    d.isNeg = a.isNeg,
    d
}

function biShiftRight(a, b) {
  let e,
    f,
    g,
    h,
    c = Math.floor(b / bitsPerDigit),
    d = new BigInt
  for (arrayCopy(a.digits, c, d.digits, 0, a.digits.length - c),
    e = b % bitsPerDigit,
    f = bitsPerDigit - e,
    g = 0,
    h = g + 1; g < d.digits.length - 1; ++g,
    ++h) {
    d.digits[g] = d.digits[g] >>> e | (d.digits[h] & lowBitMasks[e]) << f
  }
  return d.digits[d.digits.length - 1] >>>= e,
    d.isNeg = a.isNeg,
    d
}

function biMultiplyByRadixPower(a, b) {
  let c = new BigInt
  return arrayCopy(a.digits, 0, c.digits, b, c.digits.length - b),
    c
}

function biDivideByRadixPower(a, b) {
  let c = new BigInt
  return arrayCopy(a.digits, b, c.digits, 0, c.digits.length - b),
    c
}

function biModuloByRadixPower(a, b) {
  let c = new BigInt
  return arrayCopy(a.digits, 0, c.digits, 0, b),
    c
}

function biCompare(a, b) {
  if (a.isNeg !== b.isNeg) {
    return 1 - 2 * Number(a.isNeg)
  }
  for (let c = a.digits.length - 1; c >= 0; --c) {
    if (a.digits[c] !== b.digits[c]) {
      return a.isNeg ? 1 - 2 * Number(a.digits[c] > b.digits[c]) : 1 - 2 * Number(a.digits[c] < b.digits[c])
    }
  }
  return 0
}

function biDivideModulo(a, b) {
  let f,
    g,
    h,
    i,
    j,
    k,
    l,
    m,
    n,
    o,
    p,
    q,
    r,
    s,
    c = biNumBits(a),
    d = biNumBits(b),
    e = b.isNeg
  if (d > c) {
    return a.isNeg ? (f = biCopy(bigOne),
        f.isNeg = !b.isNeg,
        a.isNeg = !1,
        b.isNeg = !1,
        g = biSubtract(b, a),
        a.isNeg = !0,
        b.isNeg = e) : (f = new BigInt,
        g = biCopy(a)),
      [f, g]
  }
  for (f = new BigInt,
    g = a,
    h = Math.ceil(d / bitsPerDigit) - 1,
    i = 0; b.digits[h] < biHalfRadix;) {
    b = biShiftLeft(b, 1),
      ++i,
      ++d,
      h = Math.ceil(d / bitsPerDigit) - 1
  }
  for (g = biShiftLeft(g, i),
    c += i,
    j = Math.ceil(c / bitsPerDigit) - 1,
    k = biMultiplyByRadixPower(b, j - h); - 1 != biCompare(g, k);) {
    ++f.digits[j - h],
      g = biSubtract(g, k)
  }
  for (l = j; l > h; --l) {
    for (m = l >= g.digits.length ? 0 : g.digits[l],
      n = l - 1 >= g.digits.length ? 0 : g.digits[l - 1],
      o = l - 2 >= g.digits.length ? 0 : g.digits[l - 2],
      p = h >= b.digits.length ? 0 : b.digits[h],
      q = h - 1 >= b.digits.length ? 0 : b.digits[h - 1],
      f.digits[l - h - 1] = m == p ? maxDigitVal : Math.floor((m * biRadix + n) / p),
      r = f.digits[l - h - 1] * (p * biRadix + q),
      s = m * biRadixSquared + (n * biRadix + o); r > s;) {
      --f.digits[l - h - 1],
        r = f.digits[l - h - 1] * (p * biRadix | q),
        s = m * biRadix * biRadix + (n * biRadix + o)
    }
    k = biMultiplyByRadixPower(b, l - h - 1),
      g = biSubtract(g, biMultiplyDigit(k, f.digits[l - h - 1])),
      g.isNeg && (g = biAdd(g, k),
        --f.digits[l - h - 1])
  }
  return g = biShiftRight(g, i),
    f.isNeg = a.isNeg != e,
    a.isNeg && (f = e ? biAdd(f, bigOne) : biSubtract(f, bigOne),
      b = biShiftRight(b, i),
      g = biSubtract(b, g)),
    0 == g.digits[0] && 0 == biHighIndex(g) && (g.isNeg = !1),
    new Array(f, g)
}

function biDivide(a, b) {
  return biDivideModulo(a, b)[0]
}

function biModulo(a, b) {
  return biDivideModulo(a, b)[1]
}

function biMultiplyMod(a, b, c) {
  return biModulo(biMultiply(a, b), c)
}

function biPow(a, b) {
  for (let c = bigOne, d = a;;) {
    if (0 != (1 & b) && (c = biMultiply(c, d)),
      b >>= 1,
      0 == b) {
      break
    }
    d = biMultiply(d, d)
  }
  return c
}

function biPowMod(a, b, c) {
  for (let d = bigOne, e = a, f = b;;) {
    if (0 != (1 & f.digits[0]) && (d = biMultiplyMod(d, e, c)),
      f = biShiftRight(f, 1),
      0 == f.digits[0] && 0 == biHighIndex(f)) {
      break
    }
    e = biMultiplyMod(e, e, c)
  }
  return d
}

function BarrettMu(a) {
  this.modulus = biCopy(a),
    this.k = biHighIndex(this.modulus) + 1
  let b = new BigInt
  b.digits[2 * this.k] = 1,
    this.mu = biDivide(b, this.modulus),
    this.bkplus1 = new BigInt,
    this.bkplus1.digits[this.k + 1] = 1,
    this.modulo = BarrettMu_modulo,
    this.multiplyMod = BarrettMu_multiplyMod,
    this.powMod = BarrettMu_powMod
}

function BarrettMu_modulo(a) {
  let i,
    b = biDivideByRadixPower(a, this.k - 1),
    c = biMultiply(b, this.mu),
    d = biDivideByRadixPower(c, this.k + 1),
    e = biModuloByRadixPower(a, this.k + 1),
    f = biMultiply(d, this.modulus),
    g = biModuloByRadixPower(f, this.k + 1),
    h = biSubtract(e, g)
  for (h.isNeg && (h = biAdd(h, this.bkplus1)),
    i = biCompare(h, this.modulus) >= 0; i;) {
    h = biSubtract(h, this.modulus),
      i = biCompare(h, this.modulus) >= 0
  }
  return h
}

function BarrettMu_multiplyMod(a, b) {
  let c = biMultiply(a, b)
  return this.modulo(c)
}

function BarrettMu_powMod(a, b) {
  let d,
    e,
    c = new BigInt
  for (c.digits[0] = 1,
    d = a,
    e = b;;) {
    if (0 != (1 & e.digits[0]) && (c = this.multiplyMod(c, d)),
      e = biShiftRight(e, 1),
      0 == e.digits[0] && 0 == biHighIndex(e)) {
      break
    }
    d = this.multiplyMod(d, d)
  }
  return c
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

function encryptSecKey(str, encryptionExponent, modulus) {
  let d,
    e
  return setMaxDigits(131),
    d = new RSAKeyPair(encryptionExponent, '', modulus),
    e = encryptedString(d, str)
}