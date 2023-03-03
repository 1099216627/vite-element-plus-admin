import { ERROR_NAME, ErrorPage, Layout, LOGIN_NAME, LOGIN_PATH } from "@/router/constant";
export const LoginRoute = {
	path: LOGIN_PATH,
	name: LOGIN_NAME,
	component: () => import("@/views/login/index.vue"),
	meta: {
		title: "登录",
		hidden: true
	}
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
