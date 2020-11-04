import React, { FC, useState, useEffect } from 'react';
import { Vanity } from 'wildlink-js-client';
import CSS from 'csstype';

import { EligibleDomain } from '/wildlink/helpers/domain';
import {
  GENERATE_VANITY,
  ExtensionMessage,
  SUCCESS,
  BackgroundResponseMessage,
} from '/helpers/browser/message';

import Logo from '/content/components/Logo';
import Activate from '/content/components/Activate';
import Share from '/content/components/Share/Share';

const style: CSS.Properties = {
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  textAlign: 'center',
};

const contentStyle: CSS.Properties = {
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  justifyContent: 'space-evenly',
};

const orStyle: CSS.Properties = {
  margin: '8px 0',
};

interface EligibleProps {
  eligibleDomain: EligibleDomain;
  showError: () => void;
}

const Eligible: FC<EligibleProps> = ({ eligibleDomain, showError }) => {
  const [vanity, setVanity] = useState<Vanity>();

  const getVanity = async (): Promise<Vanity | undefined> => {
    if (vanity) {
      return vanity;
    }

    const response = (await browser.runtime.sendMessage({
      status: GENERATE_VANITY,
      payload: eligibleDomain,
    } as ExtensionMessage<typeof GENERATE_VANITY>)) as BackgroundResponseMessage<
      typeof GENERATE_VANITY
    >;

    if (response.status === SUCCESS) {
      const vanity = response.payload;
      setVanity(vanity);

      return vanity;
    } else {
      showError();
    }
  };

  // reset vanity if eligible domain original url changes and domain is different
  useEffect(() => {
    if (!eligibleDomain.isCashbackActivatedAlready) {
      setVanity(undefined);
    }
  }, [eligibleDomain]);

  return (
    <div style={style}>
      <Logo />
      <div style={contentStyle}>
        <Activate
          getVanity={getVanity}
          activeDomain={eligibleDomain.activeDomain}
          isCashbackActivatedAlready={eligibleDomain.isCashbackActivatedAlready}
          showError={showError}
        />
        <div style={orStyle}>or</div>
        <Share getVanity={getVanity} showError={showError} />
      </div>
    </div>
  );
};

export default Eligible;
