'use client';

import { useState, Fragment, useEffect } from 'react';
import { Search, Send, Bell, MessageSquare, CheckCircle, AlertCircle, Info, X, User, Users } from 'lucide-react';
import { Dialog, Transition, Tab } from '@headlessui/react';

interface UserNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
  sender?: string;
}

interface UserContact {
  id: string;
  name: string;
  email: string;
  phone: string;
  lastActive: string;
  avatar?: string;
}

// Mock data for development
const initialNotifications: UserNotification[] = [
  {
    id: '1',
    title: 'New Order Received',
    message: 'You have received a new order for Water Softener from John Doe.',
    type: 'info',
    timestamp: '2025-03-15T10:30:00Z',
    read: false
  },
  {
    id: '2',
    title: 'Payment Successful',
    message: 'Payment of ₹15,000 has been received for invoice #INV-2025-001.',
    type: 'success',
    timestamp: '2025-03-14T15:45:00Z',
    read: true
  },
  {
    id: '3',
    title: 'Low Stock Alert',
    message: 'RO Filter Cartridge is running low on stock. Current quantity: 5',
    type: 'warning',
    timestamp: '2025-03-13T09:15:00Z',
    read: false
  },
  {
    id: '4',
    title: 'Failed Payment',
    message: 'Payment for invoice #INV-2025-003 has failed. Please contact the customer.',
    type: 'error',
    timestamp: '2025-03-12T14:20:00Z',
    read: true
  },
  {
    id: '5',
    title: 'New Message from Customer',
    message: 'Jane Smith has sent you a message regarding her recent purchase.',
    type: 'info',
    timestamp: '2025-03-11T11:05:00Z',
    read: false,
    sender: 'Jane Smith'
  }
];

// Mock user contacts for messaging
const userContacts: UserContact[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '9876543210',
    lastActive: '2025-03-15T10:30:00Z',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '9876543211',
    lastActive: '2025-03-14T15:45:00Z',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    phone: '9876543212',
    lastActive: '2025-03-13T09:15:00Z',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: '4',
    name: 'Sarah Williams',
    email: 'sarah@example.com',
    phone: '9876543213',
    lastActive: '2025-03-12T14:20:00Z',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: '5',
    name: 'David Brown',
    email: 'david@example.com',
    phone: '9876543214',
    lastActive: '2025-03-11T11:05:00Z',
    avatar: 'https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  }
];

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
  isOutgoing: boolean;
}

// Mock messages for development
const initialMessages: Record<string, Message[]> = {
  '1': [
    {
      id: '101',
      senderId: '1',
      receiverId: 'admin',
      content: 'Hello, I have a question about my water softener installation.',
      timestamp: '2025-03-15T10:30:00Z',
      read: true,
      isOutgoing: false
    },
    {
      id: '102',
      senderId: 'admin',
      receiverId: '1',
      content: 'Hi John, I\'d be happy to help. What would you like to know?',
      timestamp: '2025-03-15T10:32:00Z',
      read: true,
      isOutgoing: true
    },
    {
      id: '103',
      senderId: '1',
      receiverId: 'admin',
      content: 'When can I expect the technician to arrive?',
      timestamp: '2025-03-15T10:33:00Z',
      read: true,
      isOutgoing: false
    },
    {
      id: '104',
      senderId: 'admin',
      receiverId: '1',
      content: 'The technician is scheduled to arrive tomorrow between 10 AM and 12 PM. Does that work for you?',
      timestamp: '2025-03-15T10:35:00Z',
      read: true,
      isOutgoing: true
    },
    {
      id: '105',
      senderId: '1',
      receiverId: 'admin',
      content: 'Yes, that works perfectly. Thank you!',
      timestamp: '2025-03-15T10:36:00Z',
      read: false,
      isOutgoing: false
    }
  ],
  '2': [
    {
      id: '201',
      senderId: '2',
      receiverId: 'admin',
      content: 'I received my RO system but there seems to be a part missing.',
      timestamp: '2025-03-14T15:45:00Z',
      read: true,
      isOutgoing: false
    },
    {
      id: '202',
      senderId: 'admin',
      receiverId: '2',
      content: 'I\'m sorry to hear that, Jane. Can you please describe which part is missing?',
      timestamp: '2025-03-14T15:47:00Z',
      read: true,
      isOutgoing: true
    },
    {
      id: '203',
      senderId: '2',
      receiverId: 'admin',
      content: 'The filter housing wrench is not in the package.',
      timestamp: '2025-03-14T15:48:00Z',
      read: true,
      isOutgoing: false
    }
  ]
};

