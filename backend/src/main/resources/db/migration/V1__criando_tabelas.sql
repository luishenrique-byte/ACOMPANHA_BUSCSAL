CREATE TABLE usuario(
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha TEXT NOT NULL ,
    matricula VARCHAR(9) UNIQUE,
    perfil VARCHAR(30) NOT NULL,
    CHECK (
        (perfil = 'ALUNO' AND matricula IS NOT NULL) OR
        (perfil != 'ALUNO')
    )
);

CREATE TABLE veiculo(
    id BIGSERIAL PRIMARY KEY,
    prefixo VARCHAR(4),
    placa VARCHAR(7) NOT NULL ,
    status VARCHAR(30) NOT NULL
);

CREATE TABLE rota(
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR,
    descricao VARCHAR,
    ativa BOOLEAN DEFAULT FALSE
);

CREATE TABLE ponto_parada(
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    ordem_rota INTEGER,
    id_rota BIGINT NOT NULL,
    FOREIGN KEY (id_rota) REFERENCES rota(id)
);

CREATE TABLE viagem(
    id BIGSERIAL PRIMARY KEY,
    data_hora_inicio TIMESTAMP,
    data_hora_final TIMESTAMP,
    status VARCHAR,
    id_usuario BIGINT NOT NULL,
    id_veiculo BIGINT NOT NULL,
    id_rota BIGINT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id),
    FOREIGN KEY (id_veiculo) REFERENCES veiculo(id),
    FOREIGN KEY (id_rota) REFERENCES rota(id)
);

CREATE TABLE posicao_gps(
    id BIGSERIAL PRIMARY KEY,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    velocidade DOUBLE PRECISION NOT NULL,
    precisao DOUBLE PRECISION NOT NULL,
    data_hora TIMESTAMP NOT NULL,
    id_viagem BIGINT NOT NULL,
    FOREIGN KEY (id_viagem) REFERENCES viagem(id)
);

CREATE TABLE incidente(
    id BIGSERIAL PRIMARY KEY,
    tipo VARCHAR NOT NULL,
    descricao VARCHAR(300),
    data_hora TIMESTAMP,
    id_viagem BIGINT NOT NULL,
    FOREIGN KEY (id_viagem) REFERENCES viagem(id)
);