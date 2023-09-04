package com.trade.sh.entities;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.io.Serializable;
import lombok.Data;

/**
 * 
 * @TableName t_images
 */
@TableName(value ="t_images")
@Data
public class Image implements Serializable {
    /**
     * 主键，雪花算法生成，不用自增
     */
    @TableId
    private String imgId;

    /**
     * 图片路径名称，带后缀
     */
    private String imgName;

    /**
     * 版本号（乐观锁）
     */
    private Integer version;

    /**
     * 是否被删除标志
     */
    private Integer isDeleted;

    /**
     * 图片所属的商品id
     */
    private String goodId;
}