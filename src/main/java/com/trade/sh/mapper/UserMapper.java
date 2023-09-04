package com.trade.sh.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.trade.sh.entities.User;

/**
 * @author DELL
 * @description 针对表【t_users】的数据库操作Mapper
 * @createDate 2023-09-03 00:24:09
 * @Entity com.trade.sh.entities.User
 */
public interface UserMapper extends BaseMapper<User> {

    Integer deleteByIsDeleted();
}




