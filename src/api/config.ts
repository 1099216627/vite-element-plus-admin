import { AxiosTransform } from "@/api/hepler/axios-transform";
import { ContentTypeEnum } from "@/enums/http-enum";
const urlPrefix = import.meta.env.VITE_GLOBAL_HTTP_PREFIX;
export const defaultOptions = (transform: AxiosTransform) => {
	return {
		timeout: 10 * 1000,
		authenticationScheme: "",
		// 接口前缀
		prefixUrl: urlPrefix,
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
			isTransformResponse: true,
			// post请求的时候添加参数到url
			joinParamsToUrl: false,
			// 格式化提交参数时间
			formatDate: true,
			// 消息提示类型
			errorMessageMode: "none",
			// 接口地址
			apiUrl: "",
			// 接口拼接地址
			urlPrefix: urlPrefix,
			//  是否加入时间戳
			joinTime: true,
			// 忽略重复请求
			ignoreCancelToken: true,
			// 是否携带token
			withToken: true
		},
		withCredentials: false
	};
};
