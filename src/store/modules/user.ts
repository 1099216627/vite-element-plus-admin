import { defineStore } from "pinia";
import { reactive, toRefs } from "vue";
import setPersisted from "../persisted";

export const useUserStore = defineStore(
	"user",
	() => {
		let state = reactive({
			token: "",
			userInfo: {}
		});
		function setToken(value: string) {
			state.token = value;
		}
		function getToken() {
			return state.token;
		}
		function getUserInfo() {
			return {
				name: "admin",
				age: 18
			};
		}
		return {
			...toRefs(state),
			setToken,
			getToken,
			getUserInfo
		};
	},
	{
		persist: setPersisted("user", ["token", "userInfo"])
	}
);
