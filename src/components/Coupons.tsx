"use client";

import { useState, Fragment } from "react";
import { Plus, Search, Edit2, Trash2, Ticket } from "lucide-react";
import { Dialog, Transition } from "@headlessui/react";

interface Coupon {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minPurchase: number;
  maxDiscount?: number;
  validFrom: string;
  validUntil: string;
  usageLimit: number;
  usageCount: number;
  status: "active" | "expired" | "disabled";
  description?: string;
}

const initialCoupons: Coupon[] = [
  {
    id: "1",
    code: "SUMMER2025",
    type: "percentage",
    value: 20,
    minPurchase: 1000,
    maxDiscount: 2000,
    validFrom: "2025-06-01",
    validUntil: "2025-08-31",
    usageLimit: 1000,
    usageCount: 150,
    status: "active",
    description: "Summer sale discount",
  },
  {
    id: "2",
    code: "WELCOME500",
    type: "fixed",
    value: 500,
    minPurchase: 2000,
    validFrom: "2025-01-01",
    validUntil: "2025-12-31",
    usageLimit: 500,
    usageCount: 234,
    status: "active",
    description: "Welcome discount for new customers",
  },
  {
    id: "3",
    code: "FLASH25",
    type: "percentage",
    value: 25,
    minPurchase: 1500,
    maxDiscount: 1000,
    validFrom: "2025-03-01",
    validUntil: "2025-03-02",
    usageLimit: 100,
    usageCount: 100,
    status: "expired",
    description: "Flash sale discount",
  },
];

function CouponDialog({
  isOpen,
  onClose,
  coupon = null,
}: {
  isOpen: boolean;
  onClose: () => void;
  coupon?: Coupon | null;
}) {
  const [formData, setFormData] = useState<Partial<Coupon>>(
    coupon || {
      code: "",
      type: "percentage",
      value: 0,
      minPurchase: 0,
      maxDiscount: undefined,
      validFrom: new Date().toISOString().split("T")[0],
      validUntil: new Date().toISOString().split("T")[0],
      usageLimit: 0,
      status: "active",
      description: "",
    },
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Submitting coupon:", formData);
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
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-2xl font-semibold leading-6 text-gray-900 mb-6"
                >
                  {coupon ? "Edit Coupon" : "Create New Coupon"}
                </Dialog.Title>
                <form onSubmit={handleSubmit} className="mt-4 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Coupon Code
                    </label>
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          code: e.target.value.toUpperCase(),
                        })
                      }
                      className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-colors duration-200 text-base uppercase"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Discount Type
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            type: e.target.value as "percentage" | "fixed",
                          })
                        }
                        className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-colors duration-200 text-base"
                      >
                        <option value="percentage">Percentage</option>
                        <option value="fixed">Fixed Amount</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {formData.type === "percentage"
                          ? "Discount Percentage"
                          : "Discount Amount"}
                      </label>
                      <input
                        type="number"
                        value={formData.value}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            value: parseFloat(e.target.value),
                          })
                        }
                        className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-colors duration-200 text-base"
                        min="0"
                        max={formData.type === "percentage" ? "100" : undefined}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Minimum Purchase
                      </label>
                      <input
                        type="number"
                        value={formData.minPurchase}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            minPurchase: parseFloat(e.target.value),
                          })
                        }
                        className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-colors duration-200 text-base"
                        min="0"
                        required
                      />
                    </div>
                    {formData.type === "percentage" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Maximum Discount
                        </label>
                        <input
                          type="number"
                          value={formData.maxDiscount}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              maxDiscount: parseFloat(e.target.value),
                            })
                          }
                          className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-colors duration-200 text-base"
                          min="0"
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Valid From
                      </label>
                      <input
                        type="date"
                        value={formData.validFrom}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            validFrom: e.target.value,
                          })
                        }
                        className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-colors duration-200 text-base"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Valid Until
                      </label>
                      <input
                        type="date"
                        value={formData.validUntil}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            validUntil: e.target.value,
                          })
                        }
                        className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-colors duration-200 text-base"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Usage Limit
                    </label>
                    <input
                      type="number"
                      value={formData.usageLimit}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          usageLimit: parseInt(e.target.value),
                        })
                      }
                      className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-colors duration-200 text-base"
                      min="0"
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
                      rows={3}
                      className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-colors duration-200 text-base"
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
                      {coupon ? "Update Coupon" : "Create Coupon"}
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

export default function Coupons() {
  const [coupons] = useState<Coupon[]>(initialCoupons);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const filteredCoupons = coupons.filter(
    (coupon) =>
      coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleEdit = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedCoupon(null);
    setIsDialogOpen(true);
  };

  const getStatusColor = (status: Coupon["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "expired":
        return "bg-red-100 text-red-800";
      case "disabled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h2 className="text-xl font-semibold text-gray-900">Coupons</h2>
          <p className="mt-2 text-sm text-gray-700">
            Manage discount coupons and promotional offers
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center justify-center rounded-lg border border-transparent bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Coupon
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mt-6 max-w-md">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search coupons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full rounded-lg border border-gray-300 pl-10 pr-3 py-3 text-base placeholder-gray-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50"
          />
        </div>
      </div>

      {/* Coupons Grid */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCoupons.map((coupon) => (
          <div
            key={coupon.id}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-start space-x-3">
                <div className="mt-1">
                  <Ticket className="h-5 w-5 text-cyan-500" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {coupon.code}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {coupon.description}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(coupon)}
                  className="text-cyan-600 hover:text-cyan-900"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button className="text-red-600 hover:text-red-900">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">
                  Discount
                </span>
                <span className="font-medium">
                  {coupon.type === "percentage"
                    ? `${coupon.value}%`
                    : `₹${coupon.value}`}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">
                  Min. Purchase
                </span>
                <span className="font-medium">₹{coupon.minPurchase}</span>
              </div>

              {coupon.type === "percentage" && coupon.maxDiscount && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">
                    Max. Discount
                  </span>
                  <span className="font-medium">₹{coupon.maxDiscount}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Usage</span>
                <span className="font-medium">
                  {coupon.usageCount} / {coupon.usageLimit}
                </span>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">Valid Period</span>
                  <span className="text-sm font-medium">
                    {formatDate(coupon.validFrom)} -{" "}
                    {formatDate(coupon.validUntil)}
                  </span>
                </div>
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(coupon.status)}`}
                >
                  {coupon.status.charAt(0).toUpperCase() +
                    coupon.status.slice(1)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <CouponDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedCoupon(null);
        }}
        coupon={selectedCoupon}
      />
    </div>
  );
}
