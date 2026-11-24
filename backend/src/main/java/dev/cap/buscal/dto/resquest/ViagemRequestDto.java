package dev.cap.buscal.dto.resquest;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record ViagemRequestDto(

        @NotNull(message = "O ID do motorista é obrigatório.")
        @Positive(message = "O ID do motorista deve ser um número válido.")
        Long idMotorista,

        @NotNull(message = "O ID do veículo é obrigatório.")
        @Positive(message = "O ID do veículo deve ser um número válido.")
        Long idVeiculo,

        @NotNull(message = "O ID da rota é obrigatório.")
        @Positive(message = "O ID da rota deve ser um número válido.")
        Long idRota
) {}
