package dev.cap.buscal.database.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "usuario")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class UsuarioEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nome")
    private String nome;

    @Column(name = "email")
    private String email;

    @Column(name = "senha")
    private String senha;

    @Column(name = "matricula")
    private String matricula;

    @ManyToOne
    @JoinColumn(name = "id_perfil")
    private PerfilEntity perfil;
}
