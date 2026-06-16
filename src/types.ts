export type BlockType = 
  | 'navbar'
  | 'hero'
  | 'features'
  | 'stats'
  | 'pricing'
  | 'blog'
  | 'testimonials'
  | 'gallery'
  | 'contact'
  | 'footer';

export interface BaseBlock {
  id: string;
  type: BlockType;
  visible: boolean;
}

export interface NavbarBlock extends BaseBlock {
  type: 'navbar';
  brand: string;
  links: Array<{ label: string; url: string }>;
  ctaText: string;
  ctaLink: string;
  sticky: boolean;
  themeStyle: 'light' | 'dark' | 'primary';
}

export interface HeroBlock extends BaseBlock {
  type: 'hero';
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  layout: 'center' | 'left-split' | 'right-split';
  imageUrl: string;
  bgPattern: 'default' | 'gradient' | 'glass' | 'toned-down';
}

export interface FeatureItem {
  id: string;
  icon: string; // lucide icon name
  title: string;
  description: string;
}

export interface FeaturesBlock extends BaseBlock {
  type: 'features';
  title: string;
  subtitle: string;
  columns: 3 | 4 | 2;
  items: FeatureItem[];
}

export interface StatItem {
  id: string;
  number: string;
  label: string;
}

export interface StatsBlock extends BaseBlock {
  type: 'stats';
  title: string;
  subtitle: string;
  items: StatItem[];
}

export interface PricingTier {
  id: string;
  name: string;
  price: string;
  billing: string;
  features: string[];
  ctaText: string;
  featured: boolean;
}

export interface PricingBlock extends BaseBlock {
  type: 'pricing';
  title: string;
  subtitle: string;
  tiers: PricingTier[];
}

export interface TestimonialItem {
  id: string;
  text: string;
  author: string;
  role: string;
  stars: number;
}

export interface TestimonialsBlock extends BaseBlock {
  type: 'testimonials';
  title: string;
  subtitle: string;
  items: TestimonialItem[];
}

export interface GalleryItem {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
}

export interface GalleryBlock extends BaseBlock {
  type: 'gallery';
  title: string;
  subtitle: string;
  columns: 3 | 4;
  items: GalleryItem[];
}

export interface ContactBlock extends BaseBlock {
  type: 'contact';
  title: string;
  subtitle: string;
  email: string;
  phone: string;
  address: string;
  showMap: boolean;
  buttonText: string;
}

export interface FooterBlock extends BaseBlock {
  type: 'footer';
  text: string;
  copyright: string;
  socials: Array<{ platform: string; url: string }>;
}

export interface BlogBlock extends BaseBlock {
  type: 'blog';
  title: string;
  subtitle: string;
  bindToModel: boolean; // if true, it dynamically renders mock DB articles
  staticPosts: Array<{ id: string; title: string; category: string; description: string; date: string; author: string }>;
}

export type Block = 
  | NavbarBlock 
  | HeroBlock 
  | FeaturesBlock 
  | StatsBlock 
  | PricingBlock 
  | TestimonialsBlock 
  | GalleryBlock 
  | ContactBlock 
  | FooterBlock
  | BlogBlock;

export interface Page {
  id: string;
  title: string;
  slug: string;
  blocks: Block[];
}

// Global Theme Customization
export interface ColorPalette {
  id: string;
  name: string;
  primary: string; // e.g. #3b82f6 (mapped to bootstrap custom root)
  secondary: string;
  dark: string;
  light: string;
  fontFamily: 'Inter' | 'Outfit' | 'Playfair' | 'Space Grotesk' | 'Fira Code';
}

// Mock Content Database schemas for Laravel dynamic bindings
export interface DynamicBlogModel {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  category: string;
  author: string;
  imageUrl: string;
  createdAt: string;
}

export interface DynamicProductModel {
  id: string;
  name: string;
  slug: string;
  price: string;
  description: string;
  imageUrl: string;
  inStock: boolean;
}

export interface WebDesignConfig {
  projectName: string;
  activePageId: string;
  colorPalette: ColorPalette;
  pages: Page[];
  blogModels: DynamicBlogModel[];
  productModels: DynamicProductModel[];
  laravelVersion: 'v11.x' | 'v10.x';
  dbDriver: 'mysql' | 'sqlite' | 'pgsql';
}
