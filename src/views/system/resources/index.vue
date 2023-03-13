<template>
	<div class="base-container table-box">
		<basic-table ref="tableRef" :requestApi="getResourcesListApi" :columns="columns">
			<template #tableHeader>
				<el-button type="primary" v-auth="'create_resource'" plain @click="openDrawer('新建资源', createResourcesApi)"
					>新建资源</el-button
				>
			</template>
			<template #operation="{ row }">
				<el-button
					type="primary"
					link
					plain
					v-auth="'update_resource'"
					@click="openDrawer('编辑资源', (params: any) => updateResourcesApi(row.id, params), row)"
					>编辑</el-button
				>
				<el-button type="danger" v-auth="'delete_resource'" link plain @click="deleteResources(row)">删除</el-button>
			</template>
		</basic-table>
		<!-- 新建、编辑资源 -->
		<resources-drawer ref="drawerRef"></resources-drawer>
	</div>
</template>

<script setup lang="ts">
import { BasicTable } from "@/components/basic";
import { getResourcesListApi, createResourcesApi, updateResourcesApi, deleteResourcesApi } from "@/api/modules/resources";
import { ref } from "vue";
import { columns } from "./config";
import resourcesDrawer from "./components/resources-drawer.vue";
import { useMessageBox } from "@/hooks/use-messagebox";
import { Resources } from "@/models/resources-mode";
const tableRef = ref();
const drawerRef = ref();

const openDrawer = (title: string, api: any, rowData?: any) => {
	const row: any = {};
	if (rowData) {
		row.name = rowData.name;
		row.description = rowData.description;
		row.url = rowData.url;
		row.cover = rowData.cover;
	}
	drawerRef.value.acceptState({
		title,
		api,
		getTableList: () => {
			tableRef.value.getTableList();
		},
		rowData: row
	});
};
const deleteResources = async (row: Resources.Detail) => {
	useMessageBox(deleteResourcesApi, row.id, `是否确认删除资源${row.name}？删除后不可恢复！`).then(() => {
		tableRef.value.getTableList();
	});
};
</script>

<style scoped></style>
