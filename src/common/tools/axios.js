import axios from 'axios'
import qs from 'qs'
import { Token as token } from './token.js'

export const Get = (url, data) => {
	return axios(url, {
		headers: {
			token
		},
		method: 'get',
		params: data
	})
}

export const Post = (url, data) => {
	return axios(url, {
		headers: {
			token,
			'content-type': 'application/json'
		},
		method: 'post',
		data: JSON.stringify(data)
	})
}

export const Put = (url, data) => {
	return axios(url, {
		headers: {
			token,
			'content-type': 'application/json'
		},
		method: 'put',
		data: JSON.stringify(data)
	})
}

export const Delete = (url, data) => {
	return axios(url, {
		headers: {
			token
		},
		method: 'delete',
		params: data
	})
}
