/**
 * @description 刷新token
 */
import { useUserStore } from "@/store/modules/user";
import router from "@/router";
import { LOGIN_PATH } from "@/router/constant";
import { ElMessage } from "element-plus";
import axios from "axios";
export let isRefreshing = false;
export let failedQueue: any[] = [];
export const refreshAxios = axios.create({
	baseURL: import.meta.env.VITE_GLOBAL_HTTP_URL as string,
	timeout: import.meta.env.VITE_GLOBAL_HTTP_TIMEOUT as number,
	withCredentials: true
});
// * 重新请求
export const onAccessTokenFetched = () => {
	failedQueue.forEach((prom: any) => prom && prom());
	failedQueue = [];
};
// * 添加请求
export const addFailedRequest = (prom: any) => {
	failedQueue.push(prom);
};

// * 刷新token处理
export const refreshToken = () => {
	isRefreshing = true;
	//* 延迟1秒，防止刷新token的时候，请求还没结束
	setTimeout(() => {
		refreshAxios
			.post("/api/v1/auth/refresh")
			.then(() => {
				onAccessTokenFetched();
			})
			.catch(() => {
				const userStore = useUserStore();
				ElMessage.error("身份验证已过期，请重新登录");
				// * 刷新token失败，跳转到登陆页面
				userStore.setToken("");
				router.replace(LOGIN_PATH);
				return Promise.reject("身份验证已过期，请重新登录");
			})
			.finally(() => {
				isRefreshing = false; //重置刷新状态
				failedQueue = []; //清空队列
			});
	}, 1000);
};
