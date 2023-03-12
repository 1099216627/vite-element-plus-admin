<template>
	<el-drawer
		v-model="visible"
		:title="drawerState.title"
		direction="rtl"
		:destroy-on-close="true"
		:close-on-click-modal="false"
		:close-on-press-escape="false"
		size="450"
	>
		<el-form :rules="rules" :model="drawerState.rowData" label-suffix="：" ref="formRef" label-width="100px">
			<el-form-item label="资源封面" prop="cover">
				<basic-upload-image width="135px" height="135px" :file-size="3" v-model:image-url="drawerState.rowData!.cover">
					<template #empty>
						<el-icon><Avatar /></el-icon>
						<span>请上传封面</span>
					</template>
					<template #tip> 封面大小不能超过 3M </template>
				</basic-upload-image>
			</el-form-item>
			<el-form-item label="资源名称" prop="name">
				<el-input v-model="drawerState.rowData!.name" placeholder="请输入资源名称" />
			</el-form-item>
			<el-form-item label="资源描述" prop="description">
				<el-input
					resize="none"
					:rows="5"
					v-model="drawerState.rowData!.description"
					placeholder="请输入资源描述"
					type="textarea"
				/>
			</el-form-item>
			<el-form-item label="资源链接" prop="url">
				<el-input v-model="drawerState.rowData!.url" placeholder="请输入资源链接" />
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="visible = false">取消</el-button>
			<el-button type="primary" @click="submit(formRef)">提交</el-button>
		</template>
	</el-drawer>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { BasicUploadImage } from "@/components/basic";
import { Resources } from "@/models/resources-mode";
import { Avatar } from "@element-plus/icons-vue";
import { FormInstance } from "element-plus";
import { ResultEnum } from "@/enums/http-enum";
interface DrawerProps {
	title: string;
	api: (params: any) => Promise<any>;
	getTableList: () => void;
	rowData: Partial<Resources.Detail>;
}
const visible = ref(false);
const formRef = ref<FormInstance | null>(null);
const rules = reactive({
	cover: [{ required: true, message: "请上传封面", trigger: "blur" }],
	name: [{ required: true, message: "请输入资源名称", trigger: "blur" }],
	description: [{ required: true, message: "请输入资源描述", trigger: "blur" }],
	url: [{ required: true, message: "请输入资源链接", trigger: "blur" }]
});

const drawerState = reactive<Partial<DrawerProps>>({});
const acceptState = (state: Partial<DrawerProps>) => {
	Object.assign(drawerState, state);
	visible.value = true;
};

const submit = async (formInstance: FormInstance | null) => {
	if (!formInstance) return;
	formInstance.validate(async (valid: boolean) => {
		if (!valid) return;
		const { code } = await drawerState.api!(drawerState.rowData);
		if (code === ResultEnum.SUCCESS) {
			visible.value = false;
			drawerState.getTableList?.();
		}
	});
};

defineExpose({
	acceptState
});
</script>

<style scoped></style>
