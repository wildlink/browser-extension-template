import { ActiveDomain } from 'wildlink-js-client';

export const rememberedDomains: {
  [key: string]: string;
} = {};

export const parseActiveDomainMaxRate = (
  commissionRate: NonNullable<ActiveDomain['Merchant']['MaxRate']>,
): string => {
  const amount = parseFloat(commissionRate.Amount);
  if (isNaN(amount)) {
    return '';
  }

  if (commissionRate.Kind === 'PERCENTAGE') {
    return `${amount.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    })}%`;
  }

  if (commissionRate.Kind === 'FLAT') {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: commissionRate.Currency,
    });
  }

  return '';
};

export const rememberTabAndDomain = (
  domain: string,
  tabId: number | undefined,
): void => {
  // do nothing if tab ID is undefined
  if (!tabId) {
    return;
  }

  rememberedDomains[`${tabId}`] = domain;
};

export const removeRememberedTabAndDomain = (
  tabId: number | undefined,
): void => {
  // do nothing if tab ID is undefined
  if (!tabId) {
    return;
  }

  delete rememberedDomains[`${tabId}`];
};

export const isCashbackActivated = (domain: string): boolean => {
  return !!Object.values(rememberedDomains).find(
    (rememberedDomain) => rememberedDomain === domain,
  );
};
