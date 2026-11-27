package dev.cap.buscal.dto.resquest;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UsuarioRequestDto (

        @NotBlank(message = "O nome do usuário é um campo obrigatório")
        String nome,

        @NotBlank(message = "O email do usuário é um campo obrigatório")
        @Email
        String email,

        @NotBlank(message = "O senha do usuário é um campo obrigatório")
        String senha,

        String matricula,

        @NotNull(message = "O ID do Perfil é um campo obrigatório")
        Integer idPerfil
) {}
