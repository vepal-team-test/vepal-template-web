/** Vue Router3.x版本 */
import { createRouter, createWebHistory } from 'vue-router'
import setting from '@/pages/project-setting/index.vue'
import projectList from '@/pages/project-list/index.vue'
import projectDetail from '@/pages/project-list/detaile.vue'
import dataList from '@/pages/project-list/datalist.vue'
import index from '@/layout/basic.vue'

const routes = [
	{
		path: '/',
		redirect: '/index'
	},
	{
		path: '/index',
		name: 'Index',
		component: index,
		children: [
			{
				path: '/index/',
				redirect: 'ProjectList'
			},
			{
				path: '/ProjectList',
				name: 'ProjectList',
				component: projectList
			},
			{
				path: '/DataList',
				name: 'DataList',
				component: dataList
			},
			{
				path: '/Setting',
				name: 'Setting',
				component: setting
			}
		]
	}
]

const history = createWebHistory()
export const router = createRouter({
	history,
	routes
})
