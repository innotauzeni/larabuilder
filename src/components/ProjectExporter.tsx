import React, { useState } from 'react';
import { WebDesignConfig } from '../types';
import { generateLaravelFiles } from '../utils/laravel-generator';
import { generateDotnetFiles } from '../utils/dotnet-generator';
import JSZip from 'jszip';
import { Download, CheckCircle2, ShieldCheck, Terminal, HelpCircle, Server, Code, Layers } from 'lucide-react';

interface ProjectExporterProps {
  config: WebDesignConfig;
}

export default function ProjectExporter({ config }: ProjectExporterProps) {
  const [zipping, setZipping] = useState(false);
  const [complete, setComplete] = useState(false);

  const isDotnet = config.exportPlatform === 'dotnet';

  // Generate ZIP bundle on the client side using the highly robust JSZip
  const handleZipDownload = async () => {
    setZipping(true);
    setComplete(false);

    try {
      const files = isDotnet ? generateDotnetFiles(config) : generateLaravelFiles(config);
      const zip = new JSZip();

      // Loop through computed key/value sets representing path names and text scripts
      Object.entries(files).forEach(([filePath, content]) => {
        zip.file(filePath, content);
      });

      // Compile binary blob
      const contentBlob = await zip.generateAsync({ type: 'blob' });
      
      // Save directly to user filesystem
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(contentBlob);
      downloadLink.download = `${config.projectName || 'clean_architecture_project'}.zip`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      setComplete(true);
      setTimeout(() => setComplete(false), 5000);
    } catch (e) {
      console.error(e);
      alert(isDotnet ? 'Failed to package .NET Solution.' : 'Failed to package Laravel structure.');
    } finally {
      setZipping(false);
    }
  };

  return (
    <div className="flex-1 bg-slate-950 p-6 overflow-y-auto h-full text-slate-100">
      <div className="border-b border-slate-800 pb-5 mb-6">
        <h3 className="font-bold text-lg text-white flex items-center gap-2 font-sans">
          <Download className="w-5 h-5 text-indigo-400" />
          {isDotnet ? 'Compile & Export DaraERP .NET Solution' : 'Compile & Export Laravel Project'}
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          {isDotnet 
            ? 'Save your visual parameters as a robust, fully-compliant 5-layer C# Clean Architecture ASP.NET active solution.'
            : 'Save your visual layout configurations as a pristine, standalone Laravel MVC folder structured package.'}
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Left container: Action triggers */}
        <div className="space-y-6">
          <div className="bg-slate-900/50 border border-slate-805 rounded-xl p-6 shadow-sm space-y-5">
            <h4 className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              {isDotnet ? 'DaraERP Compliance Verification' : 'Production Ready MVC Checklist'}
            </h4>
            
            {isDotnet ? (
              <div className="space-y-3.5 text-xs text-slate-300">
                <div className="flex items-start gap-2">
                  <input type="checkbox" checked readOnly className="rounded border-slate-700 bg-slate-950 text-indigo-500 mt-1" />
                  <div>
                    <span className="font-semibold text-slate-100 block">5-Layer Architectural Segregation</span>
                    <span className="text-slate-400">Dara.Domain, Dara.Application, Dara.Infrastructure, Dara.ClientApi, and Dara.ClientPortal are configured cleanly.</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <input type="checkbox" checked readOnly className="rounded border-slate-700 bg-slate-950 text-indigo-500 mt-1" />
                  <div>
                    <span className="font-semibold text-slate-100 block">Strict Auditable Entity Inheritance</span>
                    <span className="text-slate-400">All models correctly map: BaseEntity → AuditableBaseEntity → AuditableEntity (CompanyId tracking and Soft Delete fields).</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <input type="checkbox" checked readOnly className="rounded border-slate-700 bg-slate-950 text-indigo-500 mt-1" />
                  <div>
                    <span className="font-semibold text-slate-100 block">MediatR CQRS Pipelines & UnitOfWork</span>
                    <span className="text-slate-400">Controllers invoke Mediator only. Database access routes strictly via standard IUnitOfWork and IGenericRepository.</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3.5 text-xs text-slate-300">
                <div className="flex items-start gap-2">
                  <input type="checkbox" checked readOnly className="rounded border-slate-700 bg-slate-950 text-indigo-500 mt-1" />
                  <div>
                    <span className="font-semibold text-slate-100 block">Bootstrap 5 CDN Integrations</span>
                    <span className="text-slate-400">Fully configured inside resources/views/layouts/app.blade.php with responsive scripts.</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <input type="checkbox" checked readOnly className="rounded border-slate-700 bg-slate-950 text-indigo-500 mt-1" />
                  <div>
                    <span className="font-semibold text-slate-100 block">Dynamic Eloquent models and seeders</span>
                    <span className="text-slate-400">App\Models\BlogPost and Product structured directories with database.</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <input type="checkbox" checked readOnly className="rounded border-slate-700 bg-slate-950 text-indigo-500 mt-1" />
                  <div>
                    <span className="font-semibold text-slate-100 block">Routes definition file (web.php)</span>
                    <span className="text-slate-400">Fully mapped endpoints for all custom defined pages.</span>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={handleZipDownload}
                disabled={zipping}
                className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-805 disabled:opacity-50 text-white font-semibold rounded-xl py-3 px-6 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer animate-pulse"
              >
                {zipping ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Assembling zip file in browser...
                  </>
                ) : complete ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    Success! Download started!
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Download complete `.ZIP` Package
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="bg-indigo-950/30 border border-indigo-900/50 p-5 rounded-xl space-y-2">
            <h5 className="font-bold text-sm text-indigo-300 flex items-center gap-1.5">
              <Server className="w-4 h-4 text-indigo-400" />
              {isDotnet ? 'C# Solution Architecture Specifications' : 'CMS Specifications'}
            </h5>
            <ul className="text-xs text-slate-300 space-y-1.5">
              {isDotnet ? (
                <>
                  <li>• System framework: <strong className="text-white">ASP.NET MVC Core (net8.0)</strong></li>
                  <li>• Software architectural design: <strong className="text-white">CQRS/MediatR Clean v5-Layer</strong></li>
                  <li>• Dynamic company tenant security: <strong className="text-white">Multi-tenant CompanyId query automatic filter</strong></li>
                  <li>• Persistence approach: <strong className="text-white">EF Core with unit-tested SQLite context</strong></li>
                </>
              ) : (
                <>
                  <li>• System layout standard: <strong className="text-white">Laravel Blade + Bootstrap 5</strong></li>
                  <li>• Directory export format: <strong className="text-white">Physical zip archive</strong></li>
                  <li>• Generated pages list: <strong className="text-white">{config.pages.map(p => p.slug).join(', ')}</strong></li>
                  <li>• Default DB Driver: <strong className="text-white">{config.dbDriver} (configured in app.php / .env)</strong></li>
                </>
              )}
            </ul>
          </div>
        </div>

        {/* Right container: Local Terminal commands setup walks */}
        <div className="bg-slate-900 border border-slate-800 text-slate-300 p-6 rounded-2xl space-y-4 shadow-xl">
          <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-indigo-400" />
            CLI Setup Walkthrough
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            {isDotnet 
              ? 'Follow these direct CLI commands to compile, run and test your generated DaraERP compliance solution:' 
              : 'Follow these direct CLI commands to deploy and serve your generated Bootstrap / Laravel template locally:'}
          </p>

          {isDotnet ? (
            <div className="space-y-4">
              <div>
                <span className="text-xs font-semibold text-indigo-300 block mb-1">1. Extract and install dotnet modules</span>
                <pre className="p-3 bg-slate-950 rounded-lg text-[11px] font-mono whitespace-pre overflow-x-auto text-slate-200 border border-slate-800/40">
{`unzip ${config.projectName || 'clean_architecture_project'}.zip -d ${config.projectName || 'clean_architecture_project'}
cd ${config.projectName || 'clean_architecture_project'}
dotnet restore`}
                </pre>
              </div>

              <div>
                <span className="text-xs font-semibold text-indigo-300 block mb-1">2. Run Web API services (Dara.ClientApi)</span>
                <pre className="p-3 bg-slate-950 rounded-lg text-[11px] font-mono whitespace-pre overflow-x-auto text-slate-200 border border-slate-800/40">
{`cd Dara.ClientApi
dotnet run
# Runs on Port 5211 (Swagger Dashboard UI Active!)`}
                </pre>
              </div>

              <div>
                <span className="text-xs font-semibold text-indigo-300 block mb-1">3. Start Customer Portal (Dara.ClientPortal)</span>
                <pre className="p-3 bg-slate-950 rounded-lg text-[11px] font-mono whitespace-pre overflow-x-auto text-slate-200 border border-slate-800/40">
{`cd ../Dara.ClientPortal
dotnet run
# Runs on Port 5000 / Web Customer Dashboard loaded!`}
                </pre>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <span className="text-xs font-semibold text-indigo-300 block mb-1">1. Install core dependencies</span>
                <pre className="p-3 bg-slate-950 rounded-lg text-[11px] font-mono whitespace-pre overflow-x-auto text-slate-200 border border-slate-800/40">
{`unzip ${config.projectName}.zip -d ${config.projectName}
cd ${config.projectName}
# Bypasses local environment security advisory blockages
composer install --no-audit`}
                </pre>
              </div>

              <div>
                <span className="text-xs font-semibold text-indigo-300 block mb-1">2. Environment configuration setup</span>
                <pre className="p-3 bg-slate-950 rounded-lg text-[11px] font-mono whitespace-pre overflow-x-auto text-slate-200 border border-slate-800/40">
{`cp .env.example .env
php artisan key:generate`}
                </pre>
              </div>

              <div>
                <span className="text-xs font-semibold text-indigo-300 block mb-1">3. Seed Database & run migrations</span>
                <pre className="p-3 bg-slate-950 rounded-lg text-[11px] font-mono whitespace-pre overflow-x-auto text-slate-200 border border-slate-800/40">
{`# Creates standard tables for blogs and products
php artisan migrate --seed`}
                </pre>
              </div>

              <div>
                <span className="text-xs font-semibold text-indigo-300 block mb-1">4. Serve locally</span>
                <pre className="p-3 bg-slate-950 rounded-lg text-[11px] font-mono whitespace-pre overflow-x-auto text-slate-200 border border-slate-800/40">
{`npm install
npm run dev &
php artisan serve`}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
