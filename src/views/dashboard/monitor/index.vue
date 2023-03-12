<template>
	<div class="base-container overflow-auto">
		<el-row>
			<el-col :span="24">
				<el-card class="mb-[10px]">
					<el-descriptions>
						<template #title>
							<div class="flex items-center">
								<el-avatar :src="avatar" :shape="'square'" :size="60"></el-avatar>
								<div class="ml-[20px]">
									<p>今天是{{ nowTime }}</p>
									<p class="text-xs pt-[10px]">欢迎回来，开始你的工作吧！</p>
								</div>
							</div>
						</template>
						<el-descriptions-item label="昵称">{{ userInfo?.profile.nickname }}</el-descriptions-item>
						<el-descriptions-item label="联系方式">{{ userInfo?.profile.phone || "暂无联系方式" }}</el-descriptions-item>
						<el-descriptions-item label="邮箱">{{ userInfo?.profile.email || "暂无邮箱" }}</el-descriptions-item>
						<el-descriptions-item label="角色">
							<el-tag size="small">{{ userInfo?.role.name }}</el-tag>
						</el-descriptions-item>
						<el-descriptions-item label="所在地">{{ userInfo?.profile.address }}</el-descriptions-item>
					</el-descriptions>
				</el-card></el-col
			>
		</el-row>
		<el-row :gutter="12">
			<!-- 资源 -->
			<el-col :span="12" :xs="24" class="mb-[10px]">
				<el-card class="resources">
					<template #header>资源</template>
					<el-row>
						<el-col :span="8" :xs="12" v-for="item in resourcesList" :key="item.id">
							<el-card shadow="hover" class="resource-item cursor-pointer" @click="goPath(item.url)">
								<div class="flex items-center">
									<el-image :src="item.cover" class="w-[40px] h-[40px] rounded-full"></el-image>
									<p class="ml-[10px] w-8/12 text-ellipsis overflow-hidden">{{ 123123123213123123 }}</p>
								</div>
								<p class="mt-[10px] line-clamp content">{{ item.description }}</p>
							</el-card>
						</el-col>
					</el-row>
				</el-card>
			</el-col>
			<!-- 快捷操作 -->
			<el-col :span="12" :xs="24" class="mb-[10px]">
				<el-card class="quicks">
					<template #header> 快捷操作 </template>
					<el-row>
						<el-col :span="8" :xs="12" v-for="item in quickList" :key="item.title">
							<el-card shadow="hover" class="cursor-pointer quick-item" @click="goQuick(item.path)">
								<div class="flex flex-col items-center h-full justify-evenly">
									<svg-icon :iconStyle="iconStyle" :name="item.icon"></svg-icon>
									<p class="quick-title">{{ item.title }}</p>
								</div>
							</el-card>
						</el-col>
					</el-row>
				</el-card>
			</el-col>
		</el-row>
		<!-- 背景 -->
		<el-row>
			<el-col>
				<el-card class="work-bg">
					<svg-icon
						:iconStyle="{
							width: '100%',
							height: '250px'
						}"
						name="work"
					></svg-icon>
				</el-card>
			</el-col>
		</el-row>
	</div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/store/modules/user";
import { computed, onMounted, reactive } from "vue";
import AvatarImg from "@/assets/avatar.gif";
import { getResourcesListApi } from "@/api/modules/resources";
import { useNow, useDateFormat } from "@vueuse/core";
import { Resources } from "@/models/resources-mode";
import { useRouter } from "vue-router";
import SvgIcon from "@/components/svg-icon/index.vue";
const nowTime = useDateFormat(useNow(), "YYYY年MM月DD日	");
const router = useRouter();
const userStore = useUserStore();
const avatar = computed(() => userStore.userInfo?.profile.avatar || AvatarImg);
const userInfo = computed(() => userStore.userInfo);
const resourcesList = reactive<Resources.Detail[]>([]);
const iconStyle = reactive({
	width: "40px",
	height: "40px"
});

// 快捷操作
const quickList = [
	{
		title: "用户管理",
		icon: "user-fast",
		path: "/system/user"
	},
	{
		title: "角色管理",
		icon: "role-fast",
		path: "/system/role"
	},
	{
		title: "资源管理",
		icon: "resource-fast",
		path: "/system/resources"
	},
	{
		title: "菜单管理",
		icon: "menu-fast",
		path: "/system/menu"
	},
	{
		title: "日志管理",
		icon: "log-fast",
		path: "/system/log"
	},
	{
		title: "数据大瓶",
		icon: "console-fast",
		path: "/data-screen"
	}
];

const getResourcesList = async () => {
	const { data } = await getResourcesListApi({ page: 1, limit: 6 });
	resourcesList.splice(0, resourcesList.length, ...data.list);
};

const goPath = (path: string) => {
	window.open(path, "_blank");
};

const goQuick = (path: string) => {
	router.push(path);
};

onMounted(() => {
	getResourcesList();
});
</script>

<style scoped lang="scss">
:deep(.resources) {
	.el-card__body {
		padding: 0;
	}

	// 省略3行
	.line-clamp {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 3;
		overflow: hidden;
		word-break: break-all;
	}
	.content {
		font-size: 14px;
		color: #606266;
	}
	.resource-item {
		height: 130px;
		.el-card__body {
			padding: 10px;
		}
	}
}
:deep(.quicks) > .el-card__body {
	padding: 0;
}
:deep(.quick-item) {
	height: 130px;
	.el-card__body {
		height: 100%;
		padding: 10px;
	}
	.quick-title {
		font-size: 14px;
		color: #606266;
	}
}
</style>
