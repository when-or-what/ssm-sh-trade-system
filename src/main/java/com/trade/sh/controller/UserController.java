package com.trade.sh.controller;

import com.trade.sh.entities.User;
import com.trade.sh.service.UserService;
import com.trade.sh.utils.JsonResult;
import com.trade.sh.utils.ResultEnum;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/user")
@Slf4j
public class UserController extends BaseController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    // 验证用户名是否可用
    @GetMapping("check_name")
    public JsonResult<Boolean> checkName(@RequestParam String userName) {
        try {
            Boolean res = userService.checkName(userName);
            return new JsonResult<>(ResultEnum.OK, res);
        } catch (Exception e) {
            log.error(e.getClass().getName(), e);
            return handleException(e);
        }
    }

    // 注册
    @PostMapping("/sign_up")
    public JsonResult<User> signUp(@RequestBody User user) {
        try {
            User res = userService.signUp(user);
            return new JsonResult<>(ResultEnum.OK, res);
        } catch (Exception e) {
            log.error(e.getClass().getName(), e);
            return handleException(e);
        }
    }

    // 登录
    @PostMapping("/sign_in")
    public JsonResult<User> signIn(@RequestBody User user) {
        try {
            User res = userService.signIn(user.getUserName(), user.getUserPswd());
            return new JsonResult<>(ResultEnum.OK, res);
        } catch (Exception e) {
            log.error(e.getClass().getName(), e);
            return handleException(e);
        }
    }

    // 更新信息
    @PutMapping
    public JsonResult<User> update(@RequestBody User user) {
        try {
            User res = userService.updateUserInfo(user);
            return new JsonResult<>(ResultEnum.OK, res);
        } catch (Exception e) {
            log.error(e.getClass().getName(), e);
            return handleException(e);
        }
    }

    // 用户修改密码
    @PutMapping("/change_password")
    public JsonResult<Boolean> change(@RequestBody Map<String, Object> data) {
        try {
            // 解析请求体参数
            String userId = (String) data.get("id");
            String oldPassword = (String) data.get("oldPassword");
            String newPassword = (String) data.get("newPassword");
            Boolean res = userService.updatePassword(userId, oldPassword, newPassword);
            return new JsonResult<>(ResultEnum.OK, res);
        } catch (Exception e) {
            log.error(e.getClass().getName(), e);
            return handleException(e);
        }
    }

    // 用户修改邮箱
    @PutMapping("/change_email")
    public JsonResult<Boolean> changeEmail(@RequestBody Map<String, Object> data) {
        try {
            // 解析请求体参数
            String userId = (String) data.get("id");
            String oldEmail = (String) data.get("oldEmail");
            String newEmail = (String) data.get("newEmail");
            Boolean res = userService.updateEmail(userId, oldEmail, newEmail);
            return new JsonResult<>(ResultEnum.OK, res);
        } catch (Exception e) {
            log.error(e.getClass().getName(), e);
            return handleException(e);
        }
    }

    // 获取用户详情
    @GetMapping("/{uid}")
    public JsonResult<User> getById(@PathVariable String uid) {
        try {
            User res = userService.getById(uid);
            return new JsonResult<>(ResultEnum.OK, res);
        } catch (Exception e) {
            log.error(e.getClass().getName(), e);
            return handleException(e);
        }
    }


    // 用户上传头像
    @PostMapping("/upload")
    public JsonResult<String> upload(@RequestParam("file") MultipartFile file) {
        try {
            // 忽略返回值
            String res = userService.uploadAvatar(file);
            return new JsonResult<>(ResultEnum.OK, res);
        } catch (Exception e) {
            log.error(e.getClass().getName(), e);
            return handleException(e);
        }
    }

    // 请求验证码
    @PostMapping("/get_vcode")
    public JsonResult<Boolean> getVcode(@RequestBody User user) {
        try {
            Boolean res = userService.getVcode(user.getUserName(), user.getUserEmail());
            return new JsonResult<>(ResultEnum.OK, res);
        } catch (Exception e) {
            log.error(e.getClass().getName(), e);
            return handleException(e);
        }
    }

    // 验证验证码
    @PostMapping("/verify")
    public JsonResult<Boolean> verVcode(@RequestBody User user) {
        try {
            Boolean res = userService.verify(user.getUserName(), user.getUserEmail(), user.getVeriCode());
            return new JsonResult<>(ResultEnum.OK, res);
        } catch (Exception e) {
            log.error(e.getClass().getName(), e);
            return handleException(e);
        }
    }

    // 重置密码
    @PutMapping("/reset_password")
    public JsonResult<Boolean> reset(@RequestBody User user) {
        try {
            Boolean res = userService.resetPswd(user.getUserName(), user.getUserEmail(), user.getUserPswd());
            return new JsonResult<>(ResultEnum.OK, res);
        } catch (Exception e) {
            log.error(e.getClass().getName(), e);
            return handleException(e);
        }
    }

    // 用户注销
    @DeleteMapping("/{userId}")
    public JsonResult<Boolean> logout(@PathVariable String userId) {
        try {
            Boolean res = userService.logout(userId);
            return new JsonResult<>(ResultEnum.OK, res);
        } catch (Exception e) {
            log.error(e.getClass().getName(), e);
            return handleException(e);
        }
    }
}
