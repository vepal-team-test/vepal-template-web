import * as mutationTypes from './mutation-type'

export default {
	[mutationTypes.IS_ADMIN](state, bool) {
		state.isAdmin = bool
	},
	[mutationTypes.USER_INFO](state, info) {
		state.userInfo = info
	},
	[mutationTypes.MENU_LIST](state, menuList) {
		state.menuList = menuList
	}
}
