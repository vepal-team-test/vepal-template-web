import * as mutationTypes from './mutation-type'
import { FindUserByUserId, FindMenu } from '../common/actions/userActions'
export const renewUserInfo = async ({ commit }, data) => {
	let res = await FindUserByUserId(data)
	let { userInfo, isAdmin } = res
	commit(mutationTypes.IS_ADMIN, isAdmin)
	commit(mutationTypes.USER_INFO, userInfo)
}
export const renewMenuList = async ({ commit }, data) => {
	let res = await FindMenu()
	commit(mutationTypes.MENU_LIST, res)
}
// export const renewUserInfo = ({ commit }, data) => {
// 	let res = FindUserByUserId(data)
// 	let { userInfo, isAdmin } = res
// 	commit(mutationTypes.IS_ADMIN, isAdmin)
// 	commit(mutationTypes.USER_INFO, userInfo)
// }
