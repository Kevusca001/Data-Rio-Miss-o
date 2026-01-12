export type MunicipioPopulacao = {
  id: string;        // código IBGE do município
  name: string;      // nome do município
  population: number;
  idebEm2023?: number | null; // IDEB Ensino Médio 2023
};

export const MUNICIPIOS_POPULACAO: Record<string, MunicipioPopulacao> = {
  "3300100": {
    id: "3300100",
    name: "Angra dos Reis",
    population: 167434,
    idebEm2023: 3.7
  },
  "3300159": {
    id: "3300159",
    name: "Aperibé",
    population: 11034,
    idebEm2023: 4.6
  },
  "3300209": {
    id: "3300209",
    name: "Araruama",
    population: 129671,
    idebEm2023: 3.5
  },
  "3300225": {
    id: "3300225",
    name: "Areal",
    population: 11828,
    idebEm2023: 3.6
  },
  "3300233": {
    id: "3300233",
    name: "Armação dos Búzios",
    population: 40006,
    idebEm2023: 3.2
  },
  "3300258": {
    id: "3300258",
    name: "Arraial do Cabo",
    population: 30986,
    idebEm2023: 4.1
  },
  "3300308": {
    id: "3300308",
    name: "Barra do Piraí",
    population: 92883,
    idebEm2023: 3.7
  },
  "3300407": {
    id: "3300407",
    name: "Barra Mansa",
    population: 169894,
    idebEm2023: 4.2
  },
  "3300456": {
    id: "3300456",
    name: "Belford Roxo",
    population: 483087,
    idebEm2023: 3.1
  },
  "3300506": {
    id: "3300506",
    name: "Bom Jardim",
    population: 28102,
    idebEm2023: 4.2
  },
  "3300605": {
    id: "3300605",
    name: "Bom Jesus do Itabapoana",
    population: 35173,
    idebEm2023: 4.5
  },
  "3300704": {
    id: "3300704",
    name: "Cabo Frio",
    population: 222161,
    idebEm2023: 3.4
  },
  "3300803": {
    id: "3300803",
    name: "Cachoeiras de Macacu",
    population: 56943,
    idebEm2023: 4.1
  },
  "3300902": {
    id: "3300902",
    name: "Cambuci",
    population: 14616,
    idebEm2023: 4
  },
  "3300936": {
    id: "3300936",
    name: "Carapebus",
    population: 13847,
    idebEm2023: null
  },
  "3300951": {
    id: "3300951",
    name: "Comendador Levy Gasparian",
    population: 8741,
    idebEm2023: 3.7
  },
  "3301009": {
    id: "3301009",
    name: "Campos dos Goytacazes",
    population: 483540,
    idebEm2023: 3.4
  },
  "3301108": {
    id: "3301108",
    name: "Cantagalo",
    population: 19390,
    idebEm2023: 4.4
  },
  "3301157": {
    id: "3301157",
    name: "Cardoso Moreira",
    population: 12958,
    idebEm2023: 4.2
  },
  "3301207": {
    id: "3301207",
    name: "Carmo",
    population: 17198,
    idebEm2023: 4.5
  },
  "3301306": {
    id: "3301306",
    name: "Casimiro de Abreu",
    population: 46110,
    idebEm2023: 3.7
  },
  "3301405": {
    id: "3301405",
    name: "Conceição de Macabu",
    population: 21104,
    idebEm2023: 3.3
  },
  "3301504": {
    id: "3301504",
    name: "Cordeiro",
    population: 20783,
    idebEm2023: 4.3
  },
  "3301603": {
    id: "3301603",
    name: "Duas Barras",
    population: 10980,
    idebEm2023: 4.2
  },
  "3301702": {
    id: "3301702",
    name: "Duque de Caxias",
    population: 808161,
    idebEm2023: 3.2
  },
  "3301801": {
    id: "3301801",
    name: "Engenheiro Paulo de Frontin",
    population: 12242,
    idebEm2023: 4.6
  },
  "3301850": {
    id: "3301850",
    name: "Guapimirim",
    population: 51696,
    idebEm2023: 3.7
  },
  "3301876": {
    id: "3301876",
    name: "Iguaba Grande",
    population: 27920,
    idebEm2023: 3.6
  },
  "3301900": {
    id: "3301900",
    name: "Itaboraí",
    population: 224267,
    idebEm2023: 3.3
  },
  "3302007": {
    id: "3302007",
    name: "Itaguaí",
    population: 116841,
    idebEm2023: 3.5
  },
  "3302056": {
    id: "3302056",
    name: "Italva",
    population: 14073,
    idebEm2023: 5
  },
  "3302106": {
    id: "3302106",
    name: "Itaocara",
    population: 22919,
    idebEm2023: 4.8
  },
  "3302205": {
    id: "3302205",
    name: "Itaperuna",
    population: 101041,
    idebEm2023: 4.6
  },
  "3302254": {
    id: "3302254",
    name: "Itatiaia",
    population: 30908,
    idebEm2023: null
  },
  "3302270": {
    id: "3302270",
    name: "Japeri",
    population: 96289,
    idebEm2023: 3.2
  },
  "3302304": {
    id: "3302304",
    name: "Laje do Muriaé",
    population: 7336,
    idebEm2023: 4.5
  },
  "3302403": {
    id: "3302403",
    name: "Macaé",
    population: 246391,
    idebEm2023: 4
  },
  "3302452": {
    id: "3302452",
    name: "Macuco",
    population: 5415,
    idebEm2023: 3.8
  },
  "3302502": {
    id: "3302502",
    name: "Magé",
    population: 228127,
    idebEm2023: 3.3
  },
  "3302601": {
    id: "3302601",
    name: "Mangaratiba",
    population: 41220,
    idebEm2023: 3.4
  },
  "3302700": {
    id: "3302700",
    name: "Maricá",
    population: 197277,
    idebEm2023: 3.3
  },
  "3302809": {
    id: "3302809",
    name: "Mendes",
    population: 17502,
    idebEm2023: 3.9
  },
  "3302858": {
    id: "3302858",
    name: "Mesquita",
    population: 167127,
    idebEm2023: 3.2
  },
  "3302908": {
    id: "3302908",
    name: "Miguel Pereira",
    population: 26582,
    idebEm2023: 4.2
  },
  "3303005": {
    id: "3303005",
    name: "Miracema",
    population: 26881,
    idebEm2023: 4.4
  },
  "3303104": {
    id: "3303104",
    name: "Natividade",
    population: 15074,
    idebEm2023: 4.6
  },
  "3303203": {
    id: "3303203",
    name: "Nilópolis",
    population: 146774,
    idebEm2023: 3.5
  },
  "3303302": {
    id: "3303302",
    name: "Niterói",
    population: 481749,
    idebEm2023: 3.5
  },
  "3303401": {
    id: "3303401",
    name: "Nova Friburgo",
    population: 189939,
    idebEm2023: 4.3
  },
  "3303500": {
    id: "3303500",
    name: "Nova Iguaçu",
    population: 785867,
    idebEm2023: 3.4
  },
  "3303609": {
    id: "3303609",
    name: "Paracambi",
    population: 41375,
    idebEm2023: 3.7
  },
  "3303708": {
    id: "3303708",
    name: "Paraíba do Sul",
    population: 42063,
    idebEm2023: 3.8
  },
  "3303807": {
    id: "3303807",
    name: "Paraty",
    population: 45243,
    idebEm2023: 3.8
  },
  "3303856": {
    id: "3303856",
    name: "Paty do Alferes",
    population: 29619,
    idebEm2023: 3.7
  },
  "3303906": {
    id: "3303906",
    name: "Petrópolis",
    population: 278881,
    idebEm2023: 3.6
  },
  "3303955": {
    id: "3303955",
    name: "Pinheiral",
    population: 24298,
    idebEm2023: 4.3
  },
  "3304003": {
    id: "3304003",
    name: "Piraí",
    population: 27474,
    idebEm2023: 3.8
  },
  "3304102": {
    id: "3304102",
    name: "Porciúncula",
    population: 17288,
    idebEm2023: 4
  },
  "3304110": {
    id: "3304110",
    name: "Porto Real",
    population: 20373,
    idebEm2023: 4.2
  },
  "3304128": {
    id: "3304128",
    name: "Quatis",
    population: 13682,
    idebEm2023: 3.7
  },
  "3304144": {
    id: "3304144",
    name: "Queimados",
    population: 140523,
    idebEm2023: 3.3
  },
  "3304151": {
    id: "3304151",
    name: "Quissamã",
    population: 22393,
    idebEm2023: 3.6
  },
  "3304201": {
    id: "3304201",
    name: "Resende",
    population: 129612,
    idebEm2023: 3.9
  },
  "3304300": {
    id: "3304300",
    name: "Rio Bonito",
    population: 56276,
    idebEm2023: 3.8
  },
  "3304409": {
    id: "3304409",
    name: "Rio Claro",
    population: 17401,
    idebEm2023: 4.4
  },
  "3304508": {
    id: "3304508",
    name: "Rio das Flores",
    population: 8954,
    idebEm2023: 4.5
  },
  "3304524": {
    id: "3304524",
    name: "Rio das Ostras",
    population: 156491,
    idebEm2023: 3.4
  },
  "3304557": {
    id: "3304557",
    name: "Rio de Janeiro",
    population: 6211223,
    idebEm2023: 3.2
  },
  "3304607": {
    id: "3304607",
    name: "Santa Maria Madalena",
    population: 10232,
    idebEm2023: null
  },
  "3304706": {
    id: "3304706",
    name: "Santo Antônio de Pádua",
    population: 41325,
    idebEm2023: 4.9
  },
  "3304755": {
    id: "3304755",
    name: "São Francisco de Itabapoana",
    population: 45059,
    idebEm2023: 3.8
  },
  "3304805": {
    id: "3304805",
    name: "São Fidélis",
    population: 38961,
    idebEm2023: 3.9
  },
  "3304904": {
    id: "3304904",
    name: "São Gonçalo",
    population: 896744,
    idebEm2023: 3.3
  },
  "3305000": {
    id: "3305000",
    name: "São João da Barra",
    population: 36573,
    idebEm2023: 3.8
  },
  "3305109": {
    id: "3305109",
    name: "São João de Meriti",
    population: 440962,
    idebEm2023: 3.3
  },
  "3305133": {
    id: "3305133",
    name: "São José de Ubá",
    population: 7070,
    idebEm2023: 4.3
  },
  "3305158": {
    id: "3305158",
    name: "São José do Vale do Rio Preto",
    population: 22080,
    idebEm2023: 4.1
  },
  "3305208": {
    id: "3305208",
    name: "São Pedro da Aldeia",
    population: 104029,
    idebEm2023: 3.8
  },
  "3305307": {
    id: "3305307",
    name: "São Sebastião do Alto",
    population: 7750,
    idebEm2023: 4
  },
  "3305406": {
    id: "3305406",
    name: "Sapucaia",
    population: 17729,
    idebEm2023: 4
  },
  "3305505": {
    id: "3305505",
    name: "Saquarema",
    population: 89559,
    idebEm2023: 3.5
  },
  "3305554": {
    id: "3305554",
    name: "Seropédica",
    population: 80596,
    idebEm2023: 4.2
  },
  "3305604": {
    id: "3305604",
    name: "Silva Jardim",
    population: 21352,
    idebEm2023: 3.5
  },
  "3305703": {
    id: "3305703",
    name: "Sumidouro",
    population: 15206,
    idebEm2023: 4.2
  },
  "3305752": {
    id: "3305752",
    name: "Tanguá",
    population: 31086,
    idebEm2023: 3.3
  },
  "3305802": {
    id: "3305802",
    name: "Teresópolis",
    population: 165123,
    idebEm2023: 3.7
  },
  "3305901": {
    id: "3305901",
    name: "Trajano de Moraes",
    population: 10302,
    idebEm2023: 4.6
  },
  "3306008": {
    id: "3306008",
    name: "Três Rios",
    population: 78346,
    idebEm2023: 3.5
  },
  "3306107": {
    id: "3306107",
    name: "Valença",
    population: 68088,
    idebEm2023: 4.4
  },
  "3306156": {
    id: "3306156",
    name: "Varre-Sai",
    population: 10207,
    idebEm2023: 3.8
  },
  "3306206": {
    id: "3306206",
    name: "Vassouras",
    population: 33976,
    idebEm2023: 4.1
  },
  "3306305": {
    id: "3306305",
    name: "Volta Redonda",
    population: 261563,
    idebEm2023: 4.2
  }
};
