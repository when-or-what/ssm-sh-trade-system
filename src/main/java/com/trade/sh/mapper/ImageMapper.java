package com.trade.sh.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.trade.sh.entities.Image;

import java.util.List;

/**
 * @author DELL
 * @description 针对表【t_images】的数据库操作Mapper
 * @createDate 2023-09-03 00:24:09
 * @Entity com.trade.sh.entities.Image
 */
public interface ImageMapper extends BaseMapper<Image> {

    /**
     * 批量添加图片，替换生成的不高效的方法
     *
     * @param images
     * @return 影响行数
     */
    int addImages(List<Image> images);

    /**
     * 批量删除图片
     *
     * @param goodIds
     */
    int deleteImages(List<String> goodIds);

    Integer deleteByIsDeleted();
}




