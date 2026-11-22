# BusUCSal (front end)

React + Vite + Tailwind + Leaflet.

    npm install
    cp .env.example .env
    npm run dev          # http://localhost:5173

## Modos (arquivo .env)
- `VITE_USE_MOCK=true`: tudo simulado, não precisa do back.
- `VITE_USE_MOCK=false` + `VITE_API_URL=http://localhost:8080/v1`: usa o back real.
- `VITE_MOCK_LOGIN=true`: só o login é simulado (até o back ter o endpoint de login).

## Integração com o back
Toda chamada passa por `src/services/api.js` (contrato descrito no topo do arquivo).
O trajeto liga as paradas em linha reta, o campus é a constante `CAMPUS` e o ETA é estimado no front.

## Para o back funcionar com este front
- Liberar CORS para `http://localhost:5173` e as rotas no Spring Security.
- Criar o endpoint de login e ajustar `api.login`.
- Definir `JWT_KEY` e revisar o `expiration` (90000 ms = 1,5 min).
- Ter no banco uma rota ativa, paradas e uma viagem em andamento com posições GPS.
