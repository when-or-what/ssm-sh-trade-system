package com.trade.sh.components;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.trade.sh.entities.Image;
import com.trade.sh.entities.User;
import com.trade.sh.mapper.GoodMapper;
import com.trade.sh.mapper.ImageMapper;
import com.trade.sh.mapper.UserMapper;
import com.trade.sh.utils.ImageUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.FileNotFoundException;
import java.util.List;

@Slf4j
@Component
public class ClearTasks {
    @Value("${trading-sys.user.avatar-prefix}")
    private String AVATAR_PREFIX;
    @Value("${trading-sys.user.rela-prefix}")
    private String USER_RELA_PREFIX;
    @Value("${trading-sys.good.image-prefix}")
    private String IMAGE_PREFIX;
    @Value("${trading-sys.good.rela-prefix}")
    private String GOOD_RELA_PREFIX;
    private final UserMapper userMapper;
    private final GoodMapper goodMapper;
    private final ImageMapper imageMapper;

    @Autowired
    public ClearTasks(UserMapper userMapper, GoodMapper goodMapper, ImageMapper imageMapper) {
        this.userMapper = userMapper;
        this.goodMapper = goodMapper;
        this.imageMapper = imageMapper;
    }

    /**
     * 物理删除被逻辑删除的用户，商品，和图片
     * 每月15号凌晨2点触发
     */
    @Scheduled(cron = "0 0 2 15 * ?")
    @Transactional
    public void clearOutDateEntitiesTask() {
        try {
            Integer res = 0;
            log.info("开始执行清除已被逻辑删除的实体的任务");
            res = userMapper.deleteByIsDeleted();
            log.info("表t_users: 共彻底删除{}个用户实体", res);
            res = goodMapper.deleteByIsDeleted();
            log.info("表t_goods: 共彻底删除{}个商品实体", res);
            res = imageMapper.deleteByIsDeleted();
            log.info("表t_images: 共彻底删除{}个图片实体", res);
            log.info("清除已被逻辑删除的实体的任务顺利完成");
        } catch (Exception e) {
            log.error("清除已被逻辑删除的实体的任务失败", e);
        }
    }

    /**
     * 删除多余的图片
     * 每月1号凌晨1点执行
     */
    @Scheduled(cron = "0 0 1 1 * ?")
    @Transactional
    public void clearRedundantImagesTask() {
        try {
            Integer res = 0, res1 = 0;
            log.info("开始执行清除多余图片的任务");
            LambdaQueryWrapper<User> q = new LambdaQueryWrapper<>();
            LambdaQueryWrapper<Image> q1 = new LambdaQueryWrapper<>();
            User user = null;
            Image img = null;
            // 首先清除用户头像图片
            // 获取路径数组
            List<String> imgPath = getFilePaths(AVATAR_PREFIX, USER_RELA_PREFIX);
            if (imgPath == null) {
                log.info("用户头像图片文件夹为空，清除多余图片的任务顺利完成");
                return;
            }
            // 对每个路径字符串，去查找数据库，如果数据库中存在，则不删除，否则删除
            for (String string : imgPath) {
                // 准备查询条件
                q.clear();
                q.eq(User::getUserAvatar, string);
                // 查询数据
                // 一般两个用户的头像图片名不会一样，当作是一对一关系即可
                user = userMapper.selectOne(q);
                if (user == null) {
                    // 没查到，说明此图片是冗余的，删除
                    if (Boolean.TRUE.equals(ImageUtil.deleteImage(string, USER_RELA_PREFIX))) {
                        res++;
                    }
                }
            }
            log.info("彻底删除{}个用户头像图片文件", res);
            // 然后清除商品图片
            // 获取路径数组
            imgPath = getFilePaths(IMAGE_PREFIX, GOOD_RELA_PREFIX);
            if (imgPath == null) {
                log.info("商品图片文件夹为空，清除多余图片的任务顺利完成");
                return;
            }
            // 对每个路径字符串，去查找数据库，如果数据库中存在，则不删除，否则删除
            for (String s : imgPath) {
                // 准备查询条件
                q1.clear();
                q1.eq(Image::getImgName, s);
                // 查询数据
                img = imageMapper.selectOne(q1);
                if (img == null) {
                    // 没查到，说明此图片是冗余的，删除
                    if (Boolean.TRUE.equals(ImageUtil.deleteImage(s, GOOD_RELA_PREFIX))) {
                        res1++;
                    }
                }
            }
            log.info("彻底删除{}个商品图片文件", res1);
            log.info("共彻底删除{}个图片文件", res + res1);
            log.info("清除多余图片的任务顺利完成");
        } catch (Exception e) {
            log.error("清除多余图片的任务失败", e);
        }
    }

    private static List<String> getFilePaths(String resourcePrefix, String child) throws FileNotFoundException {
        // 获取图片文件名数组
        List<String> filenames = ImageUtil.getFileNames(child);
        if (filenames == null) {
            return null;
        }
        // 组装数据库格式的文件路径
        filenames.replaceAll(filename -> resourcePrefix + filename);
        return filenames;
    }
}
