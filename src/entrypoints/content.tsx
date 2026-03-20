import React from 'react';
import ReactDOM from 'react-dom/client';
import { defineContentScript } from 'wxt/utils/define-content-script';
import { createShadowRootUi } from 'wxt/utils/content-script-ui/shadow-root';
import { ContentWidget } from '@/entrypoints/content/ContentWidget';
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
