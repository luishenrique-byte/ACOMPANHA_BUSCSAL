# Roteiro do Pitch, Guia de Slides (`pitch.pdf`) e Q&A — Acompanha BusUCSal

> Documento estruturado conforme o **Anexo D** e as orientações de apresentação (página 10) do Manual do Projeto Prático **POOALAB (Versão 1.1 — Semestre 2026.2)** da UCSal.
> **Datas da Mostra e Pitch:** **03/12/2026**

---

## 1. Anexo D — Roteiro Oficial do Pitch

| Parte do Roteiro | Objetivo (Manual POOALAB) | Conteúdo Adaptado ao Acompanha BusUCSal |
| :--- | :--- | :--- |
| **1. Abertura** | Apresentar solução, público e problema em linguagem concreta. | "Somos a equipe do **Acompanha BusUCSal**. Todos os dias, estudantes, professores e funcionários do Campus Pituaçu da UCSal precisam pegar o ônibus universitário na Av. Paralela ou na saída da Av. Pinto de Aguiar — e enfrentam a mesma dúvida: *o ônibus já passou ou ainda dá tempo de chegar ao ponto?*" |
| **2. Público e contexto** | Situar quem sofre a dor e o que faz hoje como alternativa. | "Hoje, quem depende do Expresso UCSal consulta fotos estáticas da tabela de horários ou manda mensagem em grupos de WhatsApp perguntando onde o ônibus está. Quando não há resposta, a espera acontece sem previsão, gerando atrasos em aulas e insegurança nos pontos, especialmente à noite." |
| **3. Evidências** | Trazer achados reais da validação que orientaram o projeto. | --- |
| **4. Proposta** | Mostrar o recorte escolhido para o MVP e o valor entregue. | "Para resolver essa dor sem depender de catracas, dados pessoais sensíveis ou APIs privadas da instituição, definimos um MVP enxuto: acompanhamento da rota ativa do Expresso UCSal Pituaçu em mapa interativo, cálculo automático de distância e tempo estimado de chegada (ETA) e consulta rápida à grade oficial com destaque da próxima saída." |
| **5. Demonstração** | **Regra "Demonstração Primeiro"**: executar ao vivo o fluxo principal fim-a-fim. | Mostrar ao vivo o usuário entrando no app, o mapa carregando o trajeto e as paradas do Estádio de Pituaçu até a UCSal, o marcador do ônibus atualizando posição/ETA/km em tempo real, o botão de seguir veículo e o modal de horários destacando a próxima saída e riscando as anteriores (além de um erro controlado, como matrícula inválida, e da API/Swagger caso haja tempo no bloco). |
| **6. Decisões e limites** | Explicar arquitetura, POOA, testes e limitações honestas. | "Construímos uma API REST em Java 17 + Spring Boot com PostgreSQL/Flyway, JWT/RBAC e frontend React + Leaflet. Aplicamos POOA na separação SOLID/GRASP em camadas, padrão Adapter (`UserDetails`/`GrantedAuthority` e `api.js`), Builder, Chain of Responsibility em filtro Servlet JWT, DTOs imutáveis com `record`, Streams e tratamento global de exceções. Como limite transparente do MVP: não há GPS físico na frota ainda (usamos envio via endpoint/simulador) e os módulos de motorista/admin rodam via API." |
| **7. Aprendizado** | Fechar com resultado alcançado, lição da equipe e próximo passo. |  Nosso próximo passo imediato após o MVP é unificar o fluxo de autenticação entre o frontend e o endpoint JWT do backend e disponibilizar a tela web de transmissão GPS para o motorista em campo." |
