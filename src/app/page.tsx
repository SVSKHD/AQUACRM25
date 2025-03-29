"use client";

import { useState, useEffect } from "react";
import { LayoutDashboard, LogIn } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { checkAuth } from "@/store/slices/authSlice";
import AuthDialog from "@/components/AuthDialog";
import Dashboard from "@/components/Dashboard";

export default function Home() {
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Dashboard />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <div className="flex flex-col items-center justify-center mb-8">
          <LayoutDashboard className="h-16 w-16 text-cyan-600 mb-4" />
          <h1 className="text-3xl font-bold text-cyan-900">Aquakart</h1>
          <p className="text-sm text-cyan-600 mt-1">
            Business Management Suite
          </p>
        </div>

        <button
          onClick={() => setIsAuthDialogOpen(true)}
          className="inline-flex items-center justify-center rounded-lg border border-transparent bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-3 text-base font-medium text-white shadow-lg hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 transition-all duration-200"
        >
          <LogIn className="h-5 w-5 mr-2" />
          Sign In to Access Dashboard
        </button>
      </div>

      <AuthDialog
        isOpen={isAuthDialogOpen}
        onClose={() => setIsAuthDialogOpen(false)}
      />
    </div>
  );
}
