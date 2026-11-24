package dev.cap.buscal.controller;

import dev.cap.buscal.dto.response.PerfilResponseDto;
import dev.cap.buscal.service.PerfilService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/perfil")
@RequiredArgsConstructor
public class PerfilController {

    private final PerfilService perfilService;

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public PerfilResponseDto buscarPorId(@PathVariable Integer id){
        return perfilService.buscarPorId(id);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<PerfilResponseDto> listarTodos(){
        return perfilService.listarTodos();
    }
}
