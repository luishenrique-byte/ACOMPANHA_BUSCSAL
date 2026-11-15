package dev.cap.buscal.dto.response;

public record RotaResponseDto(
        Long id,
        String nome,
        String descricao,
        Boolean ativa
) {}