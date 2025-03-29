"use client";

import { useState, Fragment } from "react";
import {
  Search,
  Send,
  MessageSquare,
  Mail,
  Phone,
  User,
  Users,
  Check,
  X,
  Tag,
  Filter,
} from "lucide-react";
import { Dialog, Transition, Tab } from "@headlessui/react";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  lastPurchase: string;
  totalSpent: number;
  purchaseCount: number;
  avatar?: string;
  isOnline: boolean; // Whether customer is from online app or offline
}

// Mock data for development
const initialCustomers: Customer[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "9876543210",
    lastPurchase: "2025-03-15",
    totalSpent: 25000,
    purchaseCount: 3,
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    isOnline: true,
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "9876543211",
    lastPurchase: "2025-03-10",
    totalSpent: 42000,
    purchaseCount: 5,
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    isOnline: true,
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@example.com",
    phone: "9876543212",
    lastPurchase: "2025-02-28",
    totalSpent: 18500,
    purchaseCount: 2,
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    isOnline: false,
  },
  {
    id: "4",
    name: "Sarah Williams",
    email: "sarah@example.com",
    phone: "9876543213",
    lastPurchase: "2025-02-15",
    totalSpent: 35000,
    purchaseCount: 4,
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    isOnline: false,
  },
  {
    id: "5",
    name: "David Brown",
    email: "david@example.com",
    phone: "9876543214",
    lastPurchase: "2025-01-20",
    totalSpent: 12000,
    purchaseCount: 1,
    avatar:
      "https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    isOnline: true,
  },
  {
    id: "6",
    name: "Robert Wilson",
    email: "robert@example.com",
    phone: "9876543215",
    lastPurchase: "2025-01-15",
    totalSpent: 28500,
    purchaseCount: 3,
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    isOnline: false,
  },
  {
    id: "7",
    name: "Emily Davis",
    email: "emily@example.com",
    phone: "9876543216",
    lastPurchase: "2025-01-10",
    totalSpent: 19200,
    purchaseCount: 2,
    avatar:
      "https://images.unsplash.com/photo-1554151228-14d9def656e4?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    isOnline: true,
  },
  {
    id: "8",
    name: "Michael Taylor",
    email: "michael@example.com",
    phone: "9876543217",
    lastPurchase: "2025-01-05",
    totalSpent: 32000,
    purchaseCount: 4,
    isOnline: false,
  },
];

interface OfferTemplate {
  id: string;
  title: string;
  message: string;
  discount: string;
  validUntil: string;
}

// Mock offer templates
const offerTemplates: OfferTemplate[] = [
  {
    id: "1",
    title: "Summer Sale",
    message:
      "Enjoy 20% off on all water purifiers this summer! Use code SUMMER20 at checkout.",
    discount: "20%",
    validUntil: "2025-06-30",
  },
  {
    id: "2",
    title: "Service Reminder",
    message:
      "It's time for your annual maintenance service. Book now and get 10% off on all replacement parts.",
    discount: "10%",
    validUntil: "2025-04-15",
  },
  {
    id: "3",
    title: "Referral Bonus",
    message:
      "Refer a friend and both of you get ₹1000 off on your next purchase!",
    discount: "₹1000",
    validUntil: "2025-12-31",
  },
];

