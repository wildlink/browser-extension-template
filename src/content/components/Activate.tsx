import React, { FC, useState, useEffect } from 'react';
import { Vanity, ActiveDomain } from 'wildlink-js-client';
import getSymbolFromCurrency from 'currency-map-symbol';
import CSS from 'csstype';

import {
  ExtensionMessage,
  ACTIVATE_CASHBACK,
  SUCCESS,
  ERROR,
  BackgroundResponseMessage,
} from '/helpers/browser/message';

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
  getVanity: () => Promise<Vanity | undefined>;
  showError: () => void;
}

const Activate: FC<ActivateProps> = ({
  activeDomain,
  getVanity,
  showError,
}) => {
  const [rate, setRate] = useState<string>();
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const { MaxRate } = activeDomain.Merchant;
    if (MaxRate) {
      if (MaxRate.Kind === 'PERCENTAGE') {
        setRate(`${MaxRate.Amount}%`);
      } else if (MaxRate.Kind === 'FLAT') {
        const currencySymbol: string | undefined = getSymbolFromCurrency(
          MaxRate.Currency,
        );
        const flatRate = currencySymbol
          ? `${currencySymbol}${MaxRate.Amount}`
          : `${MaxRate.Amount} ${MaxRate.Currency}`;
        setRate(flatRate);
      }
    }
  }, [activeDomain]);

  const activate = async (): Promise<void> => {
    setIsLoading(true);
    const vanity = await getVanity();
    if (vanity) {
      const { status } = (await browser.runtime.sendMessage({
        status: ACTIVATE_CASHBACK,
        payload: {
          url: vanity.VanityURL,
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
