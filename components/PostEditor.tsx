
import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { Save, ArrowLeft, Layout, FileText, File as FileIcon, ChevronDown, Search, MapPin } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { LOCATIONS, THEMES } from '../data/locations';

interface PostEditorProps {
  editingId: string | null;
  onCancel: () => void;
  onSave: () => void;
}

const PostEditor: React.FC<PostEditorProps> = ({ editingId, onCancel, onSave }) => {
  const [loading, setLoading] = useState(false);
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [theme, setTheme] = useState(THEMES[0]);
  const [region, setRegion] = useState('');
  const [municipality, setMunicipality] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('published');
  
  // Search state for municipality
  const [munSearch, setMunSearch] = useState('');

  // PDF Upload States
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [existingPdfUrl, setExistingPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    if (editingId) {
      loadPost(editingId);
    }
  }, [editingId]);

  const loadPost = async (id: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('publicacoes').select('*').eq('id', id).single();
      if (data) {
        setTitle(data.title);
        setContent(data.content || '');
        setTheme(data.theme || THEMES[0]);
        setRegion(data.region || '');
        setMunicipality(data.municipality || '');
        setStatus(data.status);
        setExistingPdfUrl(data.pdf_url || null);
        setMunSearch(data.municipality || '');
      }
    } catch (err) {
      console.error("Erro ao carregar post:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPdfFile(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) return alert("Erro: O Título é obrigatório.");
    if (!municipality) return alert("Erro: O Município é obrigatório.");
    
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert("ERRO: Você não está logado.");
        setLoading(false);
        return;
      }

      let currentPdfUrl = existingPdfUrl;

      if (pdfFile) {
        const fileExt = pdfFile.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(fileName, pdfFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('documents')
          .getPublicUrl(fileName);
        
        currentPdfUrl = publicUrl;
      }

      const postData = {
        title,
        content,
        theme,
        category: theme, // Legacy fallback
        region,
        municipality,
        status,
        pdf_url: currentPdfUrl,
        type: 'article',
        deleted: false,
        last_updated: new Date().toISOString()
      };

      let error;
      if (editingId) {
        const response = await supabase.from('publicacoes').update(postData).eq('id', editingId);
        error = response.error;
      } else {
        const response = await supabase.from('publicacoes').insert({
          id: uuidv4(),
          published_at: new Date().toISOString(), 
          ...postData
        });
        error = response.error;
      }

      if (error) throw error;
      
      alert("Sucesso!");
      onSave();

    } catch (err: any) {
      alert("Erro: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter municipalities based on search and selected region
  const filteredMunicipalities = region 
    ? LOCATIONS[region].filter(m => m.toLowerCase().includes(munSearch.toLowerCase()))
    : [];

  return (
    <div className="flex flex-col h-full bg-nexus-black text-white p-6 overflow-y-auto font-sans">
      <div className="flex items-center justify-between mb-8 border-b border-gray-800 pb-4">
        <div className="flex items-center gap-4">
          <button onClick={onCancel} className="text-gray-400 hover:text-white transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold tracking-tight">
            {editingId ? 'Editar Publicação' : 'Nova Publicação'}
          </h1>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} className="px-4 py-2 rounded border border-gray-600 hover:bg-gray-800 transition-colors text-sm font-medium">Cancelar</button>
          <button 
            onClick={handleSave} 
            disabled={loading} 
            className="px-6 py-2 rounded bg-nexus-yellow text-black font-bold hover:bg-yellow-500 flex items-center gap-2 disabled:opacity-50 transition-all shadow-lg active:scale-95"
          >
            <Save size={18} /> {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full space-y-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Main Editor Section */}
          <div className="lg:col-span-3 space-y-6">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Título do Relatório</label>
              <input 
                type="text" 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                className="w-full bg-nexus-dark border border-gray-800 p-4 rounded-xl text-2xl font-bold focus:border-nexus-yellow focus:outline-none transition-all placeholder:text-gray-800 shadow-inner" 
                placeholder="Ex: Balanço de Segurança Pública - 2º Trimestre" 
              />
            </div>

            <div className="bg-nexus-dark/50 p-6 rounded-xl border border-gray-800">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3 flex items-center gap-2">
                <FileIcon size={14} className="text-nexus-yellow" /> Anexo PDF (Recomendado)
              </label>
              <input 
                type="file" 
                accept="application/pdf"
                onChange={handlePdfChange}
                className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-nexus-yellow file:text-black hover:file:bg-nexus-yellowHover cursor-pointer"
              />
              {existingPdfUrl && !pdfFile && (
                <p className="mt-3 text-[10px] text-nexus-yellow italic">Documento já vinculado ao sistema.</p>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 flex items-center gap-2">
                <FileText size={14} className="text-nexus-yellow" /> Descrição / Resumo Executivo
              </label>
              <textarea 
                value={content}
                onChange={e => setContent(e.target.value)}
                className="w-full bg-nexus-panel border border-gray-800 p-6 rounded-xl text-nexus-text text-lg leading-relaxed min-h-[400px] focus:border-nexus-yellow focus:outline-none transition-all shadow-inner resize-y font-serif"
                placeholder="Insira aqui o texto que aparecerá abaixo do gráfico ou como resumo do PDF..."
                style={{ fontFamily: "'Lora', serif" }}
              />
            </div>
          </div>

          {/* Classification Sidebar */}
          <div className="space-y-6">
            <div className="bg-nexus-panel border border-gray-800 rounded-2xl p-6 space-y-6 shadow-2xl sticky top-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-nexus-yellow border-b border-gray-800 pb-3 flex items-center gap-2">
                <Layout size={12} /> Classificação de Dados
              </h3>

              {/* 1. Theme Selection */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">1. Eixo Temático</label>
                <div className="relative">
                  <select 
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="w-full bg-nexus-dark border border-gray-700 rounded-lg pl-3 pr-10 py-3 text-sm text-white focus:border-nexus-yellow focus:outline-none appearance-none cursor-pointer"
                  >
                    {THEMES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-3.5 text-nexus-muted pointer-events-none" />
                </div>
              </div>

              {/* 2. Region Selection */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">2. Região Administrativa</label>
                <div className="relative">
                  <select 
                    value={region}
                    onChange={(e) => {
                        setRegion(e.target.value);
                        setMunicipality('');
                        setMunSearch('');
                    }}
                    className="w-full bg-nexus-dark border border-gray-700 rounded-lg pl-3 pr-10 py-3 text-sm text-white focus:border-nexus-yellow focus:outline-none appearance-none cursor-pointer"
                  >
                    <option value="">Selecione a Região...</option>
                    {Object.keys(LOCATIONS).map(reg => <option key={reg} value={reg}>{reg}</option>)}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-3.5 text-nexus-muted pointer-events-none" />
                </div>
              </div>

              {/* 3. Municipality Selection with Search */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">3. Município Alvo</label>
                <div className="relative mb-2">
                    <Search size={14} className="absolute left-3 top-3 text-nexus-muted" />
                    <input 
                        type="text" 
                        placeholder={region ? "Digite para buscar..." : "Selecione a região primeiro"}
                        disabled={!region}
                        value={munSearch}
                        onChange={(e) => setMunSearch(e.target.value)}
                        className="w-full bg-nexus-dark border border-gray-700 rounded-lg pl-9 pr-3 py-2.5 text-sm text-white focus:border-nexus-yellow focus:outline-none disabled:opacity-30 disabled:cursor-not-allowed"
                    />
                </div>
                
                {region && (
                    <div className="max-h-48 overflow-y-auto bg-nexus-black/50 border border-gray-800 rounded-lg p-1 space-y-1 custom-scrollbar">
                        {filteredMunicipalities.length > 0 ? (
                            filteredMunicipalities.map(m => (
                                <button 
                                    key={m}
                                    onClick={() => { setMunicipality(m); setMunSearch(m); }}
                                    className={`w-full text-left px-3 py-2 rounded-md text-xs transition-colors flex items-center gap-2 ${municipality === m ? 'bg-nexus-yellow text-black font-bold' : 'text-nexus-muted hover:bg-nexus-dark hover:text-white'}`}
                                >
                                    <MapPin size={10} /> {m}
                                </button>
                            ))
                        ) : (
                            <p className="text-[10px] text-center text-gray-600 py-4 uppercase">Nenhum resultado</p>
                        )}
                    </div>
                )}
              </div>

              <div className="pt-4 border-t border-gray-800 space-y-4">
                <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Status de Visibilidade</label>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setStatus('published')}
                            className={`flex-1 py-2 text-[10px] font-bold uppercase rounded-lg border transition-all ${status === 'published' ? 'bg-green-600/20 border-green-500 text-green-400' : 'bg-nexus-dark border-gray-800 text-gray-500'}`}
                        >
                            Público
                        </button>
                        <button 
                            onClick={() => setStatus('draft')}
                            className={`flex-1 py-2 text-[10px] font-bold uppercase rounded-lg border transition-all ${status === 'draft' ? 'bg-orange-600/20 border-orange-500 text-orange-400' : 'bg-nexus-dark border-gray-800 text-gray-500'}`}
                        >
                            Rascunho
                        </button>
                    </div>
                </div>
              </div>

            </div>
            
            <div className="p-4 bg-nexus-yellow/5 border border-nexus-yellow/10 rounded-xl text-[10px] text-nexus-muted leading-relaxed italic">
                A indexação por município é crucial para que o relatório apareça corretamente nas buscas geográficas do portal Data Rio Missão.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostEditor;
