package dev.cap.buscal.controller;

import dev.cap.buscal.dto.response.UsuarioResponseDto;
import dev.cap.buscal.dto.resquest.UsuarioRequestDto;
import dev.cap.buscal.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/usuario")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UsuarioResponseDto criar(@Valid @RequestBody UsuarioRequestDto request){
        return usuarioService.criarUsuario(request);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void atualizar(@PathVariable Long id,
                          @Valid @RequestBody UsuarioRequestDto request){
        usuarioService.atualizar(id, request);
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public UsuarioResponseDto buscarPorId(@PathVariable Long id){
        return usuarioService.buscarPorId(id);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<UsuarioResponseDto> listarTodos(){
        return usuarioService.listarTodos();
    }
}
