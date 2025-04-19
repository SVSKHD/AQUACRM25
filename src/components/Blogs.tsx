"use client";

import { useState, Fragment, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, BookOpen, Sparkles } from "lucide-react";
import { Dialog, Transition } from "@headlessui/react";
import axios from "axios";
import BlogOperations from "@/services/blog";
import { toast } from "./ui/toast";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  keywords?: string[];
  author: string;
  status: "draft" | "published";
  titleImages?: { secure_url: string }[];
  featuredImage?: string;
  publishDate: string;
  readTime: number;
}

// Mock data for development
const dummyBlogs: Blog[] = [
  {
    _id: "1",
    title: "Understanding Water Softeners: A Complete Guide",
    slug: "understanding-water-softeners",
    content: "Water softeners are essential devices...",
    excerpt:
      "Learn everything about water softeners, from how they work to their benefits.",
    category: "Water Treatment",
    tags: ["Water Softener", "Hard Water", "Home Appliances"],
    author: "John Smith",
    status: "published",
    featuredImage:
      "https://images.unsplash.com/photo-1584856086772-ac1d8f7e1e8c",
    publishDate: "2025-03-15",
    readTime: 5,
  },
  {
    _id: "2",
    title: "Benefits of RO Water Purification",
    slug: "benefits-ro-water-purification",
    content: "Reverse osmosis (RO) is a water purification process...",
    excerpt:
      "Discover why RO purification is considered one of the best water treatment methods.",
    category: "Water Purification",
    tags: ["RO System", "Water Quality", "Health"],
    author: "Sarah Johnson",
    status: "published",
    featuredImage:
      "https://images.unsplash.com/photo-1584856086772-ac1d8f7e1e8c",
    publishDate: "2025-03-10",
    readTime: 4,
  },
];

function BlogDialog({
  isOpen,
  onClose,
  blog = null,
}: {
  isOpen: boolean;
  onClose: () => void;
  blog?: Blog | null;
}) {

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Blog>>(
    blog || {
      title: "",
      content: "",
      excerpt: "",
      category: "",
      tags: [],
      author: "",
      status: "draft",
      readTime: 0,
    },
  );

  useEffect(() => {
    if (blog) {
      setFormData(blog);
    } else {
      setFormData({
        title: "",
        content: "",
        excerpt: "",
        category: "",
        tags: [],
        author: "",
        status: "draft",
        readTime: 0,
      });
    }
  }, [blog]);



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting blog:", formData);
    onClose();
  };

  const generateWithAI = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_HUGGINGFACE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: `Write a blog post with the following sections:\nTitle:\nExcerpt:\nContent:\nCategory:\nTags (comma-separated):\nAuthor:\nEstimated Read Time:\nTopic: ${
              formData.title || "Water Purification"
            }`,
          }),
        }
      );
  
      const result = await response.json();
      const text = result?.[0]?.generated_text || result?.generated_text || "";
  
      // Extract fields using simple regex-based parsing
      const extract = (label) =>
        text.split(label)[1]?.split("\n")[0]?.trim() || "";
  
      setFormData({
        title: extract("Title:"),
        excerpt: extract("Excerpt:"),
        content: text.split("Content:")[1]?.split("Category:")[0]?.trim() || "",
        category: extract("Category:"),
        tags: extract("Tags:").split(",").map((t) => t.trim()),
        author: extract("Author:"),
        readTime:
          parseInt(extract("Estimated Read Time:").replace(/\D/g, "")) || 3,
        status: "draft",
      });
    } catch (err) {
      console.error("AI generation error:", err);
    } finally {
      setIsLoading(false);
    }
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
                  {blog ? "Edit Blog Post" : "Create New Blog Post"}  
                  <button
                    type="button"
                    onClick={generateWithAI}
                    className="flex items-center px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-500 rounded hover:from-indigo-600 hover:to-purple-600"
                    disabled={isLoading}
                  >
                    <Sparkles className="h-4 w-4 mr-1" />
                    {isLoading ? "Generating..." : "Generate with AI"}
                  </button>
                </Dialog.Title>
                <form onSubmit={handleSubmit} className="mt-4 space-y-6">
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
                      Excerpt
                    </label>
                    <textarea
                      value={formData.excerpt}
                      onChange={(e) =>
                        setFormData({ ...formData, excerpt: e.target.value })
                      }
                      rows={2}
                      className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-colors duration-200 text-base"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Content
                    </label>
                    <textarea
                      value={formData.content}
                      onChange={(e) =>
                        setFormData({ ...formData, content: e.target.value })
                      }
                      rows={8}
                      className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-colors duration-200 text-base"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <input
                        type="text"
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-colors duration-200 text-base"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Author
                      </label>
                      <input
                        type="text"
                        value={formData.author}
                        onChange={(e) =>
                          setFormData({ ...formData, author: e.target.value })
                        }
                        className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-colors duration-200 text-base"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            status: e.target.value as "draft" | "published",
                          })
                        }
                        className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-colors duration-200 text-base"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Read Time (minutes)
                      </label>
                      <input
                        type="number"
                        value={formData.readTime}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            readTime: parseInt(e.target.value),
                          })
                        }
                        className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-colors duration-200 text-base"
                        min="1"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags
                      <span className="text-gray-500 text-xs ml-2">
                        (Comma separated)
                      </span>
                    </label>
                    <input
                      type="text"
                      value={formData.tags?.join(", ")}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          tags: e.target.value
                            .split(",")
                            .map((tag) => tag.trim()),
                        })
                      }
                      className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-colors duration-200 text-base"
                      placeholder="e.g., Water Treatment, Health, Tips"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Featured Image URL
                    </label>
                    <input
                      type="url"
                      value={formData.featuredImage}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          featuredImage: e.target.value,
                        })
                      }
                      className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-colors duration-200 text-base"
                      placeholder="https://example.com/image.jpg"
                    />
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
                      {blog ? "Update Post" : "Create Post"}
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