function MessageDialog({ isOpen, onClose, user }: { isOpen: boolean; onClose: () => void; user: UserContact | null }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (user && initialMessages[user.id]) {
      setMessages(initialMessages[user.id]);
    } else {
      setMessages([]);
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !user) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'admin',
      receiverId: user.id,
      content: message,
      timestamp: new Date().toISOString(),
      read: false,
      isOutgoing: true
    };

    setMessages([...messages, newMessage]);
    setMessage('');
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
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
              <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                {user && (
                  <>
                    <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-4 flex items-center">
                      <div className="flex-shrink-0">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center">
                            <User className="h-6 w-6 text-cyan-500" />
                          </div>
                        )}
                      </div>
                      <div className="ml-3">
                        <Dialog.Title
                          as="h3"
                          className="text-lg font-medium leading-6 text-white"
                        >
                          {user.name}
                        </Dialog.Title>
                        <p className="text-sm text-cyan-50">{user.email}</p>
                      </div>
                      <button
                        onClick={onClose}
                        className="ml-auto text-white hover:text-cyan-100"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="h-96 overflow-y-auto p-4 bg-gray-50">
                      {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                          <MessageSquare className="h-12 w-12 mb-2" />
                          <p>No messages yet</p>
                          <p className="text-sm">Start the conversation!</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {messages.map((msg) => (
                            <div
                              key={msg.id}
                              className={`flex ${msg.isOutgoing ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-xs rounded-lg px-4 py-2 ${
                                  msg.isOutgoing
                                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                                    : 'bg-white border border-gray-200 text-gray-800'
                                }`}
                              >
                                <p>{msg.content}</p>
                                <p className={`text-xs mt-1 ${msg.isOutgoing ? 'text-cyan-50' : 'text-gray-500'}`}>
                                  {formatTime(msg.timestamp)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
                      <div className="flex items-center">
                        <input
                          type="text"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Type your message..."
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        />
                        <button
                          type="submit"
                          className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 rounded-r-lg hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
                        >
                          <Send className="h-5 w-5" />
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

function BulkMessageDialog({ isOpen, onClose, selectedUsers }: { isOpen: boolean; onClose: () => void; selectedUsers: UserContact[] }) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || selectedUsers.length === 0) return;

    console.log('Sending message to:', selectedUsers.map(user => user.name));
    console.log('Message:', message);
    
    // In a real app, this would send the message to all selected users
    setMessage('');
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
              <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Send Bulk Message
                </Dialog.Title>
                
                <div className="mt-4">
                  <p className="text-sm text-gray-500">
                    Sending message to {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''}:
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedUsers.map(user => (
                      <div key={user.id} className="bg-cyan-50 text-cyan-700 px-2 py-1 rounded-full text-xs font-medium">
                        {user.name}
                      </div>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="mt-6">
                  <div className="mb-4">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message here..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div className="mt-6 flex justify-end space-x-3">
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
                      Send Message
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
  return classes.filter(Boolean).join(' ');
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<UserNotification[]>(initialNotifications);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [isBulkMessageDialogOpen, setIsBulkMessageDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserContact | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<UserContact[]>([]);
  const [contacts, setContacts] = useState<UserContact[]>(userContacts);
  const [selectedTab, setSelectedTab] = useState(0);

  const filteredNotifications = notifications.filter(notification =>
    notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notification.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.phone.includes(searchTerm)
  );

  const handleMarkAsRead = (id: string) => {
    setNotifications(
      notifications.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications.map(notification => ({ ...notification, read: true }))
    );
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const handleOpenMessageDialog = (user: UserContact) => {
    setSelectedUser(user);
    setIsMessageDialogOpen(true);
  };

  const handleOpenBulkMessageDialog = () => {
    if (selectedUsers.length > 0) {
      setIsBulkMessageDialogOpen(true);
    }
  };

  const handleUserSelection = (user: UserContact) => {
    setSelectedUsers(prev => {
      const isSelected = prev.some(u => u.id === user.id);
      if (isSelected) {
        return prev.filter(u => u.id !== user.id);
      } else {
        return [...prev, user];
      }
    });
  };

  const handleSelectAllUsers = () => {
    if (selectedUsers.length === filteredContacts.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers([...filteredContacts]);
    }
  };

  const getNotificationIcon = (type: UserNotification['type']) => {
    switch (type) {
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return `Today at ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffInDays === 1) {
      return `Yesterday at ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  const formatLastActive = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return diffInMinutes === 0 ? 'Just now' : `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 24 * 60) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const unreadCount = notifications.filter(notification => !notification.read).length;

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
          <p className="mt-2 text-sm text-gray-700">
            Manage notifications and send messages to users
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          {selectedTab === 1 && (
            <button
              type="button"
              onClick={handleOpenBulkMessageDialog}
              disabled={selectedUsers.length === 0}
              className={`inline-flex items-center justify-center rounded-lg border border-transparent px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 ${
                selectedUsers.length > 0
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Message Selected ({selectedUsers.length})
            </button>
          )}
          {selectedTab === 0 && unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllAsRead}
              className="inline-flex items-center justify-center rounded-lg border border-transparent bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark All as Read
            </button>
          )}
        </div>
      </div>

      <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
        <div className="mt-6 flex items-center space-x-6">
          <div className="max-w-md flex-1">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={selectedTab === 0 ? "Search notifications..." : "Search users..."}
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
                  'rounded-md px-3 py-2 text-sm font-medium flex items-center',
                  selected
                    ? 'bg-white text-cyan-700 shadow'
                    : 'text-gray-500 hover:text-gray-700'
                )
              }
            >
              <Bell className="h-4 w-4 mr-2" />
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 bg-cyan-500 text-white text-xs rounded-full px-2 py-0.5">
                  {unreadCount}
                </span>
              )}
            </Tab>
            <Tab
              className={({ selected }) =>
                classNames(
                  'rounded-md px-3 py-2 text-sm font-medium flex items-center',
                  selected
                    ? 'bg-white text-cyan-700 shadow'
                    : 'text-gray-500 hover:text-gray-700'
                )
              }
            >
              <Users className="h-4 w-4 mr-2" />
              Message Users
            </Tab>
          </Tab.List>
        </div>

        <Tab.Panels className="mt-4">
          {/* Notifications Panel */}
          <Tab.Panel
            className={classNames(
              'rounded-xl bg-white',
              'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60'
            )}
          >
            <div className="divide-y divide-gray-200">
              {filteredNotifications.length === 0 ? (
                <div className="py-12 text-center">
                  <Bell className="mx-auto h-12 w-12 text-gray-300" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
                  <p className="mt-1 text-sm text-gray-500">You don't have any notifications at the moment.</p>
                </div>
              ) : (
                filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 ${notification.read ? 'bg-white' : 'bg-cyan-50'}`}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 pt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">
                              {formatDate(notification.timestamp)}
                            </span>
                            {!notification.read && (
                              <button
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="text-cyan-600 hover:text-cyan-900"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteNotification(notification.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
                        {notification.sender && (
                          <button
                            onClick={() => {
                              const user = contacts.find(c => c.name === notification.sender);
                              if (user) {
                                handleOpenMessageDialog(user);
                              }
                            }}
                            className="mt-2 inline-flex items-center text-xs font-medium text-cyan-600 hover:text-cyan-900"
                          >
                            <MessageSquare className="h-3 w-3 mr-1" />
                            Reply to {notification.sender}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Tab.Panel>

          {/* Message Users Panel */}
          <Tab.Panel
            className={classNames(
              'rounded-xl bg-white',
              'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60'
            )}
          >
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <input
                        type="checkbox"
                        className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                        checked={selectedUsers.length === filteredContacts.length && filteredContacts.length > 0}
                        onChange={handleSelectAllUsers}
                      />
                    </th>
                    <th scope="col" className="py-3.5 pl-10 pr-3 text-left text-sm font-semibold text-gray-900">User</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Contact</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Last Active</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredContacts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center">
                        <User className="mx-auto h-12 w-12 text-gray-300" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
                        <p className="mt-1 text-sm text-gray-500">Try adjusting your search terms.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredContacts.map((contact) => (
                      <tr key={contact.id} className={selectedUsers.some(u => u.id === contact.id) ? 'bg-cyan-50' : undefined}>
                        <td className="relative py-4 pl-3 pr-4 sm:pr-6">
                          <input
                            type="checkbox"
                            className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                            checked={selectedUsers.some(u => u.id === contact.id)}
                            onChange={() => handleUserSelection(contact)}
                          />
                        </td>
                        <td className="whitespace-nowrap py-4 pl-10 pr-3 text-sm">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              {contact.avatar ? (
                                <img
                                  src={contact.avatar}
                                  alt={contact.name}
                                  className="h-10 w-10 rounded-full object-cover"
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                                  <span className="text-white font-medium">
                                    {contact.name.split(' ').map(n => n[0]).join('')}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-gray-900">{contact.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <div>{contact.email}</div>
                          <div>{contact.phone}</div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {formatLastActive(contact.lastActive)}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <button
                            onClick={() => handleOpenMessageDialog(contact)}
                            className="text-cyan-600 hover:text-cyan-900"
                          >
                            <MessageSquare className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>

      <MessageDialog
        isOpen={isMessageDialogOpen}
        onClose={() => setIsMessageDialogOpen(false)}
        user={selectedUser}
      />

      <BulkMessageDialog
        isOpen={isBulkMessageDialogOpen}
        onClose={() => setIsBulkMessageDialogOpen(false)}
        selectedUsers={selectedUsers}
      />
    </div>
  );
}