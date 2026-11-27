package dev.cap.buscal.dto.response;

import dev.cap.buscal.database.models.ENUM.StatusViagem;

import java.time.LocalDateTime;

public record ViagemResponseDto(
        Long id,
        LocalDateTime dataHoraInicio,
        LocalDateTime dataHoraFinal,
        StatusViagem status,
        UsuarioResponseDto motorista,
        VeiculoResponseDto veiculo,
        RotaResponseDto rota
) {}