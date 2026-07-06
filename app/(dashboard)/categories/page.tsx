"use client";

import React, { useEffect } from "react";
import { Plus, Edit2, Trash2, ChevronRight, Laptop, Watch, Layers as Cards, Footprints, Loader2 } from "lucide-react";


const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  "Footprints": Footprints,
  "Cards": Cards,
  "Watch": Watch,
  "Laptop": Laptop,
};

const getIconByName = (name: string) => {
  return iconMap[name] || Cards;
};

import { useAppDispatch, useAppSelector } from "@/app/store/store";
import {
  fetchCategories,
  addCategory,
  editCategory,
  deleteCategory,
  type Category,
} from "@/app/store/slices/categoriesSlice";

export default function CategoriesPage() {
  const dispatch = useAppDispatch();
  const { items: categories, loading } = useAppSelector((state) => state.categories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleAddCategory = async () => {
    const name = prompt("Enter Category Name:");
    if (!name) return;
    const description = prompt("Enter Category Description:") || "";
    dispatch(addCategory({ name, description }));
  };

  const handleEditCategory = async (id: string, currentDesc: string) => {
    const description = prompt("Enter New Description:", currentDesc);
    if (description === null) return;
    dispatch(editCategory({ id, description }));
  };

  const handleDeleteCategory = async (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      dispatch(deleteCategory(id));
    }
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="animate-spin text-[#155DFC]" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-white">Categories Management</h1>
        <button
          onClick={handleAddCategory}
          className="bg-[#155DFC] hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-blue-500/20"
        >
          <Plus size={18} />
          Add Category
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {categories.map((category: Category) => {
          const Icon = getIconByName(category.iconName);
          return (
            <div key={category.id} className="bg-[#111111] border border-white/5 rounded-2xl p-6 space-y-6">
              {/* Category Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-300">
                    <Icon size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-zinc-100">{category.name}</h2>
                    <p className="text-sm text-zinc-500">{category.count} listings</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditCategory(category.id, category.description || "")}
                    className="p-2 hover:bg-white/5 rounded-lg text-zinc-500 hover:text-white transition-colors"
                    title="Edit Description"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="p-2 hover:bg-red-500/10 rounded-lg text-zinc-500 hover:text-red-500 transition-colors"
                    title="Delete Category"
                  >
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
                  {category.subcategories?.map((sub: string, i: number) => (
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
          );
        })}
      </div>
    </div>
  );
}
