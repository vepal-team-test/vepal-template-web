<template>
	<div class="header-tool">
		<!-- <div v-show="data.routeName === 'AddNeed'" class="add-need">
			<i class="el-icon-back add-i" @click="back"></i>
			<span style="line-height: 60px; font-size: 19px; font-weight: 800">{{ title }}</span>
		</div> -->
		<div class="icon-item">
			<span class="tool-item">
				<img :src="data.user.pictureBase64" style="border: solid 1px #d1d1f1" />
				欢迎您，{{ data.user.userName }}
			</span>
			<div class="exit">
				<SwitchButton style="height: 28px; position: absolute; top: -8px" />
			</div>
		</div>
	</div>
	<div class="line"></div>
</template>
<script setup>
import { onMounted, computed, reactive, toRaw, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

const router = useRouter()
const route = useRoute()
const store = useStore()
// const back = () => {
// 	router.go(-1)
// }
const data = reactive({
	// routeName: '',
	user: computed(() => store.state.userInfo)
})

// onMounted(async () => {
// 	data.routeName = toRaw(route.name)
// })
</script>
<style scoped="scoped">
.header-tool {
	display: flex;
	justify-content: flex-end;
	width: 97%;
	height: 100%;
	color: #1f263e;
}
.add-need {
	display: flex;
}
.add-i {
	height: 100%;
	width: 50px;
	line-height: 60px;
	font-size: 23px;
	text-align: start;
}
.el-menu-demo {
	width: 70%;
}
.exit {
	position: relative;
	display: inline-block;
	width: 80px;
	height: 18px;
	font-size: 22px;
	line-height: 18px;
	border-left: 2px solid #cdd0da;
	margin-left: 20px;
	bottom: 5px;
}

.header-tool span {
	margin-left: 10px;
	cursor: pointer;
}
.item {
	margin: 0 10px;
}
.header-logo a {
	text-decoration: none;
	color: #fff;
}
.el-steps {
	width: 50%;
	margin: 20px;
}
.tool-item {
	align-items: center;
	display: inline-flex;
}
.tool-item img {
	width: 32px;
	height: 32px;
	border-radius: 50%;
	background: #fff;
	margin-right: 20px;
}
.icon-item {
	margin-top: 16px;
	float: left;
}
.el-menu-item {
	font-size: 19px;
	font-weight: 800;
}
</style>
