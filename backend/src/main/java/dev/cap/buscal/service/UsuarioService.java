package dev.cap.buscal.service;

import dev.cap.buscal.database.models.ENUM.UserPerfil;
import dev.cap.buscal.database.models.PerfilEntity;
import dev.cap.buscal.database.models.UsuarioEntity;
import dev.cap.buscal.database.repository.IUsuarioRepository;
import dev.cap.buscal.dto.response.UsuarioResponseDto;
import dev.cap.buscal.dto.resquest.UsuarioRequestDto;
import dev.cap.buscal.exception.ConflitoDeDadosException;
import dev.cap.buscal.exception.RecursoNaoEncontradoException;
import dev.cap.buscal.mapper.UsuarioMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final IUsuarioRepository usuarioRepository;

    private final UsuarioMapper usuarioMapper;

    private final PerfilService perfilService;

    private final PasswordEncoder encoder;

    @Transactional
    public UsuarioResponseDto criarUsuario(@Valid UsuarioRequestDto request){

        if (usuarioRepository.existsByEmail(request.email())){
            throw new ConflitoDeDadosException("Este e-mail já está em uso.");
        }

        PerfilEntity perfil = perfilService.buscarEntityPorId(request.idPerfil());

        if(perfil.getPerfil() == UserPerfil.ALUNO && usuarioRepository.existsByMatricula(request.matricula())){
            throw new ConflitoDeDadosException("Esta matrícula já está vinculada a outro aluno.");
        }

        UsuarioEntity usuario = usuarioMapper.toEntity(request, perfil);

        usuario.setSenha(encoder.encode(request.senha()));

        return usuarioMapper.toDTO(usuarioRepository.save(usuario));
    }

    @Transactional(readOnly = true)
    public UsuarioResponseDto buscarPorId(Long id){
        UsuarioEntity entity = buscarEntityPorId(id);

        return usuarioMapper.toDTO(entity);
    }

    @Transactional(readOnly = true)
    protected UsuarioEntity buscarEntityPorId(Long id){
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuario não existe."));
    }

    @Transactional(readOnly = true)
    public List<UsuarioResponseDto> listarTodos(){
        List<UsuarioEntity> list = usuarioRepository.findAll();
        return usuarioMapper.toListDTO(list);
    }

    @Transactional
    public void atualizar(Long id, UsuarioRequestDto request){

        UsuarioEntity usuario = buscarEntityPorId(id);

        if (!usuario.getEmail().equals(request.email()) && usuarioRepository.existsByEmail(request.email())){
            throw new ConflitoDeDadosException("O novo e-mail informado já pertence a outro usuário.");
        }

        PerfilEntity perfil = perfilService.buscarEntityPorId(request.idPerfil());


        usuario.setNome(request.nome());
        usuario.setEmail(request.email());
        usuario.setMatricula(request.matricula());
        usuario.setPerfil(perfil);

        usuarioRepository.save(usuario);
    }

    @Transactional(readOnly = true)
    public boolean existePorEmail(String email){
        return usuarioRepository.existsByEmail(email);
    }
}
