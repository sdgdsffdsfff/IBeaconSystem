//global variable
var publicElement = (function () {
	this.ip = "10.103.240.198";
    this.port = "8080";
	this.login_id = null;
	//当前如果点击‘筛选条件’按钮应该显示的modal的id
	this.willShowModal = null;
	//缓存数据
	this.DeviceResult = [];
	this.UrlResult = [];
	this.ProjectResult = [];
    return this;
})();

$(function(){
	publicElement.login_id = $("#login_id").attr("uid");
	publicElement.willShowModal = 'conditionBeaconModal';//默认选择基于设备查询统计信息
	//配置日期插件参数
	$('.datetimepicker').datetimepicker({
	    format: 'yyyy-mm-dd',
	    autoclose: true,
	    minView: 'month',
	   // startView: 'year',
	    todayBtn: 'linked',
	    todayHighlight: true
	});
	
	getStatisticInfo(0);//默认加载以设备查询统计信息
});

//=============================================
//功能：参数mode(0:设备  1：页面  2：项目)，还函数首先判断
//     是以哪种mode进行查询，然后去检测publicElement.xxxResult
//     是否有数据，若有，则直接用该数据调用fillTable函数
//     填充表格；若没有，再调用getStatisticInfoByUrl
//     方法通过后台url接口获取数据填充表格
//=============================================
function getStatisticInfo(mode){
	if(mode == '0'){
		if(publicElement.DeviceResult.length > 0){			
			fillTable(publicElement.DeviceResult);
		}else{
			getStatisticInfoByUrl(mode);
		}
	}else if(mode == '1'){
		if(publicElement.UrlResult.length > 0){
			fillTable(publicElement.UrlResult);
		}else{
			getStatisticInfoByUrl(mode);
		}
	}else{
		if(publicElement.ProjectResult.length > 0){
			fillTable(publicElement.ProjectResult);
		}else{
			getStatisticInfoByUrl(mode);
		}
	}	
}

//=============================================
//功能：data是包含统计数据的一个数组，用它来填充表格
//=============================================
function fillTable(data){
	$('#statisticInfoTable').DataTable().destroy();//解决datatable插件的一个Warning: Cannot reinitialise Datatables...
	$('#statisticInfoTable tbody').empty();
	var $tr = null;
	var title = "";
	console.log(data);
	for(var i=0;i<data.length;i++){
		title = data[i].title?data[i].title:data[i].major+'-'+data[i].minor;
		$tr = $("<tr><td>"+title+"</td><td>"+
				data[i].shake_uv+"</td><td>"+
				data[i].shake_pv+"</td><td>"+
				data[i].click_uv+"</td><td>"+
				data[i].click_pv+"</td><td>"+
				data[i].ftime+"</td></tr>");
		$('#statisticInfoTable tbody').append($tr);
	}
	$('#statisticInfoTable').dataTable(
		{
			"order": [ 5, 'desc' ],
			"columns": [
			             { "width": "20%" },
			             { "width": "15%" },
			             { "width": "15%" },
			             { "width": "15%" },
			             { "width": "15%" },
			             { "width": "20%" }
			           ]
		}
	);
}

//=============================================
//功能：调用statistic!findall接口获取不同mode下的统计
//     数据，调用fillTable方法将数据填充表格；并将数据缓存
//     在对应的publicElement.xxxResult缓存区内，方
//     便下次获取数据时直接去缓存区取得，免去重复调用接口。    
//=============================================
function getStatisticInfoByUrl(mode){
	$.blockUI({ message: '<img src="./images/busy.gif" />' });
	var url = "http://"+publicElement.ip+":"+publicElement.port+"/beacon/statistic!findall?staff_id="+publicElement.login_id+"&style="+mode+"&jsoncallback=?";
	$.getJSON(
		url,
		function(result){

			if(!result.success){
				$('#statisticInfoTable tbody').empty();
				$tr = $("<tr><td>无</td><td>无</td><td>无</td><td>无</td><td>无</td><td>无</td></tr>");
				$('#statisticInfoTable tbody').append($tr);
				$.unblockUI();
				return;
			}else{
				if(mode == '0'){
					publicElement.DeviceResult = result.statistic;
				}else if(mode == '1'){
					publicElement.UrlResult = result.statistic;
				}else{
					publicElement.ProjectResult = result.statistic;
				}
				fillTable(result.statistic);
				$.unblockUI();
			}
		}
	);
}

