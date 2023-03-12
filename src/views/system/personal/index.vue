<template>
	<div class="base-container">
		<div class="card h-full">
			<el-tabs>
				<el-tab-pane label="个人信息">
					<profile></profile>
				</el-tab-pane>
				<el-tab-pane label="修改密码">
					<password></password>
				</el-tab-pane>
				<el-tab-pane label="安全信息">该模块暂未开通！</el-tab-pane>
			</el-tabs>
		</div>
	</div>
</template>

<script setup lang="ts">
import Profile from "./components/profile.vue";
import password from "./components/password.vue";
</script>

<style scoped></style>
