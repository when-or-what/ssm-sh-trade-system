package com.trade.sh.entities;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;

/**
 * @TableName t_goods
 */
@TableName(value = "t_goods")
@Data
public class Good implements Serializable {
    /**
     * 主键，雪花算法生成，不用自增
     */
    @TableId
    private String goodId;

    /**
     * 商品种类（标签）
     */
    private String goodCate;

    /**
     * 商品名
     */
    private String goodName;

    /**
     * 商品价格
     */
    private BigDecimal goodPrice;

    /**
     * 商品创建时间
     */
    private Long createAt;

    /**
     * 商品的浏览量
     */
    private Long viewNum;

    /**
     * 商品备注
     */
    private String remark;

    /**
     * 版本号（乐观锁）
     */
    private Integer version;

    /**
     * 是否被删除标志
     */
    private Integer isDeleted;

    /**
     * 商品所属的用户id
     */
    private String userId;

    /**
     * 商品的图片
     */
    @TableField(exist = false)
    private List<Image> images;
}