import React, { FC } from 'react';
import CSS from 'csstype';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

export const CLOSE_HEIGHT_WIDTH = 20;

const style: CSS.Properties = {
  display: 'flex',
  justifyContent: 'flex-end',
};

const iconStyle: CSS.Properties = {
  height: `${CLOSE_HEIGHT_WIDTH}px`,
  width: `${CLOSE_HEIGHT_WIDTH}px`,
  cursor: 'pointer',
};

interface CloseProps {
  closeExtension: () => void;
}

const Close: FC<CloseProps> = ({ closeExtension }) => {
  return (
    <div style={style}>
      <FontAwesomeIcon
        style={iconStyle}
        icon={faTimes}
        onClick={closeExtension}
      />
    </div>
  );
};

export default Close;