//=============================================
//功能：监听单选框点击事件，当单击不同单选框，会获取不同类统
//     计数据，并将‘筛选条件’按钮所触发的modal设定成对应的
//     modal
//=============================================
$(':radio').on('click',function(){
	$('#statisticInfoTable').DataTable().destroy();//解决datatable插件的一个Warning: Cannot reinitialise Datatables...
	$('#statisticInfoTable tbody').empty();
	//alert($(this).val());
	var showInfo_way = $(this).val();
	if(showInfo_way == '0'){
		$('#thead1').text('major-minor');
		getStatisticInfo(0);
		publicElement.willShowModal = 'conditionBeaconModal';
	}else if(showInfo_way == '1'){
		$('#thead1').text('页面标题');
		getStatisticInfo(1);
		publicElement.willShowModal = 'conditionUrlModal';
	}else{
		$('#thead1').text('项目名称');
		getStatisticInfo(2);
		publicElement.willShowModal = 'conditionProjectModal';
	}
});

//=============================================
//功能：‘筛选条件’按钮触发对应的modal显示
//=============================================
$('#addConditionsBtn').on('click',function(){
	$('#'+publicElement.willShowModal).modal('show');
});

//下面三段为每个modal提交筛选条件后的处理
$('#submitConditionBeacon').on('click',function(){	
	var V = new validateFormInput($('#conditionBeaconModal'));
    if(V.validate()){
    	var uuid = $('#condition_uuid').val();
    	var minor = $('#condition_minor').val();
    	var major = $('#condition_major').val();
    	var start = $('#condition_startDate').val()?$('#condition_startDate').val():"";
    	var end = $('#condition_endDate').val()?$('#condition_endDate').val():"";
    	var jsonObj = {
    		"uuid": uuid,
    		"major": major,
    		"minor": minor,
    		"start": start,
    		"end": end,
    		"staff_id": publicElement.login_id
    	};
    	var jsonStr = JSON.stringify(jsonObj);
    	$('#conditionBeaconModal').block({ message: '<img src="./images/busy.gif" />' });
    	var url = "http://"+publicElement.ip+":"+publicElement.port+"/beacon/statistic!findbyminor?jsonstr="+jsonStr+"&jsoncallback=?";
    	$.getJSON(
    		url,
    		function(result){
    			if(!result.success){
    				console.log(result.message);
    				alert('无此信息');
    				$('#conditionBeaconModal').unblock();
    				return;
    			}
    			fillTable(result.statistic);
    			$('#conditionBeaconModal').modal('hide');
    			$('#conditionBeaconModal').unblock();
    		}
    	);
    }else{
    	return;
    }	
});

$('#submitConditionProject').on('click',function(){	
	var V = new validateFormInput($('#conditionProjectModal'));
    if(V.validate()){
    	var project = $('#condition_project').val();
    	var start = $('#condition_startDate2').val()?$('#condition_startDate2').val():"";
    	var end = $('#condition_endDate2').val()?$('#condition_endDate2').val():"";
    	var jsonObj = {
        	"name": project,
        	"start": start,
    		"end": end,
        	"staff_id": publicElement.login_id
        };
        var jsonStr = JSON.stringify(jsonObj);
        $('#conditionProjectModal').block({ message: '<img src="./images/busy.gif" />' });
        var url = "http://"+publicElement.ip+":"+publicElement.port+"/beacon/statistic!findbyproject?jsonstr="+jsonStr+"&jsoncallback=?";
    	
        $.getJSON(
    		url,
    		function(result){
    			if(!result.success){
    				alert('无此信息');
    				$('#conditionProjectModal').unblock();
    				return;
    				
    			}
    			fillTable(result.statistic);
    			
    			$('#conditionProjectModal').modal('hide');
    			$('#conditionProjectModal').unblock();
    		}
    	);
    }else{
    	return;
    }	
});

$('#submitConditionUrl').on('click',function(){	
	var V = new validateFormInput($('#conditionUrlModal'));
    if(V.validate()){
    	var url = $('#condition_url').val();
    	var start = $('#condition_startDate3').val()?$('#condition_startDate3').val():"";
    	var end = $('#condition_endDate3').val()?$('#condition_endDate3').val():"";
    	var jsonObj = {
            "title": url,
            "start": start,
            "end": end,
        	"staff_id": publicElement.login_id
        };
        var jsonStr = JSON.stringify(jsonObj);
        $('#conditionUrlModal').block({ message: '<img src="./images/busy.gif" />' });
        var url = "http://"+publicElement.ip+":"+publicElement.port+"/beacon/statistic!findbyurl?jsonstr="+jsonStr+"&jsoncallback=?";
    	$.getJSON(
    		url,
    		function(result){
    			if(!result.success){
    				alert('无此信息');
    				$('#conditionUrlModal').unblock();
    				return;
    			}
    			fillTable(result.statistic);
    		
    			$('#conditionUrlModal').modal('hide');
    			$('#conditionUrlModal').unblock();
    		}
    	);
    }else{
    	return;
    }	
});