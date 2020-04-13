import React, { FC } from 'react';
import CSS from 'csstype';

const style: CSS.Properties = {
  display: 'flex',
  flex: 1,
  textAlign: 'center',
  justifyContent: 'center',
  alignItems: 'center',
};

const NotEligible: FC = () => {
  return (
    <div style={style}>
      This site is currently not
      <br />
      eligible for earning.
    </div>
  );
};

export default NotEligible;
