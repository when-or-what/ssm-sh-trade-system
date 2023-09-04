package com.trade.sh.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.trade.sh.entities.User;
import org.springframework.web.multipart.MultipartFile;

/**
 * @author DELL
 * @description 针对表【t_users】的数据库操作Service
 * @createDate 2023-09-03 00:24:09
 */
public interface UserService extends IService<User> {
    /**
     * 检查用户名是否可用
     * 或检查用户是否存在
     *
     * @param userName
     * @return true 可用/不存在
     */
    Boolean checkName(String userName);

    /**
     * 用户注册
     *
     * @param user
     * @return user 注册成功，否则返回null或者抛出异常
     */
    User signUp(User user);

    /**
     * 用户登录
     *
     * @param userName
     * @param userPswd
     * @return user 登录成功，否则返回null或者抛出异常
     */
    User signIn(String userName, String userPswd);

    /**
     * 更新用户信息
     *
     * @param user
     * @return user 更新成功，否则返回null或者抛出异常
     */
    User updateUserInfo(User user);

    /**
     * 用户修改密码
     *
     * @param userId
     * @param oldPassword
     * @param newPassword
     * @return true 修改成功，否则返回false或抛出异常
     */
    Boolean updatePassword(String userId, String oldPassword, String newPassword);

    /**
     * 用户修改邮箱
     *
     * @param userId
     * @param oldEmail
     * @param newEmail
     * @return true 修改成功，否则返回false或抛出异常
     */
    Boolean updateEmail(String userId, String oldEmail, String newEmail);

    /**
     * 用户注销
     *
     * @param userId
     * @return true 注销成功，否则返回false或抛出异常
     */
    Boolean logout(String userId);

    /**
     * 请求验证码
     *
     * @param userName
     * @param userEmail
     * @return true，验证码发送成功，否则返回false或抛出异常
     */
    Boolean getVcode(String userName, String userEmail);

    /**
     * 验证验证码
     *
     * @param userName
     * @param userEmail
     * @param veriCode
     * @return true，验证码验证成功，否则返回false或抛出异常
     */
    Boolean verify(String userName, String userEmail, String veriCode);

    /**
     * 用户重置密码
     *
     * @param userName
     * @param userEmail
     * @param userPswd
     * @return true，密码重置成功，否则返回false或抛出异常
     */
    Boolean resetPswd(String userName, String userEmail, String userPswd);

    /**
     * 用户上传头像
     *
     * @param file
     * @return 图片路径，否则返回null或者抛出异常
     */
    String uploadAvatar(MultipartFile file);
}
