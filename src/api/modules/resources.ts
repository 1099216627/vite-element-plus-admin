import { http } from "../index";
import { ResultData } from "@/api/types";
import { RequestEnum } from "@/enums/http-enum";
import { setObjToUrlParams } from "@/utils";
import { Resources } from "@/models/resources-mode";
// * 获取资源列表
export function getResourcesListApi(params: Resources.IGetListParams) {
	return http.request<ResultData<Resources.IGetListResult>>({
		url: setObjToUrlParams("/resources", params),
		method: RequestEnum.GET
	});
}
// * 新建资源
export function createResourcesApi(data: Resources.ICreateParams) {
	return http.request<ResultData<Resources.Detail>>({
		url: "/resources",
		method: RequestEnum.POST,
		data
	});
}
// * 编辑资源
export function updateResourcesApi(id: number, data: Resources.Detail) {
	return http.request<ResultData<Resources.Detail>>({
		url: `/resources/${id}`,
		method: RequestEnum.PUT,
		data
	});
}
// * 删除资源
export function deleteResourcesApi(id: number) {
	return http.request<ResultData<Resources.Detail>>({
		url: `/resources/${id}`,
		method: RequestEnum.DELETE
	});
}