function WhatsAppDialog({
  isOpen,
  onClose,
  customer,
  allCustomers = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  customer?: Customer | null;
  allCustomers?: boolean;
}) {
  const [message, setMessage] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const templateId = e.target.value;
    if (!templateId) {
      setMessage("");
      setSelectedTemplate("");
      return;
    }

    const template = offerTemplates.find((t) => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setMessage(template.message);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSending(true);

    // Simulate sending message
    setTimeout(() => {
      setIsSending(false);
      setSendSuccess(true);

      // Reset success message after 3 seconds
      setTimeout(() => {
        setSendSuccess(false);
        onClose();
      }, 3000);
    }, 1500);
  };

  const getWhatsAppLink = (phone: string, text: string) => {
    // Format phone number (remove any non-digit characters)
    const formattedPhone = phone.replace(/\D/g, "");
    return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(text)}`;
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
              <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 flex items-center"
                >
                  <MessageSquare className="h-5 w-5 text-green-500 mr-2" />
                  {allCustomers
                    ? "Send WhatsApp Message to All Customers"
                    : `Send WhatsApp Message to ${customer?.name}`}
                </Dialog.Title>

                {customer && !allCustomers && (
                  <div className="mt-4 flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      {customer.avatar ? (
                        <img
                          src={customer.avatar}
                          alt={customer.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
                          <span className="text-white font-medium">
                            {customer.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">
                        {customer.name}
                      </p>
                      <p className="text-sm text-gray-500">{customer.phone}</p>
                    </div>
                  </div>
                )}

                {allCustomers && (
                  <div className="mt-4 bg-green-50 p-3 rounded-lg">
                    <p className="text-sm text-green-800">
                      This message will be sent to all {initialCustomers.length}{" "}
                      customers in your database.
                    </p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="mt-6">
                  <div className="mb-4">
                    <label
                      htmlFor="template"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Select Offer Template (Optional)
                    </label>
                    <select
                      id="template"
                      value={selectedTemplate}
                      onChange={handleTemplateChange}
                      className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors duration-200 text-base"
                    >
                      <option value="">Select a template</option>
                      {offerTemplates.map((template) => (
                        <option key={template.id} value={template.id}>
                          {template.title} ({template.discount} off)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message here..."
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors duration-200 text-base"
                      required
                    />
                  </div>

                  {customer && !allCustomers && (
                    <div className="mt-4 mb-6">
                      <a
                        href={getWhatsAppLink(customer.phone, message)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-green-600 hover:text-green-800"
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Open in WhatsApp
                      </a>
                    </div>
                  )}

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSending || sendSuccess}
                      className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-green-600 rounded-lg hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center"
                    >
                      {isSending ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Sending...
                        </>
                      ) : sendSuccess ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Sent!
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Message
                        </>
                      )}
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

function EmailDialog({
  isOpen,
  onClose,
  customer,
  allCustomers = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  customer?: Customer | null;
  allCustomers?: boolean;
}) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const templateId = e.target.value;
    if (!templateId) {
      setSubject("");
      setMessage("");
      setSelectedTemplate("");
      return;
    }

    const template = offerTemplates.find((t) => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setSubject(template.title);
      setMessage(template.message);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    setIsSending(true);

    // Simulate sending email
    setTimeout(() => {
      setIsSending(false);
      setSendSuccess(true);

      // Reset success message after 3 seconds
      setTimeout(() => {
        setSendSuccess(false);
        onClose();
      }, 3000);
    }, 1500);
  };

  const getMailtoLink = (email: string, subject: string, body: string) => {
    return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
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
              <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 flex items-center"
                >
                  <Mail className="h-5 w-5 text-blue-500 mr-2" />
                  {allCustomers
                    ? "Send Email to All Customers"
                    : `Send Email to ${customer?.name}`}
                </Dialog.Title>

                {customer && !allCustomers && (
                  <div className="mt-4 flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      {customer.avatar ? (
                        <img
                          src={customer.avatar}
                          alt={customer.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                          <span className="text-white font-medium">
                            {customer.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">
                        {customer.name}
                      </p>
                      <p className="text-sm text-gray-500">{customer.email}</p>
                    </div>
                  </div>
                )}

                {allCustomers && (
                  <div className="mt-4 bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-800">
                      This email will be sent to all {initialCustomers.length}{" "}
                      customers in your database.
                    </p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="mt-6">
                  <div className="mb-4">
                    <label
                      htmlFor="template"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Select Offer Template (Optional)
                    </label>
                    <select
                      id="template"
                      value={selectedTemplate}
                      onChange={handleTemplateChange}
                      className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200 text-base"
                    >
                      <option value="">Select a template</option>
                      {offerTemplates.map((template) => (
                        <option key={template.id} value={template.id}>
                          {template.title} ({template.discount} off)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Email subject"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200 text-base"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message here..."
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200 text-base"
                      required
                    />
                  </div>

                  {customer && !allCustomers && (
                    <div className="mt-4 mb-6">
                      <a
                        href={getMailtoLink(customer.email, subject, message)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                      >
                        <Mail className="h-4 w-4 mr-1" />
                        Open in Email Client
                      </a>
                    </div>
                  )}

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSending || sendSuccess}
                      className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
                    >
                      {isSending ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Sending...
                        </>
                      ) : sendSuccess ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Sent!
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Email
                        </>
                      )}
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

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Offers() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomers, setSelectedCustomers] = useState<Customer[]>([]);
  const [isWhatsAppDialogOpen, setIsWhatsAppDialogOpen] = useState(false);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );
  const [isBulkWhatsAppDialogOpen, setIsBulkWhatsAppDialogOpen] =
    useState(false);
  const [isBulkEmailDialogOpen, setIsBulkEmailDialogOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);

  const getFilteredCustomers = () => {
    // First filter by search term
    const searchFiltered = customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm),
    );

    // Then filter by tab (All, Online, Offline)
    if (selectedTab === 1) {
      return searchFiltered.filter((customer) => customer.isOnline);
    } else if (selectedTab === 2) {
      return searchFiltered.filter((customer) => !customer.isOnline);
    } else {
      return searchFiltered;
    }
  };

  const filteredCustomers = getFilteredCustomers();

  const handleCustomerSelection = (customer: Customer) => {
    setSelectedCustomers((prev) => {
      const isSelected = prev.some((c) => c.id === customer.id);
      if (isSelected) {
        return prev.filter((c) => c.id !== customer.id);
      } else {
        return [...prev, customer];
      }
    });
  };

  const handleSelectAllCustomers = () => {
    if (selectedCustomers.length === filteredCustomers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers([...filteredCustomers]);
    }
  };

  const handleOpenWhatsAppDialog = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsWhatsAppDialogOpen(true);
  };

  const handleOpenEmailDialog = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsEmailDialogOpen(true);
  };

  const handleOpenBulkWhatsAppDialog = () => {
    setIsBulkWhatsAppDialogOpen(true);
  };

  const handleOpenBulkEmailDialog = () => {
    setIsBulkEmailDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getCustomerTypeLabel = (isOnline: boolean) => {
    return isOnline ? (
      <span className="inline-flex items-center rounded-full bg-cyan-100 px-2.5 py-0.5 text-xs font-medium text-cyan-800">
        Online
      </span>
    ) : (
      <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
        Offline
      </span>
    );
  };

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h2 className="text-xl font-semibold text-gray-900">Send Offers</h2>
          <p className="mt-2 text-sm text-gray-700">
            Send promotional offers and discounts to your customers via WhatsApp
            or email
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex space-x-3">
          <button
            type="button"
            onClick={handleOpenBulkWhatsAppDialog}
            className="inline-flex items-center justify-center rounded-lg border border-transparent bg-gradient-to-r from-green-500 to-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            WhatsApp All
          </button>
          <button
            type="button"
            onClick={handleOpenBulkEmailDialog}
            className="inline-flex items-center justify-center rounded-lg border border-transparent bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Mail className="h-4 w-4 mr-2" />
            Email All
          </button>
        </div>
      </div>

      <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
        <div className="mt-6 flex items-center space-x-6">
          <div className="max-w-md flex-1">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 pl-10 pr-3 py-3 text-base placeholder-gray-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50"
              />
            </div>
          </div>
          <Tab.List className="flex space-x-2 rounded-lg bg-gray-100 p-1">
            <Tab
              className={({ selected }) =>
                classNames(
                  "rounded-md px-3 py-2 text-sm font-medium flex items-center",
                  selected
                    ? "bg-white text-cyan-700 shadow"
                    : "text-gray-500 hover:text-gray-700",
                )
              }
            >
              <Users className="h-4 w-4 mr-2" />
              All Customers
            </Tab>
            <Tab
              className={({ selected }) =>
                classNames(
                  "rounded-md px-3 py-2 text-sm font-medium flex items-center",
                  selected
                    ? "bg-white text-cyan-700 shadow"
                    : "text-gray-500 hover:text-gray-700",
                )
              }
            >
              <User className="h-4 w-4 mr-2" />
              Online Customers
            </Tab>
            <Tab
              className={({ selected }) =>
                classNames(
                  "rounded-md px-3 py-2 text-sm font-medium flex items-center",
                  selected
                    ? "bg-white text-cyan-700 shadow"
                    : "text-gray-500 hover:text-gray-700",
                )
              }
            >
              <User className="h-4 w-4 mr-2" />
              Offline Customers
            </Tab>
          </Tab.List>
        </div>

        <Tab.Panels className="mt-4">
          {/* All Customers Panel */}
          <Tab.Panel>
            <CustomerTable
              customers={filteredCustomers}
              selectedCustomers={selectedCustomers}
              handleSelectAllCustomers={handleSelectAllCustomers}
              handleCustomerSelection={handleCustomerSelection}
              handleOpenWhatsAppDialog={handleOpenWhatsAppDialog}
              handleOpenEmailDialog={handleOpenEmailDialog}
              formatDate={formatDate}
              getCustomerTypeLabel={getCustomerTypeLabel}
            />
          </Tab.Panel>

          {/* Online Customers Panel */}
          <Tab.Panel>
            <CustomerTable
              customers={filteredCustomers}
              selectedCustomers={selectedCustomers}
              handleSelectAllCustomers={handleSelectAllCustomers}
              handleCustomerSelection={handleCustomerSelection}
              handleOpenWhatsAppDialog={handleOpenWhatsAppDialog}
              handleOpenEmailDialog={handleOpenEmailDialog}
              formatDate={formatDate}
              getCustomerTypeLabel={getCustomerTypeLabel}
            />
          </Tab.Panel>

          {/* Offline Customers Panel */}
          <Tab.Panel>
            <CustomerTable
              customers={filteredCustomers}
              selectedCustomers={selectedCustomers}
              handleSelectAllCustomers={handleSelectAllCustomers}
              handleCustomerSelection={handleCustomerSelection}
              handleOpenWhatsAppDialog={handleOpenWhatsAppDialog}
              handleOpenEmailDialog={handleOpenEmailDialog}
              formatDate={formatDate}
              getCustomerTypeLabel={getCustomerTypeLabel}
            />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>

      {/* Offer Templates Section */}
      <div className="mt-12">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Tag className="h-5 w-5 mr-2 text-cyan-500" />
          Offer Templates
        </h3>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {offerTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-lg font-medium text-gray-900">
                    {template.title}
                  </h4>
                  <p className="mt-1 text-sm text-gray-500">
                    {template.message}
                  </p>
                </div>
                <div className="bg-cyan-100 text-cyan-800 px-2.5 py-0.5 rounded-full text-xs font-medium">
                  {template.discount} off
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-500">
                Valid until: {formatDate(template.validUntil)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dialogs */}
      <WhatsAppDialog
        isOpen={isWhatsAppDialogOpen}
        onClose={() => setIsWhatsAppDialogOpen(false)}
        customer={selectedCustomer}
      />

      <EmailDialog
        isOpen={isEmailDialogOpen}
        onClose={() => setIsEmailDialogOpen(false)}
        customer={selectedCustomer}
      />

      <WhatsAppDialog
        isOpen={isBulkWhatsAppDialogOpen}
        onClose={() => setIsBulkWhatsAppDialogOpen(false)}
        allCustomers={true}
      />

      <EmailDialog
        isOpen={isBulkEmailDialogOpen}
        onClose={() => setIsBulkEmailDialogOpen(false)}
        allCustomers={true}
      />
    </div>
  );
}

// Extracted customer table component to avoid duplication
function CustomerTable({
  customers,
  selectedCustomers,
  handleSelectAllCustomers,
  handleCustomerSelection,
  handleOpenWhatsAppDialog,
  handleOpenEmailDialog,
  formatDate,
  getCustomerTypeLabel,
}: {
  customers: Customer[];
  selectedCustomers: Customer[];
  handleSelectAllCustomers: () => void;
  handleCustomerSelection: (customer: Customer) => void;
  handleOpenWhatsAppDialog: (customer: Customer) => void;
  handleOpenEmailDialog: (customer: Customer) => void;
  formatDate: (dateString: string) => string;
  getCustomerTypeLabel: (isOnline: boolean) => JSX.Element;
}) {
  return (
    <div className="flex flex-col">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <input
                      type="checkbox"
                      className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                      checked={
                        selectedCustomers.length === customers.length &&
                        customers.length > 0
                      }
                      onChange={handleSelectAllCustomers}
                    />
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 pl-10 pr-3 text-left text-sm font-semibold text-gray-900"
                  >
                    Customer
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Contact
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Purchase History
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Type
                  </th>
                  <th
                    scope="col"
                    className="relative py-3.5 pl-3 pr-4 sm:pr-6 text-right text-sm font-semibold text-gray-900"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {customers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center">
                      <User className="mx-auto h-12 w-12 text-gray-300" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">
                        No customers found
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Try adjusting your search terms or filter.
                      </p>
                    </td>
                  </tr>
                ) : (
                  customers.map((customer) => (
                    <tr
                      key={customer.id}
                      className={
                        selectedCustomers.some((c) => c.id === customer.id)
                          ? "bg-cyan-50"
                          : undefined
                      }
                    >
                      <td className="relative py-4 pl-3 pr-4 sm:pr-6">
                        <input
                          type="checkbox"
                          className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                          checked={selectedCustomers.some(
                            (c) => c.id === customer.id,
                          )}
                          onChange={() => handleCustomerSelection(customer)}
                        />
                      </td>
                      <td className="whitespace-nowrap py-4 pl-10 pr-3 text-sm">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            {customer.avatar ? (
                              <img
                                src={customer.avatar}
                                alt={customer.name}
                                className="h-10 w-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                                <span className="text-white font-medium">
                                  {customer.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-gray-900">
                              {customer.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 text-gray-400 mr-1" />
                          <span>{customer.email}</span>
                        </div>
                        <div className="flex items-center mt-1">
                          <Phone className="h-4 w-4 text-gray-400 mr-1" />
                          <span>{customer.phone}</span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <div className="text-gray-900">
                          ₹{customer.totalSpent.toLocaleString()}
                        </div>
                        <div className="text-gray-500">
                          {customer.purchaseCount} orders • Last:{" "}
                          {formatDate(customer.lastPurchase)}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        {getCustomerTypeLabel(customer.isOnline)}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <div className="flex justify-end space-x-3">
                          <button
                            onClick={() => handleOpenWhatsAppDialog(customer)}
                            className="text-green-600 hover:text-green-900 bg-green-50 p-2 rounded-full"
                            title="Send WhatsApp"
                          >
                            <MessageSquare className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleOpenEmailDialog(customer)}
                            className="text-blue-600 hover:text-blue-900 bg-blue-50 p-2 rounded-full"
                            title="Send Email"
                          >
                            <Mail className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
