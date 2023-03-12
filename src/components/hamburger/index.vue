<template>
	<el-icon @click="toggle" size="20px">
		<Expand v-if="isCollapse" />
		<Fold v-else />
	</el-icon>
</template>

<script setup lang="ts">
import { Expand, Fold } from "@element-plus/icons-vue";
const props = defineProps<{ isCollapse: boolean }>();
const emit = defineEmits(["toggle"]);
//向父组件发送事件
const toggle = () => {
	emit("toggle", !props.isCollapse);
};
</script>

<style scoped lang="scss"></style>
