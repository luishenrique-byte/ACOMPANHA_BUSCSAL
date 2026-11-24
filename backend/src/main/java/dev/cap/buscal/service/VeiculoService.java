package dev.cap.buscal.service;

import dev.cap.buscal.database.models.ENUM.StatusOnibus;
import dev.cap.buscal.database.models.VeiculoEntity;
import dev.cap.buscal.database.repository.IVeiculoRepository;
import dev.cap.buscal.dto.response.VeiculoResponseDto;
import dev.cap.buscal.dto.resquest.VeiculoRequestDto;
import dev.cap.buscal.exception.RecursoNaoEncontradoException;
import dev.cap.buscal.mapper.VeiculoMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VeiculoService {

    private final IVeiculoRepository veiculoRepository;

    private final VeiculoMapper veiculoMapper;

    @Transactional
    public VeiculoResponseDto cadastrar(VeiculoRequestDto request){
        VeiculoEntity entity = veiculoMapper.toEntity(request);

        return veiculoMapper.toDTO(veiculoRepository.save(entity));
    }

    @Transactional(readOnly = true)
    public VeiculoResponseDto buscarPorId(Long id){
        return veiculoMapper.toDTO(buscarEntityPorId(id));
    }

    @Transactional(readOnly = true)
    protected VeiculoEntity buscarEntityPorId(Long id){
        return veiculoRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Veiculo não existe."));
    }

    @Transactional(readOnly = true)
    public List<VeiculoResponseDto> listarTodos(){
        List<VeiculoEntity> list = veiculoRepository.findAll();
        return veiculoMapper.toListDTO(list);
    }

    @Transactional
    public void atualizar(Long id, VeiculoRequestDto request){

        VeiculoEntity entity = buscarEntityPorId(id);

        entity.setPrefixo(request.prefixo());
        entity.setPlaca(request.placa());
        entity.setStatus(request.status());

        veiculoRepository.save(entity);
    }

    @Transactional
    public void alterarStatus(Long id, StatusOnibus status){

        VeiculoEntity entity = buscarEntityPorId(id);

        entity.setStatus(status);

        veiculoRepository.save(entity);
    }
}