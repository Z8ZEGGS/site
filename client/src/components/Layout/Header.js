import React from 'react';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';

const Header = ({ onMenuClick }) => {
  const { user } = useAuth();

  return (
    <header className="bg-gray-800 border-b border-gray-700 h-16 flex items-center justify-between px-4">
      <div className="flex items-center">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-gray-400 hover:text-white p-2"
        >
          <Bars3Icon className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold text-white ml-2 lg:ml-0">
          Personal Frequency Studio
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        {user && (
          <div className="hidden md:flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-white">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-sm text-gray-300">{user.name}</span>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;