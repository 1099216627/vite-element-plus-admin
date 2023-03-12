import { createApp } from "vue";
import App from "./App.vue";
// tailwindcss
import "tailwindcss/tailwind.css";
// style
import "@/styles/index.scss";
import "@/assets/fonts/iconfont.scss";
// element plus
import ElementPlus from "element-plus";
// element css
import "element-plus/dist/index.css";
// element dark(内置暗黑模式)
import "element-plus/theme-chalk/dark/css-vars.css";
// normalize
import "normalize.css";
// svg
import "virtual:svg-icons-register";
// i18n
import { setupI18n } from "./langs";
import { setupStore } from "@/store";
import { setupRouter } from "@/router";
import { setupDirectives } from "./directives";
import zhCn from "element-plus/es/locale/lang/zh-cn";
function bootstrap() {
	const app = createApp(App);
	// pinia
	setupStore(app);
	//router
	setupRouter(app);
	// element plus
	app.use(ElementPlus, {
		locale: zhCn
	});
	// i18n
	setupI18n(app);
	// directives
	setupDirectives(app);

	app.mount("#app");
}

bootstrap();
