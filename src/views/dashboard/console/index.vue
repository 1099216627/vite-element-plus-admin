<template>
	<div class="base-container overflow-auto">
		<div class="statistic-card">
			<statistic-card></statistic-card>
		</div>
		<div class="statistic-chart">
			<statistic-chart ref="ChartRef"></statistic-chart>
		</div>
	</div>
</template>

<script setup lang="ts">
import { randomNum } from "@/utils/shard";
import { ECharts } from "echarts";
import { onMounted, ref } from "vue";
import { StatisticCard, StatisticChart } from "./components";
import { TrendsData, ConsumerRankData } from "./constant";

interface Expose {
	initTrendsChart: (data: any) => ECharts;
	initDistributionChart: (data: any) => ECharts;
	initConsumerRankChart: (data: any) => ECharts;
}
const ChartRef = ref<Expose>();

interface ChartProps {
	[key: string]: ECharts | null;
}
const chartsList: ChartProps = {
	chart1: null,
	chart2: null,
	chart3: null
};
const initCharts = () => {
	chartsList.chart1 = ChartRef.value?.initTrendsChart(
		TrendsData.map(item => {
			return {
				date: item.date,
				visitData: randomNum(100, 1000),
				orderData: randomNum(100, 1000),
				payData: randomNum(100, 1000),
				payCount: randomNum(100, 1000)
			};
		})
	) as ECharts;

	chartsList.chart2 = ChartRef.value?.initDistributionChart([
		{ value: 335, name: "直接访问" },
		{ value: 310, name: "邮件营销" },
		{ value: 234, name: "联盟广告" },
		{ value: 135, name: "视频广告" },
		{ value: 1548, name: "搜索引擎" }
	]) as ECharts;

	chartsList.chart3 = ChartRef.value?.initConsumerRankChart(
		ConsumerRankData.map(item => {
			return {
				...item,
				value: randomNum(100, 1000)
			};
		}).sort((a, b) => b.value - a.value)
	) as ECharts;
};
onMounted(() => {
	initCharts();
	window.addEventListener("resize", () => {
		Object.values(chartsList).forEach(chart => {
			chart?.resize();
		});
	});
});
</script>

<style scoped></style>
