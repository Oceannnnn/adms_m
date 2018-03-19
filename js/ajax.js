//请求表格数据
var barChart, lineChart, pieChart;
function filter() {
	choose();
	$('#Table_data tbody').unbind("scroll");
	var data = "?dateStart=" + my_start +
		"&dateEnd=" + my_end +
		"&media=" + Select +
		"&type=" + collect_sel;
	if(Select == 'PAPER') {
		data += '&subMedia=' + s2
	}
	$.ajax({
		url: baseUrl + "adms/reviewer/aggregation" + data, //'json/data1.json'
		type: 'GET',
		xhrFields: {
			withCredentials: true
		},
		error: function(err) {
			$.AMUI.progress.done();
			$('.am-tabs-bd img').show();
			
		},
		success: function(res) {
			$.AMUI.progress.done();
			$('.am-tabs-bd img').hide();
			if(res.item.length == 0) {
				$('#Table_data thead tr').html('');
				$('#Table_data table tbody').html('');
				if(barChart != undefined && !barChart.isDisposed()){
					barChart.dispose();
					lineChart.dispose();
					pieChart.dispose()
				}
				$('.am-tabs-bd img').show();
			} else {
				$('#Table_data thead tr').html('');
				$('#Table_data table tbody').html('');
				$('.am-tabs-bd img').hide();
				totalData = res;
				itemsArray = [];
				for(var x in totalData) {
					if(totalData.hasOwnProperty(x)) {
						itemsArray.push(x);
					}
				}
				$('#Table_data table thead tr').html('');
				$('#Table_data table tbody').html('');
				table();
				barChart = bar();
				lineChart = line();
				pieChart = pie();
				$("#Table_data tbody").bind("scroll", scrollhandler);
			}

		}
	});
}

//添加数据加载
function addition() {
	$.ajax({
		url: '', //''json/main.json
		type: 'get',
		dataType: 'json',
		error: function() {
			$('#add_data img').show();
		},
		success: function(data) {
			$('#add_data img').hide();
			for(var i = 0; i < data.Add.length; i++) {
				var span =
					'<label class="am-checkbox-inline am-block">' + '<input type="checkbox"  value="' + i + '" > <span>' + data.Add[i].name + '</span>' + '</label>';
				$('#add_data').append(span);
			}
			$("#add_data input[type='checkbox']").uCheck('enable');
		}
	});
}

//chart請求
function allChart(tpyeChart, res, type) {
	tpyeChart.hideLoading();
	if(typeof res !== 'object') {
		res = JSON.parse(res)
	}
	var ser1 = res.item;
	var ser2 = res.profitRate;
	var dataArr = [],
		lenArr = [],
		proArr = [];
	for(var i = 0; i < ser1.length; i++) {
		proArr.push({
			name: ser1[i],
			value: ser2[i]
		});
	}
	var dataColumn = [];
	for(var y in res) {
		if(res.hasOwnProperty(y)) {
			dataColumn.push(y);
		}
	}
	for(var n = 1; n < dataColumn.length; n++) {
		var a = {
			name: transform(dataColumn[n]).name,
			type: type,
			data: res[dataColumn[n]],
			yAxisIndex: 0
		}
		if(dataColumn[n] == 'profitRate') {
			a.yAxisIndex = 1;
		}
		dataArr.push(a);
		lenArr.push(a.name)
	}
	if(type == "pie") {
		tpyeChart.setOption({
			legend: {
				data: ser1
			},
			series: [{
				data: proArr
			}]
		});
	} else {
		tpyeChart.setOption({
			legend: {
				data: lenArr
			},
			xAxis: [{
				data: ser1
			}],
			series: dataArr
		});
	}
	window.onresize = function() {
		tpyeChart.resize();
	};
	setTimeout(function() {
		tpyeChart.resize();
	}, 1);
}