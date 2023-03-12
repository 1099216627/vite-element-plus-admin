import { http } from "../index";
import { ResultData } from "@/api/types";
import { RequestEnum } from "@/enums/http-enum";
import { Menu } from "@/models/menu-model";

// * 获取用户菜单及权限
export function getUserMenusApi() {
	return http.request<ResultData<Menu.MenusAndPermissions>>({
		url: "/menu/user",
		method: RequestEnum.GET
	});
}

// * 获取全部菜单
export function getAllMenusApi() {
	return http.request<ResultData<Menu.ItemRaw[]>>({
		url: "/menu",
		method: RequestEnum.GET
	});
}
// * 获取全部权限
export function getAllPermissionsApi() {
	return http.request<ResultData<Menu.PermissionRaw[]>>({
		url: "/menu/permissions",
		method: RequestEnum.GET
	});
}
