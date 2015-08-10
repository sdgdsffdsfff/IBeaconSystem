//global variable
var publicElement = (function () {
    this.ip = "10.103.240.198";
    this.port = "8080";
	this.login_id = null;
	this.type_id = null;
	this.manage = null;
    return this;
})();

//======================================================
//功能： staff!findall获取该用户所有下级人员信息
//======================================================
function getstaffs(){
	$.blockUI({ message: '<img src="./images/busy.gif" />' });
    var  url = "http://"+publicElement.ip+":"+publicElement.port+"/beacon/staff!findall?user_id="+publicElement.login_id+"&jsoncallback=?";

    $.getJSON(
        url,
        function( result ) {
            if (!result.success) {
            	$.unblockUI();
                return;
            }
            $('#stafftable tbody').empty();
            var i = 0;
            var $tr;
            for ( var i = 0; i < result.total; i++ ) {
                var sessions =JSON.stringify( result.staff[i].session);
                if(sessions.length>50){
                    sessions = sessions.substring(0,30)+"...";
                }
                var $tr = null;
                $tr = $("<tr><td>"+result.staff[i].id+"</td><td>"+result.staff[i].name
                    +"</td><td>"+result.staff[i].pwd+"</td><td>"+result.staff[i].parent_id+"</td><td>"+result.staff[i].contact+"</td><td>"+sessions+"</td><td>"+result.staff[i].other+ "<td class='center'> <a class='btn btn-success btn-xs'>查看</a> <a class='btn btn-info btn-xs'>"+
                    " 修改 </a></td></tr>");

                $tr.attr("staff_id",result.staff[i].id);
                $tr.on("click",function(e){
                    var $target = $(e.target);
                    if($target.hasClass("btn-success")||$target.parent().hasClass("btn-success")){
                        findone($target.parents("tr").attr("staff_id"));
                    }else if($target.hasClass("btn-info")||$target.parent().hasClass("btn-info")) {
                        edit($target.parents("tr").attr("staff_id"));
                    }
                    else if($target.hasClass("btn-danger")||$target.parent().hasClass("btn-danger")) {
                        del($target.parents("tr").attr("staff_id"));
                    }
                });

                $('#stafftable tbody').append($tr);
                
            }
            $.unblockUI();
            $('#stafftable').dataTable(
                {
                    "order": [ 3, 'desc' ],
                    "columns": [
   				             { "width": "15%" },
   				             { "width": "15%" },
   				             { "width": "5%"  },
   				             { "width": "5%"  },
   				             { "width": "15%" },
   				             { "width": "20%" },
   				             { "width": "15%" },
   				             { "width": "10%" }
   				           ]
                }
            );
        }
    );
}

