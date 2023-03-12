import { BaseModel } from "./base-model";
import { Menu } from "./menu-model";
import { ReqPage } from "@/api/types";
export namespace Role {
	export interface GetListParams extends ReqPage {
		name?: string;
	}
	export interface CreateParams {
		name: string;
		menus: number[];
	}
	export interface Info extends BaseModel {
		name: string;
		identification: string;
		status: number;
	}
	export interface Detail extends Info {
		menus: Menu.ItemRaw[];
		permissions: Menu.PermissionRaw[];
	}
}
