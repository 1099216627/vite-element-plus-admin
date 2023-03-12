<template>
	<div class="fullscreen">
		<img @click="toggle" class="w-[25px]" :src="isFullscreen ? CancelScreen : Screen" alt="" />
	</div>
</template>

<script setup lang="ts">
import { useFullscreen } from "@vueuse/core";
import CancelScreen from "@/assets/images/common/cancel-screen.svg";
import Screen from "@/assets/images/common/screen.svg";
const { toggle, isFullscreen } = useFullscreen();
</script>
