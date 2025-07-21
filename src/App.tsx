import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { checkAuth } from "./store/slices/authSlice";
import AuthDialog from "./components/AuthDialog";
import Dashboard from "./components/Dashboard";
import InvoiceView from "./components/invoices/InvoiceView";

function App() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

  useEffect(() => {
    // Check for auth token
    const token = localStorage.getItem("token");
    if (!token) {
      setIsAuthDialogOpen(true); // show auth dialog if not logged in
    }
    dispatch(checkAuth());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/invoice/:id" element={<InvoiceView />} />
        {isAuthenticated ? (
          <Route path="/*" element={<Dashboard />} />
        ) : (
          <Route
            path="/*"
            element={
              <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex flex-col items-center justify-center p-4">
                <div className="text-center">
                  <div className="flex flex-col items-center justify-center mb-8">
                    <div className="h-16 w-16 text-cyan-600 mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect
                          x="3"
                          y="3"
                          width="18"
                          height="18"
                          rx="2"
                          ry="2"
                        />
                        <line x1="3" y1="9" x2="21" y2="9" />
                        <line x1="9" y1="21" x2="9" y2="9" />
                      </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-cyan-900">
                      Aquakart
                    </h1>
                    <p className="text-sm text-cyan-600 mt-1">
                      Business Management Suite
                    </p>
                  </div>

                  <button
                    onClick={() => setIsAuthDialogOpen(true)}
                    className="inline-flex items-center justify-center rounded-lg border border-transparent bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-3 text-base font-medium text-white shadow-lg hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 transition-all duration-200"
                  >
                    <svg
                      className="h-5 w-5 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                      <polyline points="10 17 15 12 10 7" />
                      <line x1="15" y1="12" x2="3" y2="12" />
                    </svg>
                    Sign In to Access Dashboard
                  </button>
                </div>
                <AuthDialog
                  isOpen={isAuthDialogOpen}
                  onClose={() => setIsAuthDialogOpen(false)}
                />
              </div>
            }
          />
        )}
      </Routes>
    </Router>
  );
}

export default App;
