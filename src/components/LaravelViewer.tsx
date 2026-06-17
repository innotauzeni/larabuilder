import React, { useState, useEffect } from 'react';
import { WebDesignConfig } from '../types';
import { generateLaravelFiles } from '../utils/laravel-generator';
import { generateDotnetFiles } from '../utils/dotnet-generator';
import { FileCode, Clipboard, Check, Folder, HelpCircle, HardDrive, Cpu, Terminal, ShieldAlert } from 'lucide-react';

interface LaravelViewerProps {
  config: WebDesignConfig;
}

export default function LaravelViewer({ config }: LaravelViewerProps) {
  const isDotnet = config.exportPlatform === 'dotnet';
  const files = isDotnet ? generateDotnetFiles(config) : generateLaravelFiles(config);
  
  const [selectedFile, setSelectedFile] = useState<string>(isDotnet ? 'README.md' : 'routes/web.php');
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    setSelectedFile(isDotnet ? 'README.md' : 'routes/web.php');
  }, [config.exportPlatform]);

  const handleCopy = () => {
    if (files[selectedFile]) {
      navigator.clipboard.writeText(files[selectedFile]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Group files into logical categories
  const laravelCategories = {
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

  const dotnetCategories = {
    'Dara.Domain (Entities)': [
      'Dara.Domain/Common/BaseEntity.cs',
      'Dara.Domain/Common/AuditableBaseEntity.cs',
      'Dara.Domain/Common/AuditableEntity.cs',
      'Dara.Domain/Entities/BlogPost.cs',
      'Dara.Domain/Entities/Product.cs'
    ],
    'Dara.Application (MediatR Handlers)': [
      'Dara.Application/Common/Models/ApiResponse.cs',
      'Dara.Application/Common/Interfaces/IGenericRepository.cs',
      'Dara.Application/Common/Interfaces/IUnitOfWork.cs',
      'Dara.Application/Common/Interfaces/ICurrentUserService.cs',
      'Dara.Application/Common/Mappings/BlogPostMapper.cs',
      'Dara.Application/Common/Mappings/ProductMapper.cs',
      'Dara.Application/Features/BlogPosts/DTOs/BlogPostDto.cs',
      'Dara.Application/Features/BlogPosts/Queries/GetBlogPostsQuery.cs',
      'Dara.Application/Features/BlogPosts/Commands/CreateBlogPostCommand.cs',
      'Dara.Application/Features/BlogPosts/Commands/DeleteBlogPostCommand.cs',
      'Dara.Application/Features/Products/DTOs/ProductDto.cs',
      'Dara.Application/Features/Products/Queries/GetProductsQuery.cs',
      'Dara.Application/Features/Products/Commands/CreateProductCommand.cs',
      'Dara.Application/Features/Products/Commands/DeleteProductCommand.cs'
    ],
    'Dara.Infrastructure (Data Context)': [
      'Dara.Infrastructure/Persistence/ApplicationDbContext.cs',
      'Dara.Infrastructure/Persistence/Repositories/GenericRepository.cs',
      'Dara.Infrastructure/Persistence/UnitOfWork/UnitOfWork.cs'
    ],
    'Dara.ClientApi (REST Controllers)': [
      'Dara.ClientApi/Controllers/ApiControllerBase.cs',
      'Dara.ClientApi/Controllers/BlogPostsController.cs',
      'Dara.ClientApi/Controllers/ProductsController.cs',
      'Dara.ClientApi/Program.cs',
      'Dara.ClientApi/appsettings.json'
    ],
    'Dara.ClientPortal (UI Razor / MVC)': [
      'Dara.ClientPortal/Clients/ApiClient.cs',
      'Dara.ClientPortal/Controllers/HomeController.cs',
      'Dara.ClientPortal/Views/Shared/_Layout.cshtml',
      'Dara.ClientPortal/Views/Home/Index.cshtml',
      'Dara.ClientPortal/Program.cs',
      'Dara.ClientPortal/appsettings.json'
    ],
    'Solution Metadata': ['Dara.sln', 'README.md']
  };

  const categories = isDotnet ? dotnetCategories : laravelCategories;

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 flex flex-col h-full border-t border-slate-800">
      <div className="border-b border-slate-800 bg-slate-900/60 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold text-lg flex items-center gap-2 text-indigo-400">
            <Terminal className="w-5 h-5" />
            {isDotnet ? 'DaraERP Compliant C# Codebase' : 'Laravel & Bootstrap Elite Codebase'}
          </h3>
          <p className="text-xs text-slate-400">
            {isDotnet 
              ? 'Pragmatic 5-tier architecture aligned with DaraERP v2.0 Roadmap guidelines.' 
              : 'Pragmatic, standard PHP architecture optimized for Laravel 11 MVC dynamic loop bindings.'}
          </p>
        </div>
        <button
          onClick={handleCopy}
          className="self-start md:self-auto bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 border border-slate-700 shadow cursor-pointer"
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
              {isDotnet ? 'C# SOLUTION EXPLORER' : 'LARAVEL MVC MODULES'}
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
              {selectedFile.endsWith('.cs') ? 'C# Source file' : selectedFile.endsWith('.csproj') ? 'MS Build Project' : selectedFile.endsWith('.json') ? 'Config package' : 'Markdown documentation'}
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
          {isDotnet ? <ShieldAlert className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" /> : <HelpCircle className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />}
          <div>
            <h5 className="font-semibold text-slate-300 mb-0.5">{isDotnet ? 'DaraERP Inheritance Chains' : 'Where do I place these?'}</h5>
            <p className="leading-relaxed">
              {isDotnet 
                ? 'All domain entities strictly inherit from BaseEntity -> AuditableBaseEntity -> AuditableEntity to satisfy company isolation constraints.'
                : 'These files represent actual locations in a default Laravel 11 template. Make sure to download the project zip or copy them directly.'}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2.5">
          <HardDrive className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
          <div>
            <h5 className="font-semibold text-slate-300 mb-0.5">{isDotnet ? 'IUnitOfWork & Generic Repositories' : 'Database Migration Model'}</h5>
            <p className="leading-relaxed">
              {isDotnet 
                ? 'No direct ApplicationDbContext injection is allowed in MediatR handlers. Data accesses must go through _uow.Repository<TEntity>().'
                : 'The migration file creates the blog_posts and products tables automatically. Sync via php artisan migrate --seed.'}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2.5">
          <Cpu className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
          <div>
            <h5 className="font-semibold text-slate-300 mb-0.5">{isDotnet ? 'Soft Delete & Company Filters' : 'Color Palette Core'}</h5>
            <p className="leading-relaxed">
              {isDotnet 
                ? 'Deletion sets IsDeleted = true, DeletedAt, and DeletedBy. Every read operation uses TableNoTracking and is query-filtered by CompanyId.'
                : "Bootstrap's primary CSS root variable is set beautifully inside app.blade.php, ensuring branding remains consistent."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
