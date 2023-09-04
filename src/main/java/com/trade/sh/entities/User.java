package com.trade.sh.entities;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.io.Serializable;
import lombok.Data;

/**
 * 
 * @TableName t_users
 */
@TableName(value ="t_users")
@Data
public class User implements Serializable {
    /**
     * 主键，雪花算法生成，不用自增
     */
    @TableId
    private String userId;

    /**
     * 用户名，唯一标识
     */
    private String userName;

    /**
     * 用户密码，SHA256算法加密
     */
    private String userPswd;

    /**
     * 用户邮箱，用于找回密码
     */
    private String userEmail;

    /**
     * 用户头像图片名，带后缀
     */
    private String userAvatar;

    /**
     * 用户的联系方式，用于买家联系
     */
    private String userContact;

    /**
     * 用户简介，兴趣爱好之类的
     */
    private String userRemark;

    /**
     * 用户创建时间
     */
    private Long createAt;

    /**
     * 用户是否被禁用
     */
    private Integer isDisabled;

    /**
     * 6位验证码
     */
    private String veriCode;

    /**
     * 用户验证码失效的时间
     */
    private Long timeOut;

    /**
     * 版本号（乐观锁）
     */
    private Integer version;

    /**
     * 是否被删除标志
     */
    private Integer isDeleted;
}