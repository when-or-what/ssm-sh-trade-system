package com.trade.sh.utils;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PageBean<T> implements Serializable {
    private List<T> data; // 数据列表
    private Long pageSize; // 每一页的大小
    private Long total; // 总的数据条数
    private Long curPage; // 当前页码
    private Long pageNum; // 总页数
}
