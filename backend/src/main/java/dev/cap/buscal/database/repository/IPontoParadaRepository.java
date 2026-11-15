package dev.cap.buscal.database.repository;

import dev.cap.buscal.database.models.PontoParadaEntity;
import dev.cap.buscal.database.models.RotaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IPontoParadaRepository extends JpaRepository<PontoParadaEntity, Long> {
    List<PontoParadaEntity> findAllByRota(RotaEntity rota);
}
