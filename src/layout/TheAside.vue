<template>
	<el-col :span="12">
		<el-menu
			:uniqueOpened="true"
			:default-active="activeMenu"
			class="el-menu-vertical-demo aside-menu"
			@open="handleOpenUrl"
			active-text-color="#409eff"
		>
			<div class="menu-box">
				<div class="menu-right">
					Vepal Cli
					<span style="font-size: 16px">V1.0.0</span>
				</div>
			</div>
			<div v-for="(item, index) in menuList" :key="item.permissionId">
				<el-menu-item
					v-if="!(item.children && item.children.length)"
					:index="item.permissionId"
					@click="handleItemRouterClick(item, index)"
				>
					<el-icon v-if="item.var1" :class="item.var1"></el-icon>
					<template #title>{{ item.permissionName }}</template>
				</el-menu-item>
				<el-submenu v-else :index="item.permissionId">
					<template #title>
						<el-icon v-if="item.var1" :class="item.var1"></el-icon>
						<span>{{ item.permissionName }}</span>
					</template>

					<el-menu-item-group>
						<div v-for="(child, cdex) in item.children" :key="child.permissionId">
							<el-menu-item :index="child.permissionId" @click="handleItemRouterClick(child, cdex)">
								{{ child.permissionName }}
							</el-menu-item>
						</div>
					</el-menu-item-group>
				</el-submenu>
			</div>
		</el-menu>
	</el-col>
</template>
<script setup>
import { onMounted, onUpdated, ref, reactive, toRaw, computed, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
const activeMenu = ref('0')
const router = useRouter()
const route = useRoute()
const routeName = toRaw(route.name)
const store = useStore()
// const data = reactive({
// 	menuList: computed(() => store.state.menuList)
// })
const menuList = computed(() => store.state.menuList)

onUpdated(async () => {
	console.log(menuList)
	menuList.forEach(item => {
		if (item.permissionUrl === routeName) activeMenu.value = item.permissionId
		else {
			if (Array.isArray(item.children) && item.children.length) {
				item.children.forEach(cm => {
					if (cm.permissionUrl === routeName) activeMenu.value = cm.permissionId
				})
			}
		}
	})
})

const handleItemRouterClick = (item, index) => {
	activeMenu.value = item.permissionId
	if (routeName === item.permissionUrl) {
		router.replace({
			name: item.permissionUrl
		})
	} else {
		router.push({
			name: item.permissionUrl
		})
	}
}
const handleOpenUrl = index => {
	// 点击左侧父级菜单,默认展示第一个
	let arr = store.state.menuList.filter(item => {
		return item.permissionId === index
	})[0] // 按id查找到url数组
	if (Array.isArray(arr.children) && arr.children.length) {
		activeMenu.value = arr.children[0].permissionId
		// 判断有没有子集
		router.push({
			name: arr.children[0].permissionUrl
		})
	}
}
</script>
<style scoped>
.menu-box {
	height: 10%;
	width: 100%;
	color: #222;
	display: flex;
	justify-content: center;
	margin-top: 20px;
}
.menu-right {
	display: flex;
	flex-direction: column;
	font-size: 22px;
	height: 40px;
	margin-left: 10px;
}

.el-col {
	width: 100%;
	height: 100%;
	max-width: 100%;
}
.el-col-12 {
	width: 100% !important;
	height: 100%;
}
</style>
<style>
.el-aside .el-menu {
	width: 100%;
	height: 100%;
	border-right: 0;
	background: linear-gradient(180deg, #fff9f5, #f8d3ff 54%, #c0dcff);
}
.el-submenu .el-menu {
	border: none;
	background: none;
}
</style>
