"use client";

import { useState, Fragment, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, Image as ImageIcon } from "lucide-react";
import { Dialog, Transition } from "@headlessui/react";
import SubCategories from "./SubCategories";
import CategoryOperations from "@/services/category";

interface CategoryPhoto {
  id: string;
  secure_url: string;
  _id: string;
}

interface Category {
  _id: string;
  title: string;
  description: string;
  photos: CategoryPhoto[];
  keywords: string;
  createdAt: string;
  updatedAt: string;
}

function CategoryDialog({
  isOpen,
  onClose,
  category = null,
}: {
  isOpen: boolean;
  onClose: () => void;
  category?: Category | null;
}) {
  const [formData, setFormData] = useState<Partial<Category>>({
    title: "",
    description: "",
    keywords: "",
    photos: [],
  });

  // Update form data when category changes
  useEffect(() => {
    if (category) {
      setFormData({
        title: category.title,
        description: category.description,
        keywords: category.keywords,
        photos: category.photos,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        keywords: "",
        photos: [],
      });
    }
  }, [category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Submitting form data:", formData);
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-2xl font-semibold leading-6 text-gray-900 mb-6"
                >
                  {category ? "Edit Category" : "Add New Category"}
                </Dialog.Title>
                <form onSubmit={handleSubmit} className="mt-4 space-y-6">
                  {/* Current Image Preview */}
                  {category && category.photos && category.photos[0] && (
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Image
                      </label>
                      <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={category.photos[0].secure_url}
                          alt={category.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}

                  {/* Title Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-colors duration-200 text-base"
                      required
                    />
                  </div>

                  {/* Description Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      rows={4}
                      className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-colors duration-200 text-base"
                      required
                    />
                  </div>

                  {/* Keywords Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Keywords
                      <span className="text-gray-500 text-xs ml-2">
                        (One per line)
                      </span>
                    </label>
                    <textarea
                      value={formData.keywords}
                      onChange={(e) =>
                        setFormData({ ...formData, keywords: e.target.value })
                      }
                      rows={4}
                      className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-colors duration-200 text-base font-mono text-sm"
                      placeholder="Enter keywords, one per line"
                    />
                    {/* Keywords Preview */}
                    {formData.keywords && (
                      <div className="mt-3">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Keywords Preview
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {formData.keywords.split("\n").map(
                            (keyword, index) =>
                              keyword.trim() && (
                                <span
                                  key={index}
                                  className="inline-flex items-center rounded-full bg-cyan-50 px-2.5 py-0.5 text-xs font-medium text-cyan-700"
                                >
                                  {keyword.trim()}
                                </span>
                              ),
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category Image
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                      <div className="space-y-1 text-center">
                        <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer rounded-md font-medium text-cyan-600 hover:text-cyan-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-cyan-500"
                          >
                            <span>Upload a file</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only"
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                    >
                      {category ? "Update Category" : "Create Category"}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const fetchCategories = async () => {
    try {
      const response = await CategoryOperations.getCategories();
      setCategories(response.data.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter((category) =>
    category.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedCategory(null);
    setIsDialogOpen(true);
  };

  const toggleExpand = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h2 className="text-xl font-semibold text-gray-900">Categories</h2>
          <p className="mt-2 text-sm text-gray-700">
            Manage product categories and their descriptions
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center justify-center rounded-lg border border-transparent bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mt-6 max-w-md">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full rounded-lg border border-gray-300 pl-10 pr-3 py-3 text-base placeholder-gray-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50"
          />
        </div>
      </div>

      {/* Categories List */}
      <div className="mt-8 space-y-6">
        {filteredCategories.map((category) => (
          <div key={category._id} className="space-y-4">
            <div className="relative bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-4">
                  {category.photos[0] && (
                    <img
                      src={category.photos[0].secure_url}
                      alt={category.title}
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                  )}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {category.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {category.description}
                    </p>
                    <div className="mt-2">
                      <p className="text-xs text-gray-400">
                        Last updated: {formatDate(category.updatedAt)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(category)}
                    className="text-cyan-600 hover:text-cyan-900"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex flex-wrap gap-2">
                  {category.keywords.split("\n").map((keyword, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center rounded-full bg-cyan-50 px-2.5 py-0.5 text-xs font-medium text-cyan-700"
                    >
                      {keyword.trim()}
                    </span>
                  ))}
                </div>
              </div>
              {/* <div className="mt-4 flex items-center justify-end">
                <button
                  onClick={() => toggleExpand(category._id)}
                  className="text-sm text-cyan-600 hover:text-cyan-700"
                >
                  {expandedCategories.includes(category._id)
                    ? "Hide Subcategories"
                    : "Show Subcategories"}
                </button>
              </div> */}
            </div>
            {/* {expandedCategories.includes(category._id) && (
              <SubCategories
                categoryId={parseInt(category._id.slice(-6), 16)}
              />
            )} */}
          </div>
        ))}
      </div>

      <CategoryDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedCategory(null);
        }}
        category={selectedCategory}
      />
    </div>
  );
}
