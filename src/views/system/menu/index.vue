<template>
	<div class="base-container table-box">
		<basic-table
			ref="tableRef"
			title="角色列表"
			:search-col="{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2 }"
			:columns="tableColumns"
			:requestApi="getAllMenusApi"
			:pagination="false"
		></basic-table>
	</div>
</template>

<script setup lang="ts">
import { getAllMenusApi } from "@/api/modules/menu";
import { h, reactive, ref } from "vue";
import { BasicTable } from "@/components/basic";
import { ColumnProps } from "@/components/basic/types";
import { Menu } from "@/models/menu-model";
import SvgIcon from "@/components/svg-icon/index.vue";

const tableRef = ref();

const booleanEnum = [
	{ label: "是", value: 1, tagType: "success" },
	{ label: "否", value: 0, tagType: "danger" }
];

const tableColumns = reactive<ColumnProps<Menu.ItemRaw>[]>([
	{ label: "#", type: "index", width: 60 },
	{ label: "菜单名称", prop: "title" },
	{
		label: "菜单图标",
		prop: "icon",
		render: ({ row }) => h("div", { class: "flex justify-center" }, [h(SvgIcon, { name: row.icon })]),
		width: 100
	},
	{ label: "菜单路径", prop: "path" },
	{ label: "外链", prop: "link", tag: true, enum: booleanEnum },
	{ label: "隐藏", prop: "hidden", tag: true, enum: booleanEnum },
	{ label: "缓存", prop: "cache", tag: true, enum: booleanEnum },
	{ label: "固定", prop: "affix", tag: true, enum: booleanEnum },
	{ label: "创建时间", prop: "createdAt" },
	{ label: "更新时间", prop: "updatedAt" }
]);
</script>

<style scoped></style>
