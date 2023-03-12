<template>
	<el-row :gutter="12">
		<el-col :span="24" class="mb-[10px]">
			<el-card>
				<template #header> 趋势 </template>
				<div id="TrendsChart" class="h-[250px]"></div>
			</el-card>
		</el-col>
		<el-col :span="24" class="mb-[10px]">
			<el-row :gutter="12">
				<el-col :span="12" :xs="24">
					<el-card>
						<template #header> 分布 </template>
						<div id="Distribution" class="h-[250px]"></div>
					</el-card>
				</el-col>
				<el-col :span="12" :xs="24">
					<el-card>
						<template #header> 消费排行 </template>
						<div id="ConsumerRank" class="h-[250px]"></div>
					</el-card>
				</el-col>
			</el-row>
		</el-col>
	</el-row>
</template>

<script setup lang="ts">
import { init, ECharts, EChartsOption } from "echarts";
import * as echarts from "echarts";
const initTrendsChart = (data: any[]) => {
	const dom = document.getElementById("TrendsChart") as HTMLElement;
	const myChart: ECharts = init(dom);
	const options: EChartsOption = {
		color: ["#80FFA5", "#00DDFF", "#37A2FF", "#FF0087"],
		tooltip: {
			trigger: "axis",
			axisPointer: {
				type: "cross",
				label: {
					backgroundColor: "#6a7985"
				}
			}
		},
		legend: {
			data: ["访问量", "订单量", "支付金额", "支付笔数"]
		},
		toolbox: {
			feature: {
				saveAsImage: {}
			}
		},
		grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
		xAxis: [{ type: "category", boundaryGap: false, data: data.map(item => item.date) }],
		yAxis: [{ type: "value" }],
		series: [
			{
				name: "访问量",
				type: "line",
				stack: "Total",
				smooth: true,
				lineStyle: {
					width: 0
				},
				showSymbol: false,
				areaStyle: {
					opacity: 0.8,
					color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
						{
							offset: 0,
							color: "rgb(128, 255, 165)"
						},
						{
							offset: 1,
							color: "rgb(1, 191, 236)"
						}
					])
				},
				emphasis: {
					focus: "series"
				},
				data: data.map(item => item.visitData)
			},
			{
				name: "订单量",
				type: "line",
				stack: "Total",
				smooth: true,
				lineStyle: {
					width: 0
				},
				showSymbol: false,
				areaStyle: {
					opacity: 0.8,
					color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
						{
							offset: 0,
							color: "rgb(0, 221, 255)"
						},
						{
							offset: 1,
							color: "rgb(77, 119, 255)"
						}
					])
				},
				emphasis: {
					focus: "series"
				},
				data: data.map(item => item.orderData)
			},
			{
				name: "支付金额",
				type: "line",
				stack: "Total",
				smooth: true,
				lineStyle: {
					width: 0
				},
				showSymbol: false,
				areaStyle: {
					opacity: 0.8,
					color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
						{
							offset: 0,
							color: "rgb(55, 162, 255)"
						},
						{
							offset: 1,
							color: "rgb(116, 21, 219)"
						}
					])
				},
				emphasis: {
					focus: "series"
				},
				data: data.map(item => item.payData)
			},
			{
				name: "支付笔数",
				type: "line",
				stack: "Total",
				smooth: true,
				lineStyle: {
					width: 0
				},
				showSymbol: false,
				areaStyle: {
					opacity: 0.8,
					color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
						{
							offset: 0,
							color: "rgb(255, 0, 135)"
						},
						{
							offset: 1,
							color: "rgb(135, 0, 157)"
						}
					])
				},
				emphasis: {
					focus: "series"
				},
				data: data.map(item => item.payCount)
			}
		]
	};
	myChart.setOption(options);
	return myChart;
};
const initDistributionChart = (data: any) => {
	const dom = document.getElementById("Distribution") as HTMLElement;
	const myChart: ECharts = init(dom);
	const options: EChartsOption = {
		tooltip: { trigger: "item" },
		grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
		series: [
			{
				name: "访问来源",
				type: "pie",
				radius: ["40%", "70%"],
				avoidLabelOverlap: false,
				itemStyle: {
					borderRadius: 10,
					borderColor: "#fff",
					borderWidth: 2
				},
				label: {
					position: "outer",
					alignTo: "none",
					bleedMargin: 5
				},
				data
			}
		]
	};
	myChart.setOption(options);
	return myChart;
};
const initConsumerRankChart = (data: any) => {
	const dom = document.getElementById("ConsumerRank") as HTMLElement;
	const myChart: ECharts = init(dom);
	let colorList = ["#f36c6c", "#e6cf4e", "#20d180", "#0093ff"];
	const options: EChartsOption = {
		tooltip: {
			trigger: "axis",
			axisPointer: { type: "shadow" },
			formatter: function (params: any) {
				return params[0].name + "：" + params[0].value + "万元";
			}
		},
		legend: { show: false },
		grid: { left: "-50", right: "4%", bottom: "3%", top: "0", containLabel: true },

		xAxis: {
			type: "value",
			splitLine: { show: false },
			axisLabel: { show: false },
			axisTick: { show: false },
			axisLine: { show: false }
		},
		yAxis: {
			type: "category",
			inverse: true,
			axisLine: { show: false },
			axisTick: { show: false },
			data: data.map((item: any) => item.city),
			axisLabel: {
				margin: 70,
				fontSize: 14,
				align: "left",
				color: "#333",
				formatter: function (params: any, index: number) {
					if (index < 3) {
						return ["{a" + (index + 1) + "|" + (index + 1) + "}" + "  " + params].join("\n");
					} else {
						return ["{b|" + (index + 1) + "}" + "  " + params].join("\n");
					}
				},
				rich: {
					a1: {
						color: "#fff",
						backgroundColor: colorList[0],
						width: 20,
						height: 20,
						align: "center",
						borderRadius: 50
					},
					a2: {
						color: "#fff",
						backgroundColor: colorList[1],
						width: 20,
						height: 20,
						align: "center",
						borderRadius: 50
					},
					a3: {
						color: "#fff",
						backgroundColor: colorList[2],
						width: 20,
						height: 20,
						align: "center",
						borderRadius: 50
					},
					b: {
						color: "#fff",
						backgroundColor: colorList[3],
						width: 20,
						height: 20,
						align: "center",
						borderRadius: 50
					}
				}
			}
		},
		series: [
			{
				z: 2,
				name: "value",
				type: "bar",
				data: data
					.map((item: any) => item.value)
					.map((item: any, index: number) => {
						return {
							value: item,
							itemStyle: {
								color: colorList[index > 2 ? 3 : index]
							}
						};
					}),
				label: {
					show: true,
					position: "right",
					fontSize: 12,
					offset: [0, 0]
				}
			}
		]
	};
	myChart.setOption(options);
	return myChart;
};
defineExpose({
	initTrendsChart,
	initDistributionChart,
	initConsumerRankChart
});
</script>

<style scoped></style>
