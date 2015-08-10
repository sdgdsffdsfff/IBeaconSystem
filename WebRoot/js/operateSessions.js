//==========================================================================
//功能名称：有关权限的操作
//功能描述：此js中的函数是提供权限的相关操作，包括增加权限，获取权限内容
//工程师:杨赫
//Email:599068284@qq.com
//Tel:13717820302
//最后修改时间：2015/7/22
//==========================================================================


//================================================================
//功能： addSessions函数用于为指定标签内添加uuid/major/minor域，参数id即为要
//     插入的标签id；并调用add_Major，add_Minor函数进行minor,major域的添加
//================================================================
function addSessions(id){
	var $tr = $("<div class='add_uuid'>" +
	        "<div class='form-group form-group-sm'> <label class='col-md-2 control-label'>UUID</label>" +
	        "<div class='col-md-7 col-md-offset-1'><input type='text' class='form-control validate_notNull' value='FDA50693-A4E2-4FB1-AFCF-C6EB07647825'></div> " +
	        "<a class='btn btn-success btn-xs add_uuid_btn'> <i class='glyphicon glyphicon-plus'></i> </a> " +
	        "<a class='btn btn-danger btn-xs del_uuid_btn'> <i class='glyphicon glyphicon-minus'></i> </a> </div>" +
	        "<div class='add_major'> " +
	        "<div class='form-group form-group-sm '><label class='col-md-2 col-md-offset-1 control-label'>major</label>" +
	        "<div class='col-md-6 col-md-offset-1'><input type='text' class='form-control validate_number'></div> " +
	        "<a class='btn btn-success btn-xs add_major_btn'> <i class='glyphicon glyphicon-plus'></i> </a> " +
	        "<a class='btn btn-danger btn-xs del_major_btn'> <i class='glyphicon glyphicon-minus'></i> </a></div>" +
	        "<div class='add_minor'><div class='form-group form-group-sm '><label class='col-md-2 col-md-offset-2 control-label'>minor</label><div class='col-md-2 '><input type='text' class='form-control validate_number'></div> " +
	        "<label class='col-md-1  control-label'>至</label>" +
	        "<div class='col-md-2 '><input type='text' class='form-control validate_number' ></div>" +
	        "<a class='btn btn-danger btn-xs del_minor_btn'> <i class='glyphicon glyphicon-minus'></i> </a></div></div>" +
	        "</div></div>");

	    $tr.on("click",function(e){
	        var $target = $(e.target);
	        if($target.hasClass("add_uuid_btn")||$target.parent().hasClass("add_uuid_btn")){
	            while(!$target.next().hasClass("add_major")){
	                $target=$($target.parent());
	            }
	            add_Major( $target.next());

	        }else if($target.hasClass("del_uuid_btn")||$target.parent().hasClass("del_uuid_btn")) {
	            while(!$target.next().hasClass("add_major")){
		            $target=$($target.parent());
		        }
		        $target.parent().remove();
	        }
	        else if($target.hasClass("add_major_btn")||$target.parent().hasClass("add_major_btn")) {
	            while(!$target.next().hasClass("add_minor")){
	                $target=$($target.parent());
	            }
	            add_Minor( $target.next());
	            //console.log( "add_major_btn");
	        }
	        else if($target.hasClass("del_major_btn")||$target.parent().hasClass("del_major_btn")) {
	            while(!$target.next().hasClass("add_minor")){
		            $target=$($target.parent());
		        }
		        $target.next().remove();
		        $target.remove();
	        }
	        else if($target.hasClass("del_minor_btn")||$target.parent().hasClass("del_minor_btn")) {            
	            while(!$target.parent().hasClass("add_minor")){
		             $target=$($target.parent());
		        }
		        $target.remove();
	        }
	    });
	    $("#"+id).append($tr);
}

