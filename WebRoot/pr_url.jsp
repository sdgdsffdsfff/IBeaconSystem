<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@taglib prefix="s" uri="/struts-tags"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Beacon管理平台</title>
	<meta name="viewport" content="user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1">
    <link id="bs-css" href="css/bootstrap-cerulean.min.css" rel="stylesheet">
    <link href="css/dataTables.bootstrap.css" rel='stylesheet'>
    <link href="css/charisma-app.css" rel="stylesheet">
	<link href='css/style.css' rel="stylesheet">
   
    <style>
        @font-face {
            font-family : 'VMapPublic';
            src : url(./VMapPublic.ttf);
        }
        #myImg{
            display: none;
        }
        #color_legend{
        	left: 30%;
        }
        #urltable,#urltable th,#collapse_table,#collapse_table th{
        	text-align: center;
        }
        .well{
        	padding: 0;
        }
        #addUrlBtn{
        	padding: 3px;
        }
        #urltable img{
        	width: 50px;
        	height: 50px;
        }
    </style>
    <!-- The fav icon -->
    <link rel="shortcut icon" href="images/favicon.ico">
  </head>

  <body>
     <div class="navbar navbar-default" role="navigation">
        <div class="navbar-inner">
            <button type="button" class="navbar-toggle pull-left animated flip">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand" href="#"> <img alt="Charisma Logo" src="images/logo20.png" class="hidden-xs"/>
                <span>Beacon管理平台</span></a>

            <!-- user dropdown starts -->
            <div class="btn-group pull-right theme-container animated tada">
                <button class="btn btn-default dropdown-toggle" data-toggle="dropdown">
                    <i class="glyphicon glyphicon-user"></i><span class="hidden-sm hidden-xs" id="login_id" uid='${sessionScope.proxy.get("staff_id")}' typeId='${sessionScope.proxy.get("state")}' manage='${sessionScope.proxy.get("manage")}'> ${sessionScope.proxy.get("staff_name")}</span>
                    <span class="caret"></span>
                </button>
                <ul class="dropdown-menu">
                    <li><a href="#" id='personalData'>个人资料</a></li>
                    <li class="divider"></li>
                    <li><a href="logout" >注销</a></li>
                </ul>
            </div>
		</div>
	</div>
    <div class="ch-container">
      <div class="row">
        <!-- left menu starts -->
        <div class="col-sm-2 col-lg-2">
		<div>
		</div>	
          <div class="sidebar-nav">
            <div class="nav-canvas">
              <div class="nav-sm nav nav-stacked">
              </div>
                <ul id = "leftMenu" class="nav nav-pills nav-stacked main-menu">
                    <li>
                        <a href="pr_staff.jsp"><i class="glyphicon glyphicon-user"></i><span>  代理资源管理</span></a>
                    </li>
                    
					<li>
                        <a href="pr_equipmentInfo.jsp"><i class="glyphicon glyphicon-th-list"></i><span>  设备信息查看</span></a>
                    </li>
                    
                    <li>
                        <a href="pr_distributionAndCheck.jsp"><i class="glyphicon glyphicon-indent-left"></i><span>  设备分配管理</span></a>
                    </li>
                    
                    <li class="accordion">
                    	<a href="#"><i class="glyphicon glyphicon-tasks"></i><span> 摇一摇项目管理</span></a>
                        <ul class="nav nav-pills nav-stacked">
                            <li><a href="pr_project.jsp"><i class="glyphicon glyphicon-tags"></i> 项目</a></li>
                            <li class='active'><a href="pr_url.jsp"><i class="glyphicon glyphicon-link"></i> URL</a></li>
                            <li><a href="pr_urlBatchAudit.jsp"><i class="glyphicon glyphicon-hdd"></i> URL批量审核</a></li>
                        </ul>
                    </li> 
                    
                    <li>
                        <a href="pr_statisticalInformation.jsp"><i class="glyphicon glyphicon-list-alt"></i><span>  摇一摇统计信息</span></a>
                    </li>
                </ul>
            </div>
          </div>
        </div>
        <!--/span-->
        <!-- left menu ends -->

        <noscript>
          <div class="alert alert-block col-md-12">
            <h4 class="alert-heading">警告!</h4>
            <p>You need to have <a href="http://en.wikipedia.org/wiki/JavaScript" target="_blank">JavaScript</a>
              enabled to use this site.</p>
          </div>
        </noscript>
		
        <div id="content" class="col-lg-10 col-sm-10">
          <!-- content starts -->
            <div>
                <ul class="breadcrumb">
                    <li>
                        <a href="#">主页</a>
                    </li>
                    <li>
                        <a href="#">URL</a>
                    </li>
                </ul>
            </div>
            
            <div class="panel panel-default">
   				<div class="panel-heading" role="tab" id="sessionPanel">
      				<h4 class="panel-title">
       	 				<a role="button" data-toggle="collapse" href="#sessionCollapse" aria-expanded="true" aria-controls="sessionCollapse">
          					该用户拥有Beacon号段 <span class="glyphicon glyphicon-hand-down" aria-hidden="true"></span>
        				</a>
      				</h4>
   		 		</div>
   				 <div id="sessionCollapse" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="sessionPanel">
      				<div class="panel-body">
						<table class="table table-bordered table-condensed" id="sessionCollapse_table">                             
                        	<thead>
                            	<tr>
                                	<th>uuid</th>
                                   	<th>major</th>
                                    <th>minor</th>                                
                                </tr>
                            </thead>
                          	<tbody>
								<tr><td>无</td><td>无</td><td>无</td></tr>
                            </tbody>
                        </table>
      				</div>
    			</div>
  			</div>
            
            <div class="row">
                <div class="box col-md-12" style="margin-top:20px">
                    <div class="box-inner">
                        <div class="box-header well" data-original-title="">
                            <h2><i class="glyphicon glyphicon-link"></i>  URL</h2>
                            <div class="btn-group btn-group-xs" id='color_legend' role="group" aria-label="color_legend">
                            	<button type="button" class="btn btn-default" style='background-color:#D9EDF7' disabled>未审核</button>
  								<button type="button" class="btn btn-default" style='background-color:#DFF0D8' disabled>审核通过</button>
  								<button type="button" class="btn btn-default" style='background-color:#FCF8E3' disabled>审核未通过</button>
  								<button type="button" class="btn btn-default" style='background-color:#F2DEDE' disabled>删除</button>
                            </div>
                            <div class="box-icon">
                                <button class="btn btn-success" id='addUrlBtn' data-toggle="modal" data-target="#add_one">+新增URL</button>
                            </div>
                        </div>
						
                        <div class="box-content">

                            <table class="table table-bordered table-condensed" id="urltable">
                                <!--<table class="table table-striped table-bordered bootstrap-datatable datatable responsive" id="proxyTable">-->
                                <thead>
                                <tr>
                                 	<th>编号</th>
                                    <th>标题</th>
                                    <th>副标题</th>
                                    <th>logo</th>
                                    <th>URL</th>
                                    <th>Beacon</th>
                                    <th>所属项目</th>
                           
                                    <th>时间</th>
                                    <th>操作</th>
                                </tr>
                                </thead>
                                <tbody>
									<tr><td>无</td><td>无</td><td>无</td><td>无</td><td>无</td><td>无</td><td>无</td><td>无</td><td>无</td></tr>
                                </tbody>
                            </table>

                        </div>
                    </div>
                </div>
                <!--/span-->
                <!--/span-->
            </div>
		</div><!--/#content.col-md-0-->
	</div><!--/fluid-row-->
