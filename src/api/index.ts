import { MyAxios } from "./axios-instance";
import { AxiosTransform } from "./hepler/axios-transform";
import axios, { AxiosResponse } from "axios";
import { useRouter } from "vue-router";
import { checkStatus } from "./hepler/check-status";
import { joinTimestamp, formatRequestDate } from "./hepler/timestamp";
import { CreateAxiosOptions, ResultData } from "@/api/types";
import { RequestEnum, ResultEnum } from "@/enums/http-enum";
import { RequestOptions } from "@/api/types";
import { ElMessage, ElMessageBox } from "element-plus";
import { isString, isUrl } from "@/utils/is";
import { setObjToUrlParams } from "@/utils";
import { useUserStore } from "@/store/modules/user";
import { defaultOptions } from "@/api/config";
import { LOGIN_NAME, LOGIN_PATH } from "@/router/constant";

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

		// 是否返回原生响应头 比如：需要获取响应头时使用该属性
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
		const router = useRouter();
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
		const token = userStore.getToken;
		if (token && (config as Recordable)?.requestOptions?.withToken !== false) {
			(config as Recordable).headers.Authorization = options.authenticationScheme
				? `${options.authenticationScheme} ${token}`
				: `Bearer ${token}`;
		}
		return config;
	},
	// 响应拦截配置
	responseInterceptorsCatch: (error: any) => {
		const router = useRouter();
		const { response, code, message } = error || {};
		const err: string = error.toString();
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
		if (!isCancel) {
			checkStatus(response && response.status);
		} else {
			console.warn(error, "请求被取消！");
		}
		//当返回信息为未授权或者未登录或者登录超时时，跳转到登录页面
		if (error.response && (error.response.status === 401 || error.response.status === 419)) {
			router.push("/login");
		}
		return Promise.reject(response?.data);
	}
};
//多个对象合并
function createAxiosInstance(opt?: Partial<CreateAxiosOptions>) {
	return new MyAxios(Object.assign({}, opt || {}, defaultOptions(transform)));
}

export const http = createAxiosInstance();
