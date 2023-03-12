<template>
	<div v-if="!item.meta.hidden">
		<template v-if="hasOneShowingChild(item.children, item) && (!onlyOneChild.children || onlyOneChild.noShowingChildren)">
			<app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
				<el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{ 'sub-menu-title-noDropdown': !isNest }">
					<template #title>
						<svg-icon class="mr-[10px] el-icon" :name="onlyOneChild.meta.icon"></svg-icon>
						<span>{{ onlyOneChild.meta.title }}</span>
					</template>
				</el-menu-item>
			</app-link>
		</template>

		<el-sub-menu v-else ref="submenu" :index="resolvePath(item.path)">
			<template #title>
				<svg-icon class="mr-[10px] el-icon" :name="item.meta.icon"></svg-icon>
				<span>{{ item.meta.title }}</span>
			</template>
			<side-bar-item
				v-for="child in item.children"
				:key="child.path"
				:is-nest="true"
				:item="child"
				:base-path="resolvePath(child.path)"
				class="nest-menu"
			/>
		</el-sub-menu>
	</div>
</template>

<script setup lang="ts" name="side-bar-item">
import { Menu } from "@/models/menu-model";
import { ref } from "vue";
import { isExternal } from "@/utils/is";
import AppLink from "./app-link.vue";
import path from "path-browserify";
import SvgIcon from "@/components/svg-icon/index.vue";
const props = defineProps<{
	item: any;
	basePath: string;
	isNest?: boolean;
}>();
let onlyOneChild = ref<any>(null);

const hasOneShowingChild = (children: Menu.AppRouteRaw[], parent: Menu.AppRouteRaw) => {
	const showingChildren = children.filter(item => {
		if (item.meta.hidden) {
			return false;
		} else {
			onlyOneChild.value = item;
			return true;
		}
	});
	// 当只有一个子路由时，直接显示子路由
	if (showingChildren.length === 1) {
		return true;
	}
	// 当没有子路由时，直接显示父路由
	if (showingChildren.length === 0) {
		onlyOneChild.value = { ...parent, path: "", noShowingChildren: true };
		return true;
	}

	return false;
};

const resolvePath = (routePath: string) => {
	if (isExternal(routePath)) {
		return routePath;
	}
	if (isExternal(props.basePath)) {
		return props.basePath;
	}
	return path.resolve(props.basePath, routePath);
};
</script>

<style scoped></style>
