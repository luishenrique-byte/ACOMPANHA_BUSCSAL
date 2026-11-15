CREATE TABLE IF NOT EXISTS perfil (
      id SERIAL PRIMARY KEY,
      nome VARCHAR(30) UNIQUE NOT NULL
);

DO $$
    BEGIN
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name = 'usuario' AND column_name = 'id_perfil'
        ) THEN
            ALTER TABLE usuario ADD COLUMN id_perfil INT;
        END IF;
END $$;

DO $$
    BEGIN
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints
            WHERE constraint_name = 'fk_usuario_perfil'
        ) THEN
            ALTER TABLE usuario ADD CONSTRAINT fk_usuario_perfil
                FOREIGN KEY (id_perfil) REFERENCES perfil(id);
        END IF;
END $$;