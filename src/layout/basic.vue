<template>
	<el-container class="main">
		<el-aside width="auto" style="width: 14%">
			<c-aside></c-aside>
		</el-aside>
		<el-container>
			<el-header>
				<c-header />
			</el-header>
			<el-main class="center">
				<div class="main-box">
					<router-view class="routerV"></router-view>
				</div>
			</el-main>
		</el-container>
	</el-container>
</template>
<script setup>
import CAside from './TheAside.vue'
import CHeader from './TheHeader.vue'
</script>
<style>
.main {
	width: 100%;
	height: 100%;
}
.aside {
	width: 20%;
	background: linear-gradient(180deg, #fff9f5, #f8d3ff 54%, #dce9f7);
	height: 100%;
}
.center {
	background-color: #f6f6f7;
}
.main-box {
	background-color: aliceblue;
	height: 100%;
	width: 100%;
}
</style>
