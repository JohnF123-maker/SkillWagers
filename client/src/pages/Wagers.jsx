import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../components/AuthContext";
import { db } from "../firebase";
import { collection, query, where, orderBy, onSnapshot, limit } from "firebase/firestore";

export default function Wagers() {
  const { currentUser, userProfile } = useAuth();
  const [activeChallenges, setActiveChallenges] = useState([]);
  const [recentChallenges, setRecentChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch real user challenges from Firestore
  useEffect(() => {
    if (!currentUser) return;

    // Query for active challenges where user is participant
    const activeQuery = query(
      collection(db, 'challenges'),
      where('participants', 'array-contains', currentUser.uid),
      where('status', 'in', ['open', 'matched', 'in-progress']),
      orderBy('createdAt', 'desc')
    );

    // Query for recent completed challenges
    const recentQuery = query(
      collection(db, 'challenges'),
      where('participants', 'array-contains', currentUser.uid),
      where('status', 'in', ['completed', 'settled']),
      orderBy('completedAt', 'desc'),
      limit(10)
    );

    const activeUnsubscribe = onSnapshot(activeQuery, (snapshot) => {
      const challenges = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setActiveChallenges(challenges);
    });

    const recentUnsubscribe = onSnapshot(recentQuery, (snapshot) => {
      const challenges = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRecentChallenges(challenges);
      setLoading(false);
    });

    return () => {
      activeUnsubscribe();
      recentUnsubscribe();
    };
  }, [currentUser]);

  // Calculate stats from userProfile and challenges
  const stats = [
    { 
      label: "Coin Balance", 
      value: userProfile?.betaBalance || 0, 
      hint: "Total available coins" 
    },
    { 
      label: "Active Wagers", 
      value: activeChallenges.length, 
      hint: "Currently in progress" 
    },
    { 
      label: "Wins", 
      value: userProfile?.stats?.wins || 0, 
      hint: "Completed & verified wins" 
    },
    { 
      label: "Win Rate", 
      value: userProfile?.stats?.totalChallenges > 0 
        ? `${Math.round((userProfile.stats.wins / userProfile.stats.totalChallenges) * 100)}%`
        : "0%", 
      hint: "Wins / Completed" 
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primaryAccent mx-auto mb-4"></div>
          <p className="text-gray-300">Loading your wagers...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-300">Please sign in to view your wagers.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header + primary action */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold leading-tight">My Wagers</h1>
            <p className="text-gray-300 mt-1">
              Track your active challenges, stats, and recent history.
            </p>
          </div>

          <Link
            to="/create-challenge"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2 font-medium text-white transition-colors hover:bg-brand focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-gray-900"
            aria-label="Create a new challenge"
          >
            <PlusIcon className="h-5 w-5" aria-hidden="true" />
            <span>Create Challenge</span>
          </Link>
        </div>

        {/* Home-style summary / metrics */}
        <section aria-labelledby="summary-title" className="mb-10">
          <h2 id="summary-title" className="sr-only">Summary</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-gray-800 bg-gray-850/50 bg-gray-800 p-4 shadow-sm"
              >
                <div className="text-sm text-gray-400">{s.label}</div>
                <div className="mt-1 text-2xl font-bold text-white">{s.value}</div>
                <div className="mt-1 text-xs text-gray-400">{s.hint}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Active Challenges */}
        <section aria-labelledby="active-title" className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <h2 id="active-title" className="text-xl font-semibold text-white">
              Active Challenges
            </h2>
            {/* Optional filters for your data model can be added here later */}
          </div>

          {activeChallenges.length === 0 ? (
            <div className="rounded-lg border border-gray-800 bg-gray-800 p-6 text-gray-300">
              You have no active challenges right now.
            </div>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeChallenges.map((challenge) => (
                <li key={challenge.id} className="rounded-lg border border-gray-800 bg-gray-800 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold text-white">{challenge.title}</div>
                      <div className="text-sm text-gray-400">{challenge.game} · {challenge.skill}</div>
                    </div>
                    <span className="rounded-md bg-gray-700 px-2 py-1 text-xs text-gray-200">
                      {challenge.stake} coins
                    </span>
                  </div>
                  <div className="mt-3 text-sm text-gray-300">
                    {challenge.description || "No description provided."}
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <Link
                      to={`/challenge/${challenge.id}`}
                      className="inline-flex items-center rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-900 transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900"
                    >
                      View
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Recent History */}
        <section aria-labelledby="history-title">
          <h2 id="history-title" className="text-xl font-semibold text-white mb-3">
            Recent History
          </h2>

          {recentChallenges.length === 0 ? (
            <div className="rounded-lg border border-gray-800 bg-gray-800 p-6 text-gray-300">
              No recent completed challenges.
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border border-gray-800">
              <table className="min-w-full divide-y divide-gray-800 bg-gray-800">
                <thead className="bg-gray-850/50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Challenge</th>
                    <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Game</th>
                    <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Stake</th>
                    <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Result</th>
                    <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {recentChallenges.map((challenge) => (
                    <tr key={challenge.id} className="hover:bg-gray-750/40">
                      <td className="px-4 py-3 text-sm text-white">{challenge.title}</td>
                      <td className="px-4 py-3 text-sm text-gray-300">{challenge.game}</td>
                      <td className="px-4 py-3 text-sm text-gray-300">{challenge.stake} coins</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`rounded-md px-2 py-1 text-xs ${
                          challenge.winnerId === currentUser?.uid
                            ? "bg-green-600/20 text-green-300"
                            : challenge.status === "completed"
                            ? "bg-red-600/20 text-red-300"
                            : "bg-gray-600/20 text-gray-300"
                        }`}>
                          {challenge.winnerId === currentUser?.uid ? "Win" : 
                           challenge.status === "completed" ? "Loss" : 
                           challenge.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-300">
                        {challenge.completedAt ? new Date(challenge.completedAt.toDate()).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
