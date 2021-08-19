import CryptoJS from 'crypto-js';

const key = CryptoJS.enc.Utf8.parse('1234567890123456'); // 十六位十六进制数作为密钥
const iv = CryptoJS.enc.Utf8.parse('1234567890123456');
let throttle = true; // 节流阀

export const setCookie = (name, value) => {
  let exp = new Date();
  exp.setTime(exp.getTime() + 1000 * 60 * 60 * 8);
  document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString();
};

export const getCookie = (name) => {
  let arr = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
  let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
  arr = document.cookie.match(reg);
  if (arr) {
    return unescape(arr[2]);
  } else {
    return null;
  }
};

export const delCookie = (name) => {
  let exp = new Date();
  exp.setTime(exp.getTime() - 1);
  let cval = getCookie(name);
  if (cval !== null) {
    document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString() + ';path=/';
  }
};

export const decodeEvent = (role) => {
  let roleArr = role.split('');
  return roleArr[7];
};

export const Decrypt = (word) => {
  let base64 = CryptoJS.enc.Base64.parse(word);
  let src = CryptoJS.enc.Base64.stringify(base64);
  let decrypt = CryptoJS.AES.decrypt(src, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.ZeroPadding
  });
  let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  return decryptedStr.toString();
};

export const Encrypt = (word) => {
  let srcs = CryptoJS.enc.Utf8.parse(word);
  let encrypted = CryptoJS.AES.encrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.ZeroPadding });
  return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
};
/**
 * @description: base64转File
 */
export const BaseDataToFile = (base64Data, fileName) => {
  let arr = base64Data.split(',');
  let mine = arr[0].match(/:(.*?);/)[1];
  let bstr = atob(arr[1]);
  let n = bstr.length;
  let u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], fileName, {
    type: mine
  });
};
/**
 * @description: base64转Blob
 */
export const dataURLtoBlob = (base64Data) => {
  let arr = base64Data.split(',');
  let mime = arr[0].match(/:(.*?);/)[1];
  let bstr = atob(arr[1]);
  let n = bstr.length;
  let u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
};

export const throttleFc = (param, callback, time) => {
  if (throttle) {
    throttle = false;
    setTimeout(() => {
      callback(param);
      throttle = true;
    }, time);
  } else {
    return false;
  }
};

export const getRandomId = () => {
  return (Math.random() * 10000000).toString(16).substr(0, 4) + '-' + (new Date()).getTime() + '-' + Math.random().toString().substr(2, 5);
};

export const isArrayList = (val) => {
  return val && Array.isArray(val) && val.length;
};

export const isObject = (val) => {
  return typeof val === 'object' && val !== null;
};

/**
 * @param {Object} data
 * @param {Array} tmpArr
 * @return {Array} 返回已查找的数组
 * @description 根据已查找的数组的最后一位id判断是否继续递归
 */
export const findParent = (data, tmpArr) => {
  let parentId = recursiveOrg(data, tmpArr);
  if (parentId && Array.isArray(parentId) && parentId.length) {
    if (parentId[parentId.length - 1].id !== '1') {
      findParent(data, tmpArr);
    }
  }
  return tmpArr;
};

/**
 * @param {Object} data
 * @param {Array} tmpArr
 * @return {Array} 返回已查找的数组
 * @description 根据id查找父元素
 */
export const recursiveOrg = (node, tmpArr) => {
  if (!node) {
    return false;
  }
  if (Array.isArray(node.children) && node.children.length) {
    for (let i = 0; i < node.children.length; i++) {
      if (node.children[i].orgId === tmpArr[tmpArr.length - 1].id) {
        tmpArr.push({id: node.children[i].pid});
      } else {
        recursiveOrg(node.children[i], tmpArr);
      }
    }
  } else {
    if (node.orgId === tmpArr[tmpArr.length - 1].id) {
      tmpArr.push({id: node.pid});
    }
  }
  return tmpArr;
};

/**
 * @param {Object} config
 * children
 * pid
 * id
 */
export const findPid = (props) => {
  let config = {
    children: 'children',
    value: [],
    pid: 'pid',
    id: 'id',
    pidVal: '1'
  };
  if (isObject(props)) {
    for (const key in props) {
      if (Reflect.has(config, key)) {
        config[key] = props[key];
      }
    }
  }
  let val;
  let find = (node) => {
    if (config.pidVal === node[config.id]) {
      val = node;
    }
    let children = node[config.children];
    if (isArrayList(children)) {
      for (let index = 0; index < children.length; index++) {
        find(children[index]);
      }
    }
  };
  if (isArrayList(config.value)) {
    for (let index = 0; index < config.value.length; index++) {
      find(config.value[index]);
    }
  } else {
    val = find(config.value);
  }
  return val;
};

/**
 * 判断params中是否存在指定字段
 */
export const getQueryVariable = (variable) => {
  let query = window.location.search.substring(1);
  let vars = query.split('&');
  for (let i = 0; i < vars.length; i++) {
    let pair = vars[i].split('=');
    if (pair[0] === variable) { return pair[1]; }
  }
  return (false);
};

export const isPlainObject = (val) => {
  return Object.prototype.toString.call(val) === '[object Object]';
};
