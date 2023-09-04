package com.trade.sh.utils;

// import java.util.Date;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;

public class DateTimeUtil {
    // 获取当前时间的Timestamp
    public static Timestamp nowTimestamp() {
        // 获取当前Unix时间戳
        return new Timestamp(System.currentTimeMillis());
    }

    // 获取当前时间距离1970年的秒数
    public static Long nowTime() {
        return System.currentTimeMillis() / 1000;
    }

    // 将timestamp转化为字符串
    public static String timestampToString(Timestamp timestamp) {
        // 将 Timestamp 转换为字符串
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        return dateFormat.format(timestamp);
    }
}
