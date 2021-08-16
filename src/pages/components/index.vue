<template>
	<el-container class="fourth">
		<el-header class="fourth-nav">
			<el-select
				style="width: 200px; margin-right: 14px"
				v-model="templateInput"
				filterable
				clearable
				size="small"
				placeholder="请选择业务线"
			>
				<el-option v-for="item in businessLine" :key="item.id" :label="item.serviceLine" :value="item.id"></el-option>
			</el-select>
			<el-button type="primary" size="small" icon="el-icon-search" @click="createdList">搜索</el-button>
			<el-button size="small" type="primary" @click="handelAdded">新增</el-button>
		</el-header>
		<el-main>
			<el-table :data="arrData" height="100%" :border="true">
				<el-table-column prop="talentType" label="分类名称"></el-table-column>
				<el-table-column prop="serviceLine" label="归属业务线"></el-table-column>
				<el-table-column label="对应指标">
					<template slot-scope="scope">
						<span class="title-item" v-for="(item, index) in scope.row.talentTargetList" :key="index">
							{{ item.targetName }}
						</span>
					</template>
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button size="mini" @click="handleEdit(scope.row)">修改</el-button>
						<el-button size="mini" @click="handleDelete(scope.row)">删除</el-button>
						<el-button size="mini" @click="download(scope.row)">下载</el-button>
						<el-button size="mini" @click="importScore(scope.row)">导入</el-button>
						<input ref="inputFile" v-show="false" type="file" @change="handleFileChange" />
					</template>
				</el-table-column>
			</el-table>
		</el-main>
		<el-dialog title="导入" :visible.sync="importScoreVisible">
			<el-form ref="importForm" :model="importForm" v-loading="uploadLoading">
				<el-form-item size="选择文件">
					<div class="import-file" @click="handleImportFile">
						<i class="el-icon-upload2"></i>
					</div>
				</el-form-item>
			</el-form>
		</el-dialog>
		<el-dialog
			:title="flag ? '修改人员分类' : '新增人员分类'"
			:visible.sync="dialogVisible"
			width="80%"
			class="TemplateDialog"
		>
			<el-form v-if="!flag">
				<el-form-item style="margin-bottom: 0" label="人员分类名称" label-width="110px">
					<el-input
						size="small"
						style="width: 200px; margin-right: 5px"
						v-model="typeName"
						placeholder="请输入人员分类名称"
						clearable
					></el-input>
				</el-form-item>
			</el-form>
			<el-tabs v-model="activeName" @tab-click="handleClick">
				<el-tab-pane
					v-for="(item, index) in businessLine"
					:key="index"
					:label="item.serviceLine"
					:name="'name' + item.id"
				>
					<el-collapse v-model="activeNames">
						<el-collapse-item v-for="(item, index) in allData" :key="index" :title="item.targetName" :name="index + 1">
							<span
								v-for="(it, v) in item.talentTargetList"
								:key="v"
								class="button"
								:class="it.flag ? 'active' : ''"
								@click="handlPush(it)"
							>
								{{ it.targetName }}
							</span>
						</el-collapse-item>
					</el-collapse>
				</el-tab-pane>
			</el-tabs>

			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="handelConfirm">确 定</el-button>
			</span>
		</el-dialog>
	</el-container>
</template>

