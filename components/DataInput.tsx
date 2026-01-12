import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { Upload, Table, AlertTriangle, Plus, Minus, Trash2 } from 'lucide-react';
import { DataPoint } from '../types';

interface DataInputProps {
  onDataLoaded: (data: DataPoint[]) => void;
  data: DataPoint[];
}

const DataInput: React.FC<DataInputProps> = ({ onDataLoaded, data }) => {
  const [manualEntry, setManualEntry] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Spreadsheet State
  const [gridHeaders, setGridHeaders] = useState<string[]>([]);
  const [gridRows, setGridRows] = useState<string[][]>([]);

  // Initialize grid when switching to manual mode
  useEffect(() => {
    if (manualEntry) {
      if (data.length > 0) {
        // Populate from existing data
        const headers = Object.keys(data[0]);
        const rows = data.map(item => headers.map(h => String(item[h])));
        setGridHeaders(headers);
        setGridRows(rows);
      } else {
        // Default 5x5 grid
        const defaultHeaders = Array(5).fill("").map((_, i) => `Col ${i + 1}`);
        const defaultRows = Array(5).fill("").map(() => Array(5).fill(""));
        setGridHeaders(defaultHeaders);
        setGridRows(defaultRows);
      }
    }
  }, [manualEntry, data]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          setError(`Error parsing CSV: ${results.errors[0].message}`);
        } else {
            const cleanData = results.data as DataPoint[];
            onDataLoaded(cleanData);
            setManualEntry(false); // Switch back to view mode implicitly or stay? Let's stay in upload view.
        }
      },
      error: (err) => {
        setError(`File error: ${err.message}`);
      }
    });
  };

  // Convert current grid state to DataPoints and bubble up
  const syncToParent = () => {
    const newData: DataPoint[] = gridRows.map(row => {
      const obj: DataPoint = {};
      gridHeaders.forEach((header, index) => {
        const val = row[index];
        // Simple heuristic: if it looks like a number, parse it
        const numVal = parseFloat(val);
        // Only treat as number if it parses correctly and is not an empty string or just whitespace
        const isNum = !isNaN(numVal) && val.trim() !== "";
        obj[header] = isNum ? numVal : val;
      });
      return obj;
    });
    onDataLoaded(newData);
  };

  // Grid Controls
  const addRow = () => {
    setGridRows([...gridRows, Array(gridHeaders.length).fill("")]);
  };

  const removeRow = () => {
    if (gridRows.length > 1) {
      setGridRows(gridRows.slice(0, -1));
      syncToParent();
    }
  };

  const addColumn = () => {
    setGridHeaders([...gridHeaders, `Col ${gridHeaders.length + 1}`]);
    setGridRows(gridRows.map(row => [...row, ""]));
  };

  const removeColumn = () => {
    if (gridHeaders.length > 1) {
      setGridHeaders(gridHeaders.slice(0, -1));
      setGridRows(gridRows.map(row => row.slice(0, -1)));
      syncToParent();
    }
  };

  const updateHeader = (index: number, value: string) => {
    const newHeaders = [...gridHeaders];
    newHeaders[index] = value;
    setGridHeaders(newHeaders);
  };

  const updateCell = (rowIndex: number, colIndex: number, value: string) => {
    const newRows = [...gridRows];
    newRows[rowIndex][colIndex] = value;
    setGridRows(newRows);
  };

  return (
    <div className="w-full bg-nexus-panel p-6 rounded-lg border border-nexus-border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Table size={20} className="text-nexus-yellow" />
            Fonte de Dados
        </h2>
        <button 
            onClick={() => setManualEntry(!manualEntry)}
            className="text-xs text-nexus-yellow hover:underline"
        >
            {manualEntry ? "Voltar para Upload" : "Inserir Manualmente / Editar"}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-900/20 border border-red-800 rounded text-red-400 text-sm flex items-center gap-2">
            <AlertTriangle size={16} />
            {error}
        </div>
      )}

      {manualEntry ? (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
             
              {/* Controls */}
              <div className="flex flex-wrap gap-2 mb-2">
                 <button onClick={addRow} className="flex items-center gap-1 bg-nexus-dark border border-nexus-border hover:border-nexus-yellow text-xs px-2 py-1 rounded transition-colors text-white">
                    <Plus size={12} /> Add Linha
                 </button>
                 <button onClick={removeRow} className="flex items-center gap-1 bg-nexus-dark border border-nexus-border hover:border-red-500 text-xs px-2 py-1 rounded transition-colors text-white">
                    <Minus size={12} /> Rm Linha
                 </button>
                 <div className="w-px h-6 bg-nexus-border mx-1"></div>
                 <button onClick={addColumn} className="flex items-center gap-1 bg-nexus-dark border border-nexus-border hover:border-nexus-yellow text-xs px-2 py-1 rounded transition-colors text-white">
                    <Plus size={12} /> Add Coluna
                 </button>
                 <button onClick={removeColumn} className="flex items-center gap-1 bg-nexus-dark border border-nexus-border hover:border-red-500 text-xs px-2 py-1 rounded transition-colors text-white">
                    <Minus size={12} /> Rm Coluna
                 </button>
              </div>

              {/* Table Editor */}
              <div className="overflow-x-auto border border-nexus-border rounded-lg bg-nexus-black">
                  <table className="w-full text-sm border-collapse">
                      <thead>
                          <tr className="bg-nexus-dark text-nexus-yellow">
                             {gridHeaders.map((header, i) => (
                                 <th key={i} className="border-b border-r border-nexus-border min-w-[100px] p-0">
                                     <input 
                                        value={header}
                                        onChange={(e) => updateHeader(i, e.target.value)}
                                        onBlur={syncToParent}
                                        className="w-full bg-transparent p-2 text-center font-bold focus:outline-none focus:bg-nexus-panel text-nexus-yellow"
                                        placeholder={`Col ${i+1}`}
                                     />
                                 </th>
                             ))}
                          </tr>
                      </thead>
                      <tbody>
                          {gridRows.map((row, rIdx) => (
                              <tr key={rIdx} className="border-b border-nexus-border last:border-0 hover:bg-nexus-panel/30">
                                  {row.map((cell, cIdx) => (
                                      <td key={cIdx} className="border-r border-nexus-border min-w-[100px] p-0 last:border-r-0">
                                          <input 
                                              value={cell}
                                              onChange={(e) => updateCell(rIdx, cIdx, e.target.value)}
                                              onBlur={syncToParent}
                                              className="w-full bg-transparent p-2 text-nexus-text focus:outline-none focus:bg-nexus-panel/50"
                                          />
                                      </td>
                                  ))}
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
              
              <div className="text-xs text-nexus-muted text-center mt-2">
                  * As alterações são salvas automaticamente ao sair do campo.
              </div>

          </div>
      ) : (
        <div className="border-2 border-dashed border-nexus-border rounded-lg p-8 text-center hover:border-nexus-yellow transition-colors cursor-pointer relative">
            <input 
                type="file" 
                accept=".csv"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Upload size={32} className="mx-auto text-nexus-muted mb-2" />
            <p className="text-sm text-nexus-text font-medium">Clique para enviar CSV</p>
            <p className="text-xs text-nexus-muted mt-1">ou arraste o arquivo aqui</p>
        </div>
      )}

      {/* Preview Section (Only shown if NOT in manual mode to avoid redundancy) */}
      {!manualEntry && data.length > 0 && (
          <div className="mt-4 pt-4 border-t border-nexus-border">
              <p className="text-xs text-nexus-muted mb-2">Visualização dos Dados ({data.length} linhas):</p>
              <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-nexus-text">
                      <thead className="text-nexus-muted font-medium bg-nexus-dark">
                          <tr>
                              {Object.keys(data[0]).slice(0, 5).map(key => (
                                  <th key={key} className="p-2">{key}</th>
                              ))}
                          </tr>
                      </thead>
                      <tbody>
                          {data.slice(0, 3).map((row, i) => (
                              <tr key={i} className="border-b border-nexus-border last:border-0">
                                  {Object.values(row).slice(0, 5).map((val, j) => (
                                      <td key={j} className="p-2">{val}</td>
                                  ))}
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>
      )}
    </div>
  );
};

export default DataInput;