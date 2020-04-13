import React, { FC } from 'react';
import CSS from 'csstype';

import { ExtensionMessage, RELOAD } from '/helpers/browser/message';

import Button from '/content/components/Button';

const style: CSS.Properties = {
  display: 'flex',
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  textAlign: 'center',
};

const textStyle: CSS.Properties = {
  marginBottom: '32px',
};

const buttonStyle: CSS.Properties = {
  cursor: 'pointer',
};

const Loading: FC = () => {
  const reload = async (): Promise<void> => {
    await browser.runtime.sendMessage({
      status: RELOAD,
    } as ExtensionMessage<typeof RELOAD>);
  };

  return (
    <div style={style}>
      <div style={textStyle}>
        Sorry, an error occurred.
        <br />
        Reloading the page may fix this.
      </div>
      <div style={buttonStyle} onClick={reload}>
        <Button>Reload</Button>
      </div>
    </div>
  );
};

export default Loading;
