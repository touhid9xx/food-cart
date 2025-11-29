/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useEffect } from "react";
import { useAppSelector } from "../../../store/hooks";
import MenuItemForm from "../../components/forms/MenuItemForm";
import MenuItemList from "../../components/forms/MenuItemList";
import { MenuItemDetails } from "../../../types";

export default function EditMenu() {
  const { user } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState<"list" | "add" | "edit">("list");
  const [editingItem, setEditingItem] = useState<MenuItemDetails | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Check if user has permission to edit menu
  const canEditMenu = user?.role === "admin" || user?.role === "staff";

  if (!canEditMenu) {
    return (
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="glassmorphism rounded-2xl p-8 backdrop-blur-lg border border-white/30 neon-glow">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-red-500 mb-4">
                Access Denied
              </h2>
              <p className="opacity-80">
                You don't have permission to access this page.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const handleAddNew = () => {
    setEditingItem(null);
    setActiveTab("add");
  };

  const handleEdit = (item: MenuItemDetails) => {
    setEditingItem(item);
    setActiveTab("edit");
  };

  const handleBackToList = () => {
    setEditingItem(null);
    setActiveTab("list");
  };

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 theme-accent neon-text">
            Menu Management
          </h1>
          <p className="text-xl opacity-80 max-w-2xl mx-auto">
            Add, edit, and manage your restaurant menu items
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="glassmorphism rounded-2xl p-6 backdrop-blur-lg border border-white/30 neon-glow mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex space-x-1 bg-white/20 rounded-lg p-1">
              <button
                onClick={() => setActiveTab("list")}
                className={`px-6 py-2 rounded-md transition-all duration-300 ${
                  activeTab === "list"
                    ? "theme-accent bg-white/20 backdrop-blur-sm"
                    : "hover:bg-white/10"
                }`}
              >
                Menu Items
              </button>
              <button
                onClick={handleAddNew}
                className={`px-6 py-2 rounded-md transition-all duration-300 ${
                  activeTab === "add"
                    ? "theme-accent bg-white/20 backdrop-blur-sm"
                    : "hover:bg-white/10"
                }`}
              >
                Add New Item
              </button>
            </div>

            {activeTab === "list" && (
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search menu items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white/80 dark:bg-gray-800/80 border-2 border-white/40 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-current focus:ring-2 focus:ring-current transition-all duration-300 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white backdrop-blur-sm"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="glassmorphism rounded-2xl p-6 backdrop-blur-lg border border-white/30 neon-glow">
          {activeTab === "list" && (
            <MenuItemList onEditItem={handleEdit} searchTerm={searchTerm} />
          )}

          {(activeTab === "add" || activeTab === "edit") && (
            <MenuItemForm
              item={editingItem}
              onSave={handleBackToList}
              onCancel={handleBackToList}
              mode={activeTab === "add" ? "add" : "edit"}
            />
          )}
        </div>
      </div>
    </section>
  );
}
