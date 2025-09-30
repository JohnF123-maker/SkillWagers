import React from 'react';

const AdminPanel = () => {
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card-gradient">
          <h1 className="text-2xl font-bold gaming-text mb-6">Admin Panel</h1>
          <p className="text-gray-300 mb-4">
            This admin-only page will contain platform statistics, dispute resolution tools, 
            user management, and financial controls.
          </p>
          <div className="bg-dark-700 p-4 rounded-lg">
            <p className="text-accent-400 text-sm">
              🚧 Coming Soon - This feature is being implemented
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;