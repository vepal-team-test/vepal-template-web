// import { createApp } from "vue";

// const app = createApp({})

// VUE取地址栏参数
function getUrlKey(name) {
  return (
    decodeURIComponent(
      (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ''])[1].replace(/\+/g, '%20')
    ) || null
  )
}
// token系列
export function getCookie(name) {
  let arr,
    reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
  if ((arr = document.cookie.match(reg))) {
    return unescape(arr[2])
  } else {
    return null
  }
}

// console.log(getUrlKey('menuId'));
if (getUrlKey('menuId') != null) {
  document.cookie = 'zctoken=' + getUrlKey('token') // 本地开发需打开
  document.cookie = 'zcid=' + getUrlKey('id')
  document.cookie = 'menuId=' + getUrlKey('menuId')
}
// app.config.globalProperties.$zcId = getCookie('zcid');
export const zcId = getCookie('zcid')
export const menuId = getCookie('menuId')
export const DelCookie = name => {
  let exp = new Date()
  exp.setTime(exp.getTime() - 1)
  let cval = getCookie(name)
  if (cval != null) {
    document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString()
  }
}
let token
let host = window.location.hostname
if (window.location.port === '8081') {
  // 本地开发环境
  token = getCookie('zctoken')
  // export const Token = getCookie('zctoken');
} else {
  // 本地以外的环境
  token = getCookie('token')
  // export const Token = getCookie('token');
}
// if (token == null) {
//   if (host === '192.168.112.210') { // 测试
//     window.location.href = 'https://192.168.112.210:9007/#/login';
//   } else if (host === '192.168.112.168') { // 正式内网
//     window.location.href = 'https://58.30.9.142:48082/#/login';
//   } else if (host === '58.30.9.142') { // 正式外网
//     window.location.href = 'https://58.30.9.142:48082/#/login';
//   } else {
//     window.location.href = 'https://192.168.112.210:9007/#/login';
//   }
// } else {
//   if (host === '192.168.112.210') { // 测试
//     export const http = 'http://192.168.112.210:8092/emc'; // 导出
//   } else if (host === '192.168.112.168') { // 正式内网
//     export const http = 'http://192.168.112.168:8092/emc'; // 导出
//   } else if (host === '58.30.9.142') { // 正式外网
//     export const http = 'http://192.168.112.168:8092/emc'; // 导出
//   } else {
//     export const http = 'http://192.168.112.210:8092/emc'; // 导出
//   }
// }
export const Token = token
