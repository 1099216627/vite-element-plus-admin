import { reactive, toRefs } from "vue";
import { defineStore } from "pinia";

interface AppState {
	dynamicRouteAdded: boolean;
	menuList: any[];
	permissions: any[];
	keepAliveList: string[];
}

export const useAppStore = defineStore("app", () => {
	let state = reactive<AppState>({
		dynamicRouteAdded: false, //动态路由是否已添加
		menuList: [], //菜单列表
		permissions: [], //权限列表
		keepAliveList: [] //缓存列表
	});

	function setDynamicRouteAdded(value: boolean) {
		state.dynamicRouteAdded = value;
	}

	function setKeepAliveList(value: string[]) {
		state.keepAliveList.splice(0, state.keepAliveList.length, ...value);
	}

	function getMenusByUser() {
		return [
			{
				name: "Dashboard",
				path: "/dashboard",
				meta: {
					title: "首页",
					icon: "iconfont icon-home"
				}
			},
			{
				name: "About",
				path: "/about",
				meta: {
					title: "关于",
					icon: "iconfont icon-about"
				}
			}
		];
	}

	return {
		...toRefs(state),
		getMenusByUser,
		setDynamicRouteAdded,
		setKeepAliveList
	};
});
