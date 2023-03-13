<template>
	<div class="login w-full h-full relative bg-cover">
		<div class="login-plane absolute flex items-center justify-evenly">
			<div class="login-plane-right"></div>

			<div class="login-plane-form">
				<div class="login-plane-form-title flex items-center my-[30px]">
					<img src="@/assets/vue.svg" class="w-[80px]" alt="" />
					<p class="text-[40px] ml-[20px]">Jerry-Vue-Admin</p>
				</div>
				<el-form :model="registerModel" size="large" :rules="rules" ref="formRef">
					<el-form-item prop="username">
						<el-input v-model="registerModel.username" placeholder="请输入用户名" :suffix-icon="User"
					/></el-form-item>
					<el-form-item prop="password">
						<el-input type="password" show-password v-model="registerModel.password" placeholder="请输入密码"
					/></el-form-item>
					<el-form-item prop="passwordConfirm">
						<el-input type="password" show-password v-model="registerModel.passwordConfirm" placeholder="请输入密码"
					/></el-form-item>
					<el-form-item prop="code">
						<div class="flex justify-between w-full">
							<el-input v-model="registerModel.code" placeholder="请输入验证码" class="flex-1 mr-3" />
							<img class="cursor-pointer" @click="getCaptcha" :src="captchaImg" />
						</div>
					</el-form-item>
				</el-form>
				<div class="flex justify-between">
					<el-button link @click="toLogin">前往登录</el-button>
					<el-button class="w-[36%]" type="primary" @click="register">注册</el-button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { User } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { getCaptchaApi } from "@/api/modules/user";
import { useUserStore } from "@/store/modules/user";
import { validatePassword, validateUsername } from "@/utils/validate";
const userStore = useUserStore();
const router = useRouter();
const captchaImg = ref("");
const registerModel = reactive({
	username: "",
	password: "",
	passwordConfirm: "",
	code: "",
	codeId: ""
});
let formRef = ref();
const validatePasswordConfirm = (rule: any, value: string, callback: any) => {
	if (registerModel.passwordConfirm !== registerModel.password) {
		callback(new Error("两次输入密码不一致!"));
	} else {
		callback();
	}
};
const rules = reactive({
	username: [{ required: true, validator: validateUsername, trigger: "blur" }],
	password: [{ required: true, validator: validatePassword, trigger: "blur" }],
	passwordConfirm: [{ required: true, validator: validatePasswordConfirm, trigger: "blur" }],
	code: [{ required: true, message: "请输入验证码", trigger: "blur" }]
});
const register = async () => {
	formRef.value.validate(async (valid: boolean) => {
		if (valid) {
			try {
				await userStore.register(registerModel);
				router.push("/dashboard");
			} catch (error) {
				getCaptcha();
				registerModel.code = "";
			}
		}
	});
};

const toLogin = () => {
	router.push("/login");
};
const getCaptcha = async () => {
	const { data } = await getCaptchaApi();
	captchaImg.value = data.img;
	registerModel.codeId = data.id;
};
onMounted(() => {
	getCaptcha();
});
</script>
<style scoped lang="scss">
.login {
	background-image: url("@/assets/images/login/bg.jpg");
	&-plane {
		top: 3vh;
		left: 2vw;
		width: 96vw;
		height: 94vh;
		background-color: rgb(255 255 255 / 80%);
		border-radius: 10px;
		@media screen and (max-width: 768px) {
			background-image: url("@/assets/images/login/plane.svg");
			background-repeat: no-repeat;
			background-size: contain;
		}
		@apply max-md:w-full h-full left-0 top-0;
		&-form {
			width: 500px;
			padding: 40px;
			background-color: #ffffff;
			border-radius: 10px;
			box-shadow: 2px 3px 7px rgb(0 0 0 / 20%);
		}
		&-right {
			float: right !important;
			width: 40%;
			height: 60%;
			background-image: url("@/assets/images/login/plane.svg");
			background-size: cover;
			@apply max-md:hidden;
		}
	}
}
</style>
