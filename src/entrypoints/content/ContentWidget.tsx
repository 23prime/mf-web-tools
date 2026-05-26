import React from 'react';
import { scrapeTransactionTable } from '@/utils/scraper';
import { transactionsToCSV } from '@/utils/csv';
import { downloadCSV, generateFilename } from '@/utils/download';

// Check if current path is exactly /cf
function isTransactionPage(): boolean {
  return window.location.pathname === '/cf';
}

// Content Script component
export function ContentWidget() {
  const [isVisible, setIsVisible] = React.useState(true);
  const [message, setMessage] = React.useState('');
  const [isOnTransactionPage, setIsOnTransactionPage] =
    React.useState(isTransactionPage());
  const messageTimeoutRef = React.useRef<number | null>(null);

  // Helper to set message with auto-clear
  const showMessage = (msg: string, duration = 3000) => {
    // Clear any existing timeout
    if (messageTimeoutRef.current !== null) {
      window.clearTimeout(messageTimeoutRef.current);
    }
    setMessage(msg);
    messageTimeoutRef.current = window.setTimeout(() => {
      setMessage('');
      messageTimeoutRef.current = null;
    }, duration);
  };

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

  // Cleanup message timeout on unmount
  React.useEffect(() => {
    return () => {
      if (messageTimeoutRef.current !== null) {
        window.clearTimeout(messageTimeoutRef.current);
      }
    };
  }, []);

  const handleDownloadCSV = () => {
    try {
      // Scrape transaction data
      const transactions = scrapeTransactionTable();

      if (!transactions) {
        showMessage('テーブルが見つかりません');
        return;
      }

      if (transactions.length === 0) {
        showMessage('データがありません');
        return;
      }

      // Sort by date ascending
      const sorted = [...transactions].sort((a, b) =>
        a.date.localeCompare(b.date)
      );

      // Convert to CSV
      const csvContent = transactionsToCSV(sorted);

      // Download
      const filename = generateFilename(sorted[0].date);
      downloadCSV(csvContent, filename);

      showMessage(`${transactions.length}件のデータをダウンロードしました`);
    } catch (error) {
      console.error('CSV download error:', error);
      showMessage('エラーが発生しました');
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
