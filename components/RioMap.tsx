
import React, { useEffect, useMemo, useState } from "react";
import {
  MUNICIPIOS_POPULACAO,
  MunicipioPopulacao,
} from "../data/municipiosPopulacao";
import { MUNICIPIOS_SANEAMENTO } from "../data/municipiosSaneamento";
import { MUNICIPIOS_IDH } from "../data/municipiosIDH";
import { MUNICIPIOS_TAXA_HOMICIDIOS } from "../data/municipiosTaxaHomicidios";
import { Layers, Info, ChevronDown, ChevronUp } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

// Using a more stable public URL for RJ Municipalities GeoJSON to avoid signed URL expiration
const MAP_URL = "https://raw.githubusercontent.com/tbrugz/geodata-br/master/geojson/geojs-33-mun.json";

type GeoFeature = {
  type: "Feature";
  properties: {
    id?: string;
    name?: string;
    description?: string;
    [key: string]: any;
  };
  geometry: {
    type: "Polygon" | "MultiPolygon";
    coordinates: any;
  };
};

type GeoData = {
  type: "FeatureCollection";
  features: GeoFeature[];
};

const MAP_WIDTH = 800;
const MAP_HEIGHT = 500;

const COLORS = {
  LEVEL_1: "#e3f2fd",
  LEVEL_2: "#bbdefb",
  LEVEL_3: "#64b5f6",
  LEVEL_4: "#1976d2",
  LEVEL_5: "#004a80",
  LEVEL_6: "#001f3f",
  NODATA: "#4b5563"
};

const getPopFromFeature = (f: GeoFeature): MunicipioPopulacao | null => {
  const rawId = f.properties?.id;
  if (!rawId) return null;
  const id = String(rawId);
  return MUNICIPIOS_POPULACAO[id] ?? null;
};

const formatCobertura = (sem: number | null | undefined): string => {
  if (sem === null || sem === undefined) return "Sem dado informado";
  const valor = Math.max(0, Math.min(100, 100 - sem));
  return `${valor.toFixed(1).replace(".", ",")}% de cobertura`;
};

const getLayerValue = (id: string | undefined, name: string | undefined, layer: string) => {
  if (!name) return null;
  switch (layer) {
    case "idh": return MUNICIPIOS_IDH[name]?.idh ?? null;
    case "ideb": return id ? (MUNICIPIOS_POPULACAO[id]?.idebEm2023 ?? null) : null;
    case "agua": {
      const s = MUNICIPIOS_SANEAMENTO[name];
      return s && s.semAgua != null ? 100 - s.semAgua : null;
    }
    case "esgoto": {
      const s = MUNICIPIOS_SANEAMENTO[name];
      return s && s.semEsgoto != null ? 100 - s.semEsgoto : null;
    }
    case "lixo": {
      const s = MUNICIPIOS_SANEAMENTO[name];
      return s && s.semLixo != null ? 100 - s.semLixo : null;
    }
    case "taxaHomicidios": return MUNICIPIOS_TAXA_HOMICIDIOS[name] ?? null;
    default: return null;
  }
};

const getColorScale = (value: number | null, layer: string) => {
  if (value === null || value === undefined) return COLORS.NODATA;
  if (layer === 'idh') {
     if (value >= 0.800) return COLORS.LEVEL_6;
     if (value >= 0.750) return COLORS.LEVEL_5;
     if (value >= 0.700) return COLORS.LEVEL_4;
     if (value >= 0.650) return COLORS.LEVEL_3;
     if (value >= 0.600) return COLORS.LEVEL_2;
     return COLORS.LEVEL_1;
  }
  if (layer === 'ideb') {
      if (value >= 5.0) return COLORS.LEVEL_6;
      if (value >= 4.5) return COLORS.LEVEL_5;
      if (value >= 4.0) return COLORS.LEVEL_4;
      if (value >= 3.5) return COLORS.LEVEL_3;
      if (value >= 3.0) return COLORS.LEVEL_2;
      return COLORS.LEVEL_1;
  }
  if (layer === 'taxaHomicidios') {
    if (value >= 60) return COLORS.LEVEL_6;
    if (value >= 40) return COLORS.LEVEL_5;
    if (value >= 20) return COLORS.LEVEL_4;
    if (value >= 10) return COLORS.LEVEL_3;
    if (value >= 5) return COLORS.LEVEL_2;
    return COLORS.LEVEL_1;
  }
  if (value >= 90) return COLORS.LEVEL_6;
  if (value >= 80) return COLORS.LEVEL_5;
  if (value >= 70) return COLORS.LEVEL_4;
  if (value >= 60) return COLORS.LEVEL_3;
  if (value >= 50) return COLORS.LEVEL_2;
  return COLORS.LEVEL_1;
};

