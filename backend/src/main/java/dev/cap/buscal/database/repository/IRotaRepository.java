package dev.cap.buscal.database.repository;

import dev.cap.buscal.database.models.RotaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IRotaRepository extends JpaRepository<RotaEntity,Long> {
    List<RotaEntity> findAllByAtivaTrue();
}
