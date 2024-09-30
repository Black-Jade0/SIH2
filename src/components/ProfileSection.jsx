// src/components/ProfileSection.jsx
import React from 'react';

const ProfileSection = () => {
  return (
    <div className="flex flex-col items-center py-6 border-b border-gray-700">
      <img 
        src="https://via.placeholder.com/80" 
        alt="Profile" 
        className="rounded-full w-20 h-20 shadow-lg hover:scale-105 transition-transform duration-300 ease-out"
      />
      <h2 className="text-white mt-4 text-lg">FutureFramework</h2>
      <button className="text-sm text-gray-400 hover:text-gray-100 mt-2">
        View Profile
      </button>
    </div>
  );
};

export default ProfileSection;
