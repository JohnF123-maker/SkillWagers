import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './components/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginRegister from './pages/LoginRegister';
import Profile from './pages/Profile';
import CreateChallenge from './pages/CreateChallenge';
import Marketplace from './pages/Marketplace';
import ChallengeDetail from './pages/ChallengeDetail';
import Wallet from './pages/Wallet';
import ProofDispute from './pages/ProofDispute';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-dark-900">
          <Navbar />
          <main className="pt-16">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<LoginRegister />} />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/create-challenge" 
                element={
                  <ProtectedRoute>
                    <CreateChallenge />
                  </ProtectedRoute>
                } 
              />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/challenge/:id" element={<ChallengeDetail />} />
              <Route 
                path="/wallet" 
                element={
                  <ProtectedRoute>
                    <Wallet />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/challenge/:id/proof" 
                element={
                  <ProtectedRoute>
                    <ProofDispute />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute adminOnly>
                    <AdminPanel />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1f2937',
                color: '#fff',
                border: '1px solid #374151'
              }
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;