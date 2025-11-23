// Background service worker for MoneyForward Web Tools

// Install event
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('MoneyForward Web Tools installed');
    // Set default values
    chrome.storage.local.set({ count: 0 });
  } else if (details.reason === 'update') {
    console.log('MoneyForward Web Tools updated');
  }
});

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message received:', message);

  if (message.type === 'GET_TAB_INFO') {
    sendResponse({
      tabId: sender.tab?.id,
      url: sender.tab?.url,
    });
  }

  return true; // Keep message channel open for async response
});

// Log when service worker starts
console.log('MoneyForward Web Tools background service worker started');
