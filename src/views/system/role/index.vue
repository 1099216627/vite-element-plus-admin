<template>
	<div class="base-container table-box">
		<basic-table
			ref="tableRef"
			title="角色列表"
			:search-col="{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2 }"
			:columns="tableColumns"
			:requestApi="getRolesApi"
		>
			<!-- 表格 header 按钮 -->
			<template #tableHeader>
				<el-button type="primary" plain v-auth="'create_user'" @click="openDialog('新增角色', createRoleApi)">新增角色</el-button>
			</template>
			<!-- 表格expand -->
			<template #expand="{ row }">
				<!-- 菜单名称 -->
				<div class="px-[20px]" v-if="row.menus.length">
					拥有菜单：<el-tag class="m-[5px]" v-for="menu in row.menus" :key="menu.id">{{ menu.title }}</el-tag>
				</div>
				<div class="px-[20px]" v-if="row.permissions.length">
					拥有权限：<el-tag class="m-[5px]" type="success" v-for="permission in row.permissions" :key="permission.id">{{
						permission.title
					}}</el-tag>
				</div>
				<p v-if="!row.menus.length && !row.permissions.length">该角色暂无任何权限及菜单，请尽快设置</p>
			</template>
			<!-- 表格操作 -->
			<template #operation="{ row }">
				<el-button
					link
					type="primary"
					v-auth="'update_user'"
					@click="openDialog('编辑角色', (params: any) => updateRoleApi(row.id, params), row)"
					>编辑</el-button
				>
				<el-button link type="warning" v-auth="'delete_user'" @click="assignRole(row)">分配权限</el-button>
				<el-button v-if="row.status === BooleanEnum.YES" link type="warning" @click="updateRoleStatus(row.id, lockRoleApi, true)"
					>锁定
				</el-button>
				<el-button v-else link type="success" @click="updateRoleStatus(row.id, unlockRoleApi, false)">解锁</el-button>
				<el-button link type="danger" v-auth="'delete_user'" @click="deleteRole(row.id)">删除</el-button>
			</template>
		</basic-table>
		<!-- 创建、编辑角色dialog -->
		<role-dialog ref="roleRef"></role-dialog>
		<!-- 分配权限 -->
		<el-dialog
			v-model="visible"
			:close-on-click-modal="false"
			title="分配权限"
			:close-on-press-escape="false"
			draggable
			:destroy-on-close="true"
			width="600px"
			@closed="closeDialog"
		>
			<el-checkbox-group v-model="selectionPermissions">
				<el-checkbox v-for="item in permissionList" :key="item.id" :label="item.id">
					{{ item.title }}
				</el-checkbox>
			</el-checkbox-group>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="visible = false">取消</el-button>
					<el-button type="primary" @click="submit"> 确认 </el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import {
	getRolesApi,
	createRoleApi,
	updateRoleApi,
	assignRoleApi,
	deleteRoleApi,
	lockRoleApi,
	unlockRoleApi
} from "@/api/modules/role";
import { BooleanEnum } from "@/enums/common-enum";
import { tableColumns } from "./config";
import { BasicTable } from "@/components/basic";
import { getAllMenusApi, getAllPermissionsApi } from "@/api/modules/menu";
import { onMounted, reactive, ref } from "vue";
import { floatToTree } from "@/utils";
import roleDialog from "./components/role-dialog.vue";
import { useMessageBox } from "@/hooks/use-messagebox";
import { Role } from "@/models/role-model";
import { Menu } from "@/models/menu-model";
import { ResultEnum } from "@/enums/http-enum";
const tableRef = ref<InstanceType<typeof BasicTable>>();
const menuList = reactive<any[]>([]);
const permissionList = reactive<Menu.PermissionRaw[]>([]);
const roleRef = ref();
const visible = ref(false);
const selectionPermissions = ref<number[]>([]);
let roleId = ref(0);

const openDialog = (title: string, api: (params: any) => Promise<any>, row?: Role.Detail) => {
	roleRef.value.acceptState({
		title,
		model: {
			name: row?.name || "",
			menus: row?.menus.map(item => item.id) || []
		},
		api,
		menuList,
		getTableList: tableRef.value!.getTableList
	});
};

const assignRole = async (row: Role.Detail) => {
	visible.value = true;
	roleId.value = row.id;
	selectionPermissions.value = row.permissions.map(item => item.id);
};

const submit = async () => {
	const { code } = await assignRoleApi(roleId.value, { permissions: selectionPermissions.value });
	if (code === ResultEnum.SUCCESS) {
		closeDialog();
		tableRef.value!.getTableList();
	}
};

const closeDialog = () => {
	visible.value = false;
	roleId.value = 0;
	selectionPermissions.value = [];
};

const deleteRole = (id: number) => {
	console.log(id);
	useMessageBox(deleteRoleApi, id, "删除该角色后，所有角色将转移到用户角色下，是否确认？").then(() => {
		tableRef.value!.getTableList();
	});
};
const updateRoleStatus = (id: number, api: (params: any) => Promise<any>, isLock: boolean) => {
	let message = isLock ? "锁定后，该角色将无法分配用户或操作，是否确认？" : "解锁后，该角色将可以重新分配用户或操作，是否确认？";
	useMessageBox(api, id, message).then(() => {
		tableRef.value!.getTableList();
	});
};

onMounted(async () => {
	const { data } = await getAllMenusApi();
	const { data: permissionData } = await getAllPermissionsApi();
	menuList.splice(0, menuList.length, ...floatToTree(data));
	permissionList.splice(0, permissionList.length, ...permissionData);
});
</script>

<style scoped></style>
