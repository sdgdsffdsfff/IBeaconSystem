package com.IBeacon.util;
import java.io.IOException;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

public class SessionFilter implements Filter{
	public void destroy() {
		// TODO Auto-generated method stub
		
	}
	public void doFilter(ServletRequest request, ServletResponse response,FilterChain chain) throws IOException, ServletException {
		HttpServletRequest req = (HttpServletRequest)request;
		HttpServletResponse res = (HttpServletResponse) response;
		HttpSession session = req.getSession();
		String path = req.getServletPath();
		//System.out.println("11111");
		if(!"/login.jsp".equals(path)){
			if(session.getAttribute("admin") != null){
				if( path.contains("ad_")) {
					chain.doFilter(request, response);
				}else {
					res.sendRedirect("login.jsp");
				}
			}else if(session.getAttribute("proxy") != null){
				if( path.contains("pr_")) {
					chain.doFilter(request, response);
				}else {
					res.sendRedirect("login.jsp");
				}
			}else {
				res.sendRedirect("login.jsp");
			}
		}else{
			chain.doFilter(request, response);
		}
	}
	
	public void init(FilterConfig arg0) throws ServletException {
		// TODO Auto-generated method stub
		
	}

}
