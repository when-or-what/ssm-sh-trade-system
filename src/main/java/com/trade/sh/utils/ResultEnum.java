package com.trade.sh.utils;

import lombok.Getter;

// 统一返回结果状态信息类
// 异常管理类
@Getter
public enum ResultEnum {

    // 项目中用到的错误类型代码和消息
    // 请求成功
    OK(200, "请求成功"),
    // 声明的异常以外的异常
    EX(999, "系统发生知错误"),
    // 数据库基本异常
    // 1. 插入异常
    INSERT(1000, "插入数据时发生错误"),
    // 2. 查询出错
    GET(1001, "查询数据时发生错误"),
    // 3. 更新出错
    UPDATE(1002, "更新数据时发生错误"),
    // 4. 删除出错
    DELETE(1003, "删除数据时发生错误"),
    // 文件异常
    // 5. 文件为空
    FILE_EMPTY(1004, "文件为空"),
    // 6. 文件大小异常
    FILE_SIZE(1005, "文件大小超出限制"),
    // 7. 文件上传状态异常
    FILE_STATE(1006, "文件上传状态异常"),
    // 8. 文件类型异常
    FILE_TYPE(1007, "文件类型不合法"),
    // 9. 文件读写异常
    FILE_IO(1008, "读写文件时发生未知错误"),
    // 10. 邮件发送异常
    EMAIL(1009, "发送邮件时发生未知错误"),
    // 11. token错误异常
    TOKEN_ERR(1010, "您没有访问权限"),
    // 12. 文件夹删除失败
    FOLDER_CRT_ERR(1011, "文件夹创建失败"),
    // 12. 文件删除失败
    FILE_DEL_ERR(1012, "文件删除失败"),

    // 用户异常
    // 1. 用户不存在
    USER_NOT_FOUND(2000, "用户不存在"),
    // 2. 密码错误
    PSWD_ERR(2001, "密码错误"),
    // 3. 邮箱已存在
    EMAIL_DUP(2002, "邮箱已存在"),
    // 4. 用户名已存在
    NAME_DUP(2003, "用户名已存在"),
    // 5. 用户已注销
    USER_LOGOUT(2004, "用户已注销"),
    // 6. 用户不存在或邮箱绑定错误
    EMAIL_BIND_EX(2005, "用户不存在或绑定邮箱错误"),
    //    // 7. 验证码信息不存在
//    VC_NOT_FD(2006, "验证码不存在"),
    // 8. 验证码过期
    VC_TIME_OUT(2007, "验证码已过期"),
    // 9. 验证码错误
    VC_ERR(2008, "验证码错误"),
    // 10. 邮箱不匹配
    EMAIL_NOT_MATCH(2009, "邮箱不匹配"),
    // 11. 用户被禁用
    USER_DISABLED(2010, "该用户被禁用，请联系管理员"),

    // 商品异常
    // 1. 商品（名）已存在
    GOOD_DUP(3000, "商品名已存在"),
    // 2. 商品不存在
    GOOD_NOT_FOUND(3001, "商品不存在");

    private final Integer state;
    private final String message;

    // 在类内部创建对象
    private ResultEnum(Integer state, String message) {
        this.state = state;
        this.message = message;
    }
}
