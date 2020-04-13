import React, { FC } from 'react';
import CSS from 'csstype';

import { WHITE, BUTTON_BLUE } from '/helpers/css';

const style: CSS.Properties = {
  backgroundColor: BUTTON_BLUE,
  color: WHITE,
  fontWeight: 'bold',
  padding: '16px',
  borderRadius: '5px',
  textAlign: 'center',
};

interface ButtonProps {
  onClick?: () => void;
}

const Button: FC<ButtonProps> = ({ children, onClick }) => {
  return (
    <div style={style} onClick={onClick ? onClick : undefined}>
      {children}
    </div>
  );
};

export default Button;
