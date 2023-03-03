import { BooleanEnum } from "@/enums/common-enum";
import { BaseModel } from "./base-model";

export namespace Menu {
	export interface ItemRaw extends BaseModel {
		name: string;
		title: string;
		icon: string;
		path: string;
		sort: number;
		component: string;
		pid: number | null;
		link: BooleanEnum;
		hidden: BooleanEnum;
		cache: BooleanEnum;
		affix: BooleanEnum;
		redirect: string | null;
		key: string;
	}

	export interface AppRouteRaw {
		name: string;
		path: string;
		component: string | (() => Promise<typeof import("*.vue")>) | undefined;
		redirect: string | null;
		meta: {
			title: string;
			icon: string;
			sort: number;
			link: BooleanEnum;
			hidden: BooleanEnum;
			cache: BooleanEnum;
			affix: BooleanEnum;
		};
		children?: AppRouteRaw[];
	}
}
