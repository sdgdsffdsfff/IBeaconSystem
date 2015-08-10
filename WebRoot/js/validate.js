//======================================================
//功能： 将有关表单input域的校验功能写成此插件形式，进行输入预校验，比如
//     是否为空，是否为数字，是否符合一定格式等等。参数$target为一个
//     jquery对象，代表包含form表单的外围元素；调用者只需实例化
//     validateFormInput并传入参数，即可调用destroy,validate
//     等方法；在需要进行校验的表单域html中写入validate_notNull、
//     validate_number...之类的类名即可
//备注： 此插件使用了Bootstrap的tooltip
//======================================================
function validateFormInput($target) {
	//console.log(target)    
	var validateFlag = true;
    
    var $input = $target.find("input");
    
    this.destroy = function() {
    	$input.each(function(){
    		if($(this).hasClass("validate_notNull") || $(this).hasClass("validate_number") || $(this).hasClass("validate_specialCharacter") || $(this).hasClass("validate_url")) {
    			$(this).tooltip('destroy');
    		}
    	})
    }
    
    this.validate = function() {
        $target.on('keydown',function(e){
        	if($(e.target).hasClass("form-control")){
        		$(e.target).tooltip('destroy');
        	}
        })
    	
	    for(var i = 0;i < $input.length;i++){
	    	
			var temp = $input[i];
			var tempVal = $(temp).val();
			
			if($(temp).hasClass("validate_notNull")){
				if(!$.trim(tempVal) ){
					var options = {
							title:"此项不能为空",
							placement:'bottom'
					}
					$(temp).tooltip(options).tooltip('show');
					validateFlag = false;
					return validateFlag;
				}else{
					$(temp).tooltip('destroy');
				}
			}
			
			if($(temp).hasClass("validate_number")){
				if(!$.trim(tempVal) || tempVal < 0 || isNaN(tempVal)){
					var options = {
							title:"请输入正确数值",
							placement:'bottom'
					}
					$(temp).tooltip(options).tooltip('show');
					validateFlag = false;
					return validateFlag;
				}else{
					$(temp).tooltip('destroy');
				}
			}
			
			if($(temp).hasClass("validate_specialCharacter")){
				if(/[`~!#$^&*?？]/.test(tempVal)){
					var options = {
							title:"不允许输入特殊字符,例如：` ~ ! # $ ^ & * ?",
							placement:'bottom'
					}
					$(temp).tooltip(options).tooltip('show');
					validateFlag = false;
					return validateFlag;
				}else{
					$(temp).tooltip('destroy');
				}
			}
			
			if($(temp).hasClass("validate_url")){
				var strRegex = "((http|ftp|https)://)(([a-zA-Z0-9\._-]+\.[a-zA-Z]{2,6})|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,4})*(/[a-zA-Z0-9\&%_\./-~-]*)?"; 
				var re=new RegExp(strRegex); 
				if(!re.test(tempVal)){
					var options = {
							title:"请以http(s)开头，填写符合url格式要求的地址",
							placement:'bottom'
					}
					$(temp).tooltip(options).tooltip('show');
					validateFlag = false;
					return validateFlag;
				}else{
					$(temp).tooltip('destroy');
				}
			}
		
	    }
	    
	
		return validateFlag;
	}
}