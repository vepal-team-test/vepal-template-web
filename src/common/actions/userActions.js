import {
	findUserByUserId,
	findMyMenuPermissionByMenuId,
	signlogin,
	getCheckCode,
	initPwd,
	signlogout
} from '@/common/tools/api'

export const FindUserByUserId = async data => {
	return findUserByUserId(data).then(res => {
		let isAdmin = false
		for (var item of res.roles) {
			if (item.roleName === '需求系统管理员') {
				isAdmin = true
			}
		}
		return { userInfo: res, isAdmin }
	})
}

export const FindMenu = async data => {
	return findMyMenuPermissionByMenuId(data)
}
export const Signlogin = async data => {
	return signlogin(data)
}
export const Signlogout = async data => {
	return signlogout(data)
}
export const GetCheckCode = async data => {
	return getCheckCode(data)
}
export const InitPwd = async data => {
	return initPwd(data)
}
