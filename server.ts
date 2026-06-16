import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Lazy initialize Gemini API client to prevent crash if key is missing on start
let _ai: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!_ai) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY is not configured in environment variables.");
    }
    _ai = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return _ai;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // API Routes: AI Layout Generator
  app.post("/api/ai/generate-layout", async (req, res) => {
    try {
      const { prompt, pageTitle } = req.body;
      if (!prompt) {
        res.status(400).json({ error: "Prompt is required" });
        return;
      }

      const client = getGeminiClient();
      const systemInstruction = `
You are an expert bootstrap 5 and laravel blade designer.
Based on the user's describing goal, map out a beautiful and complete landing page block configuration!
Choose 5 to 7 logical landing page blocks from this list: 'navbar', 'hero', 'features', 'stats', 'pricing', 'blog', 'testimonials', 'gallery', 'contact', 'footer'.

Return a JSON array of blocks according to these interface definitions:
Type definitions to strictly match:
1. NavbarBlock: { id: "nav-...", type: "navbar", brand: string, ctaText: string, ctaLink: string, sticky: boolean, links: [{label, url}] }
2. HeroBlock: { id: "hero-...", type: "hero", title: string, subtitle: string, ctaText: string, ctaLink: string, secondaryCtaText: string, secondaryCtaLink: string, layout: "center"|"left-split"|"right-split", imageUrl: string, bgPattern: "default"|"gradient"|"glass"|"toned-down" }
3. FeaturesBlock: { id: "feat-...", type: "features", title: string, subtitle: string, columns: 3, items: [{id, icon: "lucide-icon-name", title, description}] }
   Note: Choose typical Lucide icon strings like: Sparkles, Database, Shield, Zap, Box, ShoppingCart, Users, Heart, Star, Globe, TrendingUp.
4. StatsBlock: { id: "stat-...", type: "stats", title: string, subtitle: string, items: [{id, number, label}] }
5. PricingBlock: { id: "price-...", type: "pricing", title: string, subtitle: string, tiers: [{id, name, price, billing, features: string[], ctaText: string, featured: boolean}] }
6. BlogBlock: { id: "blog-...", type: "blog", title: string, subtitle: string, bindToModel: boolean, staticPosts: [] }
7. TestimonialsBlock: { id: "test-...", type: "testimonials", title: string, subtitle: string, items: [{id, text, author, role, stars: 5}] }
8. GalleryBlock: { id: "gal-...", type: "gallery", title: string, subtitle: string, columns: 3, items: [{id, imageUrl, title, description}] }
9. ContactBlock: { id: "con-...", type: "contact", title: string, subtitle: string, email, phone, address, showMap: true, buttonText }
10. FooterBlock: { id: "foot-...", type: "footer", text, copyright, socials: [{platform: "Twitter"|"GitHub"|"LinkedIn", url}] }

Ensure the contents, titles, and text COPY are brilliantly customized for target theme. Do not write generic text. Be creative, professional, and copy-focused!
Ensure the first item is 'navbar', and the last item is 'footer'.
`;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Create a professional Bootstrap + Laravel website layout for: "${prompt}". Root website name represents: "${pageTitle || 'Core Web'}".`,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          temperature: 0.8
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("No response output received from Gemini API");
      }

      const blockLayout = JSON.parse(responseText.trim());
      res.json({ success: true, layout: blockLayout });
    } catch (error: any) {
      console.error("AI Generation Error:", error);
      res.status(500).json({ error: error.message || "Failed to interact with Gemini API" });
    }
  });

  // API Routes: Inline AI Copywriter
  app.post("/api/ai/rewrite", async (req, res) => {
    try {
      const { blockType, currentField, originalText, tone } = req.body;
      if (!originalText) {
        res.status(400).json({ error: "Original text is required" });
        return;
      }

      const client = getGeminiClient();
      const prompt = `
Context: Standard website block type is "${blockType}". Editing field "${currentField}".
Original text value of this field: "${originalText}".
Requested rewrite style/tone: "${tone || 'highly appealing professional marketing copy'}".

Re-draft and return excellent, high-converting visual copywriting.
Keep the text proportional in length to original text. Do not use markdown quotes. Only return the final rewritten plain text string.
`;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          temperature: 0.9,
        }
      });

      const rewrittenText = response.text ? response.text.trim() : originalText;
      res.json({ success: true, rewrittenText });
    } catch (error: any) {
      console.error("AI Style Rewrite Error:", error);
      res.status(500).json({ error: error.message || "Failed to rewrite copy using Gemini API" });
    }
  });

  // Health endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "healthy", time: new Date() });
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to boot full-stack server:", err);
});
