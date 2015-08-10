//global variable
var publicElement = (function () {
    this.ip = "10.103.240.198";
    this.port = "8080";
	this.login_id = null;
    return this;
})();

$(function(){
	publicElement.login_id = $("#login_id").attr("uid");
	showDistributionTable(publicElement.login_id);
	/*loadFreeBeaconIDList();
	$('#freeBeaconCollapse').collapse('hide');*/
});

/*function loadFreeBeaconIDList(){
	var url = "http://"+publicElement.ip+":"+publicElement.port+"/beacon/staff!find_vacant?user_id="+publicElement.login_id+"&jsoncallback=?";
	$.getJSON(
		url,
		function(result){
			if(!result.success){
				return;
			}
			var $tr = null;
			$('#freeBeaconCollapse_table tbody').empty();
			for(var i=0;i<result.total;i++){
				var uuid = result.vacant[i].value;
				var majors = result.vacant[i].majors?result.vacant[i].majors:[];
				for(var j=0;j<majors.length;j++){
					var major = majors[j].value;
					var minors = majors[j].sections?majors[j].sections:[];
					for(var k=0;k<minors.length;k++){
						var minor = minors[k].value0+'---'+minors[k].value1;
						$tr = $('<tr><td>'+uuid+'</td><td>'+major+'</td><td>'+minor+'</td></tr>');
						$('#freeBeaconCollapse_table tbody').append($tr);
					}
				}
			}
			
		}
	);
}*/
//================================
//功能： 调用beaconcount!total接口获取
//     该用户分配给下级的beacon情况
//================================
function showDistributionTable(uid){
	
	$.blockUI({ message: '<img src="./images/busy.gif" />' });
	var url = "http://"+publicElement.ip+":"+publicElement.port+"/beacon/beaconcount!total?send_id="+uid+"&jsoncallback=?";	
	$.getJSON(
			url,
			function(result){
				
				if(!result.success){
					$.unblockUI();
					return;
				}
				$("#distributeTable tbody").empty();
				var receive_id = "";
				var receive_name = "";
				var used = 0;
				var recover = 0;
				var time = "";
				var all = 0;
				var distributeArray = result.total;
				for(var i=0;i<distributeArray.length;i++){
					receive_id = distributeArray[i].receive_id;
					receive_name = distributeArray[i].receive_name;
					used = distributeArray[i].used;
					recover = distributeArray[i].recover;
					time = distributeArray[i].time;
					all = distributeArray[i].all;
					$tr = $("<tr><td>"+receive_name+"</td><td>"+used+"</td><td>"+recover+"</td><td>"+all+"</td><td>"+time+"</td><td><button type='button' class='btn btn-info btn-sm' receiveId='"+receive_id+"'>查看</button> <button type='button' class='btn btn-success btn-sm' receiveId='"+receive_id+"'>分配</button></td></tr>");
					$('#distributeTable tbody').append($tr);
					
					$tr.on('click',function(e){
						$target = $(e.target);
						if($target.hasClass('btn btn-info') || $target.parent().hasClass('btn btn-info')){
							
							checkDetail($target.attr('receiveId'),uid);						
						}else if($target.hasClass('btn btn-success') || $target.parent().hasClass('btn btn-success')){
							
							distributeBeacon($target.attr('receiveId'),uid);
						}
					});
				}
				$.unblockUI();
				$('#distributeTable').dataTable(
					{
		                 "order": [ 4, 'desc' ],
		                 "columns": [
						             { "width": "20%" },
						             { "width": "10%" },
						             { "width": "10%" },
						             { "width": "10%" },
						             { "width": "30%" },
						             { "width": "20%" }						             
						           ]
		                
		            }
		        );		
			}
	);
}
//================================
//功能： 调用beaconcount!find接口获取某
//     个代理的分配详情
//================================
function checkDetail(receiveId,sendId){
	$('#detailTable tbody').empty();
	var url = "http://"+publicElement.ip+":"+publicElement.port+"/beacon/beaconcount!find?receive_id="+receiveId+"&send_id="+sendId+"&jsoncallback=?";
	$.getJSON(
			url,
			function(result){
				if(!result.success){
					alert('并未查询到任何详情');
					return;
				}
				var record = result.record;
				var type = "";
				var time = "";
				var amount = 0;
				for(var i=0;i<record.length;i++){
					type = record[i].type;
					time = record[i].time;
					amount = record[i].amount;
					$tr = $("<tr><td>"+type+"</td><td>"+amount+"</td><td>"+time+"</td></tr>");
					$('#detailTable tbody').append($tr);
				}
				$('#detailModal').modal('show');
	});
}

//================================
//功能： 消除分配modal的tootip，然后设置
//     属性，展示modal
//================================
function distributeBeacon(receiveId,sendId){
	var V = new validateFormInput($('#distributeModal'));
	V.destroy();
	$('#distributeModal').modal('show');
	$("#submitDistributeBtn").attr({
		"sendId" : sendId,
		"receiveId" : receiveId 
	});
}

//================================
//功能： 调用beaconcount!add接口为下级
//     分配Beacon
//================================
$("#submitDistributeBtn").on('click',function(){
	var sendId = $(this).attr("sendId");
	var receiveId = $(this).attr("receiveId");
	var amount = $("#BeaconAmount").val();
	var type = $("#BeaconType").val();
	
	var V = new validateFormInput($('#distributeModal'));
	if(V.validate()){
		var jsonArr = [];
		jsonArr.push({
			"amount" : amount,
			"receive_id" : receiveId,
			"send_id" : sendId,
			"type_id" : type
		});
		var jsonStr = JSON.stringify(jsonArr);
		//console.log(jsonStr);
		$('#distributeModal').block({ message: '<img src="./images/busy.gif" />' });
		var url = "http://"+publicElement.ip+":"+publicElement.port+"/beacon/beaconcount!add?jsonstr="+jsonStr+"&jsoncallback=?";
		$.getJSON(
				url,
				function(result){
					if(!result.success){
						alert('分配失败，请重新操作');
						$('#distributeModal').unblock();
						return;
					}
					$('#distributeModal').unblock();
					location.reload();
				}
		);
	}else{
		return;
	}
});