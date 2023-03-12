<template>
	<div :class="classObj" class="app-wrapper clearfix" ref="layoutRef">
		<div v-if="device === 'mobile' && !isCollapse" class="drawer-bg" @click="handleClickOutside" />
		<app-side-bar class="sidebar-container"></app-side-bar>
		<div :class="{ hasTagsView: showTagsView, hasFooter: showFooter }" class="main-container">
			<div :class="{ 'fixed-header': fixedHeader }">
				<app-header></app-header>
				<app-tabs v-if="showTagsView"></app-tabs>
			</div>
			<app-main :isShowRoute="isShowRoute"></app-main>
			<!-- <right-panel v-if="showSettings">
				<settings />
			</right-panel> -->
			<app-footer></app-footer>
		</div>
	</div>
</template>

<script setup lang="ts" name="layout">
import { useAppStore } from "@/store/modules/app";
import { computed, onMounted, provide, ref, VNodeRef, watch } from "vue";
import { useResizeObserver } from "@vueuse/core";
import { useRoute } from "vue-router";
import AppMain from "./components/layout-main/index.vue";
import AppHeader from "./components/layout-header/index.vue";
import AppSideBar from "./components/layout-sidebar/index.vue";
import AppFooter from "./components/layout-footer/index.vue";
import AppTabs from "./components/layout-tabs/index.vue";
const appStore = useAppStore();
const device = computed(() => appStore.config.device);
const isCollapse = computed(() => appStore.config.isCollapse);
const layoutRef = ref<VNodeRef | null>(null);
// const showSettings = computed(() => appStore.config.showSettings);
const fixedHeader = computed(() => appStore.config.fixedHeader);
const showTagsView = computed(() => appStore.config.showTagsView);
const showFooter = computed(() => appStore.config.showFooter);
const hasAnimation = computed(() => appStore.config.animation);
const route = useRoute();
const classObj = computed(() => ({
	hideSidebar: isCollapse.value,
	openSidebar: !isCollapse.value,
	withoutAnimation: !hasAnimation.value,
	mobile: device.value === "mobile"
}));
const isShowRoute = ref(true);
const refreshPage = (value: boolean) => (isShowRoute.value = value);
provide("refresh", refreshPage); // 提供刷新方法
const isMobile = () => {
	return document.body.getBoundingClientRect().width - 1 < 992;
};

useResizeObserver(layoutRef, () => {
	if (!document.hidden) {
		appStore.setConfig({ device: isMobile() ? "mobile" : "desktop" });
	}
	if (isMobile()) {
		appStore.setConfig({ isCollapse: true, animation: false });
	} else {
		appStore.setConfig({ isCollapse: false, animation: true });
	}
});

const handleClickOutside = () => {
	if (device.value === "mobile" && !isCollapse.value) {
		appStore.setConfig({ isCollapse: true });
	}
};
watch(
	() => route.path,
	() => {
		if (device.value === "mobile" && isCollapse.value) {
			appStore.setConfig({ isCollapse: true, animation: false });
		}
	}
);
onMounted(() => {
	if (isMobile()) {
		appStore.setConfig({ isCollapse: true, animation: false, device: "mobile" });
	} else {
		appStore.setConfig({ isCollapse: false, animation: true, device: "desktop" });
	}
});
</script>

<style scoped lang="scss">
@import "@/styles/var.scss";
.app-wrapper {
	@apply absolute h-full w-full;
	.mobile.openSidebar & {
		@apply fixed top-0;
	}
}
.drawer-bg {
	@apply bg-black absolute top-0 left-0 w-full h-full z-[999] opacity-30;
}
.fixed-header {
	@apply fixed top-0 right-0 z-10 transition-[width] duration-200;

	width: calc(100% - #{$side-bar-width});
}
.hideSidebar .fixed-header {
	width: calc(100% - 54px);
}
.hideSidebar .app-footer {
	left: 54px;
	transition: width 0.3s ease-in-out;
}
.mobile .fixed-header {
	@apply w-full;
}
</style>
