import { ColorPalette, WebDesignConfig, Page, DynamicBlogModel, DynamicProductModel, Block } from './types';

export const COLOR_PALETTES: ColorPalette[] = [
  {
    id: 'nordic-sky',
    name: 'Nordic Indigo (Modern)',
    primary: '#0d6efd', // Bootstrap default primary
    secondary: '#6c757d',
    dark: '#212529',
    light: '#f8f9fa',
    fontFamily: 'Space Grotesk'
  },
  {
    id: 'emerald-luxury',
    name: 'Forest Warmth (Elegant)',
    primary: '#198754', // Emerald green
    secondary: '#e0a96d', // Golden sandy
    dark: '#112211',
    light: '#f4fbf7',
    fontFamily: 'Playfair Display'
  },
  {
    id: 'cyber-dark',
    name: 'Cyberpunk Violet (Tech)',
    primary: '#764abc', // Deep purple
    secondary: '#0dcaf0', // Neon cyan
    dark: '#010511',
    light: '#f0f5ff',
    fontFamily: 'Inter'
  },
  {
    id: 'crimson-warmth',
    name: 'Crimson Warmth (Corporate)',
    primary: '#dc3545', // Crimson
    secondary: '#fd7e14', // Warm orange
    dark: '#1a0d0d',
    light: '#fffbfb',
    fontFamily: 'Outfit'
  },
  {
    id: 'brutalist-classic',
    name: 'Ink & Code (Minimal)',
    primary: '#000000',
    secondary: '#6c757d',
    dark: '#121212',
    light: '#ffffff',
    fontFamily: 'Fira Code'
  }
];

export const DEFAULT_BLOGS: DynamicBlogModel[] = [
  {
    id: 'blog-1',
    title: 'Deploying Laravel 11 on Modern VPS Hosting',
    slug: 'laravel-11-vps-hosting',
    excerpt: 'Learn the step-by-step procedure to config PHP 8.3, Nginx, and systemd for high-performance Laravel deploys.',
    body: 'Developing with Laravel is amazing, and when it comes to deployment, a standard VPS can provide unparalleled control and speed. First, update your server system and install PHP-FPM, PHP extensions, Redis, and MySQL. Next, establish a clean Deploy script via GitHub Actions to automate Git pulls, composer updates, migration, and optimization tasks...',
    category: 'DevOps',
    author: 'Alex Taylor',
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
    createdAt: '2026-06-12'
  },
  {
    id: 'blog-2',
    title: 'Designing Beautiful UIs with Bootstrap 5 Utility Classes',
    slug: 'bootstrap-5-utility-classes',
    excerpt: 'Avoid writing heavy CSS by masterly combining Bootstrap 5 spacing, typography, and flexbox utilities.',
    body: 'Bootstrap has undergone a revolutionary upgrade with version 5. By shedding jQuery dependency and expanding utility classes, developers can create boutique-style layouts directly within HTML. Utilize gap utilities, grid modifiers, and hover borders to bring custom aesthetic rhythm without creating manual stylesheet overhead...',
    category: 'Design',
    author: 'Sarah Jenkins',
    imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80',
    createdAt: '2026-06-15'
  }
];

export const DEFAULT_PRODUCTS: DynamicProductModel[] = [
  {
    id: 'prod-1',
    name: 'Premium Laravel Bootsrap Boilerplate',
    slug: 'laravel-bootstrap-boilerplate',
    price: '49.00',
    description: 'A pre-configured repository optimized with authentication, email verification, stripe, and social logins pre-baked.',
    imageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80',
    inStock: true
  },
  {
    id: 'prod-2',
    name: 'Universal Responsive Landing Templates',
    slug: 'responsive-landing-templates',
    price: '19.99',
    description: 'A collection of 10 spectacular section-driven marketing blocks built strictly on Bootstrap 5.',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
    inStock: true
  }
];

