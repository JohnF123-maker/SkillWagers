import React, { useState, useRef } from 'react';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase';
import { PhotoIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const ProfilePictureUploader = ({ currentUser, userProfile, refreshProfile }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('File size must be less than 5MB');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);

    // Upload file
    uploadProfilePicture(file);
  };

  const uploadProfilePicture = async (file) => {
    if (!currentUser?.uid) {
      toast.error('User not authenticated');
      return;
    }

    setUploading(true);
    try {
      // Upload to Firebase Storage
      const storageRef = ref(storage, `profilePictures/${currentUser.uid}.jpg`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Update Auth profile
      await updateProfile(currentUser, { photoURL: downloadURL });

      // Update Firestore user doc
      const userDocRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userDocRef, {
        photoURL: downloadURL
      });

      await refreshProfile();
      toast.success('Profile picture updated successfully');
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      toast.error('Failed to upload profile picture');
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const currentPhotoURL = preview || userProfile?.photoURL || currentUser?.photoURL;

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <h3 className="text-sm font-medium text-gray-400 mb-3">Profile Picture</h3>
      
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-gray-700 overflow-hidden flex items-center justify-center">
            {currentPhotoURL ? (
              <img 
                src={currentPhotoURL} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <PhotoIcon className="h-8 w-8 text-gray-400" />
            )}
          </div>
          {uploading && (
            <div className="absolute inset-0 rounded-full bg-black bg-opacity-50 flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primaryAccent"></div>
            </div>
          )}
        </div>

        <div className="flex-1">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="bg-primaryAccent text-white px-4 py-2 rounded-lg hover:bg-secondary-600 disabled:opacity-50 transition-colors"
          >
            {uploading ? 'Uploading...' : 'Change Picture'}
          </button>
          <p className="text-xs text-gray-500 mt-1">
            JPG, PNG or GIF. Max size 5MB.
          </p>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

export default ProfilePictureUploader;
