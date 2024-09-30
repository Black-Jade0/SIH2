import React from 'react';
import { FaVolumeUp, FaFont, FaKeyboard, FaSave } from 'react-icons/fa';

const AccessibilitySidebar = () => {
  return (
    <div className="flex w-full">
      <aside className="w-full box-border bg-gray-800 text-white p-6 h-screen fixed top-0 left-0">
        <h2 className="text-2xl font-bold mb-6">Accessibility Settings</h2>
        <ul>
          <li className="mb-4 flex items-center">
            <FaVolumeUp className="mr-3 text-2xl" />
            <span>Voice-to-Text</span>
            <input type="checkbox" className="ml-auto" />
          </li>
          <li className="mb-4 flex items-center">
            <FaFont className="mr-3 text-2xl" />
            <span>Large Font</span>
            <input type="checkbox" className="ml-auto" />
          </li>
          <li className="mb-4 flex items-center">
            <FaKeyboard className="mr-3 text-2xl" />
            <span>Alternative Input</span>
            <input type="checkbox" className="ml-auto" />
          </li>
          <li className="flex items-center">
            <FaSave className="mr-3 text-2xl" />
            <span>Save Settings</span>
            <button className="ml-auto bg-blue-600 text-white px-4 py-2 rounded">Save</button>
          </li>
        </ul>
      </aside>
      <main className="ml-64 p-8">
        {/* Main content here */}
      </main>
    </div>
  );
};

export default AccessibilitySidebar;
