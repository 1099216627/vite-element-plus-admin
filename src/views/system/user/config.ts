import { ColumnProps, EnumProps } from "@/components/basic/types";
import { GenderEnum, UserStatusEnum } from "@/enums/common-enum";
import { User } from "@/models/user-model";
import { h } from "vue";
import SvgIcon from "@/components/svg-icon/index.vue";
import { getAllRolesApi } from "../../../api/modules/role";

export enum OperateType {
	ADD = "add",
	EDIT = "edit",
	VIEW = "view"
}
/**
 * 	{
		label: "状态", //表头
		prop: "status", //字段
		search: { el: "input" }, //是否加入到搜索区域，配置（SearchProps）：
		fixed: "left", //固定列
		width: 150, //列宽
		tag: true, // 标签显示
		enum: statusType, //枚举，根据枚举值显示对应的标签
		isShow: true, //是否显示
		isFilterEnum: true, //是否根据枚举值过滤显示，默认为true
		fieldNames: { label: "label", value: "value" } //枚举值的字段名
		// headerRender:()=>{h()} tsx或h方法渲染表头
		// render:()=>{h()} tsx或h方法渲染表格内容
	}
 */
const statusType: EnumProps[] = [
	{ label: "启用", value: UserStatusEnum.ENABLE, tagType: "success" },
	{ label: "禁用", value: UserStatusEnum.DISABLE, tagType: "warning" },
	{ label: "删除", value: UserStatusEnum.DELETE, tagType: "danger" }
];
const genderType: EnumProps[] = [
	{ label: "男", value: GenderEnum.MALE },
	{ label: "女", value: GenderEnum.FEMALE }
];
export const tableColumns: ColumnProps<User.Detail>[] = [
	{ type: "index", fixed: "left", width: 80, label: "#" },
	{ type: "selection", fixed: "left", width: 80 },
	{ label: "用户名", prop: "username", search: { el: "input", key: "name", props: { placeholder: "请输入用户名或昵称" } } },
	{
		label: "性别",
		prop: "role.gender",
		enum: genderType,
		search: { el: "select", props: { filterable: true } },
		render: ({ row }) =>
			row.profile.gender === GenderEnum.FEMALE
				? h(SvgIcon, { name: "female", style: { margin: "auto" } })
				: h(SvgIcon, { name: "male", style: { margin: "auto" } })
	},
	{
		label: "所属角色",
		prop: "role.name",
		enum: getAllRolesApi,
		fieldNames: { label: "name", value: "id" },
		isFilterEnum: false,
		search: {
			el: "select-v2",
			key: "roleId",
			props: { filterable: true }
		}
	},
	{ label: "昵称", prop: "profile.nickname" },
	{ label: "邮箱", prop: "profile.email" },
	{ label: "手机号", prop: "profile.phone" },
	{ label: "地址", prop: "profile.address" },
	{ label: "状态", prop: "status", search: { el: "select", props: { filterable: true } }, tag: true, enum: statusType },
	{ label: "创建时间", prop: "createdAt" },
	{ label: "更新时间", prop: "updatedAt" },
	{ prop: "operation", label: "操作", fixed: "right", width: 200 }
];
