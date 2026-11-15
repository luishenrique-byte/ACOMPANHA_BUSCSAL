package dev.cap.buscal.dto.resquest;

import jakarta.validation.constraints.NotBlank;

public record RotaRequestDto(
        @NotBlank String nome,
        String descricao,
        Boolean ativa
){}
