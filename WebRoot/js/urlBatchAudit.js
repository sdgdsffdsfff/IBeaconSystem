//global variable
var publicElement = (function () {
    this.ip = "10.103.240.198";
    this.port = "8080";
	this.login_id = null;
	this.project = [];
    return this;
})();

$(function(){
	publicElement.login_id = $("#login_id").attr("uid");
	getProject();
	
	$('#file').on('change',function(){
        uploadPic(this.files[0]);
    });
	
	var options = {
    		beforeSubmit: validateForm,
    		success: packageInfo,    		
    		resetForm: false,
    		dataType: 'json'
    }
	
	$('#submitUrlBatch').on('click',function(){
		var V = new validateFormInput($('#urlBatch_form'));
		if(V.validate()){
			var url_interval = $('#url_suffix_2').val() - $('#url_suffix_1').val();
			var minor_interval = $('#minor_end').val() - $('#minor_start').val();
			if(url_interval != minor_interval){
				alert('url后缀与minor号段的区间长度必须一致，请检查后重新输入');
				return;
			}else{
				var localLogo = document.getElementById('file').files[0];
				var serverLogo = $('#logo_url').val();
				if(localLogo){
					$("#urlBatch_form").ajaxSubmit(options);
				    return false;
				}else if(serverLogo){
					submitUrlInfo(serverLogo);    			
				}else{
					alert('请上传logo图片或复制服务器logo地址');
					return;
				}
			}		
		}else{
			return;
		}
	});
	
	$('#showlogo').on('click',function(){
		window.open($('#logo_url').val());
	});
});

function getProject(){
	var url = "http://"+publicElement.ip+":"+publicElement.port+"/beacon/project!findproject?staff_id="+publicElement.login_id+"&jsoncallback=?";
	$.getJSON(
		url,
		function(result){
			if(!result.success){
				return;
			}else{
				publicElement.project = result.project;
				insertProject("project_id","");
			}
		}
	);
}

function insertProject(id,projectId){
	$('#'+id).empty();
	var $tr = null;
	var project_id = "";
	var title = "";
	if(!publicElement.project.length){
		$tr = $("<option value=''>无</option>");
		$('#'+id).append($tr);
	}else{
		for(var i=0;i<publicElement.project.length;i++){
			project_id = publicElement.project[i].project_id;
			title = publicElement.project[i].title;
			if(project_id == projectId){
				$tr = $("<option value='"+project_id+"' selected>"+title+"</option>");
				$('#'+id).append($tr);
			}else{
				$tr = $("<option value='"+project_id+"'>"+title+"</option>");
				$('#'+id).append($tr);
			}					
		}
	}
}

function uploadPic(file){
	if(file){
		var reader = new FileReader();
	    reader.onload = function(e){
	        $('#myImg').attr('src',e.target.result);
	    }
	    reader.readAsDataURL(file);  
	}	         
}

function checkPicture(file,id){
	var flag = true;
    if(file){
        var picType = file.type; 
        if(picType != 'image/png' &&  picType != 'image/jpg' && picType != 'image/gif' && picType != 'image/jpeg'){
            alert('图片格式不正确');
            $('#'+id).val("");
            flag = false;
        }else{
            if($('#myImg').width() != $('#myImg').height()){
                alert("图片必须为正方形");
                $('#'+id).val("");     
                flag = false;       
            }else if($('#myImg').width()>200 || $('#myImg').height()>200){
                alert("图片长宽必须小于200");
                $('#'+id).val("");          
                flag = false;
            }else{
            	flag = true;
                //alert('图片符合要求');
            }                              
        }
    }else{
    	flag = false;
    } 
    return flag; 
}

function validateForm() {
	var file = document.getElementById('file').files[0];
	var flag = checkPicture(file,"file");
	if(!flag){
		console.log("checkPicture函数验证失败"+flag);
		return false;
	}else{
		console.log("checkPicture函数验证正确"+flag);
		return true; 
	}	
}

function packageInfo(responseText,statusText){
	if(responseText.success){
		var local_logo = responseText.logo;//本地logo地址
		console.log('本地logo地址：'+local_logo);
		var getServerUrl_url = "http://"+publicElement.ip+":"+publicElement.port+"/beacon/url!getLogoUrl?local_logo="+local_logo+"&jsoncallback=?";;//获得微信服务器logo地址
		$.getJSON(
			getServerUrl_url,
			function(result){
				if(!result.success){
					alert('获取微信服务器logo失败');
					return;
				}else{
					var logo = result.url;
					$('#logo_url').val(logo);
					submitUrlInfo(logo);  
				}
			}
		);
	}else{
		alert(responseText.message);
		return;
	}	
}

function submitUrlInfo(logo){
	$('#file').empty();
	var logo_url = logo;//微信服务器logo地址
	console.log('服务器logo地址：'+logo_url);
	var url_suffix_1 = $.trim($('#url_suffix_1').val());
	var minor_start = $.trim($('#minor_start').val());
	var minor_end = $.trim($('#minor_end').val());
	var sectionLength = minor_end - minor_start;
	var urlSuffix = parseInt(url_suffix_1);
	var minor = parseInt(minor_start); 
	var uuid = $('#uuid').val();
	var major = $('#major').val();
	var session = null;
	var jsonObj = null;
	var jsonstr = null;
	var url = "";
	$.blockUI({ message: '<img src="./images/busy.gif" />' });
	for(var i=0;i<=sectionLength;i++){					
		session = [{
			"value":uuid,
			"majors":[{
				"value":major,
				"sections":[{
					"value0":minor+i,
					"value1":minor+i
				}]
			}]
		}];
		jsonObj = [{
			"parent_id": publicElement.login_id,
			"title": $('#title').val(),
			"name": $('#name').val(),
			"content": encodeURIComponent($('#url_prefix').val()+(urlSuffix+i)),
			"other_info": $('#other_info').val(),
			"project_id": $('#project_id').val(),
			"logo_url": logo_url,
			"session": session
		}];
		jsonstr = JSON.stringify(jsonObj);
		url = "http://"+publicElement.ip+":"+publicElement.port+"/beacon/url!add?jsonstr="+jsonstr+"&jsoncallback=?";
		$.getJSON(
			url,
			function(data){
				if(!data.success){
					alert(data.message);
					$.unblockUI();
					return;
				}else{
					var pageError = data.pageError?data.pageError:"";
					var logoError = data.logoError?data.logoError:"";
					if(pageError == "" && logoError == ""){
						console.log('后缀为'+urlSuffix+'的url审核通过');
					}else{
						alert(pageError + " " + logoError);
						$.unblockUI();
						return;
					}						
				}
			}
		);
	}
	alert('批量审核完成');
	$.unblockUI();
}