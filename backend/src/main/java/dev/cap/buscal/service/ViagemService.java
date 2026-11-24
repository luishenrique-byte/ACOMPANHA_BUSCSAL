package dev.cap.buscal.service;

import dev.cap.buscal.database.models.ENUM.StatusViagem;
import dev.cap.buscal.database.models.RotaEntity;
import dev.cap.buscal.database.models.UsuarioEntity;
import dev.cap.buscal.database.models.VeiculoEntity;
import dev.cap.buscal.database.models.ViagemEntity;
import dev.cap.buscal.database.repository.IViagemRepository;
import dev.cap.buscal.dto.response.ViagemResponseDto;
import dev.cap.buscal.dto.resquest.ViagemRequestDto;
import dev.cap.buscal.exception.RecursoNaoEncontradoException;
import dev.cap.buscal.mapper.ViagemMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ViagemService {

    private final IViagemRepository viagemRepository;

    private final UsuarioService usuarioService;

    private final VeiculoService veiculoService;

    private final RotaService rotaService;

    private final ViagemMapper viagemMapper;

    @Transactional
    public ViagemResponseDto iniciarViagem(ViagemRequestDto request){
        UsuarioEntity motorista = usuarioService.buscarEntityPorId(request.idMotorista());
        VeiculoEntity veiculo = veiculoService.buscarEntityPorId(request.idVeiculo());
        RotaEntity rota = rotaService.buscarEntityPorId(request.idRota());

        ViagemEntity viagem = viagemMapper.toEntity(request,motorista,veiculo,rota);

        viagem.setDataHoraInicio(LocalDateTime.now());
        viagem.setStatus(StatusViagem.EM_ROTA);

        return viagemMapper.toDTO(viagemRepository.save(viagem));
    }

    @Transactional
    public void finalizarViagem(Long id){

        ViagemEntity viagem = buscarEntityPorId(id);

        viagem.setDataHoraFinal(LocalDateTime.now());
        viagem.setStatus(StatusViagem.FINALIZADA);

        viagemRepository.save(viagem);
    }

    @Transactional
    public void pausarViagem(Long id){
        ViagemEntity viagem = buscarEntityPorId(id);

        viagem.setStatus(StatusViagem.PAUSADA);

        viagemRepository.save(viagem);
    }

    @Transactional(readOnly = true)
    public List<ViagemResponseDto> listarAtivas(){
        List<ViagemEntity> list = viagemRepository.findAllByStatus(StatusViagem.EM_ROTA);
        return viagemMapper.toListDTO(list);
    }

    @Transactional(readOnly = true)
    public ViagemResponseDto buscarPorId(Long id){
        return viagemMapper.toDTO(buscarEntityPorId(id));
    }

    @Transactional(readOnly = true)
    protected ViagemEntity buscarEntityPorId(Long id){
        return viagemRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Viagem não existe."));
    }
}
