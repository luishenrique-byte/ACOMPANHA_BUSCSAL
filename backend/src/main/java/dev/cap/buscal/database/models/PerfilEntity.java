package dev.cap.buscal.database.models;

import dev.cap.buscal.database.models.ENUM.UserPerfil;
import jakarta.persistence.*;
import lombok.*;
import org.jspecify.annotations.Nullable;
import org.springframework.security.core.GrantedAuthority;

import java.util.List;

@Entity
@Table(name = "perfil")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class PerfilEntity implements GrantedAuthority {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, name = "nome")
    private UserPerfil perfil;

    @OneToMany(mappedBy = "perfil")
    private List<UsuarioEntity> usuariosList;

    @Override
    public @Nullable String getAuthority() {
        return perfil.name();
    }
}
