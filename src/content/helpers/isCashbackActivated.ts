import { ActiveDomain } from 'wildlink-js-client';
import { IS_CASHBACK_ACTIVATED } from '/helpers/browser/message';

export const isCashbackActivated = async (
  domain: ActiveDomain,
): Promise<boolean> => {
  const message = {
    status: IS_CASHBACK_ACTIVATED,
    payload: domain,
  };
  return await browser.runtime.sendMessage(message);
};
