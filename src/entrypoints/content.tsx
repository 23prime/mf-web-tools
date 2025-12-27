import React from 'react';
import ReactDOM from 'react-dom/client';
import { defineContentScript } from 'wxt/utils/define-content-script';
import { createShadowRootUi } from 'wxt/utils/content-script-ui/shadow-root';
import { scrapeTransactionTable } from '@/utils/scraper';
import { transactionsToCSV } from '@/utils/csv';
import { downloadCSV, generateFilename } from '@/utils/download';
import contentCssText from '@/styles/content.css?inline';

export default defineContentScript({
  matches: ['https://*.moneyforward.com/*'],

  async main(ctx) {
    const ui = await createShadowRootUi(ctx, {
      name: 'mf-tools-widget',
      position: 'inline',
      onMount: (container) => {
        // Inject CSS into Shadow DOM using style element
        const style = document.createElement('style');
        style.textContent = contentCssText;
        container.appendChild(style);

        // Create a wrapper div inside the shadow root
        const app = document.createElement('div');
        container.appendChild(app);

        // Create React root
        const root = ReactDOM.createRoot(app);
        root.render(
          <React.StrictMode>
            <ContentWidget />
          </React.StrictMode>
        );
        return root;
      },
      onRemove: (root) => {
        root?.unmount();
      },
    });

    ui.mount();
  },
});

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

      // Convert to CSV
      const csvContent = transactionsToCSV(transactions);

      // Download
      const filename = generateFilename();
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
