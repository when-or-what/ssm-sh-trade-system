package com.trade.sh.utils;

import lombok.extern.slf4j.Slf4j;
import org.springframework.util.ResourceUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Slf4j
public class ImageUtil {
    /**
     * 存储文件
     *
     * @param file
     * @param child
     * @return
     * @throws IOException
     */
    public static String saveImage(MultipartFile file, String child) throws IOException {
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        String fileExtension = getFileExtension(fileName);
        String newFileName = UUID.randomUUID() + fileExtension;

        File path = new File(ResourceUtils.getURL("classpath*:").getPath());
        if (!path.exists()) {
            path = new File("");
        }
        File f = new File(path.getAbsolutePath(), child);
        if (!f.exists()) {
            if (!f.mkdirs()) {
                log.error("创建文件夹失败");
                return null;
            }
        }
        String p = f + "//";
        // 存储新文件
        File dest = new File(p + newFileName);
        file.transferTo(dest);
        // 返回文件名
        return newFileName;
    }

    /**
     * 获取存储静态资源文件夹里面的图片的文件名数组
     *
     * @param child
     * @return
     * @throws FileNotFoundException
     */
    public static List<String> getFileNames(String child) throws FileNotFoundException {
        File path = new File(ResourceUtils.getURL("classpath*:").getPath());
        if (!path.exists()) {
            path = new File("");
        }
        File f = new File(path.getAbsolutePath(), child);
        if (!f.exists()) {
            log.error("getAbsolutePath: 文件路径不存在");
            return null;
        }
        return Arrays.asList(f.list());
    }

    /**
     * 删除图片
     *
     * @param filepath
     * @param child
     * @return
     */
    public static Boolean deleteImage(String filepath, String child) throws FileNotFoundException {
        String filename = getFileNameFromPath(filepath);
        File path = new File(ResourceUtils.getURL("classpath*:").getPath());
        if (!path.exists()) {
            path = new File("");
        }
        File f = new File(path.getAbsolutePath(), child);
        if (!f.exists()) {
            log.error("getAbsolutePath: 文件路径不存在");
            return null;
        }
        String p = f + "//";
        File dest = new File(p + filename);
        return dest.delete();
    }

    /**
     * 获取文件后缀名
     *
     * @param fileName
     * @return
     */
    private static String getFileExtension(String fileName) {
        int dotIndex = fileName.lastIndexOf('.');
        if (dotIndex >= 0 && dotIndex < fileName.length() - 1) {
            return "." + fileName.substring(dotIndex + 1);
        }
        return "";
    }

    /**
     * 从一个文件路径中获取文件名
     *
     * @param path
     * @return
     */
    private static String getFileNameFromPath(String path) {
        if (path == null) return null;
        int i = path.length() - 1;
        while (i >= 0) {
            if (path.charAt(i) == '/' || path.charAt(i) == '\\') {
                break;
            }
            i--;
        }
        return path.substring(i + 1);
    }
}
