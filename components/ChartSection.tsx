import React, { useRef } from 'react';
import { 
  BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { Download } from 'lucide-react';
import { DataPoint, ChartConfig } from '../types';

interface ChartSectionProps {
  data: DataPoint[];
  config: ChartConfig;
}

const ChartSection: React.FC<ChartSectionProps> = ({ data, config }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 border border-dashed border-nexus-border rounded-lg text-nexus-muted">
        No data to visualize. Upload a CSV or enter data manually.
      </div>
    );
  }

  const handleExport = () => {
    if (!chartRef.current) return;

    const svgElement = chartRef.current.querySelector('svg');
    if (!svgElement) return;

    // Serialize SVG
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);

    // Create a canvas to draw the SVG
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const svgRect = svgElement.getBoundingClientRect();
    
    // Set canvas dimensions
    canvas.width = svgRect.width;
    canvas.height = svgRect.height;

    // Create image from SVG data
    const img = new Image();
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      if (ctx) {
        // Draw dark background since SVG might be transparent
        ctx.fillStyle = '#1e1e1e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.drawImage(img, 0, 0);
        
        // Convert to PNG and download
        const pngUrl = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = `chart-${Date.now()}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        URL.revokeObjectURL(url);
      }
    };
    img.src = url;
  };

  const renderChart = () => {
    switch (config.type) {
      case 'line':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey={config.xAxisKey} stroke="#A0A0A0" />
            <YAxis stroke="#A0A0A0" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e1e1e', borderColor: '#333', color: '#fff' }} 
              itemStyle={{ color: '#E0E0E0' }}
            />
            <Legend />
            {config.dataKeys.map((key, index) => (
              <Line 
                key={key} 
                type="monotone" 
                dataKey={key} 
                stroke={index === 0 ? '#FFD700' : index === 1 ? '#34d399' : '#60a5fa'} 
                activeDot={{ r: 8 }} 
              />
            ))}
          </LineChart>
        );
      case 'area':
        return (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey={config.xAxisKey} stroke="#A0A0A0" />
            <YAxis stroke="#A0A0A0" />
            <Tooltip 
                contentStyle={{ backgroundColor: '#1e1e1e', borderColor: '#333', color: '#fff' }} 
                itemStyle={{ color: '#E0E0E0' }}
            />
            <Legend />
            {config.dataKeys.map((key, index) => (
              <Area 
                key={key} 
                type="monotone" 
                dataKey={key} 
                stroke={index === 0 ? '#FFD700' : index === 1 ? '#34d399' : '#60a5fa'} 
                fill={index === 0 ? '#FFD700' : index === 1 ? '#34d399' : '#60a5fa'} 
                fillOpacity={0.3}
              />
            ))}
          </AreaChart>
        );
      case 'bar':
      default:
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey={config.xAxisKey} stroke="#A0A0A0" />
            <YAxis stroke="#A0A0A0" />
            <Tooltip 
                contentStyle={{ backgroundColor: '#1e1e1e', borderColor: '#333', color: '#fff' }} 
                itemStyle={{ color: '#E0E0E0' }}
            />
            <Legend />
            {config.dataKeys.map((key, index) => (
              <Bar 
                key={key} 
                dataKey={key} 
                fill={index === 0 ? '#FFD700' : index === 1 ? '#34d399' : '#60a5fa'} 
              />
            ))}
          </BarChart>
        );
    }
  };

  return (
    <div className="relative w-full h-[400px] bg-nexus-panel p-4 rounded-lg border border-nexus-border" ref={chartRef}>
      <button 
        onClick={handleExport}
        className="absolute top-4 right-4 z-10 p-2 bg-nexus-dark/50 hover:bg-nexus-dark text-nexus-muted hover:text-white rounded-md border border-nexus-border transition-colors"
        title="Download PNG"
      >
        <Download size={16} />
      </button>
      <ResponsiveContainer width="100%" height="100%">
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};

export default ChartSection;