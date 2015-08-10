package com.IBeacon.action;

import java.io.File;
import java.io.FileInputStream;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.apache.struts2.ServletActionContext;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import com.IBeacon.util.JSONUnit;
import com.IBeacon.util.UploadFile;
import com.opensymphony.xwork2.ActionSupport;
import com.sun.org.apache.bcel.internal.generic.NEW;
/**
 * @author weiier
 */

@Component
@Scope("prototype")
public class UrlAction extends ActionSupport {
	//private final String ip="10.103.242.71:8888/IBeaconSystem/uploadFiles/";
	
	private String staff_id;
	private String page_id;
	private String url_id;
	private String time;
	private String title;
	private String name;
	private String content;
	private String other_info;
	private String uuid;
	private String major;
	private String minor;
	private String project_id;
	private String logo_url;
	//文件上传属性
	private File upload;
	private String uploadContentType;
	private String uploadFileName;
	//file save path
	private String savePath;
		
	private Map<String,Object> resultObj;

	public Map<String, Object> packageInfo() throws Exception{
		Map<String, Object> map = new HashMap<String, Object>();
		if( this.getUploadContentType().contains("jpeg") || this.getUploadContentType().contains("jpg")
				|| this.getUploadContentType().contains("png") || this.getUploadContentType().contains("gif")){
		File srcFile = this.getUpload();	
		
		String dstname = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
		String[] suffix = this.getUploadFileName().split("\\.");
		dstname = dstname+"."+suffix[suffix.length-1];
		String dstPath = this.getSavePath()+File.separator+dstname;
		System.out.println(dstPath);
		
		File dstFile = new File(dstPath);
		UploadFile.copy(srcFile, dstFile);//将用户上传的图片存到服务器上，dstFile就是服务器上图片的地址，srcFile是用户上传的图片地址
		
		map.put("success", true);
		map.put("logo", dstPath);//返回给用户图片在服务器上对应的地址
			
		}else{
			map.put("success", false);
			map.put("message", "file format is not correct, accepted format is .jpg/.png/.jpeg/.gif");
		}
		return map;
	}
	
	public String add() {		
		Map<String, Object> map = new HashMap<String, Object>();
		try{
			map = packageInfo();
			
		}catch (Exception e) {
			map.put("success",false);
			map.put("message", e.getMessage());
			e.printStackTrace();
		}
		resultObj = JSONObject.fromObject(map);
		return SUCCESS;
	}
	
/*	public String edit() throws Exception {
		Map<String, Object> map = new HashMap<String, Object>();
		try{
				if( this.getUploadContentType().contains("jpeg") || this.getUploadContentType().contains("jpg")
						|| this.getUploadContentType().contains("png") || this.getUploadContentType().contains("gif")){
					File srcFile = this.getUpload();		
					//String dstPath = this.getSavePath()+File.separator+this.getUploadFileName();
					
					String dstname = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
					String[] suffix = this.getUploadFileName().split("\\.");
					dstname = dstname+"."+suffix[suffix.length-1];
					String dstPath = this.getSavePath()+File.separator+dstname;
					System.out.println(dstPath);
					
					File dstFile = new File(dstPath);
					UploadFile.copy(srcFile, dstFile);
					String str = "{'staff_id':'"+staff_id+"','url_id':'"+url_id+"','title':'"+title+"','name':'"+name+"','content':'"+URLEncoder.encode(content, "UTF-8")
							+"','other_info':'"+other_info+"','project_id':'"+project_id+"','logo':'"+dstPath+"'}";
					System.out.println(str);
					str = str.replace("\\", "\\\\");
					JSONObject jsonstr = JSONObject.fromObject(str);
					System.out.println(jsonstr);
					
					String url = "http://10.103.242.71:8888/beacon/url!edit?json="+jsonstr;
					String jsoncallbackStr = JSONUnit.loadJSON(url);
					System.out.println(jsoncallbackStr);
					resultObj = JSONObject.fromObject(jsoncallbackStr);
					}else{
						resultObj = new JSONObject();
						resultObj.put("success", false);
						resultObj.put("message", "file format is not correct, accepted format is .jpg/.png/.jpeg/.gif");
					}
		}catch(Exception e){
			e.printStackTrace();
			resultObj = new JSONObject();
			resultObj.put("success", false);
			resultObj.put("message", e.toString());
		}
		return SUCCESS;
	}*/

	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	public String getOther_info() {
		return other_info;
	}
	public void setOther_info(String other_info) {
		this.other_info = other_info;
	}

	public String getUuid() {
		return uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}

	public String getMinor() {
		return minor;
	}

	public void setMinor(String minor) {
		this.minor = minor;
	}


	public String getMajor() {
		return major;
	}
	public void setMajor(String major) {
		this.major = major;
	}
	public String getProject_id() {
		return project_id;
	}
	public void setProject_id(String project_id) {
		this.project_id = project_id;
	}
	

	public String getLogo_url() {
		return logo_url;
	}

	public void setLogo_url(String logo_url) {
		this.logo_url = logo_url;
	}

	public File getUpload() {
		return upload;
	}

	public void setUpload(File upload) {
		this.upload = upload;
	}

	public String getUploadContentType() {
		return uploadContentType;
	}

	public void setUploadContentType(String uploadContentType) {
		this.uploadContentType = uploadContentType;
	}

	public String getUploadFileName() {
		return uploadFileName;
	}

	public void setUploadFileName(String uploadFileName) {
		this.uploadFileName = uploadFileName;
	}

	public String getTime() {
		return time;
	}

	public void setTime(String time) {
		this.time = time;
	}

	public void setSavePath(String value){
		this.savePath = value;
	}
	private String getSavePath() throws Exception{		
		return ServletActionContext.getServletContext()
			.getRealPath(savePath);
	}

	public String getPage_id() {
		return page_id;
	}

	public void setPage_id(String page_id) {
		this.page_id = page_id;
	}

	public String getUrl_id() {
		return url_id;
	}

	public void setUrl_id(String url_id) {
		this.url_id = url_id;
	}

	public String getStaff_id() {
		return staff_id;
	}

	public void setStaff_id(String staff_id) {
		this.staff_id = staff_id;
	}

	public Map<String, Object> getResultObj() {
		return resultObj;
	}

	public void setResultObj(Map<String, Object> resultObj) {
		this.resultObj = resultObj;
	}
	
	
}