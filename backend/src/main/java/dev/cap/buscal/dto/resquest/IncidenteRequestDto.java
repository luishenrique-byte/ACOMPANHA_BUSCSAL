package dev.cap.buscal.dto.resquest;

import dev.cap.buscal.database.models.ENUM.TipoIncidente;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record IncidenteRequestDto(

        @NotNull(message = "O tipo do Incidente é obrigatório.")
        TipoIncidente tipo,

        @Size(max = 300, message = "A descrição não deve execeder 400 caracteres.")
        String descricao,

        @NotNull(message = "O ID da viagem é obrigatório.")
        @Positive(message = "O ID da viagem deve ser um número válido.")
        Long idViagem
) {}
