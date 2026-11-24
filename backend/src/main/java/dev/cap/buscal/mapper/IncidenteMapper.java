package dev.cap.buscal.mapper;

import dev.cap.buscal.database.models.IncidenteEntity;
import dev.cap.buscal.database.models.ViagemEntity;
import dev.cap.buscal.dto.response.IncidenteResponseDto;
import dev.cap.buscal.dto.resquest.IncidenteRequestDto;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class IncidenteMapper {

    public IncidenteResponseDto toDTO(IncidenteEntity entity){
        if (entity == null) return null;

        return new IncidenteResponseDto(
                entity.getId(),
                entity.getTipo(),
                entity.getDescricao(),
                entity.getDataHora(),
                entity.getViagem() != null ? entity.getViagem().getId() : null
        );
    }

    public IncidenteEntity toEntity(IncidenteRequestDto request,
                                    ViagemEntity viagem){
        if (request == null || viagem == null) return null;

        return IncidenteEntity.builder()
                .tipo(request.tipo())
                .descricao(request.descricao())
                .viagem(viagem)
                .build();
    }

    public List<IncidenteResponseDto> toListDTO(List<IncidenteEntity> list){
        return list.stream()
                .map(i -> toDTO(i))
                .toList();
    }
}
