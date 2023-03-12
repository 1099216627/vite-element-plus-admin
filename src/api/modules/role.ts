import { http } from "../index";
import { ResPage, ResultData } from "@/api/types";
import { setObjToUrlParams } from "@/utils";
import { RequestEnum } from "@/enums/http-enum";
import { Role } from "@/models/role-model";
//* 获取所有角色
export function getAllRolesApi() {
	return http.request<ResultData<Role.Detail[]>>({
		url: "/role/all",
		method: RequestEnum.GET
	});
}

//* 获取角色列表
export function getRolesApi(params: Role.GetListParams) {
	return http.request<ResultData<ResPage<Role.Detail>>>({
		url: setObjToUrlParams("/role", params),
		method: RequestEnum.GET
	});
}

//* 新建角色
export function createRoleApi(data: Role.CreateParams) {
	return http.request<ResultData<Role.Detail>>({
		url: "/role",
		method: RequestEnum.POST,
		data: data
	});
}

//* 编辑角色
export function updateRoleApi(id: number, data: Role.CreateParams) {
	return http.request<ResultData<Role.Detail>>({
		url: `/role/${id}`,
		method: RequestEnum.PUT,
		data: data
	});
}

//* 删除角色
export function deleteRoleApi(id: number) {
	return http.request<ResultData>({
		url: `/role/${id}`,
		method: RequestEnum.DELETE
	});
}

//* 分配角色权限
export function assignRoleApi(id: number, data: { permissions: number[] }) {
	return http.request<ResultData<Role.Detail>>({
		url: `/role/permission/${id}`,
		method: RequestEnum.PUT,
		data: data
	});
}

// * 锁定角色状态
export function lockRoleApi(id: number) {
	return http.request<ResultData<Role.Detail>>({
		url: `/role/lock/${id}`,
		method: RequestEnum.PUT
	});
}

// * 解锁角色状态
export function unlockRoleApi(id: number) {
	return http.request<ResultData<Role.Detail>>({
		url: `/role/unlock/${id}`,
		method: RequestEnum.PUT
	});
}
