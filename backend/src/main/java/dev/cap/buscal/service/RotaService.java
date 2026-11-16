package dev.cap.buscal.service;

import dev.cap.buscal.database.models.RotaEntity;
import dev.cap.buscal.database.repository.IRotaRepository;
import dev.cap.buscal.dto.response.RotaResponseDto;
import dev.cap.buscal.dto.resquest.RotaRequestDto;
import dev.cap.buscal.exception.RecursoNaoEncontradoException;
import dev.cap.buscal.exception.RegraDeNegocioException;
import dev.cap.buscal.mapper.RotaMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RotaService {

    private final IRotaRepository rotaRepository;

    private final RotaMapper rotaMapper;

    @Transactional
    public RotaResponseDto cadastrar(RotaRequestDto request){

        RotaEntity entity = rotaMapper.toEntity(request);

        entity.setAtiva(true);

        return rotaMapper.toDTO(rotaRepository.save(entity));
    }

    @Transactional(readOnly = true)
    public RotaResponseDto buscarPorId(Long id){
        return rotaMapper.toDTO(buscarEntityPorId(id));
    }

    @Transactional(readOnly = true)
    public List<RotaResponseDto> listarTodos(){
        List<RotaEntity> list = rotaRepository.findAll();
        return rotaMapper.toListDTO(list);
    }

    @Transactional(readOnly = true)
    public List<RotaResponseDto> listarAtivas(){
        List<RotaEntity> listAtivas = rotaRepository.findAllByAtivaTrue();
        return rotaMapper.toListDTO(listAtivas);
    }

    @Transactional
    public void ativar(Long id){
        RotaEntity entity = buscarEntityPorId(id);

        if (Boolean.TRUE.equals(entity.getAtiva())){
            throw new RegraDeNegocioException("A rota já encontra-se ativa.");
        }

        entity.setAtiva(Boolean.TRUE);

        rotaRepository.save(entity);
    }

    @Transactional
    public void desativar(Long id){
        RotaEntity entity = buscarEntityPorId(id);

        if (Boolean.FALSE.equals(entity.getAtiva())){
            throw new RegraDeNegocioException("A rota já encontra-se inativa.");
        }

        entity.setAtiva(Boolean.FALSE);

        rotaRepository.save(entity);
    }

    @Transactional(readOnly = true)
    protected RotaEntity buscarEntityPorId(Long id){
        return rotaRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Rota não existe."));
    }
}
