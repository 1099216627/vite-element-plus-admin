<template>
	<div class="login w-full h-full relative bg-cover">
		<div class="login-plane absolute flex items-center justify-evenly">
			<div class="login-plane-form">
				<div class="login-plane-form-title flex items-center my-[30px]">
					<img src="@/assets/vue.svg" class="w-[80px]" alt="" />
					<p class="text-[40px] ml-[20px]">Jerry-Vue-Admin</p>
				</div>
				<el-form :model="loginModel" size="large" ref="formRef" :rules="rules">
					<el-form-item prop="username">
						<el-input v-model="loginModel.username" placeholder="请输入用户名" :suffix-icon="User"
					/></el-form-item>
					<el-form-item prop="password">
						<el-input type="password" show-password v-model="loginModel.password" placeholder="请输入密码"
					/></el-form-item>
					<el-form-item prop="code">
						<div class="flex justify-between w-full">
							<el-input v-model="loginModel.code" placeholder="请输入验证码" class="flex-1 mr-3" />
							<img class="cursor-pointer" @click="getCaptcha" :src="captchaImg" />
						</div>
					</el-form-item>
				</el-form>
				<div class="flex">
					<el-button link @click="register">前往注册</el-button>
					<el-checkbox v-model="loginModel.sevenDays" class="ml-auto">7日免登录</el-checkbox>
					<el-button class="w-[36%] ml-[10px]" type="primary" @click="login">登录</el-button>
				</div>
			</div>
			<div class="login-plane-right"></div>
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
const loginModel = reactive({
	username: "feng1997",
	password: "feng1997!",
	code: "",
	codeId: "",
	sevenDays: false
});
let formRef = ref();
const rules = reactive({
	username: [{ required: true, validator: validateUsername, trigger: "blur" }],
	password: [{ required: true, validator: validatePassword, trigger: "blur" }],
	code: [{ required: true, message: "请输入验证码", trigger: "blur" }]
});
const login = async () => {
	formRef.value.validate(async (valid: boolean) => {
		if (valid) {
			try {
				await userStore.login(loginModel);
				router.push("/dashboard");
			} catch (error) {
				getCaptcha();
				loginModel.code = "";
			}
		}
	});
};

const register = () => {
	router.push("/register");
};
const getCaptcha = async () => {
	const { data } = await getCaptchaApi();
	captchaImg.value = data.img;
	loginModel.codeId = data.id;
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