<script>
import vuedraggable from 'vuedraggable'
import * as api from '@/config/api'
import formAxios from '@/assets/js/formdata'
import * as util from '@/assets/js/util'
// import { exportTable } from "@/assets/js/axioshttp.js";
import { Base64 } from 'js-base64'
import Bus from '@/assets/js/bus'
export default {
	components: { vuedraggable },
	props: {},
	data() {
		return {
			templateInput: '', // 分类名称搜索
			typeName: '', // 人员分类名称
			pageSize: 10, // 每页几几条数据
			pageNum: 1, // 当前页码
			arr: [], // 选中的模板条数
			dialogAmend: false, // 保存模板名称弹框
			flag: false, // 判断是保存还是修改
			dialogVisible: false, // 字段详情弹框
			activeNames: [1], // 下拉框索引
			arrList: [],
			allData: [], // 保存所有字段
			arrData: [], // 保存当前模板
			userid: null, // 保存当前用户id
			isValue: '', // 保存的字段id
			id: null,
			total: 10,
			businessLine: [],
			activeName: '',
			activeId: '',
			importScoreVisible: false,
			importForm: {
				fileType: 1
			},
			uploadLoading: false,
			targetNamesStr: ''
		}
	},
	mounted() {
		this.createdList() // 获取人员分类列表
		this.getBusinessLine() // 获取业务线
		Bus.$on('getTypeByLine', this.createdList)
	},
	methods: {
		// 获取业务线
		getBusinessLine() {
			this.axios.get('/api/hrmc/talentTarget/getServiceLineAll').then(res => {
				console.log(res)
				if (res.data.code === 200) {
					this.businessLine = res.data.data
					this.activeId = this.businessLine[0].id
					this.activeName = 'name' + this.activeId
					this.createdData(this.activeId) // 获取第一个业务线下的指标数据
				}
			})
		},
		// 切换业务线更换指标
		handleClick(tab) {
			this.activeId = this.businessLine[tab.index].id
			this.createdData(this.businessLine[tab.index].id)
			this.reset()
		},
		// 根据业务线获取指标
		createdData(lineId) {
			return this.axios.get('/api/hrmc/talentTarget/getByLineId', { params: { lineId } }).then(res => {
				if (res.data.code === 200) {
					let resList = res.data.data
					resList.forEach(item => {
						item.talentTargetList.forEach((it, v) => {
							it.flag = false
						})
					})
					this.allData = resList
				}
			})
		},
		handleImportFile(row) {
			this.$refs['importForm'].validate(valid => {
				if (valid) {
					this.$refs['inputFile'].click(row)
				}
			})
		},
		importScore(row) {
			this.importScoreVisible = true
			let str = ''
			row.talentTargetList.forEach(item => {
				str = str + ',' + item.targetName
			})
			this.targetNamesStr = str.substr(1)
		},
		handleFileChange(file) {
			let files = event.target.files
			if (files && files.length) {
				this.uploadLoading = true
				let tmpFile = files[0]
				let formData = new FormData()
				formData.append('file', tmpFile) // 调用后端接口fmc
				formData.append('fileType', this.importForm.fileType)
				formData.append('targetNames', this.targetNamesStr)
				this.$formHttp.post(api.HRMC_importScore, formData).then(res => {
					if (res.data.code === 200) {
						this.importScoreVisible = false
					}
					this.uploadLoading = false
					this.$refs.inputFile.value = ''
					this.$message({
						message: res.data.msg,
						type: res.data.code === 200 ? 'success' : 'error'
					})
				})
			}
		},
		// 获取人员分类列表
		createdList() {
			this.axios
				.get('/api/hrmc/talentTarget/getTalentTypeByLineId', {
					params: this.templateInput
						? {
								lineId: this.templateInput
						  }
						: null
				})
				.then(res => {
					if (res.data.code === 200) {
						this.arrData = res.data.data
					} else {
					}
				})
		},
		// 新增
		handelAdded() {
			this.getBusinessLine() // 获取业务线
			this.reset() // 清除高亮
			this.typeName = ''
			this.flag = false
			this.dialogVisible = true
		},
		reset() {
			// 清除所有高亮
			this.arr = [] // 重置选择
			this.allData.forEach((item, index) => {
				item.talentTargetList.forEach((it, v) => {
					it.flag = false
				})
			})
		},
		download(row) {
			let data = [{}]
			for (let k in row[0]) {
				data[0][k] = k
			}
			data = data.concat(rs)
			this.downloadExl(data, '菜单')

			let str = ''
			row.talentTargetList.forEach(item => {
				str = str + ',' + item.targetName
			})
			this.targetNamesStr = str.substr(1)
			let url = '/api/hrmc/talentTarget/getTalentTypeExcel'
			let data = {
				targetNames: JSON.stringify(this.targetNamesStr)
			}
			let fileName = row.serviceLine
			this.exportTable(url, data, fileName)
		},
		exportTable(url, data, fileName) {
			return this.axios
				.get(
					url,
					{ params: data },
					{
						responseType: 'blob'
					}
				)
				.then(res => {
					console.log(res, 'res')
					if (res.status === 200) {
						try {
							let url = Window.URL.createObjectURL(res.data)

							console.log(url)
						} catch (err) {
							console.log(err)
						}
					}
				})
				.catch(res => {
					this.$message.error('下载失败')
				})
		},
		// 模板详情
		handleEdit(row) {
			this.reset() // 清除高亮
			this.flag = true
			this.dialogVisible = true
			this.typeName = row.talentType
			this.activeName = 'name' + row.serviceId
			this.activeId = row.serviceId

			this.createdData(this.activeId).then(res => {
				let set = new Set()

				if (Array.isArray(row.talentTargetList)) {
					row.talentTargetList.forEach((item, index) => {
						set.add(item.id)
					})
				}
				this.allData.forEach((item, index) => {
					item.talentTargetList.forEach((it, v) => {
						console.log(it.id)
						if (set.has(it.id)) {
							it.flag = true
							this.arr.push(it)
						}
					})
				})
			})
		},
		// 弹窗确定按钮
		handelConfirm() {
			if (!this.typeName) {
				this.$message.warning('请填写人员类别名称')
				return
			}
			this.dialogAmend = false
			this.dialogVisible = false
			let params = []
			this.arr.forEach((item, index) => {
				params.push({
					serviceId: this.activeId,
					talentType: this.typeName,
					targetId: item.id
				})
			})
			this.axios.post('/api/hrmc/talentTarget/addTalentType', params).then(res => {
				if (res.data.code === 200) {
					this.createdList()
					this.$message({
						message: res.data.msg,
						type: 'success'
					})
				} else {
				}
			})
		},
		// 删除模板
		handleDelete(row) {
			this.$confirm('确认删除吗?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					let params = {
						talentType: row.talentType
					}
					this.axios.delete('/api/hrmc/talentTarget/delByTalentType', { params }).then(res => {
						if (res.data.code === 200) {
							this.createdList()
							this.$message({
								type: 'success',
								message: res.data.msg
							})
						} else {
							this.$message({
								message: res.data.msg
							})
						}
					})
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					})
				})
		},
		// 添加字段
		handlPush(item) {
			if (item.flag === false) {
				item.flag = true
				this.arr.push(item)
			} else {
				for (let i = 0; i < this.arr.length; i++) {
					if (this.arr[i].id === item.id) {
						this.arr.splice(i, 1)
					}
				}
				item.flag = false
			}
		}
	}
}
</script>
<style scoped>
.el-main {
	padding-top: 0;
}
.title-item {
	display: inline-block;
	line-height: 15px;
	font-size: 14px;
	font-weight: 400;
	background-color: #f1f1f1;
	padding: 6px;
	margin-right: 6px;
	white-space: nowrap;
	border-radius: 4px;
}
.fourth >>> .el-dialog__title {
	font-size: 30px;
	font-weight: 600;
}
.fourth >>> .el-icon-close {
	font-size: 40px;
}
.fourth >>> .cell {
	text-align: center;
}
.fourth {
	height: calc(100vh - 130px);
	background: rgb(245, 246, 248);
}
.fourth_nav {
	width: 100%;
}
.main_button {
	width: 100%;
	height: auto;
}
.main_buttons {
	width: 100%;
	height: auto;
}
.button {
	border-radius: 5px;
	min-width: 100px;
	display: inline-block;
	height: 30px;
	/* float: left; */
	margin-left: 5px;
	margin-top: 5px;
	text-align: center;
	line-height: 30px;
	border: 1px solid #ccc;
	background: #f8f8f8;
	cursor: pointer;
}
.active {
	background: #1525b9;
	border: 1px solid #1525b9;
	color: #fff;
}
.actives {
	background: #f8f8f8;
	border: 1px solid #ccc;
}
.fourth >>> .el-collapse-item__header {
	font-size: 20px;
	font-weight: 700;
}
.fourth-nav {
	display: flex;
	width: 100%;
	align-items: center;
	font-size: 24px;
	font-weight: 500;
	margin-left: 10px;
}
.fourth-bottom {
	width: 100%;
	height: 48px;
	background: rgb(218, 218, 218);
}
/* .TemplateDialog{
  position: relative;
} */
.TemplateDialogBtn {
	position: absolute;
	top: 20px;
	right: 100px;
}
.fourth-h1 {
	font-size: 20px;
}
.hourth-p {
	width: 100%;
	font-size: 16px;
	height: auto;
}
.hourth-main {
	width: 100%;
	height: auto;
}
</style>
