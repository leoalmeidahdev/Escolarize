# RotaEdu

Plataforma web de corridas escolares — um protótipo funcional para estudantes e responsáveis solicitarem corridas para escolas de São José dos Campos - SP.

## Objetivo

A proposta: as caronas são oferecidas por pessoas da própria comunidade escolar — responsáveis que já levam os filhos e professores que vão para a mesma escola todos os dias — que aproveitam o trajeto para levar outros estudantes e complementar a renda.

O RotaEdu simula, de ponta a ponta, a experiência de um aplicativo real de mobilidade escolar: escolher uma escola, informar o endereço de embarque, revisar e solicitar uma corrida, acompanhar um motorista (mock) até a chegada na escola, concluir a corrida, avaliar o motorista e consultar o histórico. Também é possível favoritar escolas e agendar corridas com antecedência.

**Este é um protótipo demonstrativo.** Não há backend, banco de dados, autenticação, pagamento real ou comunicação real com motoristas — tudo é simulado no navegador.

## Tecnologias

- HTML5
- CSS3 (mobile-first, com suporte a tema claro/escuro)
- Visual: fundo azul com rabiscos escolares, cards brancos arredondados, destaque em amarelo e navegação flutuante (barra inferior no celular, barra lateral em cartão no desktop)
- JavaScript (ES6+, vanilla, sem frameworks)
- `localStorage` para persistência local
- PWA (manifest + Service Worker)
- Leaflet + OpenStreetMap para o mapa real (biblioteca local, sem chave de API)

Nenhuma dependência de backend, banco de dados, login ou API paga é utilizada. Recursos externos: a fonte Inter (Google Fonts) e os *tiles* do OpenStreetMap — ambos opcionais, com degradação graciosa quando indisponíveis.

## Estrutura de pastas

```
/
├── index.html
├── manifest.json
├── sw.js
├── README.md
│
├── css/
│   ├── style.css          # design system e componentes
│   └── responsive.css     # breakpoints (tablet/desktop)
│
├── js/
│   ├── app.js              # inicialização, estado global, tema, service worker
│   ├── navigation.js       # roteador de views (SPA) e navegação inferior
│   ├── welcome.js           # boas-vindas: escolha do nome na primeira entrada
│   ├── map.js               # camada de mapa real (Leaflet/OSM, provedor trocável)
│   ├── mapView.js           # tela de mapa: escolher escola / definir embarque
│   ├── home.js              # tela inicial
│   ├── schools.js           # seleção de escola e endereço de embarque
│   ├── rides.js              # revisão, solicitação, acompanhamento, histórico
│   ├── schedule.js           # agendamentos
│   ├── profile.js             # perfil, preferências, favoritos
│   ├── storage.js              # camada central de localStorage
│   ├── mockData.js              # usuário, motorista, notificações, rotas populares
│   └── components.js             # ícones, mapa simulado, cards, toasts, modais
│
├── data/
│   └── schools.js           # escolas mock de São José dos Campos
│
└── assets/
    ├── icons/                # ícones do PWA (SVG)
    └── vendor/leaflet/        # Leaflet 1.9.4 local (mapa real, sem CDN)
```

## Como executar

Não é necessário nenhum build ou instalação de dependências.

1. Abra a pasta no VS Code.
2. Instale a extensão **Live Server** (ou use qualquer servidor HTTP estático).
3. Clique em "Go Live" ou execute um servidor local, por exemplo:
   ```
   npx serve .
   ```
4. Acesse o endereço indicado (ex.: `http://localhost:5500`).

O site também abre diretamente pelo navegador a partir do `index.html`, mas para o Service Worker e o manifesto funcionarem corretamente é recomendado usar um servidor local.

## Fluxo principal

```
Home → Escolher escola → Escolher endereço → Revisar corrida → Solicitar
  → Buscando motorista → Motorista encontrado → A caminho → Chegou
  → Corrida iniciada → Em andamento → Chegou à escola → Concluída → Histórico
```

Na primeira vez, o app mostra uma tela de boas-vindas onde a pessoa escolhe como quer ser chamada. O nome fica salvo no `localStorage` (`rotaedu_userName`), aparece na saudação da Home e no Perfil, e pode ser trocado em **Perfil → Preferências → Nome**. Se a URL tinha um destino (ex.: `#schedule`), ele é aberto assim que o nome é definido.

Isso **não é login**: não há senha, conta, autenticação ou validação de identidade — apenas uma preferência local. O e-mail exibido no Perfil é gerado a partir do nome escolhido (`App.getUserEmail()`), então acompanha qualquer troca; o telefone segue mockado.

## Dados mockados

Todos os dados abaixo são fictícios e existem apenas para demonstrar o protótipo:

