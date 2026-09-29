/**
 * Escolarize — dados mock de escolas de São José dos Campos - SP.
 * Dados fictícios utilizados apenas para fins de protótipo/demonstração.
 *
 * - coords { x, y }: posição em % usada no mapa ilustrativo (simulado).
 * - lat / lng: coordenadas APROXIMADAS do bairro, usadas para posicionar o
 *   marcador no mapa real. São estimativas de protótipo, não o endereço
 *   exato conferido de cada escola.
 * - distanceKm / etaMin: valores simulados.
 */

const SCHOOLS = [
  {
    id: 1,
    name: "Colégio Poliedro – Unidade Aquarius",
    address: "Av. São João, 2500",
    neighborhood: "Jardim das Colinas",
    city: "São José dos Campos",
    state: "SP",
    type: "Particular",
    popular: true,
    distanceKm: 6.4,
    etaMin: 14,
    coords: { x: 66, y: 32 },
    lat: -23.2085,
    lng: -45.903
  },
  {
    id: 2,
    name: "Colégio Poliedro – Unidade Colinas",
    address: "Av. Dr. Eduardo Cury, 50",
    neighborhood: "Jardim das Colinas",
    city: "São José dos Campos",
    state: "SP",
    type: "Particular",
    popular: true,
    distanceKm: 6.9,
    etaMin: 15,
    coords: { x: 60, y: 40 },
    lat: -23.2126,
    lng: -45.9002
  },
  {
    id: 3,
    name: "Colégio Objetivo Aquarius",
    address: "Av. Rodrigo Reis Tuy, 1200",
    neighborhood: "Jardim Aquarius",
    city: "São José dos Campos",
    state: "SP",
    type: "Particular",
    popular: true,
    distanceKm: 5.1,
    etaMin: 12,
    coords: { x: 72, y: 26 },
    lat: -23.2247,
    lng: -45.9046
  },
  {
    id: 4,
    name: "Anglo Alante São José dos Campos",
    address: "Rua Laurent Martins, 329",
    neighborhood: "Jardim Esplanada II",
    city: "São José dos Campos",
    state: "SP",
    type: "Particular",
    popular: true,
    distanceKm: 4.3,
    etaMin: 10,
    coords: { x: 50, y: 48 },
    lat: -23.2012,
    lng: -45.8938
  },
  {
    id: 5,
    name: "Colégios Univap – Unidade Aquarius",
    address: "Rua Dr. Tertuliano Delphim Júnior, 181",
    neighborhood: "Jardim Aquarius",
    city: "São José dos Campos",
    state: "SP",
    type: "Ensino Superior",
    popular: false,
    distanceKm: 5.6,
    etaMin: 13,
    coords: { x: 76, y: 36 },
    lat: -23.2268,
    lng: -45.9012
  },
  {
    id: 6,
    name: "Colégios Univap – Unidade Centro",
    address: "Rua Paraibuna, 75",
    neighborhood: "Jardim São Dimas",
    city: "São José dos Campos",
    state: "SP",
    type: "Ensino Superior",
    popular: false,
    distanceKm: 2.1,
    etaMin: 7,
    coords: { x: 32, y: 58 },
    lat: -23.1902,
    lng: -45.8862
  },
  {
    id: 7,
    name: "EMEFI Profª Áurea Cantinho Rodrigues",
    address: "Rua Irã, 135",
    neighborhood: "Jardim Oswaldo Cruz",
    city: "São José dos Campos",
    state: "SP",
    type: "Pública",
    popular: false,
    distanceKm: 7.8,
    etaMin: 18,
    coords: { x: 18, y: 68 },
    lat: -23.2098,
    lng: -45.8712
  },
  {
    id: 8,
    name: "EMEFI Profº Felício Savastano",
    address: "Rua Capitão Raul Fagundes, 341",
    neighborhood: "Monte Castelo",
    city: "São José dos Campos",
    state: "SP",
    type: "Pública",
    popular: false,
    distanceKm: 8.5,
    etaMin: 20,
    coords: { x: 14, y: 76 },
    lat: -23.2041,
    lng: -45.8767
  },
  {
    id: 9,
    name: "EMEFI Dr. Maurício Anisse Cury",
    address: "Av. Eng. Francisco José Longo, 832",
    neighborhood: "Jardim São Dimas",
    city: "São José dos Campos",
    state: "SP",
    type: "Pública",
    popular: false,
    distanceKm: 2.6,
    etaMin: 8,
    coords: { x: 34, y: 54 },
    lat: -23.1975,
    lng: -45.8893
  },
  {
    id: 10,
    name: "EMEFI Profª Suely Antunes de Mello",
    address: "Rua Siqueira Campos, 845",
    neighborhood: "Centro",
    city: "São José dos Campos",
    state: "SP",
    type: "Pública",
    popular: false,
    distanceKm: 1.8,
    etaMin: 6,
    coords: { x: 26, y: 62 },
    lat: -23.1802,
    lng: -45.8868
  }
];
