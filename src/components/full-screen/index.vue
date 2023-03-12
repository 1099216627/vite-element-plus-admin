<template>
	<div class="fullscreen">
		<div class="fullscreen-icon" @click="toggle">
			<svg-icon :name="isFullscreen ? 'cancel-full-screen' : 'full-screen'"></svg-icon>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useFullscreen } from "@vueuse/core";
import SvgIcon from "@/components/svg-icon/index.vue";
const { toggle, isFullscreen } = useFullscreen();
</script>
