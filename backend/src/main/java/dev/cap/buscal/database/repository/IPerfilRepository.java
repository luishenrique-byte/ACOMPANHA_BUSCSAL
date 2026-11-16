package dev.cap.buscal.database.repository;

import dev.cap.buscal.database.models.PerfilEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IPerfilRepository extends JpaRepository<PerfilEntity, Integer> {
}
