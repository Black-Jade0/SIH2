import React, { useState } from 'react';
import { FaVolumeUp, FaFont, FaKeyboard } from 'react-icons/fa';

const AccessibilityTabs = () => {
  const [activeTab, setActiveTab] = useState('text');

  return (
    <div className="p-6 bg-gray-100 w-full box-border">
      <div className="mb-6">
        <ul className="flex space-x-4">
          <li
            className={`cursor-pointer ${activeTab === 'text' ? 'font-bold' : ''}`}
            onClick={() => setActiveTab('text')}
          >
            Text
          </li>
          <li
            className={`cursor-pointer ${activeTab === 'speech' ? 'font-bold' : ''}`}
            onClick={() => setActiveTab('speech')}
          >
            Speech
          </li>
          <li
            className={`cursor-pointer ${activeTab === 'input' ? 'font-bold' : ''}`}
            onClick={() => setActiveTab('input')}
          >
            Input
          </li>
        </ul>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        {activeTab === 'text' && (
          <div>
            <h2 className="text-xl font-bold mb-4"><FaFont className="inline mr-2" /> Text Settings</h2>
            <label className="flex items-center mb-4">
              <FaFont className="mr-3 text-xl" />
              <span>Large Font</span>
              <input type="checkbox" className="ml-auto" />
            </label>
          </div>
        )}
        {activeTab === 'speech' && (
          <div>
            <h2 className="text-xl font-bold mb-4"><FaVolumeUp className="inline mr-2" /> Speech Settings</h2>
            <label className="flex items-center mb-4">
              <FaVolumeUp className="mr-3 text-xl" />
              <span>Voice-to-Text</span>
              <input type="checkbox" className="ml-auto" />
            </label>
          </div>
        )}
        {activeTab === 'input' && (
          <div>
            <h2 className="text-xl font-bold mb-4"><FaKeyboard className="inline mr-2" /> Input Settings</h2>
            <label className="flex items-center mb-4">
              <FaKeyboard className="mr-3 text-xl" />
              <span>Alternative Input</span>
              <input type="checkbox" className="ml-auto" />
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccessibilityTabs;
