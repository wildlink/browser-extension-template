import React, { FC, useState, useEffect, useCallback } from 'react';
import CSS from 'csstype';

import {
  ContentDisplayMessage,
  SHOW_CONTENT,
  TOGGLE_CONTENT,
} from '/helpers/browser/message';
import { WHITE, BLACK } from '/helpers/css';

import Close from '/content/components/Close';
import Main from '/content/components/Main';
import Router from '/content/components/Router';

const hideStyle: CSS.Properties = {
  display: 'none',
};

const showStyle: CSS.Properties = {
  display: 'initial',
};

const containerStyle: CSS.Properties = {
  // reset styles that the shadow dom can inherit
  all: 'initial',
  backgroundColor: WHITE,
  borderRadius: '3px',
  boxShadow: '0 0 8px rgba(0, 0, 0, 0.4)',
  margin: '16px',
  position: 'fixed',
  right: '0',
  top: '0',
  zIndex: 2147483647,
  padding: '8px',
  height: '400px',
  width: '400px',
  color: BLACK,
  display: 'flex',
  fontFamily: 'arial',
  flex: 1,
  flexDirection: 'column',
};

const Extension: FC = () => {
  const [show, setShow] = useState(false);

  const handleDisplayMessage = useCallback((message: ContentDisplayMessage) => {
    if (message.status === SHOW_CONTENT) {
      setShow(true);
    }
    if (message.status === TOGGLE_CONTENT) {
      setShow((previousShow) => !previousShow);
    }
  }, []);

  useEffect(() => {
    browser.runtime.onMessage.addListener(handleDisplayMessage);
    return (): void =>
      browser.runtime.onMessage.removeListener(handleDisplayMessage);
  }, [handleDisplayMessage]);

  const closeExtension = (): void => setShow(false);

  return (
    <div style={show ? showStyle : hideStyle}>
      <div style={containerStyle}>
        <Close closeExtension={closeExtension} />
        <Main>
          <Router />
        </Main>
      </div>
    </div>
  );
};

export default Extension;