- **Usuário**: o nome é escolhido pela própria pessoa na tela de boas-vindas (o mock "Leonardo" é só o padrão enquanto nada foi definido); o e-mail é derivado do nome (`Ana Clara` → `ana.clara@email.com`) e o telefone segue fictício.
- **Motoristas**: elenco de 6 motoristas fictícios em `MockData.drivers`. Cada um representa alguém da comunidade escolar que **já faz o trajeto todo dia** — 3 responsáveis (pai/mãe de aluno) e 3 professores — e leva estudantes como renda extra. Cada registro traz `roleType` (`responsavel` | `professor`), `role` (rótulo exibido) e `roleDetail` (vínculo com a escola), além de veículo, cor, placa, avaliação, corridas e tempo de chegada. A cada corrida solicitada, um deles é sorteado por `MockData.getRandomDriver()` e fica guardado na própria corrida — por isso o histórico mantém o motorista de cada viagem.
- **Escolas**: 10 escolas de São José dos Campos com endereço, bairro e coordenadas simuladas de mapa, em `data/schools.js`.
- **Preço e distância**: calculados por uma fórmula simples e claramente fictícia (`RidesView.computePrice`), sem relação com valores reais.
- **Mapa da Home**: ilustrativo (SVG + CSS), usado como prévia leve e disponível offline. O mapa real fica na tela de Mapa (ver seção abaixo).

Não há cadastro, edição, exclusão ou aprovação de motoristas/escolas — são apenas dados estáticos de demonstração.

## Mapa real (Leaflet + OpenStreetMap)

Além do mapa ilustrativo da Home, o app tem uma tela de **Mapa** com um mapa real e interativo de São José dos Campos, onde é possível:

- ver a região inteira, com zoom e arrasto;
- visualizar as 10 escolas como marcadores;
- tocar em uma escola para ver nome/endereço e **escolhê-la como destino**;
- alternar para o modo **“Definir embarque”**: uma mira fica fixa no centro do mapa, a pessoa arrasta o mapa (ou toca num ponto, que recentraliza a mira) e confirma pelo botão que flutua sobre o mapa — padrão pensado para o toque em celular, sem depender de acertar um alvo pequeno;
- abrir a escola ou o trajeto completo no **Google Maps** (links externos, sem chave).

Entradas para o mapa: botão “Ver mapa completo” na Home, “Escolher pelo mapa” na lista de escolas e “Escolher no mapa” na tela de endereço.

### Por que não a API JavaScript do Google Maps

A API JavaScript do Google Maps exige **chave de API e conta de faturamento**, o que contraria o requisito do projeto de não depender de APIs com chave. A solução adotada usa **Leaflet + tiles do OpenStreetMap**, que não exigem chave nem cadastro.

- **Leaflet 1.9.4** fica versionado localmente em `assets/vendor/leaflet/` (sem CDN), é carregado sob demanda ao abrir a tela de mapa e entra no cache do Service Worker — a interface do mapa abre até offline (apenas os *tiles* precisam de internet).
- **Tiles**: `tile.openstreetmap.org`, com a atribuição obrigatória exibida no mapa.
- **Endereço do ponto de embarque**: geocodificação reversa via **Nominatim** (OpenStreetMap, sem chave). Se a chamada falhar, o app cai graciosamente para as coordenadas do ponto.

### Trocando de provedor de mapa

Todo o acesso ao mapa está isolado em `js/map.js` (`MapService`), com a constante `PROVIDER` no topo. Para usar Google Maps, Mapbox ou outro serviço, basta implementar a mesma interface pública (`load`, `createMap`, `setPickupMarker`, `focusSchool`, `fitAllSchools`, `reverseGeocode`, `destroy`) — nenhuma tela precisa ser alterada.

### Sobre as coordenadas das escolas

Cada escola tem `lat`/`lng` em `data/schools.js`. São coordenadas **aproximadas do bairro**, suficientes para posicionar o marcador na região correta da cidade — não são o endereço exato conferido de cada unidade, coerente com a natureza de protótipo do projeto.

## `localStorage`

Toda persistência do protótipo é local, centralizada em `js/storage.js`:

| Chave                          | Conteúdo                          |
|--------------------------------|------------------------------------|
| `rotaedu_favoriteSchools`   | IDs das escolas favoritadas        |
| `rotaedu_rideHistory`       | Histórico de corridas concluídas   |
| `rotaedu_scheduledRides`    | Agendamentos criados               |
| `rotaedu_preferences`       | Tema e preferência de notificações |
| `rotaedu_userName`          | Nome escolhido pelo usuário        |
| `rotaedu_lastSelectedSchool`| Última escola selecionada          |

Os dados permanecem no navegador entre sessões (até que o usuário limpe os dados do site) e não são enviados a nenhum servidor.

## PWA

O projeto pode ser instalado como aplicativo (via `manifest.json` e `sw.js`), com cache básico da estrutura principal para uso offline. A instalação é **opcional**: o site funciona normalmente em qualquer navegador, com ou sem PWA instalado.

## Aviso

> Protótipo demonstrativo — funcionalidades de transporte, pagamento e comunicação são simuladas.

Esse aviso também aparece na tela de Perfil do aplicativo.
