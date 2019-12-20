// // ph data
// let phSettingLeft = 6;
// let phSettingRight = 8;
// let phCur = 9;
// let phCheck = true;
// // water level data
// let wlSetting = 0.375;
// let wlCur = 0.5;
// let wlCheck = false;
// // temperature & humidity data
// let tmpSetting = 30;
// let tmpCur = 35;
// let humSetting = 70;
// let humCur = 80;
// let htCheck = false;

$().ready(function () {
	//checkAllStates();
});
// function statesAlert() {
// 	swal({
// 		title: "注意！检测到异常",
// 		text: "是否重新设置异常数值边界值？",
// 		type: "error",
// 		showCancelButton: true,
// 		confirmButtonColor: "#DD6B55",
// 		confirmButtonText: "否，请忽略异常！",
// 		cancelButtonText: "是，重新设置！",
// 		closeOnConfirm: false,
// 		closeOnCancel: false
// 	},
// 	function(isConfirm){
// 		if (isConfirm) {
// 			swal("已忽略！", "已忽略本次异常，请查看设备！", "warning");
// 		} else {
// 			swal("已告警！", "是否已完成告警边界设置？", "success");
// 			window.open("warming-page.html");
// 		}
// 	});
// }
// function checkAllStates() {
// 	// ph check
// 	if (phCheck && typeof phCur == 'number' && (phCur > phSettingRight || phCur < phSettingLeft)) {
// 		statesAlert();
// 		console.log("ph");
// 		
// 	}
// 	// water level check
// 	if (wlCheck && typeof wlCur == 'number' && wlCur > wlSetting) {
// 		// statesAlert();
// 		console.log("wl");
// 		
// 	}
// 	// temperature & humidity check
// 	if (htCheck && ((typeof tmpCur == 'number' && tmpCur > tmpSetting) || (typeof humCur == 'number' && humCur > humSetting))) {
// 		// statesAlert();
// 		console.log("ht");
// 		
// 	}
// }