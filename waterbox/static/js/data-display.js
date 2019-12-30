// 实时数据
let curDataFragment = document.createDocumentFragment();
setInterval(function() {
	$.ajax({
		url: "queryLatestedPathchData",
		type: "GET",
		dataType: "json",
		success: function (data) {
		let dataLen = data.length;
			
		let m = document.getElementById("dispaly-data");
		let nodesLength = m.childNodes.length;
		for (let i = 0; i < nodesLength; i++) {
		m.removeChild(m.childNodes[0]);
		}

		for (let i = 1; i < dataLen + 1; i++) {
		let tmpTr = document.createElement('tr');
		tmpTr.innerHTML = '<td>'
			+ i + '</td><td>' 
			+ data[i - 1]['temperature'] + '</td><td>'
			+ data[i - 1]['humidity'] + '</td><td>'
			+ data[i - 1]['watermeter'] + '</td><td>'
			+ data[i - 1]['acidbase'] + '</td><td>'
			+ data[i - 1]['waterlevel'].toFixed(3) + '</td>';
		curDataFragment.appendChild(tmpTr);
		}
		document.getElementById("dispaly-data").appendChild(curDataFragment);
		}
	})
}, 1000);
// 水表数据
let wmChart = echarts.init(document.getElementById("watermeter"));
let app = {};
wmOption = null;
wmOption = {
	tooltip : {
		formatter: "{a} <br/>{b} : {c}"
	},
	series: [
		{
			name: '流量',
			min: 0,
			max: 20,
			type: 'gauge',
			detail: {formatter:'{value}'},
			data: [{value: 10, name: '水表'}]
		}
	]
};
// 温度数据
var tempChart = echarts.init(document.getElementById("temperature"));
var data = [0];
var xMax = 60;
var axisColor = '#fff';
tempOption = {
	tooltip: {
		show: true,
		formatter: "{b} <br> {c}"

	},
	yAxis: [{
		min:0,
		max:60,
		position:'left',
		offset:-114,
		axisTick: {
			show: true,
			// color:'#fff',
		},
		axisLine: {
			show: false,
		},
		axisLabel: {
			show: true,
			formatter:function(value,index){
				return value;
				// return value;
			}
			//color:'#fff',
		},
		splitLine: {
			show: false,
			// color:'#fff',
		},
		splitNumber :5,
	}],
	xAxis: [{
		type: 'category',
		data: ['温度'],
		axisTick: {
			// color:'#fff',
			show: false,
		},
		axisLine: {
			//  color:'#fff',
			show: false,
		},
		axisLabel: {
			textStyle: {
				color: '#000',
			}
		}

	}],
	series: [{
		name: ' ',
		type: 'bar',
		barWidth: 40,
		silent: true,
		
		itemStyle: {
			normal: {
				color: '#DDDDDD',
				barBorderRadius: [0, 0, 0, 0],

			}

		},
		barGap: '-100%',
		
		//barCategoryGap: '60%',
		data: data.map(function(d) {
			return xMax
		}),
	}, {
		name: ' ',
		type: 'bar',
		barWidth: 40,
		label: {
			normal: {
				show: true,
				position: 'top',
				formatter: function(o){
					// return o.value-10+'℃';
					return o.value+'℃';
				},
			}
		},
		data: [{
			value: 15+10,
			itemStyle: {
				normal: {
					barBorderRadius: [0, 0, 0, 0],
					color: {
						type: 'bar',
						colorStops: [{
							offset: 0,
							color: '#87CEEB' // 0% 处的颜色
						}, {
							offset: 1,
							color: '#0066FF' // 100% 处的颜色
						}],
						globalCoord: false, // 缺省为 false

					}
				}
			}
		} ],
	}]
};
// 水位数据
var waterlevelChart = echarts.init(document.getElementById("waterlevel"));
var data = [0];
var xMax = 60;
var axisColor = '#fff';
waterlevelOption = {
	tooltip: {
		show: true,
		formatter: "{b} <br> {c}"

	},
	yAxis: [{
		min:0,
		max:0.2,
		position:'left',
		offset:-114,
		axisTick: {
			show: true,
			// color:'#fff',
		},
		axisLine: {
			show: false,
		},
		axisLabel: {
			show: true,
			formatter:function(value,index){
				return value;
				// return value;
			}
			//color:'#fff',
		},
		splitLine: {
			show: false,
			// color:'#fff',
		},
		splitNumber :5,
	}],
	xAxis: [{
		type: 'category',
		data: ['水位值'],
		axisTick: {
			// color:'#fff',
			show: false,
		},
		axisLine: {
			//  color:'#fff',
			show: false,
		},
		axisLabel: {
			textStyle: {
				color: '#000',
			}
		}

	}],
	series: [{
		name: ' ',
		type: 'bar',
		barWidth: 40,
		silent: true,
		
		itemStyle: {
			normal: {
				color: '#DDDDDD',
				barBorderRadius: [0, 0, 0, 0],

			}

		},
		barGap: '-100%',
		
		//barCategoryGap: '60%',
		data: data.map(function(d) {
			return xMax
		}),
	}, {
		name: ' ',
		type: 'bar',
		barWidth: 40,
		label: {
			normal: {
				show: true,
				position: 'top',
				formatter: function(o){
					// return o.value-10+'m';
					return o.value+'m';
				},
			}
		},
		data: [{
			value: 0,
			itemStyle: {
				normal: {
					barBorderRadius: [0, 0, 0, 0],
					color: {
						type: 'bar',
						colorStops: [{
							offset: 0,
							color: '#87CEEB' // 0% 处的颜色
						}, {
							offset: 1,
							color: '#0066FF' // 100% 处的颜色
						}],
						globalCoord: false, // 缺省为 false

					}
				}
			}
		} ],
	}]
};
// 湿度数据
var humidityChart = echarts.init(document.getElementById("humidity"));
var data = [50];
var xMax = 70;
var axisColor = '#fff';
humidityOption = {
	tooltip: {
		show: true,
		formatter: "{b} <br> {c}"

	},
	yAxis: [{
		min:10,
		max:70,
		position:'left',
		offset:-114,
		axisTick: {
			show: true,
			// color:'#fff',
		},
		axisLine: {
			show: false,
		},
		axisLabel: {
			show: true,
			formatter:function(value,index){
				return value;
			}
			//color:'#fff',
		},
		splitLine: {
			show: false,
			// color:'#fff',
		},
		splitNumber :5,
	}],
	xAxis: [{
		type: 'category',
		data: ['湿度'],
		axisTick: {
			// color:'#fff',
			show: false,
		},
		axisLine: {
			//  color:'#fff',
			show: false,
		},
		axisLabel: {
			textStyle: {
				color: '#000',
			}
		}

	}],
	series: [{
		name: ' ',
		type: 'bar',
		barWidth: 40,
		silent: true,
		
		itemStyle: {
			normal: {
				color: '#DDDDDD',
				barBorderRadius: [0, 0, 0, 0],

			}

		},
		barGap: '-100%',
		
		//barCategoryGap: '60%',
		data: data.map(function(d) {
			return xMax
		}),
	}, {
		name: ' ',
		type: 'bar',
		barWidth: 40,
		label: {
			normal: {
				show: true,
				position: 'top',
				formatter: function(o){
					return o.value+'%';
				},
			}
		},
		data: [{
			value: 40,
			itemStyle: {
				normal: {
					barBorderRadius: [0, 0, 0, 0],
					color: {
						type: 'bar',
						colorStops: [{
							offset: 0,
							color: '#87CEEB' // 0% 处的颜色
						}, {
							offset: 1,
							color: '#0066FF' // 100% 处的颜色
						}],
						globalCoord: false, // 缺省为 false

					}
				}
			}
		} ],
	}]
};
// 酸碱度数据
var pHChart = echarts.init(document.getElementById("ph"));
var data = [50];
var xMax = 14;
var axisColor = '#fff';
pHOption = {
	tooltip: {
		show: true,
		formatter: "{b} <br> {c}"

	},
	yAxis: [{
		min:0,
		max:14,
		position:'left',
		offset:-114,
		axisTick: {
			show: true,
			// color:'#fff',
		},
		axisLine: {
			show: false,
		},
		axisLabel: {
			show: true,
			formatter:function(value,index){
				return value;
			}
			//color:'#fff',
		},
		splitLine: {
			show: false,
			// color:'#fff',
		},
		splitNumber :5,
	}],
	xAxis: [{
		type: 'category',
		data: ['酸碱度'],
		axisTick: {
			// color:'#fff',
			show: false,
		},
		axisLine: {
			//  color:'#fff',
			show: false,
		},
		axisLabel: {
			textStyle: {
				color: '#000',
			}
		}

	}],
	series: [{
		name: ' ',
		type: 'bar',
		barWidth: 40,
		silent: true,
		
		itemStyle: {
			normal: {
				color: '#DDDDDD',
				barBorderRadius: [0, 0, 0, 0],

			}

		},
		barGap: '-100%',
		
		//barCategoryGap: '60%',
		data: data.map(function(d) {
			return xMax
		}),
	}, {
		name: ' ',
		type: 'bar',
		barWidth: 40,
		label: {
			normal: {
				show: true,
				position: 'top',
				formatter: function(o){
					return o.value+'';
				},
			}
		},
		data: [{
			value: 40,
			itemStyle: {
				normal: {
					barBorderRadius: [0, 0, 0, 0],
					color: {
						type: 'bar',
						colorStops: [{
							offset: 0,
							color: '#87CEEB' // 0% 处的颜色
						}, {
							offset: 1,
							color: '#0066FF' // 100% 处的颜色
						}],
						globalCoord: false, // 缺省为 false

					}
				}
			}
		} ],
	}]
};
// 数据实时更新
setInterval(function() {
	$.ajax({
		url: "queryLatestedData",
		type: "GET",
		dataType: "json",
		success: function (data) {
			// 水表
			wmOption.series[0].data[0].value = data[0]['watermeter'];
			wmChart.setOption(wmOption, true);
			// 温度计
			if (data[1]['temperature'] == 1) {
				tempOption.series[1].data[0].itemStyle.normal.color.colorStops[0].color = '#FF0000';
				tempOption.series[1].data[0].itemStyle.normal.color.colorStops[1].color = '#CC0000';
			}
			tempOption.series[1].data[0].value = data[0]['temperature'];
			tempChart.setOption(tempOption);
			// 水位计
			if (data[1]['waterlevel'] == 1) {
				waterlevelOption.series[1].data[0].itemStyle.normal.color.colorStops[0].color = '#FF0000';
				waterlevelOption.series[1].data[0].itemStyle.normal.color.colorStops[1].color = '#CC0000';
			}
			let numWaterLevel = data[0]['waterlevel'];
			//console.log(typeof(data[0]['waterlevel']));
			//console.log(numWaterLevel.toFixed(2));
			waterlevelOption.series[1].data[0].value = numWaterLevel.toFixed(2);
			waterlevelChart.setOption(waterlevelOption);
			// 湿度计
			if (data[1]['humidity'] == 1) {
				humidityOption.series[1].data[0].itemStyle.normal.color.colorStops[0].color = '#FF0000';
				humidityOption.series[1].data[0].itemStyle.normal.color.colorStops[1].color = '#CC0000';
			}
			humidityOption.series[1].data[0].value = data[0]['humidity'];
			humidityChart.setOption(humidityOption);
			// ph计
			if (data[1]['acidbase'] == 1) {
				pHOption.series[1].data[0].itemStyle.normal.color.colorStops[0].color = '#FF0000';
				pHOption.series[1].data[0].itemStyle.normal.color.colorStops[1].color = '#CC0000';
			}
			pHOption.series[1].data[0].value = data[0]['acidbase'];
			pHChart.setOption(pHOption);
		}
	})
	$.ajax({
		url: "displayThresHold",
		type: "GET",
		dataType: "json",
		success: function (data) {
			// 水位
			let waterLevelHtml = "水位阈值：" + data[0]["cur_thres"]["waterlevel"];
			$("#waterlavel-range").html(waterLevelHtml);
			// 温度
			let temperatureHtml = "温度阈值：" + data[0]["cur_thres"]["temperature"];
			$("#temperature-range").html(temperatureHtml);
			// 湿度
			let humidityHtml = "湿度阈值：" + data[0]["cur_thres"]["humidity"];
			$("#humidity-range").html(humidityHtml);
			// 酸碱度
			let leftVal = data[0]["cur_thres"]["acidbase"]["left_thres"];
			let rightVal = data[0]["cur_thres"]["acidbase"]["right_thres"];
			if (leftVal == '-1') {
				$("#acidbase-range-left").html('-');
			} else {
				$("#acidbase-range-left").html(leftVal);
			}
			if (rightVal == '15') {
				$("#acidbase-range-right").html('-');
			} else {
				$("#acidbase-range-right").html(rightVal);
			}
		}
	})
}, 1000);

