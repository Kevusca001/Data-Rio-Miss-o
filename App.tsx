
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from './services/supabaseClient'; 
import Sidebar from './components/Sidebar';
import DataInput from './components/DataInput';
import ChartSection from './components/ChartSection';
import GeminiPanel from './components/GeminiPanel';
import PublicView from './components/PublicView';
import PublisherHub from './components/PublisherHub';
import PostEditor from './components/PostEditor';
import PostsList from './components/PostsList';
import PublishModal from './components/PublishModal';
import LoginView from './components/LoginView'; 
import { Project, DataPoint, ChartConfig, ChatMessage, Publication } from './types';
import { Menu, Sparkles, Share2, ArrowLeft, LogOut } from 'lucide-react';

const STORAGE_PROJECTS_KEY = 'datanexus_projects_v1';

const DEFAULT_CHART_CONFIG: ChartConfig = {
  type: 'bar',
  xAxisKey: '',
  dataKeys: [],
  showLabels: false
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'public' | 'publisher' | 'login'>('public');
  const [session, setSession] = useState<any>(null);
  const [publisherMode, setPublisherMode] = useState<'hub' | 'charts' | 'create' | 'edit_content' | 'edit' | 'drafts'>('hub');
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [geminiOpen, setGeminiOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);

  useEffect(() => {
    const savedProjects = localStorage.getItem(STORAGE_PROJECTS_KEY);
    if (savedProjects) {
      try {
        const parsed = JSON.parse(savedProjects);
        setProjects(parsed);
        const firstActive = parsed.find((p: Project) => !p.deleted);
        if (firstActive) setActiveProjectId(firstActive.id);
      } catch (e) { console.error(e); }
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        if (!session && (currentView === 'publisher')) setCurrentView('login');
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (projects.length > 0) localStorage.setItem(STORAGE_PROJECTS_KEY, JSON.stringify(projects));
  }, [projects]);

  const handleNavigateToPublisher = () => {
      if (session) { setPublisherMode('hub'); setCurrentView('publisher'); } 
      else setCurrentView('login');
  };

  const handleLogout = async () => { await supabase.auth.signOut(); setCurrentView('public'); };

  const handleDataLoaded = (data: DataPoint[]) => {
    if (!activeProjectId) return;
    const updates: Partial<Project> = { data };
    if (data.length > 0) {
      const keys = Object.keys(data[0]);
      const numericKeys = keys.filter(k => typeof data[0][k] === 'number');
      updates.chartConfig = {
        ...DEFAULT_CHART_CONFIG,
        xAxisKey: keys[0] || '',
        dataKeys: numericKeys.slice(0, 2)
      };
    }
    updateActiveProject(updates);
  };

  const createNewProject = () => {
    const newProject: Project = {
      id: uuidv4(),
      name: `Novo Projeto ${new Date().toLocaleDateString()}`,
      createdAt: Date.now(),
      data: [],
      chartConfig: DEFAULT_CHART_CONFIG,
      chatHistory: [],
      deleted: false
    };
    setProjects(prev => [newProject, ...prev]);
    setActiveProjectId(newProject.id);
  };

  const getActiveProject = () => projects.find(p => p.id === activeProjectId);
  const updateActiveProject = (updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === activeProjectId ? { ...p, ...updates } : p));
  };

  const handleChartPublishConfirm = async (metadata: { region: string; municipality: string; theme: string }) => {
    const project = getActiveProject();
    if (!project) return;

    try {
      const { error } = await supabase.from('publicacoes').insert({
        id: uuidv4(),
        title: project.name,
        description: "Gráfico produzido via Data Rio Dashboard",
        data: project.data,
        chart_config: project.chartConfig,
        category: 'Estado',
        type: 'chart',
        status: 'published',
        region: metadata.region,
        municipality: metadata.municipality,
        theme: metadata.theme,
        published_at: new Date().toISOString()
      });

      if (error) throw error;
      alert("Gráfico publicado no banco de dados com sucesso!");
      setIsPublishModalOpen(false);
      setPublisherMode('hub');
    } catch (err: any) {
      alert(`Erro ao publicar gráfico: ${err.message}`);
    }
  };

  if (currentView === 'public') return <PublicView onNavigateToPublisher={handleNavigateToPublisher} />;
  if (currentView === 'login') return <LoginView onLoginSuccess={() => { setPublisherMode('hub'); setCurrentView('publisher'); }} onCancel={() => setCurrentView('public')} />;
  if (currentView === 'publisher' && !session) { setCurrentView('login'); return null; }

  // HUB DO PUBLICADOR
  if (publisherMode === 'hub') {
    return (
        <div className="relative h-screen flex flex-col">
            <div className="absolute top-8 right-8 z-50">
                <button onClick={handleLogout} className="flex items-center gap-2 bg-nexus-dark border border-nexus-border px-5 py-2.5 rounded-full text-sm font-bold text-red-400 hover:border-red-500 hover:bg-red-900/20 transition-all shadow-xl">
                    <LogOut size={16} /> Sair do Painel
                </button>
            </div>
            <PublisherHub onSelectMode={(mode) => { if (mode === 'charts' && projects.filter(p => !p.deleted).length === 0) createNewProject(); setPublisherMode(mode); }} onExit={() => setCurrentView('public')} />
        </div>
    );
  }

  // LISTAGEM DE CONTEÚDOS (EDITAR OU RASCUNHOS)
  if (publisherMode === 'edit' || publisherMode === 'drafts') {
    return (
      <PostsList 
        mode={publisherMode} 
        onEdit={(id) => { setEditingPostId(id); setPublisherMode('edit_content'); }} 
        onBack={() => setPublisherMode('hub')} 
      />
    );
  }

  // EDITOR DE ARTIGOS (CHAMADO PELO HUB OU PELA LISTA)
  if (publisherMode === 'create' || publisherMode === 'edit_content') {
      return (
        <PostEditor 
            editingId={editingPostId}
            onCancel={() => { setEditingPostId(null); setPublisherMode('hub'); }} 
            onSave={() => { setEditingPostId(null); setPublisherMode('hub'); }} 
        />
      );
  }

  // EDITOR DE GRÁFICOS
  const activeProject = getActiveProject();

  return (
    <div className="flex h-screen w-full bg-nexus-black text-nexus-text overflow-hidden font-sans">
      <Sidebar projects={projects} activeProjectId={activeProjectId} onSelectProject={setActiveProjectId} onCreateProject={createNewProject} onDeleteProject={(id) => setProjects(projects.map(p => p.id === id ? {...p, deleted: true} : p))} onRenameProject={(id, name) => setProjects(projects.map(p => p.id === id ? { ...p, name } : p))} isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <main className="flex-1 flex flex-col relative overflow-hidden">
        <div className="h-14 border-b border-nexus-border flex items-center justify-between px-4 bg-nexus-dark z-10">
           <div className="flex items-center gap-2">
              <button onClick={() => setSidebarOpen(true)} className="md:hidden text-nexus-text"><Menu size={24} /></button>
              <button onClick={() => setPublisherMode('hub')} className="hidden md:flex text-nexus-muted hover:text-white text-sm items-center gap-1 transition-colors"><ArrowLeft size={16} /> Voltar ao Hub</button>
           </div>
          <span className="font-semibold text-sm md:text-base truncate px-2">{activeProject?.name || "Editor de Gráficos"}</span>
          <div className="flex items-center gap-3">
              <button onClick={() => setGeminiOpen(!geminiOpen)} className={`text-nexus-yellow ${geminiOpen ? 'opacity-100' : 'opacity-70'} transition-opacity`}><Sparkles size={24} /></button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
          {activeProject && !activeProject.deleted ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                    <DataInput data={activeProject.data} onDataLoaded={handleDataLoaded} />
                    {activeProject.data.length > 0 && (
                        <div className="bg-nexus-panel p-6 rounded-lg border border-nexus-border">
                            <h3 className="text-sm font-semibold text-white mb-4">Configuração Visual</h3>
                            <button onClick={() => setIsPublishModalOpen(true)} className="w-full bg-green-600 py-2 rounded text-white font-bold flex items-center justify-center gap-2 hover:bg-green-700 transition-colors shadow-lg"><Share2 size={18}/> Publicar Gráfico</button>
                        </div>
                    )}
                </div>
                <div className="space-y-6"><ChartSection data={activeProject.data} config={activeProject.chartConfig} /></div>
            </div>
          ) : <div className="flex items-center justify-center h-full text-nexus-muted italic">Selecione ou crie um projeto para começar a visualização.</div>}
        </div>
        <PublishModal isOpen={isPublishModalOpen} onClose={() => setIsPublishModalOpen(false)} onConfirm={handleChartPublishConfirm} />
      </main>
      <GeminiPanel 
        history={activeProject?.chatHistory || []} 
        setHistory={(history) => updateActiveProject({ chatHistory: history })}
        contextData={activeProject?.data ? JSON.stringify(activeProject.data.slice(0, 50)) : undefined}
        isOpen={geminiOpen} 
        onToggle={() => setGeminiOpen(!geminiOpen)} 
      />
    </div>
  );
};

export default App;
