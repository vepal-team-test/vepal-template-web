<template></template>

<script setup>
import { reactive, ref } from 'vue'

const form = reactive({
	name: '',
	pass: ''
})
const centerDialogVisible = ref(true)
</script>

<style>
.demo-ruleForm {
	width: 80%;
	margin: 0 auto;
}
.el-dialog__header {
	background: linear-gradient(0.25turn, #c0dcff, #f8d3ff 54%, #fff9f5);
	height: 1rem;
}
.form-box .el-button {
	background-color: #f8d3ff;
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
