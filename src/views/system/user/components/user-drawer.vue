<template>
	<el-drawer v-model="visible" size="450" :destroy-on-close="true" :close-on-click-modal="false" direction="rtl">
		<template #header>
			<h4>{{ drawerProps.title }}</h4>
		</template>
		<template #default>
			<el-form
				ref="formRef"
				:rules="rules"
				:hide-required-asterisk="drawerProps.type === OperateType.VIEW"
				:model="drawerProps.row"
				label-suffix="："
				:disabled="drawerProps.type === OperateType.VIEW"
				label-width="100px"
			>
				<el-form-item label="用户头像" prop="avatar">
					<basic-upload-image width="135px" height="135px" v-model:image-url="drawerProps.row.avatar" :file-size="3">
						<template #empty>
							<el-icon><Avatar /></el-icon>
							<span>请上传头像</span>
						</template>
						<template #tip> 头像大小不能超过 3M </template>
					</basic-upload-image>
				</el-form-item>
				<el-form-item label="用户名" prop="username">
					<el-input
						v-model="drawerProps.row.username"
						:disabled="drawerProps.type === OperateType.EDIT"
						placeholder="请输入用户名"
					/>
				</el-form-item>
				<el-form-item label="用户密码" prop="password" v-if="drawerProps.type === OperateType.ADD">
					<el-input v-model="drawerProps.row.password" type="password" show-password placeholder="请输入用户密码" />
				</el-form-item>
				<el-form-item label="用户昵称" prop="nickname">
					<el-input v-model="drawerProps.row.nickname" placeholder="请输入用户昵称" />
				</el-form-item>
				<el-form-item label="用户性别" prop="gender">
					<el-radio-group v-model="drawerProps.row.gender">
						<el-radio :label="GenderEnum.MALE">男</el-radio>
						<el-radio :label="GenderEnum.FEMALE">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="用户角色" prop="roleId">
					<el-select-v2 v-model="drawerProps.row.roleId" :options="roleOption" placeholder="请选择用户角色" />
				</el-form-item>
			</el-form>
		</template>
		<template #footer>
			<div style="flex: auto">
				<el-button @click="cancel">取消</el-button>
				<el-button type="primary" v-if="drawerProps.type !== OperateType.VIEW" @click="submit(formRef)">确认</el-button>
			</div>
		</template>
	</el-drawer>
</template>

<script setup lang="ts">
import { getAllRolesApi } from "@/api/modules/role";
import { GenderEnum } from "@/enums/common-enum";
import { Role } from "@/models/role-model";
import { reactive, ref, onMounted, computed } from "vue";
import { Avatar } from "@element-plus/icons-vue";
import { BasicUploadImage } from "@/components/basic/index";
import { ElNotification, FormInstance } from "element-plus";
import { ResultData } from "@/api/types";
import { OperateType } from "../config";
import { ResultEnum } from "@/enums/http-enum";
interface PropsType {
	title: string;
	row: any;
	api: (params: any, params2?: any) => Promise<ResultData>;
	getTableList: () => Promise<any>;
	type: OperateType;
}

const rules = reactive({
	avatar: [{ required: true, message: "请选择头像", trigger: "blur" }],
	username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
	password: [{ required: true, message: "请输入用户密码", trigger: "blur" }],
	nickname: [{ required: true, message: "请输入用户昵称", trigger: "blur" }],
	gender: [{ required: true, message: "请选择用户性别", trigger: "change" }],
	roleId: [{ required: true, message: "请选择用户角色", trigger: ["change", "blur"] }]
});
const formRef = ref<FormInstance | null>(null);

const drawerProps = reactive<Partial<PropsType>>({
	title: "",
	type: OperateType.ADD
});

const roleList = reactive<Role.Detail[]>([]);

const roleOption = computed(() => {
	return roleList.map(item => {
		return {
			label: item.name,
			value: item.id
		};
	});
});

const visible = ref(false);
const getAllRoles = async () => {
	const { data } = await getAllRolesApi();
	roleList.splice(0, roleList.length, ...data);
};

const submit = (formEl: FormInstance | null) => {
	if (!formEl) return;
	formEl.validate(async valid => {
		if (valid) {
			const { code } = await drawerProps.api!(drawerProps.row);
			if (code === ResultEnum.SUCCESS) {
				ElNotification({
					title: "提交成功",
					message: "提交成功",
					type: "success"
				});
				visible.value = false;
				drawerProps.getTableList!();
			}
		} else {
			ElNotification({
				title: "提交失败",
				message: "请检查表单信息是否符合规范",
				type: "error"
			});
			return false;
		}
	});
};

const cancel = () => {
	visible.value = false;
};
const acceptParams = (params: PropsType) => {
	Object.assign(drawerProps, params);
	visible.value = true;
};
//暴露给父组件的方法
defineExpose({
	acceptParams
});
onMounted(() => {
	getAllRoles();
});
</script>

<style scoped lang="scss">
.el-drawer {
	.el-select,
	.el-select-v2 {
		width: 100%;
	}
}
</style>
