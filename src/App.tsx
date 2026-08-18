import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { LoginPage } from './pages/LoginPage';
import { ClosersPage } from './pages/ClosersPage';
import { RecepcaoPage } from './pages/RecepcaoPage';
import { PublicBadgePage } from './pages/PublicBadgePage';
import { ProtectedRoute } from './components/ProtectedRoute';

const RootRedirect: React.FC = () => {
  const { userSession } = useApp();
  if (!userSession.role) {
    return <Navigate to="/login" replace />;
  }
  return <Navigate to={userSession.role === 'CLOSER' ? '/closers' : '/recepcao'} replace />;
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-slate-200 selection:text-slate-900">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<RootRedirect />} />
              <Route path="/login" element={<LoginPage />} />
              
              <Route
                path="/closers"
                element={
                  <ProtectedRoute allowedRole="CLOSER">
                    <ClosersPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/recepcao"
                element={
                  <ProtectedRoute allowedRole="RECEPCAO">
                    <RecepcaoPage />
                  </ProtectedRoute>
                }
              />

              {/* Public Badge route - Isolated, no login link or confidential data */}
              <Route path="/badge/:id" element={<PublicBadgePage />} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
