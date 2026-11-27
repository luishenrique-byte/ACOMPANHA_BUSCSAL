package dev.cap.buscal.database.repository;

import dev.cap.buscal.database.models.VeiculoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IVeiculoRepository extends JpaRepository<VeiculoEntity, Long> {
}
