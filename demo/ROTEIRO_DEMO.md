# Roteiro de Demonstração ao Vivo e Plano de Contingência — Acompanha BusUCSal

> Guia operacional para preparação da estação, carga segura de dados fictícios, execução ao vivo dentro do pitch (1 min 40 s no bloco `1:50–3:30`) e **Plano de Contingência** conforme a página 10 do Manual **POOALAB (Versão 1.1 — Semestre 2026.2)**.

---

## 1. Conjunto Seguro de Dados de Demonstração (Sintéticos)

Todos os dados abaixo são **fictícios/simulados**, criados exclusivamente para testes e apresentação acadêmica. Nenhum CPF, e-mail pessoal, matrícula real de estudante ou placa real da frota da UCSal deve ser utilizado.

### 1.1. Dados Simulados do Frontend (`frontend/src/services/mock.js` e `utils/horarios.js`)
- **Matrícula fictícia válida:** `20240001` (qualquer sequência de 6 a 9 dígitos numéricos, exceto `000000`).
- **Matrícula reservada para erro controlado:** `000000` (dispara a mensagem `"Matrícula não encontrada."` em `mock.js`).
- **Perfis exibidos na interface:** `Aluno`, `Professor` ou `Funcionário`.
- **Trajeto simulado:** 14 pontos geográficos sintéticos entre a Av. Paralela (Estádio de Pituaçu, `-12.9580, -38.4310`) e o Campus UCSal Pituaçu (`-12.9482, -38.4137`), com ciclo completo de 3 minutos (`CICLO_MS = 180000`).
- **Paradas simuladas:**
  1. `Estádio de Pituaçu` — `1ª parada · Av. Paralela (sentido centro)` (`-12.9531, -38.4263`)
  2. `Estádio de Pituaçu` — `2ª parada · Av. Paralela (sentido aeroporto)` (`-12.9525, -38.4257`)
  3. `UCSal · Av. Pinto de Aguiar` — `Saída (*) · em frente ao campus, sentido orla` (`-12.9475, -38.4152`)

### 1.2. Dados Fictícios para Carga do Backend (PostgreSQL + API `/v1`)
- **Admin inicial (criado automaticamente por `IniciarBanco.java`):** e-mail e senha definidos no `backend/.env` (ex.: `admin@buscal.com`).
- **Motorista fictício:** Nome `Motorista Demo`, e-mail `motorista.demo@buscal.com`, senha `MotoristaDemo123`, matrícula `null`, perfil `MOTORISTA` (`idPerfil` retornado por `GET /v1/perfil`).
- **Veículo fictício:** Prefixo `B001`, placa `ABC1D23`, status `ATIVO`.
- **Rota ativa:** Nome `Expresso UCSal - Pituaçu`, descrição `Trajeto circular Av. Paralela <-> Campus Pituaçu`, `ativa: true`.
- **Pontos de parada ordenados:** Mesmas coordenadas sintéticas listadas na seção 1.1 (`ordem: 1, 2, 3`).

---

## 2. Preparação Antecipada da Estação na Mostra

> **Regra de ouro:** Faça toda a preparação **antes** da chamada da banca. Nunca execute instalações (`npm install`), cadastros longos ou migrations na hora dos 5 minutos do pitch.

### 2.1. Cenário A — Preparação do Frontend (Fluxo Principal Visual)
1. Confirme que está na branch integrada (`main` após o merge de `simulacao`, ou `simulacao` durante ensaios).
2. Em `frontend/.env`, defina o modo de demonstração estável:
   ```env
   VITE_API_URL=http://localhost:8080/v1
   VITE_USE_MOCK=true
   VITE_MOCK_LOGIN=true
   ```
3. Inicie o frontend antes da apresentação:
   ```bash
   cd frontend
   npm run dev
   ```
4. Abra `http://localhost:5173` em janela anônima ou limpa do navegador, ajuste o zoom para enquadrar confortavelmente a moldura mobile e deixe a tela de **Login** pronta.

### 2.2. Cenário B — Preparação do Backend + Carga Seed (Demonstração da API Real)
1. Garanta que o PostgreSQL local está em execução com o banco `dbBuscsal`.
2. Inicie o backend em `backend/`:
   ```bash
   ./mvnw spring-boot:run   # Windows PowerShell: .\mvnw.cmd spring-boot:run
   ```
3. Abra o **Swagger UI** em uma segunda aba do navegador: `http://localhost:8080/swagger-ui/index.html`.
4. Execute a carga inicial de demonstração via terminal (exemplo em `bash`/`curl` — adapte os IDs retornados caso o banco já possua registros):

