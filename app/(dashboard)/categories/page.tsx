import React from "react";
import { Plus, Edit2, Trash2, ChevronRight, Laptop, Watch, Layers as Cards, Footprints } from "lucide-react";

const categories = [
  {
    id: 1,
    name: "Sneakers",
    count: 1234,
    icon: Footprints,
    subcategories: ["Nike", "Adidas", "Jordan", "Yeezy", "New Balance"],
  },
  {
    id: 2,
    name: "Trading Cards",
    count: 892,
    icon: Cards,
    subcategories: ["Pokemon", "Yu-Gi-Oh!", "Magic: The Gathering", "Sports Cards"],
  },
  {
    id: 3,
    name: "Watches",
    count: 456,
    icon: Watch,
    subcategories: ["Rolex", "Omega", "Patek Philippe", "Audemars Piguet", "Casio"],
  },
  {
    id: 4,
    name: "Tech",
    count: 678,
    icon: Laptop,
    subcategories: ["Laptops", "Phones", "Tablets", "Accessories"],
  },
];

export default function CategoriesPage() {
  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-white">Categories Management</h1>
        <button className="bg-[#155DFC] hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-blue-500/20">
          <Plus size={18} />
          Add Category
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="bg-[#111111] border border-white/5 rounded-2xl p-6 space-y-6">
            {/* Category Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-300">
                  <category.icon size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-zinc-100">{category.name}</h2>
                  <p className="text-sm text-zinc-500">{category.count} listings</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-white/5 rounded-lg text-zinc-500 hover:text-white transition-colors">
                  <Edit2 size={18} />
                </button>
                <button className="p-2 hover:bg-red-500/10 rounded-lg text-zinc-500 hover:text-red-500 transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            {/* Subcategories */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Subcategories</h3>
                <button className="text-[#155DFC] hover:text-blue-400 text-xs font-bold flex items-center gap-1 transition-colors">
                  <Plus size={14} />
                  Add
                </button>
              </div>
              <div className="space-y-2">
                {category.subcategories.map((sub, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-black/40 border border-white/5 rounded-xl group hover:border-white/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <ChevronRight size={14} className="text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                      <span className="text-sm font-medium text-zinc-300">{sub}</span>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 hover:bg-white/5 rounded text-zinc-500 hover:text-white transition-colors">
                        <Edit2 size={14} />
                      </button>
                      <button className="p-1.5 hover:bg-red-500/10 rounded text-zinc-500 hover:text-red-500 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
