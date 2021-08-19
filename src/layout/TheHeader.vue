<template>
	<div class="header-tool">
		<!-- <div v-show="data.routeName === 'AddNeed'" class="add-need">
			<i class="el-icon-back add-i" @click="back"></i>
			<span style="line-height: 60px; font-size: 19px; font-weight: 800">{{ title }}</span>
		</div> -->
		<div class="icon-item">
			<span class="tool-item">
				<img
					:src="data.user.userName ? data.user.pictureBase64 : '../../public/VEPAL.ico'"
					style="border: solid 1px #d1d1f1"
				/>
				欢迎您{{ data.user.userName ? '，' + data.user.userName : '' }}
			</span>
			<div class="exit" @click="login">
				<SwitchButton style="height: 28px; position: absolute; top: -8px" />
			</div>
		</div>
	</div>

	<div class="form-box">
		<el-dialog v-model="centerDialogVisible" v-loading="form.loading" width="30%" center>
			<el-form :model="ruleForm" status-icon ref="ruleForm" class="demo-ruleForm">
				<el-form-item>
					<i class="el-icon-postcard" style="font-size: 1.5rem; line-height: 40px; width: 2.5rem"></i>
					<span style="font-size: 1.5rem; line-height: 43px; color: silver">|</span>
					<el-input v-model="form.name"></el-input>
				</el-form-item>
				<el-form-item>
					<i class="el-icon-unlock" style="font-size: 1.5rem; line-height: 40px; width: 2.5rem"></i>
					<span style="font-size: 1.5rem; line-height: 43px; color: silver">|</span>
					<el-input type="password" v-model="form.pass" autocomplete="off"></el-input>
				</el-form-item>
				<!-- <span @click="forgotPass">忘记密码？</span> -->
			</el-form>
			<template #footer>
				<span>
					<el-button @click="dowload">登录</el-button>
				</span>
			</template>
		</el-dialog>
	</div>

	<div class="line"></div>
</template>
<script setup>
import { onMounted, computed, reactive, toRaw, ref, h } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import * as util from '@/common/js/util'
import { SwitchButton } from '@element-plus/icons'
import { ElMessage } from 'element-plus'
import { Base64 } from 'js-base64'
import Login from './component/login.vue'
import { Signlogin, Signlogout, GetCheckCode, InitPwd } from '@/common/actions/userActions'

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
const form = reactive({
	loading: false,
	name: '',
	pass: ''
})
const centerDialogVisible = ref(false)
/**
 * @description: 提交表单校验登录
 */
const dowload = async event => {
	console.log(form.name, form.pass)
	if (form.name && form.pass) {
		// let loading = Loading.service({
		// 	target: this.$refs['loginCard']
		// })
		form.loading = true
		let _data = {
			loginName: form.name,
			password: util.Encrypt(form.pass)
		}
		let res = await Signlogin(_data)
		// this.setUserLoginState(res.data.code === 200)
		if (res.code === 200) {
			centerDialogVisible.value = false
			// setUserInfo(res)
			let response = res.data
			if (response.uroles && Array.isArray(response.uroles) && response.uroles.length) {
				store.dispatch('setUserInfo', response)
				store.dispatch('renewMenuList')
				let isAdmin = false
				for (var item of response.roles) {
					if (item.roleName === '需求系统管理员') {
						isAdmin = true
					}
				}
				store.dispatch('setIsAdmin', isAdmin)
			} else {
				ElMessage.warning('请联系管理员为您添加角色')
			}
			window.localStorage.setItem('token', response.token)
			let obj = {
				userName: response.userName,
				id: response.userId,
				userNumber: response.userNumber
			}
			util.setCookie('id', Base64.encode(response.userId))
			util.setCookie('pd', Base64.encode(form.pass))
			util.setCookie('email', response.email)
			window.localStorage.setItem('info', JSON.stringify(obj))
			if (response.firstLogin) {
				util.setCookie('firstLogin', Base64.encode(response.firstLogin))
			}
			form.loading = false
		} else {
			ElMessage.error(res.message)
		}
	} else {
		ElMessage.error('请先输入工号及密码')
	}
}

const loginOut = () => {
	if (data.user.userName) {
		let _data = {
			userName: data.user.userName,
			userId: data.user.userId
		}
		Signlogout(_data).then(res => {
			localStorage.clear()
			util.delCookie('token')
			util.delCookie('id')
			if (util.getCookie('firstLogin')) {
				util.delCookie('firstLogin')
			}
			ElMessage({
				message: res.msg,
				type: res.code === 200 ? 'success' : 'error'
			})
		})
		store.dispatch('setUserInfo', {})
		store.dispatch('setMenuList', [])
	}
}

// onMounted(async () => {
// 	data.routeName = toRaw(route.name)
// })
const login = () => {
	console.log(data.user)
	if (data.user.userName) {
		return loginOut()
	}
	form.name = ''
	form.pass = ''
	centerDialogVisible.value = true
}
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

.demo-ruleForm {
	width: 80%;
	margin: 10px auto;
}
.el-dialog__header {
	background: linear-gradient(0.25turn, #c0dcff, #f8d3ff 54%, #fff9f5);
	height: 1rem;
}
.form-box .el-button {
	background-color: #c0dcff;
	border: 0;
	width: 60%;
	color: currentColor;
}
.form-box .el-dialog--center .el-dialog__body {
	padding-bottom: 0;
}
.el-form-item {
	display: flex;
	font-size: 1.5rem;
}
.el-form-item__content {
	display: flex;
	border-bottom: 1px solid silver;
	padding: 0 10px 2px;
}
.el-form-item .el-input__inner {
	border: 0;
	height: 36px;
}

.el-form-item .el-input__inner::before {
	content: '-';
	width: 1px;
	border: 1px solid silver;
	height: 36px;
}
</style>
