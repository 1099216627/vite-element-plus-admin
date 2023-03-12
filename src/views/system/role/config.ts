import { ColumnProps } from "@/components/basic/types";
import { Role } from "@/models/role-model";
const roleStatus = [
	{ label: "正常", value: 1, tagType: "success" },
	{ label: "锁定", value: 0, tagType: "danger" }
];

export const tableColumns: ColumnProps<Role.Detail>[] = [
	{ label: "#", type: "index", fixed: "left", width: 80 },
	{ type: "expand", width: 80, label: "权限" },
	{ label: "角色名称", prop: "name", search: { el: "input" } },
	{ label: "角色状态", prop: "status", enum: roleStatus, tag: true },
	{ label: "创建时间", prop: "createdAt" },
	{ label: "更新时间", prop: "updatedAt" },
	{ label: "操作", prop: "operation", fixed: "right", width: 250 }
];
