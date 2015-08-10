<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
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
                    <li id = "view">
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
                            <li><a href="pr_url.jsp"><i class="glyphicon glyphicon-link"></i> URL</a></li>
                            <li class="active"><a href="pr_urlBatchAudit.jsp"><i class="glyphicon glyphicon-hdd"></i> URL批量审核</a></li>
                            <!-- <li><a href="#"><i class="glyphicon glyphicon-bold"></i> Beacon ID</a></li> -->
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
                        <a href="#">URL批量审核</a>
                    </li>
                </ul>
            </div>                  
           
            <div class="row">
                <div class="box col-md-12" style="margin-top:20px">
                    <div class="box-inner">
                        <div class="box-header well" data-original-title="">
                            <h2><i class="glyphicon glyphicon-hdd"></i>  URL批量审核</h2>                          
                        </div>
						<img id='myImg' /><!-- 用于验证上传图片格式时临时存放图片取得其长宽 -->
                        <div class="box-content col-md-offset-1">
							<form class="form-horizontal" role="form" action="url!add"  enctype="multipart/form-data" method="post" id="urlBatch_form">
                        		<div class="form-group form-group-sm">
                            		<label class="col-md-3 control-label">标题</label>
                            		<div class="col-md-5"><input type="text" class="form-control validate_notNull validate_specialCharacter" id="title"></div>
                        		</div>

                        		<div class="form-group form-group-sm">
                            		<label class="col-md-3 control-label">副标题</label>
                            		<div class="col-md-5"><input type="text" class="form-control validate_notNull validate_specialCharacter" id="name"></div>
                        		</div>

                       			 <div class="form-group form-group-sm">
                            		<label class="col-md-3 control-label">上传Logo</label>
                            		<div class="col-md-5">
                            			<input type="file" class="form-control" id="file" name="upload">
                            		</div>
                        		</div>
                        		
                        		<div class="form-group form-group-sm">
                            		<label class="col-md-3 control-label">服务器Logo</label>
                            		<div class="col-md-5">
                            			<div class="input-group">
                            				<input type="text" class="form-control" id="logo_url">
                            				<span class="input-group-btn">
        										<button class="btn btn-default btn-sm" type="button" id='showlogo'>查看</button>
      										</span>
                            			</div>
                           		    </div>
                        		</div>
						
					 			<div class="form-group form-group-sm">
	                            	<label class="col-md-3 control-label">隶属项目</label>
	                            	<div class="col-md-5">
		                            	<select class="form-control" id="project_id">
								  
										</select>
									</div>
                        		</div>
						
						 		<div class="form-group form-group-sm">
                            		<label class="col-md-3 control-label" >其他信息</label>
                            		<div class="col-md-5"><input type="text" class="form-control validate_specialCharacter" id="other_info"></div>
                        		</div>
                        		
                        		<div class="form-group form-group-sm">
                            		<label class="col-md-3 control-label" >url前缀</label>
                            		<div class="col-md-5"><input type="text" class="form-control validate_url" placeholder='url公共部分' id="url_prefix"></div>
                        		</div>
                        		
                        		<div class="form-group form-group-sm">
                            		<label class="col-md-3 control-label" >url后缀</label>
                            		<div class="col-md-2"><input type="text" class="form-control validate_notNull validate_number" id="url_suffix_1"></div>
                        			<label class="col-md-1 control-label" style='text-align:center;'>至</label>
                            	    <div class="col-md-2"><input type="text" class="form-control validate_notNull validate_number" id="url_suffix_2"></div>                  
                        		</div>  
                        		
                        		<div class="form-group form-group-sm">
                            		<label class="col-md-3 control-label" >UUID</label>
                            		<div class="col-md-5"><input type="text" class="form-control validate_notNull validate_specialCharacter" id="uuid"></div>
                        		</div>
                        		
                        		<div class="form-group form-group-sm">
                            		<label class="col-md-3 control-label" >Major</label>
                            		<div class="col-md-5"><input type="text" class="form-control validate_notNull validate_number" id="major"></div>
                        		</div>
                        		
                        		<div class="form-group form-group-sm">
                            		<label class="col-md-3 control-label" >Minor号段</label>
                            		<div class="col-md-2"><input type="text" class="form-control validate_notNull validate_number" id="minor_start"></div>
                        			<label class="col-md-1 control-label" style='text-align:center;'>至</label>
                            	    <div class="col-md-2"><input type="text" class="form-control validate_notNull validate_number" id="minor_end"></div>                  
                        		</div>       		                        		
                			</form>
                			<div class='col-md-offset-7'>
                				<button  class="btn btn-success" type="submit" id='submitUrlBatch'>提交</button>
                			</div>	
                        </div>
                    </div>
                </div>
                <!--/span-->
                <!--/span-->
            </div>
		</div><!--/#content.col-md-0-->
	</div><!--/fluid-row-->
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
                            <div class="col-md-9"><input type="text" class="form-control" id="personal_contact"></div>
                        </div>

						 <div class="form-group form-group-sm">
                            <label class="col-md-3 control-label" >联系人QQ</label>
                            <div class="col-md-9"><input type="text" class="form-control" id="personal_qq"></div>
                        </div>
						
						 <div class="form-group form-group-sm">
                            <label class="col-md-3 control-label">联系人微信</label>
                            <div class="col-md-9"><input type="text" class="form-control" id="personal_wechat"></div>
                        </div>
						
						<div class="form-group form-group-sm">
                            <label class="col-md-3 control-label">联系人邮箱</label>
                            <div class="col-md-9"><input type="text" class="form-control" id="personal_email"></div>
                        </div>
							
                        <div class="form-group form-group-sm">
                            <label class="col-md-3 control-label">其他信息</label>
                            <div class="col-md-9"><input type="text" class="form-control" id="personal_other"></div>
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

    <script src="js/jquery.min.js"></script>
    <script src="js/jquery.blockUI.js"></script> 
    <script src="js/bootstrap.min.js"></script>
    <script src="js/charisma.js"></script>
    <script src='js/jquery.dataTables.min.js'></script>
    <script src="js/dataTables.bootstrap.js"></script>
    <script src="js/jquery.form.min.js"></script>
    <script src="js/validate.js"></script>
	<script src="js/urlBatchAudit.js"></script>
	<script src="js/personalData.js"></script>
  </body>
</html>

