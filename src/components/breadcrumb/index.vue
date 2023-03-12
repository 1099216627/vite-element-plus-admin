<template>
	<div :class="['breadcrumb-box', !showBreadcrumb && 'no-icon']">
		<el-breadcrumb class="flex items-center" :separator-icon="ArrowRight">
			<transition-group name="breadcrumb">
				<el-breadcrumb-item v-for="(item, index) in breadcrumbList" :key="item.path">
					<div class="el-breadcrumb__inner is-link" @click="onBreadcrumbClick(item, index)">
						<svg-icon class="breadcrumb-icon" v-show="item.meta.icon" :name="item.meta.icon"></svg-icon>
						<span class="breadcrumb-title">{{ item.meta.title }}</span>
					</div>
				</el-breadcrumb-item>
			</transition-group>
		</el-breadcrumb>
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useAppStore } from "@/store/modules/app";
import { ArrowRight } from "@element-plus/icons-vue";
import { useRoute, useRouter } from "vue-router";
import SvgIcon from "@/components/svg-icon/index.vue";

const route = useRoute();
const router = useRouter();
const appStore = useAppStore();
const showBreadcrumb = computed(() => appStore.config.showBreadcrumb);
const breadcrumbList = computed(() => {
	let breadcrumbData: any = route.matched.filter(item => item.meta.title);
	const firstBreadcrumb = breadcrumbData[0];

	if (!isDashboard(firstBreadcrumb)) {
		breadcrumbData = [{ path: "/dashboard", meta: { icon: "DashboardOutlined", title: "首页" } }, ...breadcrumbData];
	}
	return breadcrumbData.filter((item: any) => item.meta && item.meta.title !== false);
});

const isDashboard = (route: any) => {
	const name = route && route.name;
	if (!name) {
		return false;
	}
	return name.trim().toLocaleLowerCase() === "Dashboard".toLocaleLowerCase();
};
const onBreadcrumbClick = (item: Menu.MenuOptions, index: number) => {
	if (index !== breadcrumbList.value.length - 1) router.push(item.path);
};
</script>

<style scoped lang="scss">
.breadcrumb-box {
	display: flex;
	align-items: center;
	padding-right: 50px;
	overflow: hidden;
	mask-image: linear-gradient(90deg, #000000 0%, #000000 calc(100% - 50px), transparent);
	.el-breadcrumb {
		white-space: nowrap;
		.el-breadcrumb__item {
			display: flex;
			align-items: center;
			height: 24px;
			.el-breadcrumb__inner {
				display: inline-flex;
				.breadcrumb-icon {
					margin-top: 2px;
					margin-right: 6px;
					font-size: 16px;
				}
				.breadcrumb-title {
					line-height: 24px;
				}
			}
			:deep(.el-breadcrumb__separator) {
				position: relative;
				top: -1px;
			}
		}
	}
}
.no-icon {
	.el-breadcrumb {
		.el-breadcrumb__item {
			top: -2px;
			:deep(.el-breadcrumb__separator) {
				top: 2px;
			}
		}
	}
}
</style>
