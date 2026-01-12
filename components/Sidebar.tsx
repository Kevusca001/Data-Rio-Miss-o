
import React, { useState } from 'react';
import { Project } from '../types';
import { Plus, Trash2, LayoutDashboard, Database, X, Edit2, Check } from 'lucide-react';

interface SidebarProps {
  projects: Project[];
  activeProjectId: string | null;
  onSelectProject: (id: string) => void;
  onCreateProject: () => void;
  onDeleteProject: (id: string) => void;
  onRenameProject: (id: string, newName: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  projects,
  activeProjectId,
  onSelectProject,
  onCreateProject,
  onDeleteProject,
  onRenameProject,
  isOpen,
  onToggle
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  // Filter out deleted projects for the sidebar view
  const activeProjects = projects.filter(p => !p.deleted);

  const startEditing = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(project.id);
    setEditName(project.name);
  };

  const saveEditing = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (editName.trim()) {
      onRenameProject(id, editName);
    }
    setEditingId(null);
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-20 md:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onToggle}
      />

      {/* Sidebar Container */}
      <aside 
        className={`
          fixed md:relative z-30 flex flex-col h-full bg-nexus-black border-r border-nexus-border w-64 transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="p-4 border-b border-nexus-border flex items-center justify-between">
          <div className="flex items-center gap-2 text-nexus-yellow font-bold text-xl">
            <LayoutDashboard size={24} />
            <span>Editor</span>
          </div>
          <button onClick={onToggle} className="md:hidden text-nexus-muted hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          <button
            onClick={() => {
              onCreateProject();
              if (window.innerWidth < 768) onToggle();
            }}
            className="w-full flex items-center gap-2 bg-nexus-yellow text-black px-4 py-2 rounded-md font-medium hover:bg-nexus-yellowHover transition-colors"
          >
            <Plus size={18} />
            Novo Projeto
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2">
          <h3 className="text-xs font-semibold text-nexus-muted uppercase tracking-wider px-2 mb-2">Seus Rascunhos</h3>
          <div className="space-y-1">
            {activeProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => {
                    onSelectProject(project.id);
                    if (window.innerWidth < 768) onToggle();
                }}
                className={`
                  group flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition-colors text-sm
                  ${activeProjectId === project.id ? 'bg-nexus-panel text-white' : 'text-nexus-text hover:bg-nexus-dark hover:text-white'}
                `}
              >
                <Database size={16} className={activeProjectId === project.id ? 'text-nexus-yellow' : 'text-nexus-muted'} />
                
                {editingId === project.id ? (
                  <div className="flex items-center flex-1 gap-1" onClick={(e) => e.stopPropagation()}>
                    <input 
                      type="text" 
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="flex-1 bg-black border border-nexus-yellow rounded px-1 py-0.5 text-white text-xs focus:outline-none"
                      autoFocus
                    />
                    <button onClick={(e) => saveEditing(project.id, e)} className="text-green-500 hover:text-green-400">
                      <Check size={14} />
                    </button>
                  </div>
                ) : (
                  <span className="flex-1 truncate">{project.name}</span>
                )}

                {activeProjectId === project.id && !editingId && (
                  <div className="flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => startEditing(project, e)}
                      className="p-1 text-nexus-muted hover:text-white"
                      title="Renomear"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        // Call deletion which will be handled as soft delete in App.tsx
                        if(confirm('Mover este projeto para a lixeira?')) onDeleteProject(project.id);
                      }}
                      className="p-1 text-nexus-muted hover:text-red-500"
                      title="Mover para Lixeira"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            ))}
            
            {activeProjects.length === 0 && (
                <div className="text-center p-4 text-nexus-muted text-sm italic">
                    Nenhum projeto ativo.
                </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-nexus-border text-xs text-nexus-muted">
          <p>Powered by Gemini 2.5 & 3.0</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