//======================================================
//功能：staff!findone接口获取该用户详细信息，插入修改信息的modal中    
//======================================================
function edit(id){
    var V = new validateFormInput($('#edit_one'));
    V.destroy();
    var  url = "http://"+publicElement.ip+":"+publicElement.port+"/beacon/staff!findone?user_id="+id+"&jsoncallback=?";

    $.getJSON(
        url,
        function( result ) {
        	if(!result.success){
        		return;
        	}
        	$("#edit_one").modal("show");
                      
            $("#staff_id2").attr("disabled","true");
            $("#staff_id2").val(result.staff[0].id);
            $("#staff_name2").val(result.staff[0].name);
            $("#pwd2").val(result.staff[0].pwd);
            $("#contact2").val(result.staff[0].contact);
			
			$("#email2").val(result.staff[0].email);
            $("#qq2").val(result.staff[0].qq);
            $("#wechat2").val(result.staff[0].qq);
            
			  var obj = document.getElementById("type_id2");
			  if(obj){
				var options = obj.options;
				if(options){
				  var len = options.length;
				  for(var i=0;i<len;i++){
					if(options[i].value == result.staff[0].type_id){
					  options[i].defaultSelected = true;
					  options[i].selected = true;
					 
					}else{
						options[i].defaultSelected = false;
						options[i].selected = false;
					}
				  }
				  if($('#type_id2 option:selected').val() == '3' || $('#type_id2 option:selected').val() == '4'){
		            	//console.log($('#type_id2 option:selected').val());
		            	$('#addSessions2').hide();
		          }else{
		            	//console.log($('#type_id2 option:selected').val());
		            	$('#addSessions2').show();
		          }
				} 
			  } 
			var manage = result.staff[0].manage;  
			$('#manage2').empty();
			if(publicElement.type_id == '0'){
				if(manage == '0'){
					var $option = $('<option value="0" selected>无权限</option><option value="1">有权限</option>');
				}else{
					var $option = $('<option value="0">无权限</option><option value="1" selected>有权限</option>');
				} 
			}else{
				var $option = $('<option value="0" selected>无权限</option>');	
			}			
				
			$('#manage2').append($option);
            $("#other2").val(result.staff[0].other);
            var arr = result.staff[0].session;
            if($.isArray(arr)){
            	$("#show_sessions2").html("");
                for(var i=0;i<arr.length;i++){
                    var obj = arr[i];
                    var uuid = obj.value;
                    $tr1 = $("<div class='add_uuid'>" +
                        "<div class='form-group form-group-sm'> <label class='col-md-2 control-label'>UUID</label>" +
                        "<div class='col-md-7 col-md-offset-1'><input type='text' class='form-control validate_notNull' value="+uuid+"></div> " +
                        "<a class='btn btn-success btn-xs add_uuid_btn'> <i class='glyphicon glyphicon-plus'></i> </a> " +
                        "<a class='btn btn-danger btn-xs del_uuid_btn'> <i class='glyphicon glyphicon-minus'></i> </a></div>" );
                    $tr1.append("<div class='add_major'></div>")
                    var majorarr = obj.majors;
                    for(var j = 0; j < majorarr.length; j ++){
                        var major = majorarr[j].value;
                        $tr2 = $(
                            "<div class='form-group form-group-sm '><label class='col-md-2 col-md-offset-1 control-label'>major</label>" +
                            "<div class='col-md-6 col-md-offset-1'><input type='text' class='form-control validate_number' value="+major+"></div> " +
                            "<a class='btn btn-success btn-xs add_major_btn'> <i class='glyphicon glyphicon-plus'></i> </a> " +
                            "<a class='btn btn-danger btn-xs del_major_btn'> <i class='glyphicon glyphicon-minus'></i> </a>" +
                            "</div>" +
                            "<div class='add_minor'></div>"
                            );//
                        //$tr1.append($tr2);

                        $minor = $($tr2[1]);
                        var sectionarr = majorarr[j].sections;
                        for(var k = 0; k < sectionarr.length; k ++){
                            var minor1 = sectionarr[k].value0;
                            var minor2 = sectionarr[k].value1;
                            $tr3 = $("<div class='form-group form-group-sm '>" +
                                "<label class='col-md-2 col-md-offset-2 control-label'>minor</label>" +
                                "<div class='col-md-2 '><input type='text' class='form-control validate_number' value="+minor1+"></div> " +
                                "<label class='col-md-1  control-label'>至</label>" +
                                "<div class='col-md-2 '><input type='text' class='form-control validate_number' value="+minor2+"></div>" +
                                "<a class='btn btn-danger btn-xs del_minor_btn'> <i class='glyphicon glyphicon-minus'></i> </a></div>");
                            $minor.append($tr3);

                        }
                        $major = $($($tr1[0]).children()[1]);
                        console.log($major);
                        $major.append($tr2);
                    }
                    $tr1.on("click",function(e){
                        var $target = $(e.target);
                        if($target.hasClass("add_uuid_btn")||$target.parent().hasClass("add_uuid_btn")){
                            while(!$target.next().hasClass("add_major")){
                                $target=$($target.parent());
                            }
                            add_Major( $target.next());

                        }else if($target.hasClass("del_uuid_btn")||$target.parent().hasClass("del_uuid_btn")) {

                        	 if(confirm("请确认该代理已全部回收该号段设备,否则该代理将无法烧写这些设备.") == true){
             	            	while(!$target.next().hasClass("add_major")){
             		                $target=$($target.parent());
             		            }
             		            $target.parent().remove();
             	            }else{
             	            	return;
             	            }

                        }
                        else if($target.hasClass("add_major_btn")||$target.parent().hasClass("add_major_btn")) {
                            while(!$target.next().hasClass("add_minor")){
                                $target=$($target.parent());
                            }
                            add_Minor( $target.next());
                            console.log( "add_major_btn");
                        }
                        else if($target.hasClass("del_major_btn")||$target.parent().hasClass("del_major_btn")) {
                        	 if(confirm("请确认该代理已全部回收该号段设备,否则该代理将无法烧写这些设备.") == true){
             	            	while(!$target.next().hasClass("add_minor")){
             		                $target=$($target.parent());
             		            }
             		            $target.next().remove();
             		            $target.remove();
             	            }else{
             	            	return;
             	            }
                        }
                        else if($target.hasClass("del_minor_btn")||$target.parent().hasClass("del_minor_btn")) {
                        	  if(confirm("请确认该代理已全部回收该号段设备,否则该代理将无法烧写这些设备.") == true){
              	            	while(!$target.parent().hasClass("add_minor")){
              		                $target=$($target.parent());
              		            }
              		            $target.remove();
              	            }else{
              	            	return;
              	            }
                        }
                    });
                    $("#show_sessions2").append($tr1);

                }
            }
            
            $("#Add2").html("");
        }
    );
}

