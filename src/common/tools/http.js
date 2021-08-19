import axios from 'axios'
import qs from 'qs'
import * as util from '../js/util'
import store from '@/store'
// import router from '@/router'
// import Bus from '@/assets/js/bus'
let http = axios.create({
	// baseURL: 'http://localhost:8080/',
	// withCredentials: true,
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
		token: util.getCookie('token') ? util.getCookie('token') : ''
		// 'Content-Type': 'application/json'
	},
	// traditional: true,
	transformRequest: [
		function (data) {
			return qs.stringify(data)
		}
	]
})
export let httpApplicationJson = axios.create({
	// baseURL: 'http://localhost:8080/',
	// withCredentials: true,
	headers: {
		token: util.getCookie('token') ? util.getCookie('token') : '',
		'Content-Type': 'application/json;charset=UTF-8'
	}
})
function apiAxios(method, url, params) {
	if (typeof params === 'function') {
		// response = params
		params = null
	}
	let config = {
		method: method,
		url: url,
		data: method === 'POST' || method === 'PUT' ? params : null,
		params: method === 'GET' || method === 'DELETE' ? params : null
	}
	return http(config)
	// .then(function (res) {
	// 	response(res)
	// })
	// .catch(function (err) {
	// 	response(err)
	// })
}

// function httpCodeCheck(code) {
// 	switch (code) {
// 		case -1001:
// 		case 401:
// 			setTimeout(() => {
// 				window.SLVue.$message({
// 					message: '登录超时,请重新登录',
// 					type: 'warning'
// 				})
// 				// Bus.$nextTick(() => {
// 				// 	Bus.$emit('tokenTimeOut')
// 				// })
// 			}, 0)
// 			store.dispatch('setUserLoginState', false)
// 			router.replace('/')
// 			break
// 	}
// }

http.interceptors.request.use(
	config => {
		let token = util.getCookie('token')
		config.headers.token = token
		return config
	},
	err => {
		console.error(err)
	}
)
http.interceptors.response.use(
	response => {
		return response
	},
	error => {
		// !util.getCookie('token') && httpCodeCheck(401)
		return Promise.reject(error)
	}
)
httpApplicationJson.interceptors.request.use(
	config => {
		let token = util.getCookie('token')
		config.headers.token = token
		return config
	},
	err => {
		console.error(err)
	}
)
httpApplicationJson.interceptors.response.use(
	response => {
		return response
	},
	error => {
		// !util.getCookie('token') && httpCodeCheck(401)
		return Promise.reject(error)
	}
)
export default {
	get: function (url, params, response) {
		return apiAxios('GET', url, params, response)
	},
	post: function (url, params, response) {
		return apiAxios('POST', url, params, response)
	},
	put: function (url, params, response) {
		return apiAxios('PUT', url, params, response)
	},
	delete: function (url, params, response) {
		return apiAxios('DELETE', url, params, response)
	},
	all: function (list, response) {
		let getApi = []
		list.forEach(api => {
			let config = {
				method: 'GET'
			}
			config = Object.assign({}, config, api)
			let method = config.method.toUpperCase()
			config.method = method
			if (method === 'GET' || method === 'DELETE') {
				config.params = config.data
				config.data = null
			}
			getApi.push(http(config))
		})
		axios.all(getApi).then(axios.spread(response)).catch(response)
	},
	jsonAxios: function (url, data, conf = {}) {
		const config = {
			method: 'POST',
			headers: {
				// 'Content-Type': 'application/json'
				'Content-Type': 'multipart/form-data'
			},
			transformRequest: [],
			url: url,
			data: data || null
		}
		Object.assign(config, conf)
		return http(config)
	},
	formAxios: function (url, formdata) {
		const config = {
			method: 'POST',
			headers: {
				'Content-Type': 'multipart/form-data'
			},
			url,
			data: formdata
		}
		return http(config)
	},
	export(url, data, method = 'GET', fileName, callback) {
		let tmpCallback = typeof fileName === 'function' ? fileName : callback
		let config = {
			method,
			url,
			timeout: 1000 * 60 * 5,
			headers: {
				token: util.getCookie('token')
			},
			responseType: 'blob'
		}
		if (method.toUpperCase() === 'GET') {
			config.params = { ...data }
		} else {
			config.data = data
		}
		axios(config)
			.then(res => {
				try {
					let disposition = res.headers['content-disposition']
					let tmpFileName = decodeURI(disposition.substring(disposition.indexOf('filename=') + 9, disposition.length))
					let suffix = tmpFileName.substring(tmpFileName.indexOf('.'), tmpFileName.length)
					let url = URL.createObjectURL(res.data)
					let a = document.createElement('a')
					a.href = url
					a.setAttribute('download', fileName ? fileName + suffix : tmpFileName)
					document.body.appendChild(a).click()
					a.parentNode.removeChild(a)
					URL.revokeObjectURL(url)
					tmpCallback(null, res)
				} catch (error) {
					tmpCallback(new Error(error))
				}
			})
			.catch(error => {
				tmpCallback(new Error('导出失败：' + error.message))
			})
	},
	instance: http
}
