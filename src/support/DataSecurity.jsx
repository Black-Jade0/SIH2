import React from 'react';

const DataSecurity = () => {
  return (
    <div className="p-6 w-full box-border bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Data Security Settings</h2>
      <form>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label htmlFor="encryption" className="block text-gray-700">Encryption</label>
            <select
              id="encryption"
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            >
              <option>Enabled</option>
              <option>Disabled</option>
            </select>
          </div>
          <button
            type="submit"
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default DataSecurity;
