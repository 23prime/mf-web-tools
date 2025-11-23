import { useState, useEffect } from 'react';

export default function Popup() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    chrome.storage.local.get(['count'], (result) => {
      if (typeof result.count === 'number') {
        setCount(result.count);
      }
    });
  }, []);

  const handleIncrement = () => {
    const newCount = count + 1;
    setCount(newCount);
    chrome.storage.local.set({ count: newCount });
  };

  const handleReset = () => {
    setCount(0);
    chrome.storage.local.set({ count: 0 });
  };

  return (
    <div className="w-80 p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        MoneyForward Web Tools
      </h1>

      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <p className="text-sm text-gray-600 mb-2">Counter Example</p>
        <div className="text-4xl font-bold text-indigo-600 text-center mb-4">
          {count}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleIncrement}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded transition-colors"
          >
            Increment
          </button>
          <button
            onClick={handleReset}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="text-xs text-gray-500 text-center">
        Built with React + TypeScript + Tailwind CSS
      </div>
    </div>
  );
}
