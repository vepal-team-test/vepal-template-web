export function handleDate(time) {
  var time = new Date(time)
  var y = time.getFullYear()
  var m = time.getMonth() + 1
  m = m < 10 ? '0' + m : m
  var d = time.getDate()
  d = d < 10 ? '0' + d : d
  return y + '-' + m + '-' + d
}

export const isArray = () => Array.isArray

export const isArrayList = val => {
  return val && isArray(val) && val.length
}

export const isObject = val => {
  return val !== null && typeof val === 'object'
}

export const inBrowser = typeof window !== 'undefined'
export const UA = inBrowser && window.navigator.userAgent.toLowerCase()
export const isIE = UA && /msie|trident/.test(UA)
export const isIE9 = UA && UA.indexOf('msie 9.0') > 0
export const isEdge = UA && UA.indexOf('edge/') > 0
export const isAndroid = UA && UA.indexOf('android') > 0
export const isIOS = UA && /iphone|ipad|ipod|ios/.test(UA)
export const isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge
export const isPhantomJS = UA && /phantomjs/.test(UA)
export const isFF = UA && UA.match(/firefox\/(\d+)/)
export const isWebkit = UA && /applewebkit/.test(UA)

export const setCookie = (name, value) => {
  let exp = new Date()
  exp.setTime(exp.getTime() + 1000 * 60 * 60 * 8)
  document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString()
}

export const getCookie = name => {
  let arr = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
  let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
  arr = document.cookie.match(reg)
  if (arr) {
    return unescape(arr[2])
  } else {
    return null
  }
}

export const delCookie = name => {
  let exp = new Date()
  exp.setTime(exp.getTime() - 1)
  let cval = getCookie(name)
  if (cval !== null) {
    document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString() + ';path=/'
  }
}

export const all = promiseList => {
  let result = []
  let index = 0
  return new Promise((resolve, reject) => {
    function next(promise) {
      if (index > promiseList.length - 1) {
        return resolve(result)
      }
      // 成功失败都存入
      promise
        .then(res => {
          result.push(res)
          index++
          next(promiseList[index])
        })
        .catch(err => {
          result.push(err)
          index++
          next(promiseList[index])
        })
    }
    next(promiseList[index])
  })
}

export const getRandomId = () => {
  return (
    (Math.random() * 10000000).toString(16).substr(0, 4) +
    '-' +
    new Date().getTime() +
    '-' +
    Math.random().toString().substr(2, 5)
  )
}

export function once(fn) {
  let called = false
  return function () {
    if (!called) {
      called = true
      fn.apply(this, arguments)
    }
  }
}
