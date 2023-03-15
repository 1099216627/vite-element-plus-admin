// * 请求响应参数(不包含data)
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
