
import React, { useEffect, useState } from 'react';
import { Publication } from '../types';
import ChartSection from './ChartSection';
import RioMap from "./RioMap";
import { ShieldCheck, MapPin, Menu, X, Filter, ChevronDown, Search, Loader, Tag, ArrowLeft, BookOpen, Clock, Calendar, FileText } from 'lucide-react';
import { LOCATIONS, THEMES } from '../data/locations';
import { supabase } from '../services/supabaseClient';
import ThemeToggle from './ThemeToggle';

interface PublicViewProps {
  onNavigateToPublisher: () => void;
}

const PublicView: React.FC<PublicViewProps> = ({ onNavigateToPublisher }) => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState<Publication | null>(null);
  
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [selectedMunicipality, setSelectedMunicipality] = useState<string>('');
  const [selectedTheme, setSelectedTheme] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    fetchPublications();
  }, []);

  async function fetchPublications() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('publicacoes')
        .select('*')
        .eq('status', 'published')
        .eq('deleted', false) 
        .order('published_at', { ascending: false });

      if (error) throw error;
      
      const mappedData = data.map(pub => ({
        ...pub,
        publishedAt: new Date(pub.published_at).getTime(),
        chartConfig: pub.chart_config
      }));

      setPublications(mappedData);
    } catch (e) {
      console.error("Failed to load publications from Supabase", e);
    } finally {
      setLoading(false);
    }
  }

  const filteredPublications = publications.filter(pub => {
    if (selectedRegion && pub.region !== selectedRegion) return false;
    if (selectedMunicipality && pub.municipality !== selectedMunicipality) return false;
    if (selectedTheme && pub.theme !== selectedTheme) return false;
    if (searchTerm && !pub.title?.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const handleBackToList = () => {
    setSelectedNews(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenNews = (pub: Publication) => {
    // Se a publicação tiver um PDF anexo, abrimos em nova aba e não entramos no modo leitura
    if (pub.pdf_url) {
      window.open(pub.pdf_url, '_blank');
      return;
    }
    setSelectedNews(pub);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-nexus-black dark:text-nexus-text flex flex-col font-sans overflow-x-hidden transition-colors duration-300">
      {/* Off-Canvas Drawer (Filtros) */}
      <div className={`fixed inset-0 bg-black/40 dark:bg-black/60 z-50 transition-opacity ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMenuOpen(false)} />
      <div className={`fixed inset-y-0 left-0 w-[85%] sm:w-[400px] bg-white dark:bg-nexus-panel border-r border-gray-300 dark:border-nexus-border z-50 transform transition-transform duration-300 flex flex-col ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 border-b border-gray-300 dark:border-nexus-border flex items-center justify-between bg-gray-50 dark:bg-nexus-dark">
            <h2 className="text-nexus-yellowHover dark:text-nexus-yellow font-bold text-lg flex items-center gap-2"><Filter size={20} /> Filtros e Busca</h2>
            <button onClick={() => setIsMenuOpen(false)} className="text-gray-600 dark:text-nexus-muted hover:text-black dark:hover:text-white"><X size={24} /></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-5 space-y-8">
            <div className="space-y-4">
                <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-600 dark:text-nexus-muted flex items-center gap-2">
                    <Tag size={12} className="text-nexus-yellowHover dark:text-nexus-yellow" /> Tema / Modalidade
                </label>
                <div className="flex flex-wrap gap-2">
                    <button 
                        onClick={() => setSelectedTheme('')}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${selectedTheme === '' ? 'bg-nexus-yellow text-black border-nexus-yellow shadow-lg shadow-nexus-yellow/10' : 'bg-white dark:bg-nexus-dark border-gray-300 dark:border-nexus-border text-gray-600 dark:text-nexus-muted hover:border-nexus-yellow'}`}
                    >
                        Todos os Temas
                    </button>
                    {THEMES.map(theme => (
                        <button 
                            key={theme} 
                            onClick={() => setSelectedTheme(theme)} 
                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${selectedTheme === theme ? 'bg-nexus-yellow text-black border-nexus-yellow shadow-lg shadow-nexus-yellow/10' : 'bg-white dark:bg-nexus-dark border-gray-300 dark:border-nexus-border text-gray-600 dark:text-nexus-muted hover:border-nexus-yellow'}`}
                        >
                            {theme}
                        </button>
                    ))}
                </div>
            </div>

            <div className="h-px bg-gray-200 dark:bg-nexus-border" />

            <div className="space-y-3">
                <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-600 dark:text-nexus-muted">Região Administrativa</label>
                <div className="grid grid-cols-1 gap-1.5">
                    <button 
                        onClick={() => { setSelectedRegion(''); setSelectedMunicipality(''); }}
                        className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all border ${selectedRegion === '' ? 'bg-gray-100 dark:bg-nexus-dark border-nexus-yellow text-nexus-yellowHover dark:text-nexus-yellow' : 'bg-transparent border-transparent text-gray-600 dark:text-nexus-muted hover:bg-gray-50 dark:hover:bg-nexus-dark'}`}
                    >
                        Todas as Regiões
                    </button>
                    {Object.keys(LOCATIONS).map(region => (
                        <button 
                            key={region} 
                            onClick={() => { setSelectedRegion(region); setSelectedMunicipality(''); }} 
                            className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all border ${selectedRegion === region ? 'bg-gray-100 dark:bg-nexus-dark border-nexus-yellow text-nexus-yellowHover dark:text-nexus-yellow font-bold' : 'bg-transparent border-transparent text-gray-600 dark:text-nexus-muted hover:bg-gray-50 dark:hover:bg-nexus-dark hover:text-black dark:hover:text-white'}`}
                        >
                            {region}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-3">
                <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-600 dark:text-nexus-muted">Município Específico</label>
                <div className="relative">
                    <select 
                        value={selectedMunicipality} 
                        onChange={(e) => setSelectedMunicipality(e.target.value)} 
                        className="w-full bg-white dark:bg-nexus-black border border-gray-400 dark:border-nexus-border rounded-lg pl-10 pr-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-nexus-yellow appearance-none transition-all shadow-sm"
                    >
                        <option value="">{selectedRegion ? `Todos os municípios de ${selectedRegion}` : 'Selecione uma região primeiro'}</option>
                        {selectedRegion && LOCATIONS[selectedRegion].map(city => <option key={city} value={city}>{city}</option>)}
                    </select>
                    <MapPin size={16} className="absolute left-3 top-3.5 text-gray-500 dark:text-nexus-muted" />
                    <ChevronDown size={16} className="absolute right-3 top-3.5 text-gray-500 dark:text-nexus-muted pointer-events-none" />
                </div>
            </div>
        </div>

        <div className="p-4 border-t border-gray-300 dark:border-nexus-border bg-gray-50 dark:bg-nexus-dark">
            <button 
                onClick={() => { setSelectedRegion(''); setSelectedMunicipality(''); setSelectedTheme(''); setIsMenuOpen(false); }}
                className="w-full py-3 text-xs font-bold uppercase tracking-widest text-gray-600 dark:text-nexus-muted hover:text-black dark:hover:text-white transition-colors"
            >
                Limpar Todos os Filtros
            </button>
        </div>
      </div>

      <header className="border-b border-gray-300 dark:border-nexus-border bg-white/80 dark:bg-nexus-dark/50 backdrop-blur-md sticky top-0 z-20 min-h-[4rem] flex flex-wrap md:flex-nowrap items-center justify-between px-4 py-3 md:py-0">
          {/* LADO ESQUERDO: Logo/Menu */}
          <div className="flex items-center gap-3 flex-shrink-0 order-1">
            <button onClick={() => setIsMenuOpen(true)} className="p-2 text-nexus-yellowHover dark:text-nexus-yellow hover:bg-nexus-yellow/10 rounded-full transition-all group">
                <Menu size={24} className="group-hover:scale-110 transition-transform" />
            </button>
            <h1 className="font-bold text-gray-900 dark:text-white text-lg tracking-tight hidden sm:block">Data Rio Missão</h1>
          </div>

          {/* CENTRO: Barra de Pesquisa Global - Ocupa largura total e vai para baixo no mobile; Centralizada no desktop */}
          <div className="w-full order-3 md:order-2 md:flex-1 md:max-w-md md:mx-8 relative mt-3 md:mt-0">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-500 dark:text-nexus-muted" size={18} />
              <input 
                type="text" 
                placeholder="Pesquisar por título de relatório..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-50 dark:bg-nexus-panel border border-gray-400 dark:border-nexus-border text-gray-900 dark:text-white rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-nexus-yellow/50 transition-all shadow-inner"
              />
            </div>
          </div>

          {/* LADO DIREITO: Ações */}
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0 order-2 md:order-3">
            <ThemeToggle />
            <button onClick={onNavigateToPublisher} className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-nexus-yellowHover dark:text-nexus-yellow border border-nexus-yellow/30 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full hover:bg-nexus-yellow hover:text-black transition-all">Área do Publicador</button>
          </div>
      </header>

      {selectedNews ? (
        /* MODO LEITURA (Artigo Completo) */
        <main className="max-w-5xl mx-auto px-4 py-12 w-full flex-1">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button 
              onClick={handleBackToList}
              className="flex items-center gap-2 text-nexus-yellowHover dark:text-nexus-yellow hover:text-black dark:hover:text-white transition-colors mb-8 group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="font-bold uppercase tracking-widest text-xs">Voltar para Manchetes</span>
            </button>

            <article className="bg-white dark:bg-nexus-panel border border-gray-300 dark:border-nexus-border rounded-2xl p-8 md:p-12 shadow-xl dark:shadow-2xl">
              <header className="mb-10 border-b border-gray-200 dark:border-nexus-border pb-8">
                <div className="flex flex-wrap gap-3 mb-6">
                  <span className="bg-nexus-yellow/10 text-nexus-yellowHover dark:text-nexus-yellow px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest border border-nexus-yellow/20">
                    {selectedNews.theme}
                  </span>
                  <span className="bg-gray-100 dark:bg-nexus-dark text-gray-700 dark:text-nexus-muted px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest border border-gray-300 dark:border-nexus-border flex items-center gap-1">
                    <MapPin size={10} /> {selectedNews.municipality}
                  </span>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight mb-6">
                  {selectedNews.title}
                </h1>

                <div className="flex items-center gap-6 text-gray-600 dark:text-nexus-muted text-xs font-medium">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-nexus-yellowHover dark:text-nexus-yellow" />
                    {new Date(selectedNews.publishedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={14} className="text-green-700 dark:text-green-500" />
                    Fonte Oficial: Data Rio Missão
                  </div>
                </div>
              </header>

              {selectedNews.type === 'chart' ? (
                <div className="mb-10 bg-gray-50 dark:bg-nexus-black/40 rounded-xl p-6 border border-gray-200 dark:border-nexus-border">
                  <ChartSection data={selectedNews.data || []} config={selectedNews.chartConfig as any} />
                  <p className="text-center text-gray-500 dark:text-nexus-muted text-[10px] mt-4 uppercase tracking-widest italic">Visualização interativa de indicadores</p>
                </div>
              ) : null}

              <div className="prose prose-slate dark:prose-invert max-w-none">
                <div 
                  className="text-lg text-gray-800 dark:text-nexus-text leading-relaxed whitespace-pre-wrap font-serif"
                  style={{ fontFamily: "'Lora', serif" }}
                >
                  {selectedNews.content || selectedNews.description}
                </div>
              </div>

              <footer className="mt-16 pt-8 border-t border-gray-200 dark:border-nexus-border flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="text-[10px] text-gray-500 dark:text-nexus-muted uppercase tracking-[0.2em]">
                    Governo do Estado do Rio de Janeiro • Portal de Dados
                  </div>
                  <button 
                    onClick={handleBackToList}
                    className="text-nexus-yellowHover dark:text-nexus-yellow font-bold text-xs uppercase tracking-widest hover:underline"
                  >
                    Encerrar Leitura
                  </button>
              </footer>
            </article>
          </div>
        </main>
      ) : (
        /* MODO HOME (Mapa + Lista de Manchetes) */
        <>
          {/* Seção do Mapa - Branco Puro no Light Mode e Gradiente no Dark Mode */}
          <section className="bg-white dark:bg-gradient-to-b dark:from-nexus-panel dark:to-nexus-black py-12 border-b border-gray-300 dark:border-nexus-border text-center transition-colors duration-300">
              <RioMap />
          </section>

          <main id="news-section" className="max-w-5xl mx-auto px-4 py-16 w-full flex-1">
            <div>
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b-2 border-nexus-yellow/40 pb-4 gap-4">
                <div>
                  <h2 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Últimos Relatórios</h2>
                  <p className="text-gray-600 dark:text-nexus-muted text-sm mt-1">Indicadores e Relatórios do Rio de Janeiro</p>
                </div>
                <div className="flex items-center gap-3 text-xs font-bold text-gray-600 dark:text-nexus-muted uppercase tracking-widest">
                  <span>{filteredPublications.length} artigos disponíveis</span>
                  {selectedTheme && (
                    <span className="text-nexus-yellowHover dark:text-nexus-yellow bg-nexus-yellow/10 px-2 py-0.5 rounded border border-nexus-yellow/20">Filtrado por: {selectedTheme}</span>
                  )}
                  {searchTerm && (
                    <span className="text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 lowercase">Busca: "{searchTerm}"</span>
                  )}
                </div>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-500 dark:text-nexus-muted">
                  <Loader className="animate-spin mb-4" size={32} />
                  <p className="text-sm font-medium">Sincronizando com a redação oficial...</p>
                </div>
              ) : filteredPublications.length === 0 ? (
                <div className="text-center py-24 bg-white dark:bg-nexus-panel/30 border border-dashed border-gray-300 dark:border-nexus-border rounded-2xl shadow-inner">
                  <Search size={48} className="mx-auto mb-4 text-gray-400 dark:text-nexus-muted opacity-20" />
                  <p className="text-lg font-medium text-gray-600 dark:text-white">Nenhum artigo encontrado para os critérios atuais</p>
                  <button onClick={() => { setSelectedRegion(''); setSelectedMunicipality(''); setSelectedTheme(''); setSearchTerm(''); }} className="mt-6 text-nexus-yellowHover dark:text-nexus-yellow font-bold hover:underline">Limpar filtros e busca</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {filteredPublications.map((pub) => (
                    <div 
                      key={pub.id} 
                      className="bg-white dark:bg-nexus-panel border border-gray-300 border-l-4 dark:border-nexus-border hover:border-nexus-yellow transition-all p-6 rounded-r-xl group flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer shadow-sm hover:shadow-md"
                      onClick={() => handleOpenNews(pub)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600 dark:text-nexus-muted mb-3 group-hover:text-nexus-yellowHover dark:group-hover:text-nexus-yellow transition-colors">
                          <span>{pub.municipality || 'Estado'}</span>
                          <span className="opacity-40 text-gray-400 dark:text-white">|</span>
                          <span>{pub.theme}</span>
                          <span className="opacity-40 text-gray-400 dark:text-white">|</span>
                          <span className="flex items-center gap-1"><Clock size={10} /> {new Date(pub.publishedAt).toLocaleDateString('pt-BR')}</span>
                          {pub.pdf_url && (
                             <span className="flex items-center gap-1 bg-red-600/10 text-red-600 px-1.5 py-0.5 rounded text-[8px] font-black"><FileText size={8} /> PDF ANEXO</span>
                          )}
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-tight group-hover:text-nexus-yellowHover dark:group-hover:text-nexus-yellow transition-colors mb-2">
                          {pub.title}
                        </h3>
                      </div>
                      
                      <button className="whitespace-nowrap bg-gray-50 dark:bg-nexus-dark border border-gray-400 dark:border-nexus-border text-gray-700 dark:text-nexus-text px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-widest group-hover:bg-nexus-yellow group-hover:text-black group-hover:border-nexus-yellow transition-all flex items-center gap-2 shadow-sm">
                          {pub.pdf_url ? <FileText size={16} /> : <BookOpen size={16} />}
                          {pub.pdf_url ? 'Abrir Documento PDF' : 'Ler na Íntegra'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </main>
        </>
      )}

      <footer className="bg-white dark:bg-nexus-dark/80 border-t border-gray-300 dark:border-nexus-border py-8 text-center mt-auto">
          <p className="text-[10px] text-gray-600 dark:text-nexus-muted uppercase tracking-[0.3em]">Data Rio Missão • 2024 • Transparência e Inovação</p>
      </footer>
    </div>
  );
};

export default PublicView;
