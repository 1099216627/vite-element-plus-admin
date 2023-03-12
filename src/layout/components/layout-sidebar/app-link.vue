<template>
	<component :is="type" v-bind="linkProps(to)">
		<slot />
	</component>
</template>

<script setup lang="ts">
import { isExternal } from "@/utils/is";
import { computed } from "vue";
const props = defineProps<{
	to: string;
}>();

const type = computed(() => (isExternal(props.to) ? "a" : "router-link"));
const linkProps = (to: string) => {
	if (isExternal(to)) {
		return {
			href: to,
			target: "_blank",
			rel: "noopener"
		};
	}
	return { to };
};
</script>

<style scoped></style>
