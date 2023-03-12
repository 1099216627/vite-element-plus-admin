import type { AxiosRequestConfig, AxiosInstance, AxiosResponse } from "axios";
import axios from "axios";
import type { RequestOptions, CreateAxiosOptions, ResultData } from "./types";
import { isFunction } from "@/utils/is";
import { AxiosCanceler } from "./hepler/axios-cancel";
import { deepClone } from "@/utils";
import { ContentTypeEnum } from "@/enums/http-enum";
import { UploadFileParams } from "@/api/types";
export class MyAxios {
	private axiosInstance: AxiosInstance;
	private options: CreateAxiosOptions;
	constructor(options: CreateAxiosOptions) {
		this.options = options;
		this.axiosInstance = axios.create(options);
		this.setupInterceptors();
	}
	getAxios(): AxiosInstance {
		return this.axiosInstance;
	}
	setAxiosConfig(config: CreateAxiosOptions) {
		if (!this.axiosInstance) {
			return;
		}
		this.createAxios(config);
	}
	setHeader(headers: any): void {
		if (!this.axiosInstance) {
			return;
		}
		Object.assign(this.axiosInstance.defaults.headers, headers);
	}

	private createAxios(config: CreateAxiosOptions): void {
		this.axiosInstance = axios.create(config);
	}

	private getTransform() {
		const { transform } = this.options;
		return transform;
	}
	request<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
		let conf: AxiosRequestConfig = deepClone(config);
		const transform = this.getTransform();

		const { requestOptions } = this.options;

		const opt: RequestOptions = Object.assign({}, requestOptions, options);

		const { beforeRequestHook, requestCatch, transformRequestData } = transform || {};
		if (beforeRequestHook && isFunction(beforeRequestHook)) {
			conf = beforeRequestHook(conf, opt);
		}

		//这里重新 赋值成最新的配置
		// @ts-expect-error
		conf.requestOptions = opt;

		return new Promise((resolve, reject) => {
			this.axiosInstance
				.request<any, AxiosResponse<ResultData>>(conf)
				.then((res: AxiosResponse<ResultData>) => {
					// 请求是否被取消
					const isCancel = axios.isCancel(res);
					if (transformRequestData && isFunction(transformRequestData) && !isCancel) {
						try {
							const ret = transformRequestData(res, opt);
							resolve(ret);
						} catch (err) {
							reject(err || new Error("request error!"));
						}
						return;
					}
					resolve(res as unknown as Promise<T>);
				})
				.catch((e: Error) => {
					if (requestCatch && isFunction(requestCatch)) {
						reject(requestCatch(e));
						return;
					}
					reject(e);
				});
		});
	}

	upload<T = any>(config: AxiosRequestConfig, params: UploadFileParams) {
		const formData = new window.FormData();
		const customFilename = params.name || "file";
		// 格式化参数
		if (params.filename) {
			formData.append(customFilename, params.file, params.filename);
		} else {
			formData.append(customFilename, params.file);
		}
		// 数组参数支持
		if (params.data) {
			Object.keys(params.data).forEach(key => {
				const value = params.data![key];
				if (Array.isArray(value)) {
					value.forEach(item => {
						formData.append(`${key}[]`, item);
					});
					return;
				}
				formData.append(key, params.data![key]);
			});
		}

		return this.axiosInstance.request<T>({
			method: "POST",
			data: formData,
			baseURL: import.meta.env.VITE_GLOBAL_HTTP_URL,
			headers: {
				"Content-type": ContentTypeEnum.FORM_DATA
			},
			withCredentials: true,
			...config
		});
	}
	//设置拦截器
	private setupInterceptors() {
		const transform = this.getTransform();
		if (!transform) {
			return;
		}
		const { requestInterceptors, requestInterceptorsCatch, responseInterceptors, responseInterceptorsCatch } = transform;
		const axiosCanceler = new AxiosCanceler();

		// 请求拦截器配置处理
		this.axiosInstance.interceptors.request.use((config: any) => {
			const {
				headers: { ignoreCancelToken }
			} = config;
			const ignoreCancel = ignoreCancelToken !== undefined ? ignoreCancelToken : this.options.requestOptions?.ignoreCancelToken;

			!ignoreCancel && axiosCanceler.addPending(config);
			if (requestInterceptors && isFunction(requestInterceptors)) {
				config = requestInterceptors(config, this.options);
			}
			return config;
		}, undefined);

		// 请求拦截器错误捕获
		requestInterceptorsCatch &&
			isFunction(requestInterceptorsCatch) &&
			this.axiosInstance.interceptors.request.use(undefined, requestInterceptorsCatch);

		// 响应结果拦截器处理
		this.axiosInstance.interceptors.response.use((res: AxiosResponse<any>) => {
			res && axiosCanceler.removePending(res.config);
			if (responseInterceptors && isFunction(responseInterceptors)) {
				res = responseInterceptors(res);
			}
			return res;
		}, undefined);

		// // 响应结果拦截器错误捕获
		responseInterceptorsCatch &&
			isFunction(responseInterceptorsCatch) &&
			this.axiosInstance.interceptors.response.use(undefined, responseInterceptorsCatch);
	}
}
