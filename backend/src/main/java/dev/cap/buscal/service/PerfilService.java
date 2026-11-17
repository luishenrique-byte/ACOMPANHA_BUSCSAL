package dev.cap.buscal.service;

import dev.cap.buscal.database.models.ENUM.UserPerfil;
import dev.cap.buscal.database.models.PerfilEntity;
import dev.cap.buscal.database.repository.IPerfilRepository;
import dev.cap.buscal.dto.response.PerfilResponseDto;
import dev.cap.buscal.dto.resquest.PerfilRequestDto;
import dev.cap.buscal.exception.ConflitoDeDadosException;
import dev.cap.buscal.exception.RecursoNaoEncontradoException;
import dev.cap.buscal.mapper.PerfilMapper;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PerfilService {

    private final IPerfilRepository perfilRepository;

    private final PerfilMapper perfilMapper;

    @Transactional
    public void criar(UserPerfil perfil){
        if (perfilRepository.existsByPerfil(perfil)){
            throw new ConflitoDeDadosException("O perfil " + perfil + " já existe.");
        }
        PerfilEntity entity = perfilMapper.toEntity(new PerfilRequestDto(perfil));
        perfilRepository.save(entity);
    }

    @Transactional(readOnly = true)
    public List<PerfilResponseDto> listarTodos(){
        List<PerfilEntity> perfilEntityList = perfilRepository.findAll();
        return perfilMapper.toListDTO(perfilEntityList);
    }

    @Transactional(readOnly = true)
    public PerfilResponseDto buscarPorId(Integer id){
        PerfilEntity entity = buscarEntityPorId(id);
        return perfilMapper.toDTO(entity);
    }

    @Transactional(readOnly = true)
    public PerfilResponseDto buscarPorPerfil(UserPerfil perfil){
        return perfilMapper.toDTO(
                perfilRepository.findByPerfil(perfil)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Perfil não encontrado."))
        );
    }

    @Transactional(readOnly = true)
    public boolean existePerfil(UserPerfil perfil){
        return perfilRepository.existsByPerfil(perfil);
    }

    @Transactional(readOnly = true)
    protected PerfilEntity buscarEntityPorId(Integer id){
        return  perfilRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Perfil não encontrado."));
    }
}
