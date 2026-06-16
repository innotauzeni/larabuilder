import React, { useEffect, useRef } from 'react';
import { WebDesignConfig, Block } from '../types';
import { getBootstrapIconClass } from '../utils/laravel-generator';

interface CanvasPreviewProps {
  config: WebDesignConfig;
  selectedBlockId: string | null;
  onSelectBlock: (blockId: string) => void;
  viewportWidth: 'desktop' | 'tablet' | 'mobile';
}

export default function CanvasPreview({
  config,
  selectedBlockId,
  onSelectBlock,
  viewportWidth
}: CanvasPreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const activePage = config.pages.find(p => p.id === config.activePageId) || config.pages[0];

  // Helper to convert hex to RGB
  function hexToRgb(hex: string): string {
    let c = hex.substring(1);
    if (c.length === 3) {
      c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
    }
    const num = parseInt(c, 16);
    return `${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}`;
  }

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    // Compile customized active sections into standard Bootstrap 5 HTML
    let htmlContent = '';
    
    activePage.blocks.forEach((block: Block) => {
      if (!block.visible) return;

      const blockActiveOutline = block.id === selectedBlockId 
        ? 'border: 3px dashed #fc135d; position: relative; border-radius: 4px; box-shadow: 0 0 16px rgba(252,19,93,0.3);' 
        : 'border: 1px transparent solid; cursor: pointer; transition: all 0.2s ease;';

      const wrapperStart = `<div class="cms-block-wrapper" data-id="${block.id}" style="${blockActiveOutline}" title="Click to edit ${block.type}">`;
      const wrapperEnd = `</div>`;

      let inner = '';

      switch (block.type) {
        case 'navbar': {
          const bgClass = block.themeStyle === 'dark' ? 'bg-dark navbar-dark' : block.themeStyle === 'primary' ? 'bg-primary navbar-dark' : 'bg-light navbar-light';
          inner = `
            <nav class="navbar navbar-expand-lg ${bgClass} ${block.sticky ? 'sticky-top shadow' : ''} py-3">
              <div class="container">
                <a class="navbar-brand fw-bold fs-3 d-flex align-items-center" href="#home">
                  <i class="bi bi-cpu text-primary me-2"></i> ${config.projectName}
                </a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav-${block.id}">
                  <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="nav-${block.id}">
                  <ul class="navbar-nav mx-auto mb-2 mb-lg-0">
                    ${block.links.map(link => `
                      <li class="nav-item">
                        <a class="nav-link px-3" href="${link.url}">${link.label}</a>
                      </li>
                    `).join('')}
                  </ul>
                  <a href="${block.ctaLink}" class="btn btn-primary px-4 rounded-pill fw-semibold shadow-sm">${block.ctaText}</a>
                </div>
              </div>
            </nav>
          `;
          break;
        }
        case 'hero': {
          const bgClass = block.bgPattern === 'gradient' ? 'gradient-banner' : block.bgPattern === 'glass' ? 'bg-body-tertiary border-bottom glass-card' : 'bg-body';
          
          let columns = '';
          if (block.layout === 'center') {
            columns = `
              <div class="col-lg-8 mx-auto text-center">
                <h1 class="display-4 fw-bold mb-3">${block.title}</h1>
                <p class="lead mb-4 opacity-90">${block.subtitle}</p>
                <div class="d-flex justify-content-center gap-3">
                  <a href="${block.ctaLink}" class="btn btn-primary btn-lg px-4 rounded-pill shadow">${block.ctaText}</a>
                  <a href="${block.secondaryCtaLink}" class="btn btn-outline-dark btn-lg px-4 rounded-pill">${block.secondaryCtaText}</a>
                </div>
              </div>
            `;
          } else if (block.layout === 'left-split') {
            columns = `
              <div class="col-lg-6 my-auto text-start">
                <span class="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 rounded-pill mb-3 text-uppercase tracking-wider">Laravel Blade & Bootstrap</span>
                <h1 class="display-5 fw-bold mb-3">${block.title}</h1>
                <p class="lead mb-4 opacity-90">${block.subtitle}</p>
                <div class="d-flex gap-3">
                  <a href="${block.ctaLink}" class="btn btn-primary btn-lg px-4 rounded-pill shadow-sm">${block.ctaText}</a>
                  <a href="${block.secondaryCtaLink}" class="btn btn-outline-secondary btn-lg px-4 rounded-pill">${block.secondaryCtaText}</a>
                </div>
              </div>
              <div class="col-lg-6 mt-4 mt-lg-0">
                <img src="${block.imageUrl}" class="img-fluid rounded-4 shadow-lg border" alt="Hero representation" referrerPolicy="no-referrer">
              </div>
            `;
          } else {
            columns = `
              <div class="col-lg-6 mb-4 my-auto">
                <img src="${block.imageUrl}" class="img-fluid rounded-4 shadow-lg border" alt="Hero representation" referrerPolicy="no-referrer">
              </div>
              <div class="col-lg-6 my-auto text-start ps-lg-5">
                <h1 class="display-5 fw-bold mb-3">${block.title}</h1>
                <p class="lead mb-4 opacity-90">${block.subtitle}</p>
                <div class="d-flex gap-3">
                  <a href="${block.ctaLink}" class="btn btn-primary btn-lg px-4 rounded-pill shadow-sm">${block.ctaText}</a>
                  <a href="${block.secondaryCtaLink}" class="btn btn-outline-secondary btn-lg px-4 rounded-pill">${block.secondaryCtaText}</a>
                </div>
              </div>
            `;
          }

          inner = `
            <header class="${bgClass} py-5 border-bottom">
              <div class="container py-4">
                <div class="row align-items-center">
                  ${columns}
                </div>
              </div>
            </header>
          `;
          break;
        }
        case 'features': {
          const colClass = block.columns === 4 ? 'col-lg-3' : block.columns === 2 ? 'col-lg-6' : 'col-lg-4';
          inner = `
            <section class="py-5 bg-body-secondary" id="features">
              <div class="container py-4 text-center">
                <h2 class="fw-bold text-dark display-6 mb-2">${block.title}</h2>
                <p class="text-secondary col-md-8 mx-auto mb-5 lead">${block.subtitle}</p>
                <div class="row g-4 text-start">
                  ${block.items.map(item => `
                    <div class="${colClass} col-md-6">
                      <div class="card h-100 p-4 border shadow-sm rounded-4 bg-body">
                        <div class="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary fs-3 rounded-3 p-3 mb-3" style="width: 56px; height: 56px;">
                          <i class="bi ${getBootstrapIconClass(item.icon)}"></i>
                        </div>
                        <h4 class="fw-bold mb-2 text-dark">${item.title}</h4>
                        <p class="text-secondary small mb-0">${item.description}</p>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            </section>
          `;
          break;
        }
        case 'stats': {
          inner = `
            <section class="py-5 gradient-banner text-center text-white">
              <div class="container py-3">
                <h3 class="fw-bold mb-3">${block.title}</h3>
                <p class="lead opacity-90 col-md-8 mx-auto mb-5">${block.subtitle}</p>
                <div class="row g-4 justify-content-center">
                  ${block.items.map(item => `
                    <div class="col-6 col-md-3">
                      <h2 class="display-4 fw-black mb-1">${item.number}</h2>
                      <p class="text-uppercase tracking-wider small opacity-75 mb-0">${item.label}</p>
                    </div>
                  `).join('')}
                </div>
              </div>
            </section>
          `;
          break;
        }
        case 'blog': {
          const articles = config.blogModels;
          inner = `
            <section class="py-5 bg-body" id="blog">
              <div class="container py-4">
                <div class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-5">
                  <div>
                    <h2 class="fw-bold text-dark display-6 mb-1">${block.title}</h2>
                    <p class="text-secondary lead mb-0">${block.subtitle}</p>
                  </div>
                  <span class="badge bg-secondary rounded-pill mt-2 mt-md-0 px-3 py-2">Dynamic Model Bound</span>
                </div>
                
                <div class="row g-4">
                  ${articles.map(art => `
                    <div class="col-lg-6">
                      <div class="card h-100 border rounded-4 overflow-hidden shadow-sm bg-body">
                        <div class="row g-0 h-100">
                          <div class="col-md-5">
                            <img src="${art.imageUrl}" class="img-fluid h-100 object-fit-cover" style="min-height: 180px; width: 100%" alt="${art.title}" referrerPolicy="no-referrer">
                          </div>
                          <div class="col-md-7 d-flex flex-column p-4">
                            <span class="badge bg-primary-subtle text-primary align-self-start mb-2">${art.category}</span>
                            <h5 class="fw-bold text-dark mb-2">${art.title}</h5>
                            <p class="text-secondary small flex-grow-1">${art.excerpt}</p>
                            <div class="d-flex align-items-center mt-3 pt-3 border-top justify-content-between text-muted small">
                              <span>${art.author}</span>
                              <span>${art.createdAt}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            </section>
          `;
          break;
        }
        case 'pricing': {
          inner = `
            <section class="py-5 bg-body-secondary" id="pricing">
              <div class="container py-4 text-center">
                <h2 class="fw-bold text-dark display-6 mb-2">${block.title}</h2>
                <p class="text-secondary lead col-md-8 mx-auto mb-5">${block.subtitle}</p>
                <div class="row g-4 justify-content-center text-start">
                  ${block.tiers.map(tier => `
                    <div class="col-lg-4 col-md-6">
                      <div class="card h-100 p-4 border ${tier.featured ? 'border-primary border-3 shadow-lg' : 'shadow-sm'} rounded-4 bg-body d-flex flex-column">
                        ${tier.featured ? '<span class="badge bg-primary text-white rounded-pill px-3 py-2 align-self-start mb-3">Most Popular</span>' : ''}
                        <h4 class="fw-bold text-dark mb-1">${tier.name}</h4>
                        <div class="d-flex align-items-baseline mb-3">
                          <span class="display-5 fw-bold text-dark">${tier.price}</span>
                          <span class="text-secondary ms-2">${tier.billing}</span>
                        </div>
                        <ul class="list-unstyled flex-grow-1 border-top pt-3 mb-4">
                          ${tier.features.map(f => `
                            <li class="mb-2 d-flex align-items-center">
                              <i class="bi bi-patch-check-fill text-success me-2"></i>
                              <span class="text-secondary-subtitle">${f}</span>
                            </li>
                          `).join('')}
                        </ul>
                        <button class="btn ${tier.featured ? 'btn-primary' : 'btn-outline-dark'} btn-lg w-100 rounded-pill shadow-sm py-2 fw-semibold">${tier.ctaText}</button>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            </section>
          `;
          break;
        }
        case 'testimonials': {
          inner = `
            <section class="py-5 bg-body">
              <div class="container py-4 text-center">
                <h2 class="fw-bold text-dark display-6 mb-2">${block.title}</h2>
                <p class="text-secondary col-md-8 mx-auto mb-5 lead">${block.subtitle}</p>
                <div class="row g-4 text-start">
                  ${block.items.map(item => `
                    <div class="col-md-6 col-lg-4">
                      <div class="card h-100 p-4 border rounded-4 shadow-sm bg-body d-flex flex-column justify-content-between">
                        <div>
                          <div class="text-warning mb-3">
                            ${Array.from({ length: item.stars }).map(() => '<i class="bi bi-star-fill me-1"></i>').join('')}
                          </div>
                          <p class="text-secondary italic mb-4">"${item.text}"</p>
                        </div>
                        <div class="d-flex align-items-center border-top pt-3">
                          <div class="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold me-3" style="width: 44px; height: 44px;">
                            ${item.author[0]}
                          </div>
                          <div>
                            <h6 class="fw-bold text-dark mb-0">${item.author}</h6>
                            <small class="text-muted">${item.role}</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            </section>
          `;
          break;
        }
        case 'gallery': {
          const colClass = block.columns === 4 ? 'col-lg-3' : 'col-lg-4';
          inner = `
            <section class="py-5 bg-body-secondary">
              <div class="container py-4">
                <div class="text-center mb-5">
                  <h2 class="fw-bold text-dark display-6 mb-2">${block.title}</h2>
                  <p class="text-secondary lead col-md-8 mx-auto">${block.subtitle}</p>
                </div>
                <div class="row g-4">
                  ${block.items.map(img => `
                    <div class="${colClass} col-md-6">
                      <div class="card h-100 overflow-hidden border shadow-sm rounded-4 bg-body">
                        <img src="${img.imageUrl}" class="img-fluid" style="height: 220px; object-fit: cover;" alt="${img.title}" referrerPolicy="no-referrer">
                        <div class="p-3">
                          <h5 class="fw-bold text-dark mb-1">${img.title}</h5>
                          <p class="text-secondary small mb-0">${img.description}</p>
                        </div>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            </section>
          `;
          break;
        }
        case 'contact': {
          inner = `
            <section class="py-5 bg-body" id="contact">
              <div class="container py-4">
                <div class="row g-5 align-items-stretch">
                  <div class="col-lg-5 d-flex flex-column justify-content-between">
                    <div>
                      <span class="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 rounded-pill mb-3">Deployment Hub</span>
                      <h2 class="fw-bold text-dark display-6 mb-3">${block.title}</h2>
                      <p class="text-secondary mb-4 lead">${block.subtitle}</p>
                    </div>
                    <div class="mb-4">
                      <div class="d-flex align-items-center mb-3">
                        <span class="bg-primary bg-opacity-10 text-primary p-2 rounded-3 me-3 fs-3"><i class="bi bi-envelope"></i></span>
                        <div>
                          <h6 class="fw-bold mb-0">Email Address</h6>
                          <span class="text-secondary small">${block.email}</span>
                        </div>
                      </div>
                      <div class="d-flex align-items-center mb-3">
                        <span class="bg-primary bg-opacity-10 text-primary p-2 rounded-3 me-3 fs-3"><i class="bi bi-telephone"></i></span>
                        <div>
                          <h6 class="fw-bold mb-0">Telephone Support</h6>
                          <span class="text-secondary small">${block.phone}</span>
                        </div>
                      </div>
                      <div class="d-flex align-items-center">
                        <span class="bg-primary bg-opacity-10 text-primary p-2 rounded-3 me-3 fs-3"><i class="bi bi-geo-alt"></i></span>
                        <div>
                          <h6 class="fw-bold mb-0">Silicon HQ Location</h6>
                          <span class="text-secondary small">${block.address}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-lg-7">
                    <div class="card p-4 p-md-5 border shadow-sm rounded-4 bg-body">
                      <form onsubmit="event.preventDefault(); alert('Inquiry Simulation Validated!');">
                        <div class="row g-3">
                          <div class="col-md-6">
                            <label class="form-label text-secondary small fw-semibold">Your Full Name</label>
                            <input type="text" class="form-control rounded-pill py-2 px-3" required placeholder="Alex Mercer" disabled>
                          </div>
                          <div class="col-md-6">
                            <label class="form-label text-secondary small fw-semibold">Email Account</label>
                            <input type="email" class="form-control rounded-pill py-2 px-3" required placeholder="alex@mercer.com" disabled>
                          </div>
                          <div class="col-12">
                            <label class="form-label text-secondary small fw-semibold">Message Body</label>
                            <textarea class="form-control rounded-3" rows="3" placeholder="Click in CMS edit panel to customize inputs..." disabled></textarea>
                          </div>
                          <button type="button" class="btn btn-primary rounded-pill w-100 py-3 fw-semibold shadow-sm mt-3">${block.buttonText}</button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          `;
          break;
        }
        case 'footer': {
          inner = `
            <footer class="py-5 bg-dark text-white border-top">
              <div class="container py-3">
                <div class="row g-4 align-items-center justify-content-between">
                  <div class="col-md-5">
                    <h5 class="fw-bold text-white mb-3"><i class="bi bi-cpu text-primary me-2"></i> ${config.projectName}</h5>
                    <p class="text-secondary small mb-0">${block.text}</p>
                  </div>
                  <div class="col-md-4 text-md-end text-start">
                    <h6 class="fw-bold text-white mb-2">Connect Digitally</h6>
                    <div class="d-flex justify-content-md-end gap-3 mb-3">
                      ${block.socials.map(soc => `
                        <a href="${soc.url}" class="text-white text-decoration-none bg-secondary bg-opacity-25 rounded-circle d-inline-flex align-items-center justify-content-center shadow-sm" style="width: 40px; height: 40px;">
                          <i class="bi bi-${soc.platform.toLowerCase() === 'twitter' ? 'twitter-x' : soc.platform.toLowerCase()}"></i>
                        </a>
                      `).join('')}
                    </div>
                  </div>
                </div>
                <div class="border-top border-secondary mt-4 pt-4 text-center">
                  <p class="text-secondary small mb-0">${block.copyright}</p>
                </div>
              </div>
            </footer>
          `;
          break;
        }
      }

      htmlContent += `${wrapperStart}${inner}${wrapperEnd}`;
    });

    const docSource = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Visual Preview - LaraBoot Builder</title>
        
        <!-- Load robust external Bootstrap 5 CSS -->
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
        <!-- Load interactive Bootstrap Icons -->
        <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" rel="stylesheet">
        
        <!-- Color definitions mapping -->
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&family=Inter:wght@400;500;600;700&family=Outfit:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Space+Grotesk:wght@400;500;600;700&display=swap');

          :root {
            --bs-primary: ${config.colorPalette.primary};
            --bs-secondary: ${config.colorPalette.secondary};
            --bs-primary-rgb: ${hexToRgb(config.colorPalette.primary)};
            --bs-secondary-rgb: ${hexToRgb(config.colorPalette.secondary)};
            --cms-dark: ${config.colorPalette.dark};
            --cms-light: ${config.colorPalette.light};
          }
          body {
            font-family: '${config.colorPalette.fontFamily}', -apple-system, BlinkMacSystemFont, sans-serif;
            background-color: var(--cms-light);
            color: var(--cms-dark);
            margin: 0;
            padding: 0;
            overflow-x: hidden;
          }
          .gradient-banner {
            background: linear-gradient(135deg, var(--bs-primary) 0%, var(--bs-secondary) 100%);
            color: white;
          }
          .glass-card {
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(8px);
            border: 1px solid rgba(255, 255, 255, 0.2);
          }
          
          /* Interactivity helpers */
          .cms-block-wrapper:hover {
            border: 3px dashed var(--bs-primary) !important;
            border-radius: 4px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          }
        </style>
      </head>
      <body>
        ${htmlContent}
        
        <script>
          // Enable click delegation to notify the parent builder UI of selected block edits
          document.body.addEventListener('click', function(e) {
            const wrapper = e.target.closest('.cms-block-wrapper');
            if (wrapper) {
              const blockId = wrapper.getAttribute('data-id');
              window.parent.postMessage({ type: 'BLOCK_SELECTED', id: blockId }, '*');
            }
          });
        </script>
      </body>
      </html>
    `;

    iframe.srcdoc = docSource;
  }, [config, selectedBlockId, activePage]);

  // Set up listener for messages originating inside the custom Iframe trigger
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === 'BLOCK_SELECTED') {
        onSelectBlock(e.data.id);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onSelectBlock]);

  // Map responsive screen layout values
  const viewportStyles = {
    desktop: 'w-full h-full max-w-full',
    tablet: 'w-[768px] h-[90%] max-w-full border-x-4 border-slate-700 shadow-2xl rounded-xl',
    mobile: 'w-[375px] h-[82%] max-w-full border-x-8 border-t-8 border-b-12 border-slate-800 shadow-2xl rounded-[36px]'
  };

  return (
    <div className="flex-1 bg-slate-900/60 p-4 lg:p-8 flex items-center justify-center overflow-hidden min-h-[440px] relative">
      <div className="absolute top-4 left-6 flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse"></span>
        <span className="text-xs font-mono text-slate-400 font-medium tracking-wide">
          BOOTSTRAP 5 LIVE SCOPED VIEWPORT - {config.projectName}
        </span>
      </div>

      <div className={`transition-all duration-300 ease-out bg-white overflow-hidden flex flex-col relative ${viewportStyles[viewportWidth]}`}>
        {/* Mock top phone/browser bar */}
        {viewportWidth !== 'desktop' && (
          <div className="bg-slate-800 text-slate-400 py-1 px-4 text-[10px] font-mono flex justify-between items-center select-none border-b border-slate-750">
            <span className="font-semibold text-slate-300">9:41 AM</span>
            <div className="w-16 h-3 bg-slate-900 rounded-full mx-auto hidden sm:block"></div>
            <div className="flex gap-1.5 items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>100% LaraSSL</span>
            </div>
          </div>
        )}

        <iframe
          ref={iframeRef}
          className="w-full flex-1 border-0"
          title="Sandbox page workspace preview"
          referrerPolicy="no-referrer"
        />
      </div>
    </div>
  );
}
