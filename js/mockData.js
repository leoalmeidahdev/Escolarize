/**
 * Escolarize — dados fictícios (usuário, motorista, notificações, rotas populares).
 * Nenhum dado aqui é real. Servem apenas para demonstrar o protótipo.
 */

const MockData = {
  user: {
    name: "Leonardo",
    email: "leonardo@email.com",
    phone: "(12) 99999-9999",
    initials: "L",
    defaultAddress: "Rua Paraibuna, 109 - São José dos Campos - SP"
  },

  savedAddresses: [
    { id: "home", label: "Casa", address: "Rua Paraibuna, 109 - São José dos Campos - SP" },
    { id: "work", label: "Trabalho", address: "Av. Dr. Nelson D'Ávila, 411 - São José dos Campos - SP" }
  ],

  driver: {
    name: "Rafael Martins",
    rating: 4.9,
    vehicle: "Mercedes-Benz Sprinter",
    color: "Amarela",
    plate: "ABC1D23",
    etaMin: 4,
    initials: "R",
    phone: "(12) 98888-7777",
    trips: 1842
  },

  popularRoutes: [
    {
      id: "route-1",
      originLabel: "Jardim Aquarius",
      schoolId: 1,
      destinationLabel: "Colégio Poliedro",
      time: "14 min",
      price: "R$ 24,90"
    },
    {
      id: "route-2",
      originLabel: "Centro",
      schoolId: 6,
      destinationLabel: "Univap",
      time: "7 min",
      price: "R$ 9,90"
    },
    {
      id: "route-3",
      originLabel: "Esplanada",
      schoolId: 4,
      destinationLabel: "Anglo",
      time: "10 min",
      price: "R$ 15,90"
    }
  ],

  notifications: [
    {
      id: "n1",
      title: "Bem-vindo ao Escolarize!",
      body: "Escolha uma escola e solicite sua primeira corrida.",
      time: "09:00",
      read: false
    },
    {
      id: "n2",
      title: "Segurança em primeiro lugar",
      body: "Conheça os recursos de segurança pensados para o transporte escolar.",
      time: "09:02",
      read: false
    },
    {
      id: "n3",
      title: "Novidade",
      body: "Agora você pode agendar corridas com antecedência.",
      time: "Ontem",
      read: true
    }
  ]
};
