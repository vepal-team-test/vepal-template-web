import axios from 'axios'
import { Get, Put, Post, Delete } from './axios'
import { zcId, menuId } from './token.js'

export const findUserByUserId = id => {
	return Get('/api/umc/user/findUserByUserId', {
		userId: id || zcId,
		menuId: '2740fc3a670b4578b94a7a0db94d2e63'
		// 注意：这里需要替换成项目对应的menuId（固定），不可用menuId取值，否则会在刷新时丢失用户身份
	}).then(res => {
		return res.data.data
	})
}

export const findMyMenuPermissionByMenuId = data => {
	return Get('/api/umc/menu/findMyMenuPermissionByMenuId', {
		menuId: 'fb55937394114463b991b903c5bfbe5d'
	}).then(res => {
		return res.data.data
	})
}
