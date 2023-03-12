<template>
	<el-dialog
		v-model="visible"
		:close-on-click-modal="false"
		:title="dialogState.title"
		:close-on-press-escape="false"
		draggable
		:destroy-on-close="true"
		width="600px"
	>
		<el-form ref="formRef" :rules="rules" :model="dialogState.model" label-suffix="：" label-width="100px">
			<el-form-item label="角色名称" prop="name">
				<el-input placeholder="请输入角色名称" v-model="dialogState.model!.name"></el-input>
			</el-form-item>
			<el-form-item label="角色菜单" prop="menus">
				<el-tree
					ref="treeRef"
					@check-change="handleSelection"
					:props="treeProps"
					node-key="id"
					show-checkbox
					:data="menuTree"
				></el-tree>
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="visible = false">取消</el-button>
				<el-button type="primary" @click="submit(formRef)"> 确认 </el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { ResultEnum } from "@/enums/http-enum";
import { ElTree, FormInstance } from "element-plus";
import { reactive, ref, nextTick } from "vue";

interface DialogState {
	title: string;
	model: {
		name: string;
		menus: number[];
	};
}
interface roleProps {
	model: DialogState["model"];
	api: (params?: any) => Promise<any>;
	title: string;
	menuList: any[];
	getTableList: () => void;
}
const visible = ref(false);
const dialogState = reactive<Partial<roleProps>>({});
const formRef = ref<FormInstance | null>(null);
const treeRef = ref<InstanceType<typeof ElTree>>();
const validateMenus = (rule: any, value: any, callback: any) => {
	if (dialogState.model?.menus.length === 0) {
		callback(new Error("请选择角色菜单"));
	} else {
		callback();
	}
};
const rules = reactive({
	name: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
	menus: [{ required: true, validator: validateMenus, trigger: "change" }]
});
const menuTree = reactive<any[]>([]);
const treeProps = reactive({
	children: "children",
	label: "title"
});

const handleSelection = () => {
	const checkedKeys = treeRef.value!.getCheckedKeys();
	const checkHalfKeys = treeRef.value!.getHalfCheckedKeys();
	const ids = [...checkedKeys, ...checkHalfKeys];
	dialogState.model?.menus.splice(0, dialogState.model.menus.length, ...(ids as number[]));
};

const submit = async (formRef: FormInstance | null) => {
	if (!formRef) return;
	const { validate } = formRef;
	validate(async (valid: boolean) => {
		if (valid) {
			try {
				const { code } = await dialogState.api!(dialogState.model);
				if (code == ResultEnum.SUCCESS) {
					visible.value = false;
					dialogState.getTableList?.();
				}
			} catch (error) {
				console.log(error);
			}
		} else {
			return false;
		}
	});
};
const acceptState = (state: roleProps) => {
	Object.assign(dialogState, state);
	menuTree.splice(0, menuTree.length, ...state.menuList);
	visible.value = true;
	nextTick(() => {
		if (state.model.menus.length > 0 && state.menuList.length > 0) {
			const ids = getChildrenIds(state.menuList);
			const keys =
				state.model.menus.map(item => {
					if (ids.includes(item)) {
						return item;
					}
				}) || [];
			treeRef.value!.setCheckedKeys(keys as number[]);
		}
	});
};

const getChildrenIds = (data: any[]) => {
	const ids: number[] = [];
	data.forEach(item => {
		if (!item.children) {
			ids.push(item.id);
		} else {
			ids.push(...getChildrenIds(item.children));
		}
	});
	return ids;
};
defineExpose({
	acceptState
});
</script>

<style scoped></style>
