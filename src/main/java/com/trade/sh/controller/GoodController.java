package com.trade.sh.controller;

import com.trade.sh.entities.Good;
import com.trade.sh.entities.vo.GoodVo;
import com.trade.sh.service.GoodService;
import com.trade.sh.utils.JsonResult;
import com.trade.sh.utils.PageBean;
import com.trade.sh.utils.ResultEnum;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/good")
@Slf4j
public class GoodController extends BaseController {
    private final GoodService goodService;

    @Autowired
    public GoodController(GoodService goodService) {
        this.goodService = goodService;
    }

    // 添加商品
    @PostMapping
    public JsonResult<Good> addGood(@RequestBody Good good) {
        try {
            Good res = goodService.add(good);
            return new JsonResult<>(ResultEnum.OK, res);
        } catch (Exception e) {
            log.error(e.getClass().getName(), e);
            return handleException(e);
        }
    }

    // 获取商品列表
    @PostMapping("/s")
    public JsonResult<PageBean<Good>> getGoods(@RequestBody GoodVo goodVo) {
        try {
            PageBean<Good> res = goodService.getGoods(goodVo);
            return new JsonResult<>(ResultEnum.OK, res);
        } catch (Exception e) {
            log.error(e.getClass().getName(), e);
            return handleException(e);
        }
    }

    // 获取商品详情
    @GetMapping("/{goodId}")
    public JsonResult<Good> getById(@PathVariable String goodId) {
        try {
            Good res = goodService.findById(goodId);
            return new JsonResult<>(ResultEnum.OK, res);
        } catch (Exception e) {
            log.error(e.getClass().getName(), e);
            return handleException(e);
        }
    }

    // 更新商品
    @PutMapping
    public JsonResult<Good> updateById(@RequestBody Good good) {
        try {
            Good res = goodService.updateGood(good);
            return new JsonResult<>(ResultEnum.OK, res);
        } catch (Exception e) {
            log.error(e.getClass().getName(), e);
            return handleException(e);
        }
    }

    // 删除商品
    @DeleteMapping
    public JsonResult<Void> deleteById(@RequestParam("id") List<String> goodIds) {
        try {
            goodService.removeGoods(goodIds);
            return new JsonResult<>(ResultEnum.OK);
        } catch (Exception e) {
            log.error(e.getClass().getName(), e);
            return handleException(e);
        }
    }

    // 上传商品图片
    @PostMapping("/upload")
    public JsonResult<String> upload(@RequestParam("file") MultipartFile file) {
        try {
            // 解析请求体参数
            String res = goodService.uploadImage(file);
            return new JsonResult<>(ResultEnum.OK, res);
        } catch (Exception e) {
            log.error(e.getClass().getName(), e);
            return handleException(e);
        }
    }

    // 增加商品浏览量
    @PutMapping("/view")
    public JsonResult<Void> view(@RequestBody Map<String, Object> data) {
        try {
            // 解析请求体参数
            String goodId = (String) data.get("goodId");
            goodService.increaseView(goodId);
            return new JsonResult<>(ResultEnum.OK);
        } catch (Exception e) {
            log.error(e.getClass().getName(), e);
            return handleException(e);
        }
    }

}
