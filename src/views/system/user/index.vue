<template>
	<div class="base-container table-box">
		<basic-table ref="tableRef" title="用户列表" :columns="tableColumns" :requestApi="getUserListApi">
			<!-- 表格 header 按钮 -->
			<template #tableHeader="scope">
				<el-button type="primary" plain v-auth="'create_user'" @click="openDrawer('新增用户')">新增用户</el-button>
				<el-button type="primary" plain v-auth="'export_user'" :disabled="!scope.isSelected" @click="exportUser"
					>导出用户数据</el-button
				>
				<el-button type="danger" plain v-auth="'delete_user'" :disabled="!scope.isSelected" @click="batchDeleteUser">
					批量删除用户
				</el-button>
			</template>
			<!-- 表格操作 -->
			<template #operation="{ row }">
				<el-button type="primary" link @click="openDrawer('查看用户', row, OperateType.VIEW)">查看</el-button>
				<el-button type="primary" link v-auth="'update_user'" @click="openDrawer('编辑用户', row, OperateType.EDIT)"
					>编辑</el-button
				>
				<el-button type="danger" link v-auth="'delete_user'" @click="deleteUser(row)" v-if="row.status === UserStatusEnum.ENABLE"
					>删除</el-button
				>
				<el-button
					type="success"
					link
					v-auth="'enable_user'"
					@click="enableUser(row)"
					v-if="row.status === UserStatusEnum.DISABLE"
					>启用</el-button
				>
				<el-button
					type="warning"
					v-auth="'disable_user'"
					link
					@click="disableUser(row)"
					v-if="row.status === UserStatusEnum.ENABLE"
					>禁用</el-button
				>
				<el-button
					type="primary"
					v-auth="'recover_user'"
					link
					@click="recoverUser(row)"
					v-if="row.status === UserStatusEnum.DELETE"
					>恢复</el-button
				>
			</template>
		</basic-table>
		<!-- 创建、编辑用户抽屉 -->
		<user-drawer ref="userDrawerRef"></user-drawer>
	</div>
</template>

<script setup lang="ts">
import {
	getUserListApi,
	createUserApi,
	updateUserApi,
	deleteUserApi,
	enableUserApi,
	disableUserApi,
	recoverUserApi,
	batchDeleteUserApi,
	exportUserApi
} from "@/api/modules/user";
import { BasicTable } from "@/components/basic/index";
import { OperateType, tableColumns } from "./config";
import UserDrawer from "./components/user-drawer.vue";
import { ref } from "vue";
import { User } from "@/models/user-model";
import { useMessageBox } from "@/hooks/use-messagebox";
import { UserStatusEnum } from "@/enums/common-enum";
const userDrawerRef = ref();
const tableRef = ref();
const openDrawer = (title: string, row: Partial<User.Detail> = {}, type: OperateType = OperateType.ADD) => {
	const isNotEmpty = Object.keys(row).length;
	let rowData: any = {};
	if (isNotEmpty) {
		rowData.username = row.username;
		rowData.nickname = row.profile?.nickname;
		rowData.gender = row.profile?.gender;
		rowData.roleId = row.role?.id;
		rowData.avatar = row.profile?.avatar;
	}
	userDrawerRef.value.acceptParams({
		title,
		row: rowData,
		api:
			title === "新增用户" ? createUserApi : title === "编辑用户" ? (params: any) => updateUserApi(row.id as number, params) : "",
		getTableList: tableRef.value.getTableList,
		type
	});
};

const deleteUser = (row: User.Detail) => {
	useMessageBox(deleteUserApi, row.id, `是否确认删除${row.profile.nickname}用户？删除后将禁止任何操作！`, "warning").then(() => {
		tableRef.value.getTableList();
	});
};

const enableUser = (row: User.Detail) => {
	useMessageBox(enableUserApi, row.id, `是否确认启用${row.profile.nickname}用户？`, "warning").then(() => {
		tableRef.value.getTableList();
	});
};

const disableUser = (row: User.Detail) => {
	useMessageBox(disableUserApi, row.id, `是否确认禁用${row.profile.nickname}用户？`, "warning").then(() => {
		tableRef.value.getTableList();
	});
};

const recoverUser = (row: User.Detail) => {
	useMessageBox(recoverUserApi, row.id, `是否确认恢复${row.profile.nickname}用户？`, "warning").then(() => {
		tableRef.value.getTableList();
	});
};

const exportUser = async () => {
	const { data } = await exportUserApi({ ids: tableRef.value.selectedListIds });
	const blob = new Blob([data], { type: "application/vnd.ms-excel" });
	const fileName = "用户数据.xlsx";
	if ("download" in document.createElement("a")) {
		// 非IE下载
		const elink = document.createElement("a");
		elink.download = fileName;
		elink.style.display = "none";
		elink.href = URL.createObjectURL(blob);
		document.body.appendChild(elink);
		elink.click();
		URL.revokeObjectURL(elink.href);
		document.body.removeChild(elink);
	}
};

const batchDeleteUser = () => {
	useMessageBox(
		batchDeleteUserApi,
		{ ids: tableRef.value.selectedListIds },
		`是否确认删除选中的${tableRef.value.selectedListIds.length}条用户？删除后将禁止任何操作！`,
		"warning"
	).then(() => {
		tableRef.value.clearSelection();
	});
};
</script>

<style scoped></style>
