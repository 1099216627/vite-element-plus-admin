import http, { urlPrefix } from "../index";
import { ResPage } from "@/api/types";
import { setObjToUrlParams } from "@/utils";
import { Role } from "@/models/role-model";
//* 获取所有角色
export const getAllRolesApi = () => http.get<Role.Detail[]>(urlPrefix + "/role/all", {}, { noLoading: true });
//* 获取角色列表
export const getRolesApi = (params: Role.GetListParams) =>
	http.get<ResPage<Role.Detail>>(urlPrefix + setObjToUrlParams("/role", params));
//* 新建角色
export const createRoleApi = (data: Role.CreateParams) => http.post<Role.Detail>(urlPrefix + "/role", data);
//* 编辑角色
export const updateRoleApi = (id: number, data: Role.CreateParams) => http.put<Role.Detail>(urlPrefix + `/role/${id}`, data);
//* 删除角色
export const deleteRoleApi = (id: number) => http.delete(urlPrefix + `/role/${id}`);
//* 分配角色权限
export const assignRoleApi = (id: number, data: { permissions: number[] }) =>
	http.put<Role.Detail>(urlPrefix + `/role/permission/${id}`, data);
// * 锁定角色状态
export const lockRoleApi = (id: number) => http.put<Role.Detail>(urlPrefix + `/role/lock/${id}`);
// * 解锁角色状态
export const unlockRoleApi = (id: number) => http.put<Role.Detail>(urlPrefix + `/role/unlock/${id}`);
