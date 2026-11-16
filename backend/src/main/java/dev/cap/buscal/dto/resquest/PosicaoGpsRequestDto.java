package dev.cap.buscal.dto.resquest;

import jakarta.validation.constraints.*;

public record PosicaoGpsRequestDto(

        @NotNull(message = "A latitude é obrigatória.")
        @Max(value = 90, message = "A latitude deve ser menor ou igual a 90.")
        @Min(value = -90, message = "A latitude deve ser maior ou igual a -90.")
        Double latitude,

        @NotNull(message = "A longitude é obrigatória.")
        @Max(value = 180, message = "A longitude deve ser menor ou igual a 180.")
        @Min(value = -180, message = "A longitude deve ser maior ou igual a -180.")
        Double longitude,

        @PositiveOrZero(message = "A velocidade não pode ser negativa.")
        @NotNull(message = "A velocidade é obrigatória.")
        Double velocidade,

        @PositiveOrZero(message = "A precisão não pode ser negativa.")
        @NotNull(message = "A precisão é obrigatória.")
        Double precisao,

        @NotNull(message = "O ID da viagem é obrigatório.")
        @Positive(message = "O ID da viagem deve ser um número válido.")
        Long idViagem
) {}