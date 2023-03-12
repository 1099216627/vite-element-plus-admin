import { reactive, toRefs } from "vue";
import { defineStore } from "pinia";
import { getUserMenusApi } from "@/api/modules/menu";
import { ResultEnum } from "@/enums/http-enum";
import { ComponentSizeEnum } from "@/enums/common-enum";
import setPersisted from "../persisted";
import router from "@/router";

interface AppState {
	dynamicRouteAdded: boolean;
	menuList: any[];
	originMenuList: any[];
	permissions: any[];
	keepAliveList: string[];
	tabList: any[];
	config: {
		isCollapse: boolean;
		device: "desktop" | "mobile";
		showSettings: boolean;
		showTagsView: boolean;
		fixedHeader: boolean;
		showFooter: boolean;
		elementSize: ComponentSizeEnum;
		animation: boolean;
		showBreadcrumb: boolean;
		theme: string;
	};
}

export const useAppStore = defineStore(
	"app",
	() => {
		let state = reactive<AppState>({
			dynamicRouteAdded: false, //动态路由是否已添加
			menuList: [], //菜单列表
			originMenuList: [], //原始菜单列表
			permissions: [], //权限列表
			keepAliveList: [], //缓存列表
			tabList: [], //标签列表
			config: {
				isCollapse: false, //是否折叠
				device: "desktop", //设备类型
				showSettings: false, //是否显示设置
				showTagsView: true, //是否显示标签
				fixedHeader: true, //是否固定头部
				showFooter: true, //是否显示底部
				elementSize: ComponentSizeEnum.DEFAULT, //element尺寸
				animation: true, //是否开启动画
				showBreadcrumb: true, //是否显示面包屑
				theme: "light" //主题
			}
		});

		function resetPermissions() {
			state.permissions = [];
			state.menuList = [];
			state.originMenuList = [];
			state.dynamicRouteAdded = false;
			state.keepAliveList = [];
			state.tabList = [];
		}

		function setDynamicRouteAdded(value: boolean) {
			state.dynamicRouteAdded = value;
		}

		function setKeepAliveList(value: string[]) {
			state.keepAliveList.splice(0, state.keepAliveList.length, ...value);
		}

		function setConfig(config: Partial<AppState["config"]>) {
			state.config = {
				...state.config,
				...config
			};
		}

		function setMenuList(value: any[]) {
			state.menuList = value;
		}

		function setPermissions(value: any[]) {
			state.permissions = value;
		}
		function getUserPermissions() {
			return state.permissions;
		}

		/* tabs相关函数 */
		function addTab(tab: any) {
			const index = state.tabList.findIndex(item => item.path === tab.path);
			if (index === -1) {
				state.tabList.push(tab);
			}
		}
		function closeMultipleTab(tabsMenuValue?: string) {
			state.tabList = state.tabList.filter(item => {
				return item.path === tabsMenuValue || !item.close;
			});
		}

		function removeTab(path: string, isCurrent?: boolean) {
			if (isCurrent) {
				state.tabList.forEach((item, index) => {
					if (item.path !== path) return;
					const nextTab = state.tabList[index + 1] || state.tabList[index - 1];

					if (!nextTab) return;
					router.push(nextTab.path);
				});
			}
			state.tabList = state.tabList.filter(item => item.path !== path);
		}

		function setTabList(list: any[]) {
			state.tabList = list;
		}

		function setTabsTitle(title: string) {
			const nowFullPath = location.hash.substring(1);
			state.tabList.forEach(item => {
				if (item.path == nowFullPath) item.title = title;
			});
		}

		async function getMenusByUser() {
			try {
				const { code, data } = await getUserMenusApi();
				if (code === ResultEnum.SUCCESS) {
					state.originMenuList = data.menus;
					setMenuList(data.menus);
					setPermissions(data.permissions);
				}
				return Promise.resolve(data);
			} catch (error) {
				return Promise.reject(error);
			}
		}

		return {
			...toRefs(state),
			getMenusByUser,
			setDynamicRouteAdded,
			setKeepAliveList,
			setConfig,
			setMenuList,
			setPermissions,
			addTab,
			removeTab,
			setTabList,
			setTabsTitle,
			closeMultipleTab,
			getUserPermissions,
			resetPermissions
		};
	},
	{
		persist: setPersisted("app", ["menuList", "config", "tabList"])
	}
);
