# Anexo E — Declaração de Uso de Inteligência Artificial, Componentes de Terceiros e Materiais Preexistentes

> **DOCUMENTO OBRIGATÓRIO E INDEPENDENTE** — Conforme o Manual do Projeto Prático **POOALAB (Versão 1.1 — Semestre 2026.2)** da Universidade Católica do Salvador (UCSal), disciplina de Programação Orientada a Objetos Avançada (Prof. Mario Jorge Pereira).

---

## Identificação da Entrega

- **Solução:** Acompanha BusUCSal
- **Disciplina:** Programação Orientada a Objetos Avançada — POOALAB (2026.2)
- **Curso / Turma:** ADS/BES - 54990 - ESW-NOT-PIT-4S-T1
- **Integrantes:** 

Luís Henrique Freitas Mendes


João Victor Rocha Damasceno 


João Vitor Goveia dos Santos 


Bruno Belém Conceição 


Gabriel Silva Nunes

---

## Seção 1 — Uso de Inteligência Artificial

- **Houve uso de ferramentas ou modelos de Inteligência Artificial no projeto?**
  - (X) Sim / (  ) Não

| Ferramenta ou Modelo | Finalidade ou Tarefa | Parte Afetada | Revisão e Validação Realizadas |
| :--- | :--- | :--- | :--- |
| Agentes de IA (Antigravity / LLM) | Auditoria das branches do repositório e estruturação inicial dos documentos obrigatórios do manual POOALAB (Anexos A–E, roteiros do pitch. | `README.md`, `docs/*` | Revisão e leitura realizada de forma manual para conferir a integridade das informações durante a estruturação de documentos.     |
| Gemini | Geração de código repetitivo: DTOs e Mappers e pesquisas sobre Spring Security | `backend/src/main/java/dev/cap/buscal(dto,controller)` | Testes foram realizados na arquitetura back-end para validação das lógicas de negócio e garantir a execução funcional do MVP. |
| Claude | Geração inicial e estruturação da interface do cliente web a partir da descrição do escopo do BusUCSal, prints de referência do mapa e análise da estrutura do pacote .zip do back-end para mapeamento dos contratos da API e  Depuração e correção de falhas de integração e renderização em tempo de execução, especificamente o erro de renderização do mapa em branco (Leaflet) e bloqueios de requisição (CORS) ao consumir os endpoints reais. | `frontend/src/*` | O integrante rodou a aplicação em ambiente real, monitorou o console do navegador, capturou evidências (prints) dos erros ocorridos e validou manualmente o carregamento do mapa e o fluxo de dados após cada ajuste aplicado. |
---

## Seção 2 — Componentes e Recursos de Terceiros

- **Foram utilizados bibliotecas, frameworks, APIs, imagens, templates ou outros recursos de terceiros?**
  - `(X) Sim` / `( ) Não`

> As tabelas abaixo foram pré-populada diretamente a partir dos manifestos `backend/pom.xml`, `backend/Dockerfile`, `frontend/package.json`, `frontend/package-lock.json` e `frontend/src/components/Mapa.jsx` da branch `origin/simulacao`.

### 2.1. Backend (`backend/pom.xml` e `backend/Dockerfile`)

| Componente ou Recurso | Origem ou Link | Versão e Licença | Função e Alterações Realizadas |
| :--- | :--- | :--- | :--- |
| **Spring Boot Starter Parent** (`webmvc`, `data-jpa`, `security`, `validation`, `flyway`, starters de teste) | https://spring.io/projects/spring-boot | `4.1.2` / Apache-2.0 | Estrutura base da API REST, injeção de dependências, segurança, ORM JPA e validação de entrada. Sem alterações no código da biblioteca. |
| **JJWT** (`jjwt-api`, `jjwt-impl`, `jjwt-jackson`) | https://github.com/jwtk/jjwt | `0.12.6` / Apache-2.0 | Geração, assinatura HMAC e validação de tokens JWT em `TokenProvider.java`. Uso direto via API da biblioteca. |
| **Springdoc OpenAPI WebMVC UI** | https://springdoc.org/ | `3.2.0` / Apache-2.0 | Geração automática da especificação OpenAPI e interface Swagger UI (`/swagger-ui/**`). Sem alterações. |
| **Flyway Database PostgreSQL** | https://flywaydb.org/ | Gerenciada pelo Spring Boot `4.1.2` / Apache-2.0 | Execução versionada das migrations SQL (`V1`, `V2`, `V3`). Scripts SQL autorais da equipe. |
| **PostgreSQL JDBC Driver** | https://jdbc.postgresql.org/ | Gerenciada pelo Spring Boot `4.1.2` / BSD-2-Clause | Driver de conexão JDBC com o banco PostgreSQL. Sem alterações. |
| **Project Lombok** | https://projectlombok.org/ | Gerenciada pelo Spring Boot `4.1.2` / MIT | Geração em compilação de getters/setters, construtores (`@RequiredArgsConstructor`) e builders (`@Builder`). Sem alterações. |
| **Imagens Base Docker** (`maven:3.9-eclipse-temurin-17`, `eclipse-temurin:17-jre`) | https://hub.docker.com/_/eclipse-temurin | Temurin Java 17 / EPL-2.0 com Classpath Exception | Ambiente padronizado de build e execução do backend em `backend/Dockerfile`. |

### 2.2. Frontend (`frontend/package.json` e Serviços Externos)

| Componente ou Recurso | Origem ou Link | Versão e Licença | Função e Alterações Realizadas |
| :--- | :--- | :--- | :--- |
| **React** e **React DOM** | https://react.dev/ | `18.3.1` / MIT | Construção da interface SPA componentizada (`App.jsx`, `Login.jsx`, `Home.jsx`, `Mapa.jsx`, `Horarios.jsx`). Sem alterações. |
| **Leaflet** | https://leafletjs.com/ | `1.9.4` / BSD-2-Clause | Renderização do mapa interativo, polilinha da rota e marcadores personalizados (SVG/HTML) em `Mapa.jsx`. Sem alterações no núcleo da biblioteca. |
| **Vite** e **@vitejs/plugin-react** | https://vitejs.dev/ | `5.4.2` e `4.3.1` / MIT | Servidor de desenvolvimento e bundler de produção. Configuração mínima em `vite.config.js`. |
| **Tailwind CSS**, **PostCSS** e **Autoprefixer** | https://tailwindcss.com/ | `3.4.17`, `8.4.49`, `10.4.20` / MIT | Estilização utilitária mobile-first e layout responsivo em `src/index.css` e componentes JSX. |
| **Esri World Street Map (Tile Layer)** | https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer | Serviço de tiles online / Atribuição `&copy; Esri` (termos ArcGIS Online) | Camada visual de ruas exibida no mapa Leaflet com atribuição preservada no rodapé do mapa (`Mapa.jsx`). |
| `[PREENCHER: Outros recursos]` | `[PREENCHER: Ex.: Fonte oficial de horários do BusUCSal — UCSal]` | `[PREENCHER: Informação pública institucional]` | `[PREENCHER: Tabela de horários e roteiro Pituaçu transcritos em utils/horarios.js e Horarios.jsx]` |

---

## Seção 3 — Materiais ou Código Preexistentes

- **O projeto reutiliza código, templates, repositórios anteriores ou materiais preexistentes produzidos antes desta disciplina ou fora dela?**
  - `( ) Sim` / `(X) Não` 


---

## Seção 4 — Declaração da Equipe

> Declaramos, para os devidos fins acadêmicos na disciplina de **Programação Orientada a Objetos Avançada (POOALAB 2026.2)** da **Universidade Católica do Salvador (UCSal)**, que as informações registradas neste documento são verdadeiras, completas e transparentes. Confirmamos que todo uso de ferramentas de Inteligência Artificial, bibliotecas, frameworks, APIs externas e eventuais materiais preexistentes está devidamente declarado acima, que nenhuma evidência de validação com usuários reais foi inventada ou gerada artificialmente e que todos os integrantes assumem responsabilidade coletiva pelo código, pela documentação e pela demonstração entregues.

- **Responsável pela submissão:**  
LUÍS HENRIQUE FREITAS MENDES / 200037714
### Ciência dos Integrantes

| # | Nome Completo | Assinatura ou Registro de Ciência |
| :-: | :--- | :--- |
| **1** | Luís Henrique Freitas Mendes | `Ciente e de acordo` — `@luishenrique-byte` em 21/11/2026 |
| **2** | João Victor Rocha Damasceno | `Ciente e de acordo` — `@victor-damasceno` em 21/11/2026 |
| **3** | João Vitor Goveia dos Santos | `Ciente e de acordo` — `@joaovit0r0606` em 21/11/2026 |
| **4** | Bruno Belém Conceição| `Ciente e de acordo` — `@brunobelemm` em 21/11/2026`|
| **5** | Gabriel Silva Nunes | `Ciente e de acordo` — `@Gabrielsln` em 21/11/2026 |


**Data:** `21/11/2026`
