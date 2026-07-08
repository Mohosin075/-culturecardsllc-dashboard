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
import { useAlert } from "@/app/context/AlertContext";
import ErrorState from "@/app/components/ErrorState";

export default function CategoriesPage() {
  const dispatch = useAppDispatch();
  const { items: categories, loading } = useAppSelector((state) => state.categories);
  const { showAlert, showConfirm, showPrompt } = useAlert();

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleAddCategory = () => {
    showPrompt("Add Category Name", "Category Name (e.g. Rare Coins)", (name) => {
      if (!name) return;
      showPrompt("Add Category Description", "Category Description", (description) => {
        dispatch(addCategory({ name, description: description || "" }));
        showAlert("Category added successfully.", "success");
      });
    });
  };

  const handleEditCategory = (id: string, currentDesc: string) => {
    showPrompt("Edit Category Description", "Description", (description) => {
      dispatch(editCategory({ id, description }));
      showAlert("Category updated successfully.", "success");
    }, currentDesc);
  };

  const handleDeleteCategory = (id: string) => {
    showConfirm(
      "Are you sure you want to delete this category? All associated subcategories will be removed.",
      () => {
        dispatch(deleteCategory(id));
        showAlert("Category deleted successfully.", "success");
      },
      "Delete Category"
    );
  };

  const { error } = useAppSelector((state) => state.categories);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="animate-spin text-[#155DFC]" size={40} />
      </div>
    );
  }
  if (error) {
    return <ErrorState message={error} onRetry={() => dispatch(fetchCategories())} />;
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
        {categories.length === 0 ? (
          <div className="col-span-full bg-[#111111] border border-white/5 rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-500">
              <Cards size={32} />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-zinc-200">No Categories Found</h3>
              <p className="text-sm text-zinc-500 max-w-sm">
                There are no product categories configured. Click the &quot;Add Category&quot; button to create one.
              </p>
            </div>
          </div>
        ) : (
          categories.map((category: Category) => {
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
                      className="p-2 hover:bg-white/5 rounded-lg text-zinc-500 hover:text-white transition-colors cursor-pointer"
                      title="Edit Description"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="p-2 hover:bg-red-500/10 rounded-lg text-zinc-500 hover:text-red-500 transition-colors cursor-pointer"
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
                    <button className="text-[#155DFC] hover:text-blue-400 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer">
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
                          <button className="p-1.5 hover:bg-white/5 rounded text-zinc-500 hover:text-white transition-colors cursor-pointer">
                            <Edit2 size={14} />
                          </button>
                          <button className="p-1.5 hover:bg-red-500/10 rounded text-zinc-500 hover:text-red-500 transition-colors cursor-pointer">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