//=====================================
//功能：提交修改人员信息的modal后执行该函数  
//=====================================
function submit1(){

	var uuidarr1 = getSessionsArray('Add2');
	var uuidarr2 = getSessionsArray('show_sessions2');
    var uuidarr = uuidarr1.concat(uuidarr2);
    if(!uuidarr.length){
    	uuidarr = [];
    }
    uuidarr1 = null;
    uuidarr2 = null;
  
    var jsonstr=[];

    jsonstr.push({
        staff_id:$("#staff_id2").val(),
        name:$("#staff_name2").val(),
        pwd:$("#pwd2").val(),
        contact:$("#contact2").val(),
        other:$("#other2").val(),
		
		email:$("#email2").val(),
		qq:$("#qq2").val(),
		wechat:$("#wechat2").val(),
		type_id:$("#type_id2").val(),
		manage: $('#manage2').val(),
		parent_id:publicElement.login_id,
        session:JSON.stringify(uuidarr),
    });
    
    var V = new validateFormInput($('#edit_one'));
    if(V.validate()){   	
    	if(validateSession($('#Add2')) && validateSession($('#show_sessions2'))){
    		jsonstr = JSON.stringify(jsonstr);	
    		$('#edit_one').block({ message: '<img src="./images/busy.gif" />' });
            var url = "http://"+publicElement.ip+":"+publicElement.port+"/beacon/staff!edit?jsonstr="+jsonstr+"&jsoncallback=?";

            $.getJSON(
                url,
                function( result ) {
                    if (!result.success) {
                    	alert("您没有此号段分配权限，请到个人资料中查看");
                    	$('#edit_one').unblock();
                        return;
                    }
                    else{
                        alert("修改用户成功");
                        /*if(publicElement.type_id == '0'){
                        	location.href = "ad_staff.jsp";
                        }else{
                        	location.href = "pr_staff.jsp";
                        }
                        return ;*/
                        $('#edit_one').unblock();
                        location.reload();
                    }
                }
            );
    	}else{
    		alert("修改用户权限不符合规范");
    		return;
    	}   	
    }else{
    	return;
    }
}

