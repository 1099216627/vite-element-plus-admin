import { GenderEnum, UserStatusEnum } from "@/enums/common-enum";
import { BaseModel } from "./base-model";
import { Role } from "./role-model";
import { ReqPage } from "@/api/types";
export namespace User {
	export interface GetListParams extends ReqPage {
		name?: string;
		roleId?: number;
		gender?: GenderEnum;
		status: UserStatusEnum;
	}

	export interface CreateUserParams {
		username: string;
		password: string;
		roleId?: number;
		gender?: GenderEnum;
		nickname?: string;
		avatar?: string;
	}

	export interface UpdateSelfParams {
		nickname: string;
		avatar?: string;
		phone?: string;
		email?: string;
		address?: string;
		gender: GenderEnum;
	}
	export interface UpdatePasswordParams {
		oldPassword: string;
		newPassword: string;
	}

	// * 用户信息
	export interface Profile {
		id: number;
		phone: string;
		nickname: string;
		avatar: string;
		email: string;
		address: string;
		gender: GenderEnum;
	}
	// * 基本信息
	export interface Info extends BaseModel {
		status: number;
		username: string;
		lastLoginTime: string;
		lastLoginArea: string;
	}
	// * 用户详情
	export interface Detail extends Info {
		profile: Profile;
		role: Role.Info;
	}
	// * 用户列表
	export type List = Detail[];
}