export default function Blogs() {
  const [blogs, setBlogs] = useState<Blog[]>(dummyBlogs);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  useEffect(() => {
    fetchBlogs();
  },[])

  const fetchBlogs = async()=>{
    try {
      BlogOperations.getBlogs().then((res)=>{
        setBlogs(res.data.data);
      })
    } catch (error) {
      toast.error("Failed to fetch blogs");
    }
  }

  const handleEdit = (blog: Blog) => {
    setSelectedBlog(blog);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedBlog(null);
    setIsDialogOpen(true);
  };

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h2 className="text-xl font-semibold text-gray-900">Blog Posts</h2>
          <p className="mt-2 text-sm text-gray-700">
            Manage your blog content and articles
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center justify-center rounded-lg border border-transparent bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </button>
        </div>
      </div>

      <div className="mt-6 max-w-md">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search blog posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full rounded-lg border border-gray-300 pl-10 pr-3 py-3 text-base placeholder-gray-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50"
          />
        </div>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredBlogs.map((blog) => (
          <div
            key={blog?._id}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            {blog?.titleImages && (
              <div className="aspect-video w-full mb-4 rounded-lg overflow-hidden">
                <img
                  src={blog?.titleImages[0]?.secure_url}
                  alt={blog?.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {blog?.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500">{blog?.excerpt}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(blog)}
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
              <div className="flex items-center text-sm text-gray-500">
                <BookOpen className="h-4 w-4 mr-1" />
                {blog?.readTime} min read
                <span className="mx-2">•</span>
                <span>{blog?.author}</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {/* {blog?.keywords?.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center rounded-full bg-cyan-50 px-2.5 py-0.5 text-xs font-medium text-cyan-700"
                  >
                    {tag}
                  </span>
                ))} */}
              </div>
              <div className="mt-2">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    blog.status === "published"
                      ? "bg-green-100 text-green-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {blog?.status?.charAt(0)?.toUpperCase() + blog?.status?.slice(1)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <BlogDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedBlog(null);
        }}
        blog={selectedBlog}
      />
    </div>
  );
}
