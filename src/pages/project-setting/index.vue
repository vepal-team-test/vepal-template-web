<template>
	<el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
		<el-menu-item v-for="(item, index) in setMenu" :key="index" :index="index">{{ item.label }}</el-menu-item>
	</el-menu>

	<div class="line"></div>
	<div>
		<el-button
			v-if="data.admin"
			type="primary"
			@click="add()"
			size="medium"
			style="margin-bottom: 10px; float: right; background-color: #2bccb5; border: 0"
		>
			新增
		</el-button>
		<div class="list-tab" style="background-color: #f6f6f7">
			<el-table :data="data.tableData" border style="width: 100%">
				<el-table-column label="序号" align="center" type="index" width="300"></el-table-column>
				<el-table-column
					v-for="(item, index) in data.tableColum"
					:key="index"
					:prop="item.prop"
					:label="item.label"
					:width="item.width"
					align="center"
				>
					<template v-if="item.canEdit" #default="scope">
						<el-input
							v-if="scope.row.edit || scope.row.add"
							:placeholder="data.placeholder"
							v-model="scope.row[item.prop]"
						></el-input>
						<span v-else>{{ scope.row[item.prop] }}</span>
					</template>
				</el-table-column>

				<el-table-column label="操作" align="center">
					<template v-if="data.admin" #default="scope">
						<div v-if="scope.row.edit">
							<el-button size="mini" @click="cancle(scope.row)">取消</el-button>
							<el-button size="mini" type="primary" @click="over(scope.row)">完成</el-button>
						</div>

						<div v-else-if="scope.row.add">
							<el-button size="mini" @click="cancleAdd(scope.row)">取消</el-button>
							<el-button size="mini" type="primary" @click="preservation(scope.row)">保存</el-button>
						</div>

						<div class="edit" v-else>
							<Edit style="width: 1em; height: 1em; margin-right: 8px" @click="handleDetail(scope.row)" />
							<Delete
								style="width: 1em; height: 1em; margin-right: 8px"
								@click="handleDelete(scope.$index, scope.row)"
							/>
							<!-- <i class="el-icon-edit-outline zc-btn" @click="handleDetail(scope.row)"></i>
							<i @click="handleDelete(scope.$index, scope.row)" class="el-icon-delete"></i> -->
						</div>
					</template>
					<template v-else #default="scope"><span>——</span></template>
				</el-table-column>
			</el-table>
		</div>
	</div>
</template>

<script setup>
import { reactive, ref, onMounted, computed } from 'vue'
import { Edit, Delete } from '@element-plus/icons'
import { useStore } from 'vuex'

const store = useStore()
const activeIndex = ref('0')
const setMenu = reactive([
	{ label: '字段1', prop: 'target' },
	{ label: '字段2', prop: 'target1' },
	{ label: '字段3', prop: 'target2' }
])
let data = reactive({
	tableData: [{ target: '模拟字段1', target1: '模拟字段2', target2: '模拟字段3' }],
	tableColum: [
		{
			prop: 'target',
			label: '字段1',
			width: '600',
			canEdit: 'true'
		}
	],
	value: '',
	admin: false,
	placeholder: '请输入字段1名称'
})
const handleSelect = (key, keyPath) => {
	data.tableColum[0].prop = setMenu[key].prop
	data.tableColum[0].label = setMenu[key].label
	data.placeholder = '请输入' + setMenu[key].label + '名称'
}
onMounted(async () => {
	// data.tableData = await GetDictByType('needStatus')  此处获取数据并赋值给 tableData
	let isAdmin = computed(() => store.state.isAdmin)
	data.admin = isAdmin
})

let a = ''

const add = () => {
	data.tableData.push({ add: true })
}
const cancleAdd = row => {
	data.tableData.pop()
	row.add = false
}
const preservation = row => {
	AddDict({
		dictName: row.dictName,
		dictType: data.value
	})
	row.add = false
}
const cancle = row => {
	row.dictName = a
	row.edit = false
}
const over = row => {
	if (a !== row.dictName) {
		// UpdateDict(row)
	}
	row.edit = false
}
const handleDetail = row => {
	a = row.dictName
	row.edit = true
}

const handleDelete = (index, row) => {
	// DelDict({
	// 	dictId: row.dictId
	// })
	data.tableData.splice(index, 1)
}
</script>

<style scoped="scoped">
.edit i {
	width: 50px;
	height: 20px;
	font-size: 18px;
}
.el-menu-demo {
	position: fixed;
	width: 50%;
	height: 60px;
	top: 0;
}
</style>
