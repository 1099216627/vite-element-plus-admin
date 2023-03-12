import { ReqPage, ResPage } from "@/api/types";
import { BaseModel } from "./base-model";

export namespace Resources {
	// * 获取资源列表参数
	export interface IGetListParams extends ReqPage {
		name?: string;
	}
	// * 获取资源列表返回数据
	export type IGetListResult = ResPage<Detail>;
	// * 新建资源参数
	export interface ICreateParams {
		name: string;
		cover: string;
		description: string;
		url: string;
	}

	// * 获取资源详情参数
	export interface Detail extends BaseModel {
		name: string;
		cover: string;
		description: string;
		url: string;
	}
}
