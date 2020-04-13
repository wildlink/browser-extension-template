import React, { FC } from 'react';
import CSS from 'csstype';

import { openTab } from '/helpers/browser/message';

const style: CSS.Properties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const logoStyle: CSS.Properties = {
  maxHeight: '120px',
  maxWidth: '360px',
  marginBottom: '16px',
  cursor: 'pointer',
};

const LOGO =
  'https://pngimage.net/wp-content/uploads/2018/06/generic-company-logo-png-2.png';

const Logo: FC = () => {
  const openHomepage = (): Promise<void> => openTab(`${process.env.FRONTEND}`);

  return (
    <div style={style}>
      <img src={LOGO} style={logoStyle} onClick={openHomepage} />
    </div>
  );
};

export default Logo;
