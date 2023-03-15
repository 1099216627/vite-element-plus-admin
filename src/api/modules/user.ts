import http from "@/api";
import { ResPage, ResultData } from "@/api/types";
import { setObjToUrlParams } from "@/utils";
import { Login } from "@/api/types";
import { User } from "@/models/user-model";
import { urlPrefix } from "../index";
interface ResCaptcha {
	img: string;
	id: string;
}
// * 获取验证码
export const getCaptchaApi = () => http.get<ResCaptcha>(urlPrefix + "/auth/captcha", {}, { noLoading: true });
// * 登录
export const loginApi = (data: Login.ReqLoginForm) =>
	http.post<Login.ResLogin>(urlPrefix + "/auth/signin", data, { noLoading: true });
// * 注册
export const registerApi = (data: Login.ReqLoginForm) => http.post(urlPrefix + "/auth/signup", data);
// * 退出登录
export const logoutApi = () => http.post(urlPrefix + "/auth/signout");
// * 刷新token
export const refreshTokenApi = () => http.post<ResultData>(urlPrefix + "/auth/refresh", {}, { noLoading: true });
// * 修改个人资料
export const updateUserInfoApi = (data: User.UpdateSelfParams) => http.put<User.Detail>(urlPrefix + "/profile", data);
// * 修改密码
export const updatePasswordApi = (data: User.UpdatePasswordParams) => http.put(urlPrefix + "/auth/password", data);
// * 获取个人信息
export const getUserInfoApi = () => http.get<User.Detail>(urlPrefix + "/auth/userInfo", {}, { noLoading: true });
// * 获取用户列表
export const getUserListApi = (params: User.GetListParams) => http.get<ResPage>(urlPrefix + setObjToUrlParams("/user", params));
// * 新建用户
export const createUserApi = (data: User.CreateUserParams) => http.post<User.Detail>(urlPrefix + "/user", data);
// * 编辑用户
export const updateUserApi = (id: number, data: Partial<User.CreateUserParams>) => http.put(urlPrefix + `/user/${id}`, data);
// * 删除用户
export const deleteUserApi = (id: number) => http.delete(urlPrefix + `/user/${id}`);
// * 禁用用户
export const disableUserApi = (id: number) => http.put(urlPrefix + `/user/disable/${id}`);
// * 启用用户
export const enableUserApi = (id: number) => http.put(urlPrefix + `/user/enable/${id}`);
// * 恢复用户
export const recoverUserApi = (id: number) => http.put(urlPrefix + `/user/recover/${id}`);
// * 导出用户
export const exportUserApi = (data: { ids: number[] }) => http.download(urlPrefix + "/user/export", data);
// * 批量删除用户
export const batchDeleteUserApi = (data: { ids: number[] }) => http.delete(urlPrefix + "/user/batch", data);
