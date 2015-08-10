var personalData_publicElement = (function () {
    this.ip = "10.103.240.198";
    this.port = "8080";
	this.login_id = null;
	this.type_id = null;
	this.parent_id = null;
	this.session = null;
    return this;
})();

//===============================
//功能： staff!findone接口获取个人信息
//===============================
$(function(){
	personalData_publicElement.type_id = $("#login_id").attr("typeId");
	var uid = $('#login_id').attr('uid');
	$('#personalData').on('click',function(){
		var V = new validateFormInput($('#personalDataModal'));
		V.destroy();
		var  url = "http://"+personalData_publicElement.ip+":"+personalData_publicElement.port+"/beacon/staff!findone?user_id="+uid+"&jsoncallback=?";

	    $.getJSON(
	        url,
	        function( result ) {
	            if(!result.success){
	            	return;
	            }
	            personalData_publicElement.parent_id = result.staff[0].parent_id;
	            $("#personalDataModal").modal("show");
	            $("#personal_id").val(result.staff[0].id);
	            $("#personal_name").val(result.staff[0].name);
	            $("#personal_pwd").val(result.staff[0].pwd);
	            $("#personal_contact").val(result.staff[0].contact);
	            
				$("#personal_email").val(result.staff[0].email);
	            $("#personal_qq").val(result.staff[0].qq);
	            $("#personal_wechat").val(result.staff[0].wechat);
				
	            if(result.staff[0].type_id == "0"){
					$("#personal_type").val("管理员");
					$("#personal_type").attr('value','0');
				}else if(result.staff[0].type_id == "1"){
					$("#personal_type").val("中间代理");
					$("#personal_type").attr('value','1');
				}else if(result.staff[0].type_id == "2"){
					$("#personal_type").val("末级代理");
					$("#personal_type").attr('value','2');
				}else if(result.staff[0].type_id == "3"){
					$("#personal_type").val("部署人员");
					$("#personal_type").attr('value','3');
				}else if(result.staff[0].type_id == "4"){
					$("#personal_type").val("审核人员");
					$("#personal_type").attr('value','4');
				}
	            
				if(result.staff[0].manage == "0"){
					$("#personal_manage").val("无权限");
					$("#personal_manage").attr('value','0');
				}else{
					$("#personal_manage").val("有权限");
					$("#personal_manage").attr('value','1');
				}
				$("#personal_other").val(result.staff[0].other);
	            var session = result.staff[0].session;
	            personalData_publicElement.session = result.staff[0].session;
	            if($.isArray(session)){
	            	$("#personal_sessions").html("");
	    			
		            for(var i=0;i<session.length;i++){
		                var obj = session[i];
		                var uuid = obj.value;
		                $tr1 = $("<div class='form-group form-group-sm'> <label class='col-md-2 control-label'>UUID</label><div class='col-md-9 col-md-offset-1'><input type='text' class='form-control' value='"+ uuid +"' disabled></div> </div>");
		                $("#personal_sessions").append($tr1);

		                var majorarr = obj.majors;
		                for(var j = 0; j < majorarr.length; j ++){
		                    var major = majorarr[j].value;
		                    $tr2 = $("<div class='form-group form-group-sm'><label class='col-md-2 col-md-offset-1 control-label'>major</label><div class='col-md-8 col-md-offset-1'><input type='text' class='form-control' value='"+ major +"' disabled></div> </div>");
		                    $("#personal_sessions").append($tr2);
		                    var sectionarr = majorarr[j].sections;
		                    for(var k = 0; k < sectionarr.length; k ++){
		                        var minor1 = sectionarr[k].value0;
		                        var minor2 = sectionarr[k].value1;
		                        $tr3 = $("<div class='form-group form-group-sm'><label class='col-md-2 col-md-offset-2 control-label'>minor</label><div class='col-md-2 '><input type='text' class='form-control' value='"+ minor1 +"' disabled></div> <label class='col-md-1  control-label'>至</label><div class='col-md-2 '><input type='text' class='form-control' value='"+ minor2 +"' disabled></div></div>");
		                        $("#personal_sessions").append($tr3);

		                    }
		                }
		            }
	            }
	        }
	    );
	});
});

$('#submitPersonalInfoBtn').on('click',function(){
    var jsonstr=[];
//console.log(publicElement.session);
    var V = new validateFormInput($('#personalDataModal'));
    if(V.validate()){
    	jsonstr.push({
            staff_id:$("#personal_id").val(),
            name:$("#personal_name").val(),
            pwd:$("#personal_pwd").val(),
            contact:$("#personal_contact").val(),
            other:$("#personal_other").val(),		
    		email:$("#personal_email").val(),
    		qq:$("#personal_qq").val(),
    		wechat:$("#personal_wechat").val(),
    		type_id:$("#personal_type").attr('value'),
    		manage:$('#personal_manage').attr('value'),
    		parent_id:personalData_publicElement.parent_id,
            session:personalData_publicElement.session
        });
         	
        jsonstr = JSON.stringify(jsonstr);	
        $('#personalDataModal').block({ message: '<img src="./images/busy.gif" />' });
        var url = "http://"+personalData_publicElement.ip+":"+personalData_publicElement.port+"/beacon/staff!edit?jsonstr="+jsonstr+"&jsoncallback=?";

        $.getJSON(
            url,
            function( result ) {
                if (!result.success) {
                	alert("修改用户失败");
                	 $('#personalDataModal').unblock();
                    return;
                }else{
                    alert("修改用户成功");
                    $('#personalDataModal').unblock();
                    /*if(publicElement.type_id == '0'){
                    	location.href = "ad_staff.jsp";
                    }else{
                    	location.href = "pr_staff.jsp";
                    }*/  
                    location.reload();
                }
            }
        );
    }else{
    	return;
    }
    
});