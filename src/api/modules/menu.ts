import http, { urlPrefix } from "../index";
import { Menu } from "@/models/menu-model";

// * 获取用户菜单及权限
export const getUserMenusApi = () => http.get<Menu.MenusAndPermissions>(urlPrefix + "/menu/user", {}, { noLoading: true });

// * 获取全部菜单
export const getAllMenusApi = () => http.get(urlPrefix + "/menu", {}, { noLoading: true });
// * 获取全部权限
export const getAllPermissionsApi = () =>
	http.get<Menu.PermissionRaw[]>(urlPrefix + "/menu/permissions", {}, { noLoading: true });
