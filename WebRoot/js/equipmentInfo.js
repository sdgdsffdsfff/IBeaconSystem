//global variable
var publicElement = (function () {
    this.ip = "10.103.240.198";
    this.port = "8080";
	this.login_id = null;
    return this;
})();

$(function(){
	publicElement.login_id = $("#login_id").attr("uid");
	loadEquipmentList();
	
	
	//配置日期插件参数
	$('.datetimepicker').datetimepicker({
		format: 'yyyy-mm-dd',
	    autoclose: true,
	    minView: 'month',
	   // startView: 'year',
	    todayBtn: 'linked',
	    todayHighlight: true
	});
	
	$('#submitConditionBtn').click(submitCondition);
});

//====================================================
//功能： 调用beacon!findbystaff接口获取该用户的设备信息，这里面
//     包含地图sdk和百度地图的使用
//====================================================
function loadEquipmentList(){
	$.blockUI({ message: '<img src="./images/busy.gif" />' });
	var url = "http://"+publicElement.ip+":"+publicElement.port+"/beacon/beacon!findbystaff?user_id="+publicElement.login_id+"&jsoncallback=?";	
	$.getJSON(
			url,
			function(result){
				
				if(!result.success){
					$.unblockUI();
					return;
				}
				$("#equipmentTable tbody").empty();
				var beaconArray = result.beacon;
				
				var mac_id = "";
				var uuid = "";
				var major = "";
				var minor = "";
				var address = "";
				var address_type = "";
				var coverage = 0;
				var power = "";
				var frequency = "";
				var type = "";
				var firm = "";
				var create_time = "";
				var status = "";
				var building = "";
				var floor = "";
				var coord_x = "";
				var coord_y = "";

				if(result.total == '101'){
					var totalNum = beaconArray[100].total;
					$('#totalBeacon').text('该用户拥有设备总数：'+totalNum+'，前一百条设备记录如下：').show();
					for(var i=0;i<beaconArray.length-1;i++){
						
						mac_id = beaconArray[i].mac_id;
						uuid = beaconArray[i].uuid;
						if(uuid.length > 8){
							uuid = uuid.substring(0,8);
						}
						major = beaconArray[i].major;
						minor = beaconArray[i].minor;
						address = beaconArray[i].address;
						address_type = beaconArray[i].address_type?beaconArray[i].address_type:"-";
						coverage = beaconArray[i].coverage;
						power = beaconArray[i].power;
						frequency = beaconArray[i].frequency;
						type = beaconArray[i].type;
						firm = beaconArray[i].firm;
						create_time = beaconArray[i].last_modify_time;
						status = beaconArray[i].status;			
						building = beaconArray[i].building;
						floor = beaconArray[i].floor;
						coord_x = beaconArray[i].coord_x;
						coord_y = beaconArray[i].coord_y;
						//alert(mac_id+" "+uuid+" "+major+" "+minor+" "+address+" "+coverage+" "+power+" "+frequency+" "+type+" "+firm+" "+create_time+" "+status);
		                var $tr = null;
						if(status !== "已部署"){
		                	$tr = $("<tr><td>"+mac_id+"</td><td>"+uuid+"..."+"</td><td>"+major+
			                "</td><td>"+minor+"</td><td>"+type+"</td><td>"+address_type+"</td><td>"+coverage+
			                "</td><td>"+power+"</td><td>"+frequency+"</td><td>"+firm+
			                "</td><td>"+create_time+"</td><td>"+status+"</td><td>"+address+
			                "</td><td><button type='button' class='btn btn-danger' disabled='disabled'><span class='glyphicon glyphicon-eye-close'></span></button></td></tr>");
		                }else{
		                	$tr = $("<tr><td>"+mac_id+"</td><td>"+uuid.substring(0,8)+"..."+"</td><td>"+major+
			                "</td><td>"+minor+"</td><td>"+type+"</td><td>"+address_type+"</td><td>"+coverage+
			                "</td><td>"+power+"</td><td>"+frequency+"</td><td>"+firm+
			                "</td><td>"+create_time+"</td><td>"+status+"</td><td>"+address+
			                "</td><td><button type='button' class='btn btn-success' building='"+building+"' x='"+coord_x+"' y='"+coord_y+"' floor='"+floor+"'><span class='glyphicon glyphicon-eye-open'></span></button></td></tr>");
		                }
						
		                $("#equipmentTable tbody").append($tr);
		                
		                $tr.on('click',function(e){
		                	var $target = $(e.target);
		                	if($target.attr('building')||$target.parent().attr('building')){
		                		//console.log($target.attr('building'));
		                		var building = $target.attr('building')?$target.attr('building'):$target.parent().attr('building');
		                		if(building !== '-1'){
		                			var floor = $target.attr('floor')?$target.attr('floor'):$target.parent().attr('floor');
			                		var x = $target.attr('x')?$target.attr('x'):$target.parent().attr('x');
			                		var y = $target.attr('y')?$target.attr('y'):$target.parent().attr('y');
			                			                		
			                	    var m = document.getElementById("map");
			                	    $(m).empty();
			                		var map = new Vmap(m,building,floor);
			                		map.onFloorChange = function(){
			                			var pointer = new VPoint(x, y, floor);
			            				var marker = new VMarker(pointer);
			            				map.addOverlay(marker);		            				
			                		};
			                		$('#showMapModal').modal('show');
			                		$("#big").bind("click",map.zoomIn);
			                	    $("#small").bind("click",map.zoomOut);
			                	    $('#closeMapModal').on('click',function(){
			                	    	$('#showMapModal').modal('hide');
			                	    });
		                		}else{
		                			
		                			var baiduM = document.getElementById("allmap");
			                	    $(baiduM).empty();
			                	    $('#showBaiduMapModal').modal('show');
		                			var x = $target.attr('x')?$target.attr('x'):$target.parent().attr('x');
			                		var y = $target.attr('y')?$target.attr('y'):$target.parent().attr('y');
			                		
			                		// 百度地图API功能
			                		setTimeout(function(){
			                			var map = new BMap.Map("allmap");
				                		var point = new BMap.Point(y,x);
				                		map.centerAndZoom(point, 20);	
				                		map.addControl(new BMap.MapTypeControl());   //添加地图类型控件
				                		map.setCurrentCity("北京");          // 设置地图显示的城市 此项是必须设置的
				                		map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
				                		var marker = new BMap.Marker(point); // 创建点
				                		map.addOverlay(marker); //增加点
			                		},1000);
			                		
		                			
			                	    $('#closeBaiduMapModal').on('click',function(){
			                	    	$('#showBaiduMapModal').modal('hide');
			                	    });
		                		}
		                		
		                	}
		                });	                
					}
					$.unblockUI();
				}else{
					for(var i=0;i<beaconArray.length;i++){
						
						mac_id = beaconArray[i].mac_id;
						uuid = beaconArray[i].uuid;
						if(uuid.length > 8){
							uuid = uuid.substring(0,8);
						}
						major = beaconArray[i].major;
						minor = beaconArray[i].minor;
						address = beaconArray[i].address;
						address_type = beaconArray[i].address_type?beaconArray[i].address_type:"-";
						coverage = beaconArray[i].coverage;
						power = beaconArray[i].power;
						frequency = beaconArray[i].frequency;
						type = beaconArray[i].type;
						firm = beaconArray[i].firm;
						create_time = beaconArray[i].last_modify_time;
						status = beaconArray[i].status;			
						building = beaconArray[i].building;
						floor = beaconArray[i].floor;
						coord_x = beaconArray[i].coord_x;
						coord_y = beaconArray[i].coord_y;
						//alert(mac_id+" "+uuid+" "+major+" "+minor+" "+address+" "+coverage+" "+power+" "+frequency+" "+type+" "+firm+" "+create_time+" "+status);
		                var $tr = null;
						if(status !== "已部署"){
		                	$tr = $("<tr><td>"+mac_id+"</td><td>"+uuid+"..."+"</td><td>"+major+
			                "</td><td>"+minor+"</td><td>"+type+"</td><td>"+address_type+"</td><td>"+coverage+
			                "</td><td>"+power+"</td><td>"+frequency+"</td><td>"+firm+
			                "</td><td>"+create_time+"</td><td>"+status+"</td><td>"+address+
			                "</td><td><button type='button' class='btn btn-danger' disabled='disabled'><span class='glyphicon glyphicon-eye-close'></span></button></td></tr>");
		                }else{
		                	$tr = $("<tr><td>"+mac_id+"</td><td>"+uuid.substring(0,8)+"..."+"</td><td>"+major+
			                "</td><td>"+minor+"</td><td>"+type+"</td><td>"+address_type+"</td><td>"+coverage+
			                "</td><td>"+power+"</td><td>"+frequency+"</td><td>"+firm+
			                "</td><td>"+create_time+"</td><td>"+status+"</td><td>"+address+
			                "</td><td><button type='button' class='btn btn-success' building='"+building+"' x='"+coord_x+"' y='"+coord_y+"' floor='"+floor+"'><span class='glyphicon glyphicon-eye-open'></span></button></td></tr>");
		                }
						
		                $("#equipmentTable tbody").append($tr);
		                
		                $tr.on('click',function(e){
		                	var $target = $(e.target);
		                	if($target.attr('building')||$target.parent().attr('building')){
		                		//console.log($target.attr('building'));
		                		var building = $target.attr('building')?$target.attr('building'):$target.parent().attr('building');
		                		if(building !== '-1'){
		                			var floor = $target.attr('floor')?$target.attr('floor'):$target.parent().attr('floor');
			                		var x = $target.attr('x')?$target.attr('x'):$target.parent().attr('x');
			                		var y = $target.attr('y')?$target.attr('y'):$target.parent().attr('y');
			                			                		
			                	    var m = document.getElementById("map");
			                	    $(m).empty();
			                		var map = new Vmap(m,building,floor);
			                		map.onFloorChange = function(){
			                			var pointer = new VPoint(x, y, floor);
			            				var marker = new VMarker(pointer);
			            				map.addOverlay(marker);		            				
			                		};
			                		$('#showMapModal').modal('show');
			                		$("#big").bind("click",map.zoomIn);
			                	    $("#small").bind("click",map.zoomOut);
			                	    $('#closeMapModal').on('click',function(){
			                	    	$('#showMapModal').modal('hide');
			                	    });
		                		}else{
		                			
		                			var baiduM = document.getElementById("allmap");
			                	    $(baiduM).empty();
			                	    $('#showBaiduMapModal').modal('show');
		                			var x = $target.attr('x')?$target.attr('x'):$target.parent().attr('x');
			                		var y = $target.attr('y')?$target.attr('y'):$target.parent().attr('y');
			                		
			                		// 百度地图API功能
			                		setTimeout(function(){
			                			var map = new BMap.Map("allmap");
				                		var point = new BMap.Point(y,x);
				                		map.centerAndZoom(point, 20);	
				                		map.addControl(new BMap.MapTypeControl());   //添加地图类型控件
				                		map.setCurrentCity("北京");          // 设置地图显示的城市 此项是必须设置的
				                		map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
				                		var marker = new BMap.Marker(point); // 创建点
				                		map.addOverlay(marker); //增加点
			                		},1000);
			                		
		                			
			                	    $('#closeBaiduMapModal').on('click',function(){
			                	    	$('#showBaiduMapModal').modal('hide');
			                	    });
		                		}
		                		
		                	}
		                });	                
					}
					$.unblockUI();
				}
				
				$('#equipmentTable').dataTable(
					{
		                 "order": [ 10, 'desc' ],
		                 "columns": [
		   				             { "width": "10%" },
		   				             { "width": "5%"  },
		   				             { "width": "5%"  },
		   				             { "width": "5%"  },
		   				             { "width": "10%" },
		   				             { "width": "8%"  },
		   				             { "width": "2%"  },
		   				             { "width": "10%" },
		   				             { "width": "10%" },
		   				             { "width": "5%"  },
		   				             { "width": "10%" },
		   				             { "width": "5%"  },
		   				             { "width": "10%" },
		   				             { "width": "5%"  }
		   				           ]
		            }
		        );		
			}
	);
}