export default function RioMap() {
  const { theme } = useTheme();
  const [geoData, setGeoData] = useState<GeoData | null>(null);
  const [hoverFeature, setHoverFeature] = useState<GeoFeature | null>(null);
  const [layer, setLayer] = useState<"normal" | "idh" | "ideb" | "agua" | "esgoto" | "lixo" | "taxaHomicidios">("normal");
  const [isLayersOpen, setIsLayersOpen] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const isLight = theme === 'light';

  useEffect(() => {
    fetch(MAP_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setGeoData(data);
        setFetchError(null);
      })
      .catch((err) => {
        console.error("Erro carregando o mapa:", err);
        setFetchError("Erro ao carregar os dados geográficos do Rio de Janeiro.");
      });
  }, []);

  const { paths } = useMemo(() => {
    if (!geoData || !geoData.features) return { paths: [] };
    let minLon = Infinity, maxLon = -Infinity, minLat = Infinity, maxLat = -Infinity;
    geoData.features.forEach((feature) => {
      const walk = (arr: any) => {
        if (typeof arr[0] === "number") {
          const [lon, lat] = arr;
          if (lon < minLon) minLon = lon; if (lon > maxLon) maxLon = lon;
          if (lat < minLat) minLat = lat; if (lat > maxLat) maxLat = lat;
        } else arr.forEach(walk);
      };
      walk(feature.geometry.coordinates);
    });
    const project = (lon: number, lat: number): [number, number] => [
      ((lon - minLon) / (maxLon - minLon)) * MAP_WIDTH,
      ((maxLat - lat) / (maxLat - minLat)) * MAP_HEIGHT
    ];
    const featurePaths = geoData.features.map((feature) => {
      const buildPathFromRings = (rings: any): string => rings.map((ring: any) => ring.map((coord: [number, number], idx: number) => {
        const [x, y] = project(coord[0], coord[1]);
        return `${idx === 0 ? "M" : "L"} ${x} ${y}`;
      }).join(" ") + " Z").join(" ");
      let d = feature.geometry.type === "Polygon" ? buildPathFromRings(feature.geometry.coordinates) :
              feature.geometry.coordinates.map((polygon: any) => buildPathFromRings(polygon)).join(" ");
      return { d, feature };
    });
    return { paths: featurePaths };
  }, [geoData]);

  if (fetchError) return <p className="text-red-600 text-center mt-4 font-bold">{fetchError}</p>;
  if (!geoData) return <p className="text-nexus-yellowHover dark:text-nexus-yellow text-center mt-4 animate-pulse font-bold">Carregando mapa interativo do Rio de Janeiro...</p>;

  const municipioInfo = hoverFeature ? getPopFromFeature(hoverFeature) : null;
  const saneamento = hoverFeature && hoverFeature.properties.name ? MUNICIPIOS_SANEAMENTO[hoverFeature.properties.name] : null;

  const legendData = (() => {
    if (layer === 'idh') return { title: 'Índice de Desenvolvimento Humano (IDH)', labels: ['< 0,60', '0,60-0,65', '0,65-0,70', '0,70-0,75', '0,75-0,80', '> 0,80'] };
    if (layer === 'ideb') return { title: 'IDEB (Ensino Médio 2023)', labels: ['< 3,0', '3,0-3,5', '3,5-4,0', '4,0-4,5', '4,5-5,0', '> 5,0'] };
    if (layer === 'taxaHomicidios') return { title: 'Taxa de Homicídios (por 100 mil hab.)', labels: ['< 5', '5-10', '10-20', '20-40', '40-60', '> 60'] };
    return { title: 'Percentual de Cobertura (%)', labels: ['< 50%', '50%-60%', '60%-70%', '70%-80%', '80%-90%', '> 90%'] };
  })();

  return (
    <div className="flex flex-col items-center mt-4 w-full max-w-6xl mx-auto px-4">
      <div className="flex flex-col md:flex-row gap-6 w-full items-stretch justify-center">
        {/* Info Card */}
        <div className="w-full md:w-[320px] flex-shrink-0 flex flex-col justify-between bg-white dark:bg-slate-900/60 border border-gray-300 dark:border-slate-700/50 rounded-[20px] shadow-sm dark:shadow-[0_18px_45px_rgba(0,0,0,0.4)] p-6 transition-all duration-300 text-gray-900 dark:text-white">
          <div>
            <div className="flex items-start justify-between mb-4">
               <h3 className="text-xl font-bold text-nexus-yellowHover dark:text-nexus-yellow tracking-tight leading-tight">
                  {hoverFeature ? (hoverFeature.properties?.name || "Município") : "Explore o Mapa"}
                </h3>
                {hoverFeature && <Info size={16} className="text-gray-500 dark:text-nexus-muted mt-1" />}
            </div>
            {hoverFeature ? (
              municipioInfo ? (
                <div className="space-y-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-600 dark:text-slate-400 font-bold uppercase tracking-widest">População Estimada</span>
                    <span className="text-lg font-black text-gray-800 dark:text-slate-200">{municipioInfo.population.toLocaleString("pt-BR")} hab.</span>
                  </div>
                  
                  {layer === 'taxaHomicidios' && (
                    <div className="mt-2 p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10">
                      <p className="text-[10px] text-gray-600 dark:text-slate-400 mb-2 uppercase font-bold tracking-widest">Segurança Pública</p>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-medium"><span className="text-gray-600 dark:text-slate-400">Taxa p/ 100k:</span><span className="text-nexus-yellowHover dark:text-nexus-yellow font-bold">{(MUNICIPIOS_TAXA_HOMICIDIOS[municipioInfo.name] || 0).toFixed(1).replace(".", ",")}</span></div>
                        <div className="flex justify-between text-xs font-medium"><span className="text-gray-600 dark:text-slate-400">Homicídios (est.):</span><span className="text-gray-800 dark:text-slate-200">{Math.round(((MUNICIPIOS_TAXA_HOMICIDIOS[municipioInfo.name] || 0) * municipioInfo.population) / 100000)}</span></div>
                      </div>
                    </div>
                  )}
                  
                  {layer !== "normal" && layer !== 'taxaHomicidios' && (
                    <div className="mt-2 p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10">
                        <p className="text-[10px] text-gray-600 dark:text-slate-400 mb-2 uppercase font-bold tracking-widest">{layer}</p>
                        <span className="text-3xl font-black text-nexus-yellowHover dark:text-nexus-yellow block">
                            {(() => {
                              const v = getLayerValue(municipioInfo.id, municipioInfo.name, layer);
                              return v === null ? "S/D" : v.toFixed(layer === 'idh' ? 3 : 1).replace(".", ",");
                            })()}{['agua', 'esgoto', 'lixo'].includes(layer) && "%"}
                        </span>
                    </div>
                  )}
                  
                  {layer === 'normal' && saneamento && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-white/10 space-y-3">
                      <p className="text-[10px] font-black text-gray-600 dark:text-slate-500 uppercase tracking-widest">Saneamento Básico</p>
                      <div className="flex justify-between items-center text-xs font-bold text-gray-700 dark:text-slate-400">Água: <span className="text-gray-800 dark:text-slate-200">{formatCobertura(saneamento.semAgua)}</span></div>
                      <div className="flex justify-between items-center text-xs font-bold text-gray-700 dark:text-slate-400">Esgoto: <span className="text-gray-800 dark:text-slate-200">{formatCobertura(saneamento.semEsgoto)}</span></div>
                      <div className="flex justify-between items-center text-xs font-bold text-gray-700 dark:text-slate-400">Lixo: <span className="text-gray-800 dark:text-slate-200">{formatCobertura(saneamento.semLixo)}</span></div>
                    </div>
                  )}
                </div>
              ) : <p className="text-sm text-gray-600 font-medium italic">Dados indisponíveis para este município.</p>
            ) : <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed font-medium">Passe o mouse ou toque nos municípios para carregar indicadores estatísticos em tempo real.</p>}
          </div>
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-white/5 text-[10px] text-gray-600 dark:text-slate-500 font-bold uppercase tracking-widest">
            {layer !== 'normal' ? 'Filtragem temática ativa' : 'Visão Geral do Estado'}
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 flex flex-col items-center">
            <div className="relative w-full max-w-[800px] flex justify-center bg-white dark:bg-slate-900/30 rounded-2xl border border-gray-300 dark:border-slate-800/50 p-4 min-h-[400px] transition-colors duration-300 shadow-sm">
                <svg width="100%" height="100%" viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} className="max-w-[420px] md:max-w-full h-auto drop-shadow-md dark:drop-shadow-2xl">
                    {paths.map(({ d, feature }, idx) => {
                      const isHovered = hoverFeature === feature;
                      const value = layer === 'normal' ? null : getLayerValue(feature.properties?.id, feature.properties?.name, layer);
                      
                      // Lógica de Cores dos Municípios com alto contraste no Light Mode
                      let fillColor;
                      if (layer === 'normal') {
                        if (isHovered) {
                            // Amarelo Nexus para destaque em ambos os modos
                            fillColor = "#FFD700"; 
                        } else {
                            // Cinza escuro (gray-400) no Light Mode e Quase Preto no Dark
                            fillColor = isLight ? "#9ca3af" : "#1a1a1a"; 
                        }
                      } else {
                        // Thematic layers use specific scale
                        fillColor = getColorScale(value, layer);
                      }

                      // Bordas de alto contraste: Cinza chumbo (gray-600) no Light e Amarelo no Dark
                      const strokeColor = isLight ? "#4b5563" : "#FFD700";
                      const strokeWidth = isLight ? 1.5 : 0.5;

                      return (
                          <path 
                            key={idx} 
                            d={d} 
                            fill={fillColor} 
                            stroke={strokeColor} 
                            strokeWidth={strokeWidth}
                            onMouseEnter={() => setHoverFeature(feature)} 
                            onMouseLeave={() => setHoverFeature(null)}
                            className="transition-all duration-300 cursor-pointer hover:opacity-95"
                          >
                            <title>{feature.properties?.name}</title>
                          </path>
                      );
                    })}
                </svg>

                {/* Layer Toggle Floating Button */}
                <div className={`absolute top-4 right-4 flex flex-col bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-xl border border-gray-400 dark:border-slate-700/50 shadow-lg z-10 transition-all duration-300 origin-top-right overflow-hidden ${isLayersOpen ? 'w-56' : 'w-32'}`}>
                     <button onClick={() => setIsLayersOpen(!isLayersOpen)} className="flex items-center justify-between px-3 py-2.5 w-full text-left hover:bg-gray-200 dark:hover:bg-white/5 transition-colors">
                         <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-gray-600 dark:text-slate-400"><Layers size={14} className="text-nexus-yellowHover dark:text-nexus-yellow" /> CAMADAS</div>
                         {isLayersOpen ? <ChevronUp size={14} className="text-gray-500 dark:text-slate-400" /> : <ChevronDown size={14} className="text-gray-500 dark:text-slate-400" />}
                     </button>
                     {isLayersOpen && (
                         <div className="flex flex-col gap-1 p-2 pt-0 animate-in slide-in-from-top-2 duration-200">
                            {[["normal", "Físico / Político"], ["idh", "IDH"], ["ideb", "IDEB Educação"], ["agua", "Saneamento: Água"], ["esgoto", "Saneamento: Esgoto"], ["lixo", "Coleta de Lixo"], ["taxaHomicidios", "Segurança: Homicídios"]].map(([key, label]) => (
                                <button 
                                    key={key} 
                                    onClick={() => setLayer(key as any)} 
                                    className={`text-[11px] font-bold px-3 py-2 rounded-lg text-left transition-all border ${layer === key ? "bg-nexus-yellowHover dark:bg-blue-600 text-black dark:text-white border-nexus-yellowHover dark:border-blue-400 shadow-sm" : "bg-transparent text-gray-600 dark:text-slate-400 border-transparent hover:bg-gray-100 dark:hover:bg-white/10 hover:text-black dark:hover:text-white"}`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                     )}
                </div>
            </div>

            {/* Legenda */}
            {layer !== "normal" && (
                <div className="mt-6 flex flex-col items-center animate-in fade-in duration-500">
                    <span className="text-[10px] text-gray-600 dark:text-slate-400 mb-3 font-bold uppercase tracking-widest">{legendData.title}</span>
                    <div className="flex items-center gap-0.5 p-1.5 bg-white dark:bg-slate-900/50 rounded-xl border border-gray-300 dark:border-slate-800 shadow-sm">
                        {[COLORS.LEVEL_1, COLORS.LEVEL_2, COLORS.LEVEL_3, COLORS.LEVEL_4, COLORS.LEVEL_5, COLORS.LEVEL_6].map((color, idx) => (
                            <div key={idx} className="flex flex-col items-center group relative">
                                <div className="h-2.5 w-12 md:w-16 first:rounded-l-md last:rounded-r-md hover:scale-110 transition-transform cursor-help" style={{ backgroundColor: color }} />
                                <span className="text-[9px] text-gray-600 dark:text-slate-500 mt-1.5 font-bold">{legendData.labels[idx]}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
