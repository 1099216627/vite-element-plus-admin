<template>
	<el-row :gutter="16">
		<el-col class="mb-[10px]" :xs="12" :span="6" v-for="item in statisticData" :key="item.label">
			<div class="statistic-card">
				<el-statistic :value="item.value">
					<template #title>
						<div class="flex justify-between">
							<div class="flex items-center">{{ item.label }}</div>
							<svg-icon :name="item.icon"> </svg-icon>
						</div>
					</template>
				</el-statistic>
				<div class="statistic-footer">
					<div class="footer-item">
						<span>{{ item.footer.label }}</span>
						<span :class="item.footer.increase ? 'green' : 'red'"
							>{{ item.footer.value }}
							<el-icon>
								<CaretTop v-if="item.footer.increase" />
								<CaretBottom v-else />
							</el-icon>
						</span>
					</div>
				</div>
			</div>
		</el-col>
	</el-row>
</template>

<script lang="ts" setup>
import { CaretTop, CaretBottom } from "@element-plus/icons-vue";
import SvgIcon from "@/components/svg-icon/index.vue";
const statisticData = [
	{
		label: "浏览量",
		value: 111100,
		icon: "view-icon",
		footer: {
			label: "比昨天",
			value: "24%",
			increase: true
		}
	},
	{
		label: "活跃用户",
		value: 98500,
		icon: "user-icon",
		footer: {
			label: "比昨天",
			value: "24%",
			increase: false
		}
	},
	{
		label: "订单量",
		value: 1000,
		icon: "order-icon",
		footer: {
			label: "比昨天",
			value: "24%",
			increase: true
		}
	},
	{
		label: "订单金额",
		value: 1000,
		icon: "money-icon",
		footer: {
			label: "比昨天",
			value: "24%",
			increase: false
		}
	}
];
</script>

<style scoped lang="scss">
.el-statistic {
	--el-statistic-content-font-size: 28px;
}
.statistic-card {
	height: 100%;
	padding: 20px;
	background-color: var(--theme-header-bg-color);
	border: 1px solid var(--theme-main-border-color);
	border-radius: 4px;
	box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
}
.statistic-footer {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: space-between;
	margin-top: 16px;
	font-size: 12px;
	color: var(--el-text-color-regular);
	.footer-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		span:last-child {
			display: inline-flex;
			align-items: center;
			margin-left: 4px;
		}
	}
}
.green {
	color: var(--el-color-success);
}
.red {
	color: var(--el-color-error);
}
</style>
