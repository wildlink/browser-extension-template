import React, { FC, useState, useEffect } from 'react';

import {
  ELIGIBLE,
  NOT_ELIGIBLE,
  ContentMessage,
} from '/helpers/browser/message';
import { EligibleDomain } from '/wildlink/helpers/domain';

import Loading from '/content/pages/Loading';
import Eligible from '/content/pages/Eligible';
import NotEligible from '/content/pages/NotEligible';
import Error from '/content/pages/Error';

const Router: FC = () => {
  const [isNotEligible, setIsNotEligible] = useState(false);
  const [eligibleDomain, setEligibleDomain] = useState<EligibleDomain>();
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    browser.runtime.onMessage.addListener((message: ContentMessage) => {
      switch (message.status) {
        case ELIGIBLE: {
          setEligibleDomain(message.payload);
          return;
        }

        case NOT_ELIGIBLE: {
          setIsNotEligible(true);
        }
      }
    });
  }, []);

  const showError = (): void => setHasError(true);

  if (hasError) {
    return <Error />;
  }

  if (eligibleDomain) {
    return <Eligible eligibleDomain={eligibleDomain} showError={showError} />;
  }

  if (isNotEligible) {
    return <NotEligible />;
  }

  return <Loading showError={showError} />;
};

export default Router;
