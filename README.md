# Acompanha BusUCSal

O **Acompanha BusUCSal** é uma aplicação web desenvolvida para a disciplina POOALAB (2026.2 — UCSal) para acompanhar o ônibus universitário no Campus Pituaçu. Integra API REST em Java/Spring Boot com PostgreSQL e interface React + Leaflet exibindo trajeto, paradas, posição estimada, ETA e horários oficiais.

---

## Problema, Público e Proposta de Valor

> *"Para **estudantes, professores e funcionários da UCSal (Campus Pituaçu)**, que enfrenta **incerteza sobre a localização atual, o horário real de passagem nos pontos da Av. Paralela/Av. Pinto de Aguiar e o tempo de chegada do ônibus universitário** durante **os deslocamentos diários entre os pontos externos de embarque e o campus**, a consequência é **perda de tempo em paradas sem previsão, atrasos em aulas ou compromissos acadêmicos e insegurança durante a espera**. Hoje, esse público tenta resolver a situação por meio de **grupos informais de WhatsApp, consulta estática a imagens/PDFs de horários e espera presencial sem estimativa**."*

**Proposta de valor do MVP:** Centralizar em uma interface única e responsiva a visualização do trajeto do Expresso UCSal, a tabela de horários com destaque automático para a próxima saída e o acompanhamento contínuo da posição do veículo com estimativa de chegada (ETA).

---

## Integrantes e Turma

- **Instituição:** Universidade Católica do Salvador (UCSal)
- **Curso / Turma:** `ADS e BES — 54990 - Noturno`
- **Disciplina:** Programação Orientada a Objetos Avançada — Prof. Mario Jorge Pereira (2026.2)

> **Nota de auditoria Git:** Os nomes sugeridos abaixo na coluna de referência foram identificados no histórico de commits e nas branches do repositório (`member/*`) apenas para conferência e substituição pelos nomes completos oficiais da equipe.

| Nome Completo | Curso / Turma | Papel Principal no Projeto | Referência Git (confirmar) |
| :--- | :--- | :--- | :--- |
| `Luís Henrique Freitas Mendes` | `ADS - Noturno` | `Backend, Segurança JWT, Banco de Dados` | branch `member/luis` |
| `Bruno Belem Conceição` | `BES - Noturno` | `Frontend React, Mapa Leaflet, UI/UX` | branch `member/bruno` |
| `Gabriel Silva Nunes` | `ADS - Noturno` | `Documentação / Validação` | branch `member/gabriel` |
| `João Victor Rocha Damasceno` | `BES - Noturno` | `-` | branch `member/joao_victor` |
| `João Vitor Goveia dos Santos` | `ADS - Noturno` | `-` | branch `member/joao_victor` |

---

## Tecnologias e Justificativas Essenciais

| Camada | Tecnologia / Versão | Justificativa Técnica frente ao Problema |
| :--- | :--- | :--- |
| **Linguagem Backend** | Java 17 (`pom.xml`) | Tipagem estática forte, suporte nativo a `record` para DTOs imutáveis e ecossistema consolidado para APIs corporativas. |
| **Framework Web / API** | Spring Boot `4.1.2` (`spring-boot-starter-webmvc`) | Estruturação rápida de endpoints REST (`/v1/*`), inversão de controle e tratamento padronizado de exceções HTTP. |
| **Persistência e ORM** | Spring Data JPA + Hibernate (`ddl-auto: validate`) | Abstração segura de consultas relacionais (`I*Repository`) garantindo que o modelo Java corresponda exatamente ao schema SQL. |
| **Banco e Migrações** | PostgreSQL + Flyway (`flyway-database-postgresql`) | Integridade referencial entre usuários, perfis, veículos, rotas, paradas, viagens e coordenadas GPS, com versionamento reproduzível de schema (`V1` a `V3`). |
| **Segurança e Auth** | Spring Security + JJWT `0.12.6` + BCrypt | Autenticação stateless via JWT e controle de acesso por papel (`ADMIN`, `MOTORISTA`, `ALUNO`) sem sessão em memória. |
| **Validação e Docs API** | Bean Validation + Springdoc OpenAPI `3.2.0` | Validação declarativa de coordenadas, matrículas e campos obrigatórios (`@Valid`) e interface Swagger interativa para testes e carga de dados. |
| **Produtividade Java** | Lombok (`annotationProcessor`) | Redução de código repetitivo em entidades e injeção por construtor (`@RequiredArgsConstructor`, `@Builder`). |
| **Frontend e Build** | React `18.3.1` + Vite `5.4.2` | Interface SPA reativa leve para atualização periódica da posição do ônibus a cada 3 segundos e build rápido para demonstração. |
| **Estilização UI** | Tailwind CSS `3.4.17` + PostCSS `8.4.49` | Layout mobile-first responsivo com moldura de smartphone em telas maiores e alto contraste visual. |
| **Mapas** | Leaflet `1.9.4` + Tiles Esri World Street Map | Renderização leve de mapa interativo, polilinha do trajeto, marcadores de paradas e deslocamento dinâmico do ônibus sem chave paga de API. |
| **Containerização** | Docker multi-stage (`backend/Dockerfile`) | Empacotamento padronizado do backend com JRE 17 (`eclipse-temurin:17-jre`) para execução isolada ou deploy. |

