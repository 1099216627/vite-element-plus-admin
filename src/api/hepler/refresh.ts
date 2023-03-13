/**
 * @description 刷新token
 */
import { refreshTokenApi } from "../modules/user";
import { ResultEnum } from "@/enums/http-enum";
export let isRefreshing = false;
export let failedQueue: any[] = [];
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
export const refreshToken = async () => {
	isRefreshing = true;
	const { code } = await refreshTokenApi();
	if (code === ResultEnum.SUCCESS) {
		isRefreshing = false;
		onAccessTokenFetched();
	}
};
