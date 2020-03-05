import React from 'react';
import ReactDOM from 'react-dom';

import Extension from '/content/Extension';

const container = document.createElement('div');
const shadowRoot = container.attachShadow({ mode: 'open' });

document.addEventListener('DOMContentLoaded', () => {
  document.body.appendChild(container);

  // @ts-ignore: rendering to a ShadowRoot is not in the type definition but possible
  ReactDOM.render(React.createElement(Extension), shadowRoot);
});
