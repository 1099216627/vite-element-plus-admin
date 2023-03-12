import { http } from "../index";
import { ResPage, ResultData } from "@/api/types";
import { RequestEnum } from "@/enums/http-enum";
import { setObjToUrlParams } from "@/utils";
import { Log } from "@/models/log-model";
// * 获取日志列表
export const getLogListApi = (params: Log.GetListParams) => {
	return http.request<ResultData<ResPage<Log.Detail>>>({
		url: setObjToUrlParams("/log/list", params),
		method: RequestEnum.GET
	});
};

// * 删除全部日志
export const deleteAllLogApi = () => {
	return http.request<ResultData>({
		url: "/log/all",
		method: RequestEnum.DELETE
	});
};
