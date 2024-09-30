import React, { useState } from 'react';
import { FaVolumeUp, FaFont, FaKeyboard } from 'react-icons/fa';

const AccessibilityAccordion = () => {
  const [openPanel, setOpenPanel] = useState(null);

  const togglePanel = (panel) => {
    setOpenPanel(openPanel === panel ? null : panel);
  };

  return (
    <div className="p-6 bg-gray-100 w-full box-border">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="mb-4">
          <button
            className="w-full text-left flex items-center justify-between p-4 bg-gray-200 rounded-lg"
            onClick={() => togglePanel('text')}
          >
            <span className="flex items-center"><FaFont className="mr-3 text-xl" /> Text Settings</span>
            <span>{openPanel === 'text' ? '-' : '+'}</span>
          </button>
          {openPanel === 'text' && (
            <div className="p-4">
              <label className="flex items-center mb-4">
                <FaFont className="mr-3 text-xl" />
                <span>Large Font</span>
                <input type="checkbox" className="ml-auto" />
              </label>
            </div>
          )}
        </div>

        <div className="mb-4">
          <button
            className="w-full text-left flex items-center justify-between p-4 bg-gray-200 rounded-lg"
            onClick={() => togglePanel('speech')}
          >
            <span className="flex items-center"><FaVolumeUp className="mr-3 text-xl" /> Speech Settings</span>
            <span>{openPanel === 'speech' ? '-' : '+'}</span>
          </button>
          {openPanel === 'speech' && (
            <div className="p-4">
              <label className="flex items-center mb-4">
                <FaVolumeUp className="mr-3 text-xl" />
                <span>Voice-to-Text</span>
                <input type="checkbox" className="ml-auto" />
              </label>
            </div>
          )}
        </div>

        <div>
          <button
            className="w-full text-left flex items-center justify-between p-4 bg-gray-200 rounded-lg"
            onClick={() => togglePanel('input')}
          >
            <span className="flex items-center"><FaKeyboard className="mr-3 text-xl" /> Input Settings</span>
            <span>{openPanel === 'input' ? '-' : '+'}</span>
          </button>
          {openPanel === 'input' && (
            <div className="p-4">
              <label className="flex items-center mb-4">
                <FaKeyboard className="mr-3 text-xl" />
                <span>Alternative Input</span>
                <input type="checkbox" className="ml-auto" />
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccessibilityAccordion;