function del(id){
    var url = "http://"+publicElement.ip+":"+publicElement.port+"/beacon/staff!delete?user_id="+id+"&jsoncallback=?";
    console.log("delete");
    $.getJSON(
        url,
        function( result ) {
            if (!result.success) {
                return;
            }
            else{
                alert("删除用户成功");
                if(publicElement.type_id == '0'){
                	location.href = "ad_staff.jsp";
                }else{
                	location.href = "pr_staff.jsp";
                }
                return;
            }
        }
    );
}

//====================
//功能：查找某用户详细信息   
//====================
function findone(id){
    var  url = "http://"+publicElement.ip+":"+publicElement.port+"/beacon/staff!findone?user_id="+id+"&jsoncallback=?";

    $.getJSON(
        url,
        function( result ) {
        	if(!result.success){
        		return;
        	}
            $("#show_one").modal("show");
            $("#staff_id1").val(result.staff[0].id);
            $("#staff_name1").val(result.staff[0].name);
            $("#pwd1").val(result.staff[0].pwd);
            $("#contact1").val(result.staff[0].contact);
            
			$("#email1").val(result.staff[0].email);
            $("#qq1").val(result.staff[0].qq);
            $("#wechat1").val(result.staff[0].wechat);
			
			if(result.staff[0].type_id == "1"){
				$("#type_id1").val("中间代理");
			}else if(result.staff[0].type_id == "2"){
				$("#type_id1").val("末级代理");
			}else if(result.staff[0].type_id == "3"){
				$("#type_id1").val("部署人员");
			}else if(result.staff[0].type_id == "4"){
				$("#type_id1").val("审核人员");
			}
			
			if(result.staff[0].manage == '0'){
				$("#manage1").val('无权限');
			}else{
				$("#manage1").val('有权限');
			}
						
			$("#other1").val(result.staff[0].other);
            var arr = result.staff[0].session;
            if($.isArray(arr)){
            	$("#show_sessions").html("");
        		
                for(var i=0;i<arr.length;i++){
                    var obj = arr[i];
                    var uuid = obj.value;
                    $tr1 = $("<div class='form-group form-group-sm'> <label class='col-md-2 control-label'>UUID</label><div class='col-md-9 col-md-offset-1'><input type='text' class='form-control' value='"+ uuid +"' disabled></div> </div>");
                    $("#show_sessions").append($tr1);

                    var majorarr = obj.majors;
                    for(var j = 0; j < majorarr.length; j ++){
                        var major = majorarr[j].value;
                        $tr2 = $("<div class='form-group form-group-sm'><label class='col-md-2 col-md-offset-1 control-label'>major</label><div class='col-md-8 col-md-offset-1'><input type='text' class='form-control' value='"+ major +"' disabled></div> </div>");
                        $("#show_sessions").append($tr2);
                        var sectionarr = majorarr[j].sections;
                        for(var k = 0; k < sectionarr.length; k ++){
                            var minor1 = sectionarr[k].value0;
                            var minor2 = sectionarr[k].value1;
                            $tr3 = $("<div class='form-group form-group-sm'><label class='col-md-2 col-md-offset-2 control-label'>minor</label><div class='col-md-2 '><input type='text' class='form-control' value='"+ minor1 +"' disabled></div> <label class='col-md-1  control-label'>至</label><div class='col-md-2 '><input type='text' class='form-control' value='"+ minor2 +"' disabled></div></div>");
                            $("#show_sessions").append($tr3);

                        }
                    }

                }
            }
            
        }
    );

}

//====================
//功能：弹出增加用户modal
//====================
function add(){
	var V = new validateFormInput($('#add_one'));
    V.destroy();
    
    /*if($('#type_id option:selected').val() == '3' || $('#type_id option:selected').val() == '4'){
    	$('#addSessions').hide();
    }else{
    	$('#addSessions').show();
    }*/
    $("#add_one").modal("show");
    $("#Add").html("");
    $("#staff_id").val("");
    $("#staff_name").val("");
    $("#pwd").val("");
    $("#qq").val("");
    $("#wechat").val("");
    $("#email").val("");
    $("#contact").val("");
    $("#other").val("");
    $("#session").val("");
   // console.log($('#manage').val());
}

