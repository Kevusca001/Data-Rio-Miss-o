
import React from 'react';
import { PieChart, PenTool, Edit, ArrowRight, FileText, ArrowLeft } from 'lucide-react';

interface PublisherHubProps {
  onSelectMode: (mode: 'charts' | 'create' | 'edit' | 'drafts') => void;
  onExit: () => void;
}

const PublisherHub: React.FC<PublisherHubProps> = ({ onSelectMode, onExit }) => {
  const cards = [
    {
      id: 'charts',
      title: 'Produzir Gráficos',
      description: 'Crie visualizações de dados a partir de CSVs. Ideal para dados estatísticos e séries históricas.',
      icon: <PieChart size={32} />,
      color: 'text-nexus-yellow',
      borderColor: 'group-hover:border-nexus-yellow'
    },
    {
      id: 'create',
      title: 'Criar Publicação',
      description: 'Escreva artigos, notícias ou relatórios completos com texto formatado e imagens.',
      icon: <PenTool size={32} />,
      color: 'text-blue-400',
      borderColor: 'group-hover:border-blue-500'
    },
    {
      id: 'edit',
      title: 'Editar Publicação',
      description: 'Gerencie e atualize conteúdos já publicados no portal. Edite títulos, textos e realize exclusões.',
      icon: <Edit size={32} />,
      color: 'text-green-400',
      borderColor: 'group-hover:border-green-500'
    },
    {
      id: 'drafts',
      title: 'Meus Rascunhos',
      description: 'Continue trabalhando em projetos e artigos que ainda não foram publicados.',
      icon: <FileText size={32} />,
      color: 'text-purple-400',
      borderColor: 'group-hover:border-purple-500'
    }
  ];

  return (
    <div className="flex-1 flex flex-col bg-nexus-black p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto w-full">
        
        <header className="mb-12 flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex-1">
            <button 
              onClick={onExit} 
              className="bg-nexus-yellow text-black px-10 py-5 rounded-2xl font-black text-lg mb-10 flex items-center gap-3 transition-all hover:bg-nexus-yellowHover hover:scale-105 shadow-[0_0_30px_rgba(255,215,0,0.2)] group w-full sm:w-fit uppercase tracking-tighter"
            >
              <ArrowLeft size={24} className="group-hover:-translate-x-2 transition-transform" strokeWidth={3} /> 
              Voltar ao Site Público
            </button>
            
            <div className="flex items-center gap-6">
              <img 
                src="https://qahsrzsbdqlehckhcisb.supabase.co/storage/v1/object/sign/Imagens/Logo.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81YmMxNDkwZC04Njg1LTRlMWMtYTNlYi0zMDE2MTUzNzQ5NGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJJbWFnZW5zL0xvZ28uanBnIiwiaWF0IjoxNzY1MzI4OTE5LCJleHAiOjE3OTY4NjQ5MTl9.N6yAhNSF3wdqDHj5STcG8I3Lilk3UBkbfHNtZU3XGj0"
                alt="Logo Data Rio Missão" 
                className="h-20 w-auto rounded-xl shadow-2xl border border-nexus-border"
              />
              <div>
                <h1 className="text-4xl font-black text-white mb-2 tracking-tight uppercase">Hub do Publicador</h1>
                <p className="text-nexus-muted text-lg">Painel de controle de governança de dados.</p>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((card) => (
            <div 
              key={card.id}
              onClick={() => onSelectMode(card.id as any)}
              className={`group bg-nexus-panel border border-nexus-border rounded-2xl p-8 cursor-pointer transition-all duration-300 hover:bg-nexus-dark hover:shadow-2xl hover:-translate-y-1 ${card.borderColor}`}
            >
              <div className={`mb-6 ${card.color} bg-nexus-black w-16 h-16 rounded-2xl flex items-center justify-center border border-nexus-border group-hover:scale-110 transition-transform shadow-inner`}>
                {card.icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-nexus-yellow transition-colors">
                {card.title}
              </h3>
              <p className="text-nexus-muted text-base leading-relaxed mb-8">
                {card.description}
              </p>
              <div className="flex items-center gap-2 text-sm font-black text-nexus-yellow opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 uppercase tracking-widest">
                Acessar <ArrowRight size={18} />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 p-10 bg-nexus-dark/50 rounded-3xl border border-nexus-border text-center backdrop-blur-md">
            <p className="text-nexus-muted text-sm font-medium tracking-wide">
                SISTEMA DE GOVERNANÇA DATA RIO MISSÃO • ACESSO RESTRITO • TODAS AS AÇÕES SÃO AUDITADAS
            </p>
        </div>

      </div>
    </div>
  );
};

export default PublisherHub;
