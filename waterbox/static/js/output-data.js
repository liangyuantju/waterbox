let tmp;

var myChart = echarts.init(document.getElementById("cur-graph"));
var app = {};
option = null;
option = {
	title: {
        subtext: '',
        x: 'center'
    },
	toolbox: {
		feature: {
			saveAsImage: {}
		}
	},
	xAxis: {
		type: 'category',
		data: []
	},
	yAxis: {
		type: 'value'
	},
	series: [{
		data: [],
		type: 'line'
	}]
};
function getCurDate() {
	var date = new Date();
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	if (month < 10) {
		month = "0" + month;
	}
	if (day < 10) {
		day = "0" + day;
	}
	var curDate = month + "/" + day + "/" + year;
	return curDate;
}
function queryRange() {
	let startDate = document.getElementById('output-date-start').value;
	let endDate = document.getElementById('output-date-end').value;
	let curDate = getCurDate();
	let curType = document.getElementById('output-data').value;
	let curTitle = "数据从 " + startDate + " 至 " + endDate + "，生成日期为 " + curDate;
	let m = document.getElementById("select-error");
	if (m != null) {
		let nodesLength = m.childNodes.length;
		for (let i = 0; i < nodesLength; i++) {
			m.remove();
		}
	}
	if ((typeof startDate != "undefined" && startDate != null && startDate != "") 
		&& (typeof endDate != "undefined" && endDate != null && endDate != "") 
		&& startDate <= endDate 
		&& endDate <= curDate) {
		console.log("success!")
		var data = {
			dataType : curType,
			outputDateStart : startDate,
			outputDateEnd : endDate,
		};
		var sendData = JSON.stringify(data);
		$.ajax({
			url: "queryHisDataByDateRange",
			type: "POST",
			data : sendData,
			dataType: "json",
			success : function(msg) {
				console.log(msg);
				tmp = msg;
				if (option && typeof option === "object" && msg[0]['code'] == 0) {
					let msgLen = msg[0]['data'].length;
					option.series[0].data.length = 0;
					for (let i = 0; i < msgLen; i++) {
						
						//console.log(msg[0]['data'][i]);
						option.series[0].data.push(msg[0]['data'][i]);
						//console.log(option.series[0].data);
					}
					option.title.subtext = curTitle;
					myChart.setOption(option, true);
				}
			}
		})
	} else {
		let errorMsg = "日期选择有误!";
		let dateErrorFragment = document.createDocumentFragment();
		let tmpDiv = document.createElement('div');
		tmpDiv.setAttribute("id", "select-error")
		tmpDiv.innerHTML = '<div class="panel-body"><div class="form-group col-lg-4" style="color:red">' 
			+ errorMsg + '</div></div>';
		dateErrorFragment.appendChild(tmpDiv);
		document.getElementById("date-select").appendChild(dateErrorFragment);
		console.log(errorMsg)
	}
}

function outputToExcel() {
	let a = '数据,时间\n';
	testExcle("testa", a, 'testCSV', tmp);
}

function testExcle(id, tabletitle, tablename, data) {
	let str = tabletitle;
	for (let i = 0; i < data[0]['data'].length; i++) {
		let tmpData = data[0]['data'][i];
		let tmpTime = data[0]['update_time'][i];
		str += `${tmpData + '\t'},`;
		str += `${tmpTime + '\t'},`;
		str += '\n';
	}
	let uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str);
	var link = document.getElementById(id);
	link.href = uri;
	link.download = tablename + ".csv";
}

function testbtn() {
	console.log(tmp);
}