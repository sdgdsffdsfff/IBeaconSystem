package com.IBeacon.action;

import java.util.Map;

import org.apache.struts2.interceptor.SessionAware;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import com.opensymphony.xwork2.ActionContext;
import com.opensymphony.xwork2.ActionSupport;
@Component
@Scope("prototype")
public class LogoutAction extends ActionSupport{
	@Override
	public String execute(){
		Map<String, Object> session = ActionContext.getContext().getSession();
		System.out.println(session+"注销成功~~~~~~~");
		session.clear();
		System.out.println("注销后session:"+session);
		return "logout";
	}
}
