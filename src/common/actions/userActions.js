import { findUserByUserId, findMyMenuPermissionByMenuId } from '@/common/tools/api'

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
