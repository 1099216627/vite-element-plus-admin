/**
 * v-auth
 * 按钮权限指令
 */
import type { Directive, DirectiveBinding } from "vue";
import { useAppStore } from "@/store/modules/app";

const auth: Directive = {
	mounted(el: HTMLElement, binding: DirectiveBinding) {
		const { value } = binding;
		const appStore = useAppStore();
		const userPermissions = appStore.getUserPermissions().map(item => item.key);
		if (value instanceof Array && value.length) {
			const hasPermission = value.every(item => userPermissions.includes(item));
			if (!hasPermission) {
				el.setAttribute("disabled", "disabled");
				el.classList.add("is-disabled");
			}
		} else {
			if (!userPermissions.includes(value)) {
				el.setAttribute("disabled", "disabled");
				el.classList.add("is-disabled");
			}
		}
	}
};

export default auth;
