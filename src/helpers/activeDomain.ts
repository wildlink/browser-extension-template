import { ActiveDomain } from 'wildlink-js-client';

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
