package dev.cap.buscal.mapper;

import dev.cap.buscal.database.models.PerfilEntity;
import dev.cap.buscal.database.models.UsuarioEntity;
import dev.cap.buscal.dto.response.PerfilResponseDto;
import dev.cap.buscal.dto.response.UsuarioResponseDto;
import dev.cap.buscal.dto.resquest.UsuarioRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class UsuarioMapper {

    private final PerfilMapper perfilMapper;

    public UsuarioResponseDto toDTO(UsuarioEntity entity) {
        if (entity == null) return null;

        return new UsuarioResponseDto(
                entity.getId(),
                entity.getNome(),
                entity.getEmail(),
                entity.getMatricula(),
                perfilMapper.toDTO(entity.getPerfil())
        );
    }

    public UsuarioEntity toEntity(UsuarioRequestDto request, PerfilEntity perfil) {
        if (request == null || perfil == null) return null;

        return UsuarioEntity.builder()
                .nome(request.nome())
                .email(request.email())
                .senha(request.senha())
                .matricula(request.matricula())
                .perfil(perfil)
                .build();
    }

    public List<UsuarioResponseDto> toListDTO(List<UsuarioEntity> list){
        return list.stream()
                .map(i -> toDTO(i))
                .toList();
    }
}
