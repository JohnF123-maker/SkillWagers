import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
// TODO: Enable real payments in production
// import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import toast from 'react-hot-toast';
import BetaBadge from '../components/BetaBadge';
import FakeCurrencyDisplay from '../components/FakeCurrencyDisplay';
import {
  CreditCardIcon,
  BanknotesIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

// TODO: Enable real payments in production
// const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const Wallet = () => {
  const { userProfile, refreshProfile, claimDevFunds } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  // TODO: Enable real payments in production
  // const [showDeposit, setShowDeposit] = useState(false);
  // const [showWithdraw, setShowWithdraw] = useState(false);
  // const [depositAmount, setDepositAmount] = useState('');
  // const [withdrawAmount, setWithdrawAmount] = useState('');
  // const [processingPayment, setProcessingPayment] = useState(false);

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

  // TODO: Enable real payments in production
  // const handleDeposit = async (e) => {
  //   e.preventDefault();
  //   
  //   const amount = parseFloat(depositAmount);
  //   if (!amount || amount < 5 || amount > 1000) {
  //     toast.error('Deposit amount must be between $5 and $1000');
  //     return;
  //   }

  //   try {
  //     setProcessingPayment(true);
  //     
  //     // Create payment intent
  //     const response = await axios.post(`${API_BASE_URL}/payments/deposit`, {
  //       amount: amount
  //     });

  //     const stripe = await stripePromise;
  //     
  //     // Confirm payment
  //     const { error, paymentIntent } = await stripe.confirmCardPayment(response.data.clientSecret, {
  //       payment_method: {
  //         card: {
  //           // In a real app, you'd use Stripe Elements here
  //           // For demo purposes, we'll use test card
  //           number: '4242424242424242',
  //           exp_month: 12,
  //           exp_year: 2025,
  //           cvc: '123'
  //         }
  //       }
  //     });

  //     if (error) {
  //       throw new Error(error.message);
  //     }

  //     if (paymentIntent.status === 'succeeded') {
  //       // Confirm deposit on backend
  //       await axios.post(`${API_BASE_URL}/payments/confirm-deposit`, {
  //         paymentIntentId: paymentIntent.id
  //       });

  //       toast.success(`Successfully deposited $${amount.toFixed(2)}!`);
  //       setDepositAmount('');
  //       setShowDeposit(false);
  //       await refreshProfile();
  //       await fetchTransactions();
  //     }
  //   } catch (error) {
  //     console.error('Deposit error:', error);
  //     toast.error(error.response?.data?.message || 'Deposit failed');
  //   } finally {
  //     setProcessingPayment(false);
  //   }
  // };

  // Beta: Fake currency claiming functionality
  const handleClaimDevFunds = async () => {
    try {
      await claimDevFunds();
      toast.success('Successfully claimed $100 fake currency!');
      await refreshProfile();
    } catch (error) {
      toast.error(error.message || 'Failed to claim dev funds');
    }
  };

  // TODO: Enable real payments in production
  // const handleWithdraw = async (e) => {
  //   e.preventDefault();
  //   
  //   const amount = parseFloat(withdrawAmount);
  //   if (!amount || amount < 10) {
  //     toast.error('Minimum withdrawal amount is $10');
  //     return;
  //   }

  //   if (amount > (userProfile?.balance || 0)) {
  //     toast.error('Insufficient balance');
  //     return;
  //   }

  //   try {
  //     setProcessingPayment(true);
  //     
  //     await axios.post(`${API_BASE_URL}/payments/withdraw`, {
  //       amount: amount
  //     });

  //     toast.success(`Withdrawal request for $${amount.toFixed(2)} submitted successfully!`);
  //     toast.info('Withdrawals are processed within 1-3 business days');
  //     
  //     setWithdrawAmount('');
  //     setShowWithdraw(false);
  //     await refreshProfile();
  //     await fetchTransactions();
  //   } catch (error) {
  //     console.error('Withdrawal error:', error);
  //     toast.error(error.response?.data?.message || 'Withdrawal failed');
  //   } finally {
  //     setProcessingPayment(false);
  //   }
  // };

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
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <h1 className="text-3xl font-bold text-gray-900">My Wallet</h1>
              <BetaBadge size="md" />
            </div>
            <p className="text-gray-600 mb-6">Manage your Beta testing funds</p>
            
            <FakeCurrencyDisplay showLabel={false} className="text-5xl font-bold text-gray-900 mb-2" />
            <p className="text-gray-500 mb-8">Available Beta Balance (Fake Currency)</p>
            
            {/* Beta Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleClaimDevFunds}
                className="bg-brand text-white px-6 py-3 rounded-md hover:bg-brand transition-colors flex items-center justify-center space-x-2"
                disabled={userProfile?.hasClaimed}
              >
                <BanknotesIcon className="h-5 w-5" />
                <span>{userProfile?.hasClaimed ? 'Already Claimed' : 'Claim $100 Dev Funds'}</span>
              </button>
              
              {/* TODO: Enable real payments in production */}
              <button
                disabled
                className="border border-gray-300 text-gray-400 px-6 py-3 rounded-md cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <ArrowDownIcon className="h-5 w-5" />
                <span>Real Deposits (Coming Soon)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Beta Notice */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-8">
          <div className="flex items-center space-x-3">
            <ExclamationTriangleIcon className="h-6 w-6 text-primaryAccent flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-purple-800 mb-2">Beta Testing Mode</h3>
              <p className="text-purple-700 text-sm">
                This is a Beta testing environment using fake currency. All transactions are simulated for testing purposes only. 
                Real money deposits and withdrawals will be available in the production version.
              </p>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Transaction History</h2>
          
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse flex items-center p-4 bg-gray-100 rounded-lg">
                  <div className="h-8 w-8 bg-gray-300 rounded-full mr-4"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/3"></div>
                  </div>
                  <div className="h-4 bg-gray-300 rounded w-20"></div>
                </div>
              ))}
            </div>
          ) : transactions.length > 0 ? (
            <div className="space-y-3">
              {transactions.map((transaction, index) => (
                <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border">
                  <div className="flex-shrink-0 mr-4">
                    {getTransactionIcon(transaction.type, transaction.status)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-gray-900 capitalize">
                        {transaction.type.replace('_', ' ')}
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
                        {transaction.status}
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        FAKE
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(transaction.createdAt)}
                    </div>
                  </div>
                  
                  <div className={`text-lg font-semibold ${getTransactionColor(transaction.type)}`}>
                    {transaction.type === 'deposit' || transaction.type === 'challenge_win' || transaction.type === 'refund' || transaction.type === 'beta_allocation' ? '+' : '-'}
                    ${transaction.amount.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <CreditCardIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">No Transactions Yet</h3>
              <p className="text-gray-500">Your Beta transaction history will appear here</p>
              <p className="text-sm text-primaryAccent mt-2">Try claiming your $100 dev funds to get started!</p>
            </div>
          )}
        </div>

        {/* TODO: Enable real payments in production */}
        {/* Deposit and Withdraw Modals will be implemented here */}
      </div>
    </div>
  );
};

export default Wallet;
