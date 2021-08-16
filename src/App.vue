<template>
	<div id="app">
		<router-view />
	</div>
</template>

<script setup>
import { useStore } from 'vuex'
const store = useStore()
store.dispatch('renewUserInfo')
store.dispatch('renewMenuList')
</script>
<style>
html,
body {
	height: 100%;
	width: 100%;
	margin: 0;
}
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	height: 100%;
	width: 100%;
}
</style>
