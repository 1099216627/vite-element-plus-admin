import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import { LoginRoute, RedirectRoute, RegisterRoute, RootRoute } from "@/router/base";
import { App } from "vue";
import { createRouterGuard } from "./guard";
/**
 * @description 动态路由参数配置简介 📚
 * @param path ==> 菜单路径
 * @param name ==> 菜单别名
 * @param redirect ==> 重定向地址
 * @param component ==> 视图文件路径
 * @param meta ==> 菜单信息
 * @param meta.icon ==> 菜单图标
 * @param meta.title ==> 菜单标题
 * @param meta.activeMenu ==> 当前路由为详情页时，需要高亮的菜单
 * @param meta.isLink ==> 是否外链
 * @param meta.isHide ==> 是否隐藏
 * @param meta.isFull ==> 是否全屏(示例：数据大屏页面)
 * @param meta.isAffix ==> 是否固定在 tabs nav
 * @param meta.isKeepAlive ==> 是否缓存
 * */

const basicRoutes = [RootRoute, LoginRoute, RedirectRoute, RegisterRoute] as readonly RouteRecordRaw[];
const router = createRouter({
	history: createWebHashHistory(),
	routes: basicRoutes,
	strict: true, //strict是true的时候，如果路由没有匹配到，就会报错
	scrollBehavior: () => ({ left: 0, top: 0 })
});

export function setupRouter(app: App) {
	createRouterGuard(router);
	app.use(router);
}
export default router;
