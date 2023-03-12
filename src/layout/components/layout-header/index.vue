<template>
	<div class="navbar">
		<div class="left-menu flex items-center">
			<hamburger
				id="hamburger-container"
				:isCollapse="isCollapse"
				class="hamburger-container mr-[20px]"
				@toggle="toggleSideBar"
			/>
			<breadcrumb></breadcrumb>
		</div>

		<!-- <breadcrumb id="breadcrumb-container" class="breadcrumb-container" /> -->

		<div class="right-menu">
			<template v-if="device !== 'mobile'">
				<change-theme class="right-menu-item"></change-theme>
				<el-dropdown trigger="click" @command="handleSelect">
					<span class="el-dropdown-link">
						<svg-icon
							name="i18n"
							class="right-menu-item"
							:iconStyle="{
								width: '35px',
								height: '35px'
							}"
						></svg-icon>
					</span>
					<template #dropdown>
						<el-dropdown-menu>
							<el-dropdown-item v-for="item in i18nOptions" :command="item.value" :key="item.value">{{
								item.label
							}}</el-dropdown-item>
						</el-dropdown-menu>
					</template>
				</el-dropdown>

				<size-select class="right-menu-item"></size-select>
				<search-menu class="right-menu-item"></search-menu>
				<full-screen class="right-menu-item"></full-screen>
			</template>

			<el-dropdown size="large" class="avatar-container right-menu-item hover-effect" trigger="click" @command="handleCommand">
				<div class="avatar-wrapper">
					<img :src="avatar" class="user-avatar" />
					<i class="el-icon-caret-bottom" />
				</div>
				<template #dropdown>
					<el-dropdown-menu>
						<el-dropdown-item command="personal" class="flex items-center"
							><svg-icon name="info" class="mr-2"></svg-icon>个人中心</el-dropdown-item
						>
						<el-dropdown-item command="docs" class="flex items-center"
							><svg-icon name="github" class="mr-2"></svg-icon>Docs</el-dropdown-item
						>
						<el-dropdown-item command="logout" class="flex items-center"
							><svg-icon name="logout" class="mr-2"></svg-icon>退出登录</el-dropdown-item
						>
					</el-dropdown-menu>
				</template>
			</el-dropdown>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useAppStore } from "@/store/modules/app";
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/modules/user";
import Hamburger from "@/components/hamburger/index.vue";
import FullScreen from "@/components/full-screen/index.vue";
import SearchMenu from "@/components/search-menu/index.vue";
import Breadcrumb from "@/components/breadcrumb/index.vue";
import SizeSelect from "./components/size-select.vue";
import ChangeTheme from "./components/change-theme.vue";
import SvgIcon from "@/components/svg-icon/index.vue";
import DefaultAvatar from "@/assets/avatar.gif";
import { useI18n } from "vue-i18n";
import { ElMessage } from "element-plus";
const { locale } = useI18n();
const appStore = useAppStore();
const userStore = useUserStore();
const router = useRouter();
const device = computed(() => appStore.config.device);
const isCollapse = computed(() => appStore.config.isCollapse);
const avatar = computed(() => userStore.userInfo?.profile.avatar || DefaultAvatar);
const toggleSideBar = (value: boolean) => {
	appStore.setConfig({ isCollapse: value });
};

const i18nOptions = [
	{
		label: "简体中文",
		value: "zh"
	},
	{
		label: "English",
		value: "en"
	}
];
const handleCommand = (command: string) => {
	switch (command) {
		case "personal":
			router.push("/personal");
			break;
		case "docs":
			break;
		case "logout":
			break;
		default:
			break;
	}
};

const handleSelect = (value: string) => {
	if (value === locale.value) return;
	appStore.setConfig({ locale: value });
	locale.value = value;
	const language = value === "zh" ? "中文" : "English";
	ElMessage.success(`切换语言成功，当前语言：${language}`);
};

onMounted(() => {
	handleSelect(appStore.config.locale);
});
</script>

<style scoped lang="scss">
.navbar {
	@apply h-[50px] overflow-hidden relative flex items-center justify-between;

	background-color: var(--theme-header-bg-color);
	border-bottom: 1px solid var(--theme-header-border-color);
	.hamburger-container {
		@apply flex items-center ml-[15px] cursor-pointer;
	}
	.breadcrumb-container {
		float: left;
	}
	.errLog-container {
		@apply inline-block align-top;
	}
	.right-menu {
		@apply float-right h-full leading-[50px] focus:outline-none flex items-center;
		.right-menu-item {
			@apply px-[8px] text-[18px] align-text-bottom cursor-pointer flex items-center;
			&.hover-effect {
				cursor: pointer;
				transition: background 0.3s;
				&:hover {
					background: rgb(0 0 0 / 2.5%);
				}
			}
		}
		.avatar-container {
			margin-right: 30px;
			.avatar-wrapper {
				position: relative;
				.user-avatar {
					@apply cursor-pointer w-[40px] h-[40px] rounded-[10px];
				}
				.el-icon-caret-bottom {
					@apply cursor-pointer absolute right-[-20px] top-[25px] text-[12px];
				}
			}
		}
	}
}
</style>
