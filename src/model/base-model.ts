import { IsDefaultEnum } from "@/enums/common-enum";

export interface BaseModel {
	id: number;
	createdAt: string;
	updatedAt: string;
	isDefault: IsDefaultEnum;
}
