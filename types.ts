
export interface DataPoint {
  [key: string]: string | number;
}

export interface ChartConfig {
  type: 'bar' | 'line' | 'area';
  xAxisKey: string;
  dataKeys: string[];
  showLabels?: boolean;
}

export interface Project {
  id: string;
  name: string;
  createdAt: number;
  data: DataPoint[];
  chartConfig: ChartConfig;
  chatHistory: ChatMessage[];
  deleted?: boolean; // New: Soft delete flag
}

export interface Publication {
  id: string;
  title: string;
  description: string;
  publishedAt: number;
  lastUpdated?: number; 
  data?: DataPoint[]; 
  chartConfig?: ChartConfig; 
  category: 'Capital' | 'Estado'; 
  type: 'chart' | 'article'; 
  content?: string; 
  status: 'draft' | 'published'; 
  deleted?: boolean; // New: Soft delete flag
  pdf_url?: string; // Novo campo para link de PDF
  // Hierarchical Fields
  region?: string;
  municipality?: string;
  theme?: string;
}

export enum MessageRole {
  USER = 'user',
  MODEL = 'model',
  SYSTEM = 'system'
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  maps?: {
    uri: string;
    title: string;
    placeAnswerSources?: {
        reviewSnippets?: {
            sourceUri: string;
            content: string;
        }[]
    }
  };
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  type?: 'text' | 'image';
  imageUrl?: string;
  groundingChunks?: GroundingChunk[];
  isThinking?: boolean;
}

// Updated models to comply with Gemini 3.0 / 2.5 flash series guidelines
export enum GeminiModel {
  FLASH = 'gemini-3-flash-preview',
  PRO = 'gemini-3-pro-preview',
  IMAGE_PRO = 'gemini-3-pro-image-preview',
}

export enum ImageSize {
  SIZE_1K = '1K',
  SIZE_2K = '2K',
  SIZE_4K = '4K'
}
