package com.trade.sh.interceptor;

import com.trade.sh.components.JwtHelper;
import com.trade.sh.entities.ex.ShSystemException;
import com.trade.sh.utils.ResultEnum;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class JwtInterceptor implements HandlerInterceptor {
    private final JwtHelper jwtHelper;

    @Autowired
    public JwtInterceptor(JwtHelper jwtHelper) {
        this.jwtHelper = jwtHelper;
    }

    @Override
    public boolean preHandle(HttpServletRequest request,
                             HttpServletResponse response,
                             Object handler) {
        String token = request.getHeader("token");
        if (token == null || token.isEmpty()) {
            throw new ShSystemException(ResultEnum.TOKEN_ERR);
        }
        try {
            return jwtHelper.validateToken(token);
        } catch (Exception e) {
            return false;
        }
    }
}
