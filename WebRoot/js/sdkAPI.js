function PScript(src) {
    document.write('<' + 'script src="' + src + '"' + '><' + '/script>');
}

_Vmapi_url = (function () {
    var script = document.getElementsByTagName("script");
    //浏览器标志位
    var uaFlag = (function() {
        var ua = navigator.userAgent.toLowerCase();
        return (ua.indexOf('android') > -1)? true : false ;  
    })();
	for (var i = 0; i < script.length; i++) {
        if (script[i].src.indexOf("js/sdkAPI.js") !== -1) {
			if( uaFlag ) {
				return script[i].src.replace(/js\/sdkAPI.js/, "android");
			}else{
				return script[i].src.replace(/js\/sdkAPI.js/, "js");/*file:\/\/\/.*/
			}
        }
    }
    alert("<script>标签内的src不正确！");
    return "";
})();

PScript(_Vmapi_url + "/J.js");
PScript(_Vmapi_url + "/hammer.js");
PScript(_Vmapi_url + "/slave.js");
PScript(_Vmapi_url + "/main.js");

