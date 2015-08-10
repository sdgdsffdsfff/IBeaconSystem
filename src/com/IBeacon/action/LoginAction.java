package com.IBeacon.action;

import java.util.Map;

import org.apache.struts2.interceptor.SessionAware;
import org.json.JSONObject;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import com.IBeacon.util.JSONUnit;
import com.opensymphony.xwork2.ActionSupport;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
@Component
@Scope("prototype")
public class LoginAction extends ActionSupport implements SessionAware {
	private String username;
	private String password;
	private Map<String,Object> session;
	
	public String execute(){
		String url = "http://10.103.240.198:8080/beacon/staff!login?user_id="+username+"&pwd="+password;
        String jsonStr = JSONUnit.loadJSON(url);
        try {
			JSONObject jsonObj = new JSONObject(jsonStr);
			if((Boolean) jsonObj.get("success")){
				
				if(jsonObj.get("state").equals("0")){
					session.put("admin", jsonObj);
					System.out.println("admin登陆成功:"+session.get("admin"));
					return "admin";
				}else if(jsonObj.get("state").equals("1") || jsonObj.get("state").equals("2")){
					session.put("proxy", jsonObj);
					System.out.println("proxy登陆成功:"+session.get("proxy"));
					return "proxy";
				}else{
					System.out.println("登陆失败");
					return "fail";
				}
			}else{
				System.out.println("接口返回数据false,登陆失败");
				String msg = (String)jsonObj.get("message");
				this.addFieldError("errorMsg" , msg);
				return "fail";
			}
		} catch (Exception e) {
			e.printStackTrace();
			return "fail";
		}       
	}

	public String getUsername() {
		return username;
	}
	
	public void setUsername(String username) {
		this.username = username;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}

	public Map<String, Object> getSession() {
		return session;
	}
	public void setSession(Map<String, Object> session) {
		this.session = session;
	}
}
