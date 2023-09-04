package com.trade.sh.components;

import com.trade.sh.entities.ex.ShSystemException;
import com.trade.sh.utils.ResultEnum;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.CompressionCodecs;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.Date;

@Data
@Component
@ConfigurationProperties(prefix = "jwt.token")
public class JwtHelper {
    private Integer expiration; // 有效时间，单位小时
    private String key; // 当前程序签名密钥

    // 生成token字符串
    public String generateToken(Long userId) {
        Date now = new Date();
        Date expiryDate = new Date(System.currentTimeMillis() + expiration * 60 * 60 * 1000);

        return Jwts.builder()
                .setSubject("TS-USER")
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .claim("userId", userId)
                .signWith(SignatureAlgorithm.HS512, key)
                .compressWith(CompressionCodecs.GZIP)
                .compact();
    }

    public Long getUserIdFromToken(String token) {
        if (token == null || token.isEmpty()) {
            return null;
        }
        Claims claims = Jwts.parser()
                .setSigningKey(key)
                .parseClaimsJws(token)
                .getBody();

        return (Long) claims.get("userId");
    }

    public boolean validateToken(String token) {
        try {
            boolean ok = Jwts.parser()
                    .setSigningKey(key)
                    .parseClaimsJws(token)
                    .getBody()
                    .getExpiration()
                    .before(new Date());
            // token有效且没有过期，则返回true
            // 有效且过期，返回false
            return !ok;
        } catch (Exception e) {
            // 解析过程中出错，token无效，返回false
            throw new ShSystemException(ResultEnum.TOKEN_ERR);
        }
    }

}
