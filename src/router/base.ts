import { ERROR_NAME, ErrorPage, LOGIN_NAME, LOGIN_PATH, BASE_PATH, REGISTER_NAME, REGISTER_PATH } from "@/router/constant";
import Layout from "@/layout/index.vue";
export const LoginRoute = {
	path: LOGIN_PATH,
	name: LOGIN_NAME,
	component: () => import("@/views/login/index.vue"),
	meta: {
		title: "登录",
		hidden: true
	}
};
export const RegisterRoute = {
	path: REGISTER_PATH,
	name: REGISTER_NAME,
	component: () => import("@/views/register/index.vue"),
	meta: {
		title: "注册",
		hidden: true
	}
};
export const RootRoute = {
	path: BASE_PATH,
	name: "Root",
	redirect: "/dashboard",
	component: Layout,
	children: [
		{
			path: "/i18n",
			name: "I18n",
			component: () => import("@/views/i18n/index.vue"),
			meta: {
				title: "国际化测试",
				icon: "language"
			}
		}
	]
};

export const ErrorPageRoute = {
	path: "/:path(.*)*",
	name: ERROR_NAME,
	component: ErrorPage,
	meta: {
		title: ERROR_NAME,
		hidden: true
	}
};
export const RedirectRoute = {
	path: "/redirect",
	name: "Redirect",
	component: Layout,
	meta: {
		title: "Redirect",
		hidden: true
	},
	children: [
		{
			path: "/redirect/:path(.*)",
			name: "Redirect",
			component: () => import("@/views/redirect/index.vue"),
			meta: {
				title: "Redirect",
				hideBreadcrumb: true
			}
		}
	]
};
