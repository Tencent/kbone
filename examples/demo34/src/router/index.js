import { createRouter, createWebHistory } from "vue-router";
import PageHome from "@pages/Home.vue";
import PageLogin from "@pages/Login.vue";
import PageLogout from "@pages/Logout.vue";

const routes = [
	{ path: "/", component: PageHome },
	{ path: "/login", component: PageLogin },
	{ path: "/logout", component: PageLogout }
];

export default createRouter({
	history: createWebHistory(),
	routes
});
