import { ActiveDomain } from 'wildlink-js-client';

interface CashBackActivatedHistory {
  [tabId: number]: string;
}

// Map to remember the last activated domain for tab
const cashbackActivatedHistory: CashBackActivatedHistory = {};

export const parseActiveDomainMaxRate = (
  commissionRate: NonNullable<ActiveDomain['Merchant']['MaxRate']>,
): string => {
  const amount = parseFloat(commissionRate.Amount);
  if (isNaN(amount)) {
    return '';
  }

  if (commissionRate.Kind === 'PERCENTAGE') {
    return `${amount.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    })}%`;
  }

  if (commissionRate.Kind === 'FLAT') {
    return amount.toLocaleString(undefined, {
      style: 'currency',
      currency: commissionRate.Currency,
    });
  }

  return '';
};

export const storeCashbackActivatedDomain = (
  domain: string,
  tabId: number | undefined,
): void => {
  // do nothing if tab ID is undefined
  if (!tabId) {
    return;
  }
  cashbackActivatedHistory[tabId] = domain;
};

export const deleteCashbackActivatedDomain = (
  tabId: number | undefined,
): void => {
  // do nothing if tab ID is undefined
  if (!tabId) {
    return;
  }
  delete cashbackActivatedHistory[tabId];
};

export const isCashbackActivated = (domain: string): boolean => {
  return Object.values(cashbackActivatedHistory).some((d) => d === domain);
};
