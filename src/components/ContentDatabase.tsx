import React, { useState } from 'react';
import { WebDesignConfig, DynamicBlogModel, DynamicProductModel } from '../types';
import { Plus, Trash2, Database, BookOpen, ShoppingBag, Calendar, User, Tag, HelpCircle, Package, Archive } from 'lucide-react';

interface ContentDatabaseProps {
  config: WebDesignConfig;
  onChangeConfig: (newConfig: WebDesignConfig) => void;
}

export default function ContentDatabase({ config, onChangeConfig }: ContentDatabaseProps) {
  const [activeTab, setActiveTab] = useState<'blogs' | 'products'>('blogs');

  // New item draft templates
  const [newBlog, setNewBlog] = useState<Partial<DynamicBlogModel>>({
    title: '',
    category: 'Innovation',
    excerpt: '',
    body: '',
    author: 'Admin Team',
    imageUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=600&q=80'
  });

  const [newProduct, setNewProduct] = useState<Partial<DynamicProductModel>>({
    name: '',
    price: '29.99',
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?auto=format&fit=crop&w=600&q=80',
    inStock: true
  });

  // Blog Actions
  const handleAddBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlog.title) return;
    const slug = newBlog.title.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const createdItem: DynamicBlogModel = {
      id: `blog-item-${Math.random()}`,
      title: newBlog.title,
      slug,
      excerpt: newBlog.excerpt || 'Short preview description.',
      body: newBlog.body || 'Complete body details.',
      category: newBlog.category || 'General',
      author: newBlog.author || 'Writer',
      imageUrl: newBlog.imageUrl || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=600&q=80',
      createdAt: new Date().toISOString().split('T')[0]
    };

    onChangeConfig({
      ...config,
      blogModels: [createdItem, ...config.blogModels]
    });

    setNewBlog({
      title: '',
      category: 'Innovation',
      excerpt: '',
      body: '',
      author: 'Admin Team',
      imageUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=600&q=80'
    });
  };

  const handleDeleteBlog = (id: string) => {
    const filtered = config.blogModels.filter(b => b.id !== id);
    onChangeConfig({
      ...config,
      blogModels: filtered
    });
  };

  // Product Actions
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name) return;
    const slug = newProduct.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const createdItem: DynamicProductModel = {
      id: `product-item-${Math.random()}`,
      name: newProduct.name,
      slug,
      price: newProduct.price || '9.99',
      description: newProduct.description || 'Custom digital product.',
      imageUrl: newProduct.imageUrl || 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?auto=format&fit=crop&w=600&q=80',
      inStock: newProduct.inStock ?? true
    };

    onChangeConfig({
      ...config,
      productModels: [createdItem, ...config.productModels]
    });

    setNewProduct({
      name: '',
      price: '29.99',
      description: '',
      imageUrl: 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?auto=format&fit=crop&w=600&q=80',
      inStock: true
    });
  };

  const handleDeleteProduct = (id: string) => {
    const filtered = config.productModels.filter(p => p.id !== id);
    onChangeConfig({
      ...config,
      productModels: filtered
    });
  };

  return (
    <div className="flex-1 bg-slate-50 p-6 overflow-y-auto h-full">
      {/* Tab bar header */}
      <div className="border-b border-slate-200 pb-5 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-600" />
            Dynamic CMS Table Models
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Build and seed mock records that dynamic-loop through Laravel's Blade views automatically.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200 self-start">
          <button
            onClick={() => setActiveTab('blogs')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'blogs'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            App\Models\BlogPost ({config.blogModels.length})
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'products'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            App\Models\Product ({config.productModels.length})
          </button>
        </div>
      </div>

      {activeTab === 'blogs' ? (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 align-start">
          {/* Create Blog Form */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm h-fit">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-455 mb-4 flex items-center gap-1">
              <Plus className="w-3.5 h-3.5 text-indigo-600" />
              Seed New Blog Post
            </h4>
            <form onSubmit={handleAddBlog} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Article Headline</label>
                <input
                  type="text"
                  required
                  value={newBlog.title}
                  onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                  className="w-full text-xs bg-slate-50 border border-slate-205 rounded-lg px-3 py-2 outline-none focus:bg-white focus:border-indigo-400"
                  placeholder="e.g. Mastering MVC architecture"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Category tag</label>
                  <input
                    type="text"
                    value={newBlog.category}
                    onChange={(e) => setNewBlog({ ...newBlog, category: e.target.value })}
                    className="w-full text-xs bg-slate-50 border border-slate-205 rounded-lg px-3 py-2 outline-none focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Author Name</label>
                  <input
                    type="text"
                    value={newBlog.author}
                    onChange={(e) => setNewBlog({ ...newBlog, author: e.target.value })}
                    className="w-full text-xs bg-slate-50 border border-slate-205 rounded-lg px-3 py-2 outline-none focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Hero Backdrop Image Url</label>
                <input
                  type="text"
                  value={newBlog.imageUrl}
                  onChange={(e) => setNewBlog({ ...newBlog, imageUrl: e.target.value })}
                  className="w-full text-xs bg-slate-50 border border-slate-205 rounded-lg px-3 py-2 outline-none focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Short Excerpt (Grid Card Preview)</label>
                <textarea
                  rows={2}
                  required
                  value={newBlog.excerpt}
                  onChange={(e) => setNewBlog({ ...newBlog, excerpt: e.target.value })}
                  className="w-full text-xs bg-slate-50 border border-slate-205 rounded-lg px-3 py-2 outline-none focus:bg-white"
                  placeholder="Insert a short catchy preview description..."
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Complete Body Article content</label>
                <textarea
                  rows={4}
                  value={newBlog.body}
                  onChange={(e) => setNewBlog({ ...newBlog, body: e.target.value })}
                  className="w-full text-xs bg-slate-50 border border-slate-205 rounded-lg px-3 py-2 outline-none focus:bg-white"
                  placeholder="Markdown or HTML body content..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-indigo-650 active:bg-indigo-700 text-white rounded-lg py-2.5 text-xs font-semibold transition-colors mt-2"
              >
                Insert Row & Seed database
              </button>
            </form>
          </div>

          {/* Seeded list display */}
          <div className="xl:col-span-2 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-455 flex items-center gap-1 px-1">
              <Archive className="w-4 h-4 text-slate-500" />
              Dynamic BlogPost Seeds (mapped to blog controller query)
            </h4>

            {config.blogModels.length === 0 ? (
              <div className="p-8 text-center bg-white border rounded-xl text-slate-400 text-sm">
                No blog records currently seeded. Click left to insert items!
              </div>
            ) : (
              <div className="space-y-3.5">
                {config.blogModels.map(blog => (
                  <div key={blog.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex gap-4 relative">
                    <button
                      onClick={() => handleDeleteBlog(blog.id)}
                      className="absolute top-4 right-4 text-rose-500 hover:text-rose-700 transition"
                      title="Delete database row"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <img
                      src={blog.imageUrl}
                      className="w-20 h-20 rounded-lg object-cover bg-slate-100 flex-shrink-0"
                      alt={blog.title}
                      referrerPolicy="no-referrer"
                    />

                    <div className="flex-1 min-w-0 pr-8">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Tag className="w-3 h-3 text-slate-400" />
                          {blog.category}
                        </span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                          <User className="w-3 h-3" /> {blog.author}
                        </span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                          <Calendar className="w-3 h-3" /> {blog.createdAt}
                        </span>
                      </div>
                      <h5 className="font-bold text-slate-800 text-sm truncate">{blog.title}</h5>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{blog.excerpt}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 align-start">
          {/* Create Product Form */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm h-fit">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-455 mb-4 flex items-center gap-1">
              <Plus className="w-3.5 h-3.5 text-indigo-600" />
              Seed New Product Model
            </h4>
            <form onSubmit={handleAddProduct} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Product Display Name</label>
                <input
                  type="text"
                  required
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full text-xs bg-slate-50 border border-slate-205 rounded-lg px-3 py-2 outline-none focus:bg-white focus:border-indigo-400"
                  placeholder="e.g. Ultimate Dev Guide"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Price ($USD decimal)</label>
                  <input
                    type="text"
                    required
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="w-full text-xs bg-slate-50 border border-slate-205 rounded-lg px-3 py-2 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Stock status</label>
                  <select
                    value={newProduct.inStock ? 'true' : 'false'}
                    onChange={(e) => setNewProduct({ ...newProduct, inStock: e.target.value === 'true' })}
                    className="w-full text-xs bg-slate-50 border border-slate-205 py-2 px-3 rounded-lg text-slate-700"
                  >
                    <option value="true">In Stock</option>
                    <option value="false">Out of stock</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Thumbnail Preview Image</label>
                <input
                  type="text"
                  value={newProduct.imageUrl}
                  onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                  className="w-full text-xs bg-slate-50 border border-slate-205 rounded-lg px-3 py-2 outline-none focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Commercial Description details</label>
                <textarea
                  rows={3}
                  required
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full text-xs bg-slate-50 border border-slate-205 rounded-lg px-3 py-2 outline-none focus:bg-white"
                  placeholder="Provide package specifications..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-indigo-650 active:bg-indigo-700 text-white rounded-lg py-2.5 text-xs font-semibold"
              >
                Insert Product seed row
              </button>
            </form>
          </div>

          {/* Seeded products rendering list */}
          <div className="xl:col-span-2 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-455 flex items-center gap-1 px-1">
              <Package className="w-4 h-4 text-slate-500" />
              Dynamic Product Seeds (binds to products model queries)
            </h4>

            {config.productModels.length === 0 ? (
              <div className="p-8 text-center bg-white border rounded-xl text-slate-400 text-sm">
                No product records currently seeded. Click left to insert items!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {config.productModels.map(prod => (
                  <div key={prod.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col justify-between relative">
                    <button
                      onClick={() => handleDeleteProduct(prod.id)}
                      className="absolute top-2 right-2 p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition"
                      title="Delete product row"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="flex gap-3">
                      <img
                        src={prod.imageUrl}
                        className="w-16 h-16 rounded-lg object-cover bg-slate-100 flex-shrink-0 border border-slate-200"
                        alt={prod.name}
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0 flex-1 pr-6">
                        <h5 className="font-bold text-slate-800 text-sm truncate mb-0.5">{prod.name}</h5>
                        <div className="text-xs font-mono font-bold text-indigo-600 mb-2">${prod.price}</div>
                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{prod.description}</p>
                      </div>
                    </div>

                    <div className="border-t mt-4 pt-3 flex items-center justify-between text-[11px] text-slate-400">
                      <span>slug: {prod.slug}</span>
                      <span className={`font-semibold ${prod.inStock ? 'text-emerald-500' : 'text-slate-400'}`}>
                        {prod.inStock ? '● Active In Stock' : '● Sold Out'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Helpful tutorial overlay */}
      <div className="bg-indigo-50 border border-indigo-150 rounded-xl p-4 mt-8 flex items-start gap-3">
        <HelpCircle className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed text-slate-700">
          <h5 className="font-bold text-indigo-900 mb-0.5">Dynamic Blade Binding Tutorial (MVC)</h5>
          <p className="mb-2">
            Laravel's MVC pattern decouples the raw static assets from dynamic rows. By utilizing standard blade tags:
          </p>
          <pre className="p-2.5 bg-slate-900 text-slate-200 rounded font-mono text-[10px] whitespace-pre overflow-x-auto leading-relaxed">
{`@foreach($blogs as $post)
    <h5 class="fw-bold">{{ $post->title }}</h5>
    <p>{{ Str::limit($post->excerpt, 120) }}</p>
@endforeach`}
          </pre>
          <p className="mt-2">
            The generated code inside <code className="text-indigo-900 font-semibold">welcome.blade.php</code> implements this logic flawlessly, so dynamic data populates automatically in production.
          </p>
        </div>
      </div>
    </div>
  );
}
