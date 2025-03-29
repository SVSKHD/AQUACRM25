import { useState, useEffect } from 'react';
import { Plus, Search, FileText, IndianRupee, Calendar, Filter, Download, FileSpreadsheet, File as FilePdf } from 'lucide-react';
import { Tab } from '@headlessui/react';
import { invoiceOperations, type Invoice } from '@/services/invoices';
import { exportService } from '@/services/export';
import InvoiceDialog from './invoices/InvoiceDialog';
import InvoiceList from './invoices/InvoiceList';
import PaginationControls from './invoices/PaginationControls';

interface TabItem {
  name: string;
  filter: (invoice: Invoice) => boolean;
}

const tabs: TabItem[] = [
  { name: 'All', filter: () => true },
  { name: 'Regular', filter: (invoice) => !invoice.gst && !invoice.po && !invoice.quotation },
  { name: 'GST', filter: (invoice) => invoice.gst },
  { name: 'PO', filter: (invoice) => invoice.po },
  { name: 'Quotation', filter: (invoice) => invoice.quotation }
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

// Helper function to format date to YYYY-MM-DD
const formatDateForInput = (date: Date) => {
  return date.toISOString().split('T')[0];
};

// Get first and last day of current month
const getMonthRange = (date: Date) => {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return { firstDay, lastDay };
};

export default function Invoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState(0);
  
  // Date filter states
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response = await invoiceOperations.getInvoices();
      setInvoices(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching invoices:', err);
      setError('Failed to load invoices. Using demo data.');
    } finally {
      setLoading(false);
    }
  };

  const handleMonthChange = (month: string) => {
    if (month) {
      const [year, monthNum] = month.split('-');
      const date = new Date(parseInt(year), parseInt(monthNum) - 1);
      const { firstDay, lastDay } = getMonthRange(date);
      setStartDate(formatDateForInput(firstDay));
      setEndDate(formatDateForInput(lastDay));
      setSelectedMonth(month);
    } else {
      setStartDate('');
      setEndDate('');
      setSelectedMonth('');
    }
  };

  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
    setSelectedMonth('');
  };

  const handleExportToExcel = () => {
    exportService.toExcel(filteredInvoices);
  };

  const handleExportToPDF = () => {
    exportService.toPDF(filteredInvoices);
  };

  const filteredInvoices = invoices
    .filter(tabs[selectedTab].filter)
    .filter(invoice => {
      // Text search filter
      const matchesSearch = invoice.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.customerDetails.name.toLowerCase().includes(searchTerm.toLowerCase());

      // Date range filter
      let matchesDateRange = true;
      if (startDate && endDate) {
        const invoiceDate = new Date(invoice.date.split('/').reverse().join('-'));
        const start = new Date(startDate);
        const end = new Date(endDate);
        matchesDateRange = invoiceDate >= start && invoiceDate <= end;
      }

      return matchesSearch && matchesDateRange;
    });

  // Pagination calculations
  const totalItems = filteredInvoices.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentInvoices = filteredInvoices.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const handleEdit = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedInvoice(null);
    setIsDialogOpen(true);
  };

  const calculateTotal = (products: Invoice['products']) => {
    return products.reduce((sum, product) => sum + (product.productPrice), 0);
  };

  // Calculate total statistics
  const totalInvoiceValue = invoices.reduce((sum, invoice) => 
    sum + calculateTotal(invoice.products), 0
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-500 font-mono">Loading invoices...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h2 className="text-xl font-semibold text-gray-900 font-mono">Invoices</h2>
          <p className="mt-2 text-sm text-gray-700 font-mono">
            Manage customer invoices and payment status
          </p>
          {error && (
            <p className="mt-2 text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-full inline-block font-mono">
              {error}
            </p>
          )}
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex space-x-3">
          <div className="flex space-x-2">
            <button
              onClick={handleExportToExcel}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 font-mono"
              title="Export to Excel"
            >
              <FileSpreadsheet className="h-4 w-4 mr-2 text-green-600" />
              Excel
            </button>
            <button
              onClick={handleExportToPDF}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 font-mono"
              title="Export to PDF"
            >
              <FilePdf className="h-4 w-4 mr-2 text-red-600" />
              PDF
            </button>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center justify-center rounded-lg border border-transparent bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 font-mono"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Invoice
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div className="bg-white p-6 rounded-lg shadow-lg shadow-cyan-100/50 border border-cyan-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-cyan-100">
              <FileText className="h-6 w-6 text-cyan-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 font-mono">Total Invoices</p>
              <h3 className="text-2xl font-bold text-gray-900 font-mono mt-1">{invoices.length}</h3>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm text-gray-500 font-mono">
              <span className="flex items-center">
                {tabs.map((tab, index) => (
                  <span key={tab.name} className="flex items-center">
                    {index > 0 && <span className="mx-2">•</span>}
                    {tab.name}: {invoices.filter(tab.filter).length}
                  </span>
                ))}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg shadow-cyan-100/50 border border-cyan-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <IndianRupee className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 font-mono">Total Value</p>
              <h3 className="text-2xl font-bold text-gray-900 font-mono mt-1">
                ₹{totalInvoiceValue.toLocaleString()}
              </h3>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm text-gray-500 font-mono">
              <span>Average per invoice: </span>
              <span className="ml-1 font-semibold text-gray-900">
                ₹{(totalInvoiceValue / (invoices.length || 1)).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
        <div className="mt-6 space-y-4">
          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="w-full sm:w-96">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search invoices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 pl-10 pr-3 py-3 text-base placeholder-gray-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 font-mono"
                />
              </div>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 font-mono"
            >
              <Filter className="h-4 w-4 mr-2" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>

            <Tab.List className="flex space-x-2 rounded-lg bg-gray-100 p-1">
              {tabs.map((tab, index) => (
                <Tab
                  key={tab.name}
                  className={({ selected }) =>
                    classNames(
                      'rounded-md px-3 py-2 text-sm font-medium font-mono',
                      selected
                        ? 'bg-white text-cyan-700 shadow'
                        : 'text-gray-500 hover:text-gray-700'
                    )
                  }
                >
                  {tab.name}
                </Tab>
              ))}
            </Tab.List>
          </div>

          {/* Date Filters */}
          {showFilters && (
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-mono">Month</label>
                  <input
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => handleMonthChange(e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-base focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-mono">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      setSelectedMonth('');
                    }}
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-base focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-mono">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      setSelectedMonth('');
                    }}
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-base focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 font-mono"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 font-mono"
                >
                  Clear Filters
                </button>
                <button
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 font-mono"
                >
                  Apply Filter
                </button>
              </div>
            </div>
          )}
        </div>

        <Tab.Panels className="mt-4">
          {tabs.map((tab, idx) => (
            <Tab.Panel
              key={idx}
              className={classNames(
                'rounded-xl bg-white',
                'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60'
              )}
            >
              <div className="mt-4 flex flex-col">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                      <InvoiceList
                        invoices={currentInvoices}
                        onEdit={handleEdit}
                        calculateTotal={calculateTotal}
                        onDelete={fetchInvoices}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>

      {totalItems > 0 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
          startIndex={startIndex}
          endIndex={Math.min(endIndex, totalItems)}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      )}

      <InvoiceDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedInvoice(null);
          fetchInvoices();
        }}
        invoice={selectedInvoice}
      />
    </div>
  );
}