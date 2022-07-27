import { createApp as create } from "vue";
import App from "./App.vue";
import store from "@store/index";
import router from "@router/index";

export default function createApp() {
	const container = document.createElement("div");
	container.id = "app";
	document.body.appendChild(container);

	const app = create(App);

	app.use(store);
	app.use(router);

	app.mount("#app");

	return app;
}
