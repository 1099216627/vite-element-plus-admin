<template>
	<el-form :model="formModel" ref="formRef" :rules="rules" label-suffix="：" label-width="100px" class="w-[450px]">
		<el-form-item label="愿密码" prop="oldPassword">
			<el-input v-model="formModel.oldPassword" placeholder="请输入原密码" type="password" show-password />
		</el-form-item>
		<el-form-item label="新密码" prop="newPassword">
			<el-input v-model="formModel.newPassword" placeholder="请输入新密码" type="password" show-password />
		</el-form-item>
		<el-form-item label="确认密码" prop="confirmPassword">
			<el-input v-model="formModel.confirmPassword" placeholder="请再次输入新密码" type="password" show-password />
		</el-form-item>
		<el-form-item>
			<el-button type="primary" @click="submit">保存</el-button>
		</el-form-item>
	</el-form>
</template>

<script setup lang="ts">
import { updatePasswordApi } from "@/api/modules/user";
import { validatePassword } from "@/utils/validate";
import { reactive, ref } from "vue";
const formRef = ref();
const validateConfirmPassword = (rule: any, value: string, callback: any) => {
	if (!value) {
		return callback(new Error("请输入确认密码"));
	} else {
		if (formModel.confirmPassword !== formModel.newPassword) {
			callback(new Error("两次输入密码不一致"));
		} else {
			callback();
		}
	}
};

const formModel = reactive({
	oldPassword: "",
	newPassword: "",
	confirmPassword: ""
});

const rules = reactive({
	oldPassword: [{ required: true, validator: validatePassword, trigger: "blur" }],
	newPassword: [{ required: true, validator: validatePassword, trigger: "blur" }],
	confirmPassword: [{ required: true, validator: validateConfirmPassword, trigger: "blur" }]
});

const submit = () => {
	formRef.value.validate(async (valid: boolean) => {
		if (valid) {
			await updatePasswordApi(formModel);
		}
	});
};
</script>

<style scoped></style>
