function Vmap( dom, mallId, floorId,movex,movey) {
    //dom属性
    var dom = dom;
    //信息属性
    //商场ID
    var mallId = mallId;
    //商场名字
    var mallName = null;
    //当前的楼层ID
    var currentFloorId = null;
    var serverUrl = "123.57.46.160:8080";
    //地图数据数据是否已经读取
    var isDataLoaded = false;
    //地图图片是否加载完成
    var isPicLoaded = false;
    //地图能否被更换
    var changeAble = true;
    //地图是否读取完成
    var isLoaded = false;
    //字体是否能被显示
    var isFontHide = false;
    //楼层信息
    var floor = [];
    //地图坐标转换 转换公式 当前地图上的位置 = 真实位置(数据服务器返回的位置)*rate/currentScale*zoomScale
    //rate = dpi*1000/25.4            svg dpi为96
    var rate = 150*1000/25.4;
    //当前地图的scale值
    var currentScale = null;
    var publicSize = 33;
    var publicColor = "Brown";

    var START_X = 0;
	var START_Y = 0;
	
	var midX = 0;
	var midY = 0;
	
	var clientmidx = document.documentElement.clientWidth/2;
	var clientmidy = document.documentElement.clientHeight/2;
	
	var ticking = false;
	var transform;
    var eventflag = false;
    var bindFlag = false;
	
	var initScale = 1;
	var initAngle = 0;
    var finalAngle = 0;    
    var deviceAlpha = 0;
	
    //当前的缩放等级
    var zoomScale = 1;
    //每次缩放增数
    defaultDeltaScale = 0.03;
    //默认最小缩放等级
    var defaultMinScale = 0.5;
    //默认最大缩放等级
    var defaultMaxScale = 2.8;
    
    //公共设施的点
    var publicPlace = [];
    var unitFont = [];
    //当前的公共设施显示类型
    var currentPublicType = null;

    //覆盖物
    //点标记
    var markers = [];
    //线标
    var lines = [];
    //圆
    var circles = [];

    //保存this指针
    This = this;    
    
  //重置dom的style
	dom.style.position = "absolute";
	
    //创建自己的div
    var floorDiv = document.createElement("div");
    floorDiv.style.position = "absolute";
    floorDiv.id = "floorDiv";  
    floorDiv.style.left = 0;
    floorDiv.style.top = 0;
    //floorDiv.style.border = "2px solid red";
    //创建自己的canvas
    var floorCanvas = document.createElement("canvas");
    floorCanvas.style.position = "absolute";
    floorCanvas.style.left = "0";
    floorCanvas.style.top = "0";
    floorCanvas.id = "floorCanvas";
    
    dom.appendChild(floorDiv);
    floorDiv.appendChild(floorCanvas);
    
    //获得context对象
    var context = floorCanvas.getContext("2d");
    
    
    //开始画图
    var floorImg = new Image();
    floorImg.onload = draw;
    changeBuild(mallId,floorId);
  
    function draw( event,type, color, normalSize ) {
        //reAppend();
        drawMap(zoomScale);
        
        if ( !isFontHide ) {
            //drawFont();
            drawUnitFont(zoomScale);
        }
        if( !bindFlag ){
			if(movex && movey){
				var delta = rate/currentScale*zoomScale;
				movex *= delta;
				movey *= delta;
				START_X = clientmidx - movex;
				START_Y = clientmidy - movey;
				console.log(movex,movey);
			}
			bindEvent();
			bindFlag = true;
				
	   }
        refreshOverLay(zoomScale);
        isPicLoaded = true;
}

    //绘图(callback)

    function drawUnitFont(scaleNum){
        context.font = "20px CourierNew,Helvetica,Arial,sans-serif";
        context.textAlign = "left";
        context.textBaseline ="top";
        context.fillStyle = "black";
        
        context.lineWidth = 3;
        context.strokeStyle = "blue";
        
        var fontX = null;
        var fontY = null;
        zoomUnitFont();
       selectFonts();
        for ( var i in unitFont ) {
            if(unitFont[i].show == "1"){  
                fontX = unitFont[i].coord_x*rate/currentScale*scaleNum;
                fontY = unitFont[i].coord_y*rate/currentScale*scaleNum;
                context.save();
                context.translate(fontX,fontY);
                context.rotate( -Math.PI * 1/180 * finalAngle);
                context.fillText(unitFont[i].name,-unitFont[i].length/2,-15);
                //context.strokeRect(-unitFont[i].length/2,-15,unitFont[i].length,20);
                context.restore();
            }
        }
        
    }
    
    function drawFont( type, color, normalSize ,scaleNum ) {
        var scale = scaleNum || zoomScale;
        var fColor = publicColor;
        var size = publicSize;
        if ( type ) {
            currentPublicType = type;
        }
        if ( currentPublicType === null ) {
            currentPublicType = "all";
        }
        if ( currentPublicType === "none" ) {
            return;
        }
        if ( !!color ) {
            fColor = color;
        }
        if ( !!normalSize ) {
            size = normalSize;
        }
        size = size*zoomScale;
        context.font = size+"px VMapPublic";
        context.textBaseline ="top";
        context.fillStyle = fColor;
        for ( var i in publicPlace ) {

            if ( ( ( currentPublicType === "all" ) || ( currentPublicType === publicPlace[i].unit_type_eng ) ) && ( publicPlace[i].floor_id === currentFloorId ) ) {                context.fillText(publicPlace[i].font,publicPlace[i].coord_x*rate/currentScale*scale-10,publicPlace[i].coord_y*rate/currentScale*scale-10);
            }
        }

    }
    //绘制地图
    function drawMap(zoom) {
        context.clearRect(0,0,floorCanvas.width,floorCanvas.height);
        floorCanvas.width = floorImg.width*zoom;
        floorCanvas.height = floorImg.height*zoom;
       
        floorDiv.style.width = floorCanvas.width+'px';
        floorDiv.style.height = floorCanvas.height+'px';
        
        dom.style.height = floorCanvas.height+'px';
        dom.style.width = floorCanvas.width+'px';
        
        midX = floorCanvas.width/2;
        midY = floorCanvas.height/2;
        
        context.drawImage(floorImg,0,0,floorImg.width*zoom,floorImg.height*zoom);
    }
    
    //切换楼层
    function changeFloor( floorId ) {
        
        getUnitFont(mallId,floorId,function() {
        });
        
        if ( changeAble === false ) {
            return false;
        }
        changeAble = false;
        if ( floorId === null ) {
            return false;
        }
        if ( typeof floorId === "number" ) {
            floorId = floor[floorId].floor_id;
        }
     
        isPicLoaded = false;
        var imgUrl = "";
        
        var floor_id = floorId.substring(5,floorId.length);
        $("#floor").text(floor_id);
        
        imgUrl ="http://"+serverUrl+"/beacon/test!jsonPng?client=824&vkey=FFE58998-B203-B44E-A95B-8CA2D6CBCD65&place="+mallId+"&floor="+floorId+"&jsoncallback=?";
        
		 
        $.getJSON( imgUrl,
                   function( result ) {
                       if ( true === result.success ) {
                           for ( var i = 0 ; i < floor.length; i++ ) {
                               if ( floor[i].floor_id == floorId ) {
                                   currentScale = floor[i].scale;
                                   break;
                               }
                           }
                           currentFloorId = floorId;
                           floorImg.src = result.data;

                           changeAble = true;
                           
                           if ( This.onFloorChange != null ) {
                               This.onFloorChange();
                           }
                           isLoaded = true;
                       } else {
                           alert("图片获取失败");
                           changeAble = true;
                       }
                   });
    }

    //切换建筑
    function changeBuild( uId, floorId ) {
        mallId = uId;
        if ( !floorId ) {
            floorId = null;
        }
        var dataUrl = "";
        dataUrl = "http://"+serverUrl+"/beacon/place!all_in_one?client=824&&vkey=FFE58998-B203-B44E-A95B-8CA2D6CBCD65&place="+mallId+"&jsoncallback=?";
        $.getJSON( dataUrl,
                   function( result ) {
                       if ( true === result.success ) {
                           //填充数据
                           //获得当前商场的名字
                           mallName = result.place[0].name;
                           //获得当前商场每层楼对应多少张地图
                           picPerFloor = result.map[0].max_map_level;
                           var i = null;
                           var j = 0;
                           var now = 0;
                           //提取当前商场每层楼对应的svg图片信息（可能会导致picPerFloor没用了）
                           for ( i in result.map ) {
                               if ( result.map[i].map_path.indexOf("png-1_1.png") > 0 ) {
                                   floor[j++] = result.map[i];
                                   if ( floorId === null ) {
                                       if ( result.map[i].floor_id === "Floor1" ) {
                                           now = j-1;
                                           floorId = "Floor1";
                                       } else {
                                           if ( result.map[i].floor_id === "Floor0" ) {
                                               now = j-1;
                                               floorId = "Floor0";
                                           }
                                       }
                                   } else {
                                       if ( result.map[i].floor_id === floorId ) {
                                           now = j-1;
                                       }
                                   }
                               }
                           }
                           currentScale = floor[now].scale;

                           	changeFloor(floorId);
                       } else {
                           alert("获取楼层数据失败");
                       }
                   });
    }
    
    //内部函数
    //公共设施
    function getPublicPlace( uId, floorId,callback ) {
        var textUrl = "http://"+serverUrl+"/beacon/place!facilities?client=824&vkey=FFE58998-B203-B44E-A95B-8CA2D6CBCD65&place="+uId;
        if ( !!floorId ) {
            textUrl += "&floor="+floorId;
        }
        textUrl += "&jsoncallback=?";
        $.getJSON(textUrl,
                  function (data) {
                      if ( !data.success ) {
                          alert("字体获取失败");
                          return;
                      }
                      publicPlace = data.rows;
                      if ( !!callback ) {
                          callback();
                      }
                  }
                 );
    }
    //字体
    function getUnitFont( uId, floorId,callback ) {
        
        var textUrl = "http://"+serverUrl+"/beacon/place!all_spot?place="+uId+"&floor="+floorId+"&jsoncallback=?";
        $.getJSON(textUrl,
                  function (data) {
                      if ( !data.success ) {
                          alert("UnitFont获取失败");
                          return;
                      }
                      var temp = data.place;
                      var obj = {};
                      unitFont = [];
            for(var i in temp){
                obj = {};
                obj.name = temp[i].name;
                context.font = "20px Courier New";
                obj.length = context.measureText(temp[i].name).width;
                obj.coord_x = temp[i].coord_x;
                obj.coord_y = temp[i].coord_y;
                obj.show = 1;
                unitFont.push(obj);
            }
                      if ( !!callback ) {
                          callback();
                      }
                  }
                 );
    }
	
	
	//根据真实位置x,y获得点击的商铺信息
	function getInfo( uId, floorId, x, y ) {
		var delta = rate/currentScale*zoomScale;
		var postUrl = "http://"+serverUrl+"/beacon/position!pos2add?client=824&vkey=FFE58998-B203-B44E-A95B-8CA2D6CBCD65&x="
		+x/delta+"&y="+y/delta+"&floor="+floorId+"&place="+uId+"&jsoncallback=?";
		$.getJSON(postUrl,
                  function (data) {
					  var obj = {};
					  if ( !data.success ) {
						  obj.message = false;
						  obj.x = x;
						  obj.y = y;
						  obj.scale = zoomScale;
					 }else{
						  obj = data.rows[0];
						  obj.message = true;
						  obj.x = x;
						  obj.y = y;
						  obj.scale = zoomScale;
					 }
					 
					if(This.onMapTap != null) {
						This.onMapTap( obj );
					}
					
                  });
	}
    //字体缩放
    function zoomUnitFont(){
        for(var i in unitFont ){
            unitFont[i].minX = unitFont[i].coord_x*rate/currentScale*zoomScale - unitFont[i].length/2;
            unitFont[i].maxX = unitFont[i].coord_x*rate/currentScale*zoomScale + unitFont[i].length/2;
            unitFont[i].minY = unitFont[i].coord_y*rate/currentScale*zoomScale - 10;
            unitFont[i].maxY = unitFont[i].coord_y*rate/currentScale*zoomScale + 10;
        }
    }
    
    //显示字体
    function selectFonts(){
        for(var i=unitFont.length-1;i>=0;i--){
            unitFont[i].show = 1;
            var flag = true; 
            for(var j=i-1;j>=0;j--){
                
                if(unitFont[i].minX >= unitFont[j].minX && unitFont[i].minX <= unitFont[j].maxX
                   && unitFont[i].minY >= unitFont[j].minY && unitFont[i].minY <= unitFont[j].maxY){
                    flag = false;
                    unitFont[i].show = 0;
                }
                
                if(unitFont[i].minX >= unitFont[j].minX && unitFont[i].minX <= unitFont[j].maxX
                   && unitFont[i].maxY >= unitFont[j].minY && unitFont[i].maxY <= unitFont[j].maxY){
                    flag = false;
                    unitFont[i].show = 0;
                }
                
                if(unitFont[i].maxX >= unitFont[j].minX && unitFont[i].maxX <= unitFont[j].maxX
                   && unitFont[i].minY >= unitFont[j].minY && unitFont[i].minY <= unitFont[j].maxY){
                    flag = false;
                    unitFont[i].show = 0;
                }
                
                if(unitFont[i].maxX >= unitFont[j].minX && unitFont[i].maxX <= unitFont[j].maxX
                   && unitFont[i].maxY >= unitFont[j].minY && unitFont[i].maxY <= unitFont[j].maxY){
                    flag = false;
                    unitFont[i].show = 0;
                }
                
                if(!flag) break;
            }
        }
    }
  
    //函数绑定
	var mc = null;
    function bindEvent() {
        mc = new Hammer.Manager(floorCanvas);
        mc.add(new Hammer.Pan({ threshold: 0, pointers: 0 }));
       mc.add(new Hammer.Rotate({ threshold: 0 })).recognizeWith(mc.get('pan'));
        mc.add(new Hammer.Pinch({ threshold: 0 })).recognizeWith([mc.get('pan'), mc.get('rotate')]);
        mc.add(new Hammer.Tap());

       mc.on("panstart panmove", onPan);
       mc.on("rotatestart rotatemove", onRotate);
       mc.on("pinchstart pinchmove", onPinch);
       mc.on("tap", onTap);

        mc.on("hammer.input", function(ev) {
            if(ev.isFirst) {
                
            }

            if(ev.isFinal) {              
                if( eventflag ) {
                    eventflag = false;
                    START_X = START_X + ev.deltaX - (floorDiv.offsetWidth/2 * zoomScale - floorDiv.offsetWidth/2) ;
                    START_Y = START_Y + ev.deltaY - (floorDiv.offsetHeight/2 * zoomScale - floorDiv.offsetHeight/2);

                    transform = {
                        translate: { x: START_X, y: START_Y },
                        scale: 1,
                        angle: finalAngle,
                        rx: 0,
                        ry: 0,
                        rz: 1
                    };
                    requestElementUpdate();
   
                    draw();
                    if(This.onMapPinchEnd != null) {
                    	This.onMapPinchEnd({
                    		scale: zoomScale,
                    		angle:finalAngle
                    	});
                    } 
                }else {
                    START_X = START_X + ev.deltaX;
                    START_Y = START_Y + ev.deltaY;
                }
                
            }
        });

        function onPan(ev) {
            transform.translate = {
                x: START_X + ev.deltaX,
                y: START_Y + ev.deltaY
            };

            requestElementUpdate();
        }

        function onPinch(ev) {
            eventflag = true;
            if(ev.type == 'pinchstart') {
                initScale = zoomScale || 1;
                
                drawMap(1);
               // drawFont(null,null,null,1);
                drawUnitFont(1);
				refreshOverLay(1);
                
				if(This.onMapPinchEnd != null) {
                	This.onMapPinchEnd({
                		scale: 1,
                		angle:finalAngle
                	});
                } 
				
                START_X = START_X + (floorDiv.offsetWidth/2 * zoomScale - floorDiv.offsetWidth/2) ;
                START_Y = START_Y + (floorDiv.offsetHeight/2 * zoomScale - floorDiv.offsetHeight/2);
                transform = {                  
                    translate: { x: START_X, y: START_Y },
                    scale: zoomScale,
                    angle: finalAngle,
                    rx: 0,
                    ry: 0,
                    rz: 1
                };
                
            } else {
				if(initScale * ev.scale > 2.8){
					transform.scale = 2.8;
					zoomScale = 2.8;
				}else if(initScale * ev.scale < 0.7) {
					transform.scale = 0.7;
					zoomScale = 0.7;
				}else{
					transform.scale = initScale * ev.scale;
					zoomScale = initScale * ev.scale;
				}
		}
            requestElementUpdate();
        }
		
        function onTap(ev) {
			
			//并没有算滚动条的长度
			var testX = ev.center.x - START_X;
			var testY = ev.center.y - START_Y;
			var a = Math.PI/180 * finalAngle;
			//将现在的点 旋转回原来的点，为顺时针旋转a角度，即-a
			var x = (testX - midX) * Math.cos(a) + (testY - midY) * Math.sin(a) + midX;
			var y = (testY - midY) * Math.cos(a) - (testX - midX) * Math.sin(a) + midY;
			
			getInfo(mallId,currentFloorId,x,y);
			
	 }
        
        resetElement();
		
    }
    
    // 移动设备中的地图处理函数 外部
    function resetElement() {
        finalAngle = 0;
        zoomScale = 1;
        transform = {
            translate: { x: START_X, y: START_Y },
            scale: 1,
            angle: 0,
            rx: 0,
            ry: 0,
            rz: 0
        };
        requestElementUpdate();
    }

    function updateElementTransform() {
        var value = [
            'translate3d(' + transform.translate.x + 'px, ' + transform.translate.y + 'px, 0)',
            'scale(' + transform.scale + ', ' + transform.scale + ')',
            'rotate3d('+ transform.rx +','+ transform.ry +','+ transform.rz +','+  transform.angle + 'deg)'
        ];

        value = value.join(" ");
        floorDiv.style.webkitTransform = value;
        floorDiv.style.mozTransform = value;
        floorDiv.style.transform = value;
        ticking = false;
    }

    function requestElementUpdate() {
        updateElementTransform();
        /*if(!ticking) {
            reqAnimationFrame(updateElementTransform);
            ticking = true;
        }*/
    }
    
    var reqAnimationFrame = (function () {
		return window[Hammer.prefixed(window, 'requestAnimationFrame')] || function (callback) {
			window.setTimeout(callback, 1000 / 60);
		};
	})();
	
	function onRotate(ev) {
            if(ev.type == 'rotatestart') {
                initAngle = finalAngle || 0;
            }

            transform.rz = 1;
            transform.angle = initAngle + ev.rotation;
            finalAngle = initAngle + ev.rotation;
            requestElementUpdate();
    }
    
    
    //外部函数
	
	//放大
    function zoomIn() {
        var scale = zoomScale;
        if ( isPicLoaded == false ) {
            return false;
        }
        zoomScale += defaultDeltaScale;
        if ( zoomScale > defaultMaxScale ) {
            zoomScale = scale;
            alert('已经达到默认最大缩放等级');
            return false;
        }
        draw();
        event.preventDefault();//
        return false;
    }
    //缩小
    function zoomOut() {
        var scale = zoomScale;
        zoomScale -= defaultDeltaScale;
        if ( zoomScale < defaultMinScale ) {
            zoomScale = scale;
            alert("已经达到默认最小缩放等级");
            return false;
        }
        draw();
        event.preventDefault();
        return false;
    }
	
	//随手机旋转
	function  deviceHandler(event){
		if( Math.abs(event.alpha - deviceAlpha) > 5 ) {
					deviceAlpha = event.alpha;
                    transform.rz = 1;
                    transform.angle = Math.round(event.alpha);
                    finalAngle = Math.round(event.alpha);
                    requestElementUpdate();
					draw();
        }
	}
	 
    function enableAutoRotate() {
        window.addEventListener("deviceorientation",deviceHandler,false);
		mc.off("rotatestart rotatemove");
    }
    
	function disableAutoRotate() {
		window.removeEventListener("deviceorientation",deviceHandler,false);
		mc.on("rotatestart rotatemove", onRotate);
	}
	
	function destory() {
		//是否需要将元素上的一系列事件删除，这样才不占用资源
		floorDiv.removeChild(floorCanvas);
		dom.removeChild(floorDiv);
		return false;
	}
    
    //解决幻象bug
    function reAppend() {
        var $floorDiv = $(floorDiv).detach();
        $(dom).append($floorDiv);
    }
    
    //添加覆盖物哦~
    function addOverlay( obj ) {
        var delta = rate/currentScale*zoomScale;
  
        if ( obj.type() === "marker" ) {
            markers[markers.length] = obj;
            var point = obj.point();
            $(obj.dom).css({
                left : point.x*delta+"px",
                top : point.y*delta+ 10 + "px"
            });
            if ( obj.floorIndex() !== currentFloorId ){
                obj.hide();
            }
            floorDiv.appendChild(obj.dom);
        }
        if ( obj.type() === "line" ) {

            lines[lines.length] = obj;
            var points = obj.points();
            if ( isPicLoaded === true ) {

                context.beginPath();
                var l = points.length;
                var color = obj.color();
                var width = obj.width();
                context.lineCap = "round";
                context.lineWidth = width;
                context.strokeStyle = color;
				//context.fillStyle = "red";
                for ( var i = 0; i <= l-2; i++ ) {
                    if ( ( points[i].floorIndex === currentFloorId ) && ( points[i+1].floorIndex === currentFloorId ) )  {
                        context.moveTo(points[i].x*delta,points[i].y*delta);
                        context.lineTo(points[i+1].x*delta,points[i+1].y*delta);
                    }
                }
                context.stroke();
            }
        }
        
        if ( obj.type() === "circle" ) {

            circles[circles.length] = obj;
            var point = obj.point();
            var radius = obj.radius();
            if( isPicLoaded === true ) {
                context.beginPath();
                var color = obj.color();
                var width = obj.width();
                context.lineCap = "round";
                context.lineWidth = width;
                context.strokeStyle = color;
                if( point.floorIndex === currentFloorId ) {
                    context.arc(point.x*delta,point.y*delta,radius*delta,0,2 * Math.PI);
                    context.stroke();
                }
            }
        }
        

    }

    function refreshOverLay(scaleNum) {
        var delta = rate/currentScale*scaleNum;
        for ( var i = 0 ; i < markers.length; i++ ) {
            var mark = markers[i];
            var p = mark.point();
            $(mark.dom).css({
                left : p.x*delta+"px",
                top : p.y*delta + "px"
            });
            if ( mark.floorIndex() !== currentFloorId ) {
                mark.hide();
            } else {
                mark.show();
            }
        }
        
        for ( var i = 0 ; i < lines.length; i++ ) {
            var points = lines[i].points();
            if ( isPicLoaded === true ) {
                context.beginPath();
                var l = points.length;
                var color = lines[i].color();
                var width = lines[i].width();
                context.lineCap = "round";
                context.lineWidth = width;
                context.strokeStyle = color;
                for ( var j = 0; j <= l-2; j++ ) {
                    if ( ( points[j].floorIndex === currentFloorId ) && ( points[j+1].floorIndex === currentFloorId ) )  {
                        context.moveTo(points[j].x*delta,points[j].y*delta);
                        context.lineTo(points[j+1].x*delta,points[j+1].y*delta);
                    }
                }
                context.stroke();
            }
        }
        
        
        for ( var i = 0 ; i < circles.length; i++ ) {
            var point = circles[i].point();
            var radius = circles[i].radius();
            if ( isPicLoaded === true ) {
               context.beginPath();
                var color = circles[i].color();
                var width = circles[i].width();
                context.lineCap = "round";
                context.lineWidth = width;
                context.strokeStyle = color;
                if( point.floorIndex === currentFloorId ) {
                    context.arc(point.x*delta,point.y*delta,radius*delta,0,2 * Math.PI);
                    context.stroke();
                }
            }
        }
        

    }
    
    //清除覆盖物
    function clearOverlays() {
        for ( var i = 0; i < markers.length; i++ ) {
            $(markers[i].dom).remove();
        }
        markers = [];
        lines = [];
        circles = [];
        context.clearRect(0,0,floorCanvas.width,floorCanvas.height);
        //reAppend();
        draw();
    }

    function getRealPoint( p ) {
        var delta = rate/currentScale*zoomScale;
        return {
            x : p.x/delta,
            y :p.y/delta,
            floorIndex : p.floorIndex
        };
    }
	
    function transform( p ) {
        var delta = rate/currentScale*zoomScale;
        return {
            x : p.x*delta,
            y :p.y*delta,
            floorIndex : p.floorIndex
        };
    }

    //上下楼的接口
    this.prevFloor = function () {
        var next = null;
        for ( var i = 0; i < floor.length; i++ ) {
            if ( floor[i].floor_id === currentFloorId ) {
                if ( i === 0 ) {
                    return false;
                }
                next = floor[i-1].floor_id;
                break;
            }
        }
        changeFloor(next);
        resetElement();
    }

    this.nextFloor = function() {
        var next = null;
        for ( var i = 0; i < floor.length; i++ ) {
            if ( floor[i].floor_id === currentFloorId ) {
                if ( i === floor.length-1 ) {
                    return false;
                }
                next = floor[i+1].floor_id;
                break;
            }
        }
        changeFloor(next);
        resetElement();
    }

        //更换当前的公共设施显示
    function changePublicType( type ) {
        draw(null,type);
    }
    
    //callback函数指针
    this.onMapTap = null;
    this.onMapPinchEnd = null;
    this.onFloorChange = null; 
	
    //将指针绑定为内部函数
    this.zoomIn = zoomIn;
    this.zoomOut = zoomOut;
    this.addOverlay = addOverlay;
    this.clearOverlays = clearOverlays;
    this.refreshOverLay = refreshOverLay;
    this.changeFloor = changeFloor;
    this.changeBuild = changeBuild;
    this.changePublicType = changePublicType;
    this.transform = transform;
    this.getRealPoint = getRealPoint;
	this.destory = destory;
	this.enableRotate = enableAutoRotate;
    this.disableRotate = disableAutoRotate;
    //补充接口
    //整个数据结构是否初始化完成
    this.isLoaded = function () {
        return isLoaded;
    }
    //获得楼层的id
    this.getMallId = function() {
        return mallId;
    }
    this.getMallName = function() {
        return mallName;
    }
    //获得当前楼层id
    this.getCurrentFloorId = function() {
        return currentFloorId;
    }
	//获得楼层列表
	this.getFloors = function() {
		return floor;
	}
    //获得最大楼层的id
    this.getMaxFloorId = function() {
        return floor[floor.length-1].floor_id;
    }
   
    this.getZoomScale = function() {
        return zoomScale;
    }
    this.getMapWidth = function() {
        return floorImg.width*zoomScale;
    }
	this.getDelta = function(){
		return rate/currentScale*zoomScale;
	}
    
    this.getDivId = function() {
    	return floorDiv.id;
    }
}
