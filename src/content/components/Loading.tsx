import React, { FC } from 'react';
import CSS from 'csstype';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';

const style: CSS.Properties = {
  display: 'flex',
  flex: 1,
};

const loadingStyle: CSS.Properties = {
  animation: 'spin 2s infinite linear',
  display: 'flex',
  flex: 1,
};

const Loading: FC = () => {
  const spinEffect = `
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }`;

  return (
    <div style={style}>
      <style>{spinEffect}</style>
      <FontAwesomeIcon style={loadingStyle} icon={faCircleNotch} />
    </div>
  );
};

export default Loading;
