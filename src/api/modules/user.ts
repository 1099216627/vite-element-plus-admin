import { http, http2 } from "@/api";
import { ResPage, ResultData } from "@/api/types";
import { RequestEnum } from "@/enums/http-enum";
import { setObjToUrlParams } from "@/utils";
import { Login } from "@/api/types";

import { User } from "@/models/user-model";
// * 获取验证码
export function getCaptchaApi() {
	return http.request<ResultData>({
		url: "/auth/captcha",
		method: RequestEnum.GET
	});
}
// * 登录
export function loginApi(data: Login.ReqLoginForm) {
	return http.request<ResultData>({
		url: "/auth/signin",
		method: RequestEnum.POST,
		data
	});
}
// * 注册
export function registerApi(data: Login.ReqLoginForm) {
	return http.request<ResultData>(
		{
			url: "/auth/signup",
			method: RequestEnum.POST,
			data
		},
		{ isShowSuccessMessage: true }
	);
}
// * 退出登录
export function logoutApi() {
	return http.request<ResultData>({
		url: "/auth/signout",
		method: RequestEnum.POST
	});
}
// * 刷新token
export function refreshTokenApi() {
	return http.request<ResultData>({
		url: "/auth/refresh",
		method: RequestEnum.POST
	});
}
// * 修改个人资料
export function updateUserInfoApi(data: User.UpdateSelfParams) {
	return http.request<ResultData<User.Detail>>(
		{
			url: "/profile",
			method: RequestEnum.PUT,
			data
		},
		{ isShowSuccessMessage: true }
	);
}
// * 修改密码
export function updatePasswordApi(data: User.UpdatePasswordParams) {
	return http.request<ResultData>(
		{
			url: "/auth/password",
			method: RequestEnum.PUT,
			data
		},
		{ isShowSuccessMessage: true }
	);
}
// * 获取个人信息
export function getUserInfoApi() {
	return http.request<ResultData>({
		url: "/auth/userInfo",
		method: RequestEnum.GET
	});
}
// * 获取用户列表
export function getUserListApi(params: User.GetListParams) {
	return http.request<ResultData<ResPage>>({
		url: setObjToUrlParams("/user", params),
		method: RequestEnum.GET
	});
}
// * 新建用户
export function createUserApi(data: User.CreateUserParams) {
	return http.request<ResultData>(
		{
			url: "/user",
			method: RequestEnum.POST,
			data
		},
		{ isShowSuccessMessage: true }
	);
}
// * 编辑用户
export function updateUserApi(id: number, data: Partial<User.CreateUserParams>) {
	return http.request<ResultData>(
		{
			url: `/user/${id}`,
			method: RequestEnum.PUT,
			data
		},
		{ isShowSuccessMessage: true }
	);
}
// * 删除用户
export function deleteUserApi(id: number) {
	return http.request<ResultData>(
		{
			url: `/user/${id}`,
			method: RequestEnum.DELETE
		},
		{ isShowSuccessMessage: true }
	);
}
// * 禁用用户
export function disableUserApi(id: number) {
	return http.request<ResultData>(
		{
			url: `/user/disable/${id}`,
			method: RequestEnum.PUT
		},
		{ isShowSuccessMessage: true }
	);
}
// * 启用用户
export function enableUserApi(id: number) {
	return http.request<ResultData>(
		{
			url: `/user/enable/${id}`,
			method: RequestEnum.PUT
		},
		{ isShowSuccessMessage: true }
	);
}
// * 恢复用户
export function recoverUserApi(id: number) {
	return http.request<ResultData>(
		{
			url: `/user/recover/${id}`,
			method: RequestEnum.PUT
		},
		{ isShowSuccessMessage: true }
	);
}
// * 导出用户
export function exportUserApi(data: { ids: number[] }) {
	return http2.request<ResultData>({
		url: "/user/export",
		method: RequestEnum.POST,
		data,
		responseType: "blob"
	});
}
// * 批量删除用户
export function batchDeleteUserApi(data: { ids: number[] }) {
	return http.request<ResultData>(
		{
			url: "/user/batch",
			method: RequestEnum.DELETE,
			data
		},
		{ isShowSuccessMessage: true }
	);
}
