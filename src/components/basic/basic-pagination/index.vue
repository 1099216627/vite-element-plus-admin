<template>
	<!-- 分页组件 -->
	<el-pagination
		:current-page="pageable.page"
		:page-size="pageable.limit"
		:page-sizes="[20, 50, 100, 200]"
		:background="true"
		layout="total, sizes, prev, pager, next, jumper"
		:total="pageable.total"
		@size-change="handleSizeChange"
		@current-change="handleCurrentChange"
	></el-pagination>
</template>

<script setup lang="ts" name="BasicPagination">
interface Pageable {
	page: number;
	limit: number;
	total: number;
}

interface PaginationProps {
	pageable: Pageable;
	handleSizeChange: (size: number) => void;
	handleCurrentChange: (currentPage: number) => void;
}

defineProps<PaginationProps>();
</script>
