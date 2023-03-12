<template>
	<div class="tabs-box">
		<div class="tabs-menu">
			<el-tabs v-model="tabsMenuValue" type="card" @tab-click="tabClick" @tab-remove="tabRemove">
				<el-tab-pane v-for="item in tabsMenuList" :key="item.path" :label="item.title" :name="item.path" :closable="item.close">
					<template #label>
						<el-icon class="tabs-icon" v-show="item.icon">
							<svg-icon :name="item.icon"></svg-icon>
						</el-icon>
						{{ item.title }}
					</template>
				</el-tab-pane>
			</el-tabs>
			<more-button></more-button>
		</div>
	</div>
</template>

<script setup lang="ts">
import Sortable from "sortablejs";
import { ref, computed, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAppStore } from "@/store/modules/app";
import { TabsPaneContext } from "element-plus";
import SvgIcon from "@/components/svg-icon/index.vue";
import MoreButton from "./components/more-button.vue";

const route = useRoute();
const router = useRouter();
const appStore = useAppStore();

const tabsMenuValue = ref(route.fullPath);
const tabsMenuList = computed(() => appStore.tabList);

onMounted(() => {
	tabsDrop();
	initTabs();
});

// 标签拖拽排序
const tabsDrop = () => {
	Sortable.create(document.querySelector(".el-tabs__nav") as HTMLElement, {
		draggable: ".el-tabs__item",
		animation: 300,
		onEnd({ newIndex, oldIndex }) {
			const tabsList = [...appStore.tabList];
			const currRow = tabsList.splice(oldIndex as number, 1)[0];
			tabsList.splice(newIndex as number, 0, currRow);
			appStore.setTabList(tabsList);
		}
	});
};

// 初始化需要固定的标签
const initTabs = () => {
	appStore.originMenuList.forEach((item: any) => {
		if (item.affix && !item.hidden) {
			const tabsParams = {
				icon: item.icon,
				title: item.title,
				path: item.path,
				name: item.name,
				close: !item.affix
			};
			appStore.addTab(tabsParams);
		}
	});
};

// 监听路由的变化（防止浏览器后退/前进不变化 tabsMenuValue）
watch(
	() => route.fullPath,
	() => {
		if (route.meta.isFull) return;
		tabsMenuValue.value = route.fullPath;
		const tabsParams = {
			icon: route.meta.icon as string,
			title: route.meta.title as string,
			path: route.fullPath,
			name: route.name as string,
			close: !route.meta.affix
		};
		appStore.addTab(tabsParams);
	},
	{
		immediate: true
	}
);

// Tab Click
const tabClick = (tabItem: TabsPaneContext) => {
	const fullPath = tabItem.props.name as string;
	router.push(fullPath);
};

// Remove Tab
const tabRemove = (fullPath: any) => {
	appStore.removeTab(fullPath, fullPath == route.fullPath);
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
