
import React, { useState, useEffect } from 'react';
import { X, Search, MapPin, Tag } from 'lucide-react';
import { LOCATIONS, THEMES } from '../data/locations';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (metadata: { region: string; municipality: string; theme: string }) => void;
  initialData?: { region?: string; municipality?: string; theme?: string };
}

const PublishModal: React.FC<PublishModalProps> = ({ isOpen, onClose, onConfirm, initialData }) => {
  const [region, setRegion] = useState('');
  const [municipality, setMunicipality] = useState('');
  const [theme, setTheme] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen && initialData) {
      setRegion(initialData.region || '');
      setMunicipality(initialData.municipality || '');
      setTheme(initialData.theme || '');
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  // Filter municipalities based on search and selected region
  const getFilteredMunicipalities = () => {
    let cities: string[] = [];
    if (region) {
      cities = LOCATIONS[region] || [];
    } else {
      // Flatten all cities if no region selected
      cities = Object.values(LOCATIONS).flat();
    }

    if (searchTerm) {
      return cities.filter(c => c.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    return cities;
  };

  const handleMunicipalitySelect = (city: string) => {
    setMunicipality(city);
    // Auto-select region if not selected
    if (!region) {
      const foundRegion = Object.entries(LOCATIONS).find(([reg, cities]) => cities.includes(city));
      if (foundRegion) setRegion(foundRegion[0]);
    }
  };

  const isReady = region && municipality && theme;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-nexus-panel border border-nexus-border w-full max-w-2xl rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
        
        <div className="p-6 border-b border-nexus-border flex justify-between items-center bg-nexus-dark rounded-t-xl">
          <div>
            <h2 className="text-xl font-bold text-nexus-yellow">Configurar Publicação</h2>
            <p className="text-xs text-nexus-muted">Defina a localização e o tema para indexação correta.</p>
          </div>
          <button onClick={onClose} className="text-nexus-muted hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Step 1: Region */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-white uppercase tracking-wide">
              <span className="w-5 h-5 rounded-full bg-nexus-yellow text-black flex items-center justify-center text-xs">1</span>
              Região
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {Object.keys(LOCATIONS).map((reg) => (
                <button
                  key={reg}
                  onClick={() => { setRegion(reg); setMunicipality(''); }}
                  className={`text-xs p-2 rounded border text-center transition-colors
                    ${region === reg 
                      ? 'bg-nexus-yellow text-black border-nexus-yellow font-bold' 
                      : 'bg-nexus-black border-nexus-border text-nexus-muted hover:border-nexus-text'}
                  `}
                >
                  {reg}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Municipality */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-white uppercase tracking-wide">
              <span className="w-5 h-5 rounded-full bg-nexus-yellow text-black flex items-center justify-center text-xs">2</span>
              Município
            </label>
            
            <div className="relative">
              <input 
                type="text"
                placeholder={region ? `Buscar cidade em ${region}...` : "Buscar em todo o estado..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-nexus-black border border-nexus-border rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-nexus-yellow text-white placeholder-nexus-border"
              />
              <Search className="absolute left-3 top-3 text-nexus-muted" size={18} />
            </div>

            <div className="max-h-40 overflow-y-auto border border-nexus-border rounded-lg bg-nexus-black/50 p-2 grid grid-cols-2 md:grid-cols-3 gap-1">
              {getFilteredMunicipalities().map((city) => (
                <button
                  key={city}
                  onClick={() => handleMunicipalitySelect(city)}
                  className={`text-left text-xs px-2 py-1.5 rounded truncate transition-colors flex items-center gap-1
                    ${municipality === city ? 'bg-nexus-dark text-nexus-yellow border border-nexus-yellow' : 'text-nexus-muted hover:bg-nexus-dark hover:text-white'}
                  `}
                >
                  <MapPin size={10} /> {city}
                </button>
              ))}
              {getFilteredMunicipalities().length === 0 && (
                <div className="col-span-3 text-center text-nexus-muted text-xs py-4">
                  Nenhum município encontrado.
                </div>
              )}
            </div>
          </div>

          {/* Step 3: Theme */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-white uppercase tracking-wide">
              <span className="w-5 h-5 rounded-full bg-nexus-yellow text-black flex items-center justify-center text-xs">3</span>
              Tema
            </label>
            <div className="flex flex-wrap gap-2">
              {THEMES.map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`px-4 py-2 rounded-full text-xs border transition-all flex items-center gap-1
                    ${theme === t 
                      ? 'bg-blue-600/20 border-blue-500 text-blue-400 font-bold' 
                      : 'bg-nexus-black border-nexus-border text-nexus-muted hover:border-nexus-text'}
                  `}
                >
                  <Tag size={12} /> {t}
                </button>
              ))}
            </div>
          </div>

        </div>

        <div className="p-6 border-t border-nexus-border bg-nexus-dark flex justify-end gap-3 rounded-b-xl">
          <button 
            onClick={onClose}
            className="px-6 py-2 rounded-lg text-sm font-medium text-nexus-muted hover:text-white transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={() => onConfirm({ region, municipality, theme })}
            disabled={!isReady}
            className={`px-8 py-2 rounded-lg text-sm font-bold text-black transition-all shadow-lg
              ${isReady 
                ? 'bg-nexus-yellow hover:bg-nexus-yellowHover cursor-pointer transform hover:scale-105' 
                : 'bg-gray-600 cursor-not-allowed opacity-50'}
            `}
          >
            Publicar Agora
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublishModal;
