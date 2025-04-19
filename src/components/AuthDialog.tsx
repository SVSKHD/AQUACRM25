"use client";

import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Info, LogIn } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { signIn } from "../store/slices/authSlice";

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthDialog({ isOpen, onClose }: AuthDialogProps) {
  const [email, setEmail] = useState("demo@aquakart.com");
  const [password, setPassword] = useState("demo123");
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await dispatch(signIn({ email, password })).unwrap();
      console.log("Sign in successful:", response);
      // onClose();
    } catch (error) {
      console.error("Auth error:", error);
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
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-2xl font-semibold leading-6 text-gray-900 mb-6"
                >
                  Sign In to Dashboard
                </Dialog.Title>

                {/* Demo Credentials Notice */}
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-start">
                    <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-3" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-900">
                        Demo Credentials
                      </h4>
                      <p className="mt-1 text-sm text-blue-700">
                        Use these credentials to explore the dashboard:
                      </p>
                      <div className="mt-2 font-mono text-sm text-blue-800">
                        <div>Email: demo@aquakart.com</div>
                        <div>Password: demo123</div>
                      </div>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="mt-4 space-y-6">
                  {error && (
                    <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                      {error}
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-colors duration-200 text-base"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-colors duration-200 text-base"
                      required
                    />
                  </div>
                  <div className="mt-8">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-lg border border-transparent bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-3 text-base font-medium text-white shadow-sm hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-70 flex items-center justify-center"
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                          Signing in...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <LogIn className="h-5 w-5 mr-2" />
                          Sign In
                        </div>
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
