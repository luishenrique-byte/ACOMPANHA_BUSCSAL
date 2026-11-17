package dev.cap.buscal.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class TokenProvider {

    //Como diferenciar o token do motorista e do aluno, para q o motorista tenha umtmepo muito maior

    @Value("${spring.jwt.expiration}")
    private long expiration;

    @Value("${spring.jwt.key}")
    private String key;

    // ====================
    //      GERAR TOKEN
    // ====================
    public String gerarToken(Authentication authentication){
        UserDetails user = (UserDetails) authentication.getPrincipal();
        return contruirToken(user.getUsername());
    }

    private String contruirToken(String username){
        Date now = new Date();
        Date expiration =  new Date(now.getTime() + this.expiration);
        return Jwts.builder()
                .subject(username)

                .issuedAt(now)
                .expiration(expiration)
                .signWith(getSignKey())
                .compact();
    }

    private SecretKey getSignKey(){
        return Keys.hmacShaKeyFor(key.getBytes());
    }

    // ====================
    //    VALIDAR TOKEN
    // ====================

    protected boolean ehTokenValido(String token){
        try {
            getClaims(token);
            return true;
        } catch (Exception ex) {
            return false;
        }
    }

    // ====================
    //   EXTRAIR DO TOKEN
    // ====================


    private Claims getClaims(String token){
        //Validar Assinatura
        //Validar expiration
        return Jwts.parser()
                .verifyWith(getSignKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public String getUsername(String token){
        return getClaims(token).getSubject();
    }

    public String getUsernameFromToken(String token) {
        return getUsername(token);
    }
}
