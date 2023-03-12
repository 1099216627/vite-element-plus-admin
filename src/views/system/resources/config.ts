import { ColumnProps } from "@/components/basic/types";
import { Resources } from "@/models/resources-mode";
import { ElLink } from "element-plus";
import { h } from "vue";
export const columns: ColumnProps<Resources.Detail>[] = [
	{ label: "#", type: "index", width: 60, fixed: "left" },
	{ label: "资源名称", prop: "name" },
	{ label: "资源封面", prop: "cover", type: "image" },
	{ label: "资源描述", prop: "description" },
	{
		label: "资源链接",
		prop: "url",
		render: ({ row }) => {
			return h(ElLink, { type: "primary", href: row.url, target: "_blank", underline: false }, () => row.url);
		}
	},
	{ label: "创建时间", prop: "createdAt" },
	{ label: "更新时间", prop: "updatedAt" },
	{ label: "操作", prop: "operation", width: 200, fixed: "right" }
];
