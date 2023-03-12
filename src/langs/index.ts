import { createI18n } from "vue-i18n";
import zh from "./modules/zh";
import en from "./modules/en";
import { App } from "vue";

const i18n = createI18n({
	legacy: false, // 如果要支持 compositionAPI，此项必须设置为 false
	locale: "zh", // 设置语言类型
	globalInjection: true, // 全局注册$t方法
	messages: {
		zh,
		en
	}
});

export function setupI18n(app: App) {
	app.use(i18n);
}

export default i18n;
