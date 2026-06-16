import React, { useState } from 'react';
import { WebDesignConfig, Page, ColorPalette, Block, BlockType } from '../types';
import { COLOR_PALETTES, createDefaultBlocks } from '../data';
import { FolderPlus, Trash, ChevronUp, ChevronDown, Check, Eye, EyeOff, LayoutTemplate, Palette, Globe, HardDrive, Plus, Cpu, Settings } from 'lucide-react';

interface SidebarEditorProps {
  config: WebDesignConfig;
  onChangeConfig: (newConfig: WebDesignConfig) => void;
  selectedBlockId: string | null;
  onSelectBlock: (id: string | null) => void;
}

export default function SidebarEditor({
  config,
  onChangeConfig,
  selectedBlockId,
  onSelectBlock
}: SidebarEditorProps) {
  const [newPageTitle, setNewPageTitle] = useState('');
  const [showAddPage, setShowAddPage] = useState(false);
  const activePage = config.pages.find(p => p.id === config.activePageId) || config.pages[0];

  // Projects config
  const handleProjectNameChange = (name: string) => {
    // Sanitize to safe directory names
    const sanitized = name.toLowerCase().replace(/[^a-z0-9_]/g, '_');
    onChangeConfig({
      ...config,
      projectName: sanitized
    });
  };

  // Color Theme Changing
  const handlePaletteSelect = (palette: ColorPalette) => {
    onChangeConfig({
      ...config,
      colorPalette: palette
    });
  };

  // Page management
  const handleAddPage = () => {
    if (!newPageTitle.trim()) return;
    const slug = newPageTitle.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const newPage: Page = {
      id: `page-${Math.random()}`,
      title: newPageTitle,
      slug,
      blocks: [
        {
          id: `navbar-${Math.random()}`,
          type: 'navbar',
          visible: true,
          brand: config.projectName,
          links: [
            { label: 'Home', url: '/' },
            { label: 'Back', url: '/' }
          ],
          ctaText: 'Home Portal',
          ctaLink: '/',
          sticky: true,
          themeStyle: 'dark'
        } as Block,
        {
          id: `hero-${Math.random()}`,
          type: 'hero',
          visible: true,
          title: newPageTitle,
          subtitle: `A magnificent sub-route dedicated fully to expanding your ${config.projectName} layout.`,
          ctaText: 'Learn More',
          ctaLink: '#',
          secondaryCtaText: 'Contact Us',
          secondaryCtaLink: '#contact',
          layout: 'center',
          imageUrl: '',
          bgPattern: 'toned-down'
        } as Block,
        {
          id: `footer-${Math.random()}`,
          type: 'footer',
          visible: true,
          text: 'Custom structured secondary page template.',
          copyright: '© 2026 LaraBoot All rights reserved.',
          socials: [{ platform: 'GitHub', url: '#' }]
        } as Block
      ]
    };

    onChangeConfig({
      ...config,
      pages: [...config.pages, newPage],
      activePageId: newPage.id
    });
    setNewPageTitle('');
    setShowAddPage(false);
  };

  const handleDeletePage = (pageId: string) => {
    if (pageId === 'home') return; // Cannot delete home page
    const filtered = config.pages.filter(p => p.id !== pageId);
    onChangeConfig({
      ...config,
      pages: filtered,
      activePageId: 'home'
    });
    onSelectBlock(null);
  };

  // Block management
  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    const blocks = [...activePage.blocks];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= blocks.length) return;

    // Swap
    const temp = blocks[index];
    blocks[index] = blocks[targetIdx];
    blocks[targetIdx] = temp;

    const updatedPages = config.pages.map(p => {
      if (p.id === activePage.id) {
        return { ...p, blocks };
      }
      return p;
    });

    onChangeConfig({
      ...config,
      pages: updatedPages
    });
  };

  const handleToggleBlockVisibility = (index: number) => {
    const blocks = [...activePage.blocks];
    blocks[index] = {
      ...blocks[index],
      visible: !blocks[index].visible
    } as Block;

    const updatedPages = config.pages.map(p => {
      if (p.id === activePage.id) {
        return { ...p, blocks };
      }
      return p;
    });

    onChangeConfig({
      ...config,
      pages: updatedPages
    });
  };

  const handleDeleteBlock = (index: number) => {
    const blocks = activePage.blocks.filter((_, idx) => idx !== index);
    const updatedPages = config.pages.map(p => {
      if (p.id === activePage.id) {
        return { ...p, blocks };
      }
      return p;
    });

    onChangeConfig({
      ...config,
      pages: updatedPages
    });
    onSelectBlock(null);
  };

  const handleAddBlock = (type: BlockType) => {
    const blocks = [...activePage.blocks];
    
    // Choose template starting values
    let newBlock: Block;
    const baseId = `${type}-${Math.random()}`;

    if (type === 'features') {
      newBlock = {
        id: baseId,
        type: 'features',
        visible: true,
        title: 'Core Business Pillars',
        subtitle: 'Our products are shaped by standard modular engineering features.',
        columns: 3,
        items: [
          { id: '1', icon: 'Sparkles', title: 'Feature Alpha', description: 'Advanced responsive capabilities.' },
          { id: '2', icon: 'Database', title: 'Feature Beta', description: 'Full persistent cloud database storage.' }
        ]
      };
    } else if (type === 'pricing') {
      newBlock = {
        id: baseId,
        type: 'pricing',
        visible: true,
        title: 'Flexible Budgets',
        subtitle: 'Unlock maximum potential with custom, low-cost commercial packages.',
        tiers: [
          { id: 't1', name: 'Standard Member', price: '$19', billing: 'per month', features: ['All layouts included', 'Bootstrap static exports'], ctaText: 'Join Standard', featured: true }
        ]
      };
    } else if (type === 'stats') {
      newBlock = {
        id: baseId,
        type: 'stats',
        visible: true,
        title: 'Growth Statistics',
        subtitle: 'Empirical milestones reflecting customer excellence.',
        items: [
          { id: 's1', number: '99%', label: 'Uptime Reliability' },
          { id: 's2', number: '1.2M', label: 'Active Seeders' }
        ]
      };
    } else if (type === 'testimonials') {
      newBlock = {
        id: baseId,
        type: 'testimonials',
        visible: true,
        title: 'Loved by Developers',
        subtitle: 'Read genuine reviews left by open-source Laravel developers.',
        items: [
          { id: 'q1', text: 'Integrating this Bootstrap model to Laravel Blade was an absolute breeze. Perfect design.', author: 'Anya Cole', role: 'Full-Stack Developer', stars: 5 }
        ]
      };
    } else if (type === 'gallery') {
      newBlock = {
        id: baseId,
        type: 'gallery',
        visible: true,
        title: 'Visual Showroom',
        subtitle: 'Craft premium layout representations using beautiful unsplash assets.',
        columns: 3,
        items: [
          { id: 'g1', imageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=400&q=80', title: 'Project Zenith', description: 'SaaS framework dashboard representation.' }
        ]
      };
    } else if (type === 'contact') {
      newBlock = {
        id: baseId,
        type: 'contact',
        visible: true,
        title: 'Let\'s collaborate',
        subtitle: 'Have inquiries? Drop an inquiry to our database seeder team.',
        email: 'info@lara-bootstrap.test',
        phone: '+1 (555) 000-0000',
        address: '100 Silicon Way, Palo Alto CA',
        showMap: true,
        buttonText: 'Submit Form'
      };
    } else {
      newBlock = {
        id: baseId,
        type: 'hero',
        visible: true,
        title: 'New Dynamic Section Title',
        subtitle: 'Edit this subtitle details by clicking inside the section wrapper.',
        ctaText: 'Sign Up',
        ctaLink: '#',
        secondaryCtaText: 'Cancel',
        secondaryCtaLink: '#',
        layout: 'center',
        imageUrl: '',
        bgPattern: 'default'
      };
    }

    // Insert block before the footer block if footer exists
    const footerIdx = blocks.findIndex(b => b.type === 'footer');
    if (footerIdx !== -1) {
      blocks.splice(footerIdx, 0, newBlock);
    } else {
      blocks.push(newBlock);
    }

    const updatedPages = config.pages.map(p => {
      if (p.id === activePage.id) {
        return { ...p, blocks };
      }
      return p;
    });

    onChangeConfig({
      ...config,
      pages: updatedPages
    });
    onSelectBlock(newBlock.id);
  };

  return (
    <div className="space-y-6 text-slate-300">
      {/* 1. Project Global Configurations */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5 px-0.5">
          <Settings className="w-3.5 h-3.5 text-indigo-400" />
          Laravel Project Config
        </h4>
        <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-700/50 space-y-4 shadow-xl">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Project Directory Name (PHP format)
            </label>
            <input
              type="text"
              value={config.projectName}
              onChange={(e) => handleProjectNameChange(e.target.value)}
              className="w-full text-xs bg-slate-950/80 border border-slate-700/80 rounded-lg px-3 py-2 focus:border-indigo-500 outline-none text-white font-mono"
              placeholder="lara_custom_site"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 mb-1">
                Laravel CLI
              </label>
              <select
                value={config.laravelVersion}
                onChange={(e) => onChangeConfig({ ...config, laravelVersion: e.target.value as any })}
                className="w-full text-xs bg-slate-950/80 border border-slate-700/80 py-1.5 px-2 rounded-lg text-slate-200 outline-none focus:border-indigo-500"
              >
                <option value="v11.x">L11 (Modern)</option>
                <option value="v10.x">L10 (Stable)</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 mb-1">
                SQL Database
              </label>
              <select
                value={config.dbDriver}
                onChange={(e) => onChangeConfig({ ...config, dbDriver: e.target.value as any })}
                className="w-full text-xs bg-slate-950/80 border border-slate-700/80 py-1.5 px-2 rounded-lg text-slate-200 outline-none focus:border-indigo-500"
              >
                <option value="sqlite">SQLite (File)</option>
                <option value="mysql">MySQL (RDS)</option>
                <option value="pgsql">PostgreSQL</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Page Directory / Routes Routing */}
      <div>
        <div className="flex justify-between items-center mb-2 px-0.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            Page Routes (web.php)
          </h4>
          <button
            onClick={() => setShowAddPage(!showAddPage)}
            className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-0.5"
          >
            <Plus className="w-3 h-3" /> Add Page
          </button>
        </div>

        {showAddPage && (
          <div className="bg-slate-900/60 border border-slate-700 p-3 rounded-lg flex gap-2 mb-3">
            <input
              type="text"
              value={newPageTitle}
              onChange={(e) => setNewPageTitle(e.target.value)}
              className="flex-1 text-xs px-2.5 py-1.5 bg-slate-950 border border-slate-700 text-white rounded outline-none focus:border-indigo-550"
              placeholder="e.g. Services, About Us"
            />
            <button
              onClick={handleAddPage}
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded px-3 py-1.5 text-xs font-medium"
            >
              Save
            </button>
          </div>
        )}

        <div className="space-y-1.5">
          {config.pages.map(page => {
            const isActive = page.id === config.activePageId;
            return (
              <div
                key={page.id}
                className={`group flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                  isActive
                    ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-200 shadow-sm'
                    : 'bg-slate-900/30 border-slate-800 text-slate-300 hover:bg-slate-900/50 home-hover-target'
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    onChangeConfig({ ...config, activePageId: page.id });
                    onSelectBlock(null);
                  }}
                  className="flex-1 text-left"
                >
                  <div className="text-xs font-semibold text-white">{page.title}</div>
                  <div className={`text-[10px] font-mono mt-0.5 ${isActive ? 'text-indigo-300' : 'text-slate-500'}`}>
                    GET /{page.slug === 'index' ? '' : page.slug}
                  </div>
                </button>

                {page.id !== 'home' && (
                  <button
                    onClick={() => handleDeletePage(page.id)}
                    className={`ml-2 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-rose-400`}
                    title="Delete page"
                  >
                    <Trash className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Bootstrap Themes selection */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5 px-0.5">
          <Palette className="w-3.5 h-3.5 text-indigo-400" />
          Color Theme Schemes
        </h4>
        <div className="grid grid-cols-1 gap-2">
          {COLOR_PALETTES.map(p => {
            const isSelected = p.id === config.colorPalette.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handlePaletteSelect(p)}
                className={`relative w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                  isSelected ? 'bg-indigo-600/20 border-indigo-500/60 shadow-md' : 'bg-slate-900/30 border-slate-800 hover:bg-slate-900/50'
                }`}
              >
                <div>
                  <div className="text-xs font-semibold text-white">{p.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">Font: {p.fontFamily}</div>
                </div>
                <div className="flex gap-1.5 items-center">
                  <span className="w-3.5 h-3.5 rounded-full border border-slate-700" style={{ backgroundColor: p.primary }} />
                  <span className="w-3.5 h-3.5 rounded-full border border-slate-700" style={{ backgroundColor: p.secondary }} />
                  {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400 ml-1.5" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Active Page visual layout modules ordering */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5 px-0.5">
          <LayoutTemplate className="w-3.5 h-3.5 text-indigo-400" />
          Block Hierarchy ({activePage.blocks.length})
        </h4>

        <div className="bg-slate-900/40 border border-slate-700/50 rounded-xl p-2.5 space-y-1.5 mb-3">
          {activePage.blocks.map((block, idx) => {
            const isSelected = block.id === selectedBlockId;
            return (
              <div
                key={block.id}
                className={`p-2 rounded-lg border flex items-center justify-between transition-colors ${
                  isSelected ? 'bg-indigo-600/30 border-indigo-500/50' : 'bg-slate-950/50 border-slate-800'
                }`}
              >
                <button
                  type="button"
                  onClick={() => onSelectBlock(block.id)}
                  className={`flex-1 text-left font-mono text-[11px] capitalize font-semibold truncate hover:text-indigo-400 ${
                    isSelected ? 'text-indigo-300' : 'text-slate-300'
                  }`}
                >
                  {block.type} section
                </button>

                <div className="flex items-center gap-1">
                  <button
                    disabled={idx === 0}
                    onClick={() => handleMoveBlock(idx, 'up')}
                    className="p-1 rounded text-slate-400 hover:bg-slate-800 disabled:opacity-30"
                  >
                    <ChevronUp className="w-3 h-3" />
                  </button>
                  <button
                    disabled={idx === activePage.blocks.length - 1}
                    onClick={() => handleMoveBlock(idx, 'down')}
                    className="p-1 rounded text-slate-400 hover:bg-slate-800 disabled:opacity-30"
                  >
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleToggleBlockVisibility(idx)}
                    className="p-1 rounded text-slate-400 hover:bg-slate-800"
                    title={block.visible ? 'Hide section' : 'Show section'}
                  >
                    {block.visible ? <Eye className="w-3 h-3 text-slate-300" /> : <EyeOff className="w-3 h-3 text-slate-500" />}
                  </button>
                  {activePage.blocks.length > 2 && (
                    <button
                      onClick={() => handleDeleteBlock(idx)}
                      className="p-1 rounded text-rose-400 hover:text-rose-300 hover:bg-rose-900/20"
                      title="Remove section"
                    >
                      <Trash className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Append Sections list picker */}
        <div className="space-y-2">
          <label className="text-[10px] font-semibold text-slate-400 block uppercase px-1 pb-1">
            Insert Visual Layout Section Module
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {['hero', 'features', 'stats', 'pricing', 'blog', 'testimonials', 'gallery', 'contact'].map(typ => (
              <button
                key={typ}
                type="button"
                onClick={() => handleAddBlock(typ as any)}
                className="bg-slate-900/30 hover:bg-indigo-600/10 border border-slate-800 rounded-lg p-2 text-left hover:border-indigo-500/50 transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-2.5 h-2.5 text-indigo-400 flex-shrink-0" />
                <span className="text-[11px] font-medium text-slate-300 capitalize pointer-events-none">{typ}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
