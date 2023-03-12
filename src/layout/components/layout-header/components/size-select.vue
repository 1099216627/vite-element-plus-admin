<template>
	<el-dropdown trigger="click" @command="handleSelect">
		<span class="el-dropdown-link">
			<svg-icon name="size" :icon-style="{ width: '25px', height: '25px' }"></svg-icon>
		</span>
		<template #dropdown>
			<el-dropdown-menu>
				<el-dropdown-item v-for="item in options" :command="item.value" :key="item.value">{{ item.label }}</el-dropdown-item>
			</el-dropdown-menu>
		</template>
	</el-dropdown>
</template>

<script setup lang="ts">
import SvgIcon from "@/components/svg-icon/index.vue";
import { ComponentSizeEnum } from "@/enums/common-enum";
import { reactive } from "vue";
import { useAppStore } from "@/store/modules/app";
const appStore = useAppStore();
const handleSelect = (value: ComponentSizeEnum) => {
	appStore.setConfig({ elementSize: value });
};
const options = reactive([
	{
		label: "小型按钮",
		value: ComponentSizeEnum.SMALL
	},
	{
		label: "默认按钮",
		value: ComponentSizeEnum.DEFAULT
	},
	{
		label: "大型按钮",
		value: ComponentSizeEnum.LARGE
	}
]);
</script>

<style scoped></style>
