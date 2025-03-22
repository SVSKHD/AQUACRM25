'use client';

import { useState, Fragment, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, GitFork } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';

interface SubCategoryPhoto {
  id: string;
  secure_url: string;
  _id: string;
}

interface Category {
  _id: string;
  title: string;
  description: string;
  photos: SubCategoryPhoto[];
  keywords: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

interface SubCategory {
  _id: string;
  title: string;
  description: string;
  photos: SubCategoryPhoto[];
  keywords: string;
  category: Category | null;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

// Mock data for fallback
const mockSubCategories = {
  "success": true,
  "data": [
    {
      "_id": "6533f07c7986c193b3c620d2",
      "title": "Wall-Mount-Ro-Purifiers",
      "description": "Wall-mounted RO (Reverse Osmosis) purifiers are popular due to their space-saving design and efficient water purification capabilities,Wall-mounted RO purifiers are designed to be fixed on walls, ensuring they don't consume countertop or floor space.",
      "photos": [
        {
          "id": "subcategories/q50qh2ebkyq4csy49i9p",
          "secure_url": "https://res.cloudinary.com/aquakartproducts/image/upload/v1697890271/subcategories/ynhebfylurso6ip1doa6.png",
          "_id": "6533f07c7986c193b3c620d3"
        }
      ],
      "keywords": "Reverse Osmosis\nFiltration\nMembrane\nContaminant removal\nTDS (Total Dissolved Solids)\nPre-filter\nPost-filter\nActivated carbon\nRO tank\nPurified water\nBrine\nWastewater\nWater quality\nDrinking water\nWater purification system\nUV (Ultraviolet) disinfection\nUF (Ultra Filtration)\nMineral cartridge",
      "category": null,
      "createdAt": "2023-10-21T15:38:36.522Z",
      "updatedAt": "2023-10-21T15:38:36.522Z",
      "__v": 0
    },
    {
      "_id": "65ec9a8a5a090a2b5d0e7240",
      "title": "Manual-Softeners",
      "description": "Manual softeners, also known as manual regeneration water softeners, require the user to initiate the regeneration process manually. This typically involves adding salt to the system and activating the regeneration cycle at scheduled intervals, based on the water usage and hardness level. Unlike automatic softeners, manual units do not regenerate based on a timer or water usage, offering simplicity in design but requiring more hands-on management from the user.",
      "photos": [
        {
          "id": "subcategories/yvd2dvlld2ah32j2lcfi",
          "secure_url": "https://res.cloudinary.com/aquakartproducts/image/upload/v1710004874/subcategories/yvd2dvlld2ah32j2lcfi.jpg",
          "_id": "65ec9a8a5a090a2b5d0e7241"
        }
      ],
      "keywords": "Manual water softeners\nManual softener systems\nManual regeneration softeners\n",
      "category": {
        "_id": "6528debce9e8a06a49a23b2c",
        "title": "Softeners",
        "description": "These are devices or systems used to reduce the hardness of water. Hard water contains a high concentration of minerals, primarily calcium and magnesium. Water softeners work by removing or replacing these minerals with sodium ions, making the water \"softer.\" Softened water is often preferred because it can reduce the buildup of scale in pipes and appliances and is gentler on the skin and hair.",
        "photos": [
          {
            "id": "categories/aea3srvwixosjb4glfqa",
            "secure_url": "https://res.cloudinary.com/aquakartproducts/image/upload/v1735741268/categories/aea3srvwixosjb4glfqa.png",
            "_id": "67754f54519e14a0cb87d879"
          }
        ],
        "keywords": "Aquakart reduce water hardness in Hyderabad,\nAquakart scale prevention system in Hyderabad,\nAquakart improve appliance lifespan in Hyderabad,\nAquakart soft water benefits in Hyderabad,\t\nAquakart protect plumbing from scale in Hyderabad,\nAquakart skin-friendly water system in Hyderabad,\nAquakart hair-friendly water solution in Hyderabad,",
        "createdAt": "2023-10-13T06:07:56.503Z",
        "updatedAt": "2025-01-01T14:36:50.569Z",
        "__v": 1
      },
      "createdAt": "2024-03-09T17:21:14.904Z",
      "updatedAt": "2024-03-09T17:21:14.904Z",
      "__v": 0
    }
  ]
};

function SubCategoryDialog({ isOpen, onClose, subCategory = null }: { isOpen: boolean; onClose: () => void; subCategory?: SubCategory | null }) {
  const [formData, setFormData] = useState<Partial<SubCategory>>(
    subCategory || {
      title: '',
      description: '',
      keywords: '',
      photos: []
    }
  );

  useEffect(() => {
    if (subCategory) {
      setFormData({
        title: subCategory.title,
        description: subCategory.description,
        keywords: subCategory.keywords,
        photos: subCategory.photos
      });
    } else {
      setFormData({
        title: '',
        description: '',
        keywords: '',
        photos: []
      });
    }
  }, [subCategory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Submitting form data:', formData);
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
                  {subCategory ? 'Edit Subcategory' : 'Add New Subcategory'}
                </Dialog.Title>
                <form onSubmit={handleSubmit} className="mt-4 space-y-6">
                  {/* Current Image Preview */}
                  {subCategory && subCategory.photos && subCategory.photos[0] && (
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current Image</label>
                      <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={subCategory.photos[0].secure_url}
                          alt={subCategory.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-colors duration-200 text-base"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-colors duration-200 text-base"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Keywords
                      <span className="text-gray-500 text-xs ml-2">(One per line)</span>
                    </label>
                    <textarea
                      value={formData.keywords}
                      onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                      rows={4}
                      className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-colors duration-200 text-base font-mono text-sm"
                      placeholder="Enter keywords, one per line"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                      <div className="space-y-1 text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer rounded-md font-medium text-cyan-600 hover:text-cyan-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-cyan-500"
                          >
                            <span>Upload a file</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
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
                      {subCategory ? 'Update Subcategory' : 'Create Subcategory'}
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

export default function SubCategories() {
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSubCategories();
  }, []);

  const fetchSubCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use mock data instead of actual API call
      setSubCategories(mockSubCategories.data);
    } catch (err) {
      console.error('Error fetching subcategories:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch subcategories');
    } finally {
      setLoading(false);
    }
  };

  const filteredSubCategories = subCategories.filter(subCategory =>
    subCategory.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subCategory.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (subCategory: SubCategory) => {
    setSelectedSubCategory(subCategory);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedSubCategory(null);
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg text-red-800">
        <p className="font-medium">Error loading subcategories</p>
        <p className="mt-1 text-sm">{error}</p>
        <button
          onClick={fetchSubCategories}
          className="mt-4 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h2 className="text-xl font-semibold text-gray-900">Subcategories</h2>
          <p className="mt-2 text-sm text-gray-700">
            Manage subcategories and their relationships with main categories
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center justify-center rounded-lg border border-transparent bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Subcategory
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mt-6 max-w-md">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search subcategories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full rounded-lg border border-gray-300 pl-10 pr-3 py-3 text-base placeholder-gray-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50"
          />
        </div>
      </div>

      {/* Subcategories Grid */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredSubCategories.map((subCategory) => (
          <div
            key={subCategory._id}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-start space-x-3">
                {subCategory.photos && subCategory.photos[0] ? (
                  <img
                    src={subCategory.photos[0].secure_url}
                    alt={subCategory.title}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-lg bg-gray-100 flex items-center justify-center">
                    <GitFork className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{subCategory.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">{subCategory.description}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(subCategory)}
                  className="text-cyan-600 hover:text-cyan-900"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button className="text-red-600 hover:text-red-900">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            {subCategory.category && (
              <div className="mt-4">
                <span className="inline-flex items-center rounded-full bg-cyan-100 px-2.5 py-0.5 text-xs font-medium text-cyan-800">
                  {subCategory.category.title}
                </span>
              </div>
            )}

            {subCategory.keywords && (
              <div className="mt-3 flex flex-wrap gap-2">
                {subCategory.keywords.split('\n').map((keyword, index) => (
                  keyword.trim() && (
                    <span
                      key={index}
                      className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800"
                    >
                      {keyword.trim()}
                    </span>
                  )
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <SubCategoryDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedSubCategory(null);
        }}
        subCategory={selectedSubCategory}
      />
    </div>
  );
}