import React, { FC, useState, useEffect } from 'react';
import { Vanity, ActiveDomain } from 'wildlink-js-client';
import CSS from 'csstype';

import {
  ExtensionMessage,
  ACTIVATE_CASHBACK,
  SUCCESS,
  ERROR,
  BackgroundResponseMessage,
} from '/helpers/browser/message';
import { parseActiveDomainMaxRate } from '/helpers/activeDomain';

import Button from './Button';

const style: CSS.Properties = {
  fontWeight: 'bold',
  fontSize: '20px',
};

const activateButtonStyle: CSS.Properties = {
  cursor: 'pointer',
};

interface ActivateProps {
  activeDomain: ActiveDomain;
  isCashbackActivatedAlready: boolean;
  getVanity: () => Promise<Vanity | undefined>;
  showError: () => void;
}

const Activate: FC<ActivateProps> = ({
  activeDomain,
  isCashbackActivatedAlready,
  getVanity,
  showError,
}) => {
  const [rate, setRate] = useState<string>();
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const { MaxRate } = activeDomain.Merchant;
    if (MaxRate) {
      setRate(parseActiveDomainMaxRate(MaxRate));
    }
  }, [activeDomain]);

  useEffect(() => {
    // set isActive automatically if domain is the the same with the last stored domain
    if (isCashbackActivatedAlready && !isActive) {
      setIsActive(true);
    }
  }, [activeDomain.Domain, isCashbackActivatedAlready, isActive]);

  const activate = async (): Promise<void> => {
    setIsLoading(true);
    const vanity = await getVanity();
    if (vanity) {
      const { status } = (await browser.runtime.sendMessage({
        status: ACTIVATE_CASHBACK,
        payload: {
          url: vanity.VanityURL,
          domain: activeDomain.Domain,
        },
      } as ExtensionMessage<typeof ACTIVATE_CASHBACK>)) as BackgroundResponseMessage<
        typeof ACTIVATE_CASHBACK
      >;

      if (status === SUCCESS) {
        setIsActive(true);
        setIsLoading(false);
      } else if (status === ERROR) {
        showError();
      }
    }
  };

  const canActivate = !isLoading && !isActive;

  return (
    <div style={canActivate ? { ...style, ...activateButtonStyle } : style}>
      <Button onClick={canActivate ? activate : undefined}>
        {isLoading
          ? 'Loading...'
          : isActive
          ? 'Cashback Activated'
          : `Activate${rate ? ` up to ${rate} ` : ' '}Cashback`}
      </Button>
    </div>
  );
};

export default Activate;
