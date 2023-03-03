import { PersistedStateOptions } from "pinia-plugin-persistedstate";
function setPersisted(key: string, paths?: string[]) {
	const persist: PersistedStateOptions = {
		key,
		storage: localStorage,
		// storage: sessionStorage,
		paths
	};
	return persist;
}
export default setPersisted;
