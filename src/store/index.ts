import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { App } from "vue";

export function setupStore(app: App) {
	const pinia = createPinia();
	app.use(pinia);
	pinia.use(piniaPluginPersistedstate);
}
