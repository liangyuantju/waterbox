// 参数
let apiParamArray = ['setall', 'setpick', 'setheavy', 'setlight'];
// 状态输入
let stateInput = ['pipeline-state', 'arm-state', 'heavy-arm-state', 'light-arm-state'];
// 轻-小时
var domLightHour = document.getElementById("light-hour");
var chartLightHour = echarts.init(domLightHour);
var app = {};
optionLightWeight = null;
optionLightWeight = {
	title : {
		show: true,
		subtext: '24小时内轻货物数量',
		x: 'center'
	},
    color: ['#3398DB'],
    tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: [
        {
            type: 'category',
            data: ['0点', '1点', '2点', '3点', '4点', '5点', '6点', '7点', '8点', '9点', '10点', '11点', '12点', '13点', '14点', '15点', '16点', '17点', '18点', '19点', '20点', '21点', '22点', '23点'],
            axisTick: {
                alignWithLabel: true
            }
        }
    ],
    yAxis: [
        {
            type: 'value',
			minInterval: 1
        }
    ],
    series: [
        {
            name: '货物数量',
            type: 'bar',
            barWidth: '60%',
            data: []
        }
    ]
};
// 重-小时
var domHeavyHour = document.getElementById("heavy-hour");
var chartHeavyHour = echarts.init(domHeavyHour);
var app = {};
optionHeavyWeight = null;
optionHeavyWeight = {
	title : {
		show: true,
		subtext: '24小时内重货物数量',
		x: 'center'
	},
    color: ['#3398DB'],
    tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: [
        {
            type: 'category',
            data: ['0点', '1点', '2点', '3点', '4点', '5点', '6点', '7点', '8点', '9点', '10点', '11点', '12点', '13点', '14点', '15点', '16点', '17点', '18点', '19点', '20点', '21点', '22点', '23点'],
            axisTick: {
                alignWithLabel: true
            }
        }
    ],
    yAxis: [
        {
            type: 'value',
			minInterval: 1
        }
    ],
    series: [
        {
            name: '货物数量',
            type: 'bar',
            barWidth: '60%',
            data: []
        }
    ]
};
// 总-小时
var domTotalHour = document.getElementById("heavy-hour");
var chartTotalHour = echarts.init(domTotalHour);
var app = {};
optionTotalWeight = null;
optionHeavyWeight = {
	title : {
		show: true,
		subtext: '24小时内重货物数量',
		x: 'center'
	},
    color: ['#3398DB'],
    tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: [
        {
            type: 'category',
            data: ['0点', '1点', '2点', '3点', '4点', '5点', '6点', '7点', '8点', '9点', '10点', '11点', '12点', '13点', '14点', '15点', '16点', '17点', '18点', '19点', '20点', '21点', '22点', '23点'],
            axisTick: {
                alignWithLabel: true
            }
        }
    ],
    yAxis: [
        {
            type: 'value',
			minInterval: 1
        }
    ],
    series: [
        {
            name: '货物数量',
            type: 'bar',
            barWidth: '60%',
            data: []
        }
    ]
};

$().ready(function () {
	getCurState();
	confirmState();
	curGraph();
})
function getCurState() {
	$.ajax({
		url: "display_arm_status",
		type: "GET",
		dataType: "json",
		success : function(data) {
			// console.log(data);
			if (data['status'] == 0) {
				$("#cur-arm-state").html('停止');
			} else {
				$("#cur-arm-state").html('运行');
			}
		},
		error: function() {
			console.log("异常!");
		}
	})
	$.ajax({
		url: "display_cargo_weight",
		type: "GET",
		dataType: "json",
		success : function(data) {
			// console.log(data);
			$("#cur-cargo-weight").html(data['value'].toFixed(3));
		},
		error: function() {
			console.log("异常!");
		}
	})
	setTimeout(getCurState, 1000 * 60 * 2);
}
function confirmState() {
	let confirmBtn = document.querySelectorAll(".btn_confirm");
	for(let i = 0; i < confirmBtn.length; i++) {
		confirmBtn[i].onclick = function() {
			let inputOpt = document.getElementById(stateInput[i]);
			let inputIndex = inputOpt.selectedIndex;
			let data = {
				funcName : apiParamArray,
				param : inputIndex,
			};
			let sendData = JSON.stringify(data);
			$.ajax({
				url: "set_robotic_arm",
				type: "POST",
				data : sendData,
				dataType: "json",
				success : function(msg) {
					console.log(msg);
				},
				error: function() {
					console.log("控制请求异常!");
				}
			})
		}
	}
}
function curGraph() {
	$.ajax({
		url: "query_cargo_count",
		type: "GET",
		dataType: "json",
		success: function (data) {
			// 轻-小时
			for (let i = 0; i < 24; i++) {
				optionLightWeight.series[0].data.push(data['count_light_by_hour'][i]);
			}
			console.log(optionLightWeight.series[0].data);
			chartLightHour.setOption(optionLightWeight, true);
			// 重-小时
			for (let i = 0; i < 24; i++) {
				optionHeavyWeight.series[0].data.push(data['count_heavy_by_hour'][i]);
			}
			console.log(optionHeavyWeight.series[0].data);
			chartHeavyHour.setOption(optionHeavyWeight, true);
			// 总-小时
		}
	})
	setTimeout(getCurState, 1000 * 60 * 2);
}