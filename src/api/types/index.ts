// * 请求响应参数(不包含data)
import { AxiosRequestConfig } from "axios";
import { AxiosTransform } from "@/api/hepler/axios-transform";

export interface Result {
	code: number;
	message: string;
}

// * 请求响应参数(包含data)
export interface ResultData<T = any> extends Result {
	data: T;
}

// * 分页响应参数
export interface ResPage<T = any> {
	list: T[];
	page: number;
	size: number;
	total: number;
	pages: number;
}

// * 分页请求参数
export interface ReqPage {
	page: number;
	limit: number;
}

// * 文件上传模块
export namespace Upload {
	export interface ResFileUrl {
		data: string;
	}
}

// * 登录模块
export namespace Login {
	export interface ReqLoginForm {
		username: string;
		password: string;
		code: string;
		codeId: string;
	}
	export interface ResLogin {
		access_token: string;
	}
}

export interface RequestOptions {
	// 请求参数拼接到url
	joinParamsToUrl?: boolean;
	// 格式化请求参数时间
	formatDate?: boolean;
	// 是否显示提示信息
	isShowMessage?: boolean;
	// 是否解析成JSON
	isParseToJson?: boolean;
	// 成功的文本信息
	successMessageText?: string;
	// 是否显示成功信息
	isShowSuccessMessage?: boolean;
	// 是否显示失败信息
	isShowErrorMessage?: boolean;
	// 错误的文本信息
	errorMessageText?: string;
	// 是否加入url
	joinPrefix?: boolean;
	// 接口地址， 不填则使用默认apiUrl
	apiUrl?: string;
	// 请求拼接路径
	urlPrefix?: string;
	// 错误消息提示类型
	errorMessageMode?: "none" | "modal";
	// 是否添加时间戳
	joinTime?: boolean;
	// 不进行任何处理，直接返回
	isTransformResponse?: boolean;
	// 是否返回原生响应头
	isReturnNativeResponse?: boolean;
	//忽略重复请求
	ignoreCancelToken?: boolean;
	// 是否携带token
	withToken?: boolean;
}

export interface CreateAxiosOptions extends AxiosRequestConfig {
	transform?: AxiosTransform;
	requestOptions?: RequestOptions;
	authenticationScheme?: string;
}

// 上传文件
export interface UploadFileParams {
	// 其他参数
	data?: Recordable;
	// 文件参数接口字段名
	name?: string;
	// 文件
	file: File | Blob;
	// 文件名称
	filename?: string;
	[key: string]: any;
}