```bash
# 1) Autenticar como ADMIN (use as credenciais do seu backend/.env)
TOKEN_ADMIN=$(curl -s -X POST http://localhost:8080/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@buscal.com","senha":"AdminSenhaSegura123"}' | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>console.log(JSON.parse(d).token))")

# 2) Consultar ID do perfil MOTORISTA
curl -s http://localhost:8080/v1/perfil -H "Authorization: Bearer $TOKEN_ADMIN"

# 3) Criar motorista ficticio (substitua idPerfil pelo ID de MOTORISTA retornado acima, normalmente 2)
curl -s -X POST http://localhost:8080/v1/usuario \
  -H "Authorization: Bearer $TOKEN_ADMIN" -H "Content-Type: application/json" \
  -d '{"nome":"Motorista Demo","email":"motorista.demo@buscal.com","senha":"MotoristaDemo123","matricula":null,"idPerfil":2}'

# 4) Cadastrar veiculo ficticio (id 1) e rota ativa (id 1)
curl -s -X POST http://localhost:8080/v1/veiculo \
  -H "Authorization: Bearer $TOKEN_ADMIN" -H "Content-Type: application/json" \
  -d '{"prefixo":"B001","placa":"ABC1D23","status":"ATIVO"}'

curl -s -X POST http://localhost:8080/v1/rota \
  -H "Authorization: Bearer $TOKEN_ADMIN" -H "Content-Type: application/json" \
  -d '{"nome":"Expresso UCSal - Pituacu","descricao":"Av. Paralela <-> Campus Pituacu","ativa":true}'

# 5) Cadastrar 3 pontos de parada da rota 1
curl -s -X POST http://localhost:8080/v1/ponto-parada \
  -H "Authorization: Bearer $TOKEN_ADMIN" -H "Content-Type: application/json" \
  -d '{"nome":"Estadio de Pituacu (Sentido Centro)","latitude":-12.9531,"longitude":-38.4263,"ordem":1,"idRota":1}'

curl -s -X POST http://localhost:8080/v1/ponto-parada \
  -H "Authorization: Bearer $TOKEN_ADMIN" -H "Content-Type: application/json" \
  -d '{"nome":"Estadio de Pituacu (Sentido Aeroporto)","latitude":-12.9525,"longitude":-38.4257,"ordem":2,"idRota":1}'

curl -s -X POST http://localhost:8080/v1/ponto-parada \
  -H "Authorization: Bearer $TOKEN_ADMIN" -H "Content-Type: application/json" \
  -d '{"nome":"UCSal - Av. Pinto de Aguiar","latitude":-12.9475,"longitude":-38.4152,"ordem":3,"idRota":1}'

# 6) Autenticar como MOTORISTA e iniciar viagem + enviar posicao GPS inicial
TOKEN_MOT=$(curl -s -X POST http://localhost:8080/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"motorista.demo@buscal.com","senha":"MotoristaDemo123"}' | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>console.log(JSON.parse(d).token))")

curl -s -X POST http://localhost:8080/v1/viagem \
  -H "Authorization: Bearer $TOKEN_MOT" -H "Content-Type: application/json" \
  -d '{"idMotorista":2,"idVeiculo":1,"idRota":1}'

curl -s -X POST http://localhost:8080/v1/posicaoGPS \
  -H "Authorization: Bearer $TOKEN_MOT" -H "Content-Type: application/json" \
  -d '{"latitude":-12.9540,"longitude":-38.4272,"velocidade":28.0,"precisao":5.0,"idViagem":1}'
```

### 2.3. Reset Rápido do Ambiente entre Ensaios
- **Frontend:** Clicar em **Sair** no topo da interface (executa `sessionStorage.clear()` e retorna para a tela de login).
- **Backend / PostgreSQL:** Para zerar completamente e recriar o banco de forma limpa via Flyway:
  ```sql
  DROP DATABASE "dbBuscsal";
  CREATE DATABASE "dbBuscsal";
  ```
  Em seguida, reinicie o backend para que o Flyway (`V1`–`V3`) e `IniciarBanco` recriem a estrutura limpa e execute novamente o script seed da seção 2.2.

---

## 3. Roteiro Passo a Passo da Demonstração ao Vivo (Bloco `1:50–3:30`)

