package com.trade.sh.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.trade.sh.entities.Image;
import com.trade.sh.service.ImageService;
import com.trade.sh.mapper.ImageMapper;
import org.springframework.stereotype.Service;

/**
* @author DELL
* @description 针对表【t_images】的数据库操作Service实现
* @createDate 2023-09-03 00:24:09
*/
@Service
public class ImageServiceImpl extends ServiceImpl<ImageMapper, Image>
    implements ImageService{

}




