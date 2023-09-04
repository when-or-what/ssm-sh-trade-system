package com.trade.sh.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.trade.sh.entities.Good;
import com.trade.sh.entities.Image;
import com.trade.sh.entities.User;
import com.trade.sh.entities.ex.ShSystemException;
import com.trade.sh.entities.vo.GoodVo;
import com.trade.sh.mapper.GoodMapper;
import com.trade.sh.mapper.ImageMapper;
import com.trade.sh.mapper.UserMapper;
import com.trade.sh.service.GoodService;
import com.trade.sh.utils.DateTimeUtil;
import com.trade.sh.utils.ImageUtil;
import com.trade.sh.utils.PageBean;
import com.trade.sh.utils.ResultEnum;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * @author DELL
 * @description 针对表【t_goods】的数据库操作Service实现
 * @createDate 2023-09-03 00:24:09
 */
@Service
@Slf4j
public class GoodServiceImpl extends ServiceImpl<GoodMapper, Good>
        implements GoodService {
    @Value("${trading-sys.good.image-prefix}")
    private String IMAGE_PREFIX;
    @Value("${trading-sys.good.rela-prefix}")
    private String RELA_PREFIX;
    @Value("${trading-sys.image.max-size}")
    private Integer MAX_SIZE;
    @Value("${trading-sys.image.types:}")
    private List<String> TYPES;
    private final GoodMapper goodMapper;
    private final ImageMapper imageMapper;
    private final UserMapper userMapper;


    @Autowired
    public GoodServiceImpl(GoodMapper goodMapper, ImageMapper imageMapper, UserMapper userMapper) {
        this.goodMapper = goodMapper;
        this.imageMapper = imageMapper;
        this.userMapper = userMapper;
    }

    @Override
    @Transactional
    public Good add(Good good) {
        // 首先查询用户是否存在
        User res = userMapper.selectById(good.getUserId());
        if (res == null) {
            // 用户不存在
            throw new ShSystemException(ResultEnum.USER_NOT_FOUND);
        }
        // 判断用户是否被禁用
        if (res.getIsDisabled() == 1) {
            // 用户被禁用
            throw new ShSystemException(ResultEnum.USER_DISABLED);
        }
        // 查询商品名是否可用
        LambdaQueryWrapper<Good> q = new LambdaQueryWrapper<>();
        q.eq(Good::getUserId, good.getUserId()).eq(Good::getGoodName, good.getGoodName());
        Good g = goodMapper.selectOne(q);
        if (g != null) {
            // 商品已存在
            throw new ShSystemException(ResultEnum.GOOD_DUP);
        }
        // 然后插入
        // 设置创建时间
        good.setCreateAt(DateTimeUtil.nowTime());
        // 保存商品
        if (goodMapper.insert(good) != 1) {
            // 保存商品信息失败
            log.error("保存商品信息失败");
            throw new ShSystemException(ResultEnum.INSERT);
        }
        // 保存好了商品信息，再保存图片信息
        List<Image> images = good.getImages();
        // 这里要将图片的id设为所述商品的id
        for (Image image : images) {
            image.setGoodId(good.getGoodId());
        }
        if (imageMapper.addImages(images) != images.size()) {
            log.error("保存商品图片信息失败");
            throw new ShSystemException(ResultEnum.INSERT);
        }
        // 商品和图片都保存好之后再获取一下并返回
        try {
            return goodMapper.queryById(good.getGoodId());
        } catch (Exception e) {
            log.error("获取添加的商品时出错");
            throw new ShSystemException(ResultEnum.GET);
        }
    }

    @Override
    @Transactional
    public Good updateGood(Good good) {
        // 首先查询商品是否存在
        Good g = goodMapper.queryById(good.getGoodId());
        if (g == null) {
            // 商品不存在
            throw new ShSystemException(ResultEnum.GOOD_NOT_FOUND);
        }
        // 查询商品名是否可用
        LambdaQueryWrapper<Good> q = new LambdaQueryWrapper<>();
        q.eq(Good::getUserId, g.getUserId()).eq(Good::getGoodName, good.getGoodName());
        g = goodMapper.selectOne(q);
        if (g != null) {
            // 商品已存在
            throw new ShSystemException(ResultEnum.GOOD_DUP);
        }
        // 商品的基本信息更新
        if (goodMapper.updateById(good) != 1) {
            log.error("更新商品基本信息时出错");
            throw new ShSystemException(ResultEnum.UPDATE);
        }
        // 然后删除该商品的所有图片
        LambdaQueryWrapper<Image> q1 = new LambdaQueryWrapper<>();
        q1.eq(Image::getGoodId, good.getGoodId());
        if (imageMapper.delete(q1) <= 0) {
            log.error("删除商品图片时出错");
            throw new ShSystemException(ResultEnum.DELETE);
        }
        // 然后将此时的图片加入
        List<Image> images = good.getImages();
        for (Image image : images) {
            image.setGoodId(good.getGoodId());
        }
        if (imageMapper.addImages(images) != images.size()) {
            log.error("更新商品时插入图片失败");
            throw new ShSystemException(ResultEnum.UPDATE);
        }
        // 更新完成后，获取商品
        try {
            return goodMapper.queryById(good.getGoodId());
        } catch (Exception e) {
            log.error("更新商品后获取商品信息失败");
            throw new ShSystemException(ResultEnum.GET);
        }
    }

    @Override
    @Transactional
    public void removeGoods(List<String> goodIds) {
        // 将id数组去重
        Set<String> set = new HashSet<>(goodIds);
        goodIds.clear();
        goodIds.addAll(set);
        int n = goodIds.size();
        try {
            imageMapper.deleteImages(goodIds);
        } catch (Exception e) {
            log.error("删除商品时删除图片失败");
            throw new ShSystemException(ResultEnum.DELETE);
        }
        if (n != goodMapper.deleteGoods(goodIds)) {
            log.error("删除商品失败");
            throw new ShSystemException(ResultEnum.DELETE);
        }
    }

    @Override
    public String uploadImage(MultipartFile image) {
        if (image.isEmpty()) {
            // 文件为空
            throw new ShSystemException(ResultEnum.FILE_EMPTY);
        }
        if (image.getSize() > MAX_SIZE * 1024 * 1024) {
            // 文件太大
            throw new ShSystemException(ResultEnum.FILE_SIZE);
        }
        if (!TYPES.contains(image.getContentType())) {
            // 文件类型错误
            throw new ShSystemException(ResultEnum.FILE_TYPE);
        }

        try {
            return IMAGE_PREFIX + ImageUtil.saveImage(image, RELA_PREFIX);
        } catch (IllegalStateException e) {
            // 抛出异常
            throw new ShSystemException(ResultEnum.FILE_STATE);
        } catch (IOException e) {
            // 抛出异常
            throw new ShSystemException(ResultEnum.FILE_IO);
        }
    }

    @Override
    public Good findById(String goodId) {
        try {
            return goodMapper.queryById(goodId);
        } catch (Exception e) {
            log.error("获取商品详情时出错");
            throw new ShSystemException(ResultEnum.GET);
        }
    }

    @Override
    public PageBean<Good> getGoods(GoodVo goodVo) {
        log.info("前端请求参数：{}", goodVo);
        try {
            // 查询总条数
            Long total = goodMapper.queryAllNum(goodVo);
            // 查询商品数据
            List<Good> goods = goodMapper.queryByPage((goodVo.getPageNum() - 1) * goodVo.getPageSize(), goodVo);
            // 查询获得了数据，接下来装配
            PageBean<Good> res = new PageBean<>();
            res.setData(goods);
            res.setTotal(total);
            res.setCurPage(goodVo.getPageNum());
            res.setPageSize(goodVo.getPageSize());
            res.setPageNum((total + goodVo.getPageSize() - 1) / goodVo.getPageSize());
            return res;
        } catch (Exception e) {
            log.error("在分页查询商品时出错");
            throw new ShSystemException(ResultEnum.GET);
        }
    }

    @Override
    @Transactional
    public void increaseView(String goodId) {
        // 首先判断商品是否存在
        Good res = goodMapper.selectById(goodId);
        if (res == null) {
            throw new ShSystemException(ResultEnum.GOOD_NOT_FOUND);
        }
        // 然后更新其浏览量，加1
        res.setViewNum(res.getViewNum() + 1);
        // 更新至数据库
        if (goodMapper.updateById(res) != 1) {
            log.error("更新浏览量时出错");
            throw new ShSystemException(ResultEnum.UPDATE);
        }
    }
}




