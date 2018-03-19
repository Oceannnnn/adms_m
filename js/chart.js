//chart配置
function option(left, type) {
	choose();
	var dataZoom;
	if(type == "bar") {
		dataZoom = [{
				show: true,
				start: 70,
				end: 100,
				bottom: '15%'
			},
			{
				show: true,
				yAxisIndex: 0,
				filterMode: 'empty',
				width: 25,
				height: '56%',
				showDataShadow: false,
				left: '2%'
			}
		]
	} else if(type == "line") {
		dataZoom = [{
			show: true,
			start: 70,
			end: 100,
			bottom: '15%'
		}]
	}
	var set = {
		title: {
			text: table_tit,
			textStyle: {
				fontSize: 16,
			}
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow',
				label: {
					show: true
				}
			},
			position: ['0%', '15%']
		},
		calculable: true,
		legend: {
			type: 'scroll',
			itemHeight: '18',
			pageIconSize: '22',
			pageButtonPosition: 'start',
			data: [],
			top: '86%',
		},
		xAxis: [{
			type: 'category',
			data: []
		}],
		yAxis: [{
				type: 'value',
				name: '金额（万元）',
				axisLabel: {
					formatter: function(value) {
						return Math.ceil(value / 1000 ); //

					}
				}
			},
			{
				type: 'value',
				name: '利润率',
				axisLabel: {
					formatter: '{value} %'
				}
			}
		],
		grid: {
			top: '18%',
			left: left,
			right: '1%',
			bottom: '20%',
			containLabel: true
		},
		dataZoom: dataZoom
	}
	return set;
}

////图表
function bar() {
	// 基于准备好的dom，初始化echarts实例
	var barChart = echarts.init(document.getElementById('main'));
	barChart.showLoading();
	barChart.setOption(option("11%", "bar"));
	allChart(barChart, totalData, "bar");
	window.onresize = function() {
		barChart.resize();
	};
	return barChart;
}

//折线图
function line() {
	// 基于准备好的dom，初始化echarts实例
	var lineChart = echarts.init(document.getElementById('main-line'));
	lineChart.showLoading();
	lineChart.setOption(option("2%", "line"));
	allChart(lineChart, totalData, "line");
	window.onresize = function() {
		lineChart.resize();
	};
	return lineChart;
}

//饼图
function pie() {
	// 基于准备好的dom，初始化echarts实例
	var pieChart = echarts.init(document.getElementById('main-pie'));
	pieChart.showLoading();
	pieChart.setOption({
		title: {
			text: table_tit,
			subtext: '利润率',
			textStyle: {
				fontSize: 16,
			}
		},
		tooltip: {
			trigger: 'item',
			formatter: "{a} <br/>{b}<br/>{c} ({d}%)",
			position: ['0', '95%'],
		},
		legend: {
			type: 'scroll',
			itemHeight: '18',
			pageIconSize: '22',
			left: 'left',
			top: '15%',
			data: [],
			z: 100,
			zlevel: 100
		},
		series: [{
			name: '利润率',
			type: "pie",
			radius: "60%",
			center: ["50%", "62%"],
			itemStyle: {
				emphasis: {
					shadowBlur: 10,
					shadowOffsetX: 0,
					shadowColor: "rgba(0, 0, 0, 0.5)"
				}
			},
			label: {
				normal: {
					show: false
				}
			},
			data: []
		}]
	});
	allChart(pieChart, totalData, "pie");
	window.onresize = function() {
		pieChart.resize();
	};
	return pieChart;
}