</div>
	<img id='myImg' /><!-- 用于验证上传图片格式时临时存放图片取得其长宽 -->
    <div class="modal fade" id="add_one" tabindex="-1" role="dialog" aria-labelledby="add_oneLabel" aria-hidden="true" style="">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">×</button>
                    <div id="head"><h3 >新增URL</h3></div>
                </div>
          <form class="form-horizontal" role="form" action="url!add"  enctype="multipart/form-data" method="post" id="add_form">
                <div class="modal-body" >
                        <div class="form-group form-group-sm">
                            <label class="col-md-3 control-label">标题</label>
                            <div class="col-md-9"><input type="text" class="form-control validate_notNull validate_specialCharacter" id="title"></div>
                        </div>

                        <div class="form-group form-group-sm">
                            <label class="col-md-3 control-label">副标题</label>
                            <div class="col-md-9"><input type="text" class="form-control validate_notNull validate_specialCharacter" id="name"></div>
                        </div>
                        
                        <div class="form-group form-group-sm">
                            <label class="col-md-3 control-label">URL</label>
                            <div class="col-md-9">
                            	<div class="input-group">
     								<input type="text" class="form-control validate_url" id="content0">
      								<span class="input-group-btn">
        								<button class="btn btn-default btn-sm" type="button" id='showUrl1'>跳转</button>
      								</span>
      							</div>
                        	</div>
                        </div>

                        <div class="form-group form-group-sm">
                            <label class="col-md-3 control-label">上传Logo</label>
                            <div class="col-md-9">
                            	<input type="file" class="form-control validate_notNull" id="file" name="upload">
                            </div>
                        </div>
						
					 	<div class="form-group form-group-sm">
	                            <label class="col-md-3 control-label">隶属项目</label>
	                            <div class="col-md-9">
		                            <select class="form-control" id="project_id">
								  
									</select>
									</div>
                        </div>
						
						 <div class="form-group form-group-sm">
                            <label class="col-md-3 control-label" >其他信息</label>
                            <div class="col-md-9"><input type="text" class="form-control validate_specialCharacter" id="other_info"></div>
                        </div>
                        
                        <div class="form-group form-group-sm">
                            <div class="col-md-1 col-md-offset-10" ><a class='btn btn-success btn-xs' id="addSessionsBtn"> 添加Beacon</a></div>
                        </div>
                        <div id="url_sessions"></div>
                </div>
                
                <div class="modal-footer">
                    <button  class="btn btn-default" data-dismiss="modal">关闭</button>
                    <button  class="btn btn-default"   type="submit">提交</button>
                </div>
                </form>
                
            </div>
        </div>
    </div>

    <div class="modal fade" id="show_one" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style="">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">×</button>
                    <div><h3>URL信息</h3></div>
                </div>
                
                  <form class="form-horizontal" role="form" >
                <div class="modal-body" >

                        <div class="form-group form-group-sm">
                            <label class="col-md-3 control-label">标题</label>
                            <div class="col-md-9"><input type="text" class="form-control" disabled id="title1"></div>
                        </div>

                        <div class="form-group form-group-sm">
                            <label class="col-md-3 control-label">副标题</label>
                            <div class="col-md-9"><input type="text" class="form-control" disabled id="name1"></div>
                        </div>
                        
                        <div class="form-group form-group-sm">
                            <label class="col-md-3 control-label">URL</label>
                            <div class="col-md-9">
                            	<div class="input-group">
     								<input type="text" class="form-control" id="content1" name="content" disabled>
      								<span class="input-group-btn">
        								<button class="btn btn-default btn-sm" type="button" id='showUrl2'>跳转</button>
      								</span>
      							</div>
                            </div>
                        </div>
                        
                        <div class="form-group form-group-sm">
                            <label class="col-md-3 control-label">服务器Logo</label>
                            <div class="col-md-9">
                            	<div class="input-group">
                            		<input type="text" class="form-control" disabled id="servicefile1">
                            		<span class="input-group-btn">
        								<button class="btn btn-default btn-sm" type="button" id='showlogo2'>查看</button>
      								</span>
                            	</div>
                            </div>
                        </div>               
						
						<div class="form-group form-group-sm">
                            <label class="col-md-3 control-label">隶属项目</label>
                            <div class="col-md-9"><input type="text" class="form-control" disabled id="project_id1"></div>
                        </div>
						
						<div class="form-group form-group-sm">
                            <label class="col-md-3 control-label">页面编号</label>
                            <div class="col-md-9"><input type="text" class="form-control" disabled id="page_id1"></div>
                        </div>
                        
                        <div class="form-group form-group-sm">
                            <label class="col-md-3 control-label">审核状态</label>
                            <div class="col-md-9"><input type="text" class="form-control" disabled id="status1"></div>
                        </div>
                        
                        <div class="form-group form-group-sm">
                            <label class="col-md-3 control-label">最后修改人员</label>
                            <div class="col-md-9"><input type="text" class="form-control" disabled id="last_modify"></div>
                        </div>
                        
                        <div class="form-group form-group-sm">
                            <label class="col-md-3 control-label">生成时间</label>
                            <div class="col-md-9"><input type="text" class="form-control" disabled id="time1"></div>
                        </div>
						
						<div class="form-group form-group-sm">
                            <label class="col-md-3 control-label" >其他信息</label>
                            <div class="col-md-9"><input type="text" class="form-control" disabled id="other_info1"></div>
                        </div>
                        
                        <div class="form-group form-group-sm">
                            <button class="btn btn-info btn-block" type="button" data-toggle="collapse" data-target="#collapseInfo" aria-expanded="false" aria-controls="collapseExample">
  								Beacon信息
							</button>
							<div class="collapse" id="collapseInfo">
  								<div class="well">
    								<table class="table table-bordered table-condensed" id="collapse_table">                             
                                		<thead>
                               				<tr>
                                 				<th>uuid</th>
                                    			<th>major</th>
                                    			<th>minor</th>
                                    			                              
                                		    </tr>
                                		</thead>
                                		<tbody>

                                		</tbody>
                            	    </table>
  								</div>
							</div>
                        </div>
                </div>
                
                <div class="modal-footer">
                    <button  class="btn btn-default" data-dismiss="modal">关闭</button>
                </div>
                </form>
                
            </div>
        </div>
    </div>

    <div class="modal fade" id="edit_one" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style="">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">×</button>
                    <div><h3>编辑URL</h3></div>
                </div>
            
                <div class="modal-body" >
                	<form class="form-horizontal" role="form" action="url!add"  enctype="multipart/form-data" method="post" id='edit_form'>             	
                       <div class="form-group form-group-sm">
                            <label class="col-md-3 control-label">编号</label>
                            <div class="col-md-9"><input type="text" class="form-control" id="id2" disabled></div>
                        </div>
                       
						<div class="form-group form-group-sm">
                            <label class="col-md-3 control-label">页面编号</label>
                            <div class="col-md-9"><input type="text" class="form-control" id="page_id2" disabled></div>
                        </div>
						
                        <div class="form-group form-group-sm">
                            <label class="col-md-3 control-label">标题</label>
                            <div class="col-md-9"><input type="text" class="form-control validate_notNull validate_specialCharacter" id="title2"></div>
                        </div>

                        <div class="form-group form-group-sm">
                            <label class="col-md-3 control-label">副标题</label>
                            <div class="col-md-9"><input type="text" class="form-control validate_notNull validate_specialCharacter" id="name2"></div>
                        </div>

                        <div class="form-group form-group-sm">
                            <label class="col-md-3 control-label">URL</label>
                            <div class="col-md-9">
                            	<div class="input-group">
     								<input type="text" class="form-control validate_url" id="content2">
      								<span class="input-group-btn">
        								<button class="btn btn-default btn-sm" type="button" id='showUrl3'>跳转</button>
      								</span>
      							</div>
                            </div>
                        </div>
						
                        <div class="form-group form-group-sm">
                            <label class="col-md-3 control-label">服务器Logo</label>
                            <div class="col-md-9">
                            	<div class="input-group">
                            		<input type="text" class="form-control" disabled id="logo_url2">
                            		<span class="input-group-btn">
        								<button class="btn btn-default btn-sm" type="button" id='showlogo3'>查看</button>
      								</span>
                            	</div>
                            </div>
                        </div>
                        
                        <div class="form-group form-group-sm">
                            <label class="col-md-3 control-label">修改Logo</label>
                            <div class="col-md-9">	
                            	<input type="file" class="form-control myLogoPic" id="file2" name="upload">
                            </div>
                        </div>
						
					    <div class="form-group form-group-sm">
	                            <label class="col-md-3 control-label">隶属项目</label>
	                            <div class="col-md-9">
		                            <select class="form-control" id="project_id2">
								  
									<!-- <option value="1">1</option>
									<option value="2">2</option>
									<option value="3">3</option> -->
									</select>
								</div>
                        </div>
						
						 <div class="form-group form-group-sm">
                            <label class="col-md-3 control-label" >其他信息</label>
                            <div class="col-md-9"><input type="text" class="form-control validate_specialCharacter" id="other_info2"></div>
                        </div>
                    </form>
                </div>
                
                <div class="modal-footer">
                    <button  class="btn btn-default" data-dismiss="modal">关闭</button>
                    <button  class="btn btn-default" id='submitEdit'>提交</button>
                </div>
           
                
            </div>
        </div>
    </div>
    
    <div class="modal fade" id="copyModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style="">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">×</button>
                    <div><h3>新增URL</h3></div>
                </div> 
                <div class="modal-body" >
					<form class="form-horizontal" role="form" >
                        <div class="form-group form-group-sm">
                            <label class="col-md-3 control-label">标题</label>
                            <div class="col-md-9"><input type="text" class="form-control validate_notNull validate_specialCharacter" id="copy_title"></div>
                        </div>

                        <div class="form-group form-group-sm">
                            <label class="col-md-3 control-label">副标题</label>
                            <div class="col-md-9"><input type="text" class="form-control validate_notNull validate_specialCharacter" id="copy_name"></div>
                        </div>
                        
                        <div class="form-group form-group-sm">
                            <label class="col-md-3 control-label">URL</label>
                            <div class="col-md-9">
                            	<div class="input-group">
     								<input type="text" class="form-control validate_url" id="copy_content">
      								<span class="input-group-btn">
        								<button class="btn btn-default btn-sm" type="button" id='copy_showUrl'>跳转</button>
      								</span>
      							</div>
                            </div>
                        </div>
                        
                        <div class="form-group form-group-sm">
                            <label class="col-md-3 control-label">服务器Logo</label>
                            <div class="col-md-9">
                            	<div class="input-group">
                            		<input type="text" class="form-control" disabled id="copy_servicefile">
                            		<span class="input-group-btn">
        								<button class="btn btn-default btn-sm" type="button" id='showlogo5'>查看</button>
      								</span>
                            	</div>
                            </div>
                        </div>
						
						<div class="form-group form-group-sm">
	                            <label class="col-md-3 control-label">隶属项目</label>
	                            <div class="col-md-9">
		                            <select class="form-control" id="copy_project_id">
								  
									</select>
									</div>
                        </div>					
						
						<div class="form-group form-group-sm">
                            <label class="col-md-3 control-label" >其他信息</label>
                            <div class="col-md-9"><input type="text" class="form-control validate_specialCharacter" id="copy_other_info"></div>
                        </div>
                        
                    	<div class="form-group form-group-sm">
                            <div class="col-md-1 col-md-offset-10" ><a class='btn btn-success btn-xs' id="copy_addSessionsBtn"> 添加Beacon</a></div>
                        </div>
                        <div id="copy_url_sessions"></div>
                    </form>
                </div>
                
                <div class="modal-footer">
                    <button  class="btn btn-default" data-dismiss="modal">关闭</button>
                    <button  class="btn btn-success" id='submitCopy'>提交</button>
                </div>
            </div>
        </div>
    </div>
    
        <div class="modal fade" id="personalDataModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style="">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">×</button>
                    <div><h3 >个人资料</h3></div>
                </div>
                <div class="modal-body" >
                	<form class="form-horizontal" role="form">

                        <div class="form-group form-group-sm">
                            <label class="col-md-3 control-label">用户ID</label>
                            <div class="col-md-9"><input type="text" class="form-control" id="personal_id" disabled></div>
                        </div>

                        <div class="form-group form-group-sm">
                            <label class="col-md-3 control-label">用户名</label>
                            <div class="col-md-9"><input type="text" class="form-control" id="personal_name" disabled></div>
                        </div>

                        <div class="form-group form-group-sm">
                            <label class="col-md-3 control-label">密码</label>
                            <div class="col-md-9"><input type="text" class="form-control" id="personal_pwd" disabled></div>
                        </div>
						
						<div class="form-group form-group-sm">
                            <label class="col-md-3 control-label">联系人电话</label>
                            <div class="col-md-9"><input type="text" class="form-control validate_specialCharacter" id="personal_contact"></div>
                        </div>

						 <div class="form-group form-group-sm">
                            <label class="col-md-3 control-label" >联系人QQ</label>
                            <div class="col-md-9"><input type="text" class="form-control validate_specialCharacter" id="personal_qq"></div>
                        </div>
						
						 <div class="form-group form-group-sm">
                            <label class="col-md-3 control-label">联系人微信</label>
                            <div class="col-md-9"><input type="text" class="form-control validate_specialCharacter" id="personal_wechat"></div>
                        </div>
						
						<div class="form-group form-group-sm">
                            <label class="col-md-3 control-label">联系人邮箱</label>
                            <div class="col-md-9"><input type="text" class="form-control validate_specialCharacter" id="personal_email"></div>
                        </div>
							
                        <div class="form-group form-group-sm">
                            <label class="col-md-3 control-label">其他信息</label>
                            <div class="col-md-9"><input type="text" class="form-control validate_specialCharacter" id="personal_other"></div>
                        </div>
                        
                        <div class="form-group form-group-sm">
                            <label class="col-md-3 control-label">用户类别</label>
                            <div class="col-md-9"><input type="text" class="form-control" id="personal_type" disabled></div>
                        </div>
						
						<div class="form-group form-group-sm">
                            <label class="col-md-3 control-label">审核权限</label>
                            <div class="col-md-9"><input type="text" class="form-control" id="personal_manage" disabled></div>
                        </div>
                        
                        <div id = "personal_sessions">
                        </div>
                    </form>                 					
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-success" id='submitPersonalInfoBtn'>提交</button>
                	<button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>                
                </div>
            </div>
        </div>
    </div>

    <!-- jQuery -->
    <script src="js/jquery.min.js"></script>
    <script src="js/jquery.blockUI.js"></script>
    <script src="js/jquery.form.min.js"></script>
    <script src="js/operateSessions.js"></script>
    <script src="js/url.js"></script>
	<script src="js/personalData.js"></script> 
    <script src="js/bootstrap.min.js"></script>
    <script src="js/charisma.js"></script>
    <script src='js/jquery.dataTables.min.js'></script>
    <script  src="js/dataTables.bootstrap.js"></script>
 	<script src='js/validate.js'></script>


  </body>
</html>

