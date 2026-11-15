package dev.cap.buscal.dto.resquest;

import jakarta.validation.constraints.NotBlank;

public record RotaRequestDto(
        @NotBlank(message = "O nome da rota é obrigatório.") String nome,
        String descricao,
        Boolean ativa
){}
