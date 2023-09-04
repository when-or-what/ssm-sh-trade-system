package com.trade.sh.utils;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * Json格式的数据进行响应
 */
@Data
@NoArgsConstructor
public class JsonResult<T> implements Serializable {
    // 状态码
    private Integer state;
    // 描述信息
    private String message;
    // 数据
    private T data;

    public JsonResult(ResultEnum resultEnum) {
        this.state = resultEnum.getState();
        this.message = resultEnum.getMessage();
    }

    public JsonResult(ResultEnum resultEnum, T data) {
        this.state = resultEnum.getState();
        this.message = resultEnum.getMessage();
        this.data = data;
    }
}
