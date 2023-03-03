import { useUserStore } from "@/store/modules/user";
/**
 * 路由守卫
 */

import { Router, RouteRecordRaw } from "vue-router";
import { BASE_PATH, ERROR_NAME, LOGIN_PATH, WHITE_LIST } from "./constant";
import NProgress from "@/plugins/nprogress";
import { ErrorPageRoute } from "@/router/base";
import { storeToRefs } from "pinia";
import { useAppStore } from "@/store/modules/app";
import { generateRoutes } from "./uitls";
export function createRouterGuard(router: Router) {
	const userStore = useUserStore();
	const appStore = useAppStore();
	const { token } = storeToRefs(userStore);
	const { dynamicRouteAdded, keepAliveList } = storeToRefs(appStore);
	router.beforeEach(async (to, from, next) => {
		// 1.NProgress 开始
		NProgress.start();
		// 2.动态设置标题
		const title = import.meta.env.VITE_GLOB_APP_TITLE;
		document.title = to.meta.title ? `${to.meta.title} - ${title}` : title;
		if (from.path === LOGIN_PATH && to.name === ERROR_NAME) {
			next({ path: BASE_PATH });
			return;
		}
		// 3.当存在于白名单时，直接进入
		if (WHITE_LIST.includes(to.path)) {
			next();
			return;
		}
		//4.当token不存在时
		if (!token.value) {
			const redirectData: { path: string; replace: boolean; query?: Recordable<string> } = { path: LOGIN_PATH, replace: true };
			if (to.path) {
				redirectData.query = { ...redirectData.query, redirect: to.path };
			}
			next(redirectData);
			return;
		}
		//5.当已添加动态路由时，直接进入
		if (dynamicRouteAdded.value) {
			next();
			return;
		}
		//6.当未添加动态路由时，添加动态路由，并获取用户信息
		await userStore.getUserInfo();
		const data = appStore.getMenusByUser();
		if (!data) {
			next({ path: LOGIN_PATH });
			return;
		}
		const routes = generateRoutes(data as any);
		routes.forEach(route => {
			router.addRoute(route as RouteRecordRaw);
		});
		//添加404
		const isErrorPage = router.getRoutes().findIndex(item => item.name === ErrorPageRoute.name);
		if (isErrorPage === -1) {
			router.addRoute(ErrorPageRoute as unknown as RouteRecordRaw);
		}

		const redirectPath = (from.query.redirect || to.path) as string;
		const redirect = decodeURIComponent(redirectPath);
		const nextData = to.path === redirect ? { ...to, replace: true } : { path: redirect };
		appStore.setDynamicRouteAdded(true);
		next(nextData);
	});

	router.afterEach(to => {
		const currentComponentName: any = to.matched.find(item => item.name === to.name)?.name;
		if (currentComponentName && !keepAliveList.value.includes(currentComponentName) && to.meta.cache) {
			//需要缓存的组件
			keepAliveList.value.push(currentComponentName);
		} else if (!to.meta.cache || to.name === "Redirect") {
			//不需要缓存的组件
			const index = keepAliveList.value.findIndex(name => name === currentComponentName);
			if (index != -1) {
				keepAliveList.value.splice(index, 1);
			}
		}
		appStore.setKeepAliveList(keepAliveList.value);
		NProgress.done();
	});

	router.onError(error => {
		NProgress.done();
		console.warn("路由错误", error.message);
	});
}