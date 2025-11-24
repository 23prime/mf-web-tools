export default function Popup() {
  const handleOpenTransactionPage = () => {
    chrome.tabs.create({ url: 'https://moneyforward.com/cf' });
  };

  return (
    <div className="w-80 p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        MoneyForward Web Tools
      </h1>

      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <p className="text-sm text-gray-600 mb-3">入出金ページを開く</p>
        <button
          onClick={handleOpenTransactionPage}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded transition-colors flex items-center justify-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
          MoneyForward 入出金
        </button>
      </div>

      <div className="text-xs text-gray-500 text-center">
        Built with React + TypeScript + Tailwind CSS
      </div>
    </div>
  );
}