export const createDefaultBlocks = (pageTitle: string): Block[] => {
  return [
    {
      id: `navbar-${Math.random()}`,
      type: 'navbar',
      visible: true,
      brand: pageTitle,
      links: [
        { label: 'Home', url: '/' },
        { label: 'Features', url: '#features' },
        { label: 'Blog', url: '#blog' },
        { label: 'Pricing', url: '#pricing' },
        { label: 'Contact', url: '#contact' }
      ],
      ctaText: 'Get Started',
      ctaLink: '#pricing',
      sticky: true,
      themeStyle: 'dark'
    } as Block,
    {
      id: `hero-${Math.random()}`,
      type: 'hero',
      visible: true,
      title: 'Design Beautiful Bootstrap Websites for Laravel instantly',
      subtitle: 'The comprehensive No-Code CMS that generates optimized, standard Laravel projects using Blade, controllers, web routes, and pristine Bootstrap 5 styling.',
      ctaText: 'Start Building',
      ctaLink: '#features',
      secondaryCtaText: 'View Laravel PHP Code',
      secondaryCtaLink: '#code',
      layout: 'left-split',
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      bgPattern: 'gradient'
    } as Block,
    {
      id: `features-${Math.random()}`,
      type: 'features',
      visible: true,
      title: 'Spectacular Built-in Architectures',
      subtitle: 'Explore the high-fidelity features baked directly into our system out of the box.',
      columns: 3,
      items: [
        {
          id: 'feat-1',
          icon: 'Sparkles',
          title: 'Laravel Blade Generation',
          description: 'Pragmatic rendering with clean loops, native PHP helpers, conditions, and elegant extendable sections.'
        },
        {
          id: 'feat-2',
          icon: 'Database',
          title: 'Dynamic CMS Bindings',
          description: 'Map database schemas easily. Iterate lists via blade @foreach directives over blog items or product entries.'
        },
        {
          id: 'feat-3',
          icon: 'Cpu',
          title: 'Bootstrap 5 Sizing & Utilities',
          description: 'No bloated assets. Light, blazing-fast responsive utilities that make your interface look breathtaking.'
        }
      ]
    } as Block,
    {
      id: `blog-${Math.random()}`,
      type: 'blog',
      visible: true,
      title: 'Our Premium Journal',
      subtitle: 'Knowledge, guides, and masterclasses directly from our technical experts.',
      bindToModel: true,
      staticPosts: []
    } as Block,
    {
      id: `pricing-${Math.random()}`,
      type: 'pricing',
      visible: true,
      title: 'Clear, Transparent Pricing',
      subtitle: 'Empower your commercial production pipeline with our supportive membership schemes.',
      tiers: [
        {
          id: 'tier-1',
          name: 'Starter Kit',
          price: '$0',
          billing: 'Forever Free',
          features: [
            'Access to 5 Basic Templates',
            'Bootstrap 5 Static Source Exporter',
            'Full HTML & CSS layouts copy'
          ],
          ctaText: 'Sign Up Free',
          featured: false
        },
        {
          id: 'tier-2',
          name: 'Developer Core',
          price: '$29',
          billing: 'per month',
          features: [
            'Unlimited Laravel Project Architectures',
            'Database Model Bindings & Tables Builder',
            'Integrated Controller logic generator',
            'Premium 24/7 client support'
          ],
          ctaText: 'Become Core Member',
          featured: true
        }
      ]
    } as Block,
    {
      id: `contact-${Math.random()}`,
      type: 'contact',
      visible: true,
      title: 'Ready to launch?',
      subtitle: 'Reach out to our operations team for any enterprise assistance or deployment queries.',
      email: 'team@lara-bootstrap-cms.test',
      phone: '+1 (555) 724-4200',
      address: '742 Silicon Parkway, San Francisco CA',
      showMap: true,
      buttonText: 'Submit Inquiry'
    } as Block,
    {
      id: `footer-${Math.random()}`,
      type: 'footer',
      visible: true,
      text: 'Perfect union between MVC simplicity and responsive CSS. Build clean, deploy instantly, and impress universally.',
      copyright: '© 2026 LaraBoot Visual Builder. Distributed under standard MIT license.',
      socials: [
        { platform: 'Twitter', url: '#' },
        { platform: 'GitHub', url: '#' },
        { platform: 'LinkedIn', url: '#' }
      ]
    } as Block
  ];
};

export const createInitialConfig = (): WebDesignConfig => {
  return {
    projectName: 'lara_bootstrap_site',
    activePageId: 'home',
    colorPalette: COLOR_PALETTES[0],
    laravelVersion: 'v11.x',
    dbDriver: 'sqlite',
    blogModels: DEFAULT_BLOGS,
    productModels: DEFAULT_PRODUCTS,
    pages: [
      {
        id: 'home',
        title: 'Home Page',
        slug: 'index',
        blocks: createDefaultBlocks('LaraBoot Core')
      }
    ]
  };
};
