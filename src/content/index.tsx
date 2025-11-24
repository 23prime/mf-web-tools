import React from 'react';
import ReactDOM from 'react-dom/client';
import '../styles/content.css';
import { scrapeTransactionTable } from '@/utils/scraper';
import { transactionsToCSV } from '@/utils/csv';
import { downloadCSV, generateFilename } from '@/utils/download';

// Check if current path is exactly /cf
function isTransactionPage(): boolean {
  return window.location.pathname === '/cf';
}

// Content Script component
function ContentWidget() {
  const [isVisible, setIsVisible] = React.useState(true);
  const [message, setMessage] = React.useState('');
  const [isOnTransactionPage, setIsOnTransactionPage] =
    React.useState(isTransactionPage());

  // Monitor URL changes for SPA navigation
  React.useEffect(() => {
    const checkPath = () => {
      setIsOnTransactionPage(isTransactionPage());
    };

    // Check on popstate (browser back/forward)
    window.addEventListener('popstate', checkPath);

    // Check periodically for SPA navigation
    const interval = setInterval(checkPath, 1000);

    return () => {
      window.removeEventListener('popstate', checkPath);
      clearInterval(interval);
    };
  }, []);

  const handleDownloadCSV = () => {
    try {
      // Scrape transaction data
      const transactions = scrapeTransactionTable();

      if (!transactions) {
        setMessage('テーブルが見つかりません');
        setTimeout(() => setMessage(''), 3000);
        return;
      }

      if (transactions.length === 0) {
        setMessage('データがありません');
        setTimeout(() => setMessage(''), 3000);
        return;
      }

      // Convert to CSV
      const csvContent = transactionsToCSV(transactions);

      // Download
      const filename = generateFilename();
      downloadCSV(csvContent, filename);

      setMessage(`${transactions.length}件のデータをダウンロードしました`);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('CSV download error:', error);
      setMessage('エラーが発生しました');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="mf-tools-container">
      <div className="bg-white rounded-lg shadow-lg p-4 border-2 border-indigo-500">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-gray-800">MF Tools</h3>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <button
          onClick={handleDownloadCSV}
          disabled={!isOnTransactionPage}
          className={`w-full text-sm font-medium py-2 px-4 rounded transition-colors ${
            isOnTransactionPage
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          title={
            isOnTransactionPage
              ? 'CSVファイルをダウンロード'
              : '入出金ページ (/cf) でのみ利用可能'
          }
        >
          CSV ダウンロード
        </button>
        {message && (
          <p className="text-xs text-gray-600 mt-2 text-center">{message}</p>
        )}
      </div>
    </div>
  );
}

// Initialize content script
function init() {
  // Create container for React app
  const container = document.createElement('div');
  container.id = 'mf-tools-root';
  document.body.appendChild(container);

  // Render React component
  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <ContentWidget />
    </React.StrictMode>
  );

  console.log('MoneyForward Web Tools content script loaded');
}

// Run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
