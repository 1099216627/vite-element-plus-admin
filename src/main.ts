import { createApp } from "vue";
import App from "./App.vue";
// element plus
import ElementPlus from "element-plus";
// element icons
import * as Icons from "@element-plus/icons-vue";
// element css
import "element-plus/dist/index.css";
// element dark(内置暗黑模式)
import "element-plus/theme-chalk/dark/css-vars.css";
import { setupStore } from "@/store";
import { setupRouter } from "@/router";
function bootstrap() {
	const app = createApp(App);
	// pinia
	setupStore(app);
	//router
	setupRouter(app);
	// element plus
	app.use(ElementPlus);
	// 注册element Icons组件
	Object.keys(Icons).forEach(key => {
		app.component(key, Icons[key as keyof typeof Icons]);
	});
	app.mount("#app");
}

bootstrap();
