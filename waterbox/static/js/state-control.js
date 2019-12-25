$().ready(function () {
	$.ajax({
		url: "controlDataDisplay",
		type: "GET",
		dataType: "json",
		success : function(msg) {
			// console.log(msg);
			// setpump
			let pumpOpt = document.getElementById("pump-state").getElementsByTagName("option");
			for (let i = 0; i < 2; i++) {
				pumpOpt[i].selected = false;
			}
			pumpOpt[msg[0]['setpump']].selected = true;
			// setgate
			let gateOpt = document.getElementById("gate-state").getElementsByTagName("option");
			for (let i = 0; i < 2; i++) {
				gateOpt[i].selected = false;
			}
			gateOpt[msg[0]['setgate']].selected = true;
			// setauto
			let autoOpt = document.getElementById("mode-state").getElementsByTagName("option");
			for (let i = 0; i < 2; i++) {
				autoOpt[i].selected = false;
			}
			autoOpt[msg[0]['setauto']].selected = true;
		}
	})
})
function setPump() {
	let pumpOpt = document.getElementById("pump-state");
	let pumpIndex = pumpOpt.selectedIndex;
	var data = {
		funcName : "setpump",
		param : pumpIndex,
	};
	var sendData = JSON.stringify(data);
	console.log(sendData);
	$.ajax({
		url: "callRestfulApi",
		type: "POST",
		data : sendData,
		dataType: "json",
		success : function(msg) {
			console.log(msg);
		},
		error: function() {
			console.log("异常!");
		}
	})
} 
function setGate() {
	let gateOpt = document.getElementById("gate-state");
	let gateIndex = gateOpt.selectedIndex;
	var data = {
		funcName : "setgate",
		param : gateIndex,
	};
	var sendData = JSON.stringify(data);
	console.log(sendData);
	$.ajax({
		url: "callRestfulApi",
		type: "POST",
		data : sendData,
		dataType: "json",
		success : function(msg) {
			console.log(msg);
		},
		error: function() {
			console.log("异常!");
		}
	})
} 
function setMode() {
	let modeOpt = document.getElementById("mode-state");
	let modeIndex = modeOpt.selectedIndex;
	var data = {
		funcName : "setauto",
		param : modeIndex,
	};
	var sendData = JSON.stringify(data);
	console.log(sendData);
	$.ajax({
		url: "callRestfulApi",
		type: "POST",
		data : sendData,
		dataType: "json",
		success : function(msg) {
			console.log(msg);
		},
		error: function() {
			console.log("异常!");
		}
	})
} 
setInterval(function() {
	$.ajax({
		url: "queryLatestedData",
		type: "GET",
		dataType: "json",
		success : function(msg) {
			//console.log(msg);
			$("#cur-wl-bound").html(msg[0]['waterlevel']);
			$("#cur-qow").html(msg[0]['watermeter']);
		},
		error: function() {
			console.log("异常!");
		}
	})
}, 1000)
