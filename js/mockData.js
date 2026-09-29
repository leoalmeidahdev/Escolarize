/**
 * RotaEdu — dados fictícios (usuário, motorista, notificações, rotas populares).
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

  /**
   * Motoristas são pessoas da própria comunidade escolar que já fazem o
   * trajeto todo dia — responsáveis levando os filhos ou professores indo
   * trabalhar — e oferecem carona para os estudantes como renda extra.
   *
   * roleType: "responsavel" | "professor"  (uso interno/filtros)
   * role:     rótulo curto exibido na interface
   * roleDetail: vínculo com a escola, explica por que já faz o trajeto
   */
  drivers: [
    {
      name: "Rafael Martins",
      roleType: "responsavel",
      role: "Pai de aluno",
      roleDetail: "Leva o filho todo dia ao Colégio Poliedro – Aquarius",
      rating: 4.9,
      vehicle: "Mercedes-Benz Sprinter",
      color: "Amarela",
      plate: "ABC1D23",
      etaMin: 4,
      initials: "R",
      phone: "(12) 98888-7777",
      trips: 1842
    },
    {
      name: "Camila Ferreira",
      roleType: "responsavel",
      role: "Mãe de aluna",
      roleDetail: "Leva a filha todo dia ao Colégio Objetivo Aquarius",
      rating: 4.8,
      vehicle: "Renault Master",
      color: "Branca",
      plate: "DEF4G56",
      etaMin: 5,
      initials: "C",
      phone: "(12) 97777-6655",
      trips: 980
    },
    {
      name: "João Pedro Souza",
      roleType: "professor",
      role: "Professor",
      roleDetail: "Dá aula nos Colégios Univap – Unidade Centro",
      rating: 4.7,
      vehicle: "Iveco Daily",
      color: "Prata",
      plate: "HIJ7K89",
      etaMin: 6,
      initials: "J",
      phone: "(12) 96666-5544",
      trips: 1523
    },
    {
      name: "Beatriz Lima",
      roleType: "responsavel",
      role: "Mãe de aluno",
      roleDetail: "Leva o filho todo dia ao Anglo Alante",
      rating: 5.0,
      vehicle: "Fiat Ducato",
      color: "Amarela",
      plate: "LMN0P12",
      etaMin: 3,
      initials: "B",
      phone: "(12) 95555-4433",
      trips: 612
    },
    {
      name: "Thiago Alves",
      roleType: "professor",
      role: "Professor",
      roleDetail: "Dá aula no Colégio Poliedro – Unidade Colinas",
      rating: 4.9,
      vehicle: "Peugeot Boxer",
      color: "Branca",
      plate: "QRS3T45",
      etaMin: 7,
      initials: "T",
      phone: "(12) 94444-3322",
      trips: 2104
    },
    {
      name: "Vanessa Costa",
      roleType: "professor",
      role: "Professora",
      roleDetail: "Dá aula na EMEFI Profª Suely Antunes de Mello",
      rating: 4.8,
      vehicle: "Volkswagen Kombi",
      color: "Prata",
      plate: "UVW6X78",
      etaMin: 4,
      initials: "V",
      phone: "(12) 93333-2211",
      trips: 455
    }
  ],

  /** Sorteia um motorista do elenco fictício. */
  getRandomDriver: function () {
    return MockData.drivers[Math.floor(Math.random() * MockData.drivers.length)];
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
      title: "Bem-vindo ao RotaEdu!",
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
