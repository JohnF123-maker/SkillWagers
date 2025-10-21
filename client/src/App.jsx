import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './components/AuthContext';
import Navbar from './components/Navbar';
import DisclaimerBanner from './components/DisclaimerBanner';
import AppFooter from './components/AppFooter';
import AuthGuard from './components/AuthGuard';
import BetaModel from './components/BetaModel';
import LandingPage from './pages/LandingPage';
import Wagers from './pages/Wagers';
import Wagering from './pages/Wagering';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import Statistics from './pages/Statistics';
import Settings from './pages/Settings';
import CreateChallenge from './pages/CreateChallenge';
import Marketplace from './pages/Marketplace';
import ChallengeDetail from './pages/ChallengeDetail';
import Wallet from './pages/Wallet';
import ProofDispute from './pages/ProofDispute';
import AdminPanel from './pages/AdminPanel';
import DataCollection from './pages/DataCollection';
import BetaTestingTerms from './pages/BetaTestingTerms';
import TermsAndConditions from './pages/TermsAndConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ResponsibleGamingPolicy from './pages/ResponsibleGamingPolicy';
import TermsOfUse from './pages/TermsOfUse';
import Contact from './pages/Contact';
import AdminReview from './pages/AdminReview';

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
          <DisclaimerBanner />
          <Navbar />
          <BetaModel />
          <main className="pt-24">
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
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route 
                path="/profile" 
                element={
                  <AuthGuard>
                    <Profile />
                  </AuthGuard>
                } 
              />
              <Route 
                path="/statistics" 
                element={
                  <AuthGuard>
                    <Statistics />
                  </AuthGuard>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <AuthGuard>
                    <Settings />
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
              <Route 
                path="/admin/review" 
                element={
                  <AuthGuard adminOnly>
                    <AdminReview />
                  </AuthGuard>
                } 
              />
              
              {/* Legal Pages */}
              <Route path="/legal/data-collection" element={<DataCollection />} />
              <Route path="/legal/beta-testing-terms" element={<BetaTestingTerms />} />
              <Route path="/legal/terms-and-conditions" element={<TermsAndConditions />} />
              <Route path="/legal/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/legal/responsible-gaming" element={<ResponsibleGamingPolicy />} />
              <Route path="/legal/terms-of-use" element={<TermsOfUse />} />
              
              {/* Contact Page */}
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </main>
          <AppFooter />
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
