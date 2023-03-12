<template>
	<el-dropdown trigger="click" :teleported="false">
		<el-button size="small" type="primary">
			<span>更多</span>
			<el-icon class="el-icon--right"><arrow-down /></el-icon>
		</el-button>
		<template #dropdown>
			<el-dropdown-menu>
				<el-dropdown-item @click="refresh">
					<el-icon><Refresh /></el-icon>刷新
				</el-dropdown-item>
				<el-dropdown-item divided @click="closeCurrentTab">
					<el-icon><Remove /></el-icon>关闭当前
				</el-dropdown-item>
				<el-dropdown-item @click="closeOtherTab">
					<el-icon><CircleClose /></el-icon>关闭其他
				</el-dropdown-item>
				<el-dropdown-item @click="closeAllTab">
					<el-icon><FolderDelete /></el-icon>关闭所有
				</el-dropdown-item>
			</el-dropdown-menu>
		</template>
	</el-dropdown>
</template>

<script setup lang="ts">
import { inject, nextTick } from "vue";
import { useAppStore } from "@/store/modules/app";
import { useRoute, useRouter } from "vue-router";
import { Refresh, Remove, CircleClose, FolderDelete, ArrowDown } from "@element-plus/icons-vue";
const route = useRoute();
const router = useRouter();
const appStore = useAppStore();
const refreshPage: Function = inject("refresh") as Function;
// refresh current page
const refresh = () => {
	setTimeout(() => {
		refreshPage(false);
		nextTick(() => {
			refreshPage(true);
		});
	}, 0);
};
// Close Current
const closeCurrentTab = () => {
	if (route.meta.affix) return;
	appStore.removeTab(route.fullPath, true);
};

// Close Other
const closeOtherTab = () => {
	appStore.closeMultipleTab(route.fullPath);
};

// Close All
const closeAllTab = () => {
	appStore.closeMultipleTab();
	router.push("/");
};
</script>

<style scoped lang="scss">
@import "../index.scss";
</style>
