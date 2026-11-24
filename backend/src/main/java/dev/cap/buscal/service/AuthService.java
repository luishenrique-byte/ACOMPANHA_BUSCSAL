package dev.cap.buscal.service;

import dev.cap.buscal.config.TokenProvider;
import dev.cap.buscal.dto.response.TokenResponseDto;
import dev.cap.buscal.dto.resquest.LoginRequestDto;
import dev.cap.buscal.exception.CredenciaisInvalidasException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final TokenProvider tokenProvider;

    @Value("${spring.jwt.expiration}")
    private Long expiration;
    public TokenResponseDto login(LoginRequestDto dto){

        try{

            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(dto.email(), dto.senha()));

            String token = tokenProvider.gerarToken(authentication);

            return new TokenResponseDto(token, expiration);
        } catch (BadCredentialsException e){
            throw new CredenciaisInvalidasException("E-mail ou senha inválidas;");
        } catch (Exception e){
            throw e;
        }

    }
}
