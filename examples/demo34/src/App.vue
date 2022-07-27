<template>
	<div id="app">
		<h1>role: {{ role }}</h1>
		<h1>uuid: {{ uuid }}</h1>
		<p>
			<!--使用 router-link 组件进行导航 -->
			<!--通过传递 `to` 来指定链接 -->
			<!--`<router-link>` 将呈现一个带有正确 `href` 属性的 `<a>` 标签-->
			<router-link to="/">Go to Home</router-link>
			<router-link to="/login">Go to Login</router-link>
			<router-link to="/logout">Go to Logout</router-link>
		</p>
		<!-- 路由出口 -->
		<!-- 路由匹配到的组件将渲染在这里 -->
		<router-view></router-view>
	</div>
</template>

<script>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useStore } from "vuex";
import { setNavigationBarTitle } from "kbone-api";

export default {
	components: {},
	setup() {
		const title = ref("Vue App");
		const { role, uuid } = useStore().getters;

		console.log(role);
		console.log(uuid);

		setNavigationBarTitle({
			title: title.value
		});

		onMounted(() => {
			console.log("page1 mounted");
		});

		onUnmounted(() => {
			console.log("page1 unmounted");
		});

		return {
			title,
			role: computed(() => role),
			uuid: computed(() => uuid)
		};
	}
};
</script>

<style>
.cnt {
	margin-top: 20px;
}
a,
button {
	display: block;
	width: 100%;
	height: 30px;
	line-height: 30px;
	text-align: center;
	font-size: 20px;
	border: 1px solid #ddd;
}
</style>
