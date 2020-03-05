import React, { FC } from 'react';
import CSS from 'csstype';

const style: CSS.Properties = {
  height: '40px',
  width: '40px',
  cursor: 'pointer',
  margin: '10px',
};

interface ShareOptionProps {
  src: string;
  onClick: () => void;
}

const ShareOption: FC<ShareOptionProps> = ({ src, onClick }) => {
  return <img style={style} src={src} onClick={onClick} />;
};

export default ShareOption;