$('#conditionalSearchBtn').on('click',function(){
	var V = new validateFormInput($('#searchConditionModal'));
	V.destroy();
	$('#searchConditionModal').modal('show');
});

//================================
//功能： 根据用户输入的筛选条件进行条件查询 
//================================
function submitCondition(){
	var V = new validateFormInput($('#searchConditionModal'));
	if(V.validate()){
		var uuid = $('#condition_uuid').val();
		var major = $('#condition_major').val();
		var minor = $('#condition_minor').val();
		var start = $('#condition_startDate').val();
		var end = $('#condition_endDate').val();
		var state =  $('input[name="condition_state"]:checked').val()?$('input[name="condition_state"]:checked').val():"";
		//console.log(uuid+" "+major+" "+minor+" "+startDate+" "+endDate+" "+state);
		var jsonObj = {
				"user_id": publicElement.login_id,
				"uuid": uuid,
				"major": major,
				"minor": minor,
				"start": start,
				"end": end,
				"status": state
		};
		var jsonStr = JSON.stringify(jsonObj);
		$('#searchConditionModal').block({ message: '<img src="./images/busy.gif" />' });
		var url = "http://"+publicElement.ip+":"+publicElement.port+"/beacon/staff!findbeacon?jsonstr="+jsonStr+"&jsoncallback=?";	 
		$.getJSON(
				url,
				function(result){
					if(!result.success){
						
						alert('未搜索到匹配信息，请重新搜索条件');
						$('#searchConditionModal').unblock();
						return;
					}
					$('#totalBeacon').hide();
					$('#equipmentTable').DataTable().destroy();
					$("#equipmentTable tbody").empty();
					var beaconArray = result.Beacon;
					
					var mac_id = "";
					var uuid = "";
					var major = "";
					var minor = "";
					var address = "";
					var address_type = "";
					var coverage = 0;
					var power = "";
					var frequency = "";
					var type = "";
					var firm = "";
					var create_time = "";
					var status = "";
					var building = "";
					var floor = "";
					var coord_x = "";
					var coord_y = "";
									
					for(var i=0;i<result.total;i++){
						
						mac_id = beaconArray[i].mac_id;
						uuid = beaconArray[i].uuid;
						major = beaconArray[i].major;
						minor = beaconArray[i].minor;
						address = beaconArray[i].address;
						address_type = beaconArray[i].address_type?beaconArray[i].address_type:"-";
						coverage = beaconArray[i].coverage;
						power = beaconArray[i].power;
						frequency = beaconArray[i].frequency;
						type = beaconArray[i].type;
						firm = beaconArray[i].firm;
						create_time = beaconArray[i].last_modify_time;
						status = beaconArray[i].status;			
						building = beaconArray[i].building;
						floor = beaconArray[i].floor;
						coord_x = beaconArray[i].coord_x;
						coord_y = beaconArray[i].coord_y;
						//alert(mac_id+" "+uuid+" "+major+" "+minor+" "+address+" "+coverage+" "+power+" "+frequency+" "+type+" "+firm+" "+create_time+" "+status);
		                var $tr = null;
						if(status !== "已部署"){
		                	$tr = $("<tr><td>"+mac_id+"</td><td>"+uuid.substring(0,8)+"..."+"</td><td>"+major+
			                "</td><td>"+minor+"</td><td>"+type+"</td><td>"+address_type+"</td><td>"+coverage+
			                "</td><td>"+power+"</td><td>"+frequency+"</td><td>"+firm+
			                "</td><td>"+create_time+"</td><td>"+status+"</td><td>"+address+
			                "</td><td><button type='button' class='btn btn-danger' disabled='disabled'><span class='glyphicon glyphicon-eye-close'></span></button></td></tr>");
		                }else{
		                	$tr = $("<tr><td>"+mac_id+"</td><td>"+uuid.substring(0,8)+"..."+"</td><td>"+major+
			                "</td><td>"+minor+"</td><td>"+type+"</td><td>"+address_type+"</td><td>"+coverage+
			                "</td><td>"+power+"</td><td>"+frequency+"</td><td>"+firm+
			                "</td><td>"+create_time+"</td><td>"+status+"</td><td>"+address+
			                "</td><td><button type='button' class='btn btn-success' building='"+building+"' x='"+coord_x+"' y='"+coord_y+"' floor='"+floor+"'><span class='glyphicon glyphicon-eye-open'></span></button></td></tr>");
		                }
						
		                $("#equipmentTable tbody").append($tr);
		                $tr.on('click',function(e){
		                	var $target = $(e.target);
		                	if($target.attr('building')||$target.parent().attr('building')){
		                		//console.log($target.attr('building'));
		                		var building = $target.attr('building')?$target.attr('building'):$target.parent().attr('building');
		                		if(building !== '-1'){
		                			var floor = $target.attr('floor')?$target.attr('floor'):$target.parent().attr('floor');
			                		var x = $target.attr('x')?$target.attr('x'):$target.parent().attr('x');
			                		var y = $target.attr('y')?$target.attr('y'):$target.parent().attr('y');
			                			                		
			                	    var m = document.getElementById("map");
			                	    $(m).empty();
			                		var map = new Vmap(m,building,floor);
			                		map.onFloorChange = function(){
			                			var pointer = new VPoint(x, y, floor);
			            				var marker = new VMarker(pointer);
			            				map.addOverlay(marker);		            				
			                		};
			                		$('#showMapModal').modal('show');
			                		$("#big").bind("click",map.zoomIn);
			                	    $("#small").bind("click",map.zoomOut);
			                	    $('#closeMapModal').on('click',function(){
			                	    	$('#showMapModal').modal('hide');
			                	    });
		                		}else{
		                			
		                			var baiduM = document.getElementById("allmap");
			                	    $(baiduM).empty();
			                	    $('#showBaiduMapModal').modal('show');
		                			var x = $target.attr('x')?$target.attr('x'):$target.parent().attr('x');
			                		var y = $target.attr('y')?$target.attr('y'):$target.parent().attr('y');
			                		
			                		// 百度地图API功能
			                		setTimeout(function(){
			                			var map = new BMap.Map("allmap");
				                		var point = new BMap.Point(y,x);
				                		map.centerAndZoom(point, 30);	
				                		map.addControl(new BMap.MapTypeControl());   //添加地图类型控件
				                		map.setCurrentCity("北京");          // 设置地图显示的城市 此项是必须设置的
				                		map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
				                		var marker = new BMap.Marker(point); // 创建点
				                		map.addOverlay(marker); //增加点
			                		},1000);
			                		
		                			
			                	    $('#closeBaiduMapModal').on('click',function(){
			                	    	$('#showBaiduMapModal').modal('hide');
			                	    });
		                		}
		                		
		                	}
		                });	                
					}
					$('#equipmentTable').dataTable(
						{
			                 "order": [ 10, 'desc' ],  
			                 "columns": [
			   				             { "width": "10%" },
			   				             { "width": "5%"  },
			   				             { "width": "5%"  },
			   				             { "width": "5%"  },
			   				             { "width": "10%" },
			   				             { "width": "8%"  },
			   				             { "width": "2%"  },
			   				             { "width": "10%" },
			   				             { "width": "10%" },
			   				             { "width": "5%"  },
			   				             { "width": "10%" },
			   				             { "width": "5%"  },
			   				             { "width": "10%" },
			   				             { "width": "5%"  }
			   				           ]
			            }
			        );
					$('#searchConditionModal').unblock();
					$('#searchConditionModal').modal('hide');
				}
		);
	}else{
		return;
	}
	
}

