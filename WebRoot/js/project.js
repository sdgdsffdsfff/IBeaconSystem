//global variable
var publicElement = (function () {
    this.ip = "10.103.240.198";
    this.port = "8080";
	this.login_id = null;
    return this;
})();

$(function(){
    publicElement.login_id = $("#login_id").attr("uid");
    getProject();
    $('#submitModify').click(modifyProject);
    $('#addProjectBtn').click(showAddModal);
    $('#submitNewProject').click(addProject);
    //配置日期插件参数
	$('.datetimepicker').datetimepicker({
		format: 'yyyy-mm-dd',
	    autoclose: true,
	    minView: 'month',
	   // startView: 'year',
	    todayBtn: 'linked',
	    todayHighlight: true
	});
});


//======================================================
//功能： project!findproject接口获取该用户的项目信息
//======================================================
function getProject(){
	$.blockUI({ message: '<img src="./images/busy.gif" />' });
	var url = "http://"+publicElement.ip+":"+publicElement.port+"/beacon/project!findproject?staff_id="+publicElement.login_id+"&jsoncallback=?";
	$.getJSON(
		url,
		function(result){
			if(!result.success){
				//$.unblockUI();
				return;
			}
			
			var projectArr = result.project;
			var project_id = 0;
			var title = "";
			var address = "";
			var begin = "";
			var end = "";
			var description = "";
			var time = "";
			var $tr = null;
			$('#projectTable tbody').empty();
			for(var i=0;i<result.total;i++){
				project_id = projectArr[i].project_id;
				title = projectArr[i].title;
				address = projectArr[i].address;
				begin = projectArr[i].begin;
				end = projectArr[i].end;
				description = projectArr[i].description;
				time = projectArr[i].time;
				
				$tr = $("<tr><td>"+title+"</td><td>"+address+"</td><td>"+time+"</td><td>"+begin+"</td><td>"+end+"</td><td>"+description+"</td><td><button type='button' class='btn btn-sm btn-info' projectId='"+project_id+"'>修改</button></td></tr>");
				$('#projectTable tbody').append($tr);
				
				$tr.on('click',function(e){
					$target = $(e.target);
					if($target.hasClass('btn-info') || $target.parent().hasClass('btn-info')){
						var temp = $target.parent('td').prevAll('td');
						var projectId = $target.attr('projectId')?$target.attr('projectId'):$target.parent().attr('projectId');
						//console.log(typeof(temp));
						//console.log($(temp[0]).text());
						$('#modify_title').val($(temp[5]).text());
						$('#modify_address').val($(temp[4]).text());
						$('#modify_time').val($(temp[3]).text());
						$('#modify_begin').val($(temp[2]).text());
						$('#modify_end').val($(temp[1]).text());
						$('#modify_description').val($(temp[0]).text());
						$('#submitModify').attr('projectId',projectId);
						
						var V = new validateFormInput($('#modifyProjectModal'));
						V.destroy();
						
						$('#modifyProjectModal').modal('show');
					}
				});
			}
			$.unblockUI();
			$('#projectTable').dataTable(
		         {
		             "order": [ 2, 'desc' ],
		             "columns": [
					             { "width": "15%" },
					             { "width": "15%" },
					             { "width": "15%" },
					             { "width": "15%" },
					             { "width": "15%" },
					             { "width": "15%" },
					             { "width": "10%" }
					           ]
		         }
		     );
		}
	);
}

//======================================================
//功能： project!edit?接口修改该用户的项目信息
//======================================================
function modifyProject(){
	var V = new validateFormInput($('#modifyProjectModal'));
	if(V.validate()){
		var title = $('#modify_title').val();
		var address = $('#modify_address').val();
		var begin = $('#modify_begin').val();
		var end = $('#modify_end').val();
		var description = $('#modify_description').val();
		var project_id = $('#submitModify').attr('projectId');
		//console.log(title+" "+address+" "+time+" "+begin+" "+end+" "+description);
		var jsonObj = {
			"project_id": project_id,
			"title": title,
			"staff_id": publicElement.login_id,
			"address": address,
			"begin": begin,
			"end": end,
			"description": description
		};
		var jsonStr = JSON.stringify(jsonObj);
		$('#modifyProjectModal').block({ message: '<img src="./images/busy.gif" />' });
		var url = "http://"+publicElement.ip+":"+publicElement.port+"/beacon/project!edit?jsonstring="+jsonStr+"&jsoncallback=?";
		$.getJSON(
			url,
			function(result){
				if(!result.success){
					alert('修改项目信息失败');
					$('#modifyProjectModal').unblock();
					return;
				}else{
					$('#modifyProjectModal').unblock();
					location.reload();
				}	
			}
		);
	}else{
		return;
	}
}

function showAddModal(){
	var V = new validateFormInput($('#addProjectModal'));
	V.destroy();
	$('#addProjectModal').modal('show');	
}

//======================================================
//功能： project!add接口创建项目
//======================================================
function addProject(){
	var V = new validateFormInput($('#addProjectModal'));
	if(V.validate()){
		var title = $('#project_title').val();
		var address = $('#project_address').val();
		var begin = $('#project_begin').val();
		var end = $('#project_end').val();
		var description = $('#project_description').val();

		var jsonObj = {
			"title": title,
			"staff_id": publicElement.login_id,
			"address": address,
			"begin": begin,
			"end": end,
			"description": description
		};
		var jsonStr = JSON.stringify(jsonObj);
		$('#addProjectModal').block({ message: '<img src="./images/busy.gif" />' });
		var url = "http://"+publicElement.ip+":"+publicElement.port+"/beacon/project!add?jsonstring="+jsonStr+"&jsoncallback=?";
		$.getJSON(
			url,
			function(result){
				if(!result.success){
					alert('新建项目信息失败');
					$('#addProjectModal').unblock();
					return;
				}else{
					$('#addProjectModal').unblock();
					location.reload();
				}	
			}
		);
	}else{
		return;
	}
}

