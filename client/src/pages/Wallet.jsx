import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  CreditCardIcon,
  BanknotesIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const Wallet = () => {
  const { userProfile, refreshProfile } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [processingPayment, setProcessingPayment] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchTransactions();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/payments/transactions?limit=20`);
      setTransactions(response.data.transactions || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Failed to load transaction history');
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    
    const amount = parseFloat(depositAmount);
    if (!amount || amount < 5 || amount > 1000) {
      toast.error('Deposit amount must be between $5 and $1000');
      return;
    }

    try {
      setProcessingPayment(true);
      
      // Create payment intent
      const response = await axios.post(`${API_BASE_URL}/payments/deposit`, {
        amount: amount
      });

      const stripe = await stripePromise;
      
      // Confirm payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(response.data.clientSecret, {
        payment_method: {
          card: {
            // In a real app, you'd use Stripe Elements here
            // For demo purposes, we'll use test card
            number: '4242424242424242',
            exp_month: 12,
            exp_year: 2025,
            cvc: '123'
          }
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (paymentIntent.status === 'succeeded') {
        // Confirm deposit on backend
        await axios.post(`${API_BASE_URL}/payments/confirm-deposit`, {
          paymentIntentId: paymentIntent.id
        });

        toast.success(`Successfully deposited $${amount.toFixed(2)}!`);
        setDepositAmount('');
        setShowDeposit(false);
        await refreshProfile();
        await fetchTransactions();
      }
    } catch (error) {
      console.error('Deposit error:', error);
      toast.error(error.response?.data?.message || 'Deposit failed');
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount < 10) {
      toast.error('Minimum withdrawal amount is $10');
      return;
    }

    if (amount > (userProfile?.balance || 0)) {
      toast.error('Insufficient balance');
      return;
    }

    try {
      setProcessingPayment(true);
      
      await axios.post(`${API_BASE_URL}/payments/withdraw`, {
        amount: amount
      });

      toast.success(`Withdrawal request for $${amount.toFixed(2)} submitted successfully!`);
      toast.info('Withdrawals are processed within 1-3 business days');
      
      setWithdrawAmount('');
      setShowWithdraw(false);
      await refreshProfile();
      await fetchTransactions();
    } catch (error) {
      console.error('Withdrawal error:', error);
      toast.error(error.response?.data?.message || 'Withdrawal failed');
    } finally {
      setProcessingPayment(false);
    }
  };

  const getTransactionIcon = (type, status) => {
    if (type === 'deposit') return <ArrowDownIcon className="h-5 w-5 text-success-400" />;
    if (type === 'withdrawal') return <ArrowUpIcon className="h-5 w-5 text-accent-400" />;
    if (type === 'challenge_win') return <CheckCircleIcon className="h-5 w-5 text-success-400" />;
    if (type === 'refund') return <BanknotesIcon className="h-5 w-5 text-primary-400" />;
    return <CreditCardIcon className="h-5 w-5 text-gray-400" />;
  };

  const getTransactionColor = (type) => {
    if (type === 'deposit' || type === 'challenge_win' || type === 'refund') return 'text-success-400';
    if (type === 'withdrawal') return 'text-accent-400';
    return 'text-gray-300';
  };

  const getStatusBadge = (status) => {
    const badges = {
      'completed': 'status-completed',
      'pending': 'status-pending',
      'failed': 'status-disputed'
    };
    return badges[status] || 'status-pending';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Wallet Header */}
        <div className="card-gradient mb-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold gaming-text mb-2">My Wallet</h1>
            <p className="text-gray-300 mb-6">Manage your funds and view transaction history</p>
            
            <div className="text-5xl font-bold text-white mb-2">
              ${userProfile?.balance?.toFixed(2) || '0.00'}
            </div>
            <p className="text-gray-400 mb-8">Available Balance</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setShowDeposit(true)}
                className="btn-primary flex items-center justify-center space-x-2"
              >
                <ArrowDownIcon className="h-5 w-5" />
                <span>Deposit Funds</span>
              </button>
              
              <button
                onClick={() => setShowWithdraw(true)}
                className="btn-outline flex items-center justify-center space-x-2"
                disabled={!userProfile?.balance || userProfile.balance < 10}
              >
                <ArrowUpIcon className="h-5 w-5" />
                <span>Withdraw Funds</span>
              </button>
            </div>
          </div>
        </div>

        {/* Balance Requirements Notice */}
        {!userProfile?.ageVerified && (
          <div className="bg-accent-500 bg-opacity-20 border border-accent-500 rounded-lg p-4 mb-8">
            <div className="flex">
              <ExclamationTriangleIcon className="h-5 w-5 text-accent-400 flex-shrink-0 mt-0.5" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-accent-400">Age Verification Required</h3>
                <div className="mt-2 text-sm text-accent-300">
                  <p>
                    You must verify your age (18+) before you can deposit funds or participate in challenges.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Transaction History */}
        <div className="card">
          <h2 className="text-xl font-bold text-white mb-6">Transaction History</h2>
          
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse flex items-center p-4 bg-dark-700 rounded-lg">
                  <div className="h-8 w-8 bg-gray-600 rounded-full mr-4"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-600 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-600 rounded w-1/3"></div>
                  </div>
                  <div className="h-4 bg-gray-600 rounded w-20"></div>
                </div>
              ))}
            </div>
          ) : transactions.length > 0 ? (
            <div className="space-y-3">
              {transactions.map((transaction, index) => (
                <div key={index} className="flex items-center p-4 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors">
                  <div className="flex-shrink-0 mr-4">
                    {getTransactionIcon(transaction.type, transaction.status)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-white capitalize">
                        {transaction.type.replace('_', ' ')}
                      </span>
                      <span className={`status-badge ${getStatusBadge(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400">
                      {formatDate(transaction.createdAt)}
                    </div>
                  </div>
                  
                  <div className={`text-lg font-semibold ${getTransactionColor(transaction.type)}`}>
                    {transaction.type === 'deposit' || transaction.type === 'challenge_win' || transaction.type === 'refund' ? '+' : '-'}
                    ${transaction.amount.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <CreditCardIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-400 mb-2">No Transactions Yet</h3>
              <p className="text-gray-500">Your transaction history will appear here</p>
            </div>
          )}
        </div>

        {/* Deposit Modal */}
        {showDeposit && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="card-gradient max-w-md w-full m-4">
              <h3 className="text-xl font-bold text-white mb-4">Deposit Funds</h3>
              
              <form onSubmit={handleDeposit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Amount ($5 - $1000)
                  </label>
                  <input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="input-field"
                    placeholder="0.00"
                    min="5"
                    max="1000"
                    step="0.01"
                    required
                    disabled={!userProfile?.ageVerified}
                  />
                  {!userProfile?.ageVerified && (
                    <p className="text-xs text-accent-400 mt-1">
                      Age verification required to deposit funds
                    </p>
                  )}
                </div>
                
                <div className="bg-dark-700 p-3 rounded-lg mb-4">
                  <p className="text-xs text-gray-400 mb-2">Payment Method:</p>
                  <div className="flex items-center space-x-2">
                    <CreditCardIcon className="h-5 w-5 text-primary-400" />
                    <span className="text-sm text-white">Credit/Debit Card (Test Mode)</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Test card: 4242 4242 4242 4242
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowDeposit(false)}
                    className="btn-outline flex-1"
                    disabled={processingPayment}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary flex-1"
                    disabled={processingPayment || !userProfile?.ageVerified}
                  >
                    {processingPayment ? 'Processing...' : 'Deposit'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Withdraw Modal */}
        {showWithdraw && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="card-gradient max-w-md w-full m-4">
              <h3 className="text-xl font-bold text-white mb-4">Withdraw Funds</h3>
              
              <form onSubmit={handleWithdraw}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Amount (Min: $10)
                  </label>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="input-field"
                    placeholder="0.00"
                    min="10"
                    max={userProfile?.balance || 0}
                    step="0.01"
                    required
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Available: ${userProfile?.balance?.toFixed(2) || '0.00'}
                  </p>
                </div>
                
                <div className="bg-dark-700 p-3 rounded-lg mb-4">
                  <div className="flex items-center space-x-2 text-accent-400 mb-2">
                    <ClockIcon className="h-4 w-4" />
                    <span className="text-sm font-medium">Processing Time</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Withdrawals are processed within 1-3 business days to your original payment method.
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowWithdraw(false)}
                    className="btn-outline flex-1"
                    disabled={processingPayment}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary flex-1"
                    disabled={processingPayment}
                  >
                    {processingPayment ? 'Processing...' : 'Withdraw'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wallet;