

import React, { useState, useRef, useEffect } from 'react';
import { Send, MapPin, Search, Image as ImageIcon, Sparkles, X, AlertCircle } from 'lucide-react';
import { ChatMessage, MessageRole, GeminiModel, ImageSize, GroundingChunk } from '../types';
import { generateAnalysis, generateImage } from '../services/geminiService';

interface GeminiPanelProps {
  history: ChatMessage[];
  setHistory: (history: ChatMessage[]) => void;
  contextData?: string; // Stringified JSON of current data
  isOpen: boolean;
  onToggle: () => void;
}

const GeminiPanel: React.FC<GeminiPanelProps> = ({ 
  history, 
  setHistory, 
  contextData,
  isOpen,
  onToggle
}) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'chat' | 'image'>('chat');
  const [useSearch, setUseSearch] = useState(false);
  const [useMaps, setUseMaps] = useState(false);
  const [imageSize, setImageSize] = useState<ImageSize>(ImageSize.SIZE_1K);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history, isLoading, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: MessageRole.USER,
      content: input,
      type: 'text'
    };

    const updatedHistory = [...history, userMsg];
    setHistory(updatedHistory);
    setInput('');
    setIsLoading(true);

    try {
      if (mode === 'image') {
        const result = await generateImage(userMsg.content, imageSize);
        
        const modelMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: MessageRole.MODEL,
          content: result.error ? `Error: ${result.error}` : "Here is your generated image:",
          type: result.imageUrl ? 'image' : 'text',
          imageUrl: result.imageUrl || undefined
        };
        setHistory([...updatedHistory, modelMsg]);

      } else {
        // Text/Analysis Mode
        let location = undefined;
        if (useMaps) {
            // Attempt to get location if maps is enabled
            try {
                const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject);
                });
                location = {
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude
                };
            } catch (e) {
                console.warn("Could not get location for maps grounding", e);
            }
        }

        // Updated model selection: Maps requires Gemini 2.5 series.
        let model: string = GeminiModel.PRO;
        if (useMaps) {
            // Maps grounding is only supported in Gemini 2.5 series models.
            model = 'gemini-2.5-flash';
        } else if (useSearch) {
            model = GeminiModel.FLASH; // Gemini 3 Flash
        }

        const response = await generateAnalysis(
            model, 
            updatedHistory, 
            userMsg.content, 
            contextData,
            { search: useSearch, maps: useMaps, location }
        );

        const text = response.text || "I couldn't generate a response.";
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[];

        const modelMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: MessageRole.MODEL,
          content: text,
          type: 'text',
          groundingChunks: groundingChunks
        };
        setHistory([...updatedHistory, modelMsg]);
      }
    } catch (error: any) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: MessageRole.MODEL,
        content: `Error: ${error.message || "Something went wrong."}`,
        type: 'text'
      };
      setHistory([...updatedHistory, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderGroundingSource = (chunk: GroundingChunk, idx: number) => {
      if (chunk.web) {
          return (
              <a key={idx} href={chunk.web.uri} target="_blank" rel="noopener noreferrer" className="block text-xs text-blue-400 hover:underline truncate max-w-full">
                  <Search size={10} className="inline mr-1"/> {chunk.web.title}
              </a>
          )
      }
      if (chunk.maps) {
           return (
              <a key={idx} href={chunk.maps.uri} target="_blank" rel="noopener noreferrer" className="block text-xs text-green-400 hover:underline truncate max-w-full">
                  <MapPin size={10} className="inline mr-1"/> {chunk.maps.title}
              </a>
          )
      }
      return null;
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar Panel */}
      <div className={`
        fixed inset-y-0 right-0 w-full md:w-96 bg-nexus-panel border-l border-nexus-border flex flex-col z-40 transition-transform duration-300 shadow-2xl
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        {/* Header */}
        <div className="h-14 border-b border-nexus-border flex items-center justify-between px-4 bg-nexus-dark">
          <div className="flex items-center gap-2 text-nexus-yellow font-semibold">
            <Sparkles size={18} />
            <span>Gemini Intelligence</span>
          </div>
          <button onClick={onToggle} className="text-nexus-muted hover:text-white transition-colors">
              <X size={20} />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {history.length === 0 && (
            <div className="text-center text-nexus-muted text-sm mt-10 space-y-2">
              <p>Ask me to analyze your data.</p>
              <p>Try: "Plot a chart of Sales vs Date"</p>
              <p>Or enable tools for real-time info.</p>
            </div>
          )}
          
          {history.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex flex-col ${msg.role === MessageRole.USER ? 'items-end' : 'items-start'}`}
            >
              <div 
                className={`
                  max-w-[90%] rounded-lg p-3 text-sm
                  ${msg.role === MessageRole.USER 
                    ? 'bg-nexus-yellow text-black' 
                    : 'bg-nexus-dark text-nexus-text border border-nexus-border'}
                `}
              >
                {msg.type === 'image' && msg.imageUrl ? (
                  <div className="space-y-2">
                      <p className="font-semibold text-xs mb-1">Generated Image:</p>
                      <img src={msg.imageUrl} alt="Generated content" className="w-full rounded-md border border-nexus-border" />
                      {msg.content && msg.content !== "Here is your generated image:" && <p>{msg.content}</p>}
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                )}

                {/* Grounding Sources */}
                {msg.groundingChunks && msg.groundingChunks.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-gray-700">
                        <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">Sources</p>
                        <div className="space-y-1">
                          {msg.groundingChunks.map((chunk, idx) => renderGroundingSource(chunk, idx))}
                        </div>
                    </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
              <div className="flex items-center gap-2 text-nexus-muted text-sm animate-pulse">
                  <Sparkles size={14} />
                  <span>Thinking...</span>
              </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Controls */}
        <div className="p-4 bg-nexus-dark border-t border-nexus-border">
          {/* Toggle Mode */}
          <div className="flex gap-2 mb-3">
              <button 
                  onClick={() => setMode('chat')}
                  className={`flex-1 py-1 text-xs rounded border ${mode === 'chat' ? 'bg-nexus-yellow text-black border-nexus-yellow' : 'text-nexus-muted border-nexus-border hover:border-nexus-yellow'}`}
              >
                  Chat
              </button>
              <button 
                  onClick={() => setMode('image')}
                  className={`flex-1 py-1 text-xs rounded border ${mode === 'image' ? 'bg-nexus-yellow text-black border-nexus-yellow' : 'text-nexus-muted border-nexus-border hover:border-nexus-yellow'}`}
              >
                  Generate Image
              </button>
          </div>

          {/* Tools Configuration */}
          {mode === 'chat' && (
              <div className="flex gap-2 mb-3">
                  <button 
                      onClick={() => { setUseSearch(!useSearch); if(!useSearch) setUseMaps(false); }}
                      className={`flex items-center gap-1 px-2 py-1 text-xs rounded border transition-colors ${useSearch ? 'bg-blue-900/30 border-blue-500 text-blue-400' : 'border-nexus-border text-nexus-muted hover:text-white'}`}
                  >
                      <Search size={12} /> Google Search
                  </button>
                  <button 
                      onClick={() => { setUseMaps(!useMaps); if(!useMaps) setUseSearch(false); }}
                      className={`flex items-center gap-1 px-2 py-1 text-xs rounded border transition-colors ${useMaps ? 'bg-green-900/30 border-green-500 text-green-400' : 'border-nexus-border text-nexus-muted hover:text-white'}`}
                  >
                      <MapPin size={12} /> Google Maps
                  </button>
              </div>
          )}

          {/* Image Config */}
          {mode === 'image' && (
               <div className="flex gap-2 mb-3 items-center">
                  <span className="text-xs text-nexus-muted">Size:</span>
                  <select 
                      value={imageSize}
                      onChange={(e) => setImageSize(e.target.value as ImageSize)}
                      className="bg-nexus-black border border-nexus-border text-xs rounded px-2 py-1 text-white focus:outline-none focus:border-nexus-yellow"
                  >
                      <option value={ImageSize.SIZE_1K}>1K (Square)</option>
                      <option value={ImageSize.SIZE_2K}>2K (Square)</option>
                      <option value={ImageSize.SIZE_4K}>4K (Square)</option>
                  </select>
              </div>
          )}

          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={mode === 'chat' ? "Ask about data or search..." : "Describe image to generate..."}
              className="flex-1 bg-nexus-black border border-nexus-border rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-nexus-yellow"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-nexus-yellow text-black p-2 rounded-md hover:bg-nexus-yellowHover disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default GeminiPanel;