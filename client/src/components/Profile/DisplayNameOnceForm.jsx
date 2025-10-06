import React, { useState, useEffect } from 'react';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { PencilIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const DisplayNameOnceForm = ({ currentUser, userProfile, refreshProfile }) => {
  const [displayName, setDisplayName] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.displayName || currentUser?.displayName || '');
      setIsLocked(userProfile.displayNameLocked || false);
    }
  }, [userProfile, currentUser]);

  const handleSave = async () => {
    if (!displayName.trim()) {
      toast.error('Display name cannot be empty');
      return;
    }

    setLoading(true);
    try {
      // Update Auth profile
      await updateProfile(currentUser, { displayName: displayName.trim() });
      
      // Update Firestore user doc
      const userDocRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userDocRef, {
        displayName: displayName.trim(),
        displayNameLocked: true
      });

      await refreshProfile();
      setIsLocked(true);
      setEditing(false);
      toast.success('Display name updated successfully');
    } catch (error) {
      console.error('Error updating display name:', error);
      toast.error('Failed to update display name');
    } finally {
      setLoading(false);
    }
  };

  if (isLocked && !editing) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-400">Display Name</h3>
            <p className="text-white">{displayName}</p>
            <p className="text-xs text-gray-500 mt-1">Display name can be changed once</p>
          </div>
          <span className="text-xs text-gray-500 bg-gray-700 px-2 py-1 rounded">Locked</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-400">Display Name</h3>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="text-orange-500 hover:text-orange-400 p-1"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
        )}
      </div>
      
      {editing ? (
        <div className="space-y-3">
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400"
            placeholder="Enter display name"
            maxLength={50}
          />
          <p className="text-xs text-yellow-400">
            ⚠️ Display name can only be changed once
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={loading}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={() => {
                setEditing(false);
                setDisplayName(userProfile?.displayName || currentUser?.displayName || '');
              }}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="text-white">{displayName || 'No display name set'}</p>
      )}
    </div>
  );
};

export default DisplayNameOnceForm;