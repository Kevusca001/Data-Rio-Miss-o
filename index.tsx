
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';

const rootElement = document.getElementById('root');

function renderError(error: any) {
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="background: #1a0000; color: #ff6666; padding: 40px; font-family: sans-serif; min-h-screen: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">
        <h1 style="font-size: 3rem; margin-bottom: 20px;">ERRO DE CARREGAMENTO</h1>
        <p style="font-size: 1.2rem; max-width: 600px; line-height: 1.6;">Ocorreu uma falha crítica ao iniciar a aplicação Data Rio Missão.</p>
        <pre style="background: #000; padding: 20px; border-radius: 8px; margin-top: 30px; text-align: left; overflow: auto; max-width: 90vw; font-size: 0.8rem; color: #aaa;">${error?.stack || error?.message || error}</pre>
        <button onclick="window.location.reload()" style="margin-top: 40px; background: #FFD700; color: #000; border: none; padding: 15px 30px; border-radius: 30px; font-weight: bold; cursor: pointer;">Tentar Novamente</button>
      </div>
    `;
  }
}

try {
  if (!rootElement) {
    throw new Error("Could not find root element to mount to");
  }

  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </React.StrictMode>
  );
  console.log("React renderizado com sucesso no elemento #root");
} catch (error) {
  console.error("FALHA NA RENDERIZAÇÃO INICIAL:", error);
  renderError(error);
}
