package com.trade.sh.utils;

import lombok.extern.slf4j.Slf4j;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * Sha256 和 Sha512 加密类
 */
@Slf4j
public class ShaUtil {
    /**
     * 传入文本内容，返回 SHA-256 串
     *
     * @param strText
     * @return 64个字符长度的密文
     */
    public static String SHA256(final String strText) {
        return SHA(strText, "SHA-256");
    }

    /**
     * 传入文本内容，返回 SHA-512 串
     *
     * @param strText
     * @return 128个字符长度的密文
     */
    public static String SHA512(final String strText) {
        return SHA(strText, "SHA-512");
    }

    /**
     * 字符串 SHA 加密
     *
     * @param strSourceText
     * @return 密文
     */
    private static String SHA(final String strText, final String strType) {
        // 返回值
        String strResult = null;
        try {
            // 字符串是否有效
            if (strText != null && !strText.isEmpty()) {
                // 创建加密对象 并传入加密类型
                MessageDigest messageDigest = MessageDigest.getInstance(strType);
                // 传入要加密的字符串
                messageDigest.update(strText.getBytes());
                // 得到 byte 类型结果
                byte[] byteBuffer = messageDigest.digest();

                // 将 byte 转换为 string
                StringBuffer strHexString = new StringBuffer();
                // 遍历 byte buffer
                for (byte b : byteBuffer) {
                    String hex = Integer.toHexString(0xff & b);
                    if (hex.length() == 1) {
                        strHexString.append('0');
                    }
                    strHexString.append(hex);
                }
                // 得到结果
                strResult = strHexString.toString();
            }
        } catch (NoSuchAlgorithmException e) {
            log.error(e.getClass().getName(), e);
        }
        return strResult;
    }
}