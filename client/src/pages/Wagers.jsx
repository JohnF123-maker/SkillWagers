import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  TrophyIcon,
  EyeIcon,
  FireIcon,
  PlusIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { useAuth } from '../components/AuthContext';
import { db } from '../firebase';

function formatDate(tsOrDate) {
  if (!tsOrDate) return 'N/A';
  const d = tsOrDate?.toDate ? tsOrDate.toDate() : new Date(tsOrDate);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
function formatCurrency(amount) {
  const n = Number.isFinite(amount) ? amount : 0;
  return `${n} SIM`;
}

function StatusIcon({ status }) {
  switch (status) {
    case 'open':
      return <ClockIcon className="h-5 w-5 text-blue-500" />;
    case 'accepted':
    case 'pending_proof':
    case 'submitted':
      return <EyeIcon className="h-5 w-5 text-yellow-500" />;
    case 'completed':
    case 'settled':
    case 'won':
      return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
    case 'lost':
      return <XCircleIcon className="h-5 w-5 text-red-500" />;
    case 'disputed':
      return <FireIcon className="h-5 w-5 text-orange-500" />;
    case 'cancelled':
      return <XCircleIcon className="h-5 w-5 text-gray-500" />;
    default:
      return <ClockIcon className="h-5 w-5 text-gray-500" />;
  }
}

function statusBadgeColor(status) {
  const map = {
    open: 'bg-blue-100 text-blue-800',
    accepted: 'bg-orange-100 text-orange-800',
    pending_proof: 'bg-yellow-100 text-yellow-800',
    submitted: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    settled: 'bg-green-100 text-green-800',
    won: 'bg-green-100 text-green-800',
    lost: 'bg-red-100 text-red-800',
    disputed: 'bg-red-100 text-red-800',
    cancelled: 'bg-gray-100 text-gray-800',
  };
  return map[status] || 'bg-gray-100 text-gray-800';
}

export default function Wagers() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'completed'
  const [items, setItems] = useState({ active: [], completed: [] });

  useEffect(() => {
    if (!currentUser) return;
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);

        const ref = collection(db, 'challenges');
        // Fetch as creator
        const [asCreatorSnap, asOpponentSnap] = await Promise.all([
          getDocs(query(ref, where('creatorUid', '==', currentUser.uid), orderBy('createdAt', 'desc'))),
          getDocs(query(ref, where('opponentUid', '==', currentUser.uid), orderBy('createdAt', 'desc'))),
        ]);

        // Merge unique docs by id
        const map = new Map();
        const push = (snap) => {
          snap.forEach((doc) => {
            const data = doc.data();
            map.set(doc.id, {
              id: doc.id,
              ...data,
              createdAt: data.createdAt?.toDate?.() ?? new Date(),
            });
          });
        };
        push(asCreatorSnap);
        push(asOpponentSnap);

        const list = Array.from(map.values());
        const active = list.filter((c) =>
          ['open', 'accepted', 'pending_proof', 'submitted', 'disputed'].includes(c.status)
        );
        const completed = list.filter((c) =>
          ['completed', 'settled', 'won', 'lost', 'cancelled'].includes(c.status)
        );

        // Keep newest first
        active.sort((a, b) => b.createdAt - a.createdAt);
        completed.sort((a, b) => b.createdAt - a.createdAt);

        if (!cancelled) {
          setItems({ active, completed });
        }
      } catch (err) {
        console.error('Error loading user challenges:', err);
        if (!cancelled) setItems({ active: [], completed: [] });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [currentUser]);

  const tabCounts = useMemo(
    () => ({
      active: items.active.length,
      completed: items.completed.length,
    }),
    [items]
  );

  if (!currentUser) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <TrophyIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Please log in</h3>
          <p className="text-gray-600">You need to be logged in to view your challenges.</p>
          <Link
            to="/login"
            className="mt-6 inline-flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors"
          >
            Sign In
          </Link>
        </div>
      </main>
    );
  }

  const data = activeTab === 'active' ? items.active : items.completed;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Challenges</h1>
              <p className="text-gray-600 mt-1">Track your created and accepted challenges.</p>
            </div>
            <Link
              to="/create-challenge"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Create Challenge
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('active')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'active'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Active ({tabCounts.active})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'completed'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Completed ({tabCounts.completed})
            </button>
          </nav>
        </div>

        {/* List */}
        <div className="mt-6 space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading your challenges…</p>
            </div>
          ) : data.length === 0 ? (
            <div className="text-center py-12">
              <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No challenges found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {activeTab === 'active'
                  ? "You don't have any active challenges. Create one to get started!"
                  : "You haven't completed any challenges yet."}
              </p>
              {activeTab === 'active' && (
                <div className="mt-6">
                  <Link
                    to="/create-challenge"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Create Your First Challenge
                  </Link>
                </div>
              )}
            </div>
          ) : (
            data.map((c) => (
              <Link
                key={c.id}
                to={`/challenge/${c.id}`}
                className="block bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{c.title || 'Untitled Challenge'}</h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${statusBadgeColor(c.status)}`}
                      >
                        {c.status}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{c.description}</p>
                  </div>
                  <StatusIcon status={c.status} />
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <CurrencyDollarIcon className="h-4 w-4" />
                      <span className="font-medium">
                        {formatCurrency(c.wager ?? c.wagerAmount ?? 0)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ClockIcon className="h-4 w-4" />
                      <span>Created {formatDate(c.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Beta Notice */}
        <div className="mt-8 bg-orange-50 border border-orange-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-orange-800 mb-2">Beta Testing Mode</h3>
          <p className="text-sm text-orange-700">
            All challenges use fake SIM currency during beta testing. No real money transactions occur.
          </p>
        </div>
      </div>
    </div>
  );
}