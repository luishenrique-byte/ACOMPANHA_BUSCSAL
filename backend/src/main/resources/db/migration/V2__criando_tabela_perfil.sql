CREATE TABLE perfil(
    id SERIAL PRIMARY KEY,
    nome VARCHAR(30)
);

AlTER TABLE usuario DROP COLUMN perfil;

ALTER TABLE usuario ADD COLUMN id_perfil INTEGER NOT NULL;

ALTER TABLE usuario ADD CONSTRAINT id_perfil
    FOREIGN KEY (id_perfil) REFERENCES perfil(id);