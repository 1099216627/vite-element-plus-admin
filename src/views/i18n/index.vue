<template>
	<div class="base-container">
		<el-card>
			<el-button> {{ $t("common.add") }} </el-button>
			<el-button> {{ $t("common.edit") }} </el-button>
			<el-button> {{ $t("common.delete") }} </el-button>
			<el-button> {{ $t("common.cancel") }} </el-button>
		</el-card>
	</div>
</template>

<script setup lang="ts">
import {} from "vue-i18n";
</script>

<style scoped></style>
