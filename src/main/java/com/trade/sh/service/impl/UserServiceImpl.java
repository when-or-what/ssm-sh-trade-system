package com.trade.sh.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.trade.sh.components.JwtHelper;
import com.trade.sh.components.RandomString;
import com.trade.sh.entities.User;
import com.trade.sh.entities.ex.ShSystemException;
import com.trade.sh.mapper.UserMapper;
import com.trade.sh.service.UserService;
import com.trade.sh.utils.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

/**
 * @author DELL
 * @description 针对表【t_users】的数据库操作Service实现
 * @createDate 2023-09-03 00:24:09
 */
@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User>
        implements UserService {
    @Value("${trading-sys.user.avatar-prefix}")
    private String AVATAR_PREFIX;
    @Value("${trading-sys.user.rela-prefix}")
    private String RELA_PREFIX;
    @Value("${trading-sys.image.max-size}")
    private Integer MAX_SIZE;
    @Value("${trading-sys.image.types:}")
    private List<String> TYPES;
    // 验证码
    @Value("${trading-sys.user.vcode.minutes}")
    private Integer minutes;
    @Value("${trading-sys.user.vcode.length}")
    private Integer length;
    @Value("${trading-sys.user.vcode.theme}")
    private String theme;

    private final JwtHelper jwtHelper;
    private final UserMapper userMapper;
    private final RandomString randomString;
    private final EmailUtil emailUtil;

    @Autowired
    public UserServiceImpl(JwtHelper j, UserMapper u, RandomString r, EmailUtil e) {
        this.jwtHelper = j;
        this.userMapper = u;
        this.randomString = r;
        this.emailUtil = e;
    }

    @Override
    public Boolean checkName(String userName) {
        LambdaQueryWrapper<User> q = new LambdaQueryWrapper<>();
        q.eq(User::getUserName, userName);
        return userMapper.selectOne(q) == null;
    }

    @Override
    @Transactional
    public User signUp(User user) {
        // 首先判断用户是否存在
        LambdaQueryWrapper<User> q = new LambdaQueryWrapper<>();
        q.eq(User::getUserName, user.getUserName());
        User u = userMapper.selectOne(q);
        if (u != null) {
            // 如果存在，抛出异常
            throw new ShSystemException(ResultEnum.NAME_DUP);
        }
        q.clear();
        q.eq(User::getUserEmail, user.getUserEmail());
        u = userMapper.selectOne(q);
        // 如果邮箱已存在
        if (u != null) {
            // 邮箱已存在
            throw new ShSystemException(ResultEnum.EMAIL_DUP);
        }
        // 否则可以添加
        // 添加用户的创建时间
        user.setCreateAt(DateTimeUtil.nowTime());
        // 密码加密
        user.setUserPswd(ShaUtil.SHA256(user.getUserPswd()));
        // 添加用户到数据库
        int ret = userMapper.insert(user);
        if (ret != 1) {
            // 插入数据库失败
            throw new ShSystemException(ResultEnum.INSERT);
        }
        // 如果插入成功，那么就能查询成功
        // 然后返回数据或者null
        return userMapper.selectById(user.getUserId());
    }

    @Override
    @Transactional
    public User signIn(String userName, String userPswd) {
        LambdaQueryWrapper<User> q = new LambdaQueryWrapper<>();
        q.eq(User::getUserName, userName);
        User res = userMapper.selectOne(q);
        if (res == null) {
            // 用户不存在
            throw new ShSystemException(ResultEnum.USER_NOT_FOUND);
        }
        // 用户存在，判断密码是否正确
        if (!ShaUtil.SHA256(userPswd).equals(res.getUserPswd())) {
            // 不正确
            throw new ShSystemException(ResultEnum.PSWD_ERR);
        }
        // 否则返回查询得到的学生信息
        return res;
    }

    @Override
    @Transactional
    public User updateUserInfo(User user) {
        // 首先根据用户id查询信息
        User res = userMapper.selectById(user.getUserId());
        if (res == null) {
            // 用户不存在
            throw new ShSystemException(ResultEnum.USER_NOT_FOUND);
        }
        // 根据用户名查询是否可用
        LambdaQueryWrapper<User> q = new LambdaQueryWrapper<>();
        q.eq(User::getUserName, user.getUserName());
        res = userMapper.selectOne(q);
        if (res != null) {
            // 如果用户名存在且不和当前用户名一样
            if (!res.getUserId().equals(user.getUserId())) {
                // 则抛出异常
                throw new ShSystemException(ResultEnum.NAME_DUP);
            }
        }
        int ret = userMapper.updateById(user);
        if (ret != 1) {
            throw new ShSystemException(ResultEnum.UPDATE);
        }
        return getById(user.getUserId());
    }

    @Override
    @Transactional
    public Boolean updatePassword(String userId, String oldPassword, String newPassword) {
        // 先根据用户id获取用户
        User res = userMapper.selectById(userId);
        if (res == null) {
            throw new ShSystemException(ResultEnum.USER_NOT_FOUND);
        }
        // 将新旧密码都加密
        String oldPswd = ShaUtil.SHA256(oldPassword);
        String newPswd = ShaUtil.SHA256(newPassword);
        // 对比旧密码是否与数据库密码一样
        if (res.getUserPswd().equals(oldPswd)) {
            // 如果一样，则修改
            res.setUserPswd(newPswd);
            // 更新
            return userMapper.updateById(res) == 1;
        } else {
            // 密码不一致
            throw new ShSystemException(ResultEnum.PSWD_ERR);
        }
    }

    @Override
    @Transactional
    public Boolean updateEmail(String userId, String oldEmail, String newEmail) {
        // 先根据用户id查询用户信息
        User res = userMapper.selectById(userId);
        if (res == null) {
            throw new ShSystemException(ResultEnum.USER_NOT_FOUND);
        }
        // 对比旧邮箱是否与数据库邮箱一样
        if (res.getUserEmail().equals(oldEmail)) {
            // 如果一样，则修改
            res.setUserEmail(newEmail);
            // 更新
            return userMapper.updateById(res) == 1;
        } else {
            // 旧邮箱与数据库邮箱不一样
            throw new ShSystemException(ResultEnum.EMAIL_NOT_MATCH);
        }
    }

    @Override
    @Transactional
    public Boolean logout(String userId) {
        return userMapper.deleteById(userId) == 1;
    }

    @Override
    @Transactional
    public Boolean getVcode(String userName, String userEmail) {
        // 首先根据用户名和邮箱获取用户
        LambdaQueryWrapper<User> q = new LambdaQueryWrapper<>();
        q.eq(User::getUserName, userName).eq(User::getUserEmail, userEmail);
        User res = userMapper.selectOne(q);
        if (res == null) {
            throw new ShSystemException(ResultEnum.EMAIL_BIND_EX);
        }
        // 生成验证码
        String vcode = randomString.getVercode(length);
        // 正常发送验证码
        Email email = new Email();
        email.setEmailTheme(theme);
        email.setEmailText("【校园二手交易平台】尊敬的用户，您本次的验证码为" + vcode + "，有效时间为" + minutes +
                "分钟，请尽快进行验证，如果非本人操作请忽略。");
        email.setReceiver(userEmail);
        try {
            emailUtil.sendSimpleMail(email);
        } catch (Exception e) {
            throw new ShSystemException(ResultEnum.EMAIL);
        }
        // 发送验证码之后设置该用户的验证码和过期时间字段
        res.setTimeOut(DateTimeUtil.nowTime() + minutes * 60);
        res.setVeriCode(vcode);
        // 更新至数据库
        return userMapper.updateById(res) == 1;
    }

    @Override
    @Transactional
    public Boolean verify(String userName, String userEmail, String veriCode) {
        // 首先根据用户名和邮箱获取用户
        LambdaQueryWrapper<User> q = new LambdaQueryWrapper<>();
        q.eq(User::getUserName, userName).eq(User::getUserEmail, userEmail);
        User res = userMapper.selectOne(q);
        if (res == null) {
            throw new ShSystemException(ResultEnum.EMAIL_BIND_EX);
        }
        // 获取用户的验证码和过期时间
        String vc = res.getVeriCode();
        Long to = res.getTimeOut();
        // 验证码不存在或者错误
        if (vc == null || to == null || !vc.equals(veriCode)) {
            throw new ShSystemException(ResultEnum.VC_ERR);
        }
        // 验证码过期
        Long now = DateTimeUtil.nowTime();
        if (now.compareTo(to) > 0) {
            throw new ShSystemException(ResultEnum.VC_TIME_OUT);
        }
        // 验证码正确，验证成功
        // 将验证码的过期时间设置成一个之前的时间即可
        // 这样再验证就会出现验证码过期的错误
        res.setTimeOut(now);
        return userMapper.updateById(res) == 1;
    }

    @Override
    @Transactional
    public Boolean resetPswd(String userName, String userEmail, String userPswd) {
        // 首先根据用户名和邮箱获取用户
        LambdaQueryWrapper<User> q = new LambdaQueryWrapper<>();
        q.eq(User::getUserName, userName).eq(User::getUserEmail, userEmail);
        User res = userMapper.selectOne(q);
        if (res == null) {
            throw new ShSystemException(ResultEnum.EMAIL_BIND_EX);
        }
        // 将新密码加密
        String pswd = ShaUtil.SHA256(userPswd);
        // 更新用户的密码
        res.setUserPswd(pswd);
        return userMapper.updateById(res) == 1;
    }

    @Override
    public String uploadAvatar(MultipartFile avatar) {
        if (avatar.isEmpty()) {
            // 文件为空
            throw new ShSystemException(ResultEnum.FILE_EMPTY);
        }
        if (avatar.getSize() > MAX_SIZE * 1024 * 1024) {
            // 文件太大
            throw new ShSystemException(ResultEnum.FILE_SIZE);
        }
        if (!TYPES.contains(avatar.getContentType())) {
            // 文件类型错误
            throw new ShSystemException(ResultEnum.FILE_TYPE);
        }

        try {
            return AVATAR_PREFIX + ImageUtil.saveImage(avatar, RELA_PREFIX);
        } catch (IllegalStateException e) {
            // 抛出异常
            throw new ShSystemException(ResultEnum.FILE_STATE);
        } catch (IOException e) {
            // 抛出异常
            throw new ShSystemException(ResultEnum.FILE_IO);
        }
    }

}




