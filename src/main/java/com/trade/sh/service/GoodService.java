package com.trade.sh.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.trade.sh.entities.Good;
import com.trade.sh.entities.vo.GoodVo;
import com.trade.sh.utils.PageBean;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * @author DELL
 * @description 针对表【t_goods】的数据库操作Service
 * @createDate 2023-09-03 00:24:09
 */
public interface GoodService extends IService<Good> {

    /**
     * 用户添加商品
     *
     * @param good
     * @return 商品信息，如果添加成功，否则返回null或抛出异常
     */
    Good add(Good good);

    /**
     * 更新商品信息
     *
     * @param good
     * @return 商品信息，如果添加成功，否则返回null或抛出异常
     */
    Good updateGood(Good good);

    /**
     * 逻辑删除商品，根据商品的id数组删除
     *
     * @param goodIds
     */
    void removeGoods(List<String> goodIds);

    /**
     * 上传商品图片
     *
     * @param file
     * @return 图片路径
     */
    String uploadImage(MultipartFile file);

    /**
     * 根据商品id查询商品信息
     *
     * @param goodId
     * @return
     */
    Good findById(String goodId);

    /**
     * 分页获取商品列表
     *
     * @param goodVo
     * @return
     */
    PageBean<Good> getGoods(GoodVo goodVo);

    /**
     * 增加商品的浏览量
     *
     * @param goodId
     */
    void increaseView(String goodId);
}
