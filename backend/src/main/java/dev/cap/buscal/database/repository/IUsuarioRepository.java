package dev.cap.buscal.database.repository;

import dev.cap.buscal.database.models.UsuarioEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IUsuarioRepository extends JpaRepository<UsuarioEntity,Long> {

    boolean existsByEmail(String email);

    boolean existsByMatricula(String matricula);
}
