<template>
	<div class="sidebar-logo-container" :class="{ onlyShowLogo: isCollapse }">
		<transition name="sidebarLogoFade">
			<div v-if="isCollapse" key="collapse" class="sidebar-logo-link">
				<img v-if="LogoImg" :src="LogoImg" class="sidebar-logo" />
				<p v-else class="sidebar-title">Element-Admin</p>
			</div>
			<div v-else key="expand" class="sidebar-logo-link">
				<img v-if="LogoImg" :src="LogoImg" class="sidebar-logo" />
				<p class="sidebar-title">Element-Admin</p>
			</div>
		</transition>
	</div>
</template>

<script setup lang="ts">
import { useAppStore } from "@/store/modules/app";
import { computed } from "vue";
import LogoImg from "@/assets/vue.svg";
const appStore = useAppStore();
const isCollapse = computed(() => appStore.config.isCollapse);
</script>

<style scoped lang="scss">
.sidebarLogoFade-enter-active {
	transition: opacity 1.5s;
}
.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
	opacity: 0;
}
.sidebar-logo-container {
	width: 100%;
	height: 50px;
	background: var(--theme-bg-color);
	.sidebar-logo-link {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		& .sidebar-logo {
			width: 32px;
			height: 32px;
			margin-right: 12px;
			vertical-align: middle;
		}
		& .sidebar-title {
			display: inline-block;
			margin: 0;
			font-family: Avenir, "Helvetica Neue", Arial, Helvetica, sans-serif;
			font-size: 14px;
			font-weight: 600;
			color: var(--theme-menu-text-color);
			vertical-align: middle;
		}
	}
	&.onlyShowLogo {
		.sidebar-logo {
			margin-right: 0;
		}
	}
}
</style>
