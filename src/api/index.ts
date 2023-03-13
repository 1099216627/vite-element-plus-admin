import { MyAxios } from "./axios-instance";
import { AxiosTransform } from "./hepler/axios-transform";
import axios, { AxiosResponse } from "axios";
import { checkStatus } from "./hepler/check-status";
import { joinTimestamp, formatRequestDate } from "./hepler/timestamp";
import { CreateAxiosOptions, ResultData } from "@/api/types";
import { ContentTypeEnum, RequestEnum, ResultEnum } from "@/enums/http-enum";
import { RequestOptions } from "@/api/types";
import { ElMessage, ElMessageBox } from "element-plus";
import { isString, isUrl } from "@/utils/is";
import { setObjToUrlParams } from "@/utils";
import { useUserStore } from "@/store/modules/user";
import { useAppStore } from "@/store/modules/app";
import { refreshToken, addFailedRequest, isRefreshing } from "./hepler/refresh";
import { LOGIN_NAME, LOGIN_PATH } from "@/router/constant";
const urlPrefix = import.meta.env.VITE_GLOBAL_HTTP_PREFIX;
const baseUrl = import.meta.env.VITE_GLOBAL_HTTP_URL;
const timeout = import.meta.env.VITE_GLOBAL_HTTP_TIMEOUT;
import router from "@/router";
const transform: AxiosTransform = {
	// 请求之前处理config
	beforeRequestHook: (config, options) => {
		const { apiUrl, joinPrefix, joinParamsToUrl, formatDate, joinTime = true, urlPrefix } = options;
		const isUrlStr = isUrl(config.url as string);
		//不是url并拼接前缀
		if (!isUrlStr && joinPrefix) {
			config.url = `${urlPrefix}${config.url}`;
		}
		//不是url并拼接接口地址
		if (!isUrlStr && apiUrl && isString(apiUrl)) {
			config.url = `${apiUrl}${config.url}`;
		}

		const params = config.params || {};
		const data = config.data || false;
		if (config.method?.toUpperCase() === RequestEnum.GET) {
			if (!isString(params)) {
				// 给 get 请求加上时间戳参数，避免从缓存中拿数据。
				config.params = Object.assign(params || {}, joinTimestamp(joinTime, false));
			} else {
				// 兼容restful风格
				config.url = config.url + params + `${joinTimestamp(joinTime, true)}`;
				config.params = undefined;
			}
		} else {
			if (!isString(params)) {
				formatDate && formatRequestDate(params);
				if (Reflect.has(config, "data") && config.data && Object.keys(config.data).length > 0) {
					config.data = data;
					config.params = params;
				} else {
					config.data = params;
					config.params = undefined;
				}
				if (joinParamsToUrl) {
					config.url = setObjToUrlParams(config.url as string, Object.assign({}, config.params, config.data));
				}
			} else {
				// 兼容restful风格
				config.url = config.url + params;
				config.params = undefined;
			}
		}
		return config;
	},
	//请求成功后的处理
	transformRequestData: (res: AxiosResponse<ResultData>, options: RequestOptions) => {
		const {
			isShowMessage = true,
			isShowErrorMessage,
			isShowSuccessMessage,
			isTransformResponse,
			isReturnNativeResponse
		} = options;
		const userStore = useUserStore();
		const appStore = useAppStore();
		if (!res.data) {
			userStore.resetState();
			appStore.resetPermissions();
			return Promise.reject(new Error("请求失败"));
		}

		if (isReturnNativeResponse) {
			return res;
		}
		const { data } = res;
		const { code, message, data: result } = data;
		const isOk = code === ResultEnum.SUCCESS;
		// 是否显示提示信息
		if (isShowMessage) {
			if (isOk && isShowSuccessMessage) {
				// 是否显示自定义信息提示
				ElMessage.success(message);
			} else if (!isOk && isShowErrorMessage) {
				// 是否显示自定义信息提示
				ElMessage.error(message || "服务器异常，请稍后重试");
			} else if (!isOk && options.errorMessageMode === "modal") {
				// errorMessageMode=‘custom-modal’的时候会显示modal错误弹窗，而不是消息提示，用于一些比较重要的错误
				ElMessageBox.confirm(message || "服务器异常，请稍后重试", "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning"
				})
					.then(() => {
						// do something
					})
					.catch(() => {
						// do something
					});
			}
		}
		// 不进行任何处理，直接返回
		// 用于页面代码可能需要直接获取code，data，message这些信息时开启
		if (!isTransformResponse) {
			return res.data;
		}
		// 接口请求成功，直接返回结果
		if (res.status >= 200 && res.status < 300) {
			return result;
		}
		// 接口请求错误，统一提示错误信息 这里逻辑可以根据项目进行修改
		let errorMsg = message;
		switch (code) {
			// 请求失败
			case ResultEnum.ERROR:
				ElMessage.error(errorMsg || "服务器异常，请稍后重试");
				break;
			// 登录超时
			case ResultEnum.TIMEOUT:
				const LoginName = LOGIN_NAME;
				const LoginPath = LOGIN_PATH;
				if (router.currentRoute.value?.name === LoginName) return;
				// 到登录页
				errorMsg = "登录超时，请重新登录!";
				ElMessageBox.confirm(errorMsg, "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning"
				}).then(() => {
					router.push(LoginPath);
				});
				break;
		}
		throw new Error(errorMsg);
	},
	// 请求拦截配置
	requestInterceptors: (config, options) => {
		const userStore = useUserStore();
		const token = userStore.getToken();
		if (token && (config as Recordable)?.requestOptions?.withToken !== false) {
			(config as Recordable).headers.Authorization = options.authenticationScheme
				? `${options.authenticationScheme} ${token}`
				: `Bearer ${token}`;
		}
		return config;
	},
	// 响应错误拦截配置
	responseInterceptorsCatch: (error: any) => {
		const { response, code, message } = error || {};
		const status = response?.status;
		const config = response?.config || {};
		const msg = response?.data?.message || "";
		const userStore = useUserStore();
		const appStore = useAppStore();
		const err: string = error.toString();
		if (status === 401) {
			// * 401, token失效，通过refreshToken获取新的token
			if (!isRefreshing) {
				refreshToken();
				return new Promise(resolve => {
					addFailedRequest(() => {
						resolve(axios.request(config));
					});
				});
			}
		}
		try {
			if (code === "ECONNABORTED" && message.indexOf("timeout") !== -1) {
				ElMessage.error("接口请求超时，请刷新页面重试!");
				return;
			}
			if (err && err.includes("Network Error")) {
				ElMessage.error("网络异常，请检查您的网络设置!");
				return Promise.reject(error);
			}
		} catch (error) {
			throw new Error(error as any);
		}
		// 请求是否被取消
		const isCancel = axios.isCancel(error);
		if (msg) {
			ElMessage.error(msg);
		} else if (!isCancel) {
			checkStatus(response && response.status);
		} else {
			console.warn(error, "请求被取消！");
		}

		// 跳转到登录页
		if (status === 401) {
			userStore.resetState();
			appStore.resetPermissions();
			router.push({
				name: LOGIN_NAME,
				query: {
					redirect: router.currentRoute.value.fullPath
				}
			});
		}

		return Promise.reject(response?.data);
	}
};
//多个对象合并
function createAxiosInstance(opt?: Partial<CreateAxiosOptions>) {
	const options = Object.assign(
		{
			timeout: Number(timeout),
			authenticationScheme: "Bearer",
			headers: {
				"Content-Type": ContentTypeEnum.JSON
			},
			// 数据处理方式
			transform,
			// 配置项，下面的选项都可以在独立的接口请求中覆盖
			requestOptions: {
				// 是否显示错误提示
				isShowErrorMessage: true,
				// 默认将prefix 添加到url
				joinPrefix: true,
				// 是否返回原生响应头 比如：需要获取响应头时使用该属性
				isReturnNativeResponse: false,
				// 需要对返回数据进行处理
				isTransformResponse: false,
				// post请求的时候添加参数到url
				joinParamsToUrl: false,
				// 格式化提交参数时间
				formatDate: true,
				// 消息提示类型
				errorMessageMode: "none",
				// 接口地址
				apiUrl: baseUrl,
				// 接口拼接地址
				urlPrefix: urlPrefix,
				//  是否加入时间戳
				joinTime: true,
				// 忽略重复请求
				ignoreCancelToken: true,
				// 是否携带token
				withToken: true
			},
			withCredentials: true
		},
		opt || {}
	);
	return new MyAxios(options);
}

export const http = createAxiosInstance();
export const http2 = createAxiosInstance({
	requestOptions: {
		// 是否显示错误提示
		isShowErrorMessage: true,
		// 默认将prefix 添加到url
		joinPrefix: true,
		// 是否返回原生响应头 比如：需要获取响应头时使用该属性
		isReturnNativeResponse: true,
		// 需要对返回数据进行处理
		isTransformResponse: false,
		// post请求的时候添加参数到url
		joinParamsToUrl: false,
		// 格式化提交参数时间
		formatDate: true,
		// 消息提示类型
		errorMessageMode: "none",
		// 接口地址
		apiUrl: baseUrl,
		// 接口拼接地址
		urlPrefix: urlPrefix,
		//  是否加入时间戳
		joinTime: true,
		// 忽略重复请求
		ignoreCancelToken: true,
		// 是否携带token
		withToken: true
	}
});