// test graph
var myChart = echarts.init(document.getElementById("watermeter-dynamic"));
option = null;
function randomData() {
	now = new Date(+now + oneSec);
	value = Math.random() * 1;
	return {
		name: now.toString(),
		value: [
			[now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'),
			value
		]
	}
}

var data = [];
var now = +new Date(2018, 12, 17);
var oneSec = 24 * 3600 * 1000;
var value = Math.random();
// for (var i = 0; i < 1000; i++) {
// 	data.push(randomData());
// }

option = {
	title: {
	},
	tooltip: {
		trigger: 'axis',
		// formatter: function (params) {
		// 	params = params[0];
		// 	var date = new Date(params.name);
		// 	return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' : ' + params.value[1];
		// },
		axisPointer: {
			animation: true
		}
	},
	xAxis: {
		type: 'category',
		splitLine: {
			show: false
		}
	},
	yAxis: {
		min:0,
		type: 'value',
		boundaryGap: [0, '100%'],
		splitLine: {
			show: false
		}
	},
	series: [{
		name: '模拟数据',
		type: 'line',
		showSymbol: false,
		hoverAnimation: false,
		data: data
	}]
};

setInterval(function () {
	
	// 取水位数据
	$.ajax({
		url: "queryLatestedWaterLevel",
		type: "GET",
		dataType: "json",
		success: function (msg) {
			// 水位计
			//waterlevelOption.series[1].data[0].value = data[0]['waterlevel'];
			if (data.length >= 1000) {
				data.shift();
			}
			let tmpData = randomData();
			//tmpData['value'][1] = msg[0]['waterlevel'];
			data.push(msg[0]['waterlevel']);
			myChart.setOption({
				series: [{
					data: data
				}]
			});
			myChart.setOption(option, true);
		}
	})

	// data.shift();
	// data.push(randomData());

	// myChart.setOption({
	// 	series: [{
	// 		data: data
	// 	}]
	// });
}, 1000);
if (option && typeof option === "object") {
	myChart.setOption(option, true);
}