package dev.cap.buscal.dto.resquest;

import jakarta.validation.constraints.NotBlank;

public record LoginRequestDto(
        @NotBlank(message = "O email é obrigatório.")
        String email,

        @NotBlank(message = "A senha é obrigatório.")
        String senha
) {}
