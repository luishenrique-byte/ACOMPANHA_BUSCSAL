package dev.cap.buscal.config;

import dev.cap.buscal.database.models.ENUM.UserPerfil;
import dev.cap.buscal.dto.resquest.UsuarioRequestDto;
import dev.cap.buscal.service.PerfilService;
import dev.cap.buscal.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class IniciarBanco implements CommandLineRunner {

    private final PerfilService perfilService;

    private final UsuarioService usuarioService;

    @Value("${app.bootstrap.admin.nome}")
    private String nomeAdmin;

    @Value("${app.bootstrap.admin.email}")
    private String emailAdmin;

    @Value("${app.bootstrap.admin.senha}")
    private String senhaAdmin;

    @Override
    public void run(String... args) throws Exception {

        if(!perfilService.existePerfil(UserPerfil.ALUNO)) perfilService.criar(UserPerfil.ALUNO);
        if(!perfilService.existePerfil(UserPerfil.MOTORISTA)) perfilService.criar(UserPerfil.MOTORISTA);
        if(!perfilService.existePerfil(UserPerfil.ADMIN)) perfilService.criar(UserPerfil.ADMIN);

        if (usuarioService.existePorEmail(emailAdmin)) return;

        Integer idPerfil = perfilService.buscarPorPerfil(UserPerfil.ADMIN).id();

        if (senhaAdmin == null || senhaAdmin.isBlank()){
            log.warn("BOOTSTRAP_ADMIN_PASSWORD não definida: Admin inicial ({}) não foi criado.", emailAdmin);
            return;
        }

        usuarioService.criarUsuario(
                new UsuarioRequestDto(
                        nomeAdmin,
                        emailAdmin,
                        senhaAdmin,
                        null,
                        idPerfil
                )
        );

        log.info("Admin inicial criado: {}", emailAdmin);
    }
}
