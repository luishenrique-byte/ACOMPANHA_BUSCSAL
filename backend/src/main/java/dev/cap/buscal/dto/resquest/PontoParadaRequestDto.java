package dev.cap.buscal.dto.resquest;

import jakarta.validation.constraints.*;

public record PontoParadaRequestDto(

        @NotBlank(message = "O nome do ponto de parada é obrigatório.")
        @Size(max = 100, message = "O nome não pode exceder 100 caracteres.")
        String nome,

        @NotNull(message = "A latitude é obrigatória.")
        @Min(value = -90, message = "A latitude deve ser maior ou igual a -90.")
        @Max(value = 90, message = "A latitude deve ser menor ou igual a 90.")
        Double latitude,

        @NotNull(message = "A longitude é obrigatória.")
        @Min(value = -180, message = "A longitude deve ser maior ou igual a -180.")
        @Max(value = 180, message = "A longitude deve ser menor ou igual a 180.")
        Double longitude,

        @NotNull(message = "A ordem do ponto na rota é obrigatória.")
        @Positive(message = "A ordem deve ser um número inteiro positivo.")
        Integer ordem,

        @NotNull(message = "O ID da rota é obrigatório.")
        @Positive(message = "O ID da rota deve ser um número válido.")
        Long idRota
) {}
