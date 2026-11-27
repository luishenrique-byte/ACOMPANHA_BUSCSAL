package dev.cap.buscal.database.repository;

import dev.cap.buscal.database.models.ENUM.UserPerfil;
import dev.cap.buscal.database.models.PerfilEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IPerfilRepository extends JpaRepository<PerfilEntity, Integer> {
    Optional<PerfilEntity> findByPerfil(UserPerfil perfil);

    boolean existsByPerfil(UserPerfil perfil);
}
