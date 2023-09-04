package com.trade.sh.utils;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Email implements Serializable {
    // 接收人
    private String receiver;
    // 邮件主题
    private String emailTheme;
    // 邮件内容
    private String emailText;
    // 附件路径
    private String filePath;
}