| Etapa | Tempo | Ação na Tela | O que Deve Aparecer (Resultado Observável) | Narração Sugerida |
| :-: | :-: | :--- | :--- | :--- |
| **1. Erro Previsível Rápido** | 15 s | Na tela de Login, digitar `000000`, selecionar `Aluno` e clicar em **Entrar**. | Alerta acessível exibindo `"Matrícula não encontrada."` (ou com menos de 6 dígitos: `"Digite sua matrícula (6 a 9 números)."`). | *"Primeiro mostramos a validação de entrada e o tratamento de erro claro para o usuário."* |
| **2. Acesso ao Fluxo Principal** | 15 s | Corrigir matrícula para `20240001`, manter `Aluno` e clicar em **Entrar**. | Carregamento da tela principal (`Home.jsx`) exibindo cabeçalho com perfil, mapa Leaflet centralizado, traçado da rota, 3 paradas e pin da UCSal. | *"Com uma matrícula válida, o usuário entra direto no mapa do Expresso UCSal Pituaçu."* |
| **3. Acompanhamento ao Vivo e ETA** | 30 s | Aguardar 3–6 segundos sem tocar no mapa; clicar em uma parada para abrir o popup; arrastar o mapa e clicar no botão 🎯 (`Seguir ônibus`). | Marcador `🚌` se desloca ao longo do trajeto; ETA em minutos e distância em km atualizam dinamicamente; popup mostra sentido da parada; botão 🎯 recentraliza no ônibus. | *"A cada 3 segundos consultamos a posição atualizada, calculamos distância e ETA, e deixamos o usuário explorar as paradas ou recentralizar o veículo."* |
| **4. Tabela de Horários** | 25 s | Clicar em **Ver tabela de horários**. | Modal `Horarios.jsx` abre com grade Segunda–Sexta e Sábado, destacando o dia atual (`• hoje`), riscando horários passados e destacando a próxima saída e a descrição dos pontos. Fechar o modal (`✕`). | *"Se o usuário quiser planejar a volta, a tabela oficial destaca automaticamente a próxima saída do dia."* |
| **5. Evidência Rápida da API (Opcional / se sobrar tempo)** | 15 s | Alternar brevemente para a aba do Swagger UI (`http://localhost:8080/swagger-ui/index.html`) mostrando `GET /v1/viagem` e `GET /v1/posicaoGPS/ultima/1`. | Resposta JSON real `200 OK` com dados da viagem ativa e última posição persistida no PostgreSQL. | *"Por trás da interface, nossa API REST em Spring Boot persiste viagens, posições GPS e incidentes com autenticação JWT."* |

---

## 4. Plano de Contingência Completo (Manual POOALAB, pág. 10)

### 4.1. Matriz de Falhas e Ações Imediatas

| Cenário de Falha na Mostra | Sintoma | Ação de Contingência Imediata |
| :--- | :--- | :--- |
| **Queda ou instabilidade de internet no campus** | Tiles do mapa Esri (`arcgisonline.com`) não carregam novos quadrantes ou serviços em nuvem ficam inacessíveis. | **Execução 100% local:** O backend Spring Boot, o PostgreSQL e o servidor Vite rodam localmente em `localhost`. Mesmo se tiles externos atrasarem, o traçado azul da rota, os marcadores de paradas, o pin do campus, o movimento do ônibus, o ETA e a tabela de horários continuam funcionando normalmente. *(Dica: navegar pelo zoom da região de Pituaçu no navegador minutos antes ajuda a manter tiles em cache.)* |
| **Falha no PostgreSQL ou erro de integração no backend durante a mostra** | API não sobe na porta `8080` ou retorna erro de conexão/401 inesperado. | Confirmar imediatamente que `frontend/.env` está com `VITE_USE_MOCK=true` (ou deixar uma segunda instância do frontend em outra porta, ex.: `npm run dev -- --port 5174`, dedicada ao modo simulado) para apresentar o fluxo do aluno sem interrupção, declarando à banca com transparência que a contingência simulada foi acionada. |
| **Falha no projetor, cabo HDMI ou travamento do notebook principal** | Imagem não projeta ou computador reinicia. | Ter o repositório clonado, dependências instaladas (`npm install` / build `.jar` gerado) e ambiente configurado em **um segundo notebook reserva** da equipe com os mesmos dados pré-carregados. |
| **Impossibilidade técnica severa no ambiente ao vivo** | Máquina não responde no tempo de 5 minutos. | Acionar o **vídeo curto de contingência** salvo localmente no computador e em pendrive apenas para não desperdiçar o tempo da banca — deixando explícito que o vídeo é apoio de apresentação e **não** substitui o código executável entregue no repositório. |

### 4.2. Checklist de Verificação Prévia de Equipamento (1 dia antes e 30 min antes)
- [ ] Bateria do notebook carregada em 100% + fonte de alimentação ligada na tomada.
- [ ] Adaptador HDMI / USB-C testado com o projetor da sala da UCSal.
- [ ] Modo "Não Perturbe" / notificações do sistema operacional ativadas para não interromper o pitch.
- [ ] Fontes do navegador / terminal ampliadas (`Ctrl` + `+`) para visibilidade confortável na última fileira da sala.
- [ ] Segundo notebook de backup preparado com código e dependências locais.

### 4.3. Especificações para Gravação do Vídeo Curto de Contingência
- **Duração:** Máximo **90 a 110 segundos** (alinhado ao bloco de demonstração do pitch).
- **Conteúdo:** Captura de tela contínua em alta definição (1080p, sem cortes enganosos) mostrando: (1) erro controlado na entrada, (2) login e carregamento do mapa, (3) movimentação do ônibus e atualização do ETA/distância, (4) modal de horários e (5) Swagger UI respondendo `200 OK` na API local.
- **Armazenamento:** Salvar localmente em dois dispositivos dos integrantes (ex.: pasta fora do Git ou link de Drive/Classroom caso solicitado) — **lembrando que o vídeo não substitui o MVP executável ao vivo**.
