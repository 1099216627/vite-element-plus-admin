<template>
	<div class="data-screen-container">
		<div class="data-screen" ref="dataScreenRef">
			<!-- header -->
			<div class="data-screen__header">
				<div class="data-screen__header__left">
					<div class="header-screening" @click="goHome">首页</div>
				</div>
				<div class="data-screen__header__center">
					<div class="data-screen__header__center__title">
						<span>智慧旅游可视化大数据展示平台</span>
						<div class="data-screen__header__center__title__warning">平台高峰预警信息（2条）</div>
					</div>
				</div>
				<div class="data-screen__header__right">
					<span class="header-download">统计报告</span>
					<span class="header-time">当前时间：{{ time }}</span>
				</div>
			</div>
			<!-- main -->
			<div class="data-screen__main">
				<div class="data-screen__main__left">
					<div class="data-screen__main__left__top">
						<div class="data-screen__main__title">
							<span>实时游客统计</span>
							<img src="@/assets/images/data-screen/dataScreen-title.png" alt="" />
						</div>
						<!-- 实时游客预约 -->
						<div class="data-screen__main__chart">
							<real-time-visitor-statistics ref="RealTimeVisitorStatisticsRef"></real-time-visitor-statistics>
						</div>
					</div>
					<div class="data-screen__main__left__center">
						<div class="data-screen__main__title">
							<span>男女比例</span>
							<img src="@/assets/images/data-screen/dataScreen-title.png" alt="" />
						</div>
						<!-- 男女比例 -->
						<div class="data-screen__main__chart">
							<male-female-ratio ref="MaleFemaleRatioRef"></male-female-ratio>
						</div>
					</div>
					<div class="data-screen__main__left__bottom">
						<div class="data-screen__main__title">
							<span>年龄比例</span>
							<img src="@/assets/images/data-screen/dataScreen-title.png" alt="" />
						</div>
						<!-- 年龄比例 -->
						<div class="data-screen__main__chart">
							<age-ratio ref="AgeRatioRef"></age-ratio>
						</div>
					</div>
				</div>
				<div class="data-screen__main__center">
					<!-- 地图 -->
					<div class="data-screen__map">
						<div class="data-screen__map__title">景区实时客流量</div>
						<china-map ref="MapchartRef"></china-map>
					</div>
					<div class="data-screen__cb">
						<div class="data-screen__main__title">
							<span>未来30天游客量趋势图</span>
							<img src="@/assets/images/data-screen/dataScreen-title.png" alt="" />
						</div>
						<!-- chart区域 -->
						<div class="data-screen__main__chart">
							<over-next-month ref="OverNextMonthRef"></over-next-month>
						</div>
					</div>
				</div>
				<div class="data-screen__main__right">
					<div class="data-screen__main__right__top">
						<div class="data-screen__main__title">
							<span>热门景区排行</span>
							<img src="@/assets/images/data-screen/dataScreen-title.png" alt="" />
						</div>
						<!-- chart区域 -->
						<div class="data-screen__main__chart">
							<hot-plate ref="HotPlateRef"></hot-plate>
						</div>
					</div>
					<div class="data-screen__main__right__center">
						<div class="data-screen__main__title">
							<span>年度游客量对比</span>
							<img src="@/assets/images/data-screen/dataScreen-title.png" alt="" />
						</div>
						<!-- chart区域 -->
						<div class="data-screen__main__chart">
							<annual-user ref="AnnualUseRef"></annual-user>
						</div>
					</div>
					<div class="data-screen__main__right__bottom">
						<div class="data-screen__main__title">
							<span>预约渠道数据统计</span>
							<img src="@/assets/images/data-screen/dataScreen-title.png" alt="" />
						</div>
						<!-- chart区域 -->
						<div class="data-screen__main__chart">
							<plat-form-source ref="PlatformSourceRef"></plat-form-source>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { randomNum } from "@/utils/shard";
