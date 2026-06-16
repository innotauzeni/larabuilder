import React, { useState } from 'react';
import { WebDesignConfig } from '../types';
import { generateLaravelFiles } from '../utils/laravel-generator';
import { FileCode, Clipboard, Check, Folder, HelpCircle, HardDrive, Cpu, Terminal } from 'lucide-react';

interface LaravelViewerProps {
  config: WebDesignConfig;
}

export default function LaravelViewer({ config }: LaravelViewerProps) {
  const files = generateLaravelFiles(config);
  const [selectedFile, setSelectedFile] = useState<string>('routes/web.php');
  const [copied, setCopied] = useState<boolean>(false);

  const fileList = Object.keys(files);

  const handleCopy = () => {
    navigator.clipboard.writeText(files[selectedFile]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Group files into logical categories
  const categories = {
    Routing: ['routes/web.php'],
    Controllers: ['app/Http/Controllers/HomeController.php'],
    Models: ['app/Models/BlogPost.php', 'app/Models/Product.php'],
    Views: ['resources/views/layouts/app.blade.php', 'resources/views/welcome.blade.php'],
    Database: [
      'database/migrations/2026_06_16_000000_create_cms_tables.php',
      'database/seeders/DatabaseSeeder.php'
    ],
    Config: ['composer.json', 'package.json', 'vite.config.js', 'README.md']
  };

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 flex flex-col h-full border-t border-slate-800">
      <div className="border-b border-slate-800 bg-slate-900/60 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold text-lg flex items-center gap-2 text-indigo-400">
            <Terminal className="w-5 h-5" />
            Laravel & Bootstrap Elite Codebase
          </h3>
          <p className="text-xs text-slate-400">
            Pragmatic, standard PHP architecture optimized for Laravel 11 MVC dynamic loop bindings.
          </p>
        </div>
        <button
          onClick={handleCopy}
          className="self-start md:self-auto bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 border border-slate-700 shadow"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              Copied to Clipboard!
            </>
          ) : (
            <>
              <Clipboard className="w-4 h-4" />
              Copy File Contents
            </>
          )}
        </button>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Sidebar file list */}
        <div className="w-full lg:w-80 bg-slate-900/80 border-r border-slate-800 p-4 overflow-y-auto max-h-[250px] lg:max-h-full">
          <div className="mb-4">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-400 block mb-2 px-1">
              LARAVEL MVC MODULES
            </span>
            <div className="space-y-4">
              {Object.entries(categories).map(([catName, filePaths]) => (
                <div key={catName}>
                  <h4 className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mb-1 px-1">
                    <Folder className="w-3.5 h-3.5 text-indigo-400" />
                    {catName}
                  </h4>
                  <div className="space-y-0.5">
                    {filePaths.map(filePath => {
                      // Check if the file is generated for current configuration
                      if (!files[filePath]) return null;
                      const isActive = selectedFile === filePath;
                      const baseName = filePath.split('/').pop() || filePath;
                      return (
                        <button
                          key={filePath}
                          onClick={() => setSelectedFile(filePath)}
                          className={`w-full text-left text-xs py-1.5 px-2.5 rounded-md font-mono transition-colors flex items-center gap-2 ${
                            isActive
                              ? 'bg-indigo-600/35 text-indigo-300 border-l-2 border-indigo-500 font-medium'
                              : 'text-slate-350 hover:bg-slate-800/80 hover:text-slate-200'
                          }`}
                        >
                          <FileCode className="w-3.5 h-3.5 opacity-70" />
                          <span className="truncate">{baseName}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic code viewer window */}
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-950">
          <div className="bg-slate-900 px-4 py-2 border-b border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="text-xs">{selectedFile}</span>
            <span className="text-[10px] text-slate-500 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
              {selectedFile.endsWith('.php') ? 'PHP Web view' : selectedFile.endsWith('.json') ? 'Config package' : 'Markdown documentation'}
            </span>
          </div>

          <div className="flex-1 overflow-auto p-4 md:p-6 font-mono text-xs text-slate-300 leading-relaxed max-h-[460px] lg:max-h-full">
            <pre className="whitespace-pre scrollbar-thin scrollbar-thumb-slate-800">
              <code>{files[selectedFile]}</code>
            </pre>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 bg-slate-900/40 p-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-400">
        <div className="flex items-start gap-2.5">
          <HelpCircle className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
          <div>
            <h5 className="font-semibold text-slate-300 mb-0.5">Where do I place these?</h5>
            <p className="leading-relaxed">
              These files represent actual locations in a default Laravel 11 template. Make sure to download the project zip or copy them directly.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2.5">
          <HardDrive className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
          <div>
            <h5 className="font-semibold text-slate-300 mb-0.5">Database Migration Model</h5>
            <p className="leading-relaxed">
              The migration file creates the <code className="text-indigo-300">blog_posts</code> and <code className="text-indigo-300">products</code> tables automatically. Sync via `php artisan migrate --seed`.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2.5">
          <Cpu className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
          <div>
            <h5 className="font-semibold text-slate-300 mb-0.5">Color Palette Core</h5>
            <p className="leading-relaxed">
              Bootstrap's primary CSS root variable is set beautifully inside <code className="text-indigo-300">app.blade.php</code>, ensuring branding remains consistent.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
