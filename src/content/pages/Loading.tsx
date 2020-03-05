import React, { FC, useEffect } from 'react';
import CSS from 'csstype';

import LoadingComponent from '/content/components/Loading';

const style: CSS.Properties = {
  display: 'flex',
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
};

const containerStyle: CSS.Properties = {
  height: '64px',
  width: '64px',
  marginBottom: '16px',
};

interface LoadingProps {
  showError: () => void;
}

const Loading: FC<LoadingProps> = ({ showError }) => {
  useEffect(() => {
    const timeoutId = setTimeout(showError, 10000);
    return (): void => clearTimeout(timeoutId);
  }, [showError]);

  return (
    <div style={style}>
      <div style={containerStyle}>
        <LoadingComponent />
      </div>
      <div>Loading...</div>
    </div>
  );
};

export default Loading;