//==================================
//功能： staff!add接口提交新增人员信息
//==================================
function submit(){

    var uuidarr = getSessionsArray('Add');
    console.log(uuidarr);
    if(!uuidarr.length){
    	uuidarr = [];
    }
    var jsonstr=[];

    jsonstr.push({
        staff_id:$("#staff_id").val(),
        name:$("#staff_name").val(),
        pwd:$("#pwd").val(),
        contact:$("#contact").val(),
        other:$("#other").val(),
        session:JSON.stringify(uuidarr),
		email:$("#email").val(),
		qq:$("#qq").val(),
		wechat:$("#wechat").val(),
		type_id:$("#type_id").val(),
		manage: $('#manage').val(),
		parent_id:publicElement.login_id
    });
    
    var V = new validateFormInput($('#add_one'));
    if(V.validate()){
    	if(validateSession($('#Add'))){
    		jsonstr = JSON.stringify(jsonstr);
    		$('#add_one').block({ message: '<img src="./images/busy.gif" />' });
            var url = "http://"+publicElement.ip+":"+publicElement.port+"/beacon/staff!add?jsonstr="+jsonstr+"&jsoncallback=?";
        	//console.log(url);
            $.getJSON(
                url,
                function( result ) {
                    if (!result.success) {
                    	alert("您没有此号段分配权限，请到个人资料中查看");
                    	$('#add_one').unblock();
                        return;
                    }
                    else{
                        alert("增加用户成功");
                        $('#add_one').unblock();
                        /*if(publicElement.type_id == '0'){
                        	location.href = "ad_staff.jsp";
                        }else{
                        	location.href = "pr_staff.jsp";
                        }   */              
                        $("#Add").html("");
                        location.reload();
                    }
                }
            );
    	}else{
    		alert("修改用户权限不符合规范");
    		return;
    	}  	
    }else{
    	return;
    }  
}

//=======================================
//功能： 当选择用户类别的下拉列表变动时，如果不是中间
//    代理，即部署人员或审核人员，则隐藏添加权限按钮 
//=======================================
$('#type_id').on('change',function(){
	if($(this).children('option:selected').val() == '3' || $(this).children('option:selected').val() == '4'){
		$('#addSessions').hide();
	}else{
		$('#addSessions').show();
	}
});
$('#type_id2').on('change',function(){
	if($(this).children('option:selected').val() == '3' || $(this).children('option:selected').val() == '4'){
		$('#addSessions2').hide();
	}else{
		$('#addSessions2').show();
	}
});

$(function(){
    publicElement.login_id = $("#login_id").attr("uid");
    publicElement.type_id = $("#login_id").attr("typeId");
    publicElement.manage = $("#login_id").attr("manage");
    /*if( publicElement.type_id != '0' && publicElement.type_id != '1'){
		//末级代理不能再创建子代理，只能创建部署人员
		$('#type_id option[value=1]').remove();
		$('#type_id option[value=2]').remove();
	}
    
    //如果当前登录用户无审核权限，即manage=0，则他在创建新用户时也不能给予新用户审核权限
    if(publicElement.manage == '0'){
    	$('#manage option[value=1]').remove();
    }*/
    if(publicElement.type_id == '1'){//中间代理
		$('#type_id option[value=1]').remove();
		$('#type_id2 option[value=1]').remove();
		$('#manage option[value=1]').remove();
		//$('#manage2 option[value=1]').remove();
	}else if(publicElement.type_id == '2'){//末级代理
		$('#type_id option[value=1]').remove();
		$('#type_id option[value=2]').remove();
		$('#type_id2 option[value=1]').remove();
		$('#type_id2 option[value=2]').remove();
		$('#manage option[value=1]').remove();
	}
    
	getstaffs();
	
    $("#addSessions").on('click',function(){
    	addSessions('Add');
    });
    $("#addSessions2").on('click',function(){
    	addSessions('Add2');
    });
    $("#submitmessage2").click(submit1);
    $("#submitmessage").click(submit);
    
});