---

## Relação com POOA 

Os conceitos de Programação Orientada a Objetos Avançada (POOA) aplicados e verificáveis diretamente no código da branch de integração (`origin/simulacao`, pacote base `dev.cap.buscal`) são:

| Conceito de POOA | Onde está aplicado no código | Problema de Design Resolvido |
| :--- | :--- | :--- |
| **SOLID — SRP & DIP / GRASP (Controller, Information Expert, Low Coupling)** | Separação estrita entre `controller/` (`ViagemController`, `PosicaoGpsController`, `RotaController`, etc.), `service/` (`ViagemService`, `UsuarioService`, etc.), `mapper/` e `database/repository/` (`IViagemRepository`, etc.), sempre injetando dependências por construtor via `@RequiredArgsConstructor` e campos `final`. | Evita acoplamento entre protocolo HTTP, regras de negócio e persistência JPA, facilitando manutenção e substituição de implementações. |
| **Padrão GoF Builder** | `@Builder` nas entidades (`UsuarioEntity`, `ViagemEntity`, `PosicaoGpsEntity`, `PontoParadaEntity`, `RotaEntity`, `VeiculoEntity`, `IncidenteEntity`, `PerfilEntity`) e em `ErrorResponse`; construção fluente de tokens em `TokenProvider.contruirToken(...)` (`Jwts.builder()`) e cadeia HTTP em `SecurityConfig`. | Construção legível e segura de objetos com múltiplos atributos opcionais/obrigatórios sem construtores telescópicos. |
| **Padrão Adapter / Wrapper** | No backend: `UsuarioEntity implements UserDetails` e `PerfilEntity implements GrantedAuthority`. No frontend: `frontend/src/services/api.js` atua como adaptador entre os contratos REST do backend (`/v1/*`) ou o simulador (`mock.js`) e o formato esperado pelos componentes React. | Desacopla o domínio da aplicação dos contratos internos do Spring Security e isola as telas React de mudanças na API ou alternância para modo simulado. |
| **Chain of Responsibility (Servlets & Filters)** | `JwtAuthenticationFilter extends OncePerRequestFilter` (`jakarta.servlet.FilterChain`, `HttpServletRequest`, `HttpServletResponse`) inserido antes de `UsernamePasswordAuthenticationFilter` em `SecurityConfig.securityFilterChain(...)`. | Intercepta requisições HTTP de forma transversal para validar JWT e popular o `SecurityContextHolder` sem duplicar verificação de token nos controllers. |
| **DTO Imutável + Mapper** | `dto/resquest/*` (`LoginRequestDto`, `PosicaoGpsRequestDto`, etc.) e `dto/response/*` (`ViagemResponseDto`, `TokenResponseDto`, etc.) implementados como Java `record`, convertidos por classes dedicadas em `mapper/` (`ViagemMapper`, `PosicaoGpsMapper`, etc.). | Garante imutabilidade no transporte de dados, protege entidades JPA contra exposição direta (como a senha em `UsuarioEntity`) e centraliza transformações. |
| **Collections, Java Streams e `Optional`** | Pipelines `.stream().map(...).toList()` em todos os mappers (`toListDTO`) e em `GlobalExceptionHandler.handleMethodArgumentNotValid(...)`; uso de `Optional.orElseThrow(...)` nos services (`buscarEntityPorId`, `buscarUltimaPosicaoDaViagem`, `loadUserByUsername`). | Transforma coleções de domínio de forma declarativa e elimina retornos nulos silenciosos com exceções de domínio explícitas (`RecursoNaoEncontradoException`). |
| **Strategy / Polimorfismo de Autenticação** | Interface `PasswordEncoder` implementada por `BCryptPasswordEncoder` injetada em `UsuarioService` e utilizada pelo `AuthenticationManager`. | Permite trocar o algoritmo de hash de senhas sem alterar a lógica de cadastro ou autenticação. |
| **Reflexão e Anotações (Metaprogramação)** | Uso combinado de JPA (`@Entity`, `@ManyToOne`, `@Enumerated`), Bean Validation (`@Valid`, `@NotBlank`, `@Min`, `@Max`, `@Positive`, `@Email`), Spring Web (`@RestControllerAdvice`, `@ExceptionHandler`), `@Transactional(readOnly = true)` e `@Value`. | Validação automática de entrada, mapeamento ORM e tratamento global de erros (`GlobalExceptionHandler`) sem código imperativo repetitivo. |

---

## Pré-requisitos e Versões Exatas

- **Git:** `2.x` ou superior
- **Java JDK:** **17** (`java.version` no `backend/pom.xml`; imagem Docker usa `eclipse-temurin:17`)
- **Maven:** Wrapper incluído no repositório (`backend/mvnw` e `backend/mvnw.cmd`, Maven `3.10.0` via `maven-wrapper.properties`) — não exige Maven global instalado
- **PostgreSQL:** `14+` ou `16+` (rodando localmente na porta `5432`, ou instância equivalente)
- **Node.js e npm:** Node.js `18+` ou `20+` com `npm` (para rodar `frontend/` com Vite `5.4.2`)
- **Sistema Operacional testado:** Windows (PowerShell / `mvnw.cmd`) e Linux/macOS (`./mvnw`) — `[PREENCHER PELA EQUIPE: Confirmar SO exato testado pela equipe]`
- **Portas utilizadas:**
  - `8080` (Backend Spring Boot — configurável via `PORT`)
  - `5173` (Frontend Vite dev server — padrão do Vite)
  - `5432` (PostgreSQL padrão)

---

## Passos Exatos de Instalação e Execução

### 1. Clonar o repositório e selecionar a branch integrada

```bash
git clone https://github.com/luishenrique-byte/ACOMPANHA_BUSCSAL.git
cd ACOMPANHA_BUSCSAL
git checkout main
```

---

### Modo A — Execução Rápida / Demonstração Independente do Frontend (Modo Simulado)

Útil para validar imediatamente a interface do aluno, o mapa Leaflet, o deslocamento do ônibus e a grade de horários sem depender de PostgreSQL ou serviço externo:

```bash
cd frontend
npm install
cp .env.example .env    # No Windows PowerShell: Copy-Item .env.example .env
```

Edite `frontend/.env` para ativar a simulação completa:

```env
VITE_API_URL=http://localhost:8080/v1
VITE_USE_MOCK=true
VITE_MOCK_LOGIN=true
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Acesse no navegador: `http://localhost:5173`

---

### Modo B — Execução Completa (PostgreSQL + Backend Spring Boot + Frontend)

#### Passo 1: Criar o banco de dados no PostgreSQL

Crie o banco `dbBuscsal` no PostgreSQL local (as tabelas `usuario`, `perfil`, `veiculo`, `rota`, `ponto_parada`, `viagem`, `posicao_gps` e `incidente` serão criadas automaticamente pelo Flyway via `V1`, `V2` e `V3` ao subir o backend):

```sql
CREATE DATABASE "dbBuscsal";
```

#### Passo 2: Configurar variáveis de ambiente do Backend

```bash
cd backend
cp .env.example .env    # No Windows PowerShell: Copy-Item .env.example .env
```

Edite `backend/.env` ajustando suas credenciais locais e **incluindo a porta `5173` do Vite no CORS** (o `BOOTSTRAP_ADMIN_PASSWORD` é obrigatório para iniciar a aplicação e `BOOTSTRAP_ADMIN_EMAIL` precisa ter formato de e-mail válido devido à validação `@Email` em `UsuarioRequestDto`):

```env
DATABASE_URL=jdbc:postgresql://localhost:5432/dbBuscsal
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=sua_senha_postgres_aqui
JWT_KEY=uma_chave_secreta_forte_em_base64_com_pelo_menos_64_caracteres_para_hs512
JWT_EXPIRATION=86400000
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
BOOTSTRAP_ADMIN_NAME=Admin BusUCSal
BOOTSTRAP_ADMIN_EMAIL=admin@buscal.com
BOOTSTRAP_ADMIN_PASSWORD=AdminSenhaSegura123
```

> **Importante (Segurança):** Nunca utilize chaves fracas ou valores padrão em produção e jamais versione o arquivo `.env`.

#### Passo 3: Subir o Backend

No Linux/macOS:
```bash
./mvnw spring-boot:run
```

No Windows (PowerShell/CMD):
```powershell
.\mvnw.cmd spring-boot:run
```

A API subirá em `http://localhost:8080`. A documentação interativa Swagger estará disponível em:
`http://localhost:8080/swagger-ui/index.html`

> **Alternativa via Docker (Backend):**
> ```bash
> cd backend
> docker build -t buscsal-backend .
> docker run --rm -p 8080:8080 --env-file .env buscsal-backend
> ```
> *(Ajuste `DATABASE_URL` para apontar para o host acessível pelo container, ex.: `host.docker.internal`.)*

#### Passo 4: Carga mínima de dados de demonstração na API

Ao iniciar, o componente `IniciarBanco` cria os perfis (`ALUNO`, `MOTORISTA`, `ADMIN`) e o usuário administrador configurado em `BOOTSTRAP_ADMIN_EMAIL`. Para que a consulta de rota, paradas, viagem ativa e posição GPS retorne dados no backend real, execute os passos de carga com dados **fictícios** descritos em [`demo/ROTEIRO_DEMO.md`](demo/ROTEIRO_DEMO.md) (via Swagger UI ou `curl`), criando:
1. Login administrativo em `POST /v1/auth/login` (obtendo o JWT `Bearer`);
2. Um motorista (`POST /v1/usuario` com perfil `MOTORISTA`), um veículo (`POST /v1/veiculo`) e uma rota ativa (`POST /v1/rota`);
3. Os pontos de parada ordenados da rota (`POST /v1/ponto-parada`);
4. Login como motorista (`POST /v1/auth/login`), início da viagem (`POST /v1/viagem`) e envio de posição GPS (`POST /v1/posicaoGPS`).

#### Passo 5: Subir o Frontend conectado ao Backend

> **Nota técnica transparente sobre a integração Frontend ↔ Backend:**
> No código atual da branch `simulacao`, o endpoint `POST /v1/auth/login` espera `{ "email", "senha" }` e todos os endpoints `GET /v1/**` exigem JWT válido no header `Authorization: Bearer <token>`. Já a tela `Login.jsx` no frontend envia `{ matricula, perfil }` (quando `VITE_MOCK_LOGIN=false`) ou gera um token literal `'token-mock'` (quando `VITE_MOCK_LOGIN=true`, que retorna `401` na API protegida). Para demonstrar o **fluxo completo integrado no navegador** antes de alinhar o endpoint de login por matrícula/e-mail, consulte a seção de integração no [`demo/ROTEIRO_DEMO.md`](demo/ROTEIRO_DEMO.md) ou execute o **Modo A (`VITE_USE_MOCK=true`)** para o fluxo visual no navegador + **Swagger UI** para o fluxo autenticado completo no backend.

```bash
cd frontend
npm install
cp .env.example .env
# Ajuste VITE_USE_MOCK=false e VITE_API_URL=http://localhost:8080/v1 em frontend/.env
npm run dev
```

---

## Credenciais Fictícias e Dados de Teste

Todos os dados abaixo são **fictícios / sintéticos** para demonstração acadêmica (nenhum dado real de estudante, motorista ou placa real da frota é armazenado):

| Perfil | Identificador de Teste | Senha / Regra | Onde Usar |
| :--- | :--- | :--- | :--- |
| **Aluno (Modo Simulado Frontend)** | Matrícula fictícia `20240001` (qualquer 6 a 9 dígitos) | Sem senha no modo mock; matrícula `000000` força erro controlado | Frontend (`VITE_USE_MOCK=true`) |
| **Administrador (Bootstrap Backend)** | E-mail definido em `BOOTSTRAP_ADMIN_EMAIL` (ex.: `admin@buscal.com`) | Senha definida em `BOOTSTRAP_ADMIN_PASSWORD` no `.env` | Swagger / `POST /v1/auth/login` |
| **Motorista Fictício (Seed Demo)** | `motorista.demo@buscal.com` | `MotoristaDemo123` (criado via `POST /v1/usuario` pelo Admin) | Swagger / `POST /v1/viagem`, `/v1/posicaoGPS`, `/v1/incidente` |
| **Veículo Fictício (Seed Demo)** | Prefixo `B001`, Placa `ABC1D23`, Status `ATIVO` | — | `POST /v1/veiculo` |
| **Rota e Paradas Sintéticas** | Rota `Expresso UCSal - Pituaçu` | Coordenadas simuladas entre Estádio de Pituaçu (`-12.9531, -38.4263`), Av. Pinto de Aguiar (`-12.9475, -38.4152`) e Campus UCSal (`-12.9482, -38.4137`) | `POST /v1/rota`, `POST /v1/ponto-parada` e `mock.js` |

---

## Como Executar os Testes

No backend, há a suíte inicial Spring Boot (`backend/src/test/java/dev/cap/buscal/BuscsalApplicationTests.java`) que valida o carregamento completo do contexto da aplicação (requer PostgreSQL ativo e variáveis `.env` configuradas):

```bash
cd backend
./mvnw test      # No Windows PowerShell: .\mvnw.cmd test
```

> **Transparência sobre cobertura:** No estado atual da branch `simulacao`, apenas o teste `contextLoads()` está implementado como teste automatizado, e o frontend não possui suíte automatizada em `package.json`. O roteiro completo de testes funcionais manuais, casos de erro previsíveis, limites, testes de API e protocolo de ambiente limpo está documentado em [`tests/ROTEIRO_TESTES.md`](tests/ROTEIRO_TESTES.md).

---

## Roteiro Curto para Reproduzir o Fluxo Principal

Fluxo ponta a ponta (**Entrada → Processamento → Resultado Observável**):

1. **Entrada:** Acesse `http://localhost:5173` (com `VITE_USE_MOCK=true` para fluxo visual contínuo, ou com backend populado + token válido), informe uma matrícula fictícia válida (ex.: `20240001`), selecione o perfil `Aluno` e clique em **Entrar**.
2. **Processamento:**
   - No **Modo Simulado (`mock.js`)**, `Home.jsx` consulta `api.buscarRota()`, `api.buscarParadas()`, `api.buscarCampus()` e agenda atualização periódica (`setInterval` de 3.000 ms) em `api.buscarVeiculo()`, calculando a posição interpolada do ônibus nos 14 pontos da rota e recalculando a próxima saída oficial em `utils/horarios.js`.
   - No **Backend REST (`api.js` + Spring Boot)**, `carregarContexto()` consulta `GET /v1/rota` e `GET /v1/ponto-parada/{idRota}`, `buscarVeiculo()` consulta `GET /v1/viagem` e `GET /v1/posicaoGPS/ultima/{idViagem}`, e calcula distância restante (fórmula de Haversine) e ETA em minutos.
3. **Resultado observável:** O mapa Leaflet (`Mapa.jsx`) exibe o traçado da linha, os marcadores das paradas na Av. Paralela/Pinto de Aguiar, o pin do Campus Pituaçu e o ícone do ônibus em movimento; o painel inferior exibe o status textual (`A caminho do campus` / `Chegando ao campus`), o ETA em minutos, a distância restante em km e a próxima saída programada. Ao clicar em **Ver tabela de horários**, o modal `Horarios.jsx` destaca o próximo horário do dia e risca os horários já encerrados.

---

## Limitações Conhecidas e Próximos Passos

1. **Ausência de GPS embarcado real / integração institucional:** O projeto não consome telemetria física da frota nem base acadêmica oficial da UCSal; as posições no backend dependem de envio via API (`POST /v1/posicaoGPS`) por perfil `MOTORISTA` ou do simulador frontend (`mock.js`).
2. **Divergência pendente no contrato de Login (Frontend ↔ Backend):** O frontend autentica por `{ matricula, perfil }` (ou usa `VITE_MOCK_LOGIN=true`), enquanto o backend implementa autenticação via `{ email, senha }` em `POST /v1/auth/login` e exige JWT em todas as rotas de consulta `/v1/**`.
3. **Telas de Motorista e Incidentes:** Os endpoints para iniciar/pausar/finalizar viagem (`ViagemController`), enviar GPS (`PosicaoGpsController`) e registrar incidentes (`IncidenteController`) estão prontos no backend, mas ainda não possuem interface gráfica no frontend React (sendo operados via Swagger/HTTP).
5. **Próximos passos prioritários:** Alinhar o fluxo de autenticação entre `Login.jsx` e `AuthController` (ou liberar leitura pública controlada para rotas/paradas/posição se decidido pela equipe), ampliar testes automatizados de API e remover os fallbacks de segredo em `application.yaml`.

---

## Estrutura do Repositório e Documentação Oficial (POOALAB)

```text
ACOMPANHA_BUSCSAL/
├── README.md                        # Visão geral, instalação, execução e guia do avaliador
├── backend/                         # API REST Java 17 + Spring Boot + Flyway + PostgreSQL + JWT
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/main/
│       ├── java/dev/cap/buscal/     # config, controller, database (models/repository), dto, exception, handler, mapper, service
│       └── resources/               # application.yaml e db/migration (V1, V2, V3)
├── frontend/                        # SPA React 18 + Vite + Tailwind + Leaflet
│   ├── package.json
│   └── src/                         # App.jsx, components/ (Login, Home, Mapa, Horarios), services/ (api.js, mock.js), utils/
├── docs/
│   ├── problema-validacao.md        # Anexo A (Ficha do Problema) + Anexo B (Registro de Validação)
│   ├── definicao-mvp.md             # Anexo C (Definição do MVP), Arquitetura, POOA, Privacidade, Segurança e Acessibilidade
│   ├── roteiro-pitch.md             # Anexo D (Roteiro do Pitch 5 min), Q&A (3 min) e guia de slides para pitch.pdf
│   └── declaracao-ia-terceiros.md   # Anexo E (Declaração Obrigatória de IA, Terceiros e Código Preexistente)

```

### Links Diretos para Todos os Documentos

- [Anexo A & Anexo B — Problema e Registro de Validação](docs/problema-validacao.md)
- [Anexo C — Definição do MVP, Arquitetura, POOA e Segurança](docs/definicao-mvp.md)
- [Anexo D — Roteiro do Pitch (5 min), Guia de Slides e Q&A](docs/roteiro-pitch.md)
- [Anexo E — Declaração de Uso de IA, Terceiros e Materiais Preexistentes (OBRIGATÓRIO)](docs/declaracao-ia-terceiros.md)
---

## Fontes, Licenças, Componentes de Terceiros e Uso de IA

Este projeto utiliza bibliotecas open-source amplamente adotadas (ecossistema Spring, JJWT, PostgreSQL Driver, Flyway, Lombok, React, Vite, Tailwind CSS e Leaflet, além de tiles de mapa Esri World Street Map) e contou com apoio de ferramentas de Inteligência Artificial devidamente declarado e revisado pela equipe.

Consulte o documento obrigatório e completo em: **[docs/declaracao-ia-terceiros.md](docs/declaracao-ia-terceiros.md)**.
