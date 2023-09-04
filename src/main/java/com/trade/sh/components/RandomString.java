package com.trade.sh.components;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * 生成验证码和新密码
 */
@Component
public class RandomString {
    // 定义字符源
    @Value("${trading-sys.charset.lower}")
    private String LOWER_CHARS;
    @Value("${trading-sys.charset.upper}")
    private String UPPER_CHARS;
    @Value("${trading-sys.charset.digits}")
    private String DIGITS;

    // 返回验证码
    public String getVercode(Integer length) {
        String s = LOWER_CHARS + UPPER_CHARS + DIGITS;
        StringBuilder vercode = new StringBuilder();
        int index = 0;
        for (int i = 0; i < length; i++) {
            index = ((int) (Math.random() * 10000)) % s.length();
            vercode.append(s.charAt(index));
        }
        return vercode.toString();
    }
}
