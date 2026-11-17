package dev.cap.buscal.controller;

import dev.cap.buscal.dto.response.TokenResponseDto;
import dev.cap.buscal.dto.resquest.LoginRequestDto;
import dev.cap.buscal.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @ResponseStatus(HttpStatus.OK)
    public TokenResponseDto login(@Valid @RequestBody LoginRequestDto request){
        return authService.login(request);
    }
}
