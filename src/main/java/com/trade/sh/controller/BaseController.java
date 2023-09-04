package com.trade.sh.controller;

import com.trade.sh.entities.ex.ShSystemException;
import com.trade.sh.utils.JsonResult;
import com.trade.sh.utils.ResultEnum;
import org.springframework.web.bind.annotation.ExceptionHandler;

public class BaseController {
    /**
     * 请求处理方法，这个方法的返回值就是需要传到前端的数据
     * 自动将异常对象传递到此方法的参数列表上
     * 当项目中产生了异常，会被统一拦截到此方法中
     *
     * @param e 产生的异常
     * @return 返回给前端的JSON对象
     */
    @ExceptionHandler(Exception.class)
    // 统一异常处理
    public <T> JsonResult<T> handleException(Throwable e) {
        // 首先根据所有异常建立一个结果对象
        JsonResult<T> result = new JsonResult<>(ResultEnum.EX);
        if (e instanceof ShSystemException) {
            // 如果是自定义异常，则改变其状态码和消息字段
            result.setState(((ShSystemException) e).getState());
            result.setMessage(e.getMessage());
        }
        // 最后返回
        return result;
    }
}
