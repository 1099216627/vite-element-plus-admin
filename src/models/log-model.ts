import { BaseModel } from "../models/base-model";
import { User } from "@/models/user-model";
import { ReqPage } from "@/api/types";

export namespace Log {
	export interface GetListParams extends ReqPage {
		name?: string;
		method?: string;
	}
	export interface Detail extends BaseModel {
		name: string;
		path: string;
		method: string;
		ip: string;
		area: string;
		time: number;
		code: number;
		user: User.Detail[];
	}
}
