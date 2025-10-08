import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './components/AuthContext';
import Navbar from './components/Navbar';
import AuthGuard from './components/AuthGuard';
import BetaModel from './components/BetaModel';
import LandingPage from './pages/LandingPage';
import Wagers from './pages/Wagers';
import Wagering from './pages/Wagering';
import Login from './pages/Login';
import Signup from './pages/Signup';
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
      <Router 
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <div className="min-h-screen bg-dark-900">
          <Navbar />
          <BetaModel />
          <main className="pt-16">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/wagering" element={<Wagering />} />
              <Route 
                path="/wagers" 
                element={
                  <AuthGuard>
                    <Wagers />
                  </AuthGuard>
                } 
              />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/auth" element={<LoginRegister />} />
              <Route 
                path="/profile" 
                element={
                  <AuthGuard>
                    <Profile />
                  </AuthGuard>
                } 
              />
              <Route 
                path="/create-challenge" 
                element={
                  <AuthGuard>
                    <CreateChallenge />
                  </AuthGuard>
                } 
              />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/challenge/:id" element={<ChallengeDetail />} />
              <Route 
                path="/wallet" 
                element={
                  <AuthGuard>
                    <Wallet />
                  </AuthGuard>
                } 
              />
              <Route 
                path="/challenge/:id/proof" 
                element={
                  <AuthGuard>
                    <ProofDispute />
                  </AuthGuard>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <AuthGuard adminOnly>
                    <AdminPanel />
                  </AuthGuard>
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
