<template>
	<div>
		<el-switch
			@change="changeTheme"
			:model-value="theme"
			inline-prompt
			active-value="light"
			inactive-value="dark"
			:active-icon="lightSvgIcon"
			:inactive-icon="darkSvgIcon"
		/>
	</div>
</template>

<script setup lang="tsx">
import { useAppStore } from "@/store/modules/app";
import { computed } from "vue";
import SvgIcon from "@/components/svg-icon/index.vue";
const appStore = useAppStore();
const theme = computed(() => appStore.config.theme);

const darkSvgIcon = () => {
	return (
		<>
			<SvgIcon name="dark"></SvgIcon>
		</>
	);
};
const lightSvgIcon = () => {
	return (
		<>
			<SvgIcon name="light"></SvgIcon>
		</>
	);
};
const changeTheme = (value: any) => {
	//设置html class
	const html = document.documentElement;
	html.setAttribute("class", value);
	appStore.setConfig({ theme: value });
};
</script>

<style scoped></style>