import { useNow, useDateFormat } from "@vueuse/core";
import { ECharts } from "echarts";
import { onBeforeUnmount, onMounted, ref } from "vue";
import {
	PlatFormSource,
	RealTimeVisitorStatistics,
	AnnualUser,
	MaleFemaleRatio,
	AgeRatio,
	ChinaMap,
	OverNextMonth,
	HotPlate
} from "./components";
import { ageData, mapData, hotData, annualData, platFromData } from "./constants";
import { useRouter } from "vue-router";
const router = useRouter();
const time = useDateFormat(useNow(), "YYYY-MM-DD HH:mm:ss");
const goHome = () => {
	router.push("/");
};
const dataScreenRef = ref();
// 声明echarts实例
interface ChartProps {
	[key: string]: ECharts | null;
}
const dataScreen: ChartProps = {
	chart1: null,
	chart2: null,
	chart3: null,
	chart4: null,
	chart5: null,
	chart6: null,
	chart7: null,
	mapChart: null
};

// 获取子组件实例
interface ChartExpose {
	initChart: (params: any) => ECharts;
}
const RealTimeVisitorStatisticsRef = ref<ChartExpose>();
const MaleFemaleRatioRef = ref<ChartExpose>();
const AgeRatioRef = ref<ChartExpose>();
const MapchartRef = ref<ChartExpose>();
const OverNextMonthRef = ref<ChartExpose>();
const HotPlateRef = ref<ChartExpose>();
const AnnualUseRef = ref<ChartExpose>();
const PlatformSourceRef = ref<ChartExpose>();
// 初始化 echarts
const initCharts = (): void => {
	dataScreen.chart1 = RealTimeVisitorStatisticsRef.value?.initChart(0.5) as ECharts;
	dataScreen.chart2 = AgeRatioRef.value?.initChart(ageData) as ECharts;
	dataScreen.chart3 = AnnualUseRef.value?.initChart({
		data: annualData,
		unit: annualData.map(val => val.label),
		columns: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
		colors: ["#FFA600", "#007AFE", "#FF4B7A"]
	}) as ECharts;
	dataScreen.chart4 = HotPlateRef.value?.initChart({
		data: hotData,
		colors: ["#1089E7", "#F57474", "#56D0E3", "#F8B448", "#8B78F6"]
	}) as ECharts;
	dataScreen.chart5 = MaleFemaleRatioRef.value?.initChart({
		man: 0.6,
		woman: 0.4
	}) as ECharts;
	dataScreen.chart6 = OverNextMonthRef.value?.initChart({
		unit: ["访问量"],
		data: new Array(30).fill("").map(val => {
			val = randomNum(1, 20000);
			return val;
		})
	}) as ECharts;
	dataScreen.chart7 = PlatformSourceRef.value?.initChart({
		data: platFromData,
		colors: ["#078dbc", "#6ad40b", "#6172fc", "#1786ff", "#ffbe2f", "#4dc89d", "#b797df", "#ffd3aa"]
	}) as ECharts;
	dataScreen.mapChart = MapchartRef.value?.initChart(mapData) as ECharts;
};
// 根据浏览器大小推断缩放比例
const getScale = (width = 1920, height = 1080) => {
	let ww = window.innerWidth / width;
	let wh = window.innerHeight / height;
	return ww < wh ? ww : wh;
};

// 监听浏览器 resize 事件
const resize = () => {
	if (dataScreenRef.value) {
		dataScreenRef.value.style.transform = `scale(${getScale()}) translate(-50%, -50%)`;
	}
	// 使用了 scale 的echarts其实不需要需要重新计算缩放比例
	Object.values(dataScreen).forEach(chart => {
		chart && chart.resize();
	});
};

onMounted(() => {
	// 初始化时为外层盒子加上缩放属性，防止刷新界面时就已经缩放
	if (dataScreenRef.value) {
		dataScreenRef.value.style.transform = `scale(${getScale()}) translate(-50%, -50%)`;
		dataScreenRef.value.style.width = `1920px`;
		dataScreenRef.value.style.height = `1080px`;
	}
	// 初始化echarts
	initCharts();
	// 为浏览器绑定事件
	window.addEventListener("resize", resize);
});

onBeforeUnmount(() => {
	window.removeEventListener("resize", resize);
	Object.values(dataScreen).forEach(val => val?.dispose());
});
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
