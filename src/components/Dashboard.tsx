import { useState, useRef, useEffect } from 'react';
import { Tab } from '@headlessui/react';
import { LayoutDashboard, Package, FolderTree, FileText, UserCircle, GitFork, LogOut, Ticket, BookOpen, Link, Bell, Tag, ChevronLeft, ChevronRight, Mail, Shield, IndianRupee, Users as UsersIcon, ShoppingBag, TrendingUp, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { signOut } from '../store/slices/authSlice';
import Products from './Products';
import Categories from './Categories';
import Invoices from './Invoices';
import Users from './Users';
import SubCategories from './SubCategories';
import Coupons from './Coupons';
import Blogs from './Blogs';
import PaymentLinks from './PaymentLinks';
import Notifications from './Notifications';
import Offers from './Offers';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

interface TabItem {
  name: string;
  icon: React.ElementType;
  component: React.ComponentType;
}

const tabs: TabItem[] = [
  { name: 'Products', icon: Package, component: Products },
  { name: 'Categories', icon: FolderTree, component: Categories },
  { name: 'Subcategories', icon: GitFork, component: SubCategories },
  { name: 'Coupons', icon: Ticket, component: Coupons },
  { name: 'Invoices', icon: FileText, component: Invoices },
  { name: 'Payment Links', icon: Link, component: PaymentLinks },
  { name: 'Blogs', icon: BookOpen, component: Blogs },
  { name: 'Notifications', icon: Bell, component: Notifications },
  { name: 'Offers', icon: Tag, component: Offers },
  { name: 'Users', icon: UserCircle, component: Users }
];

// Mock data for dashboard analytics
const analyticsData = {
  totalRevenue: 1250000,
  totalOrders: 156,
  averageOrderValue: 8012,
  totalCustomers: 89,
  recentStats: {
    revenue: { value: 125000, trend: 'up', percentage: 12.5 },
    orders: { value: 24, trend: 'up', percentage: 8.3 },
    customers: { value: 15, trend: 'down', percentage: 3.2 }
  },
  topProducts: [
    { name: 'Kent Water Softener', sales: 28, revenue: 420000 },
    { name: 'RO Purifier System', sales: 22, revenue: 330000 },
    { name: 'UV Filter', sales: 18, revenue: 180000 }
  ]
};

function DashboardAnalytics() {
  return (
    <div className="mb-8 space-y-8">
      {/* Main Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white p-6 rounded-lg shadow-lg shadow-cyan-100/50 border border-cyan-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-cyan-100">
              <IndianRupee className="h-6 w-6 text-cyan-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 font-mono">Total Revenue</p>
              <h3 className="text-2xl font-bold text-gray-900 font-mono mt-1">
                ₹{analyticsData.totalRevenue.toLocaleString()}
              </h3>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm font-mono">
            <span className={`flex items-center ${analyticsData.recentStats.revenue.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {analyticsData.recentStats.revenue.trend === 'up' ? (
                <ArrowUpRight className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDownRight className="h-4 w-4 mr-1" />
              )}
              {analyticsData.recentStats.revenue.percentage}%
            </span>
            <span className="text-gray-500 ml-2">vs last month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg shadow-cyan-100/50 border border-cyan-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <ShoppingBag className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 font-mono">Total Orders</p>
              <h3 className="text-2xl font-bold text-gray-900 font-mono mt-1">
                {analyticsData.totalOrders}
              </h3>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm font-mono">
            <span className={`flex items-center ${analyticsData.recentStats.orders.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {analyticsData.recentStats.orders.trend === 'up' ? (
                <ArrowUpRight className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDownRight className="h-4 w-4 mr-1" />
              )}
              {analyticsData.recentStats.orders.percentage}%
            </span>
            <span className="text-gray-500 ml-2">vs last month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg shadow-cyan-100/50 border border-cyan-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 font-mono">Average Order Value</p>
              <h3 className="text-2xl font-bold text-gray-900 font-mono mt-1">
                ₹{analyticsData.averageOrderValue.toLocaleString()}
              </h3>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm font-mono">
            <Activity className="h-4 w-4 text-gray-400 mr-1" />
            <span className="text-gray-500">Per transaction</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg shadow-cyan-100/50 border border-cyan-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <UsersIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 font-mono">Total Customers</p>
              <h3 className="text-2xl font-bold text-gray-900 font-mono mt-1">
                {analyticsData.totalCustomers}
              </h3>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm font-mono">
            <span className={`flex items-center ${analyticsData.recentStats.customers.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {analyticsData.recentStats.customers.trend === 'up' ? (
                <ArrowUpRight className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDownRight className="h-4 w-4 mr-1" />
              )}
              {analyticsData.recentStats.customers.percentage}%
            </span>
            <span className="text-gray-500 ml-2">vs last month</span>
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-lg shadow-lg shadow-cyan-100/50 border border-cyan-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 font-mono mb-4">Top Performing Products</h3>
        <div className="space-y-4">
          {analyticsData.topProducts.map((product, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="w-8 text-sm font-mono text-gray-500">#{index + 1}</span>
                <div>
                  <p className="font-mono text-gray-900">{product.name}</p>
                  <p className="text-sm font-mono text-gray-500">{product.sales} sales</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-mono text-gray-900">₹{product.revenue.toLocaleString()}</p>
                <p className="text-sm font-mono text-gray-500">Revenue</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const tabsRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const handleSignOut = () => {
    dispatch(signOut());
  };

  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabsRef.current) {
      const scrollAmount = 200;
      const currentScroll = tabsRef.current.scrollLeft;
      tabsRef.current.scrollTo({
        left: direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const checkScrollButtons = () => {
    if (tabsRef.current) {
      setShowLeftArrow(tabsRef.current.scrollLeft > 0);
      setShowRightArrow(
        tabsRef.current.scrollLeft < 
        tabsRef.current.scrollWidth - tabsRef.current.clientWidth - 5
      );
    }
  };

  useEffect(() => {
    const tabsElement = tabsRef.current;
    if (tabsElement) {
      checkScrollButtons();
      tabsElement.addEventListener('scroll', checkScrollButtons);
      window.addEventListener('resize', checkScrollButtons);
    }

    return () => {
      if (tabsElement) {
        tabsElement.removeEventListener('scroll', checkScrollButtons);
      }
      window.removeEventListener('resize', checkScrollButtons);
    };
  }, []);

  useEffect(() => {
    if (tabsRef.current) {
      const tabElements = tabsRef.current.querySelectorAll('[role="tab"]');
      if (tabElements[selectedIndex]) {
        const tabElement = tabElements[selectedIndex] as HTMLElement;
        const tabsRect = tabsRef.current.getBoundingClientRect();
        const tabRect = tabElement.getBoundingClientRect();
        
        if (tabRect.left < tabsRect.left || tabRect.right > tabsRect.right) {
          tabElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      }
    }
  }, [selectedIndex]);

  const userRole = user?.role || 'Admin';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <LayoutDashboard className="h-8 w-8 text-cyan-600" />
              <div>
                <h1 className="text-xl font-bold text-cyan-900 font-mono">Aquakart</h1>
                <p className="text-xs text-cyan-600 font-mono">Business Management Suite</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-cyan-50 rounded-lg px-4 py-2 flex items-center">
                <div className="mr-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                    <UserCircle className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-cyan-600 mr-1.5" />
                    <span className="font-mono font-medium text-gray-800">{user?.email}</span>
                  </div>
                  <div className="flex items-center mt-0.5">
                    <Shield className="h-3.5 w-3.5 text-cyan-600 mr-1.5" />
                    <span className="font-mono text-xs font-medium bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded-full">
                      {userRole}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-mono font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Analytics */}
        {selectedIndex === -1 && <DashboardAnalytics />}

        <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
          <div className="relative">
            {showLeftArrow && (
              <button 
                onClick={() => scrollTabs('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-1 text-cyan-600 hover:text-cyan-800 focus:outline-none"
                aria-label="Scroll tabs left"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            )}
            
            <div 
              ref={tabsRef}
              className="overflow-x-auto scrollbar-hide mx-8 rounded-xl bg-white p-1.5 shadow-lg shadow-cyan-100/50"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <Tab.List className="flex space-x-2 min-w-max">
                <Tab
                  className={({ selected }) =>
                    classNames(
                      'rounded-lg py-3 px-4 text-sm font-mono font-medium leading-5 transition-all duration-200 ease-out whitespace-nowrap',
                      'ring-white/60 ring-offset-2 ring-offset-cyan-400 focus:outline-none focus:ring-2',
                      selected
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md'
                        : 'text-cyan-700 hover:bg-cyan-50 hover:text-cyan-900'
                    )
                  }
                  onClick={() => setSelectedIndex(-1)}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <LayoutDashboard className="h-5 w-5" />
                    <span>Dashboard</span>
                  </div>
                </Tab>
                {tabs.map((tab) => (
                  <Tab
                    key={tab.name}
                    className={({ selected }) =>
                      classNames(
                        'rounded-lg py-3 px-4 text-sm font-mono font-medium leading-5 transition-all duration-200 ease-out whitespace-nowrap',
                        'ring-white/60 ring-offset-2 ring-offset-cyan-400 focus:outline-none focus:ring-2',
                        selected
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md'
                          : 'text-cyan-700 hover:bg-cyan-50 hover:text-cyan-900'
                      )
                    }
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <tab.icon className="h-5 w-5" />
                      <span>{tab.name}</span>
                    </div>
                  </Tab>
                ))}
              </Tab.List>
            </div>
            
            {showRightArrow && (
              <button 
                onClick={() => scrollTabs('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-1 text-cyan-600 hover:text-cyan-800 focus:outline-none"
                aria-label="Scroll tabs right"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            )}
          </div>
          
          <Tab.Panels className="mt-6">
            {/* Dashboard Panel */}
            <Tab.Panel
              className={classNames(
                'rounded-xl bg-white p-6 shadow-lg shadow-cyan-100/50',
                'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                'transition-all duration-300 ease-out',
                'animate-fadeIn'
              )}
            >
              <DashboardAnalytics />
            </Tab.Panel>

            {/* Other Tab Panels */}
            {tabs.map((tab, idx) => (
              <Tab.Panel
                key={idx}
                className={classNames(
                  'rounded-xl bg-white p-6 shadow-lg shadow-cyan-100/50',
                  'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                  'transition-all duration-300 ease-out',
                  'animate-fadeIn'
                )}
              >
                <tab.component />
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </main>
    </div>
  );
}