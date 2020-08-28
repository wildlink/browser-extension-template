import React from 'react';
import ReactDOM from 'react-dom';

import Extension from '/content/Extension';
import {
  DOCUMENT_IDLE,
  ExtensionMessage,
  ContentMessage,
  ContentResponseMessages,
  PING,
  PONG,
} from './helpers/browser/message';

const container = document.createElement('div');
const shadowRoot = container.attachShadow({ mode: 'open' });

// content script runs at "document_idle" and DOM is guaranteed ready (see manifest)
// https://developer.chrome.com/extensions/content_scripts#run_time
document.body.appendChild(container);
ReactDOM.render(React.createElement(Extension), shadowRoot);

// let background script know DOM is ready
browser.runtime.sendMessage({
  status: DOCUMENT_IDLE,
} as ExtensionMessage<typeof DOCUMENT_IDLE>);

// respond to pings from background script
browser.runtime.onMessage.addListener((message: ContentMessage):
  | Promise<ContentResponseMessages<typeof message.status>>
  | undefined => {
  if (message.status === PING) {
    return Promise.resolve({
      status: PONG,
      payload: undefined,
    });
  }
});
