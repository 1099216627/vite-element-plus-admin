<template>
	<el-footer class="app-footer">
		<!-- 版权 -->
		<p>
			<a href="https://beian.miit.gov.cn/" target="_blank">您的备案号</a>
			<a href="https://beian.miit.gov.cn/" target="_blank">鄂ICP备2022014163号</a>
		</p>
	</el-footer>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.app-footer {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 34px;
	color: var(--theme-footer-text-color);
	background-color: var(--theme-footer-bg-color);
	border: 1px solid var(--theme-footer-border-color);
	border-radius: 4px;
}
</style>
