package com.trade.sh.entities.vo;

import lombok.Data;

import java.io.Serializable;

@Data
public class GoodVo implements Serializable {
    private String goodCate; // 商品类别
    private String keyword; // 搜索关键字
    private Long pageNum = 1L; // 第几页，默认为第一页
    private Long pageSize = 10L; // 每一页的大小，默认为10
    private String userId; // 用户Id
}
