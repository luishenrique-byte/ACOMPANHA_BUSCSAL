package dev.cap.buscal.mapper;

import dev.cap.buscal.database.models.PerfilEntity;
import dev.cap.buscal.dto.response.PerfilResponseDto;
import dev.cap.buscal.dto.resquest.PerfilRequestDto;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class PerfilMapper {

    public PerfilResponseDto toDTO(PerfilEntity entity) {
        if (entity == null) return null;

        return new PerfilResponseDto(
                entity.getId(),
                entity.getPerfil()
        );
    }

    public PerfilEntity toEntity(PerfilRequestDto request) {
        if (request == null) return null;

        return PerfilEntity.builder()
                .perfil(request.perfil())
                .build();
    }

    public List<PerfilResponseDto> toListDTO(List<PerfilEntity> list){
        return list.stream()
                .map(this::toDTO)
                .toList();
    }
}
