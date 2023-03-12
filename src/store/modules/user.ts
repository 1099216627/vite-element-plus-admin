import { getUserInfoApi, loginApi } from "@/api/modules/user";
import { ResultEnum } from "@/enums/http-enum";
import { defineStore } from "pinia";
import { reactive, toRefs } from "vue";
import setPersisted from "../persisted";
import { User } from "@/models/user-model";
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
		function login(obj: { username: string; password: string; code: string; codeId: string }) {
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
			resetState
		};
	},
	{
		persist: setPersisted("user", ["userInfo", "token"])
	}
);
