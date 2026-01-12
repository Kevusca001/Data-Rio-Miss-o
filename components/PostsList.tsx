
import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Edit, Trash2, RotateCcw, XCircle, Search, FileText, ArrowLeft, RefreshCcw } from 'lucide-react';
import { Publication } from '../types';

interface PostsListProps {
  mode: 'edit' | 'drafts' | 'trash';
  onEdit: (id: string) => void;
  onBack: () => void;
}

const PostsList: React.FC<PostsListProps> = ({ mode, onEdit, onBack }) => {
  const [posts, setPosts] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const config = {
    edit: { title: 'Gerenciar Publicações', empty: 'Nenhuma publicação ativa.' },
    drafts: { title: 'Rascunhos', empty: 'Nenhum rascunho encontrado.' },
    trash: { title: 'Lixeira', empty: 'A lixeira está vazia.' }
  }[mode];

  useEffect(() => {
    fetchPosts();
  }, [mode]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) console.warn("Atenção: Usuário parece desconectado.");

      let query = supabase
        .from('publicacoes')
        .select('*')
        .order('published_at', { ascending: false });

      if (mode === 'trash') {
        query = query.eq('deleted', true);
      } else if (mode === 'drafts') {
        query = query.eq('deleted', false).eq('status', 'draft');
      } else {
        query = query.eq('deleted', false).eq('status', 'published');
      }

      const { data, error } = await query;
      if (error) throw error;
      
      const mappedData = (data || []).map(pub => ({
        ...pub,
        publishedAt: pub.published_at ? new Date(pub.published_at).getTime() : Date.now(),
        chartConfig: pub.chart_config
      })) as unknown as Publication[];

      setPosts(mappedData);
    } catch (error: any) {
      alert('Erro ao carregar lista: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSoftDelete = async (id: string) => {
    // Removido window.confirm conforme solicitado
    try {
      const { error } = await supabase
        .from('publicacoes')
        .update({ deleted: true })
        .eq('id', id);

      if (error) {
        alert("Erro ao excluir: " + error.message);
      } else {
        setPosts(prev => prev.filter(p => p.id !== id));
        alert("Item enviado para a lixeira");
      }
    } catch (error: any) {
      alert("Erro no processo: " + error.message);
    }
  };

  const handleRestore = async (id: string) => {
    try {
      const { error } = await supabase.from('publicacoes').update({ deleted: false }).eq('id', id);
      if (error) throw error;
      setPosts(prev => prev.filter(p => p.id !== id));
      alert("Item restaurado com sucesso");
    } catch (error: any) { alert("Erro: " + error.message); }
  };

  const handlePermanentDelete = async (id: string) => {
    // Removido window.confirm conforme solicitado
    try {
      const { error } = await supabase.from('publicacoes').delete().eq('id', id);
      if (error) throw error;
      setPosts(prev => prev.filter(p => p.id !== id));
      alert("Item apagado permanentemente");
    } catch (error: any) { alert("Erro: " + error.message); }
  };

  const filteredPosts = posts.filter(post => post.title?.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="flex flex-col h-full bg-nexus-black p-8 text-white min-h-screen">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-3 bg-nexus-dark hover:bg-nexus-panel rounded-full transition-colors border border-nexus-border"><ArrowLeft size={24} className="text-nexus-muted hover:text-white" /></button>
          <div>
            <h1 className="text-3xl font-black tracking-tight uppercase flex items-center gap-3">
              {config.title} 
              <button onClick={fetchPosts} className="text-nexus-muted hover:text-nexus-yellow transition-colors"><RefreshCcw size={20}/></button>
            </h1>
            <p className="text-nexus-muted text-sm mt-1">{posts.length} itens encontrados</p>
          </div>
        </div>
        <div className="relative w-full md:w-96">
          <input type="text" placeholder="Buscar publicação..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-nexus-dark border border-nexus-border rounded-xl pl-12 pr-4 py-3 text-sm focus:border-nexus-yellow focus:outline-none text-white shadow-inner" />
          <Search className="absolute left-4 top-3.5 text-nexus-muted" size={18} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center h-64 text-nexus-muted animate-pulse">Carregando dados...</div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-nexus-border rounded-3xl opacity-30">
            <FileText size={64} className="mx-auto mb-4" />
            <p className="text-xl font-bold">{config.empty}</p>
          </div>
        ) : (
          <div className="space-y-4 max-w-5xl mx-auto">
            {filteredPosts.map((post) => (
              <div key={post.id} className="bg-nexus-panel border border-nexus-border rounded-2xl p-5 flex items-center justify-between hover:border-nexus-yellow/40 transition-all group shadow-xl">
                <div className="flex items-center gap-5">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-inner ${post.type === 'chart' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'}`}><FileText size={24} /></div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-nexus-yellow transition-colors">{post.title}</h3>
                    <div className="flex gap-3 text-xs text-nexus-muted mt-1 font-medium">
                      <span>{new Date(post.publishedAt || Date.now()).toLocaleDateString('pt-BR')}</span>
                      <span className="opacity-20">|</span>
                      <span className="uppercase tracking-widest">{post.municipality || 'Estado'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {mode === 'trash' ? (
                    <>
                      <button onClick={() => handleRestore(post.id)} className="p-3 text-green-400 hover:bg-green-400/10 rounded-xl transition-colors" title="Restaurar"><RotateCcw size={20} /></button>
                      <button onClick={() => handlePermanentDelete(post.id)} className="p-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors" title="Excluir Definitivamente"><XCircle size={20} /></button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => onEdit(post.id)} className="p-3 text-white bg-nexus-dark hover:bg-nexus-border border border-nexus-border rounded-xl transition-all hover:scale-105" title="Editar"><Edit size={20} /></button>
                      
                      {mode === 'edit' && (
                        <button 
                          onClick={() => handleSoftDelete(post.id)} 
                          className="p-3 text-nexus-muted hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-colors" 
                          title="Mover para Lixeira"
                        >
                          <Trash2 size={20} />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostsList;
