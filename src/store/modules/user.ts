import { getUserInfoApi, loginApi, logoutApi } from "@/api/modules/user";
import { ResultEnum } from "@/enums/http-enum";
import { defineStore } from "pinia";
import { reactive, toRefs } from "vue";
import setPersisted from "../persisted";
import { User } from "@/models/user-model";
import { Login } from "@/api/types";
import { registerApi } from "../../api/modules/user";
interface UserState {
	token: string;
	userInfo: User.Detail | null;
}
export const useUserStore = defineStore(
	"user",
	() => {
		let state = reactive<UserState>({
			token: "",
			userInfo: null
		});
		function setToken(value: string) {
			state.token = value;
		}
		function getToken() {
			return state.token;
		}
		function resetState() {
			state.token = "";
			state.userInfo = null;
		}
		function login(obj: Login.ReqLoginForm) {
			return new Promise(async (resolve, reject) => {
				const { code, data } = await loginApi(obj);
				if (code === ResultEnum.SUCCESS) {
					state.token = data.access_token;
					resolve(data);
				} else {
					reject(code);
				}
			});
		}
		function logout() {
			return new Promise(async (resolve, reject) => {
				const { code } = await logoutApi();
				if (code === ResultEnum.SUCCESS) {
					resolve(true);
				} else {
					reject(false);
				}
			});
		}
		function register(obj: Login.ReqLoginForm) {
			return new Promise(async (resolve, reject) => {
				const { code } = await registerApi(obj);
				if (code === ResultEnum.SUCCESS) {
					resolve(true);
				} else {
					reject(false);
				}
			});
		}
		async function getUserInfo() {
			const { code, data } = await getUserInfoApi();
			if (code === ResultEnum.SUCCESS) {
				state.userInfo = data;
			} else {
				state.userInfo = null;
			}
		}
		return {
			...toRefs(state),
			setToken,
			getToken,
			getUserInfo,
			login,
			resetState,
			logout,
			register
		};
	},
	{
		persist: setPersisted("user", ["userInfo", "token"])
	}
);
