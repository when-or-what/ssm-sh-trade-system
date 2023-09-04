package com.trade.sh.utils;

import com.trade.sh.entities.ex.ShSystemException;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.io.File;
import java.util.Date;

// 发送邮件的工具类
@Component
public class EmailUtil {
    // 注入邮件工具类
    @Autowired
    private JavaMailSender javaMailSender;

    // 邮件的发送方，取配置文件中的设置值
    @Value("${spring.mail.username}")
    private String sendMailer;

    /**
     * 简单文本邮件
     *
     * @param mailRequest 邮件请求实体
     */
    public void sendSimpleMail(Email mailRequest) {
        try {

            SimpleMailMessage message = new SimpleMailMessage();
            // 邮件发件人
            message.setFrom(sendMailer);
            // 邮件收件人 1或多个
            message.setTo(mailRequest.getReceiver().split(","));
            // 邮件主题
            message.setSubject(mailRequest.getEmailTheme());
            // 邮件内容
            message.setText(mailRequest.getEmailText());
            // 邮件发送时间
            message.setSentDate(new Date());
            // 发邮件
            javaMailSender.send(message);
        } catch (Exception e) {
            throw new ShSystemException(ResultEnum.EMAIL);
        }
    }

    /**
     * Html格式邮件,可带附件
     *
     * @param mailRequest 邮件请求实体
     */
    public void sendHtmlMail(Email mailRequest) throws MessagingException {
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        // 邮件发件人
        helper.setFrom(sendMailer);
        // 邮件收件人 1或多个
        helper.setTo(mailRequest.getReceiver().split(","));
        // 邮件主题
        helper.setSubject(mailRequest.getEmailTheme());
        // 邮件内容
        helper.setText(mailRequest.getEmailText(), true);
        // 邮件发送时间
        helper.setSentDate(new Date());

        String filePath = mailRequest.getFilePath();
        if (StringUtils.hasText(filePath)) {
            FileSystemResource file = new FileSystemResource(new File(filePath));
            String fileName = filePath.substring(filePath.lastIndexOf(File.separator));
            helper.addAttachment(fileName, file);
        }
        javaMailSender.send(message);
    }

}
