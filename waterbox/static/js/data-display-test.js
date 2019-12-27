$().ready(function () {
	// $("#stateGraph").css("height",window.document.body.clientHeight*0.28)
})
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
			+ data[i - 1]['waterlevel'] + '</td>';
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
		offset:-140,
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
				return value-10;
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
		max:5,
		position:'left',
		offset:-140,
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
		offset:-140,
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
		offset:-140,
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
			//console.log(data);
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
			waterlevelOption.series[1].data[0].value = data[0]['waterlevel'];
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
}, 1000);