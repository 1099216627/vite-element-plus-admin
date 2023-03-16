import axios, { AxiosInstance, AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { showFullScreenLoading, tryHideFullScreenLoading } from "@/config/loading";
import { ResultData } from "@/api/types";
import { checkStatus } from "./helper/check-status";
import { ElMessage } from "element-plus";
import router from "@/router";
import { RequestEnum, ResultEnum } from "@/enums/http-enum";
import { joinTimestamp } from "./helper/timestamp";
import { AxiosCanceler } from "./helper/axios-cancel";
import { addFailedRequest, isRefreshing, refreshToken } from "./helper/refresh";

const config = {
	// * 默认地址请求地址，可在 .env.*** 文件中修改
	baseURL: import.meta.env.VITE_GLOBAL_HTTP_URL as string,
	timeout: import.meta.env.VITE_GLOBAL_HTTP_TIMEOUT as number,
	// * 跨域时候允许携带凭证
	withCredentials: true,
	// * 请求头信息
	headers: {
		"Content-Type": "application/json;charset=UTF-8"
	}
};
class RequestHttp {
	service: AxiosInstance; // * axios实例
	axiosCanceler: AxiosCanceler; // * 取消重复请求
	public constructor(config: AxiosRequestConfig) {
		// 实例化axios
		this.service = axios.create(config);
		this.axiosCanceler = new AxiosCanceler();

		/**
		 * @description 请求拦截器
		 * 客户端发送请求 -> [请求拦截器] -> 服务器
		 * token校验(JWT) : 接受服务器返回的token,存储到vuex/pinia/本地储存当中
		 */
		this.service.interceptors.request.use(
			(config: InternalAxiosRequestConfig) => {
				// * 加入time戳，防止浏览器缓存
				if (config.method?.toUpperCase() === RequestEnum.GET) {
					config.params = Object.assign(config.params || {}, joinTimestamp(true, false));
				}
				// * 忽略重复请求
				this.axiosCanceler.addPending(config);
				// * 如果当前请求不需要显示 loading,在 api 服务中通过指定的第三个参数: { headers: { noLoading: true } }来控制不显示loading
				config.headers!.noLoading && showFullScreenLoading();
				return config;
			},
			(error: AxiosError) => {
				return Promise.reject(error);
			}
		);
		/**
		 * @description 响应拦截器
		 *  服务器换返回信息 -> [拦截统一处理] -> 客户端JS获取到信息
		 */
		this.service.interceptors.response.use(
			(response: AxiosResponse) => {
				response && this.axiosCanceler.removePending(response.config);
				const { data } = response;
				// * 在请求结束后，并关闭请求 loading
				tryHideFullScreenLoading();
				// * 全局错误信息拦截（防止下载文件得时候返回数据流，没有code，直接报错）
				if (data.code && data.code !== ResultEnum.SUCCESS) {
					ElMessage.error(data.message);
					return Promise.reject(data);
				}
				// * 成功请求（在页面上除非特殊情况，否则不用在页面处理失败逻辑）
				return data;
			},
			(error: AxiosError) => {
				const { response } = error;
				const status = response?.status;
				// const userStore = useUserStore();
				const config = error.config;
				tryHideFullScreenLoading();
				// * 登陆失效（code == 401）刷新token重新请求，如果刷新token失败，跳转到登陆页面
				if (status == ResultEnum.OVERDUE) {
					if (!isRefreshing) {
						// * 刷新token
						refreshToken();
					}
					const retryRequest = new Promise(resolve => {
						// * 将请求挂起
						addFailedRequest(() => {
							resolve(this.service(config as AxiosRequestConfig));
						});
					});
					return retryRequest;
				}
				// 请求超时 && 网络错误单独判断，没有 response
				if (error.message.indexOf("timeout") !== -1) ElMessage.error("请求超时！请您稍后重试");
				if (error.message.indexOf("Network Error") !== -1) ElMessage.error("网络错误！请您稍后重试");
				// 根据响应的错误状态码，做不同的处理
				if (response) checkStatus(response.status);
				// 服务器结果都没有返回(可能服务器错误可能客户端断网)，断网处理:可以跳转到断网页面
				if (!window.navigator.onLine) router.replace("/500");
				return Promise.reject(error);
			}
		);
	}

	// * 常用请求方法封装
	get<T = any>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
		return this.service.get(url, { params, ..._object });
	}
	post<T = any>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
		return this.service.post(url, params, _object);
	}
	put<T = any>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
		return this.service.put(url, params, _object);
	}
	delete<T = any>(url: string, params?: any, _object = {}): Promise<ResultData<T>> {
		return this.service.delete(url, { params, ..._object });
	}
	download(url: string, params?: object, _object = {}): Promise<ResultData<BlobPart>> {
		return this.service.post(url, params, { ..._object, responseType: "blob" });
	}
}
export const urlPrefix = import.meta.env.VITE_GLOBAL_HTTP_PREFIX as string;
console.log(config, "config");

export default new RequestHttp(config);
