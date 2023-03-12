<template>
	<div id="app">
		<el-config-provider :size="size" :button="config">
			<router-view></router-view>
		</el-config-provider>
	</div>
</template>

<script setup lang="ts">
import { computed, reactive } from "vue";
import { useAppStore } from "@/store/modules/app";
const appStore = useAppStore();
const size = computed(() => appStore.config.elementSize);

const config = reactive({
	autoInsertSpace: false
});
</script>

<style scoped></style>
