export type MunicipioSaneamento = {
  id: string; // código IBGE
  name: string; // nome do município
  semAgua: number | null;
  semEsgoto: number | null;
  semLixo: number | null;
  inundacao: number | null;
};

export const MUNICIPIOS_SANEAMENTO: Record<string, MunicipioSaneamento> = {
  "Angra dos Reis": {
    id: "3300100",
    name: "Angra dos Reis",
    semAgua: 8,
    semEsgoto: 71.24,
    semLixo: 1,
    inundacao: 21.87
  },
  "Aperibé": {
    id: "3300159",
    name: "Aperibé",
    semAgua: 13.07,
    semEsgoto: 54.19,
    semLixo: 8.36,
    inundacao: 13.46
  },
  "Araruama": {
    id: "3300209",
    name: "Araruama",
    semAgua: 0,
    semEsgoto: 25.66,
    semLixo: 6,
    inundacao: 0.04
  },
  "Areal": {
    id: "3300225",
    name: "Areal",
    semAgua: 0.58,
    semEsgoto: null,
    semLixo: 13.07,
    inundacao: 13.55
  },
  "Armação dos Búzios": {
    id: "3300233",
    name: "Armação dos Búzios",
    semAgua: 2,
    semEsgoto: 10,
    semLixo: 0,
    inundacao: null
  },
  "Arraial do Cabo": {
    id: "3300258",
    name: "Arraial do Cabo",
    semAgua: 2,
    semEsgoto: 10,
    semLixo: 3.45,
    inundacao: null
  },
  "Barra do Piraí": {
    id: "3300308",
    name: "Barra do Piraí",
    semAgua: null,
    semEsgoto: 26.75,
    semLixo: 0.99,
    inundacao: 6.34
  },
  "Barra Mansa": {
    id: "3300407",
    name: "Barra Mansa",
    semAgua: 22.7,
    semEsgoto: 29.67,
    semLixo: 0,
    inundacao: 1.53
  },
  "Belford Roxo": {
    id: "3300456",
    name: "Belford Roxo",
    semAgua: 4.89,
    semEsgoto: 93.41,
    semLixo: 18.02,
    inundacao: null
  },
  "Bom Jardim": {
    id: "3300506",
    name: "Bom Jardim",
    semAgua: 44.66,
    semEsgoto: null,
    semLixo: 0,
    inundacao: 5.66
  },
  "Bom Jesus do Itabapoana": {
    id: "3300605",
    name: "Bom Jesus do Itabapoana",
    semAgua: 21.19,
    semEsgoto: null,
    semLixo: 0.99,
    inundacao: 10.56
  },
  "Cabo Frio": {
    id: "3300704",
    name: "Cabo Frio",
    semAgua: 2,
    semEsgoto: 10,
    semLixo: 0,
    inundacao: 2.68
  },
  "Cachoeiras de Macacu": {
    id: "3300803",
    name: "Cachoeiras de Macacu",
    semAgua: 21.67,
    semEsgoto: null,
    semLixo: 0.9,
    inundacao: 28.88
  },
  "Cambuci": {
    id: "3300902",
    name: "Cambuci",
    semAgua: 23.84,
    semEsgoto: null,
    semLixo: 16.5,
    inundacao: null
  },
  "Campos dos Goytacazes": {
    id: "3301009",
    name: "Campos dos Goytacazes",
    semAgua: 0.98,
    semEsgoto: 9.02,
    semLixo: 1.72,
    inundacao: 37.28
  },
  "Cantagalo": {
    id: "3301108",
    name: "Cantagalo",
    semAgua: 29.3,
    semEsgoto: 29.91,
    semLixo: 0.99,
    inundacao: 1.87
  },
  "Carapebus": {
    id: "3300936",
    name: "Carapebus",
    semAgua: 77.72,
    semEsgoto: 93.92,
    semLixo: 4.48,
    inundacao: 1.75
  },
  "Cardoso Moreira": {
    id: "3301157",
    name: "Cardoso Moreira",
    semAgua: 26.53,
    semEsgoto: null,
    semLixo: 1.82,
    inundacao: 46.99
  },
  "Carmo": {
    id: "3301207",
    name: "Carmo",
    semAgua: 27.13,
    semEsgoto: null,
    semLixo: 22.74,
    inundacao: 5.04
  },
  "Casimiro de Abreu": {
    id: "3301306",
    name: "Casimiro de Abreu",
    semAgua: null,
    semEsgoto: 50.66,
    semLixo: 0,
    inundacao: 2.02
  },
  "Comendador Levy Gasparian": {
    id: "3300951",
    name: "Comendador Levy Gasparian",
    semAgua: 3.88,
    semEsgoto: 0,
    semLixo: 4.54,
    inundacao: 33.68
  },
  "Conceição de Macabu": {
    id: "3301405",
    name: "Conceição de Macabu",
    semAgua: 0,
    semEsgoto: 86.45,
    semLixo: 6.17,
    inundacao: null
  },
  "Cordeiro": {
    id: "3301504",
    name: "Cordeiro",
    semAgua: 2.78,
    semEsgoto: 88.5,
    semLixo: 0,
    inundacao: 0.87
  },
  "Duas Barras": {
    id: "3301603",
    name: "Duas Barras",
    semAgua: 29.22,
    semEsgoto: null,
    semLixo: 0,
    inundacao: null
  },
  "Duque de Caxias": {
    id: "3301702",
    name: "Duque de Caxias",
    semAgua: 18.62,
    semEsgoto: 85.83,
    semLixo: 0.99,
    inundacao: 0.13
  },
  "Engenheiro Paulo de Frontin": {
    id: "3301801",
    name: "Engenheiro Paulo de Frontin",
    semAgua: 28.06,
    semEsgoto: 0,
    semLixo: 0,
    inundacao: 3.09
  },
  "Guapimirim": {
    id: "3301850",
    name: "Guapimirim",
    semAgua: 25.44,
    semEsgoto: null,
    semLixo: null,
    inundacao: null
  },
  "Iguaba Grande": {
    id: "3301876",
    name: "Iguaba Grande",
    semAgua: 2,
    semEsgoto: 10,
    semLixo: 0,
    inundacao: 1.85
  },
  "Itaboraí": {
    id: "3301900",
    name: "Itaboraí",
    semAgua: 68.46,
    semEsgoto: 98.94,
    semLixo: 0,
    inundacao: 0.9
  },
  "Itaguaí": {
    id: "3302007",
    name: "Itaguaí",
    semAgua: 26.28,
    semEsgoto: null,
    semLixo: 0,
    inundacao: null
  },
  "Italva": {
    id: "3302056",
    name: "Italva",
    semAgua: 21.66,
    semEsgoto: 0,
    semLixo: 0.99,
    inundacao: 11.41
  },
  "Itaocara": {
    id: "3302106",
    name: "Itaocara",
    semAgua: 24.34,
    semEsgoto: 16,
    semLixo: 7.6,
    inundacao: null
  },
  "Itaperuna": {
    id: "3302205",
    name: "Itaperuna",
    semAgua: 16.55,
    semEsgoto: 3.48,
    semLixo: 0,
    inundacao: 0.67
  },
  "Itatiaia": {
    id: "3302254",
    name: "Itatiaia",
    semAgua: 9.8,
    semEsgoto: 67.97,
    semLixo: 1,
    inundacao: 0.68
  },
  "Japeri": {
    id: "3302270",
    name: "Japeri",
    semAgua: 34.27,
    semEsgoto: null,
    semLixo: 0.99,
    inundacao: 12.69
  },
  "Laje do Muriaé": {
    id: "3302304",
    name: "Laje do Muriaé",
    semAgua: 8.4,
    semEsgoto: 12.3,
    semLixo: 0,
    inundacao: 17.16
  },
  "Macaé": {
    id: "3302403",
    name: "Macaé",
    semAgua: 8.2,
    semEsgoto: 67.6,
    semLixo: 0,
    inundacao: 0.23
  },
  "Macuco": {
    id: "3302452",
    name: "Macuco",
    semAgua: 12.3,
    semEsgoto: 90.57,
    semLixo: 0,
    inundacao: 22.11
  },
  "Magé": {
    id: "3302502",
    name: "Magé",
    semAgua: 33.63,
    semEsgoto: 94.14,
    semLixo: 0.96,
    inundacao: 0.19
  },
  "Mangaratiba": {
    id: "3302601",
    name: "Mangaratiba",
    semAgua: 11.29,
    semEsgoto: null,
    semLixo: 0,
    inundacao: 0.67
  },
  "Maricá": {
    id: "3302700",
    name: "Maricá",
    semAgua: 22.95,
    semEsgoto: 94.62,
    semLixo: 1.01,
    inundacao: 0.05
  },
  "Mendes": {
    id: "3302809",
    name: "Mendes",
    semAgua: 12.28,
    semEsgoto: 8.38,
    semLixo: 2.51,
    inundacao: 0.3
  },
  "Mesquita": {
    id: "3302858",
    name: "Mesquita",
    semAgua: 0.3,
    semEsgoto: 82.96,
    semLixo: 0,
    inundacao: 0.27
  },
  "Miguel Pereira": {
    id: "3302908",
    name: "Miguel Pereira",
    semAgua: 16.9,
    semEsgoto: 89.9,
    semLixo: 17.32,
    inundacao: 44.58
  },
  "Miracema": {
    id: "3303005",
    name: "Miracema",
    semAgua: 7.83,
    semEsgoto: null,
    semLixo: 10.87,
    inundacao: 3.8
  },
  "Natividade": {
    id: "3303104",
    name: "Natividade",
    semAgua: 30.2,
    semEsgoto: 20.13,
    semLixo: 0,
    inundacao: 34.86
  },
  "Nilópolis": {
    id: "3303203",
    name: "Nilópolis",
    semAgua: 0,
    semEsgoto: null,
    semLixo: 0,
    inundacao: 6.95
  },
  "Niterói": {
    id: "3303302",
    name: "Niterói",
    semAgua: 0,
    semEsgoto: 4.4,
    semLixo: 0,
    inundacao: 3.63
  },
  "Nova Friburgo": {
    id: "3303401",
    name: "Nova Friburgo",
    semAgua: 12.38,
    semEsgoto: 15.27,
    semLixo: 0,
    inundacao: 5.94
  },
  "Nova Iguaçu": {
    id: "3303500",
    name: "Nova Iguaçu",
    semAgua: 1.09,
    semEsgoto: 69.95,
    semLixo: 0,
    inundacao: 5.33
  },
  "Paracambi": {
    id: "3303609",
    name: "Paracambi",
    semAgua: 54.59,
    semEsgoto: 15.99,
    semLixo: 0.98,
    inundacao: 41.46
  },
  "Paraíba do Sul": {
    id: "3303708",
    name: "Paraíba do Sul",
    semAgua: 12.3,
    semEsgoto: 16.94,
    semLixo: 3.49,
    inundacao: 0.24
  },
  "Paraty": {
    id: "3303807",
    name: "Paraty",
    semAgua: null,
    semEsgoto: 95.9,
    semLixo: 0,
    inundacao: 18.23
  },
  "Paty do Alferes": {
    id: "3303856",
    name: "Paty do Alferes",
    semAgua: 32.3,
    semEsgoto: 98.03,
    semLixo: 0,
    inundacao: 6.18
  },
  "Petrópolis": {
    id: "3303906",
    name: "Petrópolis",
    semAgua: 5.69,
    semEsgoto: 17.59,
    semLixo: 8.65,
    inundacao: 2.66
  },
  "Pinheiral": {
    id: "3303955",
    name: "Pinheiral",
    semAgua: 13.46,
    semEsgoto: null,
    semLixo: 0.99,
    inundacao: 0.51
  },
  "Piraí": {
    id: "3304003",
    name: "Piraí",
    semAgua: 19.84,
    semEsgoto: 93.12,
    semLixo: 0,
    inundacao: 19.64
  },
  "Porciúncula": {
    id: "3304102",
    name: "Porciúncula",
    semAgua: 22.2,
    semEsgoto: null,
    semLixo: 0,
    inundacao: 51.16
  },
  "Porto Real": {
    id: "3304110",
    name: "Porto Real",
    semAgua: 1.01,
    semEsgoto: 1.5,
    semLixo: 0,
    inundacao: null
  },
  "Quatis": {
    id: "3304128",
    name: "Quatis",
    semAgua: 0.9,
    semEsgoto: 3.9,
    semLixo: 0.99,
    inundacao: 1.02
  },
  "Queimados": {
    id: "3304144",
    name: "Queimados",
    semAgua: 5.12,
    semEsgoto: null,
    semLixo: 0.99,
    inundacao: 3.22
  },
  "Quissamã": {
    id: "3304151",
    name: "Quissamã",
    semAgua: 20.81,
    semEsgoto: 23.02,
    semLixo: 0,
    inundacao: 3.06
  },
  "Resende": {
    id: "3304201",
    name: "Resende",
    semAgua: 6.21,
    semEsgoto: 6.3,
    semLixo: 0,
    inundacao: 0.91
  },
  "Rio Bonito": {
    id: "3304300",
    name: "Rio Bonito",
    semAgua: 32.21,
    semEsgoto: null,
    semLixo: 8.25,
    inundacao: null
  },
  "Rio Claro": {
    id: "3304409",
    name: "Rio Claro",
    semAgua: 33.55,
    semEsgoto: 14.64,
    semLixo: 30.88,
    inundacao: 3.43
  },
  "Rio das Flores": {
    id: "3304508",
    name: "Rio das Flores",
    semAgua: 25.84,
    semEsgoto: 27.37,
    semLixo: 22.87,
    inundacao: 0.44
  },
  "Rio das Ostras": {
    id: "3304524",
    name: "Rio das Ostras",
    semAgua: 27.95,
    semEsgoto: 97.45,
    semLixo: 0,
    inundacao: 8.25
  },
  "Rio de Janeiro": {
    id: "3304557",
    name: "Rio de Janeiro",
    semAgua: 10.83,
    semEsgoto: 12.94,
    semLixo: 0.99,
    inundacao: 3.82
  },
  "Santa Maria Madalena": {
    id: "3304607",
    name: "Santa Maria Madalena",
    semAgua: 52.19,
    semEsgoto: 54.38,
    semLixo: 7.04,
    inundacao: 9.35
  },
  "Santo Antônio de Pádua": {
    id: "3304706",
    name: "Santo Antônio de Pádua",
    semAgua: 23.57,
    semEsgoto: 19.74,
    semLixo: 4.17,
    inundacao: 19.54
  },
  "São Fidélis": {
    id: "3304805",
    name: "São Fidélis",
    semAgua: 29.13,
    semEsgoto: 96.52,
    semLixo: 0,
    inundacao: 35.22
  },
  "São Francisco de Itabapoana": {
    id: "3304755",
    name: "São Francisco de Itabapoana",
    semAgua: 49,
    semEsgoto: null,
    semLixo: null,
    inundacao: null
  },
  "São Gonçalo": {
    id: "3304904",
    name: "São Gonçalo",
    semAgua: 4.14,
    semEsgoto: 88.93,
    semLixo: 0.62,
    inundacao: 29.4
  },
  "São João da Barra": {
    id: "3305000",
    name: "São João da Barra",
    semAgua: 0,
    semEsgoto: 0,
    semLixo: 1.4,
    inundacao: 1.83
  },
  "São João de Meriti": {
    id: "3305109",
    name: "São João de Meriti",
    semAgua: 10.04,
    semEsgoto: 35.89,
    semLixo: 11.76,
    inundacao: 12.2
  },
  "São José de Ubá": {
    id: "3305133",
    name: "São José de Ubá",
    semAgua: 50.02,
    semEsgoto: null,
    semLixo: 0,
    inundacao: 0.27
  },
  "São José do Vale do Rio Preto": {
    id: "3305158",
    name: "São José do Vale do Rio Preto",
    semAgua: 55.52,
    semEsgoto: 27.81,
    semLixo: 3.6,
    inundacao: 3.8
  },
  "São Pedro da Aldeia": {
    id: "3305208",
    name: "São Pedro da Aldeia",
    semAgua: 2,
    semEsgoto: 10,
    semLixo: 6.52,
    inundacao: null
  },
  "São Sebastião do Alto": {
    id: "3305307",
    name: "São Sebastião do Alto",
    semAgua: 48.15,
    semEsgoto: null,
    semLixo: 0,
    inundacao: 18
  },
  "Sapucaia": {
    id: "3305406",
    name: "Sapucaia",
    semAgua: 11.66,
    semEsgoto: 41.36,
    semLixo: 0,
    inundacao: 5.41
  },
  "Saquarema": {
    id: "3305505",
    name: "Saquarema",
    semAgua: null,
    semEsgoto: 32.67,
    semLixo: 2.31,
    inundacao: null
  },
  "Seropédica": {
    id: "3305554",
    name: "Seropédica",
    semAgua: 40.45,
    semEsgoto: 99.55,
    semLixo: 0,
    inundacao: 0.15
  },
  "Silva Jardim": {
    id: "3305604",
    name: "Silva Jardim",
    semAgua: 8.03,
    semEsgoto: 50.2,
    semLixo: 8.63,
    inundacao: null
  },
  "Sumidouro": {
    id: "3305703",
    name: "Sumidouro",
    semAgua: 79.27,
    semEsgoto: null,
    semLixo: null,
    inundacao: null
  },
  "Tanguá": {
    id: "3305752",
    name: "Tanguá",
    semAgua: 45.65,
    semEsgoto: 33.25,
    semLixo: 8.05,
    inundacao: 21.78
  },
  "Teresópolis": { id: "3305802", name: "Teresópolis", semAgua: null, semEsgoto: null, semLixo: null, inundacao: null },
  "Trajano de Moraes": { id: "3305901", name: "Trajano de Moraes", semAgua: null, semEsgoto: null, semLixo: null, inundacao: null },
  "Três Rios": { id: "3306008", name: "Três Rios", semAgua: null, semEsgoto: null, semLixo: null, inundacao: null },
  "Valença": { id: "3306107", name: "Valença", semAgua: null, semEsgoto: null, semLixo: null, inundacao: null },
  "Varre-Sai": { id: "3306156", name: "Varre-Sai", semAgua: null, semEsgoto: null, semLixo: null, inundacao: null },
  "Vassouras": { id: "3306206", name: "Vassouras", semAgua: null, semEsgoto: null, semLixo: null, inundacao: null },
  "Volta Redonda": { id: "3306305", name: "Volta Redonda", semAgua: null, semEsgoto: null, semLixo: null, inundacao: null }
};