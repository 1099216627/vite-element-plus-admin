<template>
	<div class="layout-search-dialog flex items-center">
		<el-icon size="20px" @click="handleOpen" class="toolBar-icon">
			<Search></Search>
		</el-icon>
		<el-dialog v-model="isShowSearch" destroy-on-close :modal="false" :show-close="false" fullscreen @click="closeSearch">
			<el-autocomplete
				v-model="searchMenu"
				ref="menuInputRef"
				placeholder="菜单搜索 ：支持菜单名称、路径"
				:fetch-suggestions="searchMenuList"
				@select="handleClickMenu"
				@click.stop
			>
				<template #prefix>
					<el-icon>
						<Search />
					</el-icon>
				</template>
				<template #default="{ item }">
					<el-icon>
						<component :is="item.icon"></component>
					</el-icon>
					<span> {{ item.title }} </span>
				</template>
			</el-autocomplete>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from "vue";
import { Search } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { useAppStore } from "../../store/modules/app";
import { storeToRefs } from "pinia";
import { Menu } from "@/models/menu-model";
const router = useRouter();
const appStore = useAppStore();
const { originMenuList } = storeToRefs(appStore);
const menuList = computed(() =>
	originMenuList.value.filter((item: any) => !item.hidden && item.component.toLowerCase() !== "layout")
);
const searchMenuList = (queryString: string, cb: Function) => {
	const results = queryString ? menuList.value.filter(filterNodeMethod(queryString)) : menuList.value;
	cb(results);
};

// 打开搜索菜单
const isShowSearch = ref(false);
const menuInputRef = ref();
const searchMenu = ref("");
const handleOpen = () => {
	isShowSearch.value = true;
	searchMenu.value = "";
	nextTick(() => {
		setTimeout(() => {
			menuInputRef.value.focus();
		});
	});
};

// 搜索窗关闭
const closeSearch = () => {
	isShowSearch.value = false;
};

// 筛选菜单
const filterNodeMethod = (queryString: string) => {
	return (restaurant: Menu.ItemRaw) => {
		return (
			restaurant.path.toLowerCase().indexOf(queryString.toLowerCase()) > -1 ||
			restaurant.title.toLowerCase().indexOf(queryString.toLowerCase()) > -1
		);
	};
};

// 点击菜单跳转
const handleClickMenu = (menuItem: any) => {
	searchMenu.value = "";
	if (menuItem.link) window.open(menuItem.link, "_blank");
	else router.push(menuItem.path);
	closeSearch();
};
</script>

<style scoped lang="scss">
/* 菜单搜索样式 */
.layout-search-dialog {
	:deep(.el-dialog) {
		background: rgb(0 0 0 / 50%);
		border-radius: 0 !important;
		box-shadow: unset !important;
		.el-dialog__header {
			border-bottom: none !important;
		}
	}
	:deep(.el-autocomplete) {
		position: absolute;
		top: 100px;
		left: 50%;
		width: 550px;
		transform: translateX(-50%);
		.el-input__wrapper {
			background-color: var(--el-bg-color);
		}
	}
}
.el-autocomplete__popper {
	.el-icon {
		position: relative;
		top: 2px;
		font-size: 16px;
	}
	span {
		margin: 0 0 0 10px;
		font-size: 14px;
	}
}
</style>
