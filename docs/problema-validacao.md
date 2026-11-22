# Problema e Registro de Validação — Acompanha BusUCSal

> Documento estruturado conforme os **Anexos A e B** do Manual do Projeto Prático **POOALAB (Versão 1.1 — Semestre 2026.2)** da Universidade Católica do Salvador (UCSal), disciplina de **Programação Orientada a Objetos Avançada** (Prof. Mario Jorge Pereira).

---

## Parte 1 — Anexo A: Ficha do Problema

- **Solução:** Acompanha BusUCSal
- **Equipe, turma e integrantes:**  
  
Luís Henrique Freitas Mendes | ADS - Noturno

João Victor Rocha Damasceno | BES - Noturno


João Vitor Goveia dos Santos | ADS - Noturno


Bruno Belém Conceição | BES - Noturno


Gabriel Silva Nunes | ADS - Noturno
  
Turma: ADS/BES - 54990 - ESW-NOT-PIT-4S-T1

| Campo Obrigatório | Definição Detalhada no Contexto da UCSal |
| :--- | :--- |
| **1. Público** | Estudantes de graduação, professores e funcionários técnico-administrativos da UCSal (Campus Pituaçu) que dependem do ônibus universitário (BusUCSal / Expresso UCSal) para cumprir o trajeto entre os pontos de embarque externos (Av. Paralela — Estádio de Pituaçu e Av. Pinto de Aguiar) e o campus, nos turnos matutino e noturno (segunda a sábado). |
| **2. Situação** | Nos horários de entrada, troca de turno e saída das aulas (com destaque para os picos da manhã entre 06h30–07h40, almoço entre 11h10–13h20 e noite entre 17h10–21h55), especialmente quando o usuário se desloca até a parada na Av. Paralela ou aguarda a saída em frente ao campus na Av. Pinto de Aguiar. |
| **3. Problema** | A pessoa precisa saber se o ônibus já passou pelo ponto, onde o veículo se encontra no trajeto, quanto tempo falta para chegar e qual é a próxima saída vigente no dia, mas não dispõe de um canal único com acompanhamento de posição e previsão de chegada (ETA) integrada à grade horária. |
| **4. Impacto** | Perda de tempo em paradas expostas sem previsão, ansiedade e insegurança (sobretudo no turno noturno), perda do embarque por poucos minutos e consequentes atrasos em aulas, avaliações e atividades administrativas no campus. |
| **5. Alternativa atual** | Consulta a tabelas estáticas de horários (imagens/PDFs/comunicados), espera presencial "no escuro" nos pontos da Av. Paralela e mensagens informais em grupos de WhatsApp perguntando a colegas onde o ônibus está ou se já saiu do campus. |
| **6. Hipótese crítica** | Se estudantes, professores e funcionários tiverem acesso rápido (em celular ou navegador) à visualização do trajeto com paradas definidas, posição estimada do ônibus em tempo real, contagem regressiva de chegada (ETA) e grade horária destacando a próxima saída, reduzirão a incerteza da espera e decidirão com antecedência o momento de ir para a parada. |
| **7. Recorte** | No MVP do semestre 2026.2, o recorte cobre o acompanhamento de **uma rota principal ativa (Expresso UCSal — Campus Pituaçu)** com suas paradas ordenadas, exibição da tabela de horários oficiais (segunda a sexta e sábado) com cálculo da próxima saída e acompanhamento contínuo da localização do veículo em mapa interativo com ETA e distância restante (operando por API REST alimentada por posição de viagem ou modo simulado de demonstração, sem hardware GPS físico dedicado). |

### Verificação dos 6 Critérios de Problema Adequado

| Critério do Manual | Atendimento no Projeto | Justificativa Objetiva |
| :--- | :--- | :--- |
| **1. É real** | Atendido | O deslocamento até o Campus Pituaçu via Expresso UCSal envolve embarques na Av. Paralela (sentido centro e sentido aeroporto) e saída na Av. Pinto de Aguiar, com horários fixos concentrados por turno. |
| **2. Tem público identificável** | Atendido | Comunidade acadêmica usuária do BusUCSal (alunos, docentes e colaboradores da UCSal Pituaçu). |
| **3. Tem acesso viável para validação** | Atendido | Os próprios estudantes e colegas da UCSal utilizam o serviço diariamente e são acessíveis no campus para entrevistas e testes de uso sem barreiras externas. |
| **4. Não exige acesso privilegiado a sistemas internos ou dados pessoais reais** | Atendido | O MVP não depende de integração com ERP acadêmico, sistema de catracas, API privada da empresa de transporte nem dados pessoais reais (CPF, histórico escolar ou localização pessoal de alunos). |
| **5. Cabe no prazo do semestre** | Atendido | Escopo enxuto focado em 1 rota ativa, mapa interativo, grade de horários e API REST de viagens/posições GPS dentro do prazo até 23/11/2026. |
| **6. Permite construir uma solução verificável** | Atendido | O fluxo completo (acesso → carregamento de rota/paradas → atualização periódica da posição e ETA no mapa + consulta à grade horária) é executável e demonstrável ao vivo. |

---

## Parte 2 — Anexo B: Registro de Validação

### Matriz das 6 Perguntas Norteadoras de Validação (Manual POOALAB)

| Pergunta Norteadora | Resposta Observada na Validação de Campo |
| :--- | :--- |
| **1. Quem vivencia o problema?** | `-` |
| **2. O problema realmente ocorre?** | `-` |
| **3. Com que frequência e impacto?** | `-` |
| **4. Como é resolvido hoje?** | `-` |
| **5. Qual recorte é prioritário?** | `-` |
| **6. A proposta ajuda?** | `-` |

### Registro Cronológico de Evidências (Modelo Oficial Anexo B)

| Data e Perfil (sem identificação pessoal) | Hipótese Testada | Evidência Observada | Decisão (Manter / Alterar / Abandonar) |
| :--- | :--- | :--- | :--- |
| `-` | `-` | `-` | `-` |
| `-` | `-` | `-` | `-` |
| `-` | `-` | `-` | `-` |
| `-` | `-` | `-` | `-` |


### Síntese dos Aprendizados

`-`

### Mudanças Realizadas no Problema ou na Solução em Decorrência da Validação

`-`

