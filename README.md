# Escolarize

Plataforma web de corridas escolares — um protótipo funcional para estudantes e responsáveis solicitarem corridas para escolas de São José dos Campos - SP.

## Objetivo

O Escolarize simula, de ponta a ponta, a experiência de um aplicativo real de mobilidade escolar: escolher uma escola, informar o endereço de embarque, revisar e solicitar uma corrida, acompanhar um motorista (mock) até a chegada na escola, concluir a corrida, avaliar o motorista e consultar o histórico. Também é possível favoritar escolas e agendar corridas com antecedência.

**Este é um protótipo demonstrativo.** Não há backend, banco de dados, autenticação, pagamento real ou comunicação real com motoristas — tudo é simulado no navegador.

## Tecnologias

- HTML5
- CSS3 (mobile-first, com suporte a tema claro/escuro)
- JavaScript (ES6+, vanilla, sem frameworks)
- `localStorage` para persistência local
- PWA (manifest + Service Worker)

Nenhuma dependência de backend, banco de dados, login ou API paga é utilizada. Os únicos recursos externos são a fonte Inter (Google Fonts, via CDN).

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
    └── icons/                # ícones do PWA (SVG)
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

Não existe tela de login: o app abre diretamente na Home com um usuário mockado (Leonardo).

## Dados mockados

Todos os dados abaixo são fictícios e existem apenas para demonstrar o protótipo:

- **Usuário**: Leonardo (nome, e-mail e telefone fictícios).
- **Motorista**: Rafael Martins, veículo, placa, avaliação e tempo de chegada — tudo simulado via `js/mockData.js`.
- **Escolas**: 10 escolas de São José dos Campos com endereço, bairro e coordenadas simuladas de mapa, em `data/schools.js`.
- **Preço e distância**: calculados por uma fórmula simples e claramente fictícia (`RidesView.computePrice`), sem relação com valores reais.
- **Mapa**: totalmente ilustrativo (SVG + CSS), sem integração com serviços de mapas reais.

Não há cadastro, edição, exclusão ou aprovação de motoristas/escolas — são apenas dados estáticos de demonstração.

## `localStorage`

Toda persistência do protótipo é local, centralizada em `js/storage.js`:

| Chave                          | Conteúdo                          |
|--------------------------------|------------------------------------|
| `escolarize_favoriteSchools`   | IDs das escolas favoritadas        |
| `escolarize_rideHistory`       | Histórico de corridas concluídas   |
| `escolarize_scheduledRides`    | Agendamentos criados               |
| `escolarize_preferences`       | Tema e preferência de notificações |
| `escolarize_lastSelectedSchool`| Última escola selecionada          |

Os dados permanecem no navegador entre sessões (até que o usuário limpe os dados do site) e não são enviados a nenhum servidor.

## PWA

O projeto pode ser instalado como aplicativo (via `manifest.json` e `sw.js`), com cache básico da estrutura principal para uso offline. A instalação é **opcional**: o site funciona normalmente em qualquer navegador, com ou sem PWA instalado.

## Aviso

> Protótipo demonstrativo — funcionalidades de transporte, pagamento e comunicação são simuladas.

Esse aviso também aparece na tela de Perfil do aplicativo.
