import React, { useState } from 'react';
import { createInitialConfig } from './data';
import { WebDesignConfig, Block } from './types';
import SidebarEditor from './components/SidebarEditor';
import CanvasPreview from './components/CanvasPreview';
import BlockEditor from './components/BlockEditor';
import LaravelViewer from './components/LaravelViewer';
import ContentDatabase from './components/ContentDatabase';
import ProjectExporter from './components/ProjectExporter';
import { 
  Sparkles, 
  Code, 
  Database, 
  Workflow, 
  Download, 
  Layout, 
  Settings, 
  Monitor, 
  Tablet, 
  Smartphone, 
  Play, 
  AlertCircle, 
  RefreshCw,
  FolderOpen
} from 'lucide-react';

export default function App() {
  const [config, setConfig] = useState<WebDesignConfig>(createInitialConfig());
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'visual' | 'code' | 'database' | 'export'>('visual');
  const [viewportWidth, setViewportWidth] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  
  // AI Layout Generator variables
  const [aiPrompt, setAiPrompt] = useState('An innovative cyber security software suite offering firewall, cloud scanning, and real-time team encryption');
  const [aiGenerating, setAiGenerating] = useState(false);

  // Helper to handle Block edits
  const handleUpdateBlock = (updatedBlock: Block) => {
    const activePage = config.pages.find(p => p.id === config.activePageId) || config.pages[0];
    const updatedBlocks = activePage.blocks.map(b => (b.id === updatedBlock.id ? updatedBlock : b));
    
    const updatedPages = config.pages.map(p => {
      if (p.id === activePage.id) {
        return { ...p, blocks: updatedBlocks };
      }
      return p;
    });

    setConfig({
      ...config,
      pages: updatedPages
    });
  };

  // Ask server-side Gemini to generate a tailored landing page block config
  const handleAiGenerateLayout = async () => {
    if (!aiPrompt.trim()) return;
    setAiGenerating(true);
    try {
      const response = await fetch('/api/ai/generate-layout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: aiPrompt,
          pageTitle: config.projectName
        })
      });
      const data = await response.json();
      if (data.success && Array.isArray(data.layout)) {
        const activePage = config.pages.find(p => p.id === config.activePageId) || config.pages[0];
        const updatedPages = config.pages.map(p => {
          if (p.id === activePage.id) {
            return { 
              ...p, 
              title: 'Custom AI Page',
              blocks: data.layout 
            };
          }
          return p;
        });

        setConfig({
          ...config,
          pages: updatedPages
        });
        setSelectedBlockId(null);
        alert('AI successfully synthesized your custom Bootstrap layout. Check the preview!');
      } else {
        alert(data.error || 'Server rejected AI layout template compile.');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to connect to backend server configuration.');
    } finally {
      setAiGenerating(false);
    }
  };

  const activePage = config.pages.find(p => p.id === config.activePageId) || config.pages[0];
  const selectedBlock = activePage.blocks.find(b => b.id === selectedBlockId);

  return (
    <div id="cms-main-root" className="min-h-screen bg-slate-50 flex flex-col font-sans select-none antialiased">
      {/* 1. Header Navigation Bar */}
      <nav className="bg-slate-900 border-b border-slate-800 text-slate-100 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white shadow-md text-base border border-indigo-500 animate-pulse">
                LB
              </div>
              <div>
                <h1 className="font-extrabold text-sm tracking-tight text-white flex items-center gap-1.5 leading-none">
                  LaraBoot Studio CMS
                </h1>
                <span className="text-[10px] text-slate-400 font-mono tracking-wide block mt-1">
                  Laravel 11 & Bootstrap 5 Visual Compiler
                </span>
              </div>
            </div>

            {/* Menu Tabs */}
            <div className="flex h-full items-center">
              <button
                onClick={() => setActiveTab('visual')}
                className={`h-full px-4 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all ${
                  activeTab === 'visual'
                    ? 'border-indigo-500 bg-slate-800/60 text-white'
                    : 'border-transparent text-slate-400 hover:text-slate-100'
                }`}
              >
                <Layout className="w-4 h-4" />
                Visual Designer
              </button>
              <button
                onClick={() => setActiveTab('code')}
                className={`h-full px-4 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all ${
                  activeTab === 'code'
                    ? 'border-indigo-500 bg-slate-800/60 text-indigo-300'
                    : 'border-transparent text-slate-400 hover:text-indigo-300'
                }`}
              >
                <Code className="w-4 h-4" />
                Page Code Controllers
              </button>
              <button
                onClick={() => setActiveTab('database')}
                className={`h-full px-4 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all ${
                  activeTab === 'database'
                    ? 'border-indigo-500 bg-slate-800/60 text-indigo-300'
                    : 'border-transparent text-slate-400 hover:text-slate-100'
                }`}
              >
                <Database className="w-4 h-4" />
                Dynamic CMS Database
              </button>
              <button
                onClick={() => setActiveTab('export')}
                className={`h-full px-4 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all ${
                  activeTab === 'export'
                    ? 'border-indigo-500 bg-slate-800/60 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-100'
                }`}
              >
                <Download className="w-4 h-4" />
                Exporter CLI
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 2. Main Workspace Layout */}
      {activeTab === 'visual' ? (
        <div className="flex-1 flex flex-col overflow-hidden min-h-0">
          {/* Top Panel: AI Genie Generator Prompts */}
          <div className="bg-gradient-to-r from-slate-900 to-indigo-950/95 border-b border-indigo-900/40 py-3.5 px-4 lg:px-6 flex-shrink-0 text-white">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-600/30 p-2 rounded-xl border border-indigo-500">
                  <Sparkles className="w-5 h-5 text-indigo-400 animate-spin" />
                </div>
                <div>
                  <h3 className="font-bold text-xs text-white uppercase tracking-wider">AI Layout Genie</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Let Gemini 3.5 formulate your dynamic Bootstrap layout sections</p>
                </div>
              </div>

              {/* Prompt box */}
              <div className="flex-1 max-w-2xl flex gap-2">
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="flex-1 text-xs bg-slate-950/80 border border-indigo-900/65 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. A dental clinic with schedule, features grid, pricing tier and team reviews..."
                />
                <button
                  type="button"
                  onClick={handleAiGenerateLayout}
                  disabled={aiGenerating}
                  className="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 text-white px-5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shadow"
                >
                  {aiGenerating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Consulting Genie...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      Generate Page
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
            {/* Left config layout rail */}
            <div className="w-full lg:w-80 border-r border-slate-200 bg-slate-50 p-6 overflow-y-auto max-h-[300px] lg:max-h-full">
              <SidebarEditor
                config={config}
                onChangeConfig={setConfig}
                selectedBlockId={selectedBlockId}
                onSelectBlock={setSelectedBlockId}
              />
            </div>

            {/* Middle visual preview wrapper */}
            <div className="flex-1 flex flex-col bg-slate-900 overflow-hidden relative">
              {/* Width switches */}
              <div className="bg-slate-950/60 p-2.5 border-b border-slate-800/60 flex items-center justify-between z-10 flex-shrink-0">
                <span className="text-[10px] text-slate-400 font-mono tracking-wider ml-1">
                  PREVIEW STAGE WIDTH MODIFIER
                </span>
                
                <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-0.5">
                  <button
                    onClick={() => setViewportWidth('desktop')}
                    className={`p-1.5 rounded-md transition-colors ${
                      viewportWidth === 'desktop' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-100'
                    }`}
                    title="Desktop Preview 100%"
                  >
                    <Monitor className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setViewportWidth('tablet')}
                    className={`p-1.5 rounded-md transition-colors ${
                      viewportWidth === 'tablet' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-100'
                    }`}
                    title="Tablet Preview 768px"
                  >
                    <Tablet className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setViewportWidth('mobile')}
                    className={`p-1.5 rounded-md transition-colors ${
                      viewportWidth === 'mobile' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-100'
                    }`}
                    title="Mobile Portrait 375px"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Viewport render block */}
              <div className="flex-1 overflow-hidden flex flex-col relative">
                <CanvasPreview
                  config={config}
                  selectedBlockId={selectedBlockId}
                  onSelectBlock={setSelectedBlockId}
                  viewportWidth={viewportWidth}
                />
              </div>
            </div>

            {/* Right configuration properties panel */}
            <div className="w-full lg:w-80 border-l border-slate-200 bg-white p-6 overflow-y-auto max-h-[300px] lg:max-h-full">
              {selectedBlock ? (
                <BlockEditor
                  block={selectedBlock}
                  onChangeBlock={handleUpdateBlock}
                />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                    <Edit3 className="w-6 h-6 text-slate-400" />
                  </div>
                  <h4 className="font-semibold text-sm text-slate-700">No Block Selected</h4>
                  <p className="text-xs text-slate-400 mt-1 lines-clamp">
                    Click any highlighted section in the central stage preview or select inside the sidebar list layout to edit style properties.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : activeTab === 'code' ? (
        <div className="flex-1 flex flex-col min-h-0">
          <LaravelViewer config={config} />
        </div>
      ) : activeTab === 'database' ? (
        <div className="flex-1 flex flex-col min-h-0">
          <ContentDatabase config={config} onChangeConfig={setConfig} />
        </div>
      ) : (
        <div className="flex-1 flex flex-col min-h-0">
          <ProjectExporter config={config} />
        </div>
      )}
    </div>
  );
}
