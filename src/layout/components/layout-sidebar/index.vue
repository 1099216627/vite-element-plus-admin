<template>
	<el-aside>
		<app-logo></app-logo>
		<el-scrollbar wrap-class="scrollbar-wrapper">
			<el-menu
				:default-active="activeMenu"
				:collapse="isCollapse"
				:unique-opened="true"
				:collapse-transition="false"
				mode="vertical"
			>
				<side-bar-item v-for="r in menuList" :key="r.path" :item="r" :base-path="r.path" />
			</el-menu>
		</el-scrollbar>
	</el-aside>
</template>

<script setup lang="ts">
import { useAppStore } from "@/store/modules/app";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { useRoute } from "vue-router";
import SideBarItem from "./layout-sidebar-item.vue";
import AppLogo from "./app-logo.vue";
const route = useRoute();
const appStore = useAppStore();
const { menuList } = storeToRefs(appStore);

const isCollapse = computed(() => appStore.config.isCollapse);

const activeMenu = computed(() => route.path);
</script>

<style scoped lang="scss"></style>
