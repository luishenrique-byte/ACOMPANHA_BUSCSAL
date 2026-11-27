package dev.cap.buscal.config;

import dev.cap.buscal.database.models.ENUM.StatusOnibus;
import dev.cap.buscal.database.models.ENUM.UserPerfil;
import dev.cap.buscal.dto.response.RotaResponseDto;
import dev.cap.buscal.dto.resquest.PontoParadaRequestDto;
import dev.cap.buscal.dto.resquest.RotaRequestDto;
import dev.cap.buscal.dto.resquest.UsuarioRequestDto;
import dev.cap.buscal.dto.resquest.VeiculoRequestDto;
import dev.cap.buscal.service.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class IniciarBanco implements CommandLineRunner {

    private final PerfilService perfilService;
    private final UsuarioService usuarioService;
    private final RotaService rotaService;
    private final PontoParadaService pontoParadaService;
    private final VeiculoService veiculoService;

    @Value("${app.bootstrap.admin.nome}")
    private String nomeAdmin;

    @Value("${app.bootstrap.admin.email}")
    private String emailAdmin;

    @Value("${app.bootstrap.admin.senha}")
    private String senhaAdmin;

    @Override
    public void run(String... args) throws Exception {

        criarPerfis();
        criarAdmin();
        criarMotoristaDemo();
        inicializarRotaEPontos();
        criarVeiculo();
    }

    private void criarPerfis() {
        if(!perfilService.existePerfil(UserPerfil.ALUNO)) perfilService.criar(UserPerfil.ALUNO);
        if(!perfilService.existePerfil(UserPerfil.MOTORISTA)) perfilService.criar(UserPerfil.MOTORISTA);
        if(!perfilService.existePerfil(UserPerfil.ADMIN)) perfilService.criar(UserPerfil.ADMIN);
    }

    private void criarAdmin(){
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

    private void criarMotoristaDemo(){
        String emailMotorista = "motorista@busucsal.com";
        if (usuarioService.existePorEmail(emailMotorista)) return;

        Integer idPerfil = perfilService.buscarPorPerfil(UserPerfil.MOTORISTA).id();
        usuarioService.criarUsuario(new UsuarioRequestDto("Motorista Demo", emailMotorista, "motorista123", null, idPerfil));
        log.info("Motorista demo criado: {}", emailMotorista);
    }


    private void inicializarRotaEPontos(){
        if (!rotaService.listarTodos().isEmpty()) return;

        RotaResponseDto rota = rotaService.cadastrar(
                new RotaRequestDto("UCSAL - METRÔ", "IDA DA UCSAL PARA O METRÔ", Boolean.TRUE)
        );

        List<PontoParadaRequestDto> pontos = List.of(
                new PontoParadaRequestDto("UCSAL", -12.947397, -38.412998, 1, rota.id()),
                new PontoParadaRequestDto("METRÔ - SENTIDO ACESSO NORTE", -12.944884, -38.421652, 2, rota.id()),
                new PontoParadaRequestDto("METRÔ - SENTIDO AEROPORTO", -12.944120, -38.419801, 3, rota.id())
        );

        pontos.forEach(pontoParadaService::cadastrar);
        log.info("Rota inicial e {} pontos de parada cadastrados.", pontos.size());
    }

    private void criarVeiculo(){
        if (!veiculoService.listarTodos().stream()
                .filter(v -> v.status().equals(StatusOnibus.ATIVO))
                .toList().isEmpty()) return;
        veiculoService.cadastrar(
                new VeiculoRequestDto(
                        "BUS1",
                        "BDE5H87",
                        StatusOnibus.ATIVO
                )
        );
        log.info("Veículo inicial BUS1 cadastrado.");
    }
}
