"use client";

import { useState, Fragment, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, Package } from "lucide-react";
import { Dialog, Transition } from "@headlessui/react";
import ProductOperations from "@/services/product";

interface ProductPhoto {
  id: string;
  secure_url: string;
  _id: string;
}

interface Product {
  _id: string;
  title: string;
  slug: string;
  discountPriceStatus: boolean;
  price: number;
  description: string;
  photos: ProductPhoto[];
  category: string;
  subCategory: string | null;
  blog: string | null;
  stock: number;
  brand: string;
  ratings: number;
  numberOfReviews: number;
  createdAt: string;
  keywords?: string;
}

// Mock data for fallback
const mockProducts = {
  status: true,
  data: [
    {
      _id: "65d1bc9f448369ec4b7e1853",
      title: "Kent Bathroom Water Softener 5.5L | Aquakart",
      discountPriceStatus: false,
      price: 14000,
      description:
        "Water quality plays a crucial role in maintaining the longevity and aesthetics of bathroom fittings...",
      photos: [
        {
          id: "products/estxdgyj28uhpizvxhtd",
          secure_url:
            "https://res.cloudinary.com/aquakartproducts/image/upload/v1708244121/products/estxdgyj28uhpizvxhtd.jpg",
          _id: "65d1bc9f448369ec4b7e1854",
        },
      ],
      category: "6528debce9e8a06a49a23b2c",
      stock: 5,
      brand: "Kent",
      ratings: 0,
      numberOfReviews: 0,
      createdAt: "2024-02-18T08:15:20.466Z",
      slug: "kent-bathroom-water-softener",
    },
  ],
};

function ProductDialog({
  isOpen,
  onClose,
  product = null,
}: {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
}) {
  const [formData, setFormData] = useState<Partial<Product>>({
    title: "",
    price: 0,
    description: "",
    stock: 0,
    brand: "",
    keywords: "",
    category: "",
  });

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title,
        price: product.price,
        description: product.description,
        stock: product.stock,
        brand: product.brand,
        keywords: product.keywords,
        category: product.category,
      });
      console.log("product edit", formData)
    } else {
      setFormData({
        title: "",
        price: 0,
        description: "",
        stock: 0,
        brand: "",
        keywords: "",
        category: "",
      });
      console.log("product create", formData)
    }
  }, [product]);

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
                  {product ? "Edit Product" : "Add New Product"}
                </Dialog.Title>
                <form onSubmit={handleSubmit} className="mt-4 space-y-6">
                  {/* Current Image Preview */}
                  {product && product.photos && product.photos[0] && (
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Image
                      </label>
                      <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={product.photos[0].secure_url}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}

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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Brand
                    </label>
                    <input
                      type="text"
                      value={formData.brand}
                      onChange={(e) =>
                        setFormData({ ...formData, brand: e.target.value })
                      }
                      className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-colors duration-200 text-base"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          price: parseFloat(e.target.value),
                        })
                      }
                      className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-colors duration-200 text-base"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock
                    </label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          stock: parseInt(e.target.value),
                        })
                      }
                      className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-colors duration-200 text-base"
                      required
                    />
                  </div>

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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Keywords
                    </label>
                    <textarea
                      value={formData.keywords}
                      onChange={(e) =>
                        setFormData({ ...formData, keywords: e.target.value })
                      }
                      rows={3}
                      className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-colors duration-200 text-base"
                      placeholder="Enter keywords, one per line"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Images
                    </label>
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
                            <span>Upload files</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only"
                              multiple
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
                      {product ? "Update Product" : "Create Product"}
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

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await ProductOperations.getProducts();

      setProducts(response.data.data);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedProduct(null);
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
        <p className="font-medium">Error loading products</p>
        <p className="mt-1 text-sm">{error}</p>
        <button
          onClick={fetchProducts}
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
          <h2 className="text-xl font-semibold text-gray-900">Products</h2>
          <p className="mt-2 text-sm text-gray-700">
            Manage your product inventory, prices, and categories
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center justify-center rounded-lg border border-transparent bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mt-6 max-w-md">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full rounded-lg border border-gray-300 pl-10 pr-3 py-3 text-base placeholder-gray-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => (
          <div
            key={product._id}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-start space-x-3">
                {product.photos && product.photos[0] ? (
                  <img
                    src={product.photos[0].secure_url}
                    alt={product.title}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-lg bg-gray-100 flex items-center justify-center">
                    <Package className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {product.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{product.brand}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(product)}
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
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-900">
                  ₹{product.price.toLocaleString()}
                </span>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    product.stock > 0
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {product.stock > 0
                    ? `In Stock (${product.stock})`
                    : "Out of Stock"}
                </span>
              </div>
              {product.keywords && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.keywords.split("\n").map(
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
              )}
            </div>
          </div>
        ))}
      </div>

      <ProductDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
      />
    </div>
  );
}
