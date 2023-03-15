import http, { urlPrefix } from "../index";
import { ResPage } from "@/api/types";
import { setObjToUrlParams } from "@/utils";
import { Log } from "@/models/log-model";
// * 获取日志列表
export const getLogListApi = (params: Log.GetListParams) =>
	http.get<ResPage<Log.Detail>>(urlPrefix + setObjToUrlParams("/log/list", params));
// * 删除全部日志
export const deleteAllLogApi = () => http.delete(urlPrefix + "/log/all");