//====================
//功能： 插入major输入域
//====================
function  add_Major($add){
    $tr = $(
        "<div class='form-group form-group-sm '>" +
            "<label class='col-md-2 col-md-offset-1 control-label'>major</label><div class='col-md-6 col-md-offset-1'><input type='text' class='form-control validate_number'></div> " +
            "<a class='btn btn-success btn-xs add_major_btn'> <i class='glyphicon glyphicon-plus'></i> </a> <a class='btn btn-danger btn-xs del_major_btn'> <i class='glyphicon glyphicon-minus'></i> </a></div><div class='add_minor'>" +
            "<div class='form-group form-group-sm '><label class='col-md-2 col-md-offset-2 control-label'>minor</label><div class='col-md-2 '><input type='text' class='form-control validate_number'></div>" +
            " <label class='col-md-1  control-label'>至</label><div class='col-md-2 '><input type='text' class='form-control validate_number'></div>" +
            "<a class='btn btn-danger btn-xs del_minor_btn'> <i class='glyphicon glyphicon-minus'></i> </a></div></div>");
    $add.append($tr);
}

//====================
//功能： 插入minor输入域
//====================
function add_Minor($add){
    $tr = $("<div class='form-group form-group-sm '>" +
        "<label class='col-md-2 col-md-offset-2 control-label'>minor</label>" +
        "<div class='col-md-2 '><input type='text' class='form-control validate_number'></div> " +
        "<label class='col-md-1  control-label'>至</label><div class='col-md-2 '>" +
        "<input type='text' class='form-control validate_number'></div>" +
        "<a class='btn btn-danger btn-xs del_minor_btn'> <i class='glyphicon glyphicon-minus'></i> </a></div>");

    $add.append($tr);
}

//=========================================
//功能： 得到用户输入的uuid/major/minor，返回数组
//=========================================
function getSessionsArray(id){
	var uuidarr=[];
    var uuidobj={};
    var majorarr=[];
    var majorobj={};
    var minorarr=[];
    var minorobj={};
    var $session = $("#"+id).children();
    for(var i=0;i< $session.length;i++){//parent -> Add
        //uuid的值
        uuidobj={};
        majorarr=[];
        uuidobj.value=$($($($session[i]).children()[0]).children()[1]).children().val();
       // console.log(uuidobj);
        //第二个孩子开始是add_major
        var $major = $($($session[i]).children()[1]).children();//parent->add_major
        for(var j= 0;j< $major.length;j = j + 2){
            majorobj={};
            minorarr=[];
            majorobj.value=$($($major[j]).children()[1]).children().val();
            //console.log(majorobj);
            var $minor = $($major[j+1]).children();
            for(var k=0;k<$minor.length;k++){
               // console.log($minor[k]);
                minorobj={};
                minorobj.value0= $($($minor[k]).children()[1]).children().val();
                minorobj.value1= $($($minor[k]).children()[3]).children().val();
                minorarr[minorarr.length] = minorobj;
            }
            majorobj.sections=minorarr;
            majorarr[majorarr.length] = majorobj;
        }
        uuidobj.majors=majorarr;
        uuidarr[uuidarr.length] = uuidobj;
    }
    return uuidarr;
}

//================================================================
//功能： 验证用户输入的uuid/major/minor数量关系是否符合规范，返回标志位
//================================================================
function validateSession(target){
	var flag = true;
	var $uuid = target.children('.add_uuid');
	//console.log('uuid个数：'+$uuid.length);
	if($uuid.length > 0){
		$uuid.each(function(){
			var $major = $(this).children('.add_major');
			var $major_form_group = $major.children('.form-group');
			//console.log('major个数：'+$major_form_group.length);
			if($major.length>0 && $major_form_group.length>0){
				$major_form_group.each(function(){
					$minor = $(this).next('.add_minor');
					//console.log('minor个数：'+$minor.children('.form-group').length);
					if($minor.length==0 || $minor.children('.form-group').length ==0){
						flag = false;
						return flag;
					}				
				});
			}else{
				flag = false;
				return flag;
			}
		});
	}/*else{
		console.log('good!!!!!!');
	}*/
	return flag;
}