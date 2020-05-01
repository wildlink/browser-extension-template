import React from 'react';
import ReactDOM from 'react-dom';

import Extension from '/content/Extension';
import {
  DOM_CONTENT_LOADED,
  ExtensionMessage,
  ContentMessage,
  ContentResponseMessages,
  PING,
  PONG,
} from './helpers/browser/message';

const container = document.createElement('div');
const shadowRoot = container.attachShadow({ mode: 'open' });

// content script runs at "document_idle" and DOM is guaranteed ready (see manifest)
document.body.appendChild(container);
ReactDOM.render(React.createElement(Extension), shadowRoot);

// let background script know DOM is ready
browser.runtime.sendMessage({
  status: DOM_CONTENT_LOADED,
} as ExtensionMessage<typeof DOM_CONTENT_LOADED>);

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
