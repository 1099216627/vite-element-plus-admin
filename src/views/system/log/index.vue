<template>
	<div class="base-container table-box">
		<basic-table
			ref="tableRef"
			title="角色列表"
			:search-col="{ xs: 1, sm: 1, md: 3, lg: 3, xl: 3 }"
			:columns="tableColumns"
			:requestApi="getLogListApi"
		>
			<template #tableHeader>
				<el-button type="danger" @click="deleteAllLog">删除全部日志</el-button>
			</template>
		</basic-table>
	</div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { BasicTable } from "@/components/basic";
import { getLogListApi, deleteAllLogApi } from "@/api/modules/log";
import { ColumnProps } from "@/components/basic/types";
import { Log } from "@/models/log-model";
import { useMessageBox } from "@/hooks/use-messagebox";
const tableRef = ref();
const deleteAllLog = () => {
	useMessageBox(deleteAllLogApi, null, "是否删除全部日志？，删除后不可恢复！").then(() => {
		tableRef.value?.getTableList();
	});
};
const requestMethod = reactive([
	{ label: "GET", value: "GET", tagType: "primary" },
	{ label: "POST", value: "POST", tagType: "success" },
	{ label: "PUT", value: "PUT", tagType: "warning" },
	{ label: "DELETE", value: "DELETE", tagType: "danger" }
]);

const tableColumns = reactive<ColumnProps<Log.Detail>[]>([
	{ label: "#", type: "index", width: 60 },
	{ label: "接口名称", prop: "name", search: { el: "input" } },
	{ label: "请求路径", prop: "path" },
	{
		label: "请求方法",
		prop: "method",
		tag: true,
		search: { el: "select" },
		enum: requestMethod,
		isFilterEnum: false
	},
	{ label: "请求IP", prop: "ip" },
	{ label: "IP地区", prop: "area" },
	{ label: "响应时长(ms)", prop: "time" },
	{ label: "状态码", prop: "code", tag: true },
	{ label: "操作人", prop: "user.username" }
]);
</script>

<style scoped></style>
