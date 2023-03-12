import Cookies from "js-cookie";

export function useCookies() {
	const get = (key: string) => Cookies.get(key);
	const set = (key: string, value: string) => Cookies.set(key, value);
	const remove = (key: string) => Cookies.remove(key);
	return {
		get,
		set,
		remove
	};
}
