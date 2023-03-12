<template>
	<el-form :rules="rules" ref="formRef" :model="model" label-suffix="：" class="w-[450px]" label-width="100px">
		<el-form-item label="头像" prop="avatar">
			<basic-upload-image v-model:image-url="model.avatar" width="135px" height="135px" :file-size="3">
				<template #empty>
					<el-icon><Avatar /></el-icon>
					<span>请上传头像</span>
				</template>
				<template #tip>头像大小不能超过 3M </template>
			</basic-upload-image>
		</el-form-item>
		<el-form-item label="昵称" prop="nickname">
			<el-input v-model="model.nickname" placeholder="请输入昵称" />
		</el-form-item>
		<el-form-item label="性别" prop="gender">
			<el-radio-group v-model="model.gender">
				<el-radio :label="GenderEnum.MALE">男</el-radio>
				<el-radio :label="GenderEnum.FEMALE">女</el-radio>
			</el-radio-group>
		</el-form-item>
		<el-form-item label="手机号" prop="phone">
			<el-input v-model="model.phone" placeholder="请输入手机号" />
		</el-form-item>
		<el-form-item label="邮箱" prop="email">
			<el-input v-model="model.email" placeholder="请输入邮箱" />
		</el-form-item>
		<el-form-item label="地址" prop="address">
			<el-input v-model="model.address" placeholder="请输入地址" />
		</el-form-item>
		<el-form-item>
			<el-button type="primary" @click="submit">保存</el-button>
		</el-form-item>
	</el-form>
</template>

<script setup lang="ts">
import { useUserStore } from "@/store/modules/user";
import { updateUserInfoApi } from "@/api/modules/user";
import { computed, reactive, ref } from "vue";
import { User } from "@/models/user-model";
import { GenderEnum } from "@/enums/common-enum";
import { BasicUploadImage } from "@/components/basic";
import { validateEmail, validateNickname, validatePhone } from "@/utils/validate";
import { Avatar } from "@element-plus/icons-vue";
const userStore = useUserStore();
const profile = computed(() => userStore.userInfo!.profile);

const formRef = ref();
const rules = reactive({
	avatar: [{ required: false, message: "请上传头像", trigger: "blur" }],
	nickname: [{ required: true, validator: validateNickname, trigger: "blur" }],
	phone: [{ required: false, validator: validatePhone, trigger: "blur" }],
	email: [{ required: false, validator: validateEmail, trigger: "blur" }],
	address: [{ required: false, message: "请输入地址", trigger: "blur" }],
	gender: [{ required: true, message: "请选择性别", trigger: "blur" }]
});
type Model = Omit<User.Profile, "id">;
const model = reactive<Model>({
	avatar: profile.value.avatar,
	nickname: profile.value.nickname,
	phone: profile.value.phone,
	email: profile.value.email,
	address: profile.value.address,
	gender: profile.value.gender
});

const submit = () => {
	formRef.value.validate(async (valid: boolean) => {
		if (valid) {
			await updateUserInfoApi(model);
			userStore.getUserInfo();
		}
	});
};
</script>

<style scoped></style>
