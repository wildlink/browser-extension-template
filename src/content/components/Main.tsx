import React, { FC } from 'react';
import CSS from 'csstype';

import { CLOSE_HEIGHT_WIDTH } from '/content/components/Close';

const style: CSS.Properties = {
  display: 'flex',
  flex: 1,
  margin: `0 ${CLOSE_HEIGHT_WIDTH}px ${CLOSE_HEIGHT_WIDTH}px ${CLOSE_HEIGHT_WIDTH}px`,
};

const Main: FC = ({ children }) => {
  return <div style={style}>{children}</div>;
};

export default Main;
