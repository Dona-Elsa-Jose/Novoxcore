import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import NovoxChat from './components/NovoxChat';
import './index.css';

// ==================================================
// CONFIGURATION
// ==================================================
// Set to true to show the admin panel (Dev Mode)
// Set to false for the production website experience
const DEV_MODE = false; 

function App() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(() => uuidv4());

  // Tenant / indexing state
  const [tenant, setTenant] = useState('novoxcore');
  const [customTenant, setCustomTenant] = useState('');
  
  const [indexUrl, setIndexUrl] = useState('https://novoxcore.com');
  const [isIndexing, setIsIndexing] = useState(false);
  const [indexResult, setIndexResult] = useState(null);
  const [indexError, setIndexError] = useState(null);

  const [showSettings, setShowSettings] = useState(false);

  const handleSend = async (messageToSend) => {
    if (!messageToSend || isLoading) return;

    const userMessage = { role: 'user', text: messageToSend };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: messageToSend,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response');
      }

      const data = await response.json();
      console.log("================================");
      console.log("BACKEND RESPONSE:", data);
      console.log("BACKEND ANSWER:", data.answer);
      console.log("================================");
      const botMessage = { 
        role: 'bot', 
        text: data.answer,
        sources: data.sources || []
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'bot', text: 'Sorry, the backend is not responding. Please make sure the services are running and try again.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleIndexWebsite = async (e) => {
    if (e) e.preventDefault();
    if (!indexUrl.trim() || isIndexing) return;

    setIsIndexing(true);
    setIndexResult(null);
    setIndexError(null);

    try {
      const response = await fetch('http://127.0.0.1:8000/index-website', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tenant: tenant.trim().toLowerCase(),
          url: indexUrl.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to index website');
      }

      setIndexResult(data);
    } catch (error) {
      console.error('Indexing Error:', error);
      setIndexError(error.message);
    } finally {
      setIsIndexing(false);
    }
  };

  const handleEndChat = async () => {
    try {
      await fetch(`http://127.0.0.1:8000/end-chat/${sessionId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error ending chat:', error);
    }
    
    setSessionId(uuidv4());
    setMessages([]);
  };

  const selectTenant = (name) => {
    setTenant(name);
    if (name === 'novoxcore') {
      setIndexUrl('https://novoxcore.com');
    } else {
      setIndexUrl('');
    }
    setMessages([]);
    setSessionId(uuidv4());
  };

  return (
    <div className="flex h-screen bg-bg-dark text-text-primary overflow-hidden relative">
      {DEV_MODE && (
        <>
          {/* Mobile Sidebar Overlay */}
          {showSettings && (
            <div 
              className="fixed inset-0 bg-black/50 z-40 md:hidden" 
              onClick={() => setShowSettings(false)}
            />
          )}
          
          {/* Admin Sidebar */}
          <aside className={`absolute md:relative z-50 w-[300px] h-full bg-sidebar-bg backdrop-blur-xl border-r border-card-border p-6 flex flex-col gap-6 transition-transform duration-300 ${showSettings ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} overflow-y-auto`}>
            <div className="flex items-center gap-3 shrink-0">
              <div className="text-2xl bg-gradient-to-br from-primary-light to-primary bg-clip-text text-transparent drop-shadow-[0_0_10px_var(--color-primary)]">✨</div>
              <h2 className="text-xl font-bold bg-gradient-to-br from-white to-text-secondary bg-clip-text text-transparent tracking-tight">NovaBot Admin</h2>
              <button className="ml-auto md:hidden text-text-muted hover:text-white" onClick={() => setShowSettings(false)}>✕</button>
            </div>

            <div className="flex flex-col gap-3 shrink-0">
              <h3 className="text-xs uppercase tracking-widest text-text-muted font-semibold">Active Tenant</h3>
              <div className="flex flex-col gap-2">
                <button 
                  className={`flex items-center gap-2 p-3 rounded-xl border text-left text-sm font-medium transition-all ${tenant === 'novoxcore' ? 'bg-primary/20 border-primary text-text-primary shadow-[0_4px_15px_rgba(139,92,246,0.3)]' : 'bg-card-bg border-card-border text-text-secondary hover:bg-white/10 hover:border-primary/40'}`}
                  onClick={() => selectTenant('novoxcore')}
                >
                  🏢 novoxcore
                </button>
                {tenant !== 'novoxcore' && (
                  <button className="flex items-center gap-2 p-3 rounded-xl border text-left text-sm font-medium transition-all bg-primary/20 border-primary text-text-primary shadow-[0_4px_15px_rgba(139,92,246,0.3)]">
                    🌐 {tenant}
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3 shrink-0">
              <h3 className="text-xs uppercase tracking-widest text-text-muted font-semibold">Create/Switch Tenant</h3>
              <form className="flex flex-col gap-2" onSubmit={(e) => {
                e.preventDefault();
                if (customTenant.trim()) {
                  selectTenant(customTenant.trim().toLowerCase());
                  setCustomTenant('');
                }
              }}>
                <input
                  type="text"
                  placeholder="Enter tenant name..."
                  value={customTenant}
                  onChange={(e) => setCustomTenant(e.target.value)}
                  className="bg-black/30 border border-card-border p-3 rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
                <button type="submit" disabled={!customTenant.trim()} className="bg-primary text-white p-3 rounded-xl text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-light hover:shadow-[0_4px_15px_rgba(139,92,246,0.5)] transition-all">
                  Switch
                </button>
              </form>
            </div>

            <div className="flex flex-col gap-3 shrink-0">
              <h3 className="text-xs uppercase tracking-widest text-text-muted font-semibold">Website Indexer</h3>
              <form className="flex flex-col gap-2" onSubmit={handleIndexWebsite}>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-text-muted">Target URL:</label>
                  <input
                    type="url"
                    placeholder="https://example.com"
                    value={indexUrl}
                    onChange={(e) => setIndexUrl(e.target.value)}
                    required
                    className="bg-black/30 border border-card-border p-3 rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                </div>
                <button type="submit" disabled={isIndexing || !indexUrl.trim()} className="bg-primary text-white p-3 rounded-xl text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-light hover:shadow-[0_4px_15px_rgba(139,92,246,0.5)] transition-all flex items-center justify-center gap-2">
                  {isIndexing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Indexing...
                    </>
                  ) : 'Index Website'}
                </button>
              </form>

              {indexResult && (
                <div className="p-3 rounded-xl text-sm bg-[#24ac72]/10 border border-[#24ac72]/20 text-[#55efc4]">
                  <h4 className="font-semibold">Indexing Complete!</h4>
                  <p>Chunks generated: {indexResult.chunks_stored}</p>
                </div>
              )}

              {indexError && (
                <div className="p-3 rounded-xl text-sm bg-[#e17070]/10 border border-[#e17070]/20 text-[#ff7675]">
                  <h4 className="font-semibold">Indexing Failed</h4>
                  <p>{indexError}</p>
                </div>
              )}
            </div>

            <button className="mt-auto shrink-0 bg-[#e17070]/10 border border-[#e17070]/20 text-[#ff7675] p-3 rounded-xl text-sm font-semibold hover:bg-[#e17070]/20 transition-all flex items-center justify-center gap-2" onClick={handleEndChat}>
              🔄 Reset Session
            </button>
          </aside>
        </>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative w-full h-full">
        {DEV_MODE && (
          <header className="h-16 md:hidden flex items-center px-4 border-b border-card-border bg-black/20 backdrop-blur-sm shrink-0">
            <button onClick={() => setShowSettings(true)} className="text-2xl mr-4">☰</button>
            <h1 className="font-bold">Novox Core</h1>
          </header>
        )}

        <div className="flex-1 flex items-center justify-center p-8 text-center relative overflow-hidden">
          {/* Abstract Background Elements */}
          <div className="absolute top-20 left-20 w-64 h-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-primary-dark/20 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="max-w-2xl z-10">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary-light via-primary to-primary-dark bg-clip-text text-transparent mb-6 drop-shadow-sm">
              Novox Core
            </h1>
            <p className="text-xl md:text-2xl text-text-secondary mb-8">
              Premium AI solutions for your business.
            </p>
          </div>
        </div>

        {/* Floating Chat Widget Component */}
        <NovoxChat 
          messages={messages} 
          isLoading={isLoading} 
          onSend={handleSend} 
          onReset={handleEndChat} 
        />
      </main>
    </div>
  );
}

export default App;

