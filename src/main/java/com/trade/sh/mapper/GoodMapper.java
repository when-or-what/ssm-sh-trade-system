package com.trade.sh.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.trade.sh.entities.Good;
import com.trade.sh.entities.vo.GoodVo;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * @author DELL
 * @description 针对表【t_goods】的数据库操作Mapper
 * @createDate 2023-09-03 00:24:09
 * @Entity com.trade.sh.entities.Good
 */
public interface GoodMapper extends BaseMapper<Good> {

    /**
     * 根据商品id查询商品信息
     * 由于商品信息包含图片信息，不能用生成的模板，所以只好全部手写
     *
     * @param goodId
     * @return
     */
    Good queryById(String goodId);

    /**
     * 批量删除商品
     *
     * @param goodIds
     * @return
     */
    int deleteGoods(List<String> goodIds);

    /**
     * 查询商品的总条目
     *
     * @param goodVo
     * @return
     */
    Long queryAllNum(@Param("goodVo") GoodVo goodVo);

    /**
     * 分页查询商品
     *
     * @param offset
     * @param goodVo
     * @return
     */
    List<Good> queryByPage(@Param("offset") Long offset, @Param("goodVo") GoodVo goodVo);

    /**
     * 物理删除商品
     *
     * @return
     */
    Integer deleteByIsDeleted();

}




