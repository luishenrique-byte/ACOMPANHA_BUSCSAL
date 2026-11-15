package dev.cap.buscal.mapper;

import dev.cap.buscal.database.models.RotaEntity;
import dev.cap.buscal.dto.response.RotaResponseDto;
import dev.cap.buscal.dto.resquest.RotaRequestDto;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class RotaMapper {

    public RotaResponseDto toDTO(RotaEntity entity) {
        if (entity == null) return null;

        return new RotaResponseDto(
                entity.getId(),
                entity.getNome(),
                entity.getDescricao(),
                entity.getAtiva()
        );
    }

    public RotaEntity toEntity(RotaRequestDto request) {
        if(request == null) return null;

        return RotaEntity.builder()
                .nome(request.nome())
                .descricao(request.descricao())
                .build();
    }

    public List<RotaResponseDto> toListDTO(List<RotaEntity> list){
        return list.stream()
                .map(i -> toDTO(i))
                .toList();
    }
}