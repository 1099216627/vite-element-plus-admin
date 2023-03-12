<template>
	<el-main class="app-main">
		<router-view v-slot="{ Component }">
			<transition name="fade-transform" mode="out-in">
				<keep-alive :include="cachedViews">
					<component :is="Component" :key="key" v-if="isShowRoute"></component>
				</keep-alive>
			</transition>
		</router-view>
	</el-main>
</template>

<script setup lang="ts" name="main">
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useUserStore } from "@/store/modules/user";
import { storeToRefs } from "pinia";
import { ElNotification } from "element-plus";
const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);
defineProps<{
	isShowRoute: boolean;
}>();
const route = useRoute();
let cachedViews = ref([]);
let key = computed(() => route.fullPath);
onMounted(() => {
	ElNotification({
		title: "欢迎回来",
		message: `欢迎回来，上次登录地点${userInfo.value?.lastLoginArea}, 上次登录时间${userInfo.value?.lastLoginTime}，`,
		type: "success",
		duration: 2000
	});
});
</script>

<style lang="scss" scoped>
.app-main {
	height: 100vh;
	@apply w-full relative overflow-hidden;
}
.hasFooter .app-main {
	height: calc(100vh - 34px);
}
.fixed-header + .app-main {
	padding: 50px 0 0;
}
.hasTagsView {
	.fixed-header + .app-main {
		padding: 84px 0 0;
	}
}

// .hasFooter {
// 	.fixed-header + .app-main {
// 		padding-bottom: 34px;
// 	}
// }
</style>
