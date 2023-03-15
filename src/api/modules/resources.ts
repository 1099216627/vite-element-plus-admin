import http, { urlPrefix } from "../index";
import { setObjToUrlParams } from "@/utils";
import { Resources } from "@/models/resources-mode";
// * 获取资源列表
export const getResourcesListApi = (params: Resources.IGetListParams) =>
	http.get<Resources.IGetListResult>(urlPrefix + setObjToUrlParams("/resources", params));
// * 新建资源
export const createResourcesApi = (data: Resources.ICreateParams) => http.post<Resources.Detail>(urlPrefix + "/resources", data);
// * 编辑资源
export const updateResourcesApi = (id: number, data: Resources.Detail) =>
	http.put<Resources.Detail>(urlPrefix + `/resources/${id}`, data);
// * 删除资源
export const deleteResourcesApi = (id: number) => http.delete<Resources.Detail>(urlPrefix + `/resources/${id}`);
