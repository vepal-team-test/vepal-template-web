import { createStore } from 'vuex'
import * as mutationTypes from './mutation-type'
import * as state from './states'
import * as getters from './getters'
import mutations from './mutations'
import * as actions from './actions'

// 创建一个新的 store 实例
const store = createStore({
	state: {
		isAdmin: true,
		userInfo: {},
		menuList: []
	},
	getters,
	mutations,
	actions
})

export default store
