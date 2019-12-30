setInterval(function() {
	$.ajax({
		url: "queryLatestedData",
		type: "GET",
		dataType: "json",
		success : function(msg) {
			console.log(msg);
			$("#cur-wl").html(msg[0]['waterlevel'].toFixed(3));
		},
		error: function() {
			console.log("异常!");
		}
	})
	$.ajax({
		url: "controlDataDisplay",
		type: "GET",
		dataType: "json",
		success : function(msg) {
			//console.log(msg);
			$("#cur-wl-bound").html(msg[0]['setlevel']);
		},
		error: function() {
			console.log("异常!");
		}
	})
}, 1000)
function setWaterLevel() {
	let inputWaterLevel = document.getElementById('water-level-state').value;
	var data = {
		funcName : "setlevel",
		param : inputWaterLevel